// import React, { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { FaUpload, FaCheckCircle, FaExclamationCircle, FaDownload } from "react-icons/fa";

// const UploadCSV = () => {
//   const [file, setFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);
//   const modalRef = useRef(null);
//   const { id } = useParams();
//   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem("token") || null;
//   };

//   // Handle keyboard events for modal
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (showModal) {
//         if (e.key === "Enter" || e.key === "Escape") {
//           setShowModal(false);
//         }
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showModal]);

//   // Handle drag events
//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type === "text/csv") {
//       if (droppedFile.size > MAX_FILE_SIZE) {
//         setModalMessage("File size exceeds 5MB limit.");
//         setIsSuccess(false);
//         setShowModal(true);
//       } else {
//         setFile(droppedFile);
//       }
//     } else {
//       setModalMessage("Please upload a valid CSV file.");
//       setIsSuccess(false);
//       setShowModal(true);
//     }
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "text/csv") {
//       if (selectedFile.size > MAX_FILE_SIZE) {
//         setModalMessage("File size exceeds 5MB limit.");
//         setIsSuccess(false);
//         setShowModal(true);
//       } else {
//         setFile(selectedFile);
//       }
//     } else {
//       setModalMessage("Please upload a valid CSV file.");
//       setIsSuccess(false);
//       setShowModal(true);
//     }
//   };

//   // Trigger file input click
//   const handleChooseFile = () => {
//     fileInputRef.current.click();
//   };

//   // Handle demo CSV download
//   const handleDownloadSample = () => {
//     const sampleCSVContent = `name,email,mobileno,custom_field_1,custom_field_2,leadsid
// John Doe,john.doe@example.com,1234567890,Value1,Extra1,2
// Jane Smith,jane.smith@example.com,0987654321,Value2,Extra2,2
// Bob Johnson,bob.johnson@example.com,5555555555,Value3,Extra3,2`;
//     const blob = new Blob([sampleCSVContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "sample_users.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   // Handle file upload with progress (using fetch)
//   const handleUpload = async () => {
//     if (!file) {
//       setModalMessage("No file selected. Please choose a CSV file.");
//       setIsSuccess(false);
//       setShowModal(true);
//       return;
//     }

//     const token = getAuthToken();
//     if (!token) {
//       console.error("No auth token found. Please log in.");
//       setModalMessage("Please log in to continue.");
//       setIsSuccess(false);
//       setShowModal(true);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       setUploadProgress(0);

//       // Use fetch API for file upload
//       const response = await fetch(`http://localhost:8000/api/user/upload-csv`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       // Since fetch does not support upload progress natively,
//       // we can only show indeterminate progress (e.g., spinner or 100% on finish)
//       setUploadProgress(100);

//       if (response.ok) {
//         const result = await response.json();
//         console.log("File uploaded successfully:", result);
//         setModalMessage("CSV file uploaded successfully!");
//         setIsSuccess(true);
//         setShowModal(true);
//         setFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//       } else {
//         let errorMsg = `HTTP error! status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           if (errorData && errorData.error) {
//             errorMsg = errorData.error;
//           }
//         } catch (e) {}
//         throw new Error(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setModalMessage("Failed to upload CSV file. Please try again.");
//       setIsSuccess(false);
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//       setUploadProgress(0);
//     }
//   };

//   // Format file size for display
//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 animate-fade-in">
//       {/* Drag and Drop Area */}
//       <div
//         className={`w-full max-w-3xl bg-white p-10 rounded-xl shadow-lg border-2 ${
//           isDragging ? "border-blue-400" : "border-gray-200"
//         } transition-colors duration-200`}
//         onDragEnter={handleDragEnter}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         <div className="text-center">
//           <FaUpload
//             className={`mx-auto text-5xl ${
//               isDragging ? "text-blue-400" : "text-gray-300"
//             } animate-pulse mb-6`}
//           />
//           <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//             Upload Your CSV File
//           </h2>
//           <p className="text-gray-500 mb-6">
//             Drag and drop a CSV file here or click to select. Maximum file size:
//             5MB.
//           </p>
//           <div className="flex justify-center gap-4">
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleFileChange}
//               ref={fileInputRef}
//               className="hidden"
//             />
//             <button
//               onClick={handleChooseFile}
//               className="bg-blue-400 text-white px-8 py-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-sm"
//             >
//               Choose File
//             </button>
//             <button
//               onClick={handleDownloadSample}
//               className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-sm flex items-center gap-2"
//             >
//               <FaDownload />
//               Download Sample CSV
//             </button>
//           </div>
//           {file && (
//             <div className="mt-6 text-gray-600 bg-gray-50 p-4 rounded-lg">
//               <p>
//                 <strong>File:</strong> {file.name}
//               </p>
//               <p>
//                 <strong>Size:</strong> {formatFileSize(file.size)}
//               </p>
//               <p>
//                 <strong>Last Modified:</strong>{" "}
//                 {new Date(file.lastModified).toLocaleDateString()}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Upload Button with Progress Bar */}
//       <div className="w-full max-w-3xl mt-8">
//         <button
//           onClick={handleUpload}
//           disabled={loading || !file}
//           className={`w-full bg-blue-400 text-white px-6 py-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 ${
//             loading || !file ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Uploading..." : "Upload CSV"}
//         </button>
//         {loading && (
//           <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//             <div
//               className="bg-blue-400 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//         )}
//       </div>

