import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "studio_appointments";

// Remove Nodemailer setup since it's not being used anymore
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, // Your Gmail address
//     pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
//   },
// });

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, reason, date, timeSlot, appointmentDateTime } = req.body;

  if (!name || !email || !phone || !reason || !date || !timeSlot || !appointmentDateTime) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Construct the appointment object
  const appointment: Appointment = {
    id: uuidv4(),
    name,
    email,
    phone,
    reason,
    date,
    timeSlot,
    appointmentDateTime, // Include appointmentDateTime
    createdAt: new Date().toISOString(),
  };

  try {
    // Store the appointment in DynamoDB
    await dynamoDB
      .put({
        TableName: TABLE_NAME,
        Item: appointment,
      })
      .promise();

    // Removed email sending logic here

    // Respond with success
    res.status(200).json({ message: 'Success', appointment });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}
