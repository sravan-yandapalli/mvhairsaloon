import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: "ap-south-1", // or your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const TABLE_NAME = "Feedbacks"; // make sure this table exists in DynamoDB

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name, comment, rating } = req.body;

        const command = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                id: { S: Date.now().toString() },
                name: { S: name },
                comment: { S: comment },
                rating: { N: rating.toString() },
            },
        });

        try {
            await client.send(command);
            res.status(200).json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ message: "Error saving feedback", error });
        }
    } else if (req.method === "GET") {
        const command = new ScanCommand({ TableName: TABLE_NAME });

        try {
            const data = await client.send(command);
            const items = (data.Items || []).map((item) => ({
                name: item.name.S,
                comment: item.comment.S,
                rating: parseInt(item.rating.N || "0"),
            }));
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: "Error fetching feedback", error });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
