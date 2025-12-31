import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const getPelanggan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9999;
    const skip = (page - 1) * limit;

    const search = ((req.query.search as string) || "").trim();
    const status = ((req.query.status as string) || "").trim();

    const data = await prisma.$queryRaw`
      SELECT *
      FROM Pelanggan
      WHERE
        (${status === ""} = 1 OR status = ${status})
        AND (
          ${search === ""} = 1
          OR LOWER(nama_pelanggan) LIKE '%' + LOWER(${search}) + '%'
          OR LOWER(alamat) LIKE '%' + LOWER(${search}) + '%'
        )
      ORDER BY created_date DESC
      OFFSET ${skip} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    const countResult: any = await prisma.$queryRaw`
      SELECT COUNT(*) AS total
      FROM Pelanggan
      WHERE
        (${status === ""} = 1 OR status = ${status})
        AND (
          ${search === ""} = 1
          OR LOWER(nama_pelanggan) LIKE '%' + LOWER(${search}) + '%'
          OR LOWER(alamat) LIKE '%' + LOWER(${search}) + '%'
        )
    `;

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

export const getPelangganDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id_pelanggan = Number(req.params.id_pelanggan);

    if (isNaN(id_pelanggan)) {
      throw new Error("ID pelanggan tidak valid");
    }

    const data = await prisma.pelanggan.findUnique({
      where: { id_pelanggan },
    });

    if (!data) {
      throw new Error("Pelanggan tidak ditemukan");
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const createPelanggan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.pelanggan.create({
      data: {
        ...req.body,
        id_role: 2, 
        status: "Aktif",
        created_date: new Date(),
        created_by: "admin",
      },
    });

    res.status(201).json({
      message: "Pelanggan berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /pelanggan/:id_pelanggan
export const updatePelanggan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id_pelanggan = Number(req.params.id_pelanggan);

    if (isNaN(id_pelanggan)) {
      throw new Error("ID pelanggan tidak valid");
    }

    const data = await prisma.pelanggan.update({
      where: { id_pelanggan },
      data: {
        ...req.body,
        update_date: new Date(),
        update_by: "admin",
      },
    });

    res.json({
      message: "Pelanggan berhasil diupdate",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePelanggan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id_pelanggan = Number(req.params.id_pelanggan);

    if (isNaN(id_pelanggan)) {
      throw new Error("ID pelanggan tidak valid");
    }

    await prisma.pelanggan.update({
      where: { id_pelanggan },
      data: {
        status: "Tidak Aktif",
        update_date: new Date(),
        update_by: "admin",
      },
    });

    res.json({
      message: "Pelanggan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
