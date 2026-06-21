import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Icons for the UI
const Icons = {
  Pin: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  User: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Shield: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Back: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
};

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    department: "",
  });

  const departments = [
    "CORPORATE", "MILAN", "SERVICES & OTHERS - KBU", "D&E", "ELECTRONICS", 
    "PRITHVI", "CDO", "AKASH", "CPED", "CP-IGMP", "SFD", "NAG", "GSD", 
    "REFURBISHMENT", "LR-SAM", "B-05", "VIZAG UNIT", "KONKURS-M", 
    "COMPONENTS PRODUCTION", "SERVICES & OTHERS - BG", "INVAR", "LAUNCHER", "ASTRA"
  ];
  
  const [activeForm, setActiveForm] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleFormSelect = (type) => {
    setActiveForm(type);
    setError("");
    // Optionally pre-fill based on type for convenience
    if (type === 'security') {
      setFormData({ username: 'security', password: '', department: '' });
    } else {
      setFormData({ username: '', password: '', department: '' });
    }
  };

  const startLockCountdown = (lockUntilDate) => {
    setIsLocked(true);
    const tick = () => {
      const secsLeft = Math.ceil((new Date(lockUntilDate) - Date.now()) / 1000);
      if (secsLeft <= 0) {
        setIsLocked(false);
        setLockCountdown(0);
        setError("");
      } else {
        setLockCountdown(secsLeft);
        setTimeout(tick, 1000);
      }
    };
    tick();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { ...formData, role: activeForm });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("department", res.data.department);

      if (res.data.role === "security") {
        navigate("/security");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 423 && data?.lockUntil) {
        // Account locked — start live countdown
        startLockCountdown(data.lockUntil);
        setError(data.message);
      } else {
        setError(data?.message || "Login Failed");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans flex overflow-hidden bg-[#1e103c]">
      
      {/* Background Image with Deep Purple Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/bg-image.png')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="absolute inset-0 bg-[#1e103c]/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e103c]/90 via-transparent to-[#1e103c]/80"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Content Area */}
        <div className="w-full lg:w-1/2 pt-12 pb-12 flex flex-col justify-center min-h-screen">
          
          <div className="mb-1 flex items-center">
            <h1 className="text-5xl font-bold text-white tracking-wide">BDL</h1>
          </div>
          
          <div className="flex items-center text-purple-300 mb-12">
            <Icons.Pin className="w-5 h-5 mr-2" />
            <span className="text-lg tracking-wide">Kanchanbagh</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Digital Vehicle<br/>Entry System
          </h2>

          <p className="text-purple-200/80 text-lg max-w-lg mb-10 leading-relaxed">
            Smart and Secure Vendor Vehicle Access Management Platform<br/>for BDL Security.
          </p>

          {/* Login Actions / Form Area */}
          <div className="min-h-[320px] transition-all duration-300">
            {!activeForm ? (
              /* Initial Buttons */
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => handleFormSelect('employee')}
                  className="flex items-center justify-center px-8 py-3.5 bg-[#2b2146]/80 hover:bg-[#3d2f63] border border-white/10 rounded-xl text-white text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <Icons.User className="w-4 h-4 mr-3 text-blue-400" />
                  Employee Login
                </button>
                
                <button 
                  onClick={() => handleFormSelect('security')}
                  className="flex items-center justify-center px-8 py-3.5 bg-[#2b2146]/80 hover:bg-[#3d2f63] border border-white/10 rounded-xl text-white text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <Icons.Shield className="w-4 h-4 mr-3 text-blue-400" />
                  Security Login
                </button>
              </div>
            ) : (
              /* Login Form */
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl max-w-md animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white capitalize flex items-center">
                    {activeForm === 'security' ? <Icons.Shield className="w-6 h-6 mr-2 text-green-400" /> : <Icons.User className="w-6 h-6 mr-2 text-blue-400" />}
                    {activeForm} Login
                  </h3>
                  <button 
                    onClick={() => setActiveForm(null)}
                    className="text-gray-400 hover:text-white transition p-2 bg-white/5 rounded-lg"
                  >
                    <Icons.Back className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-5">
                  {activeForm === "employee" && (
                    <div>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                      >
                        <option value="" disabled className="text-gray-900">Select Division / Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept} className="text-gray-900">{dept}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="w-full bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className={`text-sm p-3 rounded-lg border ${
                      isLocked
                        ? 'text-orange-300 bg-orange-900/30 border-orange-500/30'
                        : error.includes('Last chance') || error.includes('last chance')
                        ? 'text-yellow-300 bg-yellow-900/30 border-yellow-500/30'
                        : 'text-red-400 bg-red-900/30 border-red-500/20'
                    }`}>
                      {error}
                      {isLocked && lockCountdown > 0 && (
                        <div className="mt-2 font-bold text-lg text-center">
                          🔒 {Math.floor(lockCountdown / 60)}:{String(lockCountdown % 60).padStart(2, '0')} remaining
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || isLocked}
                    className={`w-full text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg mt-4 ${
                      isLocked
                        ? 'bg-gray-600 cursor-not-allowed shadow-gray-900/50'
                        : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/50'
                    }`}
                  >
                    {isLoading ? "Authenticating..." : isLocked ? "Account Locked" : "Sign In"}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

        {/* Right Content Area (Holographic Emblem) */}
        <div className="hidden lg:flex w-1/2 justify-center items-center h-full relative">
          <div className="relative w-full max-w-md z-10 mt-10 flex items-center justify-center">
            
            {/* Pulsing Background Glow */}
            <div className="absolute w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>

            {/* Rotating Rings (Hologram Effect) */}
            <div className="absolute w-[350px] h-[350px] border border-blue-500/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute w-[320px] h-[320px] border border-purple-500/10 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
            <div className="absolute w-[280px] h-[280px] border-t-4 border-green-400/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            
            {/* The Emblem Container */}
            <div className="relative z-10 w-[350px] h-[350px] flex items-center justify-center">
              <img 
                src="/login-hologram-final.png" 
                alt="Digital Security Hologram" 
                className="w-full h-full object-contain animate-float"
                style={{ 
                  mixBlendMode: 'screen',
                  WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 80%)',
                  maskImage: 'radial-gradient(circle, black 60%, transparent 80%)'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/isometric-security.png";
                }}
              />
              
              {/* Scanning Line Animation (Limited to Emblem) */}
              <div className="absolute inset-8 z-20 pointer-events-none overflow-hidden rounded-full">
                <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_20px_rgba(74,222,128,1)] animate-hologram-scan opacity-80"></div>
              </div>
            </div>

            {/* Floating Shield Overlay */}
            <div className="absolute -right-12 top-0 z-30 animate-bounce-slow">
              <div className="bg-green-500/10 backdrop-blur-xl p-4 rounded-2xl border border-green-400/30 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <Icons.Shield className="w-10 h-10 text-green-400" />
              </div>
            </div>
            
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hologram-scan {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          45%, 55% { opacity: 1; }
          50% { transform: translateY(260px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-hologram-scan {
          animation: hologram-scan 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;