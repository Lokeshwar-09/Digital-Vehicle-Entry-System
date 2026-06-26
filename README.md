#  Digital Vehicle Entry System (DVES)

[![React](https://img.shields.io/badge/Frontend-React%20%26%20Vite-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-mediumseagreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A secure, paperless, and automated **Digital Vehicle Entry System (DVES)** tailored for **Bharat Dynamics Limited (BDL), Kanchanbagh**. The system streamlines the vehicle entry authorization process by connecting departments, vendors, and security personnel on a unified real-time dashboard.

---

## 🌟 Key Features

*   🏢 **Departmental Pass Requests**: Departments (e.g., Milan, Akash, CPED, Corporate, Nag) can easily submit vehicle entry requests for vendors and contractors.
*   📷 **Aadhaar OCR Verification**: Integrates **Tesseract.js** to scan physical Aadhaar cards in real-time at the security gates. It automatically extracts and verifies the 12-digit Aadhaar number against the registered record on the fly to prevent fraud.
*   🔍 **Gate Pass QR Scanning**: Security guards can instantly scan the visitor's digital Gate Pass using the integrated **HTML5-QRCode** camera scanner to fetch details in a single click.
*   💬 **WhatsApp Cloud API Integration**: Automated messaging dispatch that instantly sends the unique verification ID (e.g., `BDLXXXXXXX`) and status updates directly to the vendor's or driver's mobile number.
*   🔒 **Multi-Document Verification**: Supports uploads and verification for mandatory documents like Aadhar Cards, RC Books, Driving Licenses, and Pollution Certificates (minimum 2 documents required).
*   📋 **Role-Based Access Control (RBAC)**: Distinct workflows for **Security Personnel** (Scanning, OCR verification, Entry Approval/Rejection), **Departments** (Request creation and tracking), and **Admin**.

---

## 🛠️ Tech Stack

### Frontend
*   **Library:** React (Vite-powered)
*   **Styling:** Tailwind CSS (Modern, Responsive Dashboard UI)
*   **Scanning & OCR:** `html5-qrcode` & `tesseract.js`
*   **Routing & HTTP:** React Router DOM & Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **ODM:** Mongoose
*   **Database:** MongoDB
*   **File Uploads:** Multer
*   **Notification Engine:** Meta WhatsApp Business Cloud API

---

## 📁 Repository Structure

```text
Digital-Vehicle-Entry-System/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── Employee_Dataset.csv
│   ├── seedEmployees.js
│   ├── seedUsers.js
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Getting Started

### 📋 Prerequisites
Make sure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a remote MongoDB Atlas cluster)

---

### 🚀 Setup & Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Lokeshwar-09/Digital-Vehicle-Entry-System.git
cd Digital-Vehicle-Entry-System
```

#### 2. Configure the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following configurations:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/securityDB
   JWT_SECRET=YOUR_JWT_SECRET_KEY
   WHATSAPP_PHONE_ID=YOUR_META_PHONE_NUMBER_ID
   WHATSAPP_TOKEN=YOUR_META_PERMANENT_ACCESS_TOKEN
   SERVER_BASE_URL=http://localhost:5000
   ```

#### 3. Seed the Database
DVES utilizes pre-defined users (departments and security) and an employee dataset. Run the seeding scripts to populate your MongoDB collections:

```bash
node seedUsers.js
node seedEmployees.js
```

#### 4. Configure the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at the URL shown in the console (usually `http://localhost:5173`).

---

## 🚦 Workflows

### 1. Department Request Creation
*   Staff logs in with departmental credentials (e.g. `corporate` / `corporate123`).
*   Selects or searches the host employee.
*   Enters the visitor/vendor details, vehicle number, and uploads required documents (Aadhar, RC, etc.).
*   Upon submission, the unique verification ID (e.g. `BDL5839201`) is generated and sent via WhatsApp to the driver's phone number.

### 2. Security Checkpoint Gate-Pass Scan
*   Security officer logs in using the credentials `security` / `security123`.
*   As the vehicle arrives, the officer clicks **Scan QR** to activate the camera and scan the driver's QR Gate Pass.
*   The system immediately fetches corresponding request details.

### 3. Aadhaar OCR Verification
*   The security officer prompts the driver for their physical Aadhaar Card and clicks **Scan Aadhaar**.
*   The system uses the device camera to scan the card in a guided window, processing text in real-time through **Tesseract OCR**.
*   If the 12-digit Aadhaar number extracted matches the expected record, the verification status changes to **Matched**.
*   Once matched, the **Approve Entry** button is unlocked, allowing the officer to authorize gate opening.
