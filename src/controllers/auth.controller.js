const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    /* ===============================
       1. CEK KE TABEL PEGAWAI
    =============================== */
    const pegawai = await prisma.pegawai.findFirst({
      where: {
        username,
        status: "Aktif",
      },
      include: {
        Role: true, // kalau ada relasi role
      },
    });

    if (pegawai) {
      // Jika password di-hash
      // const isMatch = await bcrypt.compare(password, pegawai.password);
      // Jika plaintext (sementara)
      const isMatch = password === pegawai.password;

      if (!isMatch) {
        return res.status(401).json({
          message: "Username atau password salah",
        });
      }

      const token = jwt.sign(
        {
          id: pegawai.id_pegawai,
          role: "pegawai",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: pegawai.id_pegawai,
          nama: pegawai.nama_pegawai,
          username: pegawai.username,
          role: "pegawai",
          role_name: pegawai.Role?.nama_role,
          lastLogin: new Date(),
        },
      });
    }

    /* ===============================
       2. CEK KE TABEL PELANGGAN
    =============================== */
    const pelanggan = await prisma.pelanggan.findFirst({
      where: {
        username,
        status: "Aktif",
      },
    });

    if (!pelanggan) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    // Jika password di-hash
    // const isMatch = await bcrypt.compare(password, pelanggan.password);
    const isMatch = password === pelanggan.password;

    if (!isMatch) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    const token = jwt.sign(
      {
        id: pelanggan.id_pelanggan,
        role: "pelanggan",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: pelanggan.id_pelanggan,
        nama: pelanggan.nama_pelanggan,
        username: pelanggan.username,
        role: "pelanggan",
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
