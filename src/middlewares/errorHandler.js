const logError = require("./logError");

module.exports = async (err, req, res, next) => {
  await logError(err, req);

  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message
  });
};
