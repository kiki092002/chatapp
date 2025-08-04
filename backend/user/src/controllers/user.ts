import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/User.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;
  const rateLimitKey = `otp:ratelimit:${email}`;
  const ratelimit = await redisClient.get(rateLimitKey);
  if (ratelimit) {
    res.status(429).json({
      message: "Too many requests. Please wait before requesting new opt",
    });
    return;
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, {
    EX: 300,
  });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });
  const message = {
    to: email,
    subject: "Your OTP code",
    body: `Your OTP is ${otp}. It is valid for 5 mins`,
  };
  await publishToQueue("send-otp", message);
  res.status(200).json({
    message: "OTP sent to your email",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp: enteredOTP } = req.body;

  if (!email || !enteredOTP) {
    res.status(400).json({
      message: "Email and OTP Required",
    });
    return;
  }
  const otpKey = `otp:${email}`;

  const storeOtp = await redisClient.get(otpKey);

  if (!storeOtp || storeOtp !== enteredOTP) {
    res.status(400).json({
      message: "Invalid or expired OTP",
    });
    return;
  }
  await redisClient.del(otpKey);

  let user = await User.findOne({ email });
  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }
  const token = generateToken(user);
  res.json({
    message: "User verified",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(404).json({
      message: "Please login",
    });
    return;
  }
  user.name = req.body.name;
  await user.save();
  const token = generateToken(user);
  res.json({
    message: "User updated",
    user,
    token,
  });
});

export const getAllUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const users = await User.find();

  res.json(users);
});

export const getAllUse = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.json(user);
});
