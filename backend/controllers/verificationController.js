const Verification = require("../models/Verification");

const sendWhatsAppMessage =
  require("../utils/sendWhatsApp");

// CREATE VERIFICATION

const createVerification =
  async (req, res) => {

    try {

      // COUNT UPLOADED FILES

      const uploadedFiles = [

        req.files?.aadhar?.[0],

        req.files?.rcBook?.[0],

        req.files?.drivingLicense?.[0],

        req.files?.pollutionCertificate?.[0],

      ].filter(Boolean);

      // MINIMUM 2 FILES REQUIRED

      if (uploadedFiles.length < 2) {

        return res.status(400).json({

          message:
            "Minimum 2 documents are required",

        });
      }

      // GENERATE UNIQUE ID

      const uniqueId =

        "BDL" +

        Math.floor(

          1000000 +

          Math.random() * 9000000
        );

      // CREATE VERIFICATION

      const verification =
        new Verification({

          verificationId: uniqueId,

          employeeId:
            req.body.employeeId,

          employeeName:
            req.body.employeeName,

          employeeDepartment:
            req.body.employeeDepartment,

          designation:
            req.body.designation,

          employeeMobile:
            req.body.employeeMobile,

          employeeEmail:
            req.body.employeeEmail,

          vendorName:
            req.body.vendorName,

          contactPerson:
            req.body.contactPerson,

          mobileNumber:
            req.body.mobileNumber,

          emailId:
            req.body.emailId,

          vehicleNumber:
            req.body.vehicleNumber,

          vehicleType:
            req.body.vehicleType,

          makeModel:
            req.body.makeModel,

          color:
            req.body.color,

          entryDate:
            req.body.entryDate,

          aadharNumber:
            req.body.aadharNumber,

          status: "Pending",

          remarks: "",

          aadharFile:
            req.files?.aadhar?.[0]
              ?.filename || "",

          rcBookFile:
            req.files?.rcBook?.[0]
              ?.filename || "",

          drivingLicenseFile:
            req.files?.drivingLicense?.[0]
              ?.filename || "",

          pollutionCertificateFile:
            req.files?.pollutionCertificate?.[0]
              ?.filename || "",

        });

      // SAVE TO DATABASE

      await verification.save();

      // SEND WHATSAPP MESSAGE

      try {

        await sendWhatsAppMessage(

          req.body.mobileNumber,

          uniqueId
        );

      } catch (whatsappError) {

        console.log(

          "WhatsApp Send Error:",

          whatsappError.message
        );
      }

      // SUCCESS RESPONSE

      res.status(201).json({

        message:
          "Verification Submitted Successfully",

        verification,
      });

    } catch (error) { require("fs").appendFileSync("error_log.txt", "\n--- " + new Date().toISOString() + " ---\n" + error.stack + "\nRequestBody: " + JSON.stringify(req.body) + "\nFiles: " + JSON.stringify(req.files) + "\n"); console.error("Verification Creation Error:", error); res.status(500).json({ message: error.message || "Failed to create verification record", error: error.stack }); }
  };
// GET ALL VERIFICATIONS

const getAllVerifications =
  async (req, res) => {

    try {

      const search =
        req.query.search || "";

      const verifications =
        await Verification.find({

          $or: [

            {
              verificationId: {
                $regex: search,
                $options: "i",
              },
            },

            {
              vehicleNumber: {
                $regex: search,
                $options: "i",
              },
            },

            {
              vendorName: {
                $regex: search,
                $options: "i",
              },
            },

          ],

        });

      res.status(200).json(
        verifications
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: error.message,
      });
    }
  };

// GET SINGLE VERIFICATION

const getVerificationById =
  async (req, res) => {

    try {

      const verification =
        await Verification.findById(
          req.params.id
        );

      res.status(200).json(
        verification
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: error.message,
      });
    }
  };

// UPDATE STATUS

const updateVerificationStatus =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        status,
        remarks,
      } = req.body;

      const updatedVerification =
        await Verification.findByIdAndUpdate(

          id,

          {
            status,
            remarks,
          },

          { new: true }

        );

      res.status(200).json({

        message:
          "Status Updated",

        updatedVerification,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: error.message,
      });
    }
  };

module.exports = {

  createVerification,

  getAllVerifications,

  getVerificationById,

  updateVerificationStatus,
};
