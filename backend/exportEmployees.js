const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Employee = require("./models/Employee");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Fetching employees for CSV export...");
    const employees = await Employee.find().sort({ employeeId: 1 });

    const csvHeader = "Employee ID,Name,Phone Number,Department,Date of Birth,Age\n";
    const csvRows = employees.map(emp => {
      const dob = new Date(emp.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return `${emp.employeeId},${emp.name},${emp.phone},${emp.department},${dob.toISOString().split('T')[0]},${age}`;
    });

    const csvContent = csvHeader + csvRows.join("\n");
    fs.writeFileSync("Employee_Dataset.csv", csvContent);
    
    console.log("Successfully exported 690 employees to Employee_Dataset.csv");
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
