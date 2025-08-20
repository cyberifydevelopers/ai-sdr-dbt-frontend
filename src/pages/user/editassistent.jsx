// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { voiceset2, voiceset3 } from "../../helpers/data.js";

// // Color scheme
// const colors = {
//   primary: "#4F46E5", // Indigo
//   secondary: "#10B981", // Emerald
//   danger: "#EF4444", // Red
//   text: "#374151", // Gray-700
//   lightText: "#6B7280", // Gray-500
//   border: "#E5E7EB", // Gray-200
//   background: "#F9FAFB", // Gray-50
//   card: "#FFFFFF", // White
//   hover: "#F9FAFB", // Gray-50
//   radioSelected: "#1F2937", // Gray-800 for radio button effect
//   radioBorder: "#374151", // Gray-700 for radio button border
// };

// const EditAssistant = () => {
//   const { assistantId } = useParams();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isAudioPlaying, setIsAudioPlaying] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     system_prompt: "",
//     first_message: "",
//     files: null,
//     existing_file_urls: [],
//     voice: "",
//     voiceSet: "all",
//   });
//   const [errors, setErrors] = useState({
//     name: "",
//     phone: "",
//     system_prompt: "",
//     first_message: "",
//     files: "",
//     voice: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const audioInstance = useRef(null);

//   // Combine and sort voiceset2 and voiceset3
//   const allVoices = [...voiceset2, ...voiceset3].sort((a, b) =>
//     a.showName.localeCompare(b.showName)
//   );

//   useEffect(() => {
//     const fetchAssistant = async () => {
//       const token = localStorage.getItem("token");
//       console.log("Token:", token);
//       console.log("Assistant ID:", assistantId);

//       if (!token) {
//         toast.error("No authentication token found. Please log in.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:8000/api/getassistant", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("Response Status:", response.status);
//         console.log("Response Headers:", [...response.headers]);

//         if (!response.ok) {
//           if (response.status === 403) {
//             throw new Error(
//               "Access denied: Invalid or insufficient permissions"
//             );
//           } else if (response.status === 401) {
//             throw new Error("Unauthorized: Please log in again");
//           } else {
//             const text = await response.text();
//             console.log("Response Body:", text);
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//         }

//         const data = await response.json();
//         console.log("Response Data:", data);

//         const assistant = data.assistants.find(
//           (a) => a.assistant_id === assistantId
//         );
//         if (!assistant) {
//           throw new Error("Assistant not found");
//         }

//         setFormData({
//           name: assistant.name || "",
//           phone: assistant.phone || "",
//           system_prompt: assistant.system_prompt || "",
//           first_message: assistant.first_message || "",
//           files: null,
//           existing_file_urls: assistant.file_urls || [],
//           voice: assistant.voice || "",
//           voiceSet: "all",
//         });
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching assistant:", error.message);
//         toast.error(error.message);
//         navigate("/");
//       }
//     };

//     fetchAssistant();
//   }, [assistantId, navigate]);

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//     setErrors((prev) => ({ ...prev, [id]: "" }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, files: e.target.files }));
//     setErrors((prev) => ({ ...prev, files: "" }));
//   };

//   const validateStep1 = () => {
//     const newErrors = { ...errors };
//     let isValid = true;
//     const phoneRegex = /^\+\d{10,15}$/;
//     const allowedFileTypes = ["text/plain", "application/pdf", "text/csv"];
//     const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

//     if (!formData.name.trim()) {
//       newErrors.name = "Please enter an assistant name";
//       isValid = false;
//     }
//     if (!formData.phone) {
//       newErrors.phone = "Please select a phone number";
//       isValid = false;
//     } else if (!phoneRegex.test(formData.phone)) {
//       newErrors.phone =
//         "Phone number must be in international format (e.g., +1234567890)";
//       isValid = false;
//     }
//     if (!formData.system_prompt.trim()) {
//       newErrors.system_prompt = "Please enter a system prompt";
//       isValid = false;
//     }
//     if (!formData.first_message.trim()) {
//       newErrors.first_message = "Please enter a first message";
//       isValid = false;
//     }
//     if (formData.files && formData.files.length > 0) {
//       for (let i = 0; i < formData.files.length; i++) {
//         if (!allowedFileTypes.includes(formData.files[i].type)) {
//           newErrors.files = "Only .txt, .pdf, and .csv files are allowed";
//           isValid = false;
//           break;
//         }
//         if (formData.files[i].size > maxFileSize) {
//           newErrors.files = "Each file must be under 5MB";
//           isValid = false;
//           break;
//         }
//       }
//     }
//     setErrors(newErrors);
//     return isValid;
//   };

//   const validateStep2 = () => {
//     const newErrors = { ...errors };
//     let isValid = true;
//     if (!formData.voice) {
//       newErrors.voice = "Please select a voice";
//       isValid = false;
//     }
//     setErrors(newErrors);
//     return isValid;
//   };

//   const handlePlayVoice = (audioSr) => {
//     if (audioInstance.current) {
//       audioInstance.current.pause();
//       audioInstance.current = null;
//       setIsAudioPlaying(false);
//     }
//     const audio = new Audio(audioSr);
//     audioInstance.current = audio;
//     setIsAudioPlaying(true);
//     audio.play().catch((error) => {
//       console.error("Error playing audio:", error);
//       toast.error("Failed to play voice preview");
//       setIsAudioPlaying(false);
//     });
//     audio.onended = () => {
//       setIsAudioPlaying(false);
//       audioInstance.current = null;
//     };
//   };

//   const handleStopVoice = () => {
//     if (audioInstance.current) {
//       audioInstance.current.pause();
//       audioInstance.current = null;
//       setIsAudioPlaying(false);
//     }
//   };

