require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const auth = require("./routes/auth");
const donors = require("./routes/donors");
const recipients = require("./routes/recipients");
const contact = require("./routes/contact");
const notifications = require("./routes/notifications");
const admin = require("./routes/admin");

const app = express();
app.use(helmet());
const allowedOrigins = new Set([
  process.env.CLIENT_URL || "https://lifely-frontend.onrender.com",
  "https://lifely-frontend.onrender.com"
]);
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/api/health", (_, res) => res.json({ ok: true, service: "lifely-api" }));
app.use("/api/auth", auth);
app.use("/api/donors", donors);
app.use("/api/recipients", recipients);
app.use("/api/contact-requests", contact);
app.use("/api/notifications", notifications);
app.use("/api/admin", admin);
app.get("/",(req, res) => res.send("Lifely backend API is running."));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Something went wrong." });
});

const port = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lifely")
  .then(() => app.listen(port, () => console.log(`Lifely API running on ${port}`)))
  .catch(err => { console.error("MongoDB connection failed:", err.message); process.exit(1); });
