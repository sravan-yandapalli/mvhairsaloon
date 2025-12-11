// src/pages/api/media.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export const config = { api: { bodyParser: false } };

// Use server-only env vars (do not expose these)
const REGION = process.env.AWS_REGION ?? '';
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID ?? '';
const SECRET = process.env.AWS_SECRET_ACCESS_KEY ?? '';
const BUCKET = process.env.AWS_S3_BUCKET_NAME ?? '';
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '';

if (!REGION || !ACCESS_KEY || !SECRET || !BUCKET) {
  console.warn('Missing AWS env vars for S3 (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME).');
}

const s3 = new S3Client({
  region: REGION,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET },
});

// List objects under prefix uploads/
async function listObjects(): Promise<string[]> {
  const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: 'uploads/' }));
  const urls = (list.Contents || []).map((obj) => `https://${BUCKET}.s3.${REGION}.amazonaws.com/${obj.Key}`);
  return urls;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const urls = await listObjects();
      return res.status(200).json({ urls });
    } catch (err) {
      console.error('List error', err);
      return res.status(500).json({ error: 'List failed' });
    }
  }

  // Require admin for POST and DELETE
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    try {
      const { files } = await new Promise<{ files: Files }>((resolve, reject) => {
        form.parse(req, (err, _fields, parsedFiles) => {
          if (err) reject(err);
          else resolve({ files: parsedFiles });
        });
      });

      // The client uses input name 'files' so parsedFiles.files might exist
      const filesArrayCandidate = (files as any).files ?? files;
      // Normalize to array of FormidableFile
      let uploadedFiles: FormidableFile[] = [];

      if (Array.isArray(filesArrayCandidate)) {
        uploadedFiles = filesArrayCandidate as FormidableFile[];
      } else if (typeof filesArrayCandidate === 'object' && filesArrayCandidate !== null && 'filepath' in filesArrayCandidate) {
        uploadedFiles = [filesArrayCandidate as FormidableFile];
      } else {
        // handle arbitrary form field names
        const flattened: FormidableFile[] = [];
        for (const key of Object.keys(files)) {
          const val = (files as any)[key];
          if (Array.isArray(val)) flattened.push(...(val as FormidableFile[]));
          else if (val && typeof val === 'object' && 'filepath' in val) flattened.push(val as FormidableFile);
        }
        uploadedFiles = flattened;
      }

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const urls: string[] = [];

      for (const file of uploadedFiles) {
        const fileContent = fs.readFileSync(file.filepath);
        const extension = path.extname(file.originalFilename || '') || '';
        const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`;

        await s3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: fileContent,
          ContentType: (file.mimetype as string) || 'application/octet-stream',
          ACL: 'public-read',
        }));

        // remove temp file
        try { fs.unlinkSync(file.filepath); } catch (unlinkErr) { console.warn('Failed to unlink temp file', unlinkErr); }

        urls.push(`https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`);
      }

      // return the newly uploaded urls (client also re-fetches canonical list)
      return res.status(200).json({ urls });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  if (req.method === 'DELETE') {
    const keyFromQuery = typeof req.query.key === 'string' ? req.query.key : undefined;
    const urlFromQuery = typeof req.query.url === 'string' ? req.query.url : undefined;
    let key = keyFromQuery;

    if (!key && urlFromQuery) {
      const parts = urlFromQuery.split('.amazonaws.com/');
      key = parts[1];
    }

    if (!key) {
      return res.status(400).json({ error: 'Missing key or url' });
    }

    try {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Delete failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
