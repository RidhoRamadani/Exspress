// const prisma = require("../config/prisma");

// exports.getTransaksi = async (req, res, next) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const search = (req.query.search || "").replace(/\n/g, "").trim().toLowerCase();

//     const data = await prisma.$queryRaw`
//       SELECT t.id_pemesanan,
//              t.id_pelanggan,
//              p.nama_pelanggan,
//              t.plat_mobil,
//              m.nama_mobil,
//              t.tanggal_pesan,
//              t.tanggal_selesai,
//              t.total_harga,
//              t.created_by,
//              t.created_date
//       FROM Trs_Pemesanan t
//       INNER JOIN Pelanggan p ON t.id_pelanggan = p.id_pelanggan
//       INNER JOIN Mobil m ON t.plat_mobil = m.plat_mobil
//       WHERE LOWER(p.nama_pelanggan) LIKE '%' + ${search} + '%'
//          OR LOWER(m.nama_mobil) LIKE '%' + ${search} + '%'
//          OR ${search} = ''
//       ORDER BY t.created_date DESC
//       OFFSET ${skip} ROWS
//       FETCH NEXT ${limit} ROWS ONLY
//     `;

//     const countResult = await prisma.$queryRaw`
//       SELECT COUNT(*) AS total
//       FROM Trs_Pemesanan t
//       INNER JOIN Pelanggan p ON t.id_pelanggan = p.id_pelanggan
//       INNER JOIN Mobil m ON t.plat_mobil = m.plat_mobil
//       WHERE LOWER(p.nama_pelanggan) LIKE '%' + ${search} + '%'
//          OR LOWER(m.nama_mobil) LIKE '%' + ${search} + '%'
//          OR ${search} = ''
//     `;

//     const totalData = Number(countResult[0].total);

//     res.json({
//       data,
//       page,
//       limit,
//       totalData,
//       totalPage: Math.ceil(totalData / limit)
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.createTransaksi = async (req, res, next) => {
//   try {
//     const { id_pelanggan, plat_mobil, tanggal_pesan, tanggal_selesai, total_harga } = req.body;

//     // Optional: validasi apakah pelanggan dan mobil ada
//     const pelanggan = await prisma.pelanggan.findUnique({ where: { id_pelanggan } });
//     if (!pelanggan) {
//       return res.status(400).json({ message: "Pelanggan tidak ditemukan" });
//     }

//     const mobil = await prisma.mobil.findUnique({ where: { plat_mobil } });
//     if (!mobil) {
//       return res.status(400).json({ message: "Mobil tidak ditemukan" });
//     }

//     const data = await prisma.trs_Pemesanan.create({
//       data: {
//         id_pelanggan,
//         plat_mobil,
//         tanggal_pesan: tanggal_pesan ? new Date(tanggal_pesan) : null,
//         tanggal_selesai: tanggal_selesai ? new Date(tanggal_selesai) : null,
//         total_harga,
//         created_by: "admin",
//         created_date: new Date()
//       }
//     });

//     res.status(201).json({
//       message: "Transaksi berhasil ditambahkan",
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// const prisma = require("../config/prisma");

// exports.getTransaksi = async (req, res, next) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const search = (req.query.search || "")
//       .replace(/\n/g, "")
//       .trim()
//       .toLowerCase();

//     const data = await prisma.$queryRaw`
//       SELECT 
//         t.id_pemesanan,
//         t.id_pelanggan,
//         p.nama_pelanggan,
//         t.plat_mobil,
//         m.nama_mobil,
//         t.tanggal_pesan,
//         t.tanggal_selesai,
//         t.total_harga,
//         t.created_by,
//         t.created_date
//       FROM Trs_Pemesanan t
//       INNER JOIN Pelanggan p ON t.id_pelanggan = p.id_pelanggan
//       INNER JOIN Mobil m ON t.plat_mobil = m.plat_mobil
//       WHERE
//         ${search === ""} = 1
//         OR LOWER(p.nama_pelanggan) LIKE '%' + ${search} + '%'
//         OR LOWER(m.nama_mobil) LIKE '%' + ${search} + '%'
//       ORDER BY t.created_date DESC
//       OFFSET ${skip} ROWS
//       FETCH NEXT ${limit} ROWS ONLY
//     `;

//     const countResult = await prisma.$queryRaw`
//       SELECT COUNT(*) AS total
//       FROM Trs_Pemesanan t
//       INNER JOIN Pelanggan p ON t.id_pelanggan = p.id_pelanggan
//       INNER JOIN Mobil m ON t.plat_mobil = m.plat_mobil
//       WHERE
//         ${search === ""} = 1
//         OR LOWER(p.nama_pelanggan) LIKE '%' + ${search} + '%'
//         OR LOWER(m.nama_mobil) LIKE '%' + ${search} + '%'
//     `;

//     const totalData = Number(countResult[0].total);

//     res.json({
//       data,
//       page,
//       limit,
//       totalData,
//       totalPage: Math.ceil(totalData / limit)
//     });
//   } catch (error) {
//     next(error);
//   }
// };


const prisma = require("../config/prisma");

exports.getTransaksi = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const isExport = req.query.export === "true";
    const search = (req.query.search || "").replace(/\n/g, "").trim().toLowerCase();

    // Ambil info user dari middleware auth
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Pagination hanya untuk pegawai dan bukan export
    const paginationClause = userRole === "pegawai" && !isExport
      ? `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
      : "";

    // Filter untuk pelanggan
    const pelangganFilter = userRole === "pelanggan" ? `AND t.id_pelanggan = ${userId}` : "";

    // Query data transaksi
    const dataQuery = `
      SELECT 
        t.id_pemesanan,
        t.id_pelanggan,
        p.nama_pelanggan,
        t.plat_mobil,
        m.nama_mobil,
        t.tanggal_pesan,
        t.tanggal_selesai,
        t.total_harga,
        t.created_by,
        t.created_date
      FROM Trs_Pemesanan t
      INNER JOIN Pelanggan p ON t.id_pelanggan = p.id_pelanggan
      INNER JOIN Mobil m ON t.plat_mobil = m.plat_mobil
      WHERE
        (
          ${search === "" ? 1 : 0} = 1
          OR LOWER(p.nama_pelanggan) LIKE '%${search}%'
          OR LOWER(m.nama_mobil) LIKE '%${search}%'
        )
        ${pelangganFilter}
      ORDER BY t.created_date DESC
      ${paginationClause}
    `;

    const data = await prisma.$queryRawUnsafe(dataQuery);

    // Jika export atau pelanggan → kirim semua data (tanpa pagination)
    if (isExport || userRole === "pelanggan") {
      return res.json({
        data,
        totalData: data.length,
      });
    }

    // Hitung total data untuk pegawai (untuk pagination)
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Trs_Pemesanan t
      INNER JOIN Pelanggan p ON t.id_pelanggan = p.id_pelanggan
      INNER JOIN Mobil m ON t.plat_mobil = m.plat_mobil
      WHERE
        (
          ${search === "" ? 1 : 0} = 1
          OR LOWER(p.nama_pelanggan) LIKE '%${search}%'
          OR LOWER(m.nama_mobil) LIKE '%${search}%'
        )
    `;

    const countResult = await prisma.$queryRawUnsafe(countQuery);
    const totalData = Number(countResult[0].total);

    res.json({
      data,
      page,
      limit,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    });
  } catch (error) {
    next(error);
  }
};



