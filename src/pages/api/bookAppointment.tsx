import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const TABLE_NAME = 'studio_appointments';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { name, email, phone, reason, date, timeSlot, appointmentDateTime } = req.body;

  if (!name || !email || !phone || !reason || !date || !timeSlot || !appointmentDateTime) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const appointment = {
    id: uuidv4(),
    name,
    email,
    phone,
    reason,
    date,
    timeSlot,
    appointmentDateTime,
    createdAt: new Date().toISOString(),
  };

  try {
    // Store in DynamoDB
    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: appointment,
    }).promise();

    // Send confirmation email
    await transporter.sendMail({
      from: `"ZOYA Homeo Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmation",
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>Your appointment has been successfully booked.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>We look forward to seeing you!</p>
      `,
    });

    return res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
