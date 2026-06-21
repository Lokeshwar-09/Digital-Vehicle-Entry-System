import { useEffect, useState } from "react";

import axios from "axios";

function AdminDashboard() {

  // Verification Data

  const [verifications,
    setVerifications] =
    useState([]);

  // Users

  const [users,
    setUsers] =
    useState([]);

  // Logs

  const [logs,
    setLogs] =
    useState([]);

  // Create User Form

  const [userData,
    setUserData] =
    useState({

      username: "",

      password: "",

      department: "",
    });

  // Fetch Verifications

  const fetchData =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/verification/all"
          );

        setVerifications(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // Fetch Users

  const fetchUsers =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/users"
          );

        setUsers(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // Fetch Logs

  const fetchLogs =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/logs"
          );

        setLogs(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchData();

    fetchUsers();

    fetchLogs();

  }, []);

  // Create User

  const createUser =
    async () => {

      try {

        await axios.post(
          "http://localhost:5000/api/admin/create-user",

          userData
        );

        alert(
          "Department User Created"
        );

        fetchUsers();

        fetchLogs();

        setUserData({

          username: "",

          password: "",

          department: "",
        });

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message
        );
      }
    };

  // Stats

  const total =
    verifications.length;

  const approved =
    verifications.filter(
      (item) =>
        item.status ===
        "Approved"
    ).length;

  const rejected =
    verifications.filter(
      (item) =>
        item.status ===
        "Rejected"
    ).length;

  const pending =
    verifications.filter(
      (item) =>
        item.status ===
        "Pending"
    ).length;

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Title */}

        <h1 className="text-4xl font-bold text-center mb-10">

          Admin Dashboard

        </h1>

        {/* Create User */}

        <div className="bg-white p-6 rounded-lg shadow mb-10">

          <h2 className="text-2xl font-bold mb-6">

            Create Department User

          </h2>

          <div className="grid grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Username"
              className="border p-3 rounded"
              value={userData.username}
              onChange={(e) =>
                setUserData({

                  ...userData,

                  username:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Password"
              className="border p-3 rounded"
              value={userData.password}
              onChange={(e) =>
                setUserData({

                  ...userData,

                  password:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Department"
              className="border p-3 rounded"
              value={userData.department}
              onChange={(e) =>
                setUserData({

                  ...userData,

                  department:
                    e.target.value,
                })
              }
            />

          </div>

          <button
            onClick={createUser}
            className="bg-blue-600 text-white px-6 py-3 rounded mt-6"
          >

            Create User

          </button>

        </div>

        {/* User Table */}

        <div className="bg-white p-6 rounded-lg shadow mb-10">

          <h2 className="text-2xl font-bold mb-6">

            Department Users

          </h2>

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-200">

                <th className="p-3 border">
                  Username
                </th>

                <th className="p-3 border">
                  Role
                </th>

                <th className="p-3 border">
                  Department
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user._id}
                  className="text-center"
                >

                  <td className="p-3 border">

                    {user.username}

                  </td>

                  <td className="p-3 border">

                    {user.role}

                  </td>

                  <td className="p-3 border">

                    {user.department || "-"}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Monitoring Cards */}

        <div className="grid grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-lg shadow text-center">

            <h2 className="text-2xl font-bold">
              {total}
            </h2>

            <p className="text-gray-600 mt-2">
              Total Requests
            </p>

          </div>

          <div className="bg-green-600 text-white p-6 rounded-lg shadow text-center">

            <h2 className="text-2xl font-bold">
              {approved}
            </h2>

            <p className="mt-2">
              Approved
            </p>

          </div>

          <div className="bg-red-600 text-white p-6 rounded-lg shadow text-center">

            <h2 className="text-2xl font-bold">
              {rejected}
            </h2>

            <p className="mt-2">
              Rejected
            </p>

          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow text-center">

            <h2 className="text-2xl font-bold">
              {pending}
            </h2>

            <p className="mt-2">
              Pending
            </p>

          </div>

        </div>

        {/* Verification Table */}

        <div className="bg-white rounded-lg shadow overflow-x-auto mb-10">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-blue-600 text-white">

                <th className="p-4 border">
                  Unique ID
                </th>

                <th className="p-4 border">
                  Driver
                </th>

                <th className="p-4 border">
                  Vehicle
                </th>

                <th className="p-4 border">
                  Department
                </th>

                <th className="p-4 border">
                  Status
                </th>

                <th className="p-4 border">
                  Remarks
                </th>

              </tr>

            </thead>

            <tbody>

              {verifications.map((item) => (

                <tr
                  key={item._id}
                  className="text-center border-b"
                >

                  <td className="p-4 border font-bold text-blue-600">

                    {item.verificationId}

                  </td>

                  <td className="p-4 border">

                    {item.driverName}

                  </td>

                  <td className="p-4 border">

                    {item.vehicleNumber}

                  </td>

                  <td className="p-4 border">

                    {item.department}

                  </td>

                  <td className="p-4 border">

                    <span
                      className={`px-4 py-2 rounded text-white ${
                        item.status === "Approved"
                          ? "bg-green-600"
                          : item.status === "Rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >

                      {item.status}

                    </span>

                  </td>

                  <td className="p-4 border">

                    {item.remarks || "-"}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Logs */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-2xl font-bold mb-6">

            System Logs

          </h2>

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-200">

                <th className="p-3 border">
                  User
                </th>

                <th className="p-3 border">
                  Action
                </th>

                <th className="p-3 border">
                  Verification ID
                </th>

                <th className="p-3 border">
                  Date
                </th>

                <th className="p-3 border">
                  Time
                </th>

              </tr>

            </thead>

            <tbody>

              {logs.map((log) => (

                <tr
                  key={log._id}
                  className="text-center"
                >

                  <td className="p-3 border">

                    {log.user}

                  </td>

                  <td className="p-3 border">

                    {log.action}

                  </td>

                  <td className="p-3 border">

                    {log.verificationId}

                  </td>

                  <td className="p-3 border">

                    {log.date}

                  </td>

                  <td className="p-3 border">

                    {log.time}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;