//   const handleStepChange = (step) => {
//     if (step === 1) {
//       setCurrentStep(1);
//       handleStopVoice();
//     } else if (step === 2) {
//       setCurrentStep(2);
//       // Automatically select the first voice from the filtered list if no voice is selected
//       if (!formData.voice) {
//         const filteredVoices = allVoices.filter((voice) =>
//           formData.voiceSet === "voiceset1"
//             ? voiceset2.includes(voice)
//             : formData.voiceSet === "voiceset2"
//             ? voiceset3.includes(voice)
//             : true
//         );
//         if (filteredVoices.length > 0 && filteredVoices[0].name) {
//           setFormData((prev) => ({ ...prev, voice: filteredVoices[0].name }));
//           setErrors((prev) => ({ ...prev, voice: "" }));
//         }
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     // Validate both steps before submission
//     if (!validateStep1()) {
//       setCurrentStep(1);
//       toast.error("Please complete all required fields in Step 1");
//       return;
//     }
//     if (!validateStep2()) {
//       setCurrentStep(2);
//       toast.error("Please select a voice in Step 2");
//       return;
//     }

//     setIsSubmitting(true);
//     handleStopVoice();

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("assistantName", formData.name);
//       formDataToSend.append("phone", formData.phone);
//       formDataToSend.append("systemPrompt", formData.system_prompt);
//       formDataToSend.append("firstMessage", formData.first_message);
//       formDataToSend.append("voice", formData.voice);
//       if (formData.files) {
//         for (let i = 0; i < formData.files.length; i++) {
//           formDataToSend.append("files", formData.files[i]);
//         }
//       }
//       if (formData.existing_file_urls.length > 0) {
//         formDataToSend.append(
//           "file_urls",
//           JSON.stringify(formData.existing_file_urls)
//         );
//       }

//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }

