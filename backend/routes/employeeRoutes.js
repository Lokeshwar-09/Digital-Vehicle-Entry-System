const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// LOOKUP EMPLOYEE BY EMPLOYEE ID
router.get("/lookup", async (req, res) => {
  try {
    const { empId } = req.query;

    if (!empId) {
      return res.status(400).json({ message: "Employee ID required" });
    }

    // Find employee by employeeId or phone across any department
    const employee = await Employee.findOne({
      $or: [
        { employeeId: empId.trim() },
        { phone: empId.trim() }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Calculate age from dateOfBirth
    const today = new Date();
    const dob = new Date(employee.dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Retirement Check (Age >= 60)
    const isRetired = age >= 60;

    res.status(200).json({
      success: true,
      employee: {
        employeeId: employee.employeeId,
        name: employee.name,
        phone: employee.phone,
        department: employee.department,
        dateOfBirth: employee.dateOfBirth,
        age: age,
        isRetired: isRetired
      }
    });

  } catch (error) {
    console.error("Lookup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
