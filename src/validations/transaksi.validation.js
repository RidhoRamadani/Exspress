const yup = require("yup");

exports.getTransaksiSchema = yup.object({
  query: yup.object({
    page: yup.number().min(1).default(1),
    limit: yup.number().min(1).max(50).default(10),
    search: yup.string().nullable()
  })
});

// exports.createTransaksiSchema = yup.object({
//   body: yup.object({
//     id_pelanggan: yup.number().required("ID pelanggan wajib diisi"),
//     plat_mobil: yup.string().required("Plat mobil wajib diisi"),
//     tanggal_pesan: yup.date().nullable(),
//     tanggal_selesai: yup.date().nullable(),
//     total_harga: yup.number().nullable()
//   })
// });
exports.createTransaksiSchema = yup.object({
  body: yup.object({
    id_pelanggan: yup
      .number()
      .typeError("ID pelanggan harus berupa angka")
      .required("ID pelanggan wajib diisi"),

    plat_mobil: yup
      .array()
      .of(
        yup
          .string()
          .required("Plat mobil tidak boleh kosong")
      )
      .min(1, "Minimal pilih 1 mobil")
      .required("Mobil wajib dipilih"),

    tanggal_pesan: yup
      .date()
      .typeError("Tanggal pesan tidak valid")
      .required("Tanggal pesan wajib diisi"),

    tanggal_selesai: yup
      .date()
      .typeError("Tanggal selesai tidak valid")
      .required("Tanggal selesai wajib diisi")
      .min(
        yup.ref("tanggal_pesan"),
        "Tanggal selesai harus sama atau setelah tanggal pesan"
      ),
  }),
});