//       {/* Modal for Feedback */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center zoutdated-50 transition-opacity duration-200">
//           <div
//             ref={modalRef}
//             className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full animate-fade-in"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               {isSuccess ? (
//                 <FaCheckCircle className="text-green-400 text-2xl" />
//               ) : (
//                 <FaExclamationCircle className="text-red-400 text-2xl" />
//               )}
//               <h3 className="text-lg font-semibold text-gray-700">
//                 Upload Status
//               </h3>
//             </div>
//             <p className="text-gray-500 mb-6">{modalMessage}</p>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadCSV;








































// import React, { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { FaUpload, FaCheckCircle, FaExclamationCircle, FaDownload } from "react-icons/fa";

// const UploadCSV = () => {
//   const [file, setFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);
//   const modalRef = useRef(null);
//   const { id } = useParams();
//   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

//   // ✅ Base API URL (env first, localhost fallback)
//   const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem("token") || null;
//   };

//   // Handle keyboard events for modal
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (showModal) {
//         if (e.key === "Enter" || e.key === "Escape") {
//           setShowModal(false);
//         }
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showModal]);

//   // Handle drag events
//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type === "text/csv") {
//       if (droppedFile.size > MAX_FILE_SIZE) {
//         setModalMessage("File size exceeds 5MB limit.");
//         setIsSuccess(false);
//         setShowModal(true);
//       } else {
//         setFile(droppedFile);
//       }
//     } else {
//       setModalMessage("Please upload a valid CSV file.");
//       setIsSuccess(false);
//       setShowModal(true);
//     }
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "text/csv") {
//       if (selectedFile.size > MAX_FILE_SIZE) {
//         setModalMessage("File size exceeds 5MB limit.");
//         setIsSuccess(false);
//         setShowModal(true);
//       } else {
//         setFile(selectedFile);
//       }
//     } else {
//       setModalMessage("Please upload a valid CSV file.");
//       setIsSuccess(false);
//       setShowModal(true);
//     }
//   };

//   // Trigger file input click
//   const handleChooseFile = () => {
//     fileInputRef.current.click();
//   };

//   // Handle demo CSV download
//   const handleDownloadSample = () => {
//     const sampleCSVContent = `name,email,mobileno,custom_field_1,custom_field_2,leadsid
// John Doe,john.doe@example.com,1234567890,Value1,Extra1,2
// Jane Smith,jane.smith@example.com,0987654321,Value2,Extra2,2
// Bob Johnson,bob.johnson@example.com,5555555555,Value3,Extra3,2`;
//     const blob = new Blob([sampleCSVContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "sample_users.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   // Handle file upload with progress (using fetch)
//   const handleUpload = async () => {
//     if (!file) {
//       setModalMessage("No file selected. Please choose a CSV file.");
//       setIsSuccess(false);
//       setShowModal(true);
//       return;
//     }

//     const token = getAuthToken();
//     if (!token) {
//       console.error("No auth token found. Please log in.");
//       setModalMessage("Please log in to continue.");
//       setIsSuccess(false);
//       setShowModal(true);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       setUploadProgress(0);

//       const response = await fetch(`${API_URL}/api/files`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       // fetch doesn't provide upload progress; set to 100% when done
//       setUploadProgress(100);

//       if (response.ok) {
//         const result = await response.json();
//         console.log("File uploaded successfully:", result);
//         setModalMessage("CSV file uploaded successfully!");
//         setIsSuccess(true);
//         setShowModal(true);
//         setFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//       } else {
//         let errorMsg = `HTTP error! status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           if (errorData && errorData.error) {
//             errorMsg = errorData.error;
//           }
//         } catch (e) {}
//         throw new Error(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setModalMessage("Failed to upload CSV file. Please try again.");
//       setIsSuccess(false);
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//       setUploadProgress(0);
//     }
//   };

//   // Format file size for display
//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 animate-fade-in">
//       {/* Drag and Drop Area */}
//       <div
//         className={`w-full max-w-3xl bg-white p-10 rounded-xl shadow-lg border-2 ${
//           isDragging ? "border-blue-400" : "border-gray-200"
//         } transition-colors duration-200`}
//         onDragEnter={handleDragEnter}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         <div className="text-center">
//           <FaUpload
//             className={`mx-auto text-5xl ${
//               isDragging ? "text-blue-400" : "text-gray-300"
//             } animate-pulse mb-6`}
//           />
//           <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//             Upload Your CSV File
//           </h2>
//           <p className="text-gray-500 mb-6">
//             Drag and drop a CSV file here or click to select. Maximum file size:
//             5MB.
//           </p>
//           <div className="flex justify-center gap-4">
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleFileChange}
//               ref={fileInputRef}
//               className="hidden"
//             />
//             <button
//               onClick={handleChooseFile}
//               className="bg-blue-400 text-white px-8 py-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-sm"
//             >
//               Choose File
//             </button>
//             <button
//               onClick={handleDownloadSample}
//               className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-sm flex items-center gap-2"
//             >
//               <FaDownload />
//               Download Sample CSV
//             </button>
//           </div>
//           {file && (
//             <div className="mt-6 text-gray-600 bg-gray-50 p-4 rounded-lg">
//               <p>
//                 <strong>File:</strong> {file.name}
//               </p>
//               <p>
//                 <strong>Size:</strong> {formatFileSize(file.size)}
//               </p>
//               <p>
//                 <strong>Last Modified:</strong>{" "}
//                 {new Date(file.lastModified).toLocaleDateString()}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Upload Button with Progress Bar */}
//       <div className="w-full max-w-3xl mt-8">
//         <button
//           onClick={handleUpload}
//           disabled={loading || !file}
//           className={`w-full bg-blue-400 text-white px-6 py-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 ${
//             loading || !file ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Uploading..." : "Upload CSV"}
//         </button>
//         {loading && (
//           <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//             <div
//               className="bg-blue-400 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//         )}
//       </div>

