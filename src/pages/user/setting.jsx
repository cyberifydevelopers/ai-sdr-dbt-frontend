// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   UserIcon,
//   EnvelopeIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   TrashIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldCheckIcon,
// } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function SettingsPage() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [otpNeeded, setOtpNeeded] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [editData, setEditData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [loading, setLoading] = useState({
//     profile: false,
//     update: false,
//     delete: false,
//     otp: false,
//   });
//   const otpInputs = useRef([]);
//   const formRef = useRef(null);

//   const fetchUser = async () => {
//     setLoading((prev) => ({ ...prev, profile: true }));
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Authentication required. Please login again.");
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`http://localhost:8000/api/search-user`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to fetch user data");
//       }

//       const data = await response.json();
//       setEditData({
//         name: data.users?.name || "",
//         email: data.users?.email || "",
//         password: "",
//       });
//     } catch (err) {
//       toast.error(err.message);
//       if (err.message.includes("Authentication")) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, profile: false }));
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const validateForm = () => {
//     if (!editData.name.trim()) {
//       toast.error("Name is required");
//       return false;
//     }

//     if (!editData.email.trim()) {
//       toast.error("Email is required");
//       return false;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
//       toast.error("Please enter a valid email address");
//       return false;
//     }

//     if (editData.password && editData.password.length < 8) {
//       toast.error("Password must be at least 8 characters long");
//       return false;
//     }

//     return true;
//   };

//   const handleSaveChanges = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading((prev) => ({ ...prev, update: true }));
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required. Please login again.");
//       }

//       const payload = {
//         name: editData.name,
//         email: editData.email,
//         ...(editData.password && { password: editData.password }),
//       };

//       const response = await fetch(`http://localhost:8000/api/update-profile`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to update profile");
//       }

//       const data = await response.json();
//       if (data?.otp_needed) {
//         setOtpNeeded(true);
//         setTimeout(() => otpInputs.current[0]?.focus(), 0);

//         toast.info("Verification code sent to your email");
//       } else {
//         localStorage.setItem("name", payload.name);
//         toast.success("Profile updated successfully");
//         // Clear password field after successful update
//         setEditData((prev) => ({ ...prev, password: "" }));
//       }
//     } catch (err) {
//       toast.error(err.message);
//       if (err.message.includes("Authentication")) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         navigate("/login");
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, update: false }));
//     }
//   };

//   const handleAccountVerification = async (e) => {
//     e.preventDefault();

//     if (otp.some((digit) => !digit)) {
//       toast.error("Please enter the complete verification code");
//       return;
//     }

//     setLoading((prev) => ({ ...prev, otp: true }));
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required. Please login again.");
//       }

//       const response = await fetch(`http://localhost:8000/api/update-email`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           email: editData.email,
//           code: otp.join(""),
//           name: editData.name,
//           ...(editData.password && { password: editData.password }),
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Verification failed");
//       }

//       toast.success("Account verified successfully");
//       setOtpNeeded(false);
//       setOtp(["", "", "", ""]);
//       localStorage.setItem("name", editData.name);
//       localStorage.setItem("email", editData.email);

//       // Clear password field after successful verification
//       setEditData((prev) => ({ ...prev, password: "" }));
//     } catch (err) {
//       toast.error(err.message);
//       if (err.message.includes("Authentication")) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         navigate("/login");
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, otp: false }));
//     }
//   };

//   const handleDeleteAccount = async () => {
//     setLoading((prev) => ({ ...prev, delete: true }));
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required. Please login again.");
//       }

//       const response = await fetch(`http://localhost:8000/api/delete-account`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to delete account");
//       }

//       toast.success("Account deleted successfully");
//       localStorage.removeItem("token");
//       localStorage.removeItem("role");
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.message);
//       if (err.message.includes("Authentication")) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         navigate("/login");
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, delete: false }));
//     }
//   };

//   const handleOtpChange = (index, value) => {
//     if (/^\d?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < 3) {
//         otpInputs.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       otpInputs.current[index - 1]?.focus();
//     }
//   };

//   const handleResendOtp = async () => {
//     setLoading((prev) => ({ ...prev, otp: true }));
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required. Please login again.");
//       }

//       const response = await fetch(
//         `http://localhost:8000/api/resend-otp-update-profile`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ email: editData.email }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to resend OTP");
//       }

//       setOtp(["", "", "", ""]);
//       otpInputs.current[0]?.focus();
//       toast.success("OTP resent successfully");
//     } catch (err) {
//       toast.error(err.message);
//       if (err.message.includes("Authentication")) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         navigate("/login");
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, otp: false }));
//     }
//   };

