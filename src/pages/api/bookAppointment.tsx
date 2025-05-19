import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// ✅ ENV Check
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ EMAIL_USER or EMAIL_PASS is not defined in environment variables.');
}

if (
  !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
  !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
  !process.env.NEXT_PUBLIC_AWS_REGION
) {
  console.error('❌ AWS credentials or region are missing.');
}

// ✅ AWS Configuration
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'studio_appointments';

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Verify SMTP
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP is ready to send messages.');
  }
});

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  date: string;
  timeSlot: string;
  appointmentDateTime: string;
  createdAt: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, reason, date, timeSlot, appointmentDateTime } = req.body;

  if (!name || !email || !phone || !reason || !date || !timeSlot || !appointmentDateTime) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const appointment: Appointment = {
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
    // ✅ Save to DynamoDB
    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: appointment,
    }).promise();

    // ✅ Email Content
    const mailOptions = {
      from: `"MV Hair Studio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Appointment is Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2c3e50; text-align: center;">Appointment Confirmation</h2>
            <p style="font-size: 16px; color: #34495e;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #34495e;">Thank you for booking with us. Your appointment is confirmed:</p>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #ecf0f1;">Date</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #ecf0f1;">Time Slot</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #ecf0f1;">Reason</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${reason}</td>
              </tr>
            </table>
            <p style="font-size: 16px; color: #34495e;">We look forward to seeing you!</p>
            <p style="font-size: 16px; color: #34495e;">Best regards,<br><strong>MV Hair Studio</strong></p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully.');
    } catch (emailErr: unknown) {
      console.error('❌ Email sending failed:', emailErr);
    }

    res.status(200).json({ message: 'Success', appointment });
  } catch (dbError) {
    console.error('❌ DynamoDB Error:', dbError);
    res.status(500).json({ message: 'Something went wrong with booking.' });
  }
}
