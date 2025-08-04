import TryCatch from "../config/TryCatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/Chat.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;
    if (!otherUserId) {
      res.status(400).json({
        message: "other userid is required",
      });
      return;
    }
    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });
    if (existingChat) {
      res.json({
        message: "Chat already existed",
        chatId: existingChat._id,
      });
      return;
    }
    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });
    res.status(201).json({
      message: "New Chat created",
      chatId: newChat._id,
    });
  }
);
export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(400).json({
      message: "user id missing",
    });
    return;
  }
  const chats = await Chat.find({ users: userId }).sort({
    updatedAt: -1,
  });
  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id) => id !== userId);
    })
  );
});