//       const response = await fetch(
//         `http://localhost:8000/api/update/assistant/${assistantId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formDataToSend,
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         console.log("Update Response Body:", text);
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       toast.success("Assistant updated successfully!");
//       navigate("/user/callassistent");
//     } catch (error) {
//       console.error("Error updating assistant:", error.message);
//       toast.error(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         className="min-h-screen flex justify-center items-center"
//         style={{ backgroundColor: colors.background }}
//       >
//         <div
//           className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
//           style={{ borderColor: colors.primary }}
//         ></div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen"
//       style={{ backgroundColor: colors.background }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div
//           className="mb-8 bg-white rounded-xl shadow-sm border py-4 px-6 text-center"
//           style={{ borderColor: colors.border }}
//         >
//           <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
//             Edit Assistant
//           </h1>
//         </div>
//         {/* Stepper Navigation */}
//         <div className="mb-6 flex justify-center gap-4">
//           <div
//             className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
//               currentStep === 1
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//             onClick={() => handleStepChange(1)}
//             aria-current={currentStep === 1 ? "step" : undefined}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => e.key === "Enter" && handleStepChange(1)}
//           >
//             Step 1: Assistant Details
//           </div>
//           <div
//             className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
//               currentStep === 2
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//             onClick={() => handleStepChange(2)}
//             aria-current={currentStep === 2 ? "step" : undefined}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => e.key === "Enter" && handleStepChange(2)}
//           >
//             Step 2: Voice Selection
//           </div>
//         </div>
//         <div
//           className="rounded-xl shadow-md border p-8 transition-transform hover:scale-[1.01]"
//           style={{ backgroundColor: colors.card, borderColor: colors.border }}
//         >
//           <form onSubmit={handleSubmit} noValidate>
//             {currentStep === 1 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="mb-6">
//                   <label
//                     htmlFor="name"
//                     className="flex items-center gap-2 text-lg font-semibold mb-2"
//                     style={{ color: colors.text }}
//                   >
//                     <svg
//                       className="w-5 h-5 text-indigo-600"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     Assistant Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
//                     style={{
//                       borderColor: colors.border,
//                       color: colors.text,
//                       backgroundColor: colors.card,
//                     }}
//                     placeholder="Enter assistant name (e.g., SupportBot)"
//                   />
//                   {errors.name && (
//                     <p
//                       className="text-sm mt-2 flex items-center gap-1"
//                       style={{ color: colors.danger }}
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-6">
//                   <label
//                     htmlFor="phone"
//                     className="flex items-center gap-2 text-lg font-semibold mb-2"
//                     style={{ color: colors.text }}
//                   >
//                     <svg
//                       className="w-5 h-5 text-indigo-600"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                       />
//                     </svg>
//                     Phone Number
//                   </label>
//                   <select
//                     id="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
//                     style={{
//                       borderColor: colors.border,
//                       color: colors.text,
//                       backgroundColor: colors.card,
//                     }}
//                   >
//                     <option value="">Select a phone number</option>
//                     <option value="+1234567890">+1234567890 (Demo)</option>
//                     <option value="+1987654321">+1987654321</option>
//                     <option value="+1123456789">+1123456789</option>
//                   </select>
//                   {errors.phone && (
//                     <p
//                       className="text-sm mt-2 flex items-center gap-1"
//                       style={{ color: colors.danger }}
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       {errors.phone}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-6 md:col-span-2">
//                   <label
//                     htmlFor="system_prompt"
//                     className="flex items-center gap-2 text-lg font-semibold mb-2"
//                     style={{ color: colors.text }}
//                   >
//                     <svg
//                       className="w-5 h-5 text-indigo-600"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4h.01M19 16h-4v-4h.01M12 16V8"
//                       />
//                     </svg>
//                     System Prompt
//                   </label>
//                   <textarea
//                     id="system_prompt"
//                     value={formData.system_prompt}
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
//                     style={{
//                       borderColor: colors.border,
//                       color: colors.text,
//                       backgroundColor: colors.card,
//                     }}
//                     placeholder="Enter system prompt"
//                     rows="5"
//                   ></textarea>
//                   {errors.system_prompt && (
//                     <p
//                       className="text-sm mt-2 flex items-center gap-1"
//                       style={{ color: colors.danger }}
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       {errors.system_prompt}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-6 md:col-span-2">
//                   <label
//                     htmlFor="first_message"
//                     className="flex items-center gap-2 text-lg font-semibold mb-2"
//                     style={{ color: colors.text }}
//                   >
//                     <svg
//                       className="w-5 h-5 text-indigo-600"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4h.01M19 16h-4v-4h.01M12 16V8"
//                       />
//                     </svg>
//                     First Message
//                   </label>
//                   <textarea
//                     id="first_message"
//                     value={formData.first_message}
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
//                     style={{
//                       borderColor: colors.border,
//                       color: colors.text,
//                       backgroundColor: colors.card,
//                     }}
//                     placeholder="Enter the assistant's first message"
//                     rows="3"
//                   ></textarea>
//                   {errors.first_message && (
//                     <p
//                       className="text-sm mt-2 flex items-center gap-1"
//                       style={{ color: colors.danger }}
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       {errors.first_message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-6 md:col-span-2">
//                   <label
//                     htmlFor="files"
//                     className="flex items-center gap-2 text-lg font-semibold mb-2"
//                     style={{ color: colors.text }}
//                   >
//                     <svg
//                       className="w-5 h-5 text-indigo-600"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                       />
//                     </svg>
//                     Add New Files (Optional)
//                   </label>
//                   <input
//                     type="file"
//                     id="files"
//                     multiple
//                     accept=".txt,.pdf,.csv"
//                     onChange={handleFileChange}
//                     className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
//                     style={{
//                       borderColor: colors.border,
//                       color: colors.text,
//                       backgroundColor: colors.card,
//                     }}
//                   />
//                   {errors.files && (
//                     <p
//                       className="text-sm mt-2 flex items-center gap-1"
//                       style={{ color: colors.danger }}
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       {errors.files}
//                     </p>
//                   )}
//                   <p
//                     className="text-sm mt-2"
//                     style={{ color: colors.lightText }}
//                   >
//                     Supported formats: .txt, .pdf, .csv (max 5MB per file)
//                   </p>
//                   {formData.existing_file_urls.length > 0 && (
//                     <div className="mt-4">
//                       <p className="font-medium" style={{ color: colors.text }}>
//                         Existing Files:
//                       </p>
//                       <ul className="list-disc pl-5">
//                         {formData.existing_file_urls.map((url, index) => (
//                           <li key={index}>
//                             <a
//                               href={url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-sm"
//                               style={{ color: colors.primary }}
//                             >
//                               {url}
//                             </a>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//             {currentStep === 2 && (
//               <div>
//                 <label
//                   htmlFor="voice"
//                   className="flex items-center gap-2 text-lg font-semibold mb-4"
//                   style={{ color: colors.text }}
//                 >
//                   <svg
//                     className="w-5 h-5 text-indigo-600"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
//                     />
//                   </svg>
//                   Voice Selection
//                 </label>
//                 <div className="mb-6">
//                   <select
//                     id="voiceSet"
//                     value={formData.voiceSet}
//                     onChange={(e) => {
//                       setFormData((prev) => ({
//                         ...prev,
//                         voiceSet: e.target.value,
//                         voice: "",
//                       }));
//                       setErrors((prev) => ({ ...prev, voice: "" }));
//                       handleStopVoice();
//                       // Automatically select the first voice of the new voice set
//                       const filteredVoices = allVoices.filter((voice) =>
//                         e.target.value === "voiceset1"
//                           ? voiceset2.includes(voice)
//                           : e.target.value === "voiceset2"
//                           ? voiceset3.includes(voice)
//                           : true
//                       );
//                       if (filteredVoices.length > 0 && filteredVoices[0].name) {
//                         setFormData((prev) => ({
//                           ...prev,
//                           voice: filteredVoices[0].name,
//                         }));
//                         setErrors((prev) => ({ ...prev, voice: "" }));
//                       }
//                     }}
//                     className="w-full md:w-64 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
//                     style={{
//                       borderColor: colors.border,
//                       color: colors.text,
//                       backgroundColor: colors.card,
//                     }}
//                   >
//                     <option value="all">All Voices</option>
//                     <option value="voiceset1">Voice Set 1</option>
//                     <option value="voiceset2">Voice Set 2</option>
//                   </select>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {allVoices
//                     .filter((voice) =>
//                       formData.voiceSet === "voiceset1"
//                         ? voiceset2.includes(voice)
//                         : formData.voiceSet === "voiceset2"
//                         ? voiceset3.includes(voice)
//                         : true
//                     )
//                     .map((voice) =>
//                       voice && voice.name ? (
//                         <div
//                           key={voice.name}
//                           className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
//                             formData.voice === voice.name
//                               ? "border-gray-800 bg-gray-50"
//                               : "border-gray-300 hover:bg-gray-100"
//                           }`}
//                           style={{
//                             borderColor:
//                               formData.voice === voice.name
//                                 ? colors.radioBorder
//                                 : colors.border,
//                             backgroundColor:
//                               formData.voice === voice.name
//                                 ? colors.hover
//                                 : colors.card,
//                           }}
//                           onClick={() => {
//                             console.log("Selected voice:", voice);
//                             setFormData((prev) => ({
//                               ...prev,
//                               voice: voice.name,
//                             }));
//                             setErrors((prev) => ({ ...prev, voice: "" }));
//                           }}
//                         >
//                           <div className="absolute top-3 left-3">
//                             <div
//                               className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
//                                 formData.voice === voice.name
//                                   ? "border-gray-800 bg-gray-800"
//                                   : "border-gray-400"
//                               }`}
//                               style={{
//                                 borderColor:
//                                   formData.voice === voice.name
//                                     ? colors.radioBorder
//                                     : colors.border,
//                                 backgroundColor:
//                                   formData.voice === voice.name
//                                     ? colors.radioSelected
//                                     : "transparent",
//                               }}
//                             >
//                               {formData.voice === voice.name && (
//                                 <div className="w-2.5 h-2.5 rounded-full bg-white" />
//                               )}
//                             </div>
//                           </div>
//                           <div className="ml-8 flex justify-between items-center">
//                             <div>
//                               <h3
//                                 className="font-semibold text-lg"
//                                 style={{ color: colors.text }}
//                               >
//                                 {voice.showName || "Unnamed Voice"}
//                               </h3>
//                               <p
//                                 className="text-sm"
//                                 style={{ color: colors.lightText }}
//                               >
//                                 {voice.gender || "Unknown"}
//                               </p>
//                             </div>
//                             <div className="flex gap-3">
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handlePlayVoice(voice.audioSr || "");
//                                 }}
//                                 disabled={
//                                   isAudioPlaying &&
//                                   formData.voice !== voice.name
//                                 }
//                                 className="p-2.5 rounded-full transition-colors hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed"
//                                 style={{
//                                   backgroundColor: colors.secondary,
//                                   color: "white",
//                                 }}
//                                 title={
//                                   isAudioPlaying &&
//                                   formData.voice !== voice.name
//                                     ? "Audio playing"
//                                     : "Play voice preview"
//                                 }
//                               >
//                                 {isAudioPlaying &&
//                                 formData.voice === voice.name ? (
//                                   <svg
//                                     className="w-5 h-5 animate-spin"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     viewBox="0 0 24 24"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z"
//                                     />
//                                   </svg>
//                                 ) : (
//                                   <svg
//                                     className="w-5 h-5"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     viewBox="0 0 24 24"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.8v4.4a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z"
//                                     />
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                     />
//                                   </svg>
//                                 )}
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleStopVoice();
//                                 }}
//                                 disabled={
//                                   !isAudioPlaying ||
//                                   formData.voice !== voice.name
//                                 }
//                                 className="p-2.5 rounded-full transition-colors hover:bg-red-600 disabled:opacity-70 disabled:cursor-not-allowed"
//                                 style={{
//                                   backgroundColor: colors.danger,
//                                   color: "white",
//                                 }}
//                                 title="Stop voice preview"
//                               >
//                                 <svg
//                                   className="w-5 h-5"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                   viewBox="0 0 24 24"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                   />
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     d="M9 9h6v6H9z"
//                                   />
//                                 </svg>
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ) : null
//                     )}
//                 </div>
//                 {errors.voice && (
//                   <p
//                     className="text-sm mt-2 flex items-center gap-1"
//                     style={{ color: colors.danger }}
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     {errors.voice}
//                   </p>
//                 )}
//               </div>
//             )}
//             <div className="flex justify-between mt-6">
//               {currentStep === 2 && (
//                 <button
//                   type="button"
//                   onClick={() => handleStepChange(1)}
//                   className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-gray-300"
//                   style={{ backgroundColor: colors.border, color: colors.text }}
//                 >
//                   Back
//                 </button>
//               )}
//               {currentStep === 1 && (
//                 <button
//                   type="button"
//                   onClick={() => handleStepChange(2)}
//                   className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-indigo-700 ml-auto"
//                   style={{ backgroundColor: colors.primary, color: "white" }}
//                 >
//                   Next
//                 </button>
//               )}
//               {currentStep === 2 && (
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
//                   style={{ backgroundColor: colors.primary, color: "white" }}
//                 >
//                   {isSubmitting ? "Updating..." : "Update Assistant"}
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditAssistant;
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  Loader2,
  BrainCircuit,
  Volume2,
  Play,
  Square,
  RefreshCw,
} from "lucide-react";

