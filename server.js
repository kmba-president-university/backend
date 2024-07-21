const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust as needed
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Route to check the database connection
app.get("/check-connection", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).json({
        status: "Error",
        message: "Failed to connect to the database",
        error: err,
      });
    }
    console.log("Connected to the database");
    connection.release(); // Release connection back to the pool
    return res
      .status(200)
      .json({ status: "Success", message: "Connected to the database" });
  });
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];

  pool.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({
          status: "Error",
          message: "Error executing query",
          error: err,
        });
    }
    return res.json(data);
  });
});

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
