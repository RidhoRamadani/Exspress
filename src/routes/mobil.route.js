// const express = require("express");
// const router = express.Router();

// const {
//   getMobil,
//   createMobil,
//   updateMobil,
//   getMobilDetail,
//   deleteMobil
// } = require("../controllers/mobil.controller");

// const {
//   getMobilSchema,
//   createMobilSchema,
//   updateMobilSchema
// } = require("../validations/mobil.validation");

// const validate = schema => async (req, res, next) => {
//   try {
//     await schema.validate({
//       body: req.body,
//       query: req.query
//     });
//     next();
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// router.get("/", validate(getMobilSchema), getMobil);
// router.get("/:plat_mobil", getMobilDetail);  
// router.post("/", validate(createMobilSchema), createMobil);
// router.put("/:plat_mobil", validate(updateMobilSchema), updateMobil);
// router.delete("/:plat_mobil", deleteMobil);


// module.exports = router;


const express = require("express");
const router = express.Router();

const mobilController = require("../controllers/mobil.controller");
const {
  getMobilSchema,
  createMobilSchema,
  updateMobilSchema
} = require("../validations/mobil.validation");


const validate = schema => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params
      },
      { abortEarly: true }
    );
    next();
  } catch (err) {
    next(err); 
  }
};

router.get("/", validate(getMobilSchema), mobilController.getMobil);
router.get("/:plat_mobil", mobilController.getMobilDetail);
router.post("/", validate(createMobilSchema), mobilController.createMobil);
router.put("/:plat_mobil", validate(updateMobilSchema), mobilController.updateMobil);
router.delete("/:plat_mobil", mobilController.deleteMobil);

module.exports = router;

