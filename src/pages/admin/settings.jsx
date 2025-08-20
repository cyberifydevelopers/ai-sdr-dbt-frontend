"use client";

import { useState, useEffect, useRef } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otpNeeded, setOtpNeeded] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState({
    profile: false,
    update: false,
    delete: false,
    otp: false,
  });
  const otpInputs = useRef([]);
  const formRef = useRef(null);

  const fetchUser = async () => {
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/search-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch user data");
      }

      const data = await response.json();
      setEditData({
        name: data.users?.name || "",
        email: data.users?.email || "",
        password: "",
      });
    } catch (err) {
      toast.error(err.message);
      if (err.message.includes("Authentication")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const validateForm = () => {
    if (!editData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!editData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (editData.password && editData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading((prev) => ({ ...prev, update: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const payload = {
        name: editData.name,
        email: editData.email,
        ...(editData.password && { password: editData.password }),
      };

      const response = await fetch(`http://localhost:8000/api/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      const data = await response.json();
      if (data?.otp_needed) {
        setOtpNeeded(true);
        setTimeout(() => otpInputs.current[0]?.focus(), 0);

        toast.info("Verification code sent to your email");
      } else {
        localStorage.setItem("name", payload.name);
        toast.success("Profile updated successfully");
        // Clear password field after successful update
        setEditData((prev) => ({ ...prev, password: "" }));
      }
    } catch (err) {
      toast.error(err.message);
      if (err.message.includes("Authentication")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleAccountVerification = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      toast.error("Please enter the complete verification code");
      return;
    }

    setLoading((prev) => ({ ...prev, otp: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(`http://localhost:8000/api/update-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: editData.email,
          code: otp.join(""),
          name: editData.name,
          ...(editData.password && { password: editData.password }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Verification failed");
      }

      toast.success("Account verified successfully");
      setOtpNeeded(false);
      setOtp(["", "", "", ""]);
      localStorage.setItem("name", editData.name);
      localStorage.setItem("email", editData.email);

      // Clear password field after successful verification
      setEditData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      toast.error(err.message);
      if (err.message.includes("Authentication")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleDeleteAccount = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(`http://localhost:8000/api/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      if (err.message.includes("Authentication")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading((prev) => ({ ...prev, otp: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(
        `http://localhost:8000/api/resend-otp-update-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: editData.email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to resend OTP");
      }

      setOtp(["", "", "", ""]);
      otpInputs.current[0]?.focus();
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err.message);
      if (err.message.includes("Authentication")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
          {(loading.profile ||
            loading.update ||
            loading.delete ||
            loading.otp) && (
            <div className="flex justify-center items-center mb-4">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          )}

          {otpNeeded ? (
            /* OTP Verification Section */
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Email Verification
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">
                    Verification Required
                  </h3>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  We've sent a 4-digit verification code to{" "}
                  <strong>{editData.email}</strong>. Please enter it below.
                </p>

                <form onSubmit={handleAccountVerification}>
                  <div className="flex justify-center gap-3 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        ref={(el) => (otpInputs.current[index] = el)}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold text-gray-900 bg-white border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="0"
                        disabled={loading.otp}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="submit"
                      disabled={otp.some((digit) => !digit) || loading.otp}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading.otp ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Verifying...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Verify OTP
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading.otp}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      Account Settings
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mt-1">
                      Manage your account information and preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                </div>

                <form ref={formRef} onSubmit={handleSaveChanges}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <UserIcon className="w-4 h-4 inline mr-2 text-blue-500" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        disabled={loading.profile || loading.update}
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <EnvelopeIcon className="w-4 h-4 inline mr-2 text-green-500" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        disabled={loading.profile || loading.update}
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <LockClosedIcon className="w-4 h-4 inline mr-2 text-purple-500" />
                        Password (optional)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={editData.password}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              password: e.target.value,
                            })
                          }
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                          disabled={loading.profile || loading.update}
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={loading.profile || loading.update}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        {editData.password
                          ? "Password must be at least 8 characters"
                          : "Leave blank to keep current password"}
                      </p>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading.profile || loading.update}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading.update ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Save Changes
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg border border-red-200 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
                    Danger Zone
                  </h2>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading.profile || loading.update}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center">
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete Account
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Confirm Delete
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action
                  cannot be undone and all your data will be permanently
                  removed.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading.delete}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      handleDeleteAccount();
                    }}
                    disabled={loading.delete}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                  >
                    {loading.delete ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Deleting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Forever
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
