import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Tesseract from "tesseract.js";

// Simple SVG Icons
const Icons = {
  Dashboard: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
  Car: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 10l1.5-4.5h11L19 10M4 14h16v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm3 2h.01M17 16h.01" />
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
  QrCode: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),
};

function SecurityDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [verifications, setVerifications] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [search, setSearch] = useState("");
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isAadhaarScanning, setIsAadhaarScanning] = useState(false);
  const [aadhaarStatus, setAadhaarStatus] = useState("pending"); // 'pending', 'matched', 'mismatched'

  const handleScanSuccess = (decodedText) => {
    setIsScanning(false);
    const match = verifications.find(v => v.verificationId === decodedText);
    if (match) {
      setSelectedData(match);
      setAadhaarStatus("pending");
    } else {
      alert("Verification ID not found: " + decodedText);
    }
  };

  const handleAadhaarScanSuccess = (decodedText) => {
    setIsAadhaarScanning(false);
    if (!selectedData || !selectedData.aadharNumber) {
      setAadhaarStatus("mismatched");
      return;
    }
    
    // Check if the scanned text contains the Aadhaar number
    if (decodedText.includes(selectedData.aadharNumber)) {
      setAadhaarStatus("matched");
    } else {
      setAadhaarStatus("mismatched");
    }
  };

  const fetchVerifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/verification/all?search=${search}`);
      setVerifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [search]);

  const updateStatus = async (id, status, remarksText = "") => {
    try {
      await axios.put(`http://localhost:5000/api/verification/status/${id}`, {
        status,
        remarks: remarksText,
      });
      alert(`Vehicle ${status}`);
      setSelectedData(null);
      setAadhaarStatus("pending");
      fetchVerifications();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Submission Failed");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
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
      case "requests":
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
            icon={<Icons.List className="w-5 h-5" />} label="Requests" 
            badge={stats.pending > 0 ? stats.pending : null} badgeColor="bg-orange-500 text-white rounded-full flex items-center justify-center w-6 h-6 p-0"
            active={activeTab === "requests"} onClick={() => setActiveTab("requests")} 
          />
          <NavItem 
            icon={<Icons.Check className="w-5 h-5" />} label="Approved Requests" 
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
            <button 
              onClick={() => setIsScanning(true)}
              className="bg-[#00b050] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg shadow-green-500/30 transition-colors"
            >
              <Icons.QrCode className="w-5 h-5 mr-2" />
              Scan QR
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                SEC
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-800">{localStorage.getItem("username") || "Security Officer"}</p>
                <p className="text-gray-500">Security Dept</p>
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

          {/* REQUESTS LIST TABS */}
          {activeTab !== "dashboard" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeTab.replace('-', ' ')}
                </h3>
                
                {/* Search */}
                <div className="relative w-72">
                  <input
                    type="text"
                    placeholder="Search ID, Name, Vehicle..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00b050]"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                        <th className="p-4 font-semibold">Verification ID</th>
                        <th className="p-4 font-semibold">Vendor Name</th>
                        <th className="p-4 font-semibold">Vehicle No.</th>
                        <th className="p-4 font-semibold">Department</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTableData().length > 0 ? getTableData().map((item) => (
                        <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-800">{item.verificationId}</td>
                          <td className="p-4 text-gray-600">{item.vendorName || item.driverName || "-"}</td>
                          <td className="p-4 text-gray-600">{item.vehicleNumber || "Not Specified"}</td>
                          <td className="p-4 text-gray-600">{item.employeeDepartment || item.department || "-"}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => { setSelectedData(item); setAadhaarStatus("pending"); }}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                            >
                              Verify Details →
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-gray-400">
                            No requests found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Verification Details Popup */}
      {selectedData && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">Verification Details</h2>
              <button onClick={() => setSelectedData(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Unique ID</p>
                  <p className="font-semibold text-gray-800">{selectedData.verificationId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                    selectedData.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    selectedData.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedData.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Entry Date</p>
                  <p className="font-semibold text-gray-800">{selectedData.entryDate ? new Date(selectedData.entryDate).toLocaleDateString() : "-"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Vendor / Employee</p>
                  <p className="font-semibold text-gray-800">{selectedData.vendorName || selectedData.driverName || "-"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mobile / Contact</p>
                  <p className="font-semibold text-gray-800">{selectedData.mobileNumber || selectedData.driverPhone || "-"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Department</p>
                  <p className="font-semibold text-gray-800">{selectedData.employeeDepartment || selectedData.department || "-"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Vehicle Number</p>
                  <p className="font-semibold text-gray-800">{selectedData.vehicleNumber}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Vehicle Type</p>
                  <p className="font-semibold text-gray-800">{selectedData.vehicleType || "Not Specified"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Color / Make</p>
                  <p className="font-semibold text-gray-800">{selectedData.color || "-"} / {selectedData.makeModel || "-"}</p>
                </div>
              </div>

              {selectedData.remarks && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-xs text-red-500 uppercase font-bold mb-1">Rejection Remarks</p>
                  <p className="text-red-700">{selectedData.remarks}</p>
                </div>
              )}

              {/* Documents */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Uploaded Documents</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {['aadharFile', 'rcBookFile', 'drivingLicenseFile', 'pollutionCertificateFile'].map((fileKey, idx) => {
                    const labels = ['Aadhaar', 'RC Book', 'License', 'Pollution'];
                    const label = labels[idx];
                    const hasFile = selectedData[fileKey];

                    return (
                      <div key={fileKey} className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${hasFile ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        {hasFile ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-800 mb-2">{label}</span>
                            <a href={`http://localhost:5000/uploads/${selectedData[fileKey]}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View Document</a>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-500">{label}</span>
                            <span className="text-xs text-gray-400 mt-2">Not Uploaded</span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Sticky Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 flex justify-between items-center rounded-b-2xl">
              <div className="flex items-center space-x-3">
                {selectedData.status === "Pending" && (
                  <>
                    <span className="text-sm font-bold text-gray-700">Aadhaar Status:</span>
                    {aadhaarStatus === "pending" && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Pending Scan</span>}
                    {aadhaarStatus === "matched" && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center"><Icons.Check className="w-3 h-3 mr-1"/> Matched</span>}
                    {aadhaarStatus === "mismatched" && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center"><Icons.Reject className="w-3 h-3 mr-1"/> Mismatched</span>}
                    
                    {aadhaarStatus !== "matched" && (
                      <button onClick={() => setIsAadhaarScanning(true)} className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center transition">
                        <Icons.QrCode className="w-4 h-4 mr-2" /> Scan Aadhaar
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setSelectedData(null)} className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition">
                  Close
                </button>
                {selectedData.status === "Pending" && (
                  <>
                    <button onClick={() => setShowRejectPopup(true)} className="px-6 py-2 rounded-lg font-bold text-red-600 bg-red-100 hover:bg-red-200 transition">
                      Reject Entry
                    </button>
                    {aadhaarStatus === "matched" && (
                      <button onClick={() => updateStatus(selectedData._id, "Approved")} className="px-6 py-2 rounded-lg font-bold text-white bg-[#00b050] hover:bg-green-600 transition shadow-lg shadow-green-500/30">
                        Approve Entry
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Reject Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reject Vehicle Entry</h2>
            <textarea
              placeholder="Please provide a reason for rejection..."
              className="w-full border border-gray-200 p-4 rounded-xl mb-6 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              rows="4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowRejectPopup(false); setRemarks(""); }} className="px-5 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!remarks.trim()) return alert("Please enter a reason for rejection.");
                  await updateStatus(selectedData._id, "Rejected", remarks);
                  setShowRejectPopup(false);
                  setRemarks("");
                }} 
                className="px-5 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Popup */}
      {isScanning && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsScanning(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-2">Scan Gate Pass QR</h2>
            <div className="border-4 border-dashed border-gray-200 rounded-xl overflow-hidden relative min-h-[300px]">
              <QrScannerComponent onScan={handleScanSuccess} />
            </div>
            <p className="text-center text-gray-500 mt-4 text-sm font-medium">Position the QR code within the frame.</p>
          </div>
        </div>
      )}

      {/* Aadhaar Scanner Popup */}
      {isAadhaarScanning && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsAadhaarScanning(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-2">Scan Physical Aadhaar Card</h2>
            <div className="border-4 border-dashed border-blue-200 rounded-xl overflow-hidden relative min-h-[300px] flex items-center justify-center p-2 bg-gray-50">
              <OcrScannerComponent 
                expectedAadhar={selectedData?.aadharNumber} 
                onScan={handleAadhaarScanSuccess} 
              />
            </div>
            <p className="text-center text-gray-500 mt-4 text-sm font-medium">Position the physical Aadhaar card inside the green box.</p>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents
function NavItem({ icon, label, active, onClick, badge, badgeColor }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
        active 
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
        <h4 className="text-3xl font-bold text-gray-800">{value}</h4>
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
      </div>
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function QrScannerComponent({ onScan }) {
  useEffect(() => {
    let html5QrCode;
    let isScanning = false;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          // Auto-detect Iriun Webcam
          let cameraId = devices[0].id;
          const iriunDevice = devices.find(device => device.label.toLowerCase().includes('iriun'));
          
          if (iriunDevice) {
            cameraId = iriunDevice.id;
          } else {
            // Fallback: try to find a back camera
            const backCamera = devices.find(device => device.label.toLowerCase().includes('back'));
            if (backCamera) cameraId = backCamera.id;
          }

          html5QrCode = new Html5Qrcode("qr-reader");
          
          html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              if (isScanning) return; // Prevent multiple scans
              isScanning = true;
              
              html5QrCode.stop().then(() => {
                html5QrCode.clear();
                onScan(decodedText);
              }).catch(err => {
                console.error("Failed to stop scanner", err);
                onScan(decodedText);
              });
            },
            (errorMessage) => {
              // ignore scan errors
            }
          ).catch(err => console.error("Start error:", err));
        }
      } catch (err) {
        console.error("Error starting camera", err);
      }
    };

    startScanner();

    return () => {
      isScanning = true; // prevent any callbacks
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(err => console.error("Failed to clear scanner on unmount", err));
      }
    };
  }, [onScan]);

  return <div id="qr-reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}></div>;
}

function OcrScannerComponent({ expectedAadhar, onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [detectedNumber, setDetectedNumber] = useState("");
  const [statusMessage, setStatusMessage] = useState("Initializing camera and OCR...");

  useEffect(() => {
    let isMounted = true;
    let stream = null;
    let intervalId = null;

    const startCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        
        let selectId = videoDevices[0]?.deviceId;
        // Search for Iriun Webcam
        const iriunDevice = videoDevices.find(device => device.label.toLowerCase().includes('iriun'));
        if (iriunDevice) {
          selectId = iriunDevice.deviceId;
        }

        const constraints = selectId 
          ? { video: { deviceId: { exact: selectId } } }
          : { video: { facingMode: 'environment' } };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
        }
        
        setStatusMessage("Align Aadhaar card within the frame. Scanning...");
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    // OCR scanning loop
    intervalId = setInterval(async () => {
      if (!isMounted || !videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      // Draw the current video frame onto the canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      setOcrLoading(true);
      try {
        // Run OCR on the captured frame
        const result = await Tesseract.recognize(canvas, 'eng');
        const text = result.data.text;
        
        if (!isMounted) return;

        // Clean the OCR text and search for 12 digit sequences
        const aadharRegex = /\b\d{4}\s\d{4}\s\d{4}\b|\b\d{12}\b/g;
        const matches = text.match(aadharRegex);

        if (matches && matches.length > 0) {
          // Remove spaces/hyphens
          const cleanedMatches = matches.map(m => m.replace(/\s+/g, '').replace(/-/g, ''));
          const detected = cleanedMatches[0];
          setDetectedNumber(detected);

          // Check if it matches expected
          if (detected === expectedAadhar) {
            clearInterval(intervalId);
            setStatusMessage("Aadhaar Verified Successfully!");
            setTimeout(() => {
              if (isMounted) onScan(detected);
            }, 1000);
          } else {
            setStatusMessage(`Detected Aadhaar: ${detected} (Expected: ${expectedAadhar})`);
          }
        } else {
          // Try regex search for any 12 digit sequence
          const numericOnly = text.replace(/[^0-9]/g, '');
          const match12 = numericOnly.match(/\d{12}/);
          if (match12) {
            const detected = match12[0];
            setDetectedNumber(detected);
            if (detected === expectedAadhar) {
              clearInterval(intervalId);
              setStatusMessage("Aadhaar Verified Successfully!");
              setTimeout(() => {
                if (isMounted) onScan(detected);
              }, 1000);
            } else {
              setStatusMessage(`Detected: ${detected} (Expected: ${expectedAadhar})`);
            }
          }
        }
      } catch (ocrErr) {
        console.error("OCR recognition error:", ocrErr);
      } finally {
        setOcrLoading(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [expectedAadhar, onScan]);

  return (
    <div className="relative flex flex-col items-center w-full">
      {error ? (
        <div className="text-red-500 text-center font-medium p-4">{error}</div>
      ) : (
        <>
          <div className="relative w-full max-w-sm rounded-xl overflow-hidden aspect-[4/3] bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Guide overlay box for physical card */}
            <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-60 flex items-center justify-center pointer-events-none">
              <div className="w-[85%] h-[60%] border-4 border-solid border-green-500 rounded-lg"></div>
            </div>
            {ocrLoading && (
              <div className="absolute top-2 right-2 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-medium animate-pulse">
                Processing OCR...
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="mt-4 text-center px-4">
            <p className="text-gray-700 font-semibold text-sm">{statusMessage}</p>
            {detectedNumber && (
              <div className="mt-2 text-xs text-gray-500">
                Last parsed sequence: <span className="font-bold text-gray-800">{detectedNumber}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SecurityDashboard;