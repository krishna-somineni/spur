import { prisma } from "../prisma";
import { generateReply, HistoryMessage } from "./llm";

export async function handleChat(message: string, sessionId?: string) {
  if (!message || !message.trim()) {
    throw new Error("Message cannot be empty");
  }

  let conversationId = sessionId;

  // ✅ Check if conversation actually exists
  if (conversationId) {
    const exists = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!exists) {
      conversationId = undefined; // force new conversation
    }
  }

  // ✅ Create conversation if needed
  if (!conversationId) {
    const convo = await prisma.conversation.create({
      data: {}
    });
    conversationId = convo.id;
  }

  // ✅ Now it is SAFE to create message
  await prisma.message.create({
    data: {
      conversationId,
      sender: "user",
      text: message
    }
  });

  const historyFromDb = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 10
  });

  const history: HistoryMessage[] = historyFromDb.map((m) => ({
    sender: m.sender === "user" ? "user" : "ai",
    text: m.text
  }));

  const reply = await generateReply(history);

  await prisma.message.create({
    data: {
      conversationId,
      sender: "ai",
      text: reply
    }
  });

  return { reply, sessionId: conversationId };
}
