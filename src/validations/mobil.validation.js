const yup = require("yup");

exports.getMobilSchema = yup.object({
  query: yup.object({
    page: yup.number().min(1).default(1),
    limit: yup.number().min(1).max(50).default(10),
    search: yup.string().nullable()
  })
});

exports.createMobilSchema = yup.object({
  body: yup.object({
    plat_mobil: yup.string().required(),
    nama_mobil: yup.string().required(),
    merk: yup.string().required(),
    harga_sewa: yup.number().required()
  })
});

exports.updateMobilSchema = yup.object({
  body: yup.object({
    nama_mobil: yup.string().required(),
    merk: yup.string().required()
  })
});