// src/pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

// ENV: prefer server names, fallback to NEXT_PUBLIC
const REGION =
  process.env.SERVER_AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";
const ACCESS_KEY =
  process.env.SERVER_AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "";
const SECRET =
  process.env.SERVER_AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "";

const FEEDBACK_TABLE = "studio_feedbacks";
const VIEW_TABLE = "studio_feedback_views";
const PAGE_ID = "feedback_page_1";

function createDynamoClient(): DynamoDBClient {
  if (!REGION) throw new Error("Missing DynamoDB region");
  if (!ACCESS_KEY || !SECRET) throw new Error("Missing DynamoDB credentials");
  return new DynamoDBClient({
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // small debug log:
  console.log("ENV CHECK feedback:", {
    REGION: REGION || "MISSING",
    ACCESS_KEY: ACCESS_KEY ? "OK" : "MISSING",
    SECRET: SECRET ? "OK" : "MISSING",
    method: req.method,
  });

  try {
    const client = createDynamoClient();

    if (req.method === "POST") {
      const { name, comment, rating } = req.body;
      if (!name || !comment || !rating) return res.status(400).json({ message: "Missing fields" });

      const id = Date.now().toString();
      const putCommand = new PutItemCommand({
        TableName: FEEDBACK_TABLE,
        Item: {
          id: { S: id },
          name: { S: name },
          comment: { S: comment },
          rating: { N: rating.toString() },
          timestamp: { N: id },
        },
      });

      await client.send(putCommand);
      return res.status(200).json({ id, name, comment, rating: Number(rating), timestamp: Number(id) });
    }

    if (req.method === "GET") {
      // increment views
      await client.send(new UpdateItemCommand({
        TableName: VIEW_TABLE,
        Key: { pageId: { S: PAGE_ID } },
        UpdateExpression: "ADD #views :incr",
        ExpressionAttributeNames: { "#views": "views" },
        ExpressionAttributeValues: { ":incr": { N: "1" } },
      }));

      const viewData = await client.send(new GetItemCommand({
        TableName: VIEW_TABLE,
        Key: { pageId: { S: PAGE_ID } },
      }));
      const viewCount = parseInt(viewData?.Item?.views?.N || "0");

      const feedbackData = await client.send(new ScanCommand({ TableName: FEEDBACK_TABLE }));
      const items = (feedbackData.Items || []).map((item) => ({
        id: item.id.S,
        name: item.name.S,
        comment: item.comment.S,
        rating: parseInt(item.rating.N || "0"),
        timestamp: parseInt(item.timestamp?.N || "0"),
      }));

      const sorted = items.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.timestamp - a.timestamp;
      });

      return res.status(200).json({
        totalFeedbacks: items.length,
        viewCount,
        topReview: sorted[0] || null,
        feedbacks: sorted,
      });
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("feedback handler error:", extractErrorMessage(err));
    return res.status(500).json({ message: "Error", error: extractErrorMessage(err) });
  }
}
