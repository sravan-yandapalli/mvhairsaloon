import type { NextApiRequest, NextApiResponse } from "next";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const ddbDocClient = DynamoDBDocumentClient.from(dynamoClient);

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!;

type UploadRequestBody = {
  title: string;
  description: string;
  fileName: string;
  fileType: string; // mime type
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { title, description, fileName, fileType } = req.body as UploadRequestBody;

      if (!title || !fileName || !fileType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate unique file key for S3
      const fileKey = `blogs/${uuidv4()}-${fileName}`;

      // Generate presigned URL for upload
      const params: PutObjectCommandInput = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType,
        ACL: "public-read",
      };

      // Using getSignedUrl from @aws-sdk/s3-request-presigner
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
      const command = new PutObjectCommand(params);
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour expiry

      // URL for accessing file after upload
      const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      // Save metadata to DynamoDB (including fileUrl)
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            id: uuidv4(),
            title,
            description,
            fileUrl,
            createdAt: new Date().toISOString(),
          },
        })
      );

      res.status(200).json({ uploadUrl, fileUrl });
    } catch (error) {
      console.error("Upload error", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
