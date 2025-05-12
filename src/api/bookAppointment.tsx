import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import nodemailer from "nodemailer";

// AWS config
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "appointments";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (email: string, appointment: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Appointment Confirmation",
    text: `Hi ${appointment.name},\n\nYour appointment has been booked:\n\nDate: ${appointment.date}\nTime: ${appointment.time}\nReason: ${appointment.reason}\n\nThank you,\nMV Hair Studio`,
  };
  await transporter.sendMail(mailOptions);
};

const sendWhatsApp = async (phone: string, appointment: any) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/your-phone-number-id/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: `Hi ${appointment.name}, your appointment at MV Hair Studio is confirmed for ${appointment.date} at ${appointment.time}.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("WhatsApp error:", err);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { name, email, phone, reason, date, time } = req.body;

  if (!name || !email || !phone || !reason || !date || !time)
    return res.status(400).json({ message: "All fields are required." });

  const appointment = {
    id: uuidv4(),
    name,
    email,
    phone,
    reason,
    date,
    time,
    createdAt: new Date().toISOString(),
  };

  try {
    await dynamoDB.put({ TableName: TABLE_NAME, Item: appointment }).promise();
    await sendConfirmationEmail(email, appointment);
    await sendWhatsApp(phone, appointment);
    res.status(200).json({ message: "Success", appointment });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
