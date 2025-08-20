// "use client";

// import { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Mail,
//   ArrowRight,
//   AlertCircle,
//   ArrowLeft,
//   Key,
//   Lock,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /** Compact & stylish 4-box OTP input (no # icon) */
// function OTPInput({ length = 4, value, onChange }) {
//   const inputsRef = useRef([]);

//   const focusIndex = (idx) => {
//     const el = inputsRef.current[idx];
//     if (el) el.focus();
//   };

//   const handleChange = (idx, v) => {
//     const char = v.replace(/\D/g, "").slice(0, 1);
//     const next = (value || "").split("");
//     next[idx] = char;
//     const joined = next.join("");
//     onChange(joined);
//     if (char && idx < length - 1) focusIndex(idx + 1);
//   };

//   const handleKeyDown = (idx, e) => {
//     const currentChar = (value || "")[idx] || "";
//     if (e.key === "Backspace") {
//       if (!currentChar && idx > 0) {
//         e.preventDefault();
//         const next = (value || "").split("");
//         next[idx - 1] = "";
//         onChange(next.join(""));
//         focusIndex(idx - 1);
//       }
//     } else if (e.key === "ArrowLeft" && idx > 0) {
//       e.preventDefault();
//       focusIndex(idx - 1);
//     } else if (e.key === "ArrowRight" && idx < length - 1) {
//       e.preventDefault();
//       focusIndex(idx + 1);
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
//     if (!text) return;
//     const next = (value || "").split("");
//     for (let i = 0; i < length; i++) next[i] = text[i] || "";
//     onChange(next.join(""));
//     const lastFilled = Math.min(text.length, length) - 1;
//     focusIndex(lastFilled >= 0 ? lastFilled : 0);
//   };

//   return (
//     <div className="flex items-center justify-center gap-1.5 sm:gap-2">
//       {Array.from({ length }).map((_, i) => {
//         const d = (value || "")[i] || "";
//         return (
//           <input
//             key={i}
//             ref={(el) => (inputsRef.current[i] = el)}
//             inputMode="numeric"
//             pattern="[0-9]*"
//             maxLength={1}
//             value={d}
//             onChange={(e) => handleChange(i, e.target.value)}
//             onKeyDown={(e) => handleKeyDown(i, e)}
//             onPaste={i === 0 ? handlePaste : undefined}
//             className="w-11 h-11 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold
//                        rounded-2xl border bg-white/80 backdrop-blur
//                        border-gray-200 shadow-sm hover:shadow transition-all
//                        focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500
//                        focus:shadow-[0_6px_24px_rgba(59,130,246,0.18)] focus:scale-105
//                        caret-transparent select-none"
//             aria-label={`OTP digit ${i + 1}`}
//           />
//         );
//       })}
//     </div>
//   );
// }

// export default function ForgotPassword() {
//   const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState(""); // 4-digit as string
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateEmail = () => {
//     const newErrors = {};
//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = "Please enter a valid email address";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validatePasswordStep = () => {
//     const newErrors = {};
//     if (!code || code.length !== 4) newErrors.code = "Enter the 4-digit OTP";
//     if (!password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!validateEmail()) return;

//     setIsLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/api/password-reset-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success("Password reset OTP sent to your email! 📧");
//         setStep(2);
//       } else {
//         toast.error(data.detail || "Something went wrong.");
//       }
//     } catch {
//       toast.error("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (!validatePasswordStep()) return;

//     setIsLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/api/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, code, password }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Password changed successfully! 🎉");
//         navigate("/user"); // or "/dashboard"
//       } else {
//         toast.error(data.detail || "Failed to reset password.");
//       }
//     } catch {
//       toast.error("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const canSubmitStep2 = code.length === 4 && password.length >= 6;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
//             <Key className="w-8 h-8 text-white" />
//           </div>
//         </div>

//         <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
//           {step === 1 ? "Reset your password" : "Enter OTP & New Password"}
//         </h2>
//         {step === 2 && (
//           <p className="mt-2 text-center text-sm text-gray-600">
//             We’ve sent a 4-digit code to{" "}
//             <span className="font-medium">{email}</span>
//           </p>
//         )}
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white/90 backdrop-blur py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
//           {step === 1 && (
//             <form className="space-y-6" onSubmit={handleSendOtp}>
//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email address
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className={`h-5 w-5 absolute left-3 top-3 ${
//                       email ? "text-blue-500" : "text-gray-400"
//                     }`}
//                   />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10 w-full border border-gray-300 rounded-xl py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     placeholder="Enter your email"
//                     autoComplete="email"
//                     autoFocus
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="h-4 w-4 mr-1" />
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Sending…
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     Send OTP
//                     <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
//                   </div>
//                 )}
//               </button>
//             </form>
//           )}

//           {step === 2 && (
//             <form className="space-y-6" onSubmit={handleResetPassword}>
//               {/* OTP */}
//               <div>
//                 <div className="flex items-baseline justify-between">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     OTP Code
//                   </label>
//                   <span className="text-xs text-gray-500">4 digits</span>
//                 </div>
//                 <OTPInput length={4} value={setCode ? code : ""} onChange={setCode} />
//                 {errors.code && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="h-4 w-4 mr-1" />
//                     {errors.code}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10 pr-12 w-full border border-gray-300 rounded-xl py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     placeholder="Enter new password"
//                     autoComplete="new-password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((s) => !s)}
//                     className="absolute right-3 top-2.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="h-4 w-4 mr-1" />
//                     {errors.password}
//                   </p>
//                 )}
//                 <p className="mt-1 text-xs text-gray-500">Use at least 6 characters.</p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading || !(code.length === 4 && password.length >= 6)}
//                 className="w-full py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? "Resetting…" : "Reset Password"}
//               </button>

//               <div className="text-center">
//                 <button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
//                 >
//                   <ArrowLeft className="mr-1 h-4 w-4" />
//                   Change email
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* Help footer */}
//           <div className="mt-6 pt-6 border-t border-gray-100 text-center">
//             <p className="text-xs text-gray-500">
//               Remember your password?{" "}
//               <a href="/login" className="text-blue-600 hover:text-blue-500 hover:underline">
//                 Sign in here
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



































