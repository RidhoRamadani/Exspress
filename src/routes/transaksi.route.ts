import { Router, Request, Response, NextFunction } from "express";
import { getTransaksi, createTransaksi, checkAvailability } from "../controllers/transaksi.controller";
import { getTransaksiSchema, createTransaksiSchema } from "../validations/transaksi.validation";

const router = Router();

const validate =
  (schema: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        { abortEarly: true }
      );
      next();
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

// Routes
router.get("/", validate(getTransaksiSchema), getTransaksi);
router.post("/", validate(createTransaksiSchema), createTransaksi);
router.post("/cek-availability", checkAvailability);

export default router;
