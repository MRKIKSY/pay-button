require("dotenv").config();
const express = require("express");
const path = require("path");

const payRoutes = require("./routes/pay");

const app = express();

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORRECT STATIC PATH
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));



// Paystack success page
app.get("/paystack-success", (req, res) => {
  res.sendFile(path.join(publicPath, "paystack-success.html"));
});


// API routes
app.use("/pay", payRoutes);

// ✅ ROOT ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