"use client";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Key,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Compact & stylish 4-box OTP input (no # icon) */
function OTPInput({ length = 4, value, onChange }) {
  const inputsRef = useRef([]);

  const focusIndex = (idx) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  };

  const handleChange = (idx, v) => {
    const char = v.replace(/\D/g, "").slice(0, 1);
    const next = (value || "").split("");
    next[idx] = char;
    const joined = next.join("");
    onChange(joined);
    if (char && idx < length - 1) focusIndex(idx + 1);
  };

  const handleKeyDown = (idx, e) => {
    const currentChar = (value || "")[idx] || "";
    if (e.key === "Backspace") {
      if (!currentChar && idx > 0) {
        e.preventDefault();
        const next = (value || "").split("");
        next[idx - 1] = "";
        onChange(next.join(""));
        focusIndex(idx - 1);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      focusIndex(idx - 1);
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      e.preventDefault();
      focusIndex(idx + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!text) return;
    const next = (value || "").split("");
    for (let i = 0; i < length; i++) next[i] = text[i] || "";
    onChange(next.join(""));
    const lastFilled = Math.min(text.length, length) - 1;
    focusIndex(lastFilled >= 0 ? lastFilled : 0);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {Array.from({ length }).map((_, i) => {
        const d = (value || "")[i] || "";
        return (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className="w-11 h-11 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold
                       rounded-2xl border bg-white/80 backdrop-blur
                       border-gray-200 shadow-sm hover:shadow transition-all
                       focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500
                       focus:shadow-[0_6px_24px_rgba(59,130,246,0.18)] focus:scale-105
                       caret-transparent select-none"
            aria-label={`OTP digit ${i + 1}`}
          />
        );
      })}
    </div>
  );
}

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // 4-digit as string
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Base API URL (env first, localhost fallback)
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

  const validateEmail = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordStep = () => {
    const newErrors = {};
    if (!code || code.length !== 4) newErrors.code = "Enter the 4-digit OTP";
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/password-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset OTP sent to your email! 📧");
        setStep(2);
      } else {
        toast.error(data.detail || "Something went wrong.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordStep()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Password changed successfully! 🎉");
        navigate("/user"); // or "/dashboard"
      } else {
        toast.error(data.detail || "Failed to reset password.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Key className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {step === 1 ? "Reset your password" : "Enter OTP & New Password"}
        </h2>
        {step === 2 && (
          <p className="mt-2 text-center text-sm text-gray-600">
            We’ve sent a 4-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 backdrop-blur py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className={`h-5 w-5 absolute left-3 top-3 ${
                      email ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-xl py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending…
                  </div>
                ) : (
                  <div className="flex items-center">
                    Send OTP
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {/* OTP */}
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <span className="text-xs text-gray-500">4 digits</span>
                </div>
                <OTPInput length={4} value={code} onChange={setCode} />
                {errors.code && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.code}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12 w-full border border-gray-300 rounded-xl py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-2.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Use at least 6 characters.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !(code.length === 4 && password.length >= 6)}
                className="w-full py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting…" : "Reset Password"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Change email
                </button>
              </div>
            </form>
          )}

          {/* Help footer */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Remember your password?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-500 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