// exports.createTransaksi = async (req, res, next) => {
//   try {
//     const {
//       id_pelanggan,
//       plat_mobil,
//       tanggal_pesan,
//       tanggal_selesai,
//       total_harga
//     } = req.body;

//     if (!id_pelanggan || !plat_mobil) {
//       throw new Error("Data transaksi tidak lengkap");
//     }

//     const pelanggan = await prisma.pelanggan.findUnique({
//       where: { id_pelanggan }
//     });

//     if (!pelanggan) {
//       throw new Error("Pelanggan tidak ditemukan");
//     }

//     const mobil = await prisma.mobil.findUnique({
//       where: { plat_mobil }
//     });

//     if (!mobil) {
//       throw new Error("Mobil tidak ditemukan");
//     }

//     const data = await prisma.trs_Pemesanan.create({
//       data: {
//         id_pelanggan,
//         plat_mobil,
//         tanggal_pesan: tanggal_pesan ? new Date(tanggal_pesan) : null,
//         tanggal_selesai: tanggal_selesai ? new Date(tanggal_selesai) : null,
//         total_harga,
//         created_by: "admin",
//         created_date: new Date()
//       }
//     });

//     res.status(201).json({
//       message: "Transaksi berhasil ditambahkan",
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };


exports.createTransaksi = async (req, res) => {
  const { id_pelanggan, plat_mobil, tanggal_pesan, tanggal_selesai } = req.body;

  const tPesan = new Date(tanggal_pesan);
  const tSelesai = new Date(tanggal_selesai);

  const jumlahHari =
    Math.floor((tSelesai - tPesan) / (1000 * 60 * 60 * 24)) + 1;

  let total_harga = 0;

  for (const plat of plat_mobil) {
    const mobil = await prisma.mobil.findUnique({
      where: { plat_mobil: plat },
    });

    if (!mobil) {
      return res.status(400).json({
        message: `Mobil dengan plat ${plat} tidak ditemukan`,
      });
    }

    total_harga += mobil.harga_sewa * jumlahHari;

    await prisma.trs_Pemesanan.create({
      data: {
        id_pelanggan,
        plat_mobil: plat,
        tanggal_pesan: tPesan,
        tanggal_selesai: tSelesai,
        total_harga: mobil.harga_sewa * jumlahHari,
        created_date: new Date(),
        created_by: "admin"
      },
    });
  }

  res.json({
    message: "Transaksi berhasil",
    total_harga,
  });
};
