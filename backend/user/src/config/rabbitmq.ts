import ampq from "amqplib";

let channel: ampq.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await ampq.connect({
      protocol: "amqp",
      hostname: process.env.RabbitMQ_Host,
      port: 5672,
      username: process.env.RabbitMQ_Username,
      password: process.env.RabbitMQ_Password,
    });
    channel = await connection.createChannel();

    console.log("✅ Connected to rabbitmq");
  } catch (error) {
    console.log("❌  Failed to connect to rabbitmq", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("Rabbitmq channel is not initialized ");
    return;
  }
  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
