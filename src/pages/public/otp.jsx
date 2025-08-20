// "use client";

// import { useState, useRef, useEffect } from "react";
// import { ArrowRight, RefreshCw, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// export default function OTPVerification() {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendCooldown, setResendCooldown] = useState(0);
//   const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Get email from URL params
//     const urlParams = new URLSearchParams(window.location.search);
//     const emailParam = urlParams.get("email");
//     if (emailParam) {
//       setEmail(decodeURIComponent(emailParam));
//     }
//   }, []);

//   useEffect(() => {
//     // Countdown for resend button
//     if (resendCooldown > 0) {
//       const timer = setTimeout(
//         () => setResendCooldown(resendCooldown - 1),
//         1000
//       );
//       return () => clearTimeout(timer);
//     }
//   }, [resendCooldown]);

//   const handleInputChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 3) {
//       inputRefs[index + 1].current?.focus();
//     }

//     if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 4) {
//       handleSubmit(newOtp.join(""));
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs[index - 1].current?.focus();
//     }
//     if (e.key === "Enter") {
//       handleSubmit(otp.join(""));
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, 4);
//     const newOtp = [...otp];
//     for (let i = 0; i < pastedData.length; i++) {
//       newOtp[i] = pastedData[i];
//     }
//     setOtp(newOtp);

//     const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
//     if (nextEmptyIndex !== -1) {
//       inputRefs[nextEmptyIndex].current?.focus();
//     } else {
//       inputRefs[3].current?.focus();
//     }

//     if (newOtp.every((digit) => digit !== "")) {
//       handleSubmit(newOtp.join(""));
//     }
//   };

//   const handleSubmit = async (otpCode = null) => {
//     const codeToSubmit = otpCode || otp.join("");
//     if (codeToSubmit.length !== 4) {
//       toast.error("Please enter all 4 digits");
//       return;
//     }
//     if (!email) {
//       toast.error("Email is required for verification");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/account-verification",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             code: codeToSubmit,
//             email: email,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         if (data.token) {
//           localStorage.setItem("token", data.token);
//         }
//         if (data.user && data.user.role) {
//           localStorage.setItem("role", data.user.role);
//         }
//         toast.success("Account verified successfully! 🎉");
//         setTimeout(() => {
//           const role =
//             (data.user && data.user.role) || localStorage.getItem("role") || "";
//           if (role === "user") {
//             navigate("/user/dashboard");
//           } else if (role === "admin") {
//             navigate("/admin/dashboard");
//           } else {
//             navigate("/dashboard");
//           }
//         }, 1500);
//       } else {
//         toast.error(
//           data.message || "Invalid verification code. Please try again."
//         );
//         setOtp(["", "", "", ""]);
//         inputRefs[0].current?.focus();
//       }
//     } catch (error) {
//       toast.error("Network error. Please check your connection and try again.");
//       setOtp(["", "", "", ""]);
//       inputRefs[0].current?.focus();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     if (resendCooldown > 0) return;
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:8000/api/resend-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//         }),
//       });
//       if (response.ok) {
//         toast.success("New verification code sent to your email!");
//         setResendCooldown(60);
//         setOtp(["", "", "", ""]);
//         inputRefs[0].current?.focus();
//       } else {
//         toast.error("Failed to resend code. Please try again.");
//       }
//     } catch (error) {
//       toast.error("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
//             <Mail className="w-8 h-8 text-white" />
//           </div>
//         </div>

//         <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
//           Verify your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           We've sent a 4-digit verification code to
//           <br />
//           <span className="font-medium text-blue-600">
//             {email || "your email"}
//           </span>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubmit();
//             }}
//           >
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
//                 Enter verification code
//               </label>
//               <div className="flex justify-center space-x-3">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     ref={inputRefs[index]}
//                     type="text"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handleInputChange(index, e.target.value)}
//                     onKeyDown={(e) => handleKeyDown(index, e)}
//                     onPaste={handlePaste}
//                     className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
//                       digit
//                         ? "border-green-300 bg-green-50"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                     disabled={isLoading}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="mb-4">
//               <button
//                 type="submit"
//                 disabled={isLoading || otp.join("").length !== 4}
//                 className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Verifying...
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     Verify Account
//                     <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
//                   </div>
//                 )}
//               </button>
//             </div>

