// const prisma = require("../config/prisma");



// exports.getPelanggan = async (req, res, next) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const search = (req.query.search || "")
//       .replace(/\n/g, "")
//       .trim();
//     const status = (req.query.status || "").trim();

//     const data = await prisma.$queryRaw`
//       SELECT *
//       FROM Pelanggan
//       WHERE 
//       (
//           ${status === ""} = 1
//           OR status = ${status}
//         )
//         AND (
//           ${search === ""} = 1
//           OR LOWER(nama_pelanggan) LIKE '%' + LOWER(${search}) + '%'
//           OR LOWER(alamat) LIKE '%' + LOWER(${search}) + '%'
//         )
//       ORDER BY created_date DESC
//       OFFSET ${skip} ROWS
//       FETCH NEXT ${limit} ROWS ONLY
//     `;

//     const countResult = await prisma.$queryRaw`
//       SELECT COUNT(*) AS total
//       FROM Pelanggan
//       WHERE 
//        (
//           ${status === ""} = 1
//           OR status = ${status}
//         )

//         AND (
//           ${search === ""} = 1
//           OR LOWER(nama_pelanggan) LIKE '%' + LOWER(${search}) + '%'
//           OR LOWER(alamat) LIKE '%' + LOWER(${search}) + '%'
//         )
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


// exports.getPelangganDetail = async (req, res, next) => {
//   try {
//     const id_pelanggan = Number(req.params.id_pelanggan);
//     if (isNaN(id_pelanggan)) {
//       return res.status(400).json({ message: "ID pelanggan tidak valid" });
//     }

//     const data = await prisma.pelanggan.findUnique({
//       where: { id_pelanggan }
//     });

//     if (!data) {
//       return res.status(404).json({
//         message: "Pelanggan tidak ditemukan"
//       });
//     }

//     res.json({
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// exports.createPelanggan = async (req, res, next) => {
//   try {
//     const data = await prisma.pelanggan.create({
//       data: {
//         ...req.body,
//         status: "Aktif",
//         created_date: new Date(),
//         created_by: "admin"
//       }
//     });

//     res.status(201).json({
//       message: "Pelanggan berhasil ditambahkan",
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updatePelanggan = async (req, res, next) => {
//   try {
//     const id_pelanggan = Number(req.params.id_pelanggan);
//     if (isNaN(id_pelanggan)) {
//       return res.status(400).json({ message: "ID pelanggan tidak valid" });
//     }

//     const data = await prisma.pelanggan.update({
//       where: { id_pelanggan },
//       data: {
//         ...req.body,
//         update_date: new Date(),
//         update_by: "admin"
//       }
//     });

//     res.json({
//       message: "Pelanggan berhasil diupdate",
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// exports.deletePelanggan = async (req, res, next) => {
//   try {
//     const id_pelanggan = Number(req.params.id_pelanggan);
//     if (isNaN(id_pelanggan)) {
//       return res.status(400).json({ message: "ID pelanggan tidak valid" });
//     }

//     await prisma.pelanggan.update({
//       where: { id_pelanggan },
//       data: {
//         status: "Tidak Aktif",
//         update_date: new Date(),
//         update_by: "admin"
//       }
//     });

//     res.json({
//       message: "Pelanggan berhasil dihapus (soft delete)"
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const prisma = require("../config/prisma");

exports.getPelanggan = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9999;
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const status = (req.query.status || "").trim();

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
    const countResult = await prisma.$queryRaw`
      SELECT COUNT(*) AS total
      FROM Mobil
      WHERE
        (
          ${status === ""} = 1
          OR status = ${status}
        )
        AND (
          ${search === ""} = 1
          OR LOWER(nama_mobil) LIKE '%' + LOWER(${search}) + '%'
          OR LOWER(merk) LIKE '%' + LOWER(${search}) + '%'
          OR LOWER(plat_mobil) LIKE '%' + LOWER(${search}) + '%'
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

exports.getPelangganDetail = async (req, res, next) => {
  try {
    const id_pelanggan = Number(req.params.id_pelanggan);

    if (isNaN(id_pelanggan)) {
      throw new Error("ID pelanggan tidak valid");
    }

    const data = await prisma.pelanggan.findUnique({
      where: { id_pelanggan }
    });

    if (!data) {
      throw new Error("Pelanggan tidak ditemukan");
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.createPelanggan = async (req, res, next) => {
  try {
    const data = await prisma.pelanggan.create({
      data: {
        ...req.body,
        id_role: 2,
        status: "Aktif",
        created_date: new Date(),
        created_by: "admin"
      }
    });

    res.status(201).json({
      message: "Pelanggan berhasil ditambahkan",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePelanggan = async (req, res, next) => {
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
        update_by: "admin"
      }
    });

    res.json({
      message: "Pelanggan berhasil diupdate",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePelanggan = async (req, res, next) => {
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
        update_by: "admin"
      }
    });

    res.json({
      message: "Pelanggan berhasil dihapus"
    });
  } catch (error) {
    next(error);
  }
};

