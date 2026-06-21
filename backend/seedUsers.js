require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const users = [
  // SECURITY
  {
    username: "security",
    password: "security123",
    role: "security",
  },
  // DEPARTMENTS
  { username: "corporate", password: "corporate123", role: "department", department: "CORPORATE" },
  { username: "milan", password: "milan123", role: "department", department: "MILAN" },
  { username: "services", password: "services123", role: "department", department: "SERVICES & OTHERS - KBU" },
  { username: "de", password: "de123", role: "department", department: "D&E" },
  { username: "electronics", password: "electronics123", role: "department", department: "ELECTRONICS" },
  { username: "prithvi", password: "prithvi123", role: "department", department: "PRITHVI" },
  { username: "cdo", password: "cdo123", role: "department", department: "CDO" },
  { username: "akash", password: "akash123", role: "department", department: "AKASH" },
  { username: "cped", password: "cped123", role: "department", department: "CPED" },
  { username: "cpigmp", password: "cpigmp123", role: "department", department: "CP-IGMP" },
  { username: "sfd", password: "sfd123", role: "department", department: "SFD" },
  { username: "nag", password: "nag123", role: "department", department: "NAG" },
  { username: "gsd", password: "gsd123", role: "department", department: "GSD" },
  { username: "refurbishment", password: "refurbishment123", role: "department", department: "REFURBISHMENT" },
  { username: "lrsam", password: "lrsam123", role: "department", department: "LR-SAM" },
  { username: "b05", password: "b05123", role: "department", department: "B-05" },
  { username: "vizag", password: "vizag123", role: "department", department: "VIZAG UNIT" },
  { username: "konkurs", password: "konkurs123", role: "department", department: "KONKURS-M" },
  { username: "components", password: "components123", role: "department", department: "COMPONENTS PRODUCTION" },
  { username: "bg", password: "bg123", role: "department", department: "SERVICES & OTHERS - BG" },
  { username: "invar", password: "invar123", role: "department", department: "INVAR" },
  { username: "launcher", password: "launcher123", role: "department", department: "LAUNCHER" },
  { username: "astra", password: "astra123", role: "department", department: "ASTRA" }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bdl_security_db");
    console.log("Connected to DB");

    // Clear existing users to prevent duplicates during seeding
    await User.deleteMany({});
    console.log("Cleared existing users");

    const salt = await bcrypt.genSalt(10);

    for (let u of users) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const newUser = new User({
        username: u.username,
        password: hashedPassword,
        role: u.role,
        department: u.department || "General",
        // Force the lastPasswordChangeDate to 31 days ago for testing
        lastPasswordChangeDate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) 
      });
      await newUser.save();
      console.log(`Saved user: ${u.username}`);
    }

    console.log("Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
};

seedDB();
