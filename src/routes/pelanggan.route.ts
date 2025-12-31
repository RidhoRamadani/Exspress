import { Router, Request, Response, NextFunction } from "express";
import {
  getPelanggan,
  getPelangganDetail,
  createPelanggan,
  updatePelanggan,
  deletePelanggan,
} from "../controllers/pelanggan.controller"; 

import {
  getPelangganSchema,
  createPelangganSchema,
  updatePelangganSchema,
} from "../validations/pelanggan.validation";

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
      next(err);
    }
  };

// Routes
router.get("/", validate(getPelangganSchema), getPelanggan);
router.get("/:id_pelanggan", getPelangganDetail);
router.post("/", validate(createPelangganSchema), createPelanggan);
router.put("/:id_pelanggan", validate(updatePelangganSchema), updatePelanggan);
router.delete("/:id_pelanggan", deletePelanggan);

export default router;