//   return (
//     <div className="min-h-screen flex w-full max-w-5xl mx-auto">
//       <div className="flex-1 ">
//         <div className="py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8 lg:sm-[180px]">
//           {(loading.profile ||
//             loading.update ||
//             loading.delete ||
//             loading.otp) && (
//             <div className="flex justify-center items-center mb-4">
//               <svg
//                 className="animate-spin h-8 w-8 text-blue-500"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 ></path>
//               </svg>
//             </div>
//           )}

//           {otpNeeded ? (
//             /* OTP Verification Section */
//             <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                 </div>
//                 <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
//                   Email Verification
//                 </h2>
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                 <div className="flex items-center mb-3">
//                   <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
//                   <h3 className="font-semibold text-blue-900">
//                     Verification Required
//                   </h3>
//                 </div>
//                 <p className="text-sm text-blue-700 mb-4">
//                   We've sent a 4-digit verification code to{" "}
//                   <strong>{editData.email}</strong>. Please enter it below.
//                 </p>

//                 <form onSubmit={handleAccountVerification}>
//                   <div className="flex justify-center gap-3 mb-4">
//                     {otp.map((digit, index) => (
//                       <input
//                         key={index}
//                         type="text"
//                         maxLength="1"
//                         value={digit}
//                         onChange={(e) => handleOtpChange(index, e.target.value)}
//                         onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                         ref={(el) => (otpInputs.current[index] = el)}
//                         className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold text-gray-900 bg-white border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         placeholder="0"
//                         disabled={loading.otp}
//                       />
//                     ))}
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                     <button
//                       type="submit"
//                       disabled={otp.some((digit) => !digit) || loading.otp}
//                       className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {loading.otp ? (
//                         <div className="flex items-center justify-center">
//                           <svg
//                             className="animate-spin h-4 w-4 mr-2"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                             ></path>
//                           </svg>
//                           Verifying...
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center">
//                           <CheckCircleIcon className="w-4 h-4 mr-2" />
//                           Verify OTP
//                         </div>
//                       )}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleResendOtp}
//                       disabled={loading.otp}
//                       className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       Resend OTP
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Header */}
//               <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
//                 <div className="flex items-center space-x-4 mb-6">
//                   <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center">
//                     <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//                   </div>
//                   <div>
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
//                       Account Settings
//                     </h1>
//                     <p className="text-base sm:text-lg text-gray-600 mt-1">
//                       Manage your account information and preferences
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Profile Information */}
//               <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                     <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                   </div>
//                   <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
//                     Profile Information
//                   </h2>
//                 </div>

//                 <form ref={formRef} onSubmit={handleSaveChanges}>
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* Name Field */}
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-3">
//                         <UserIcon className="w-4 h-4 inline mr-2 text-blue-500" />
//                         Full Name
//                       </label>
//                       <input
//                         type="text"
//                         value={editData.name}
//                         onChange={(e) =>
//                           setEditData({ ...editData, name: e.target.value })
//                         }
//                         placeholder="Enter your full name"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
//                         disabled={loading.profile || loading.update}
//                         required
//                       />
//                     </div>

//                     {/* Email Field */}
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-3">
//                         <EnvelopeIcon className="w-4 h-4 inline mr-2 text-green-500" />
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={editData.email}
//                         onChange={(e) =>
//                           setEditData({ ...editData, email: e.target.value })
//                         }
//                         placeholder="Enter your email address"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
//                         disabled={loading.profile || loading.update}
//                         required
//                       />
//                     </div>

//                     {/* Password Field */}
//                     <div className="lg:col-span-2">
//                       <label className="block text-sm font-bold text-gray-700 mb-3">
//                         <LockClosedIcon className="w-4 h-4 inline mr-2 text-purple-500" />
//                         Password (optional)
//                       </label>
//                       <div className="relative">
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           value={editData.password}
//                           onChange={(e) =>
//                             setEditData({
//                               ...editData,
//                               password: e.target.value,
//                             })
//                           }
//                           placeholder="Enter new password"
//                           className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
//                           disabled={loading.profile || loading.update}
//                           minLength={8}
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                           disabled={loading.profile || loading.update}
//                         >
//                           {showPassword ? (
//                             <EyeSlashIcon className="w-5 h-5" />
//                           ) : (
//                             <EyeIcon className="w-5 h-5" />
//                           )}
//                         </button>
//                       </div>
//                       <p className="text-xs sm:text-sm text-gray-500 mt-2">
//                         {editData.password
//                           ? "Password must be at least 8 characters"
//                           : "Leave blank to keep current password"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Save Changes Button */}
//                   <div className="mt-6">
//                     <button
//                       type="submit"
//                       disabled={loading.profile || loading.update}
//                       className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {loading.update ? (
//                         <div className="flex items-center">
//                           <svg
//                             className="animate-spin h-4 w-4 mr-2"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                             ></path>
//                           </svg>
//                           Saving...
//                         </div>
//                       ) : (
//                         <div className="flex items-center">
//                           <CheckCircleIcon className="w-4 h-4 mr-2" />
//                           Save Changes
//                         </div>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               {/* Danger Zone */}
//               <div className="bg-white rounded-lg border border-red-200 p-4 sm:p-6 lg:p-8">
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center">
//                     <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                   </div>
//                   <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
//                     Danger Zone
//                   </h2>
//                 </div>

