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

// -----------------------------------------------------------------------------
// ENV VARIABLES — SERVER FIRST → FALLBACK TO NEXT_PUBLIC (BUILD TIME)
// -----------------------------------------------------------------------------
const REGION =
  process.env.SERVER_AWS_REGION ||
  process.env.NEXT_PUBLIC_AWS_REGION ||
  "";

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
  process.env.ADMIN_SECRET ||
  process.env.NEXT_PUBLIC_ADMIN_SECRET ||
  "";

// -----------------------------------------------------------------------------
// S3 Client
// -----------------------------------------------------------------------------
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET,
  },
});

// Helper to extract readable error
function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

// -----------------------------------------------------------------------------
// List Objects
// -----------------------------------------------------------------------------
async function listObjects(): Promise<string[]> {
  if (!BUCKET) throw new Error("Missing S3 bucket name in environment");

  const result = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "uploads/" })
  );

  return (result.Contents || []).map(
    (obj) => `https://${BUCKET}.s3.${REGION}.amazonaws.com/${obj.Key}`
  );
}

// -----------------------------------------------------------------------------
// API Handler
// -----------------------------------------------------------------------------
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ENV LOG (CHECK AMPLIFY LOGS)
  console.log("ENV CHECK:", {
    REGION,
    ACCESS_KEY: ACCESS_KEY ? "OK" : "MISSING",
    SECRET: SECRET ? "OK" : "MISSING",
    BUCKET,
    ADMIN_SECRET: ADMIN_SECRET ? "OK" : "MISSING",
    method: req.method,
  });

  // ---------------------------------------------------------------------------
  // GET — Fetch media list
  // ---------------------------------------------------------------------------
  if (req.method === "GET") {
    try {
      const urls = await listObjects();
      return res.status(200).json({ urls });
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("GET ERROR:", msg);
      return res.status(500).json({ error: "List failed", details: msg });
    }
  }

  // ---------------------------------------------------------------------------
  // AUTH CHECK for POST & DELETE
  // ---------------------------------------------------------------------------
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // ---------------------------------------------------------------------------
  // POST — Upload files
  // ---------------------------------------------------------------------------
  if (req.method === "POST") {
    const form = formidable({ multiples: true });

    try {
      const { files } = await new Promise<{ files: Files }>((resolve, reject) => {
        form.parse(
          req as unknown as IncomingMessage,
          (err, _fields, parsedFiles) => {
            if (err) reject(err);
            else resolve({ files: parsedFiles });
          }
        );
      });

      // Normalize file list
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

      if (uploadList.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const urls: string[] = [];

      for (const file of uploadList) {
        const filePath =
          (file as unknown as { filepath?: string }).filepath ??
          (file as unknown as { path?: string }).path;

        if (!filePath || !fs.existsSync(filePath)) {
          return res.status(500).json({ error: "Temp file missing" });
        }

        const extension = path.extname(file.originalFilename || "");
        const key = `uploads/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}${extension}`;

        const fileStream = fs.createReadStream(filePath);

        try {
          await s3.send(
            new PutObjectCommand({
              Bucket: BUCKET,
              Key: key,
              Body: fileStream,
              ContentType: file.mimetype || "application/octet-stream",
            })
          );
        } catch (err) {
          const msg = extractErrorMessage(err);
          console.error("UPLOAD ERROR:", msg);
          return res
            .status(500)
            .json({ error: "S3 upload failed", details: msg });
        }

        // Clean temp file
        try {
          fs.unlinkSync(filePath);
        } catch {}

        urls.push(`https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`);
      }

      return res.status(200).json({ urls });
    } catch (err) {
      const msg = extractErrorMessage(err);
      return res.status(500).json({ error: "Upload failed", details: msg });
    }
  }

  // ---------------------------------------------------------------------------
  // DELETE — Remove one file
  // ---------------------------------------------------------------------------
  if (req.method === "DELETE") {
    const key =
      typeof req.query.key === "string"
        ? req.query.key
        : typeof req.query.url === "string"
        ? req.query.url.split(".amazonaws.com/")[1]
        : undefined;

    if (!key) {
      return res.status(400).json({ error: "Missing key or url" });
    }

    try {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      const msg = extractErrorMessage(err);
      return res.status(500).json({ error: "Delete failed", details: msg });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
