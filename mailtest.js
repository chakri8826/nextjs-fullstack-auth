import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function testMail() {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ef3e391db3edca",
      pass: "534ccd735024fa",
    },
  });

  const info = await transporter.sendMail({
    from: '"Test App" <test@example.com>',
    to: "anyone@example.com",
    subject: "Hello from Mailtrap",
    text: "This is a test email",
    html: "<b>This is a test email</b>",
  });

  console.log("✅ Message sent:", info.messageId);
}

testMail().catch(console.error);
