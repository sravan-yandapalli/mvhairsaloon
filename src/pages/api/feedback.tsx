import { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const FEEDBACK_TABLE = "studio_feedbacks";
const VIEW_TABLE = "studio_feedback_views";
const PAGE_ID = "feedback_page_1";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, comment, rating } = req.body;

    if (!name || !comment || !rating) {
      return res.status(400).json({ message: "Missing fields" });
    }

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

    try {
      await client.send(putCommand);

      // Return the newly created feedback item in response
      res.status(200).json({
        id,
        name,
        comment,
        rating: Number(rating),
        timestamp: Number(id),
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ message: "Error saving feedback", error });
    }
  } else if (req.method === "GET") {
    try {

await client.send(
  new UpdateItemCommand({
    TableName: VIEW_TABLE,
    Key: { pageId: { S: PAGE_ID } },
    UpdateExpression: "ADD #views :incr",
    ExpressionAttributeNames: {
      "#views": "views"
    },
    ExpressionAttributeValues: {
      ":incr": { N: "1" }
    }
  })
);


      // Fetch current view count
      const viewData = await client.send(
        new GetItemCommand({
          TableName: VIEW_TABLE,
          Key: { pageId: { S: PAGE_ID } },
        })
      );
      const viewCount = parseInt(viewData?.Item?.views?.N || "0");

      // Fetch all feedbacks
      const feedbackData = await client.send(new ScanCommand({ TableName: FEEDBACK_TABLE }));

      const items = (feedbackData.Items || []).map((item) => ({
        id: item.id.S,
        name: item.name.S,
        comment: item.comment.S,
        rating: parseInt(item.rating.N || "0"),
        timestamp: parseInt(item.timestamp?.N || "0"),
      }));

      // Sort feedbacks by rating desc, then timestamp desc
      const sorted = items.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.timestamp - a.timestamp;
      });

      res.status(200).json({
        totalFeedbacks: items.length,
        viewCount,
        topReview: sorted[0] || null,
        feedbacks: sorted,
      });
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      res.status(500).json({ message: "Error fetching feedbacks", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
