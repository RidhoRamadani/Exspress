import * as yup from "yup";

export const getPelangganSchema = yup.object({
  query: yup.object({
    page: yup.number().min(1).default(1),
    limit: yup.number().min(1).max(50).default(10),
    search: yup.string().nullable(),
  }),
});

export const createPelangganSchema = yup.object({
  body: yup.object({
    nama_pelanggan: yup.string().required("Nama pelanggan wajib diisi"),
    alamat: yup.string().required("Alamat wajib diisi"),
    no_hp: yup.string().required("No HP wajib diisi"),
    username: yup.string().required("Username wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
  }),
});

export const updatePelangganSchema = yup.object({
  body: yup.object({
    nama_pelanggan: yup.string().required("Nama pelanggan wajib diisi"),
    alamat: yup.string().required("Alamat wajib diisi"),
    no_hp: yup.string().required("No HP wajib diisi"),
    username: yup.string().required("Username wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
  }),
});
