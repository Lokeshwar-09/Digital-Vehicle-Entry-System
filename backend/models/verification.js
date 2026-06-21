const mongoose = require("mongoose");

const verificationSchema =
  new mongoose.Schema(
    {

      verificationId: {
        type: String,
      },

      employeeId: {
        type: String,
      },

      aadharNumber: {
        type: String,
        required: true,
      },

      employeeName: {
        type: String,
      },

      employeeDepartment: {
        type: String,
      },

      designation: {
        type: String,
      },

      employeeMobile: {
        type: String,
      },

      employeeEmail: {
        type: String,
      },

      vendorName: {
        type: String,
        required: true,
      },

      contactPerson: {
        type: String,
      },

      mobileNumber: {
        type: String,
        required: true,
      },

      emailId: {
        type: String,
      },

      vehicleNumber: {
        type: String,
        required: true,
      },

      vehicleType: {
        type: String,
        required: true,
      },

      makeModel: {
        type: String,
      },

      color: {
        type: String,
      },

      entryDate: {
        type: String,
        required: true,
      },

      aadharFile: {
        type: String,
      },

      rcBookFile: {
        type: String,
      },

      drivingLicenseFile: {
        type: String,
      },

      pollutionCertificateFile: {
        type: String,
      },

      status: {
        type: String,
        default: "Pending",
      },

      remarks: {
        type: String,
        default: "",
      },

    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Verification",
    verificationSchema
  );