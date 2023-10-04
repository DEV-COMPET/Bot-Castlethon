import { google } from 'googleapis';
import * as path from 'path';
import { env } from '@/env';

const environment = env.ENVIRONMENT; // Replace with your environment variable or value

export async function sendEmail() {
  try {
    // Load the Google API credentials from your JSON file
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, `competente.${environment}.json`),
      scopes: 'https://www.googleapis.com/auth/gmail.send',
    });

    // Create a Gmail API client
    const gmail = google.gmail({
      version: 'v1',
      auth,
    });

    // Compose the email message
    const message = `
      To: pedroapr1804@hotmail.com
      Subject: Test Email
      Content-Type: text/html; charset="UTF-8"

      <html>
        <body>
          <p>This is a test email sent from the Gmail API.</p>
        </body>
      </html>
    `;

    // Encode the message as base64
    const encodedMessage = Buffer.from(message).toString('base64');

    // Send the email
    const res = await gmail.users.messages.send({
      userId: 'me', // 'me' represents the authenticated user
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Email sent:', res.data);

  } catch (error) {
    console.error('Error sending email:', error);
  }
}
