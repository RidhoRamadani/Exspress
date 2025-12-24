// const express = require("express");
// const router = express.Router();

// const {
//   getPelanggan,
//   createPelanggan,
//   updatePelanggan,
//   getPelangganDetail,
//   deletePelanggan
// } = require("../controllers/pelanggan.controller");

// const {
//   getPelangganSchema,
//   createPelangganSchema,
//   updatePelangganSchema
// } = require("../validations/pelanggan.validation");

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

// router.get("/", validate(getPelangganSchema), getPelanggan);
// router.get("/:id_pelanggan", getPelangganDetail);  
// router.post("/", validate(createPelangganSchema), createPelanggan);
// router.put("/:id_pelanggan", validate(updatePelangganSchema), updatePelanggan);
// router.delete("/:id_pelanggan", deletePelanggan);


// module.exports = router;

const express = require("express");
const router = express.Router();

const pelangganController = require("../controllers/pelanggan.controller");
const {
  getPelangganSchema,
  createPelangganSchema,
  updatePelangganSchema
} = require("../validations/pelanggan.validation");


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

router.get("/", validate(getPelangganSchema), pelangganController.getPelanggan);
router.get("/:id_pelanggan", pelangganController.getPelangganDetail);
router.post("/", validate(createPelangganSchema), pelangganController.createPelanggan);
router.put("/:id_pelanggan", validate(updatePelangganSchema), pelangganController.updatePelanggan);
router.delete("/:id_pelanggan", pelangganController.deletePelanggan);

module.exports = router;
