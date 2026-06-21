const express =
  require("express");

const {

  createDepartmentUser,

  resetPassword,

  getAllUsers,

} = require(
  "../controllers/adminController"
);

const router =
  express.Router();

// Create Department User

router.post(
  "/create-user",
  createDepartmentUser
);

// Reset Password

router.put(
  "/reset-password/:id",
  resetPassword
);

// Get Users

router.get(
  "/users",
  getAllUsers
);

module.exports =
  router;