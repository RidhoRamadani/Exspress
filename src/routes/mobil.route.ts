import { Router, Request, Response, NextFunction } from "express";
import { getMobil, getMobilDetail, createMobil, updateMobil, deleteMobil } from "../controllers/mobil.controller";
import { getMobilSchema, createMobilSchema, updateMobilSchema } from "../validations/mobil.validation";

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
    } catch (err) {
      next(err);
    }
  };


router.get("/", validate(getMobilSchema), getMobil);
router.get("/:plat_mobil", getMobilDetail);
router.post("/", validate(createMobilSchema), createMobil);
router.put("/:plat_mobil", validate(updateMobilSchema), updateMobil);
router.delete("/:plat_mobil", deleteMobil);

export default router;
