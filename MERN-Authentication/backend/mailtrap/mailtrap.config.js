import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file from the project root (one level up from 'mailtrap' directory)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

console.log("MAILTRAP_TOKEN:", process.env.MAILTRAP_TOKEN);
console.log("MAILTRAP_ENDPOINT:", process.env.MAILTRAP_ENDPOINT);

if (!TOKEN) {
  throw new Error("MAILTRAP_TOKEN is missing from environment variables.");
}

export const mailtrapcClient = new MailtrapClient({
  endpoint: ENDPOINT,
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Saurabh Jaiswal",
};
// const recipients = [
//   {
//     email: "saurabhjaiswal19695@gmail.com",
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