// ✅ voice catalogs (must be named exports in your data file)
import { deepgramVoices, openAIVoices } from "../../helpers/data.js";

/** ---------------------------------------------
 *  Edit Assistant (Create-aligned, Minimal UI)
 *  - Fetch:   GET  /api/get-assistants        (select by id)
 *  - Numbers: GET  /api/purchased_numbers
 *  - Update:  PUT  /api/update_assistant/:id  (JSON AssistantCreate)
 * ---------------------------------------------- */

/** Color palette */
const colors = {
  primary: "#4F46E5", // Indigo
  secondary: "#10B981", // Emerald
  danger: "#EF4444",
  text: "#0F172A",
  lightText: "#64748B",
  border: "#E2E8F0",
  background: "#F8FAFC",
  card: "#FFFFFF",
  hover: "#F1F5F9",
};

/** E.164 validator */
const E164 = /^\+\d{7,15}$/;

// ✅ Same step structure as Create (adds Review)
const STEPS = [
  { id: 1, label: "Core & Transcription", Icon: BrainCircuit },
  { id: 2, label: "Voice", Icon: Volume2 },
  { id: 3, label: "Review & Save", Icon: Sparkles },
];

// Provider & Gender dropdowns
const PROVIDER_OPTIONS = [
  { label: "Deepgram (Aura)", value: "deepgram" },
  { label: "OpenAI (TTS)", value: "openai" },
];

