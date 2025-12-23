import React, { useEffect, useRef, useState } from "react";
import "./App.css";

type Message = {
  sender: "user" | "ai";
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>("12344");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);

      setSessionId(data.sessionId);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: err.message || "Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="chat-container">
      <h2>AI Support Chat</h2>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.sender === "user" ? "user" : "ai"}`}
          >
            {m.text}
          </div>
        ))}

        {loading && <div className="message ai typing">Agent is typing…</div>}

        <div ref={bottomRef} />
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…"
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
