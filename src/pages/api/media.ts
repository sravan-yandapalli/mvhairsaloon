// src/pages/api/media.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile, Files } from "formidable";
import fs from "fs";
import path from "path";
import type { IncomingMessage } from "http";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export const config = { api: { bodyParser: false } };

// ENV: prefer server-only names, fallback to NEXT_PUBLIC (build-time)
const REGION =
  process.env.SERVER_AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || "";
const ACCESS_KEY =
  process.env.SERVER_AWS_ACCESS_KEY_ID ||
  process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
  "";
const SECRET =
  process.env.SERVER_AWS_SECRET_ACCESS_KEY ||
  process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
  "";
const BUCKET =
  process.env.S3_BUCKET_NAME ||
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME ||
  "";
const ADMIN_SECRET =
  process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

// Lazy S3 client creation helper
function createS3Client(): S3Client {
  if (!REGION) throw new Error("Missing S3 region (SERVER_AWS_REGION)");
  if (!ACCESS_KEY || !SECRET) throw new Error("Missing S3 credentials (SERVER_AWS_ACCESS_KEY_ID / SERVER_AWS_SECRET_ACCESS_KEY)");
  return new S3Client({
    region: REGION,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET },
  });
}

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

async function listObjects(s3: S3Client): Promise<string[]> {
  const result = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "uploads/" })
  );
  return (result.Contents || []).map(
    (obj) => `https://${BUCKET}.s3.${REGION}.amazonaws.com/${obj.Key}`
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("ENV CHECK media:", {
    REGION: REGION || "MISSING",
    ACCESS_KEY: ACCESS_KEY ? "OK" : "MISSING",
    SECRET: SECRET ? "OK" : "MISSING",
    BUCKET: BUCKET || "MISSING",
    ADMIN_SECRET: ADMIN_SECRET ? "OK" : "MISSING",
    method: req.method,
  });

  // GET
  if (req.method === "GET") {
    try {
      if (!BUCKET) throw new Error("Missing S3 bucket name (S3_BUCKET_NAME)");
      const s3 = createS3Client();
      const urls = await listObjects(s3);
      return res.status(200).json({ urls });
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("GET /api/media failed:", msg);
      return res.status(500).json({ error: "List failed", details: msg });
    }
  }

  // require admin for POST/DELETE
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const form = formidable({ multiples: true });
    try {
      if (!BUCKET) throw new Error("Missing S3 bucket name (S3_BUCKET_NAME)");
      const s3 = createS3Client();

      const { files } = await new Promise<{ files: Files }>((resolve, reject) => {
        form.parse(req as unknown as IncomingMessage, (err, _fields, parsedFiles) => {
          if (err) reject(err);
          else resolve({ files: parsedFiles });
        });
      });

      // normalize files
      let uploadList: FormidableFile[] = [];
      if ("files" in files) {
        const f = files["files"];
        if (f) uploadList = Array.isArray(f) ? f : [f];
      } else {
        for (const key of Object.keys(files)) {
          const value = files[key];
          if (!value) continue;
          uploadList.push(...(Array.isArray(value) ? value : [value]));
        }
      }

      if (uploadList.length === 0) return res.status(400).json({ error: "No files uploaded" });

      const urls: string[] = [];
      for (const file of uploadList) {
        const filePath = (file as unknown as { filepath?: string }).filepath ?? (file as unknown as { path?: string }).path;
        if (!filePath || !fs.existsSync(filePath)) return res.status(500).json({ error: "Temp file missing" });

        const extension = path.extname(file.originalFilename || "");
        const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
        const fileStream = fs.createReadStream(filePath);

        try {
          await s3.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: fileStream,
            ContentType: file.mimetype || "application/octet-stream",
          }));
        } catch (uploadErr) {
          const um = extractErrorMessage(uploadErr);
          console.error("S3 upload error:", um);
          try { fileStream.destroy(); } catch {}
          return res.status(500).json({ error: "S3 upload failed", details: um });
        }

        try { fs.unlinkSync(filePath); } catch {}
        urls.push(`https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`);
      }

      return res.status(200).json({ urls });
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("POST /api/media failed:", msg);
      return res.status(500).json({ error: "Upload failed", details: msg });
    }
  }

  if (req.method === "DELETE") {
    try {
      if (!BUCKET) throw new Error("Missing S3 bucket name (S3_BUCKET_NAME)");
      const s3 = createS3Client();

      const keyFromQuery = typeof req.query.key === "string" ? req.query.key : undefined;
      const urlFromQuery = typeof req.query.url === "string" ? req.query.url : undefined;
      let key = keyFromQuery;
      if (!key && urlFromQuery) {
        const parts = urlFromQuery.split(".amazonaws.com/");
        key = parts[1];
      }
      if (!key) return res.status(400).json({ error: "Missing key or url" });

      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("DELETE /api/media failed:", msg);
      return res.status(500).json({ error: "Delete failed", details: msg });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
