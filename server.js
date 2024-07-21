const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Route to check the database connection
app.get("/check-connection", (req, res) => {
  db.connect((err) => {
    if (err) { 
      console.error("Error connecting to the database:", err);
      return res 
        .status(500)
        .json({
          status: "Error",
          message: "Failed to connect to the database",
          error: err,
        });
    }
    console.log("Connected to the database");
    return res
      .status(200)
      .json({ status: "Success", message: "Connected to the database" });
  });
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
