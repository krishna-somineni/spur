import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",          // local dev
      "https://spur-f.onrender.com"     // production frontend
    ],
    methods: ["GET", "POST"],
    credentials: false
  })
);

app.use(express.json());

app.use("/chat", chatRoutes);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
