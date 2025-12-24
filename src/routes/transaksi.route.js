const express = require("express");
const router = express.Router();

const {
  getTransaksi,
  createTransaksi
} = require("../controllers/transaksi.controller");

const {
  getTransaksiSchema,
  createTransaksiSchema
} = require("../validations/transaksi.validation");

const validate = schema => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query
    });
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

router.get("/", validate(getTransaksiSchema), getTransaksi);
router.post("/", validate(createTransaksiSchema), createTransaksi);


module.exports = router;
