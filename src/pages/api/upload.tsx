import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Files, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`) {
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

      const uploadedFiles = Array.isArray(data.files.files)
        ? data.files.files
        : [data.files.files];

      const validFiles = uploadedFiles.filter((file): file is File => !!file);

      const urls = await Promise.all(
        validFiles.map(async (file) => {
          const fileContent = fs.readFileSync(file.filepath);
          const extension = path.extname(file.originalFilename || '');
          const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`;

          await s3.send(new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: fileContent,
            ContentType: file.mimetype || undefined,
          }));

          fs.unlinkSync(file.filepath);

          return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
        })
      );

      return res.status(200).json({ urls });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  if (req.method === 'DELETE') {
    const key = req.query.key as string;
    if (!key) return res.status(400).json({ error: 'Missing key' });

    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: key,
      }));
      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Delete failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
