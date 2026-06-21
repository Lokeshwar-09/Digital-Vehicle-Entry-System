const User = require("../models/User");

// CREATE USER

const createDepartmentUser =
  async (req, res) => {

    try {

      const {
        username,
        password,
        department,
      } = req.body;

      // Check Existing User

      const existingUser =
        await User.findOne({
          username,
        });

      if (existingUser) {

        return res.status(400).json({

          message:
            "User already exists",
        });
      }

      // Create User

      const user =
        new User({

          username,

          password,

          role: "department",

          department,
        });

      await user.save();

      res.status(201).json({

        message:
          "Department User Created",

        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: error.message,
      });
    }
  };

// RESET PASSWORD

const resetPassword =
  async (req, res) => {

    try {

      const { id } = req.params;

      const { password } =
        req.body;

      const updatedUser =
        await User.findByIdAndUpdate(

          id,

          {
            password,
          },

          { new: true }

        );

      res.status(200).json({

        message:
          "Password Reset Successful",

        updatedUser,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: error.message,
      });
    }
  };

// GET USERS

const getAllUsers =
  async (req, res) => {

    try {

      const users =
        await User.find();

      res.status(200).json(
        users
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: error.message,
      });
    }
  };

module.exports = {

  createDepartmentUser,

  resetPassword,

  getAllUsers,
};