//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                   <h3 className="font-semibold text-red-900 mb-2">
//                     Delete Account
//                   </h3>
//                   <p className="text-sm text-red-700 mb-4">
//                     Once you delete your account, there is no going back. Please
//                     be certain.
//                   </p>

//                   <button
//                     onClick={() => setShowDeleteConfirm(true)}
//                     disabled={loading.profile || loading.update}
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <div className="flex items-center">
//                       <TrashIcon className="w-4 h-4 mr-2" />
//                       Delete Account
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Delete Confirmation Modal */}
//           {showDeleteConfirm && (
//             <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-sm">
//               <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
//                 <div className="flex items-center space-x-3 mb-4">
//                   <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
//                     <ExclamationTriangleIcon className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-900">
//                     Confirm Delete
//                   </h3>
//                 </div>
//                 <p className="text-gray-600 mb-6">
//                   Are you sure you want to delete your account? This action
//                   cannot be undone and all your data will be permanently
//                   removed.
//                 </p>
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={() => setShowDeleteConfirm(false)}
//                     disabled={loading.delete}
//                     className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowDeleteConfirm(false);
//                       handleDeleteAccount();
//                     }}
//                     disabled={loading.delete}
//                     className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
//                   >
//                     {loading.delete ? (
//                       <div className="flex items-center">
//                         <svg
//                           className="animate-spin h-4 w-4 mr-2"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                           ></path>
//                         </svg>
//                         Deleting...
//                       </div>
//                     ) : (
//                       <div className="flex items-center">
//                         <TrashIcon className="w-4 h-4 mr-2" />
//                         Delete Forever
//                       </div>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   UserIcon,
//   EnvelopeIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   TrashIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldCheckIcon,
//   ArrowUpTrayIcon,
//   PhotoIcon,
// } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// export default function SettingsPage() {
//   const navigate = useNavigate();

//   // profile basics
//   const [editData, setEditData] = useState({ name: "", email: "" });
//   const [profileLoaded, setProfileLoaded] = useState(false);

//   // profile photo
//   const [photoUrl, setPhotoUrl] = useState(null);
//   const [photoLoading, setPhotoLoading] = useState(false);
//   const [photoDeleting, setPhotoDeleting] = useState(false);
//   const fileInputRef = useRef(null);
//   const [isDragOver, setIsDragOver] = useState(false);

//   // change password
//   const [showPw, setShowPw] = useState({ old: false, next: false });
//   const [pw, setPw] = useState({ old_password: "", new_password: "" });
//   const [pwLoading, setPwLoading] = useState(false);

//   // danger zone
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // generic loading
//   const [saving, setSaving] = useState(false);

//   const token = () => localStorage.getItem("token") || "";

//   // ---------- helpers ----------
//   const authHeaders = () => (token() ? { Authorization: `Bearer ${token()}` } : {});

//   const ensureAuth = () => {
//     if (!token()) {
//       toast.error("Authentication required. Please login again.");
//       navigate("/login");
//       return false;
//     }
//     return true;
//   };

//   // ---------- load profile ----------
//   useEffect(() => {
//     (async () => {
//       if (!ensureAuth()) return;
//       try {
//         const res = await fetch(`${API_URL}/api/user-info`, {
//           headers: { ...authHeaders() },
//         });
//         if (!res.ok) throw new Error("Failed to load user info");
//         const data = await res.json();
//         setEditData({
//           name: data?.data?.name || "",
//           email: data?.data?.email || "",
//         });

//         const abs = data?.data?.profile_photo_url;
//         if (abs) {
//           setPhotoUrl(abs + (abs.includes("?") ? "&" : "?") + "t=" + Date.now());
//         } else {
//           try {
//             const r2 = await fetch(`${API_URL}/api/profile-photo`, {
//               headers: { ...authHeaders() },
//             });
//             if (r2.ok) {
//               const d2 = await r2.json();
//               const u = d2?.photo_url;
//               if (u) setPhotoUrl(u + (u.includes("?") ? "&" : "?") + "t=" + Date.now());
//             }
//           } catch {}
//         }
//         setProfileLoaded(true);
//       } catch (e) {
//         toast.error("Unable to load profile");
//         setProfileLoaded(true);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------- profile update ----------
//   const handleSaveProfile = async (e) => {
//     e?.preventDefault?.();
//     if (!ensureAuth()) return;

