Project: Real-Time Chat App ( TypeScript + Express + Microservices + Redis + RabbitMQ)

This project was built both as a scalable, production-ready **real-time chat application** and as a hands-on way to **learn and apply modern system design concepts** such as microservices architecture, asynchronous messaging, caching, and cloud deployment.


1.User Service
- Handles user registration, login, and JWT-based authentication.
- Manages OTP generation and validation.
2.Chat Service
- Manages conversations and message storage.
- Handles WebSocket-based real-time communication.
3.Mail Service
- Sends OTP via Gmail API and securely stores it in in-memory storage Redis.
- Listens to message queue from RabbitMQ for decoupled communication.
