import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";



interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "pegawai" | "pelanggan";
  };
}

interface TransaksiRow {
  id_pemesanan: number;
  id_pelanggan: number;
  nama_pelanggan: string;
  plat_mobil: string;
  nama_mobil: string;
  tanggal_pesan: Date;
  tanggal_selesai: Date;
  total_harga: number;
  comment: string;
  created_by: string | null;
  created_date: Date | null;
}


export const getTransaksi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const isExport = req.query.export === "true";
    const search = ((req.query.search as string) || "")
      .replace(/\n/g, "")
      .trim()
      .toLowerCase();

    const userId = req.user?.id;
    const userRole = req.user?.role;

    const paginationClause =
      userRole === "pegawai" && !isExport
        ? `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
        : "";

    const pelangganFilter =
      userRole === "pelanggan" ? `AND t.id_pelanggan = ${userId}` : "";

    const dataQuery = `
      SELECT 
        t.id_pemesanan,
        t.id_pelanggan,
        p.nama_pelanggan,
        t.plat_mobil,
        m.nama_mobil,
        t.tanggal_pesan,
        t.tanggal_selesai,
        t.comment,
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

    const data = await prisma.$queryRawUnsafe<TransaksiRow[]>(dataQuery);

    if (isExport || userRole === "pelanggan") {
      return res.json({
        data,
        totalData: data.length,
      });
    }

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

    const countResult = await prisma.$queryRawUnsafe<
      { total: bigint }[]
    >(countQuery);

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



export const createTransaksi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_pelanggan, plat_mobil, tanggal_pesan, tanggal_selesai, comment } =
      req.body;

    // Validasi input dasar
    if (!id_pelanggan || !plat_mobil || !Array.isArray(plat_mobil) || plat_mobil.length === 0) {
      return res.status(400).json({
        message: "Data transaksi tidak lengkap",
      });
    }

    const tPesan = new Date(tanggal_pesan);
    const tSelesai = new Date(tanggal_selesai);

    if (tSelesai < tPesan) {
      return res.status(400).json({
        message: "Tanggal selesai tidak boleh lebih kecil dari tanggal pesan",
      });
    }

    const jumlahHari =
      Math.floor((tSelesai.getTime() - tPesan.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    let total_harga = 0;

    // Siapkan semua create untuk dimasukkan dalam transaksi
    const createPromises = [];

    for (const plat of plat_mobil) {
      const mobil = await prisma.mobil.findUnique({
        where: { plat_mobil: plat },
      });

      if (!mobil) {
        return res.status(400).json({
          message: `Mobil dengan plat ${plat} tidak ditemukan`,
        });
      }

      if (mobil.harga_sewa == null) {
        return res.status(400).json({
          message: `Harga sewa mobil ${plat} belum ditentukan`,
        });
      }

      const hargaMobil = mobil.harga_sewa * jumlahHari;
      total_harga += hargaMobil;

      createPromises.push(
        prisma.trs_Pemesanan.create({
          data: {
            id_pelanggan,
            plat_mobil: plat,
            tanggal_pesan: tPesan,
            tanggal_selesai: tSelesai,
            total_harga: hargaMobil,
            comment: comment ?? "", 
            created_date: new Date(),
            created_by: "admin",
          },
        })
      );
    }

    
    await prisma.$transaction(createPromises);

    res.json({
      message: "Transaksi berhasil",
      total_harga,
    });
  } catch (error) {
    next(error);
  }
};

export const checkAvailability = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { plat_mobil, tanggal_pesan, tanggal_selesai } = req.body;

    if (!plat_mobil || !Array.isArray(plat_mobil) || plat_mobil.length === 0) {
      return res.status(400).json({ message: "Plat mobil wajib dipilih" });
    }

    const tPesan = new Date(tanggal_pesan);
    const tSelesai = new Date(tanggal_selesai);

    const unavailable: string[] = [];

    for (const plat of plat_mobil) {
      const overlapping = await prisma.trs_Pemesanan.findFirst({
        where: {
          plat_mobil: plat,
          OR: [
            {
              tanggal_pesan: { lte: tSelesai },
              tanggal_selesai: { gte: tPesan },
            },
          ],
        },
      });

      if (overlapping) unavailable.push(plat);
    }

    res.json({ unavailable });
  } catch (error) {
    next(error);
  }
};
