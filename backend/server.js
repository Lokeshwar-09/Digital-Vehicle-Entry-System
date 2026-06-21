const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const authRoutes =
  require("./routes/authRoutes");

const verificationRoutes =
  require("./routes/verificationRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

const employeeRoutes =
  require("./routes/employeeRoutes");

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

// Static Upload Folder

app.use(
  "/uploads",
  express.static("uploads")
);

// Routes

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/verification",
  verificationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/employee",
  employeeRoutes
);

// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB Connected"
    );
  })

  .catch((err) => {

    console.log(
      "MongoDB Error:",
      err
    );
  });

// Default Route

app.get("/", (req, res) => {

  res.send(
    "Backend Server Running"
  );
});

// Port

const PORT =
  process.env.PORT || 5000;

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  require("fs").appendFileSync("error_log.txt", "\n--- GLOBAL ERROR " + new Date().toISOString() + " ---\n" + (err.stack || err) + "\n");
  res.status(500).json({
    message: typeof err === "string" ? err : err.message || "Internal Server Error",
    error: err.stack || err
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