//     if (!editData.name.trim()) return toast.error("Name is required");
//     if (!editData.email.trim()) return toast.error("Email is required");
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) return toast.error("Please enter a valid email");

//     setSaving(true);
//     try {
//       const res = await fetch(`${API_URL}/api/update-profile`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeaders() },
//         body: JSON.stringify({ name: editData.name, email: editData.email }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Failed to update profile");
//       localStorage.setItem("name", editData.name);
//       toast.success("Profile updated");
//     } catch (e) {
//       toast.error(e.message || "Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------- password change ----------
//   const handleChangePassword = async (e) => {
//     e?.preventDefault?.();
//     if (!ensureAuth()) return;
//     if (!pw.old_password || !pw.new_password) return toast.error("Please fill both password fields");
//     if (pw.new_password.length < 8) return toast.error("New password must be at least 8 characters");

//     setPwLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/change-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeaders() },
//         body: JSON.stringify(pw),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Password change failed");
//       toast.success("Password changed successfully");
//       setPw({ old_password: "", new_password: "" });
//     } catch (e) {
//       toast.error(e.message || "Password change failed");
//     } finally {
//       setPwLoading(false);
//     }
//   };

//   // ---------- photo: upload ----------
//   const startUpload = async (file) => {
//     if (!file) return;
//     if (!ensureAuth()) return;

//     const okTypes = ["image/png", "image/jpeg", "image/webp"];
//     if (!okTypes.includes(file.type)) return toast.error("Please upload PNG, JPG or WebP");
//     if (file.size > 5 * 1024 * 1024) return toast.error("Max file size is 5MB");

//     setPhotoLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const res = await fetch(`${API_URL}/api/profile-photo`, {
//         method: "POST",
//         headers: { ...authHeaders() },
//         body: fd,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Upload failed");
//       const u = data?.photo_url;
//       if (u) {
//         const bust = (u.includes("?") ? "&" : "?") + "t=" + Date.now();
//         setPhotoUrl(u + bust);
//         toast.success("Profile photo updated");
//       }
//     } catch (e) {
//       toast.error(e.message || "Upload failed");
//     } finally {
//       setPhotoLoading(false);
//     }
//   };

//   // ---------- photo: delete ----------
//   const handleDeletePhoto = async () => {
//     if (!ensureAuth()) return;
//     setPhotoDeleting(true);
//     try {
//       const res = await fetch(`${API_URL}/api/profile-photo`, {
//         method: "DELETE",
//         headers: { ...authHeaders() },
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.detail || "Delete failed");
//       setPhotoUrl(null);
//       toast.success("Profile photo removed");
//     } catch (e) {
//       toast.error(e.message || "Delete failed");
//     } finally {
//       setPhotoDeleting(false);
//     }
//   };

//   // ---------- drag & drop ----------
//   const onDrop = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     const file = (e.dataTransfer.files && e.dataTransfer.files[0]) || undefined;
//     startUpload(file);
//   };
//   const onDragOver = (e) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };
//   const onDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50">
//       {/* Top ribbon / header — FULL WIDTH, NO SIDE PADDING */}
//       <div className="relative overflow-hidden">
//         <motion.div
//           className="w-full px-0 pt-6 sm:pt-8 pb-4 sm:pb-6"
//           initial={{ opacity: 0, y: -12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//         >
//           <div className="flex items-center gap-3 px-3 sm:px-4 lg:px-6 xl:px-8">
//             {/* inner small padding so text isn't glued to the edge */}
//             <div className="h-10 w-10 rounded-xl bg-blue-600/90 grid place-items-center shadow-lg">
//               <UserIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
//                 Account Settings
//               </h1>
//               <p className="text-sm sm:text-base text-slate-600">
//                 Manage your profile, security and preferences
//               </p>
//             </div>
//           </div>
//         </motion.div>
//         <motion.div
//           className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent"
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.6 }}
//         />
//       </div>

//       {/* Main content — FULL WIDTH grid, tiny internal padding for breathing */}
//       <div className="w-full px-0 py-6 sm:py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//           {/* LEFT: profile photo card — edge-to-edge on mobile */}
//           <motion.div
//             className="lg:col-span-1 rounded-none lg:rounded-2xl border-x-0 lg:border border-slate-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.45, delay: 0.05 }}
//           >
//             <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
//               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
//                 <PhotoIcon className="w-5 h-5 text-blue-600" />
//                 Profile Photo
//               </h2>

