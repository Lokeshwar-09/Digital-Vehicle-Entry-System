import { useEffect, useState } from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

function VerificationDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [verification, setVerification] =
    useState(null);

  const [remarks, setRemarks] =
    useState("");

  // Fetch Verification
  const fetchVerification =
    async () => {

      try {

        const res =
          await axios.get(
            `http://localhost:5000/api/verification/${id}`
          );

        setVerification(res.data);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchVerification();

  }, []);

  // Update Status
  const updateStatus =
    async (status) => {

      try {

        await axios.put(
          `http://localhost:5000/api/verification/status/${id}`,
          {
            status,
            remarks,
          }
        );

        alert(
          `Vehicle ${status}`
        );

        navigate("/security");

      } catch (error) {

        console.log(error);
      }
    };

  if (!verification) {

    return (
      <div className="text-center mt-20 text-2xl">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Verification Details
        </h1>

        {/* Driver Details */}

        <div className="mb-8">

          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Driver Details
          </h2>

          <p>
            <strong>Driver Name:</strong>{" "}
            {verification.driverName}
          </p>

          <p>
            <strong>Driver Phone:</strong>{" "}
            {verification.driverPhone}
          </p>

        </div>

        {/* Vehicle Details */}

        <div className="mb-8">

          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Vehicle Details
          </h2>

          <p>
            <strong>Vehicle Number:</strong>{" "}
            {verification.vehicleNumber}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {verification.status}
          </p>

        </div>

        {/* Vendor Details */}

        <div className="mb-8">

          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Vendor Details
          </h2>

          <p>
            <strong>Company Name:</strong>{" "}
            {verification.companyName}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {verification.department}
          </p>

          <p>
            <strong>Verification ID:</strong>{" "}
            {verification.verificationId}
          </p>

        </div>

        {/* Documents */}

        <div className="mb-8">

          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Uploaded Documents
          </h2>

          <div className="space-y-3">

            <a
              href={`http://localhost:5000/uploads/${verification.aadharFile}`}
              target="_blank"
              className="block text-blue-600"
            >
              View Aadhar
            </a>

            <a
              href={`http://localhost:5000/uploads/${verification.rcBookFile}`}
              target="_blank"
              className="block text-blue-600"
            >
              View RC Book
            </a>

            <a
              href={`http://localhost:5000/uploads/${verification.drivingLicenseFile}`}
              target="_blank"
              className="block text-blue-600"
            >
              View Driving License
            </a>

            <a
              href={`http://localhost:5000/uploads/${verification.pollutionCertificateFile}`}
              target="_blank"
              className="block text-blue-600"
            >
              View Pollution Certificate
            </a>

          </div>

        </div>

        {/* Remarks */}

        <div className="mb-6">

          <label className="font-bold block mb-2">
            Security Remarks
          </label>

          <textarea
            placeholder="Enter document mismatch remarks"
            className="w-full border p-4 rounded"
            rows="4"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
          />

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <button
            onClick={() =>
              updateStatus("Approved")
            }
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Approve Entry
          </button>

          <button
            onClick={() => {

              if (!remarks) {

                alert(
                  "Please enter remarks"
                );

                return;
              }

              updateStatus("Rejected");

            }}
            className="bg-red-600 text-white px-6 py-3 rounded"
          >
            Reject Entry
          </button>

          <button
            onClick={() =>
              navigate("/security")
            }
            className="bg-gray-600 text-white px-6 py-3 rounded"
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}

export default VerificationDetails;