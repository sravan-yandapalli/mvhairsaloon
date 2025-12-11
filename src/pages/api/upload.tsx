// pages/api/media.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Files, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export const config = { api: { bodyParser: false } };

// Server-side env vars (DO NOT prefix with NEXT_PUBLIC_)
const REGION = process.env.AWS_REGION!;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID!;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY!;
const BUCKET = process.env.AWS_S3_BUCKET_NAME!;
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || process.env.ADMIN_SECRET || ''; // quick compatibility

if (!REGION || !ACCESS_KEY || !SECRET || !BUCKET) {
  console.warn('Missing required AWS env vars');
}

const s3 = new S3Client({
  region: REGION,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET },
});

async function listObjects() {
  const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: 'uploads/' }));
  const urls = (list.Contents || []).map((obj) => `https://${BUCKET}.s3.${REGION}.amazonaws.com/${obj.Key}`);
  return urls;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: list media (public listing)
  if (req.method === 'GET') {
    try {
      const urls = await listObjects();
      return res.status(200).json({ urls });
    } catch (err) {
      console.error('List error', err);
      return res.status(500).json({ error: 'List failed' });
    }
  }

  // For POST/DELETE require admin token
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const form = new IncomingForm({ multiples: true });

    try {
      const data = await new Promise<{ files: Files }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ files });
        });
      });

      // support input name 'files'
      const uploadedFiles = Array.isArray((data.files as any).files) ? (data.files as any).files : [(data.files as any).files];
      const validFiles = uploadedFiles.filter((file): file is File => !!file);

      const urls = await Promise.all(validFiles.map(async (file) => {
        const fileContent = fs.readFileSync(file.filepath);
        const extension = path.extname(file.originalFilename || '') || '';
        const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`;

        await s3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: fileContent,
          ContentType: file.mimetype || 'application/octet-stream',
          ACL: 'public-read', // public access so clients can view directly
        }));

        try { fs.unlinkSync(file.filepath); } catch (e) { /* ignore */ }

        return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      }));

      // Return uploaded urls (client still re-fetches canonical listing)
      return res.status(200).json({ urls });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  if (req.method === 'DELETE') {
    let key = req.query.key as string | undefined;
    const url = req.query.url as string | undefined;

    if (!key && url) {
      const split = url.split('.amazonaws.com/');
      key = split[1] || undefined;
    }

    if (!key) return res.status(400).json({ error: 'Missing key' });

    try {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Delete failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