//             <div className="text-center">
//               <p className="text-sm text-gray-600 mb-2">
//                 Didn't receive the code?
//               </p>
//               <button
//                 type="button"
//                 onClick={handleResendCode}
//                 disabled={resendCooldown > 0 || isLoading}
//                 className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
//               >
//                 <RefreshCw className="mr-1 h-4 w-4" />
//                 {resendCooldown > 0
//                   ? `Resend in ${resendCooldown}s`
//                   : "Resend Code"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, RefreshCw, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    // Auto-focus first input
    setTimeout(() => inputRefs[0].current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (index, value) => {
    // keep only digits
    const v = value.replace(/\D/g, "");
    if (v.length > 1) return; // single char only
    const newOtp = [...otp];
    newOtp[index] = v;
    setOtp(newOtp);

    if (v && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 4) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter") {
      handleSubmit(otp.join(""));
    }
    // Left/Right arrows to move between boxes
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const newOtp = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((d) => d === "");
    if (nextEmpty !== -1) inputRefs[nextEmpty].current?.focus();
    else inputRefs[3].current?.focus();

    if (newOtp.every((d) => d !== "")) handleSubmit(newOtp.join(""));
  };

  const handleSubmit = async (otpCode = null) => {
    const codeToSubmit = otpCode || otp.join("");
    if (codeToSubmit.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }
    if (!email) {
      toast.error("Email is required for verification");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/account-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToSubmit, email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user?.role) localStorage.setItem("role", data.user.role);

        toast.success("Account verified successfully! ✨");
        // Single, consistent navigation after verification:
        setTimeout(() => navigate("/profile"), 800);
      } else {
        toast.error("Invalid OTP. Please try again.");
        setOtp(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    } catch (err) {
      toast.error("Network error. Please check your connection and try again.");
      setOtp(["", "", "", ""]);
      inputRefs[0].current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("New verification code sent to your email.");
        setResendCooldown(60);
        setOtp(["", "", "", ""]);
        inputRefs[0].current?.focus();
      } else {
        toast.error("Failed to resend code. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Small helpers for glow style
  const glow = "shadow-[0_0_30px_rgba(37,99,235,0.35)]";

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated conic/radial glow background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(closest-side, #93c5fd, transparent)" }}
          animate={{ y: [0, 20, 0], x: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="absolute -bottom-48 -right-48 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-70"
          style={{ background: "radial-gradient(closest-side, #a5f3fc, transparent)" }}
          animate={{ y: [0, -16, 0], x: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(59,130,246,0.12), rgba(6,182,212,0.12), rgba(59,130,246,0.12))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />
      </div>

      {/* Page shell */}
      <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Neon Logo Ring */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={`relative h-16 w-16 rounded-2xl bg-white border border-blue-200/70 ${glow} flex items-center justify-center`}
            >
              {/* subtle animated ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(59,130,246,0.25), rgba(6,182,212,0.25), rgba(59,130,246,0.25))",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                aria-hidden
              />
              <div className="absolute inset-[3px] rounded-2xl bg-white" />
              <Mail className="relative w-7 h-7 text-blue-600" />
            </motion.div>
          </div>

          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900"
          >
            Verify your account
          </motion.h2>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-center text-sm text-slate-600"
          >
            We sent a 4-digit code to
            <br />
            <span className="font-medium text-blue-600">{email || "your email"}</span>
          </motion.p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className={`bg-white/90 backdrop-blur-sm py-8 px-6 sm:px-10 border border-slate-200 rounded-2xl shadow-xl ${glow}`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* OTP inputs */}
              <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                Enter verification code
              </label>

              <div className="flex justify-center gap-3 sm:gap-4 mb-6">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    aria-label={`OTP digit ${index + 1}`}
                    disabled={isLoading}
                    className={`w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl sm:text-3xl font-bold rounded-xl outline-none transition-all duration-200
                      border-2 bg-white/90 backdrop-blur
                      focus:ring-2
                      ${
                        digit
                          ? "border-blue-400 focus:ring-blue-300"
                          : "border-slate-200 focus:border-blue-400 focus:ring-blue-300"
                      }
                      ${digit ? glow : ""}
                      text-slate-900 placeholder-slate-400`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                  />
                ))}
              </div>

              {/* Verify button */}
              <motion.button
                type="submit"
                disabled={isLoading || otp.join("").length !== 4}
                className={`group w-full relative overflow-hidden flex justify-center items-center py-3 px-4 text-sm font-semibold rounded-xl text-white
                  transition-all duration-200
                  ${isLoading || otp.join("").length !== 4 ? "bg-blue-500/80" : "bg-blue-600 hover:bg-blue-700"}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  shadow-lg hover:shadow-xl ${glow}`}
                whileTap={{ scale: 0.98 }}
              >
                {/* subtle glossy sweep */}
                <span className="pointer-events-none absolute inset-0 opacity-40">
                  <span className="absolute -inset-12 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent w-2/3 h-[200%] translate-x-[-150%] group-hover:translate-x-[120%] transition-transform duration-700" />
                </span>

                {isLoading ? (
                  <div className="flex items-center">
                    <span className="inline-block animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Verifying…
                  </div>
                ) : (
                  <div className="flex items-center">
                    Verify Account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                )}
              </motion.button>

              {/* Resend */}
              <div className="mt-5 text-center">
                <p className="text-sm text-slate-600 mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isLoading || !email}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
