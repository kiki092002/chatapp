import amqp from "amqplib";

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const startSendOTPConsumer = async () => {
  try {
    const connect = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RabbitMQ_Host,
      port: 5672,
      username: process.env.RabbitMQ_Username,
      password: process.env.RabbitMQ_Password,
    });
    const channel = await connect.createChannel();

    const queueName = "send-opt";

    await channel.assertQueue(queueName, { durable: true });

    console.log("mail service consumer started, listening for opt emails");

    channel.consume(queueName, async (msq) => {
      if (msq) {
        try {
          const { to, subject, body } = JSON.parse(msq.content.toString());
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD,
            },
          });
          await transporter.sendMail({
            from: "Chat app",
            to,
            subject,
            text: body,
          });

          console.log(`OTP mail sent to ${to}`);
          channel.ack(msq);
        } catch (error) {
          console.log("failed to send otp message", error);
        }
      }
    });
  } catch (error) {
    console.log("failed to start rabbitmq consumer", error);
  }
};