const GENDER_OPTIONS = [
  { label: "All voices", value: "all" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
];

export default function EditAssistant() {
  const { assistantId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

  // ---------- UI ----------
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioInstance = useRef(null);
  const [voiceTouched, setVoiceTouched] = useState(false); // require explicit voice click if none saved

  // ---------- Numbers ----------
  const [numbers, setNumbers] = useState([]);
  const [numbersLoading, setNumbersLoading] = useState(false);
  const [numbersError, setNumbersError] = useState("");

  // ---------- Filters (like Create) ----------
  const [genderFilter, setGenderFilter] = useState("all");

  // ---------- Form ----------
  const [formData, setFormData] = useState({
    // Hidden defaults (same as Create)
    name: "",
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 250,
    systemPrompt: "",
    first_message: "",

    // Transcription
    transcribe_provider: "google",
    transcribe_language: "English",
    transcribe_model: "gemini-2.0-flash",

    // Attachments / meta
    forwardingPhoneNumber: "",
    attached_Number: "",
    category: "",

    // Hidden advanced (kept for backend)
    knowledgeBase: [],
    leadsfile: [],
    languages: [],
    endCallPhrases: [],

    // Voice (supports Deepgram & OpenAI now)
    voice_provider: "deepgram", // "deepgram" | "openai"
    voice_model: "",
    voice: "",

    // Hidden tuning (kept for backend)
    speed: 0.8,
    stability: 0.5,
    similarityBoost: 0.75,

    // Flags
    draft: false,
    assistant_toggle: true,
  });

  const [errors, setErrors] = useState({});

  // ---------- Voice list based on provider + gender ----------
  const currentVoiceList = useMemo(() => {
    const pool = formData.voice_provider === "openai" ? openAIVoices : deepgramVoices;
    const filtered = genderFilter === "all" ? pool : pool.filter((v) => v.gender === genderFilter);
    return filtered
      .slice()
      .sort((a, b) => (a?.showName || "").localeCompare(b?.showName || ""));
  }, [formData.voice_provider, genderFilter]);

  // Auto-fill model id when a voice is selected
  useEffect(() => {
    if (!formData.voice) return;
    const selected = currentVoiceList.find((v) => v?.name === formData.voice);
    if (selected?.voice) {
      setFormData((p) => ({
        ...p,
        voice_model: selected.voice, // aura-*-en OR gpt-4o-mini-tts
      }));
      setErrors((p) => ({ ...p, voice_model: "" }));
    }
  }, [formData.voice, currentVoiceList]);

  // If filters hide the currently selected voice, require reconfirm
  useEffect(() => {
    if (!formData.voice) return setVoiceTouched(false);
    const stillVisible = currentVoiceList.some((v) => v.name === formData.voice);
    if (!stillVisible) setVoiceTouched(false);
  }, [currentVoiceList, formData.voice]);

  // ---------- API: purchased numbers ----------
  const fetchPurchasedNumbers = async () => {
    setNumbersLoading(true);
    setNumbersError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/purchased_numbers`, {
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.purchased_numbers || [];
      const normalized = list
        .filter(Boolean)
        .map((x) => ({
          phone_number: x?.phone_number || "",
          friendly_name: x?.friendly_name || "",
          attached_assistant: x?.attached_assistant ?? null,
        }))
        .filter((x) => x.phone_number);
      setNumbers(normalized);
    } catch (err) {
      console.error(err);
      setNumbersError("Failed to load your purchased numbers");
      setNumbers([]);
    } finally {
      setNumbersLoading(false);
    }
  };

  // ---------- API: load assistant ----------
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          navigate("/login");
          return;
        }
        const res = await fetch(`${API_URL}/api/get-assistants`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const assistants = await res.json();

        const idNum = Number(assistantId);
        const a = assistants.find((x) => Number(x.id) === idNum);
        if (!a) throw new Error("Assistant not found");

        // normalize provider
        const loadedProvider =
          a.voice_provider === "openai" || a.voice_provider === "deepgram" ? a.voice_provider : "deepgram";

        // Map backend → form
        const mapped = {
          name: a.name || "",
          provider: a.provider || "openai",
          model: a.model || "gpt-4o-mini",
          temperature: a.temperature ?? 0.7,
          maxTokens: a.max_tokens ?? a.maxTokens ?? 250,
          systemPrompt: a.system_prompt || a.systemPrompt || "",
          first_message: a.first_message || "",
          transcribe_provider: a.transcribe_provider || "google",
          transcribe_language: a.transcribe_language || "English",
          transcribe_model: a.transcribe_model || "gemini-2.0-flash",
          forwardingPhoneNumber: a.forwardingPhoneNumber || "",
          attached_Number: a.attached_Number || "",
          category: a.category || "",
          knowledgeBase: a.knowledge_base || a.knowledgeBase || [],
          leadsfile: a.leadsfile || [],
          languages: a.languages || [],
          endCallPhrases: a.endCallPhrases || [],

          // voice
          voice_provider: loadedProvider,
          voice_model: a.voice_model || "",
          voice: a.voice || "",

          speed: a.speed ?? 0.8,
          stability: a.stability ?? 0.5,
          similarityBoost: a.similarityBoost ?? 0.75,
          draft: Boolean(a.draft),
          assistant_toggle: Boolean(a.assistant_toggle ?? true),
        };

        setFormData((prev) => ({ ...prev, ...mapped }));
        // If there is already a valid voice, let user proceed without re-click
        const hasValidVoice =
          mapped.voice &&
          mapped.voice_model &&
          (mapped.voice_provider === "deepgram" || mapped.voice_provider === "openai");
        setVoiceTouched(Boolean(hasValidVoice));

        fetchPurchasedNumbers(); // non-blocking
        setLoading(false);
      } catch (err) {
        console.error("Error loading assistant:", err);
        toast.error(err?.message || "Failed to load assistant");
        navigate("/");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantId]);

  // ---------- Handlers ----------
  const handleInput = (e) => {
    const { id, value, type, checked } = e.target;
    const next = type === "checkbox" ? checked : value;
    setFormData((p) => ({ ...p, [id]: next }));
    setErrors((p) => ({ ...p, [id]: "" }));
  };

  const handlePlayVoice = (audioSr) => {
    try {
      if (audioInstance.current) {
        audioInstance.current.pause();
        audioInstance.current = null;
      }
      const a = new Audio(audioSr);
      audioInstance.current = a;
      setIsAudioPlaying(true);
      a.play().catch(() => {
        toast.error("Failed to play voice preview");
        setIsAudioPlaying(false);
        audioInstance.current = null;
      });
      a.onended = () => {
        setIsAudioPlaying(false);
        audioInstance.current = null;
      };
    } catch {
      toast.error("Failed to play voice preview");
      setIsAudioPlaying(false);
    }
  };

  const handleStopVoice = () => {
    if (audioInstance.current) {
      audioInstance.current.pause();
      audioInstance.current = null;
      setIsAudioPlaying(false);
    }
  };

  const guardToStep = (step) => {
    if (step === currentStep) return;
    if (step === 3 && (!formData.voice || !voiceTouched)) {
      setErrors((p) => ({ ...p, voice: "Select a voice and press Next to continue" }));
      toast.error("Please select a voice and press Next to continue.");
      return;
    }
    handleStopVoice();
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep === 1) return setCurrentStep(2);
    if (currentStep === 2) {
      if (!formData.voice) {
        setErrors((p) => ({ ...p, voice: "Please select a voice" }));
        toast.error("Select a voice to continue.");
        return;
      }
      if (!voiceTouched) {
        setErrors((p) => ({ ...p, voice: "Click a voice card to confirm your choice" }));
        toast.info("Click a voice card to confirm your choice.");
        return;
      }
      return setCurrentStep(3);
    }
  };

  // Reset confirmation when provider changes
  const handleProviderChange = (e) => {
    handleStopVoice();
    const provider = e.target.value;
    setFormData((p) => ({
      ...p,
      voice_provider: provider,
      voice: "",
      voice_model: "",
    }));
    setVoiceTouched(false);
    setErrors((p) => ({ ...p, voice: "", voice_model: "" }));
  };

  // Validation
  const validate = () => {
    const req = [
      "name",
      "provider",
      "model",
      "temperature",
      "maxTokens",
      "transcribe_provider",
      "transcribe_language",
      "transcribe_model",
      "voice_provider",
      "voice_model",
      "voice",
    ];
    const nErr = {};
    let ok = true;

    req.forEach((k) => {
      const v = formData[k];
      if (v === null || v === undefined || v === "" || Number.isNaN(v)) {
        nErr[k] = "Required";
        ok = false;
      }
    });

    if (formData.temperature < 0 || formData.temperature > 2) {
      nErr.temperature = "Temperature must be between 0 and 2";
      ok = false;
    }
    if (Number(formData.maxTokens) < 1) {
      nErr.maxTokens = "maxTokens must be a positive integer";
      ok = false;
    }
    if (formData.forwardingPhoneNumber && !E164.test(formData.forwardingPhoneNumber)) {
      nErr.forwardingPhoneNumber = "Must be E.164 (+123...)";
      ok = false;
    }
    if (formData.attached_Number && !E164.test(formData.attached_Number)) {
      nErr.attached_Number = "Invalid number format";
      ok = false;
    }

    setErrors(nErr);
    // Bounce back to the step with errors
    if (!ok) {
      const step1Keys = [
        "name",
        "systemPrompt",
        "first_message",
        "forwardingPhoneNumber",
        "attached_Number",
        "category",
      ];
      const hasErr = (keys) => keys.some((k) => nErr[k]);
      if (hasErr(step1Keys)) setCurrentStep(1);
      else setCurrentStep(2);
    }
    return ok;
  };

  // Submit
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (currentStep !== 3) {
      toast.error("Please complete the steps first.");
      return;
    }

    if (!validate()) {
      toast.error("Fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    handleStopVoice();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const payload = {
        name: formData.name,
        provider: formData.provider,
        first_message: formData.first_message || null,
        model: formData.model,
        systemPrompt: formData.systemPrompt || null,
        knowledgeBase: formData.knowledgeBase,
        leadsfile: formData.leadsfile,
        temperature: Number(formData.temperature),
        maxTokens: Number(formData.maxTokens),
        transcribe_provider: formData.transcribe_provider,
        transcribe_language: formData.transcribe_language,
        transcribe_model: formData.transcribe_model,
        languages: formData.languages,
        forwardingPhoneNumber: formData.forwardingPhoneNumber || null,
        endCallPhrases: formData.endCallPhrases,

        // 🔊 TTS (Deepgram or OpenAI)
        voice_provider: formData.voice_provider,
        voice: formData.voice,
        voice_model: formData.voice_model,

        attached_Number: formData.attached_Number || null,
        draft: Boolean(formData.draft),
        assistant_toggle: Boolean(formData.assistant_toggle),
        category: formData.category || null,
        speed: Number(formData.speed),
        stability: Number(formData.stability),
        similarityBoost: Number(formData.similarityBoost),
      };

      const res = await fetch(`${API_URL}/api/update_assistant/${assistantId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg = j.detail;
        } catch {
          const t = await res.text();
          if (t) msg = `${msg} — ${t}`;
        }
        throw new Error(msg);
      }

      toast.success("Assistant updated successfully!");
      navigate("/user/callassistent");
    } catch (err) {
      console.error("Update error", err);
      toast.error(err?.message || "Failed to update assistant");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: colors.background }}>
        <div className="flex items-center gap-3 text-lg" style={{ color: colors.text }}>
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading assistant…
        </div>
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: colors.background }}>
      {/* Ambient animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="animate-[gradient_16s_ease_infinite] absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(50% 50% at 80% 20%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(50% 50% at 50% 80%, rgba(59,130,246,0.12) 0%, transparent 60%)",
          }}
        />
      </div>
      <style>{`
        @keyframes gradient { 0%{transform:translateY(0)} 50%{transform:translateY(-10px)} 100%{transform:translateY(0)} }
        @keyframes eqbar { 0%{height:20%} 50%{height:90%} 100%{height:20%} }
      `}</style>

      <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-2xl border shadow-sm backdrop-blur-xl"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-300/30 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-emerald-300/30 blur-2xl" />
            <div className="relative p-6 text-center">
              <h1 className="flex items-center justify-center gap-3 text-3xl font-bold" style={{ color: colors.text }}>
                <Sparkles className="h-7 w-7 text-indigo-600" /> Edit Assistant
              </h1>
              <p className="mt-2 text-sm" style={{ color: colors.lightText }}>
                Minimal UI · Voice required · Create-aligned defaults
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stepper */}
        <Stepper currentStep={currentStep} onChange={guardToStep} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border p-6 shadow-lg backdrop-blur-xl"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <form onSubmit={onSubmit} noValidate>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <TextInput id="name" label="Assistant Name" value={formData.name} onChange={handleInput} error={errors.name} placeholder="SupportBot" />

                  <TextInput
                    id="forwardingPhoneNumber"
                    label="Forwarding Phone Number (optional, E.164)"
                    value={formData.forwardingPhoneNumber}
                    onChange={handleInput}
                    error={errors.forwardingPhoneNumber}
                    placeholder="+12345678901"
                  />

                  {/* Attach purchased number */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                      <Label>Attach Purchased Number (optional)</Label>
                      <button
                        type="button"
                        onClick={fetchPurchasedNumbers}
                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm font-medium hover:bg-slate-50"
                        style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
                        disabled={numbersLoading}
                        title="Refresh list"
                      >
                        <RefreshCw className={numbersLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                        {numbersLoading ? "Loading…" : "Refresh"}
                      </button>
                    </div>
                    <select
                      id="attached_Number"
                      value={formData.attached_Number}
                      onChange={handleInput}
                      disabled={numbersLoading}
                      className="w-full rounded-xl border p-3 outline-none transition disabled:opacity-60 focus:border-indigo-500"
                      style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
                    >
                      <option value="">{numbers.length ? "Do not change" : "No purchased numbers found"}</option>
                      {numbers.map((n) => (
                        <option key={n.phone_number} value={n.phone_number}>
                          {n.friendly_name ? `${n.friendly_name} — ${n.phone_number}` : n.phone_number}
                        </option>
                      ))}
                    </select>
                    {numbersError && <ErrorText>{numbersError}</ErrorText>}
                    {errors.attached_Number && <ErrorText>{errors.attached_Number}</ErrorText>}
                  </div>

                  <TextInput id="category" label="Category (optional)" value={formData.category} onChange={handleInput} />

                  <div className="md:col-span-2">
                    <Label>System Prompt</Label>
                    <Textarea id="systemPrompt" value={formData.systemPrompt} onChange={handleInput} placeholder="Write your system prompt…" rows={4} />
                    {errors.systemPrompt && <ErrorText>{errors.systemPrompt}</ErrorText>}
                  </div>

                  <div className="md:col-span-2">
                    <Label>First Message</Label>
                    <Textarea id="first_message" value={formData.first_message} onChange={handleInput} placeholder="Hello! …" rows={3} />
                    {errors.first_message && <ErrorText>{errors.first_message}</ErrorText>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <Checkbox id="draft" label="Save as Draft" checked={formData.draft} onChange={handleInput} />
                    <Checkbox id="assistant_toggle" label="Enable Assistant Immediately" checked={formData.assistant_toggle} onChange={handleInput} />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Provider + Gender + Voice Model (read-only) */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Select
                      id="voice_provider"
                      label="Voice Provider"
                      value={formData.voice_provider}
                      onChange={handleProviderChange}
                      options={PROVIDER_OPTIONS}
                      error={errors.voice_provider}
                    />
                    <Select
                      id="genderFilter"
                      label="Gender"
                      value={genderFilter}
                      onChange={(e) => {
                        handleStopVoice();
                        setGenderFilter(e.target.value);
                        // keep selection; if filtered out, voiceTouched will flip false via effect
                      }}
                      options={GENDER_OPTIONS}
                    />
                    <TextInput
                      id="voice_model"
                      label="Voice Model"
                      value={formData.voice_model}
                      onChange={() => {}}
                      error={errors.voice_model}
                      placeholder={formData.voice_provider === "deepgram" ? "aura-*-en" : "gpt-4o-mini-tts"}
                      readOnly
                    />
                  </div>

                  {!voiceTouched && (
                    <p className="text-sm" style={{ color: colors.lightText }}>
                      Tip: <span className="font-medium">Click a voice card</span> to confirm your choice, then press <span className="font-medium">Next</span>.
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm" style={{ color: colors.lightText }}>
                      Showing <span className="font-medium">{currentVoiceList.length}</span> voices
                    </div>
                  </div>

                  {/* Voice grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {currentVoiceList.map((voice) => (
                      <motion.div
                        key={`${voice.provider}-${voice.name}`}
                        whileHover={{ scale: 1.02 }}
                        className="relative cursor-pointer rounded-xl border p-5 shadow-sm backdrop-blur-md transition-all"
                        style={{
                          borderColor: formData.voice === voice.name ? "#93c5fd" : colors.border,
                          backgroundColor: formData.voice === voice.name ? "#eff6ff" : colors.card,
                        }}
                        onClick={() => {
                          setFormData((p) => ({
                            ...p,
                            voice: voice.name,          // "asteria" | "nova"
                            voice_model: voice.voice,   // "aura-*" | "gpt-4o-mini-tts"
                            voice_provider: voice.provider || formData.voice_provider,
                          }));
                          setVoiceTouched(true);
                          setErrors((p) => ({ ...p, voice: "", voice_model: "" }));
                        }}
                      >
                        <div className="absolute left-3 top-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              formData.voice === voice.name ? "border-indigo-500 bg-indigo-500" : "border-slate-400 bg-transparent"
                            }`}
                          />
                        </div>
                        <div className="ml-8 flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold" style={{ color: colors.text }}>
                              {voice.showName || voice.name}
                            </div>
                            <div className="text-sm capitalize" style={{ color: colors.lightText }}>
                              {voice.gender || "unknown"} • {voice.provider}
                            </div>
                            <div className="mt-1 text-xs" style={{ color: colors.lightText }}>
                              {voice.voice}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <PlayButton
                              isActive={isAudioPlaying && formData.voice === voice.name}
                              onPlay={() => handlePlayVoice(voice.audioSr || "")}
                              onStop={handleStopVoice}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {errors.voice && <ErrorText>{errors.voice}</ErrorText>}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="rounded-xl border p-5" style={{ borderColor: colors.border }}>
                    <h3 className="mb-3 text-lg font-semibold" style={{ color: colors.text }}>
                      Review
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <ReviewRow label="Name" value={formData.name || "—"} />
                      <ReviewRow label="Model" value={`${formData.provider} · ${formData.model}`} />
                      <ReviewRow label="Voice Provider" value={formData.voice_provider} />
                      <ReviewRow label="Voice" value={formData.voice || "—"} />
                      <ReviewRow label="Voice Model" value={formData.voice_model || "—"} />
                      <ReviewRow label="Forwarding Number" value={formData.forwardingPhoneNumber || "—"} />
                      <ReviewRow label="Attach Number" value={formData.attached_Number || "—"} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <GhostButton onClick={() => setCurrentStep(2)}>Edit Voice</GhostButton>
                      <GhostButton onClick={() => setCurrentStep(1)}>Edit Core</GhostButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 1 ? (
                <GhostButton onClick={() => guardToStep(currentStep - 1)}>Back</GhostButton>
              ) : (
                <span />
              )}

              {currentStep < 3 ? (
                <PrimaryButton onClick={handleNext}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </PrimaryButton>
              ) : (
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                    </span>
                  ) : (
                    "Update Assistant"
                  )}
                </PrimaryButton>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */
function Stepper({ currentStep, onChange }) {
  const steps = STEPS;
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {steps.map(({ id, label, Icon }) => {
          const active = currentStep === id;
          return (
            <motion.button
              key={id}
              onClick={() => onChange(id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3 ${
                active ? "border-indigo-500/40 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-lg ${active ? "bg-indigo-100" : "bg-slate-100"}`}>
                <Icon className={`h-5 w-5 ${active ? "text-indigo-600" : "text-slate-600"}`} />
              </div>
              <div className="text-left">
                <div className={`text-sm font-semibold ${active ? "text-slate-900" : "text-slate-700"}`}>{label}</div>
                <div className={`text-xs ${active ? "text-indigo-600" : "text-slate-500"}`}>{active ? "Active" : "Click to open"}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mx-auto mt-4 h-1 w-full max-w-4xl rounded-full bg-slate-200">
        <div className="h-1 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition ${
        disabled ? "bg-indigo-400/60" : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
      }`}
    >
      {children}
    </button>
  );
}
function GhostButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border px-4 py-2 font-semibold hover:bg-slate-50"
      style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
    >
      {children}
    </button>
  );
}
function Label({ children }) {
  return <label className="mb-2 block text-sm font-semibold" style={{ color: colors.text }}>{children}</label>;
}
function ErrorText({ children }) {
  return <p className="mt-2 flex items-center gap-1 text-sm" style={{ color: colors.danger }}>{children}</p>;
}
function TextInput({ id, label, value, onChange, error, placeholder, readOnly = false }) {
  return (
    <div className="mb-2">
      <Label>{label}</Label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-xl border p-3 outline-none transition focus:border-indigo-500 ${readOnly ? "bg-slate-50" : ""}`}
        style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
function Select({ id, label, value, onChange, options, error }) {
  return (
    <div className="mb-2">
      <Label>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border p-3 outline-none transition focus:border-indigo-500"
        style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white">
            {o.label}
          </option>
        ))}
      </select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
function Textarea({ id, value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border p-3 outline-none transition focus:border-indigo-500"
      style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
    />
  );
}
function Checkbox({ id, label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2" style={{ color: colors.text }}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="accent-indigo-600" />
      <span>{label}</span>
    </label>
  );
}
function ReviewRow({ label, value }) {
  return (
    <div className="rounded-lg border bg-white p-3 text-sm" style={{ borderColor: colors.border }}>
      <div className="text-slate-500">{label}</div>
      <div className="mt-0.5 font-medium text-slate-900">{value}</div>
    </div>
  );
}
function PlayButton({ isActive, onPlay, onStop }) {
  return (
    <div className="flex items-center gap-2">
      {!isActive ? (
        <button
          type="button"
          onClick={onPlay}
          className="grid h-11 w-11 place-items-center rounded-full text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 bg-gradient-to-br from-indigo-600 to-blue-500"
          title="Play preview"
        >
          <Play className="h-5 w-5" />
        </button>
      ) : (
        <>
          <div className="flex h-10 items-end gap-1">
            {[0, 150, 300].map((d, i) => (
              <div key={i} className="w-1.5 rounded-sm bg-indigo-500" style={{ animation: `eqbar 0.9s ${d}ms ease-in-out infinite` }} />
            ))}
          </div>
          <button
            type="button"
            onClick={onStop}
            className="grid h-11 w-11 place-items-center rounded-full text-white shadow-lg shadow-rose-200 transition hover:brightness-110 bg-gradient-to-br from-rose-500 to-red-500"
            title="Stop"
          >
            <Square className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