//       {/* Modal for Feedback */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
//           <div
//             ref={modalRef}
//             className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full animate-fade-in"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               {isSuccess ? (
//                 <FaCheckCircle className="text-green-400 text-2xl" />
//               ) : (
//                 <FaExclamationCircle className="text-red-400 text-2xl" />
//               )}
//               <h3 className="text-lg font-semibold text-gray-700">
//                 Upload Status
//               </h3>
//             </div>
//             <p className="text-gray-500 mb-6">{modalMessage}</p>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadCSV;






import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaDownload,
} from "react-icons/fa";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [listName, setListName] = useState(""); // ✅ backend requires "name"
  const fileInputRef = useRef(null);
  const { id } = useParams();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

  const getAuthToken = () => localStorage.getItem("token");

  // File Validation
  const validateFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "text/csv") {
      if (selectedFile.size > MAX_FILE_SIZE) {
        showModalMessage("File size exceeds 5MB limit.", false);
      } else {
        setFile(selectedFile);
      }
    } else {
      showModalMessage("Please upload a valid CSV file.", false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  const handleChooseFile = () => fileInputRef.current.click();

  const handleDownloadSample = () => {
    const sampleCSVContent =
      "name,email,mobileno,custom_field_1,custom_field_2,leadsid\n" +
      "John Doe,john.doe@example.com,1234567890,Value1,Extra1,2\n" +
      "Jane Smith,jane.smith@example.com,0987654321,Value2,Extra2,2\n" +
      "Bob Johnson,bob.johnson@example.com,5555555555,Value3,Extra3,2";
    const blob = new Blob([sampleCSVContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_users.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) return showModalMessage("No file selected.", false);
    if (!listName.trim())
      return showModalMessage("Please provide a list name.", false);

    const token = getAuthToken();
    if (!token) return showModalMessage("Please log in first.", false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", listName); // ✅ required by backend

    try {
      setLoading(true);
      setUploadProgress(50);
      const response = await fetch(`${API_URL}/api/files`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setUploadProgress(100);

      if (response.ok) {
        showModalMessage("CSV file uploaded successfully!", true);
        setFile(null);
        setListName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      showModalMessage("Upload failed. Please try again.", false);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const showModalMessage = (msg, success) => {
    setModalMessage(msg);
    setIsSuccess(success);
    setShowModal(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Upload Card */}
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-xl">
        <div className="text-center">
          <FaUpload className="mx-auto text-5xl text-blue-400 mb-6 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Upload Your CSV File
          </h2>
          <p className="text-gray-500 mb-6">
            Drag & drop a CSV file or click to select. Max size: 5MB.
          </p>

          {/* List Name */}
          <input
            type="text"
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={handleChooseFile}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-600 transition"
            >
              Choose File
            </button>
            <button
              onClick={handleDownloadSample}
              className="bg-white text-blue-600 border border-blue-300 px-6 py-3 rounded-xl shadow-sm hover:bg-blue-50 transition flex items-center gap-2"
            >
              <FaDownload /> Sample CSV
            </button>
          </div>

          {/* File Info */}
          {file && (
            <div className="mt-6 text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-200 text-left">
              <p>
                <strong>File:</strong> {file.name}
              </p>
              <p>
                <strong>Size:</strong> {formatFileSize(file.size)}
              </p>
              <p>
                <strong>Last Modified:</strong>{" "}
                {new Date(file.lastModified).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button + Progress */}
      <div className="w-full max-w-3xl mt-8">
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`w-full bg-blue-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition 
            ${loading || !file ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Modal (white, no black bg) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              {isSuccess ? (
                <FaCheckCircle className="text-green-500 text-2xl" />
              ) : (
                <FaExclamationCircle className="text-red-500 text-2xl" />
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                Upload Status
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
