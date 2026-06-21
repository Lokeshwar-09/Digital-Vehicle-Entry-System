import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Simple SVG Icons
const Icons = {
  Dashboard: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Add: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  List: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Clock: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Reject: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Logout: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Car: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 10l1.5-4.5h11L19 10M4 14h16v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm3 2h.01M17 16h.01" />
    </svg>
  ),
  Upload: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Bell: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Rocket: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 15 5 15 10C15 15 12 18 12 18C12 18 9 15 9 10C9 5 12 2 12 2Z" fill="white" />
      <path d="M9 13L6 17H9" fill="white" />
      <path d="M15 13L18 17H15" fill="white" />
      <path d="M10 18L11 22L12 20L13 22L14 18H10Z" fill="#00b050" />
    </svg>
  ),
  Power: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9" />
    </svg>
  ),
  History: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  User: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  WhatsApp: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 0C5.385 0 0 5.388 0 12.035c0 2.128.552 4.195 1.6 6.02L.014 24l6.096-1.597A11.968 11.968 0 0012.031 24c6.643 0 12.031-5.387 12.031-12.035S18.674 0 12.031 0zm0 21.986a9.96 9.96 0 01-5.076-1.385l-.364-.216-3.774.989.998-3.682-.236-.376A9.957 9.957 0 011.996 12.035c0-5.545 4.512-10.05 10.035-10.05 5.54 0 10.054 4.505 10.054 10.05s-4.514 10.05-10.054 10.05zm5.518-7.534c-.302-.151-1.792-.885-2.07-.987-.278-.102-.482-.152-.686.151-.204.303-.783.987-.96 1.189-.176.202-.352.227-.655.076-1.59-.785-2.737-1.378-3.805-3.218-.216-.37.214-.343.801-1.52.076-.153.038-.286-.02-.438-.057-.152-.685-1.65-.938-2.261-.248-.596-.499-.515-.685-.524-.176-.009-.379-.01-.583-.01a1.118 1.118 0 00-.814.378c-.28.303-1.07 1.045-1.07 2.545s1.096 2.95 1.25 3.15c.15.202 2.148 3.28 5.203 4.598.726.314 1.293.501 1.737.641.728.23 1.391.197 1.916.12.585-.086 1.792-.733 2.045-1.442.253-.71.253-1.318.177-1.444-.075-.126-.279-.202-.582-.353z" />
    </svg>
  ),
};

function DepartmentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [verifications, setVerifications] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    employeeDepartment: localStorage.getItem("department") ? localStorage.getItem("department").toUpperCase() : "",
    designation: "",
    employeeMobile: "",
    employeeEmail: "",
    vendorName: "",
    contactPerson: "",
    mobileNumber: "",
    emailId: "",
    aadharNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    makeModel: "",
    color: "",
    entryDate: "",
  });

  // Files
  const [files, setFiles] = useState({
    aadhar: null,
    rcBook: null,
    drivingLicense: null,
    pollutionCertificate: null,
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [isRetired, setIsRetired] = useState(false);
  const [deptMismatch, setDeptMismatch] = useState(false);
  const [employeeFound, setEmployeeFound] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const fetchVerifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/verification/all");
      setVerifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleEmpIdLookup = useCallback(async (empId) => {
    if (empId.length < 5) {
      setLookupLoading(false);
      return;
    }
    setLookupLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/employee/lookup?empId=${empId}`);
      if (res.data.success) {
        const emp = res.data.employee;
        setEmployeeFound(true);
        setFormData(prev => ({
          ...prev,
          employeeId: emp.employeeId,
          employeeName: emp.name,
          employeeMobile: emp.phone,
        }));
        
        if (emp.isRetired) {
          setIsRetired(true);
        }

        const currentDept = formData.employeeDepartment;
        if (emp.department.toUpperCase() !== currentDept.toUpperCase()) {
          setDeptMismatch(true);
        }
      }
    } catch (error) {
      console.error("Lookup failed", error);
      if (error.response && error.response.status === 404) {
        setLookupError(`Employee not found in database.`);
      } else {
        setLookupError("Error looking up employee.");
      }
    } finally {
      setLookupLoading(false);
    }
  }, [formData.employeeDepartment]);

  // Debounced lookup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.employeeId.length >= 5) {
        handleEmpIdLookup(formData.employeeId);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [formData.employeeId, handleEmpIdLookup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "employeeId") {
      setLookupError("");
      setIsRetired(false);
      setDeptMismatch(false);
      setEmployeeFound(false);
      
      // Clear auto-filled fields when ID changes
      if (value.length < 5) {
        setFormData(prev => ({
          ...prev,
          employeeName: "",
          employeeMobile: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedFiles = [
      files.aadhar,
      files.rcBook,
      files.drivingLicense,
      files.pollutionCertificate,
    ].filter(Boolean);

    if (uploadedFiles.length < 2) {
      alert("Please upload minimum 2 documents");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      Object.keys(files).forEach((key) => {
        if (files[key]) data.append(key, files[key]);
      });

      const res = await axios.post("http://localhost:5000/api/verification/create", data);

      setSubmittedData(res.data.verification);
      fetchVerifications();

      // Reset Form
      setFormData({
        employeeId: "",
        employeeName: "",
        employeeDepartment: localStorage.getItem("department") ? localStorage.getItem("department").toUpperCase() : "",
        designation: "",
        employeeMobile: "",
        employeeEmail: "",
        vendorName: "",
        contactPerson: "",
        mobileNumber: "",
        emailId: "",
        aadharNumber: "",
        vehicleNumber: "",
        vehicleType: "",
        makeModel: "",
        color: "",
        entryDate: "",
      });
      setFiles({ aadhar: null, rcBook: null, drivingLicense: null, pollutionCertificate: null });
      setIsRetired(false);
      setDeptMismatch(false);
      setEmployeeFound(false);

    } catch (error) {
      console.error("Submission error details:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Submission Failed";
      alert(errorMsg);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleWhatsAppSend = () => {
    if (!submittedData) return;

    // Format number: remove non-digits, and auto-prepend '91' for India if it's 10 digits
    let num = submittedData.mobileNumber.replace(/\D/g, "");
    if (num.length === 10) num = "91" + num;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${submittedData.verificationId}`;

    // URL-encode the message text
    const text = encodeURIComponent(`*BDL Vendor Vehicle Gate Pass*\n\nHello *${submittedData.vendorName}*,\nYour vehicle entry request has been registered successfully.\n\n*Verification ID:* ${submittedData.verificationId}\n*Vehicle No:* ${submittedData.vehicleNumber}\n*Date:* ${submittedData.entryDate}\n\n*Show this QR Code at the Security Gate:*\n${qrUrl}`);

    // Open WhatsApp Web/App
    const whatsappUrl = `https://wa.me/${num}?text=${text}`;
    window.open(whatsappUrl, "_blank");
  };

  // Stats Calculations
  const stats = {
    total: verifications.length,
    pending: verifications.filter((v) => v.status === "Pending").length,
    approved: verifications.filter((v) => v.status === "Approved").length,
    rejected: verifications.filter((v) => v.status === "Rejected").length,
  };

  // Table Data mapping based on active tab
  const getTableData = () => {
    switch (activeTab) {
      case "my-requests":
        return verifications.filter((v) => v.status === "Pending");
      case "approved":
        return verifications.filter((v) => v.status === "Approved");
      case "rejected":
        return verifications.filter((v) => v.status === "Rejected");
      default:
        return [];
    }
  };

  return (
    <div className="h-screen flex bg-[#f8fafc] font-sans overflow-hidden">

      {/* Sidebar */}
      <div className="w-72 bg-[#0f172a] text-white flex flex-col shadow-xl z-20 relative">
        {/* Logo Area */}
        <div className="p-6 flex items-center space-x-4 border-b border-gray-700/50">
          <div className="w-14 h-14 bg-transparent border-2 border-[#1c3a3a] rounded-full flex items-center justify-center relative overflow-hidden">
            <Icons.Rocket className="w-10 h-10 absolute text-white" style={{ top: '8px' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider">BDL</h1>
            <p className="text-xs text-gray-400">Kanchanbagh</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto z-10 relative">
          <NavItem
            icon={<Icons.Dashboard className="w-5 h-5" />} label="Dashboard"
            active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={<Icons.Car className="w-5 h-5" />} label="Add New Vehicle"
            active={activeTab === "add-vehicle"} onClick={() => { setActiveTab("add-vehicle"); setSubmittedData(null); }}
          />
          <NavItem
            icon={<Icons.List className="w-5 h-5" />} label="My Requests"
            badge={stats.pending > 0 ? stats.pending : null} badgeColor="bg-orange-500 text-white rounded-full flex items-center justify-center w-6 h-6 p-0"
            active={activeTab === "my-requests"} onClick={() => setActiveTab("my-requests")}
          />
          <NavItem
            icon={<Icons.Check className="w-5 h-5" />} label="Approved Vehicles"
            active={activeTab === "approved"} onClick={() => setActiveTab("approved")}
          />
          <NavItem
            icon={<Icons.Reject className="w-5 h-5" />} label="Rejected Requests"
            active={activeTab === "rejected"} onClick={() => setActiveTab("rejected")}
          />
        </nav>

        {/* Decorative Background */}
        <div className="w-full h-40 pointer-events-none opacity-90 shrink-0 mt-4">
          <img src="/security-gate-bg.png" alt="Gate" className="w-full h-full object-cover object-center animate-pulse-slow" onError={(e) => e.target.style.display = 'none'} style={{ animationDuration: '4s' }} />
        </div>

        {/* Bottom Actions */}
        <div className="p-4 z-20 relative border-t border-gray-700/50 bg-[#0f172a]">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Icons.Power className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Digital Vehicle Entry System
          </h2>
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-500 hover:text-gray-700 transition">
              <Icons.Bell className="w-6 h-6" />
              {stats.pending > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {stats.pending}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00b050] text-white rounded-full flex items-center justify-center font-bold">
                EMP
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-800 uppercase">{localStorage.getItem("username") || "Employee"}</p>
                <p className="text-gray-500">Department</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Requests" value={stats.total} icon={<Icons.Car className="w-8 h-8 text-[#00b050]" />} subtitle="All Time" bgColor="bg-green-50" iconBg="bg-green-100" />
                <StatCard title="Pending" value={stats.pending} icon={<Icons.Clock className="w-8 h-8 text-yellow-500" />} subtitle="Awaiting Approval" bgColor="bg-white" iconBg="bg-yellow-50" />
                <StatCard title="Approved" value={stats.approved} icon={<Icons.Check className="w-8 h-8 text-[#00b050]" />} subtitle="This Month" bgColor="bg-white" iconBg="bg-green-50" />
                <StatCard title="Rejected" value={stats.rejected} icon={<Icons.Reject className="w-8 h-8 text-red-500" />} subtitle="This Month" bgColor="bg-white" iconBg="bg-red-50" />
              </div>
            </div>
          )}

          {/* ADD NEW VEHICLE TAB */}
          {activeTab === "add-vehicle" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <Icons.Car className="w-7 h-7 mr-3 text-[#00b050]" />
                Add New Vendor Vehicle
              </h3>

              {!submittedData ? (
                <form onSubmit={handleSubmit} className="space-y-10">

                  {/* Employee Details (Full Width) */}
                  <div>
                    <h4 className="text-2xl font-bold text-[#7949FF] mb-6">Employee Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative">
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required className={`w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-[#7949FF] focus:border-[#7949FF] outline-none text-gray-700 ${lookupLoading ? 'pr-12' : ''}`} placeholder="Employee ID or Mobile Number" />
                        {lookupLoading && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7949FF]"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} required className="w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-[#7949FF] focus:border-[#7949FF] outline-none text-gray-700 bg-gray-50" placeholder="Employee Name" readOnly />
                      </div>
                      <div>
                        <input type="text" name="employeeMobile" value={formData.employeeMobile} onChange={handleChange} required className="w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-[#7949FF] focus:border-[#7949FF] outline-none text-gray-700 bg-gray-50" placeholder="Mobile Number" readOnly />
                      </div>
                      <div>
                        <input type="text" name="employeeDepartment" value={formData.employeeDepartment} readOnly required className="w-full border-gray-200 border rounded-xl p-4 bg-gray-100 text-gray-500 font-semibold uppercase cursor-not-allowed outline-none" placeholder="Department" />
                      </div>
                      <div>
                        <select name="designation" value={formData.designation} onChange={handleChange} required className="w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-[#7949FF] focus:border-[#7949FF] outline-none text-gray-700 bg-white">
                          <option value="" disabled>Designation</option>
                          <option value="AGM">AGM</option>
                          <option value="DGM">DGM</option>
                          <option value="GM">GM</option>
                        </select>
                      </div>
                      <div>
                        <input type="email" name="employeeEmail" value={formData.employeeEmail} onChange={handleChange} required className="w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-[#7949FF] focus:border-[#7949FF] outline-none text-gray-700" placeholder="Email ID" />
                      </div>
                    </div>

                    {lookupError && <p className="text-red-500 text-sm mt-2">{lookupError}</p>}

                    {isRetired && (
                      <div className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center space-x-4 animate-bounce">
                        <div className="bg-red-500 text-white p-3 rounded-full shadow-lg">
                          <Icons.Reject className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-red-700 uppercase tracking-wider">Request Blocked!</h4>
                          <p className="text-red-600 font-medium italic">Employee has reached retirement age (60+). Vehicle entry requests are not allowed.</p>
                        </div>
                      </div>
                    )}

                    {deptMismatch && (
                      <div className="mt-6 p-6 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center space-x-4">
                        <div className="bg-orange-500 text-white p-3 rounded-full shadow-lg">
                          <Icons.Reject className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-orange-700 uppercase tracking-wider">Department Mismatch!</h4>
                          <p className="text-orange-600 font-medium italic">This employee belongs to a different department. You can only submit requests for employees in your department ({formData.employeeDepartment}).</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {employeeFound && !isRetired && !deptMismatch && (
                    <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t pt-8">
                    {/* Left Column - Text Details */}
                    <div className="space-y-8">
                      {/* Vendor Details */}
                      <div>
                        <h4 className="text-lg font-bold text-[#00b050] mb-4 border-b pb-2 flex items-center">
                          <Icons.User className="w-5 h-5 mr-2" /> Vendor Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name / Company *</label>
                            <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} required className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700" placeholder="Enter vendor name or company" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700" placeholder="Enter contact person name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700" placeholder="Enter mobile number" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                            <input type="email" name="emailId" value={formData.emailId} onChange={handleChange} className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700" placeholder="Enter email id (optional)" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number *</label>
                            <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700" placeholder="Enter 12-digit Aadhaar Number" maxLength="12" pattern="\d{12}" title="Please enter valid 12 digit Aadhaar number" />
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div>
                        <h4 className="text-lg font-bold text-[#00b050] mb-4 border-b pb-2 flex items-center mt-6">
                          <Icons.Car className="w-5 h-5 mr-2" /> Vehicle Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
                            <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700" placeholder="TS 09 AB 1234" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700 bg-white">
                              <option value="" disabled>Select vehicle type</option>
                              <option value="2-Wheeler">2-Wheeler</option>
                              <option value="4-Wheeler">4-Wheeler</option>
                              <option value="Heavy Vehicle">Heavy Vehicle</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Make / Model</label>
                            <input type="text" name="makeModel" value={formData.makeModel} onChange={handleChange} className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700" placeholder="Enter make or model" />
                          </div>
                          <div className="flex space-x-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                              <select name="color" value={formData.color} onChange={handleChange} className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700 bg-white">
                                <option value="" disabled>Select color</option>
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Silver">Silver</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Entry Date *</label>
                              <input type="date" name="entryDate" value={formData.entryDate} onChange={handleChange} required className="w-full border-gray-300 border rounded-lg p-3 focus:ring-[#00b050] focus:border-[#00b050] outline-none text-gray-700 bg-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Document Uploads */}
                    <div>
                      <h4 className="text-lg font-bold text-[#00b050] mb-4 border-b pb-2">Required Documents</h4>
                      <p className="text-sm text-gray-500 mb-4">Upload at least 2 documents.</p>

                      <div className="space-y-4">
                        <FileUploadBox label="Aadhaar Card" name="aadhar" onChange={handleFileChange} file={files.aadhar} />
                        <FileUploadBox label="RC Book" name="rcBook" onChange={handleFileChange} file={files.rcBook} />
                        <FileUploadBox label="Driving Licence" name="drivingLicense" onChange={handleFileChange} file={files.drivingLicense} />
                        <FileUploadBox label="Pollution Certificate" name="pollutionCertificate" onChange={handleFileChange} file={files.pollutionCertificate} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t">
                    <button type="submit" className="bg-[#00b050] hover:bg-[#009040] text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center shadow-lg shadow-green-500/30">
                      Submit Request <Icons.Add className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                  </>
                  )}
                </form>
              ) : (
                <div className="bg-gray-50 border border-green-200 rounded-xl p-10 flex flex-col items-center text-center max-w-2xl mx-auto mt-8 shadow-inner">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Icons.Check className="w-8 h-8 text-[#00b050]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted Successfully!</h3>
                  <p className="text-gray-500 mb-8">After successful submission, you will receive a</p>

                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h4 className="text-[#00b050] font-bold text-lg mb-4">Unique Verification Code</h4>
                    <div className="w-48 h-48 mx-auto bg-white border-4 border-[#00b050] p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
                      {submittedData?.verificationId ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${submittedData.verificationId}`}
                          alt="QR Code"
                          className="w-[130px] h-[130px]"
                        />
                      ) : (
                        <div className="w-[130px] h-[130px] bg-gray-100 flex items-center justify-center">Loading...</div>
                      )}
                      <span className="font-mono text-sm font-bold tracking-widest text-gray-800 mt-2">
                        {submittedData?.verificationId || "Generating..."}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-8">
                    <button
                      onClick={handleWhatsAppSend}
                      className="bg-[#25D366] hover:bg-[#1ebd5a] text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center shadow-lg shadow-green-500/20"
                    >
                      <Icons.WhatsApp className="w-5 h-5 mr-2" />
                      Send to Vendor on WhatsApp
                    </button>
                  </div>

                  <button onClick={() => setSubmittedData(null)} className="mt-6 text-[#00b050] font-semibold hover:underline">
                    + Submit Another Vehicle
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LIST TABS (My Requests, Pending, Approved, Rejected) */}
          {["my-requests", "pending", "approved", "rejected"].includes(activeTab) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800 capitalize">
                  {activeTab.replace('-', ' ')}
                </h3>
                <span className="bg-[#00b050]/10 text-[#00b050] py-1 px-3 rounded-full text-sm font-bold">
                  Total: {getTableData().length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b">
                      <th className="p-4 font-semibold">Ver ID</th>
                      <th className="p-4 font-semibold">Vendor Name</th>
                      <th className="p-4 font-semibold">Vehicle No.</th>
                      <th className="p-4 font-semibold">Mobile No.</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getTableData().length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-400">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      getTableData().map((req) => (
                        <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-semibold text-gray-800">{req.verificationId}</td>
                          <td className="p-4 text-gray-600">{req.vendorName}</td>
                          <td className="p-4 text-gray-600 font-medium">{req.vehicleNumber}</td>
                          <td className="p-4 text-gray-600">{req.mobileNumber}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                              }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Subcomponents
function NavItem({ icon, label, active, onClick, badge, badgeColor }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${active
          ? "bg-[#00b050] text-white shadow-md shadow-green-500/20"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge && (
        <span className={`${badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, icon, subtitle, bgColor, iconBg }) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between`}>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-gray-800 mb-1">{value}</h4>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function FileUploadBox({ label, name, onChange, file }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center border border-gray-100">
          <Icons.Upload className="w-5 h-5 text-[#00b050]" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">{label}</p>
          <p className="text-xs text-gray-500">{file ? file.name : "Upload document copy"}</p>
        </div>
      </div>
      <div>
        <label className="cursor-pointer bg-white border border-gray-300 hover:border-[#00b050] hover:text-[#00b050] text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          {file ? "Change" : "Upload"}
          <input type="file" name={name} onChange={onChange} className="hidden" />
        </label>
      </div>
    </div>
  );
}

export default DepartmentDashboard;