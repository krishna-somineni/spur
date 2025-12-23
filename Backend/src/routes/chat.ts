import { Router } from "express";
import { handleChat } from "../services/chatServices";


const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const data = await handleChat(message, sessionId);
    res.json(data);
  } catch (e: any) {
    console.error("CHAT ERROR:", e);

    res.status(500).json({
      error: "Our support agent is temporarily unavailable. Please try again."
    });
  }
});


export default router;
