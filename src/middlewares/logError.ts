import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

interface ErrorWithMessage extends Error {
  status?: number;
}

const logError = async (
  err: ErrorWithMessage,
  req: Request,
  res?: Response,
  next?: NextFunction
) => {
  try {
    await prisma.errorLog.create({
      data: {
        endpoint: req.originalUrl || "-",
        method: req.method || "-",
        error_message: err.message || "Unknown error",
        stack_trace: err.stack || "-",
      },
    });
  } catch (e: any) {
    console.error("Gagal simpan ErrorLog:", e.message);
  }
};

export default logError;
