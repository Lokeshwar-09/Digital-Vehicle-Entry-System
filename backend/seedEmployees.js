const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Employee = require("./models/Employee");

dotenv.config();

const seedFromCSV = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for CSV Seeding");

    await Employee.deleteMany();
    console.log("Existing employees cleared");

    const csvPath = path.join(__dirname, "Employee_Dataset.csv");
    const csvData = fs.readFileSync(csvPath, "utf8");
    const rows = csvData.split("\n").filter(row => row.trim());

    // Skip header row
    const employees = rows.slice(1).map(row => {
      const columns = row.split(",");
      if (columns.length < 5) return null;

      return {
        employeeId: columns[0].trim(),
        name: columns[1].trim(),
        phone: columns[2].trim(),
        department: columns[3].trim(),
        dateOfBirth: new Date(columns[4].trim())
      };
    }).filter(Boolean);

    await Employee.insertMany(employees);
    console.log(`Successfully seeded ${employees.length} employees from CSV.`);
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedFromCSV();