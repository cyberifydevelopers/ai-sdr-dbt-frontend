import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

// ===== Public Routes =====
import Signup from "./pages/public/signup";
import NotFound from "./pages/public/NotFound";
import OTP from "./pages/public/otp";
import Login from "./pages/public/login";
import Forget from "./pages/public/forget_password";
import ProfileSection from "./pages/public/ProfileSection";

// ===== User Routes =====
import Layoutuser from "./layout/layoutuser";
import Dashboard from "./pages/user/dashboard";
import PhoneCall from "./pages/user/PhoneCall";
import Settings from "./pages/user/setting";
import Callhistory from "./pages/user/callhistory";
import Callassistence from "./pages/user/callassistent";
import EditAssistant from "./pages/user/editassistent";
import CreateAssistant from "./pages/user/addassitent";
import Leadsid from "./pages/user/leadid";
import Lead from "./pages/user/lead";
import UploadCSV from "./pages/user/upload-csv";
import Campain from "./pages/user/Campain"; // ✅ NEW: Campaigns page
import CRM from "./pages/user/CRM";
import Appointments from "./pages/user/appointments";
// ===== Admin Routes =====
import Layoutadmin from "./layout/layoutadmin";
import Adminusers from "./pages/admin/users";
import AdminDashboard from "./pages/admin/dashboard";
import Settingadmin from "./pages/admin/settings";
import Phonecalladmin from "./pages/admin/phonecalls";
import Addassistants from "./pages/admin/addassistants";
import AdminEditAssistant from "./pages/admin/editassistants";
import Adminassistants from "./pages/admin/assistants";
import Admincallhistory from "./pages/admin/callhistory";
import AdminLeadsid from "./pages/admin/leadid";
import AdminLead from "./pages/admin/lead";
import AdminUploadCSV from "./pages/admin/upload-csv";
import Stats from "./pages/user/Stats";

// ===== Route Guards =====
import IsUser from "./authntication/isuser";
import Isadmin from "./authntication/isadmin";


function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* ===== Public Routes ===== */}
           <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/forget_password" element={<Forget />} />
          <Route path="/profile" element={<ProfileSection />} />

          {/* ===== User Protected Routes ===== */}
          <Route path="/user" element={<Layoutuser />}>
            <Route
              path="dashboard"
              element={
                <IsUser>
                  <Dashboard />
                </IsUser>
              }
            />
            <Route
              path="Appointments"
              element={
                <IsUser>
                  <Appointments />
                </IsUser>
              }
            />
            <Route
              path="PhoneCalls"
              element={
                <IsUser>
                  <PhoneCall />
                </IsUser>
              }
            />
            <Route
              path="callhistory"
              element={
                <IsUser>
                  <Callhistory />
                </IsUser>
              }
            />
            <Route
              path="settings"
              element={
                <IsUser>
                  <Settings />
                </IsUser>
              }
            />
            <Route
              path="CRM"
              element={
                <IsUser>
                  <CRM />
                </IsUser>
              }
            />
            <Route
              path="callassistent"
              element={
                <IsUser>
                  <Callassistence />
                </IsUser>
              }
            />
            <Route
              path="edit-assistant/:assistantId"
              element={
                <IsUser>
                  <EditAssistant />
                </IsUser>
              }
            />
            <Route
              path="assistant/create"
              element={
                <IsUser>
                  <CreateAssistant />
                </IsUser>
              }
            />
            <Route
              path="leads"
              element={
                <IsUser>
                  <Leadsid />
                </IsUser>
              }
            />
            <Route
              path="lead/:id"
              element={
                <IsUser>
                  <Lead />
                </IsUser>
              }
            />
            <Route
              path="upload-csv"
              element={
                <IsUser>
                  <UploadCSV />
                </IsUser>
              }
            />

            {/* ✅ NEW: Campaigns routes */}
            <Route
              path="campaigns"
              element={
                <IsUser>
                  <Campain />
                </IsUser>
              }
            />
            {/* optional alias to match your filename spelling */}
            <Route
              path="campain"
              element={
                <IsUser>
                  <Campain />
                </IsUser>
              }
            />
          
          </Route>


          {/* ===== Admin Protected Routes ===== */}
          <Route path="/admin" element={<Layoutadmin />}>
            <Route
              path="dashboard"
              element={
                <Isadmin>
                  <AdminDashboard />
                </Isadmin>
              }
            />

            <Route
              path="Users"
              element={
                <Isadmin>
                  <Adminusers />
                </Isadmin>
              }
            />
            <Route
              path="PhoneCalls"
              element={
                <Isadmin>
                  <Phonecalladmin />
                </Isadmin>
              }
            />
            <Route
              path="settings"
              element={
                <Isadmin>
                  <Settingadmin />
                </Isadmin>
              }
            />
            <Route
              path="addassistands"
              element={
                <Isadmin>
                  <Addassistants />
                </Isadmin>
              }
            />
            <Route
              path="edit-assistants/:assistantId"
              element={
                <Isadmin>
                  <AdminEditAssistant />
                </Isadmin>
              }
            />
            <Route
              path="assistants"
              element={
                <Isadmin>
                  <Adminassistants />
                </Isadmin>
              }
            />
            <Route
              path="callhistory"
              element={
                <Isadmin>
                  <Admincallhistory />
                </Isadmin>
              }
            />
            <Route
              path="lead/:id"
              element={
                <Isadmin>
                  <AdminLeadsid />
                </Isadmin>
              }
            />
            <Route
              path="lead"
              element={
                <Isadmin>
                  <AdminLead />
                </Isadmin>
              }
            />
            <Route
              path="upload-csv"
              element={
                <Isadmin>
                  <AdminUploadCSV />
                </Isadmin>
              }
            />
          </Route>

          {/* ===== Catch-All Route ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* ===== Toast Notifications ===== */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
