// require("dotenv").config();
// const express = require("express");
// const cors = require("cors"); // Import CORS
// const mobilRoute = require("./routes/mobil.route");
// const pelangganRoute = require("./routes/pelanggan.route");
// const transaksiRoute = require("./routes/transaksi.route");
// const errorHandler = require("./middlewares/errorHandler");
// const authRoute = require("./routes/auth.route");

// const app = express();


// app.use(cors({
//   origin: ["http://localhost:3000"], 
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json()); 
// app.use("/auth", authRoute);

// app.use("/mobil", mobilRoute);
// app.use("/pelanggan", pelangganRoute);
// app.use("/transaksi", transaksiRoute);

// app.use(errorHandler);

// app.use((err, req, res, next) => {
//   res.status(500).json({
//     message: "Internal Server Error"
//   });
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running di http://localhost:${PORT}`);
// });



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const mobilRoute = require("./routes/mobil.route");
// const pelangganRoute = require("./routes/pelanggan.route");
// const transaksiRoute = require("./routes/transaksi.route");
// const authRoute = require("./routes/auth.route");
// const errorHandler = require("./middlewares/errorHandler");

// const app = express();

// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "http://172.20.10.4:3000",
//     "https://rencarbarokahv2.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// }));

// app.use(express.json());

// // Routes
// app.use("/auth", authRoute);
// app.use("/mobil", mobilRoute);
// app.use("/pelanggan", pelangganRoute);
// app.use("/transaksi", transaksiRoute);

// // Error handler
// app.use(errorHandler);

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: "Internal Server Error" });
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`
// Backend running:
// - http://localhost:${PORT}
// - http://172.20.10.4:${PORT}
// `);
// });


const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

const mobilRoute = require("./routes/mobil.route");
const pelangganRoute = require("./routes/pelanggan.route");
const transaksiRoute = require("./routes/transaksi.route");
const authRoute = require("./routes/auth.route");
const errorHandler = require("./middlewares/errorHandler");


app.use("/auth", authRoute);
app.use("/mobil", mobilRoute);
app.use("/pelanggan", pelangganRoute);
app.use("/transaksi", transaksiRoute);

app.use(errorHandler);

 app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Backend Vercel running 🚀");
});

module.exports = app;