//               <div className="mt-4">
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <div className="rounded-full p-[6px] bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.25)]">
//                       <div className="rounded-full bg-white p-1">
//                         <div className="rounded-full overflow-hidden" style={{ width: 96, height: 96 }}>
//                           <AnimatePresence mode="wait">
//                             {photoUrl ? (
//                               <motion.img
//                                 key={photoUrl}
//                                 src={photoUrl}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover"
//                                 initial={{ opacity: 0.2, scale: 0.98 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 exit={{ opacity: 0, scale: 0.98 }}
//                                 transition={{ duration: 0.25 }}
//                               />
//                             ) : (
//                               <motion.div
//                                 key="initials"
//                                 className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 grid place-items-center text-white text-2xl font-bold"
//                                 initial={{ opacity: 0.2, scale: 0.98 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 exit={{ opacity: 0, scale: 0.98 }}
//                                 transition={{ duration: 0.25 }}
//                               >
//                                 {editData.name?.split(" ")?.map((w) => w[0])?.join("")?.toUpperCase()?.slice(0, 2) || "U"}
//                               </motion.div>
//                             )}
//                           </AnimatePresence>
//                         </div>
//                       </div>
//                     </div>
//                     <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
//                   </div>

//                   <div className="flex-1">
//                     <p className="text-slate-900 font-semibold leading-tight">{editData.name || "User"}</p>
//                     <p className="text-slate-600 text-sm">{editData.email || "-"}</p>
//                   </div>
//                 </div>

//                 <div
//                   className={`mt-5 rounded-xl border-2 ${
//                     isDragOver ? "border-blue-400 bg-blue-50/60" : "border-dashed border-slate-300"
//                   } p-4 transition-colors`}
//                   onDrop={onDrop}
//                   onDragOver={onDragOver}
//                   onDragLeave={onDragLeave}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-blue-600/90 grid place-items-center text-white">
//                       <ArrowUpTrayIcon className="w-5 h-5" />
//                     </div>
//                     <div className="text-sm">
//                       <p className="font-semibold text-slate-900">
//                         Drag & drop a photo here, or{' '}
//                         <button
//                           type="button"
//                           onClick={() => fileInputRef.current?.click()}
//                           className="text-blue-600 underline underline-offset-2 hover:opacity-80"
//                         >
//                           choose file
//                         </button>
//                       </p>
//                       <p className="text-slate-600">PNG, JPG, or WebP up to 5MB. Square images look best.</p>
//                     </div>
//                   </div>

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/png,image/jpeg,image/webp"
//                     className="hidden"
//                     onChange={(e) => startUpload(e.target.files?.[0])}
//                   />
//                 </div>

//                 <div className="mt-4 flex items-center gap-3">
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={photoLoading}
//                     className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {photoLoading ? "Uploading..." : "Upload New"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleDeletePhoto}
//                     disabled={photoDeleting || !photoUrl}
//                     className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50"
//                   >
//                     {photoDeleting ? "Removing..." : "Remove"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* RIGHT: forms — full width on mobile, 2/3 on lg */}
//           <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//             {/* Profile form */}
//             <motion.div
//               className="rounded-none lg:rounded-2xl border-x-0 lg:border border-slate-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, delay: 0.1 }}
//             >
//               <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="h-9 w-9 rounded-lg bg-blue-600/90 grid place-items-center">
//                     <UserIcon className="w-5 h-5 text-white" />
//                   </div>
//                   <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
//                 </div>

//                 <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-2">
//                       <UserIcon className="w-4 h-4 inline mr-2 text-blue-500" />
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       value={editData.name}
//                       onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//                       placeholder="Enter your full name"
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                       disabled={!profileLoaded || saving}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-2">
//                       <EnvelopeIcon className="w-4 h-4 inline mr-2 text-emerald-500" />
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       value={editData.email}
//                       onChange={(e) => setEditData({ ...editData, email: e.target.value })}
//                       placeholder="Enter your email address"
//                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
//                       disabled={!profileLoaded || saving}
//                       required
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <button
//                       type="submit"
//                       disabled={!profileLoaded || saving}
//                       className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//                     >
//                       {saving ? (
//                         <>
//                           <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//                             <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
//                             <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75"></path>
//                           </svg>
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircleIcon className="w-4 h-4" />
//                           Save Changes
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Change password */}
//             <motion.div
//               className="rounded-none lg:rounded-2xl border-x-0 lg:border border-slate-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, delay: 0.15 }}
//             >
//               <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="h-9 w-9 rounded-lg bg-purple-600/90 grid place-items-center">
//                     <LockClosedIcon className="w-5 h-5 text-white" />
//                   </div>
//                   <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
//                 </div>

