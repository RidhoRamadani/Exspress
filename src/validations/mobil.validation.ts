import * as yup from "yup";

export const getMobilSchema = yup.object({
  query: yup.object({
    page: yup.number().min(1).default(1),
    limit: yup.number().min(1).max(50).default(10),
    search: yup.string().nullable(),
  }),
});

export const createMobilSchema = yup.object({
  body: yup.object({
    plat_mobil: yup.string().required("Plat mobil wajib diisi"),
    nama_mobil: yup.string().required("Nama mobil wajib diisi"),
    merk: yup.string().required("Merk mobil wajib diisi"),
    harga_sewa: yup.number().required("Harga sewa wajib diisi"),
  }),
});

export const updateMobilSchema = yup.object({
  body: yup.object({
    nama_mobil: yup.string().required("Nama mobil wajib diisi"),
    merk: yup.string().required("Merk mobil wajib diisi"),
  }),
});
