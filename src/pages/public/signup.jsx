// import { useState } from "react";
// import {
//   Eye,
//   EyeOff,
//   User,
//   Mail,
//   Lock,
//   ArrowRight,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// export default function Signup() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 4) {
//       newErrors.password = "Password must be at least 4 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);
//     setErrors({});

//     // Store username and email in localStorage
//     try {
//       localStorage.setItem("name", formData.username);
//       localStorage.setItem("email", formData.email);
//     } catch (err) {
//       // If localStorage is not available, ignore
//     }

//     try {
//       const response = await fetch("http://localhost:8000/api/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.username,
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Account created successfully! 🎉");
//         setTimeout(() => {
//           navigate(`/otp?email=${encodeURIComponent(formData.email)}`);
//         }, 1200);
//       } else {
//         setErrors({
//           submit: data.message || "Something went wrong. Please try again.",
//         });
//         toast.error(data.message || "Something went wrong. Please try again.");
//       }
//     } catch (error) {
//       setErrors({
//         submit: "Network error. Please check your connection and try again.",
//       });
//       toast.error("Network error. Please check your connection and try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
//             <User className="w-8 h-8 text-white" />
//           </div>
//         </div>

//         <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline cursor-pointer"
//             style={{ cursor: "pointer" }}
//           >
//             Sign in here
//           </a>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
//           {/* Success message is now handled by toast */}
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label
//                 htmlFor="username"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Username
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User
//                     className={`h-5 w-5 transition-colors duration-200 ${
//                       formData.username ? "text-blue-500" : "text-gray-400"
//                     }`}
//                   />
//                 </div>
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   autoComplete="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
//                     errors.username
//                       ? "border-red-300 focus:border-red-500 focus:ring-red-500"
//                       : formData.username
//                       ? "border-green-300"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   placeholder="Enter your username"
//                 />
//                 {formData.username && !errors.username && (
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                   </div>
//                 )}
//               </div>
//               {errors.username && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1" />
//                   {errors.username}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Email address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail
//                     className={`h-5 w-5 transition-colors duration-200 ${
//                       formData.email ? "text-blue-500" : "text-gray-400"
//                     }`}
//                   />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
//                     errors.email
//                       ? "border-red-300 focus:border-red-500 focus:ring-red-500"
//                       : formData.email &&
//                         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
//                       ? "border-green-300"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   placeholder="Enter your email"
//                 />
//                 {formData.email &&
//                   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
//                   !errors.email && (
//                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                       <CheckCircle className="h-5 w-5 text-green-500" />
//                     </div>
//                   )}
//               </div>
//               {errors.email && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1" />
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock
//                     className={`h-5 w-5 transition-colors duration-200 ${
//                       formData.password ? "text-blue-500" : "text-gray-400"
//                     }`}
//                   />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="new-password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
//                     errors.password
//                       ? "border-red-300 focus:border-red-500 focus:ring-red-500"
//                       : formData.password && formData.password.length >= 4
//                       ? "border-green-300"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   placeholder="Create a password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff
//                       className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200"
//                       style={{ cursor: "pointer" }}
//                     />
//                   ) : (
//                     <Eye
//                       className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200"
//                       style={{ cursor: "pointer" }}
//                     />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1" />
//                   {errors.password}
//                 </p>
//               )}
//               <div className="mt-2 flex items-center space-x-2">
//                 <div className="flex-1 bg-gray-200 rounded-full h-1">
//                   <div
//                     className={`h-full rounded-full transition-all duration-300 ${
//                       formData.password.length >= 4
//                         ? "bg-green-500 w-full"
//                         : formData.password.length >= 3
//                         ? "bg-blue-500 w-3/4"
//                         : formData.password.length >= 2
//                         ? "bg-yellow-500 w-1/2"
//                         : formData.password.length > 0
//                         ? "bg-red-500 w-1/4"
//                         : "w-0"
//                     }`}
//                   ></div>
//                 </div>
//                 <span className="text-xs text-gray-500">4+ characters</span>
//               </div>
//             </div>

//             {errors.submit && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//                 <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
//                 <p className="text-sm text-red-700">{errors.submit}</p>
//               </div>
//             )}

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                 style={{ cursor: "pointer" }}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Creating account...
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     Create account
//                     <ArrowRight
//                       className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"
//                       style={{ cursor: "pointer" }}
//                     />
//                   </div>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }























import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Base API URL (env first, localhost fallback)
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    // Pre-store name & email (optional convenience)
    try {
      localStorage.setItem("name", formData.username);
      localStorage.setItem("email", formData.email);
    } catch (_) {}

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! 🎉");
        setTimeout(() => {
          navigate(`/otp?email=${encodeURIComponent(formData.email)}`);
        }, 1200);
      } else {
        const msg = data.message || data.detail || "Something went wrong. Please try again.";
        setErrors({ submit: msg });
        toast.error(msg);
      }
    } catch {
      const msg = "Network error. Please check your connection and try again.";
      setErrors({ submit: msg });
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple strength bar tied to length (now keyed to 6+)
  const pwdLen = formData.password.length;
  const strengthClass =
    pwdLen >= 6
      ? "bg-green-500 w-full"
      : pwdLen >= 4
      ? "bg-blue-500 w-3/4"
      : pwdLen >= 2
      ? "bg-yellow-500 w-1/2"
      : pwdLen > 0
      ? "bg-red-500 w-1/4"
      : "w-0";

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline cursor-pointer"
          >
            Sign in here
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${formData.username ? "text-blue-500" : "text-gray-400"}`} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : formData.username
                      ? "border-green-300"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Enter your username"
                />
                {formData.username && !errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${formData.email ? "text-blue-500" : "text-gray-400"}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                      ? "border-green-300"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Enter your email"
                />
                {formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${formData.password ? "text-blue-500" : "text-gray-400"}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : formData.password && formData.password.length >= 6
                      ? "border-green-300"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                  )}
                </button>
              </div>

              {/* Strength bar (6+ chars = full) */}
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1">
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthClass}`} />
                </div>
                <span className="text-xs text-gray-500">6+ characters</span>
              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
