import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import mobilRoute from "./routes/mobil.route";
import pelangganRoute from "./routes/pelanggan.route";
import transaksiRoute from "./routes/transaksi.route";
import authRoute from "./routes/auth.route";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://rencarbarokahv2.vercel.app",
      "https://exspress.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", authRoute);
app.use("/mobil", mobilRoute);
app.use("/pelanggan", pelangganRoute);
app.use("/transaksi", transaksiRoute);

app.use(errorHandler);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app; // ✅ WAJIB
