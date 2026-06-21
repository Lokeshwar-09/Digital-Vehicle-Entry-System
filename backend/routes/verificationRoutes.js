const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const verificationController =
  require("../controllers/verificationController");

// CREATE
router.post(
  "/create",

  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "rcBook", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 },
    {
      name: "pollutionCertificate",
      maxCount: 1,
    },
  ]),

  verificationController.createVerification
);

// GET ALL
router.get(
  "/all",
  verificationController.getAllVerifications
);

// UPDATE STATUS
router.put(
  "/status/:id",
  verificationController.updateVerificationStatus
);

module.exports = router;