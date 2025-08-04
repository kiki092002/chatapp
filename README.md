Project: Real-Time Chat App (MERN + TypeScript + Microservices + Redis + RabbitMQ)

This project was built both as a scalable, production-ready **real-time chat application** and as a hands-on way to **learn and apply modern system design concepts** such as microservices architecture, asynchronous messaging, caching, and cloud deployment.


1. OTP-Based Authentication
- Generates 6-digit OTP codes, stored securely in **Redis** with 5-minute expiration.
- Implements rate limiting per user using Redis keys.
- OTP email payloads published asynchronously via RabbitMQ queues.
- Fully typed backend logic using TypeScript for type safety.

2. Microservices Architecture
- Modular services for authentication, chat, and mail, each written in TypeScript.
- Services communicate via RabbitMQ queues to ensure loose coupling.
- Containerized services allow independent scaling and deployment.

3. Rate Limiting with Redis
- Utilizes Redis TTL keys for request throttling to prevent OTP spamming.
- Fast in-memory checks to optimize performance.

4.  Asynchronous Email Service with RabbitMQ
- RabbitMQ queues decouple email sending from authentication flow.
- Mail service consumes OTP messages and sends emails using Nodemailer, all written in TypeScript.

5. Dockerized Services
- All backend services and dependencies (MongoDB, Redis, RabbitMQ) dockerized.
- Simplified setup and local development with `docker-compose`.