//                 <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
//                     <div className="relative">
//                       <input
//                         type={showPw.old ? "text" : "password"}
//                         value={pw.old_password}
//                         onChange={(e) => setPw({ ...pw, old_password: e.target.value })}
//                         placeholder="Enter current password"
//                         className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
//                         disabled={pwLoading}
//                         minLength={1}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPw((s) => ({ ...s, old: !s.old }))}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
//                       >
//                         {showPw.old ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
//                     <div className="relative">
//                       <input
//                         type={showPw.next ? "text" : "password"}
//                         value={pw.new_password}
//                         onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
//                         placeholder="Enter new password (min 8 chars)"
//                         className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
//                         disabled={pwLoading}
//                         minLength={8}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPw((s) => ({ ...s, next: !s.next }))}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
//                       >
//                         {showPw.next ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="md:col-span-2">
//                     <button
//                       type="submit"
//                       disabled={pwLoading}
//                       className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
//                     >
//                       {pwLoading ? (
//                         <>
//                           <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//                             <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
//                             <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75"></path>
//                           </svg>
//                           Updating...
//                         </>
//                       ) : (
//                         <>
//                           <ShieldCheckIcon className="w-4 h-4" />
//                           Update Password
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Danger Zone */}
//             <motion.div
//               className="rounded-none lg:rounded-2xl border-x-0 lg:border border-red-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, delay: 0.2 }}
//             >
//               <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="h-9 w-9 rounded-lg bg-red-600 grid place-items-center">
//                     <ExclamationTriangleIcon className="w-5 h-5 text-white" />
//                   </div>
//                   <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
//                 </div>

