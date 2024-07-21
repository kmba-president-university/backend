const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "dev_server",
  user: "root",
  password: "satuperxdx",
  database: "db_signup",
});

// Route to check the database connection
app.get("/check-connection", (req, res) => {
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).json({
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

app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
