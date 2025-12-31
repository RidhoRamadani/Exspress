import { Request, Response, NextFunction } from "express";
import logError from "./logError";

interface ErrorWithMessage extends Error {
  status?: number;
}

const errorHandlerResponse = async (
  err: ErrorWithMessage,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await logError(err, req, res, next); 

  res.status(err.status || 500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message,
  });
};

export default errorHandlerResponse;
