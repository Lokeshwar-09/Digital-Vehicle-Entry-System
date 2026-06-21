// In-memory lockout tracker
// key: department name (e.g. "GSD", "AKASH") or "SECURITY_LOGIN"
// Each department / security has its OWN independent lockout counter
const lockoutStore = {};

// ── Helper: handle failed attempt & lockout ───────────────────────────────────
function handleFailedAttempt(lockKey, record, res) {
  record.attempts = (record.attempts || 0) + 1;

  if (record.attempts >= 3) {
    record.lockUntil = Date.now() + 5 * 60 * 1000;
    lockoutStore[lockKey] = record;
    return res.status(423).json({
      message: "Too many failed attempts. Account blocked for 5 minutes.",
      locked: true,
      lockUntil: record.lockUntil,
    });
  }

  lockoutStore[lockKey] = record;

  if (record.attempts === 2) {
    return res.status(401).json({
      message: "⚠️ Incorrect password. Last chance before your account is locked!",
      lastChance: true,
    });
  }

  return res.status(401).json({ message: "Invalid Credentials" });
}

// ── All hardcoded users ───────────────────────────────────────────────────────
const users = [
  { username: "security",      password: "security123",     role: "security" },
  { username: "corporate",     password: "corporate123",     role: "department", department: "CORPORATE" },
  { username: "milan",         password: "milan123",         role: "department", department: "MILAN" },
  { username: "services",      password: "services123",      role: "department", department: "SERVICES & OTHERS - KBU" },
  { username: "de",            password: "de123",            role: "department", department: "D&E" },
  { username: "electronics",   password: "electronics123",   role: "department", department: "ELECTRONICS" },
  { username: "prithvi",       password: "prithvi123",       role: "department", department: "PRITHVI" },
  { username: "cdo",           password: "cdo123",           role: "department", department: "CDO" },
  { username: "akash",         password: "akash123",         role: "department", department: "AKASH" },
  { username: "cped",          password: "cped123",          role: "department", department: "CPED" },
  { username: "cpigmp",        password: "cpigmp123",        role: "department", department: "CP-IGMP" },
  { username: "sfd",           password: "sfd123",           role: "department", department: "SFD" },
  { username: "nag",           password: "nag123",           role: "department", department: "NAG" },
  { username: "gsd",           password: "gsd123",           role: "department", department: "GSD" },
  { username: "refurbishment", password: "refurbishment123", role: "department", department: "REFURBISHMENT" },
  { username: "lrsam",         password: "lrsam123",         role: "department", department: "LR-SAM" },
  { username: "b05",           password: "b05123",           role: "department", department: "B-05" },
  { username: "vizag",         password: "vizag123",         role: "department", department: "VIZAG UNIT" },
  { username: "konkurs",       password: "konkurs123",       role: "department", department: "KONKURS-M" },
  { username: "components",    password: "components123",    role: "department", department: "COMPONENTS PRODUCTION" },
  { username: "bg",            password: "bg123",            role: "department", department: "SERVICES & OTHERS - BG" },
  { username: "invar",         password: "invar123",         role: "department", department: "INVAR" },
  { username: "launcher",      password: "launcher123",      role: "department", department: "LAUNCHER" },
  { username: "astra",         password: "astra123",         role: "department", department: "ASTRA" },
];

// ── Login Handler ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { username, password, department, role: loginRole } = req.body;

    // Lockout key is based on DEPARTMENT (for employees) or "SECURITY_LOGIN"
    // This means GSD lockout is 100% independent from AKASH, NAG, etc.
    const lockKey = loginRole === "security" ? "SECURITY_LOGIN" : (department || "UNKNOWN");

    // ── 1. Check if this department/security slot is currently locked ─────────
    const record = lockoutStore[lockKey] || { attempts: 0, lockUntil: null };

    if (record.lockUntil && record.lockUntil > Date.now()) {
      const secondsLeft = Math.ceil((record.lockUntil - Date.now()) / 1000);
      const minutesLeft = Math.ceil(secondsLeft / 60);
      return res.status(423).json({
        message: `Account temporarily blocked. Try again in ${minutesLeft} minute(s).`,
        locked: true,
        lockUntil: record.lockUntil,
      });
    }

    // ── 2. Security login ─────────────────────────────────────────────────────
    if (loginRole === "security") {
      if (username === "security" && password === "security123") {
        lockoutStore[lockKey] = { attempts: 0, lockUntil: null };
        return res.status(200).json({
          message: "Login Successful",
          token: "dummy-token",
          role: "security",
          username: "security",
          department: "",
        });
      }
      return handleFailedAttempt(lockKey, record, res);
    }

    // ── 3. Department (employee) login ────────────────────────────────────────
    // Look up user by the SELECTED DEPARTMENT (not by username)
    // We trim and use case-insensitive matching for department for robustness
    const user = users.find(u => 
      u.role === "department" && 
      u.department.trim().toUpperCase() === (department || "").trim().toUpperCase()
    );

    if (!user) {
      return res.status(404).json({ message: "User not found: Department record missing" });
    }

    if (user.username !== username.trim() || user.password !== password.trim()) {
      return handleFailedAttempt(lockKey, record, res);
    }

    // ── 4. SUCCESS ────────────────────────────────────────────────────────────
    lockoutStore[lockKey] = { attempts: 0, lockUntil: null };
    return res.status(200).json({
      message: "Login Successful",
      token: "dummy-token",
      role: user.role,
      username: user.username,
      department: user.department || "",
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { login };