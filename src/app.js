// src/app.js
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const graphRoutes = require("./routes/graphRoutes");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(bodyParser.json());
app.use("/api/v1", graphRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
