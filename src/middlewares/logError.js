// const prisma = require("../config/prisma");

// module.exports = async (err, req) => {
//   await prisma.errorLog.create({
//     data: {
//       endpoint: req.originalUrl,
//       method: req.method,
//       error_message: err.message,
//       stack_trace: err.stack
//     }
//   });
// };

const prisma = require("../config/prisma");

module.exports = async (err, req, res, next) => {
  try {
    await prisma.errorLog.create({
      data: {
        endpoint: req.originalUrl || "-",
        method: req.method || "-",
        error_message: err.message || "Unknown error",
        stack_trace: err.stack || "-"
      }
    });
  } catch (e) {
    console.error("Gagal simpan ErrorLog:", e.message);
  }

  next(err); 
};
