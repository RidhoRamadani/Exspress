const yup = require("yup");

exports.getPelangganSchema = yup.object({
  query: yup.object({
    page: yup.number().min(1).default(1),
    limit: yup.number().min(1).max(50).default(10),
    search: yup.string().nullable()
  })
});

exports.createPelangganSchema = yup.object({
  body: yup.object({
    nama_pelanggan: yup.string().required(),
    alamat: yup.string().required(),
    no_hp: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required()
  })
});

exports.updatePelangganSchema = yup.object({
  body: yup.object({
    nama_pelanggan: yup.string().required(),
    alamat: yup.string().required(),
    no_hp: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required()
  })
});