//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                   <p className="text-red-900 font-semibold mb-1">Delete Account</p>
//                   <p className="text-red-700 text-sm mb-4">
//                     Once you delete your account, there is no going back. Please be certain.
//                   </p>
//                   <button
//                     onClick={() => setShowDeleteConfirm(true)}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
//                   >
//                     <TrashIcon className="w-4 h-4" />
//                     Delete Account
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {showDeleteConfirm && (
//           <motion.div
//             className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm px-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-6"
//               initial={{ y: 20, opacity: 0.9 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: 12, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 260, damping: 22 }}
//             >
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-10 h-10 rounded-lg bg-red-600 grid place-items-center">
//                   <ExclamationTriangleIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-900">Confirm Delete</h3>
//               </div>
//               <p className="text-slate-600">Are you sure you want to delete your account? This action cannot be undone.</p>

//               <div className="mt-6 flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   disabled={deleteLoading}
//                   className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={async () => {
//                     if (!ensureAuth()) return;
//                     setDeleteLoading(true);
//                     try {
//                       const res = await fetch(`${API_URL}/api/delete-account`, {
//                         method: "DELETE",
//                         headers: { ...authHeaders() },
//                       });
//                       const data = await res.json().catch(() => ({}));
//                       if (!res.ok) throw new Error(data?.detail || "Delete failed");
//                       toast.success("Account deleted");
//                       localStorage.removeItem("token");
//                       localStorage.removeItem("role");
//                       navigate("/login");
//                     } catch (e) {
//                       toast.error(e.message || "Delete failed");
//                     } finally {
//                       setDeleteLoading(false);
//                       setShowDeleteConfirm(false);
//                     }
//                   }}
//                   disabled={deleteLoading}
//                   className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
//                 >
//                   {deleteLoading ? "Deleting..." : "Delete Forever"}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }







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
  ArrowUpTrayIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

/** We’ll try both in this order to be resilient to how the router is mounted. */
const API_BASES = [`${API_URL}/api/auth`, `${API_URL}/api`];

export default function SettingsPage() {
  const navigate = useNavigate();

  // profile basics
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [profileLoaded, setProfileLoaded] = useState(false);

  // profile photo
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoDeleting, setPhotoDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // change password
  const [showPw, setShowPw] = useState({ old: false, next: false });
  const [pw, setPw] = useState({ old_password: "", new_password: "" });
  const [pwLoading, setPwLoading] = useState(false);

  // danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // generic loading
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem("token") || "";
  const authHeaders = () => (token() ? { Authorization: `Bearer ${token()}` } : {});

  const ensureAuth = () => {
    if (!token()) {
      toast.error("Authentication required. Please login again.");
      navigate("/login");
      return false;
    }
    return true;
  };

  /** Core fetch that tries /api/auth first, then /api as a fallback. */
  const apiFetch = async (path, opts = {}, { expectJson = true } = {}) => {
    const errors = [];
    for (const base of API_BASES) {
      try {
        const res = await fetch(`${base}${path}`, opts);
        // if unauth, no need to try the second base — user must log in again
        if (res.status === 401 || res.status === 403) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Unauthorized");
        }
        if (res.ok) {
          return expectJson ? await res.json() : res;
        }
        // try the next base ONLY if this looks like a wrong path (404)
        if (res.status === 404) {
          errors.push({ base, status: 404 });
          continue;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || `Request failed (${res.status})`);
      } catch (e) {
        errors.push({ base, err: e?.message });
        // keep looping to try next base unless it was auth
        if (e?.message === "Unauthorized") throw e;
      }
    }
    // if we reach here, both attempts failed
    const msg =
      errors?.length
        ? `Request failed on all bases: ${errors.map((x) => `${x.base}→${x.status || x.err}`).join(" | ")}`
        : "Network error";
    throw new Error(msg);
  };

  // ---------- load profile ----------
  useEffect(() => {
    (async () => {
      if (!ensureAuth()) return;
      try {
        const data = await apiFetch("/user-info", {
          headers: { ...authHeaders(), Accept: "application/json" },
        });

        setEditData({
          name: data?.data?.name || "",
          email: data?.data?.email || "",
        });

        const abs = data?.data?.profile_photo_url;
        if (abs) {
          setPhotoUrl(abs + (abs.includes("?") ? "&" : "?") + "t=" + Date.now());
        } else {
          // fallback to GET /profile-photo (non-redirect JSON)
          try {
            const d2 = await apiFetch("/profile-photo?redirect=false", {
              headers: { ...authHeaders(), Accept: "application/json" },
            });
            const u = d2?.photo_url;
            if (u) setPhotoUrl(u + (u.includes("?") ? "&" : "?") + "t=" + Date.now());
          } catch {
            // no photo set — ignore
          }
        }
        setProfileLoaded(true);
      } catch (e) {
        toast.error("Unable to load profile");
        setProfileLoaded(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- profile update ----------
  const handleSaveProfile = async (e) => {
    e?.preventDefault?.();
    if (!ensureAuth()) return;

    if (!editData.name.trim()) return toast.error("Name is required");
    if (!editData.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) return toast.error("Please enter a valid email");

    setSaving(true);
    try {
      await apiFetch(
        "/update-profile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders(), Accept: "application/json" },
          body: JSON.stringify({ name: editData.name, email: editData.email }),
        }
      );
      localStorage.setItem("name", editData.name);
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ---------- password change ----------
  const handleChangePassword = async (e) => {
    e?.preventDefault?.();
    if (!ensureAuth()) return;
    if (!pw.old_password || !pw.new_password) return toast.error("Please fill both password fields");
    if (pw.new_password.length < 8) return toast.error("New password must be at least 8 characters");

    setPwLoading(true);
    try {
      await apiFetch(
        "/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders(), Accept: "application/json" },
          body: JSON.stringify(pw),
        }
      );
      toast.success("Password changed successfully");
      setPw({ old_password: "", new_password: "" });
    } catch (e) {
      toast.error(e.message || "Password change failed");
    } finally {
      setPwLoading(false);
    }
  };

  // ---------- photo: upload ----------
  const startUpload = async (file) => {
    if (!file) return;
    if (!ensureAuth()) return;

    const okTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okTypes.includes(file.type)) return toast.error("Please upload PNG, JPG or WebP");
    if (file.size > 5 * 1024 * 1024) return toast.error("Max file size is 5MB");

    setPhotoLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await apiFetch("/profile-photo", {
        method: "POST",
        headers: { ...authHeaders() }, // DO NOT set Content-Type; browser sets the boundary
        body: fd,
      });

      const u = data?.photo_url;
      if (u) {
        const bust = (u.includes("?") ? "&" : "?") + "t=" + Date.now();
        setPhotoUrl(u + bust);
        toast.success("Profile photo updated");
      } else {
        throw new Error("Upload returned no URL");
      }
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setPhotoLoading(false);
    }
  };

  // ---------- photo: delete ----------
  const handleDeletePhoto = async () => {
    if (!ensureAuth()) return;
    setPhotoDeleting(true);
    try {
      await apiFetch("/profile-photo", {
        method: "DELETE",
        headers: { ...authHeaders(), Accept: "application/json" },
      });
      setPhotoUrl(null);
      toast.success("Profile photo removed");
    } catch (e) {
      toast.error(e.message || "Delete failed");
    } finally {
      setPhotoDeleting(false);
    }
  };

  // ---------- drag & drop ----------
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = (e.dataTransfer.files && e.dataTransfer.files[0]) || undefined;
    startUpload(file);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Top ribbon / header — FULL WIDTH, NO SIDE PADDING */}
      <div className="relative overflow-hidden">
        <motion.div
          className="w-full px-0 pt-6 sm:pt-8 pb-4 sm:pb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3 px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="h-10 w-10 rounded-xl bg-blue-600/90 grid place-items-center shadow-lg">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Account Settings
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Manage your profile, security and preferences
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Main content — FULL WIDTH grid, tiny internal padding for breathing */}
      <div className="w-full px-0 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LEFT: profile photo card */}
          <motion.div
            className="lg:col-span-1 rounded-none lg:rounded-2xl border-x-0 lg:border border-slate-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PhotoIcon className="w-5 h-5 text-blue-600" />
                Profile Photo
              </h2>

              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="rounded-full p-[6px] bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.25)]">
                      <div className="rounded-full bg-white p-1">
                        <div className="rounded-full overflow-hidden" style={{ width: 96, height: 96 }}>
                          <AnimatePresence mode="wait">
                            {photoUrl ? (
                              <motion.img
                                key={photoUrl}
                                src={photoUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={() => setPhotoUrl(null)}
                                initial={{ opacity: 0.2, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.25 }}
                              />
                            ) : (
                              <motion.div
                                key="initials"
                                className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 grid place-items-center text-white text-2xl font-bold"
                                initial={{ opacity: 0.2, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.25 }}
                              >
                                {editData.name?.split(" ")?.map((w) => w[0])?.join("")?.toUpperCase()?.slice(0, 2) || "U"}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
                  </div>

                  <div className="flex-1">
                    <p className="text-slate-900 font-semibold leading-tight">{editData.name || "User"}</p>
                    <p className="text-slate-600 text-sm">{editData.email || "-"}</p>
                  </div>
                </div>

                <div
                  className={`mt-5 rounded-xl border-2 ${
                    isDragOver ? "border-blue-400 bg-blue-50/60" : "border-dashed border-slate-300"
                  } p-4 transition-colors`}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-600/90 grid place-items-center text-white">
                      <ArrowUpTrayIcon className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900">
                        Drag & drop a photo here, or{" "}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 underline underline-offset-2 hover:opacity-80"
                        >
                          choose file
                        </button>
                      </p>
                      <p className="text-slate-600">PNG, JPG, or WebP up to 5MB. Square images look best.</p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => startUpload(e.target.files?.[0])}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {photoLoading ? "Uploading..." : "Upload New"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={photoDeleting || !photoUrl}
                    className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50"
                  >
                    {photoDeleting ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: forms */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile form */}
            <motion.div
              className="rounded-none lg:rounded-2xl border-x-0 lg:border border-slate-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-blue-600/90 grid place-items-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                </div>

                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      <UserIcon className="w-4 h-4 inline mr-2 text-blue-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      disabled={!profileLoaded || saving}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      <EnvelopeIcon className="w-4 h-4 inline mr-2 text-emerald-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      disabled={!profileLoaded || saving}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={!profileLoaded || saving}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                            <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Change password */}
            <motion.div
              className="rounded-none lg:rounded-2xl border-x-0 lg:border border-slate-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-purple-600/90 grid place-items-center">
                    <LockClosedIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                </div>

                <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPw.old ? "text" : "password"}
                        value={pw.old_password}
                        onChange={(e) => setPw({ ...pw, old_password: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        disabled={pwLoading}
                        minLength={1}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => ({ ...s, old: !s.old }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPw.old ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPw.next ? "text" : "password"}
                        value={pw.new_password}
                        onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
                        placeholder="Enter new password (min 8 chars)"
                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        disabled={pwLoading}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => ({ ...s, next: !s.next }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPw.next ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={pwLoading}
                      className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {pwLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                            <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="w-4 h-4" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              className="rounded-none lg:rounded-2xl border-x-0 lg:border border-red-200 bg-white/80 backdrop-blur-sm shadow-none lg:shadow-sm p-4 sm:p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-red-600 grid place-items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-900 font-semibold mb-1">Delete Account</p>
                  <p className="text-red-700 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-6"
              initial={{ y: 20, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-600 grid place-items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Delete</h3>
              </div>
              <p className="text-slate-600">Are you sure you want to delete your account? This action cannot be undone.</p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!ensureAuth()) return;
                    setDeleteLoading(true);
                    try {
                      await apiFetch("/delete-account", {
                        method: "DELETE",
                        headers: { ...authHeaders(), Accept: "application/json" },
                      });
                      toast.success("Account deleted");
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      navigate("/login");
                    } catch (e) {
                      toast.error(e.message || "Delete failed");
                    } finally {
                      setDeleteLoading(false);
                      setShowDeleteConfirm(false);
                    }
                  }}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  {deleteLoading ? "Deleting..." : "Delete Forever"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
