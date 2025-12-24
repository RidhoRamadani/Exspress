// const prisma = require("../config/prisma");

// exports.getMobil = async (req, res, next) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const search = (req.query.search || "").replace(/\n/g, "").trim();
//     const status = (req.query.status || "").trim(); 

//     const data = await prisma.$queryRaw`
//       SELECT *
//       FROM Mobil
//       WHERE
//         (
//           ${status === ""} = 1
//           OR status = ${status}
//         )
//         AND (
//           ${search === ""} = 1
//           OR LOWER(nama_mobil) LIKE '%' + LOWER(${search}) + '%'
//           OR LOWER(merk) LIKE '%' + LOWER(${search}) + '%'
//           OR LOWER(plat_mobil) LIKE '%' + LOWER(${search}) + '%'
//         )
//       ORDER BY created_date DESC
//       OFFSET ${skip} ROWS
//       FETCH NEXT ${limit} ROWS ONLY
//     `;

//     const countResult = await prisma.$queryRaw`
//       SELECT COUNT(*) AS total
//       FROM Mobil
//       WHERE
//         (
//           ${status === ""} = 1
//           OR status = ${status}
//         )
//         AND (
//           ${search === ""} = 1
//           OR LOWER(nama_mobil) LIKE '%' + LOWER(${search}) + '%'
//           OR LOWER(merk) LIKE '%' + LOWER(${search}) + '%'
//           OR LOWER(plat_mobil) LIKE '%' + LOWER(${search}) + '%'
//         )
//     `;

//     const totalData = Number(countResult[0].total);

//     res.json({
//       data,
//       page,
//       limit,
//       totalData,
//       totalPage: Math.ceil(totalData / limit),
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// exports.getMobilDetail = async (req, res, next) => {
//   try {
//     const { plat_mobil } = req.params;

//     const data = await prisma.mobil.findUnique({
//       where: { plat_mobil }
//     });

//     if (!data) {
//       return res.status(404).json({
//         message: "Mobil tidak ditemukan"
//       });
//     }

//     res.json({
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// exports.createMobil = async (req, res, next) => {
//   try {
//     const data = await prisma.mobil.create({
//       data: {
//         ...req.body,
//         status: "Aktif",
//         created_date: new Date(),
//         created_by: "admin"
//       }
//     });

//     res.status(201).json({
//       message: "Mobil berhasil ditambahkan",
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateMobil = async (req, res, next) => {
//   try {
//     const { plat_mobil } = req.params;

//     const data = await prisma.mobil.update({
//       where: { plat_mobil },
//       data: {
//         ...req.body,
//         update_date: new Date(),
//         update_by: "admin"
//       }
//     });

//     res.json({
//       message: "Mobil berhasil diupdate",
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// exports.deleteMobil = async (req, res, next) => {
//   try {
//     const { plat_mobil } = req.params;

//     await prisma.mobil.update({
//       where: { plat_mobil },
//       data: {
//         status: "Tidak Aktif",
//         update_date: new Date(),
//         update_by: "admin"
//       }
//     });

//     res.json({
//       message: "Mobil berhasil dihapus (soft delete)"
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const prisma = require("../config/prisma");

exports.getMobil = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9999;
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").replace(/\n/g, "").trim();
    const status = (req.query.status || "").trim();

    const data = await prisma.$queryRaw`
      SELECT *
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
      totalPage: Math.ceil(totalData / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getMobilDetail = async (req, res, next) => {
  try {
    const { plat_mobil } = req.params;

    if (!plat_mobil) {
      throw new Error("Plat mobil tidak valid");
    }

    const data = await prisma.mobil.findUnique({
      where: { plat_mobil }
    });

    if (!data) {
      throw new Error("Mobil tidak ditemukan");
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.createMobil = async (req, res, next) => {
  try {
    const data = await prisma.mobil.create({
      data: {
        ...req.body,
        status: "Aktif",
        created_date: new Date(),
        created_by: "admin"
      }
    });

    res.status(201).json({
      message: "Mobil berhasil ditambahkan",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMobil = async (req, res, next) => {
  try {
    const { plat_mobil } = req.params;

    if (!plat_mobil) {
      throw new Error("Plat mobil tidak valid");
    }

    const data = await prisma.mobil.update({
      where: { plat_mobil },
      data: {
        ...req.body,
        update_date: new Date(),
        update_by: "admin"
      }
    });

    res.json({
      message: "Mobil berhasil diupdate",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMobil = async (req, res, next) => {
  try {
    const { plat_mobil } = req.params;

    if (!plat_mobil) {
      throw new Error("Plat mobil tidak valid");
    }

    await prisma.mobil.update({
      where: { plat_mobil },
      data: {
        status: "Tidak Aktif",
        update_date: new Date(),
        update_by: "admin"
      }
    });

    res.json({
      message: "Mobil berhasil dihapus"
    });
  } catch (error) {
    next(error);
  }
};


