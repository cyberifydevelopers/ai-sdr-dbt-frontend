// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

// const App = () => {
//   const [leads, setLeads] = useState([]);
//   const [formData, setFormData] = useState({ name: "", id: null });
//   const [showForm, setShowForm] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const navigate = useNavigate();

//   // Fetch leads on mount
//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/api/get/use_leadid", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch leads");
//       const data = await response.json();
//       setLeads(data);
//     } catch (error) {
//       console.error("Error fetching leads:", error);
//     }
//   };

//   const handleCreate = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/api/use_leadid", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: formData.name }),
//       });
//       if (!response.ok) throw new Error("Failed to create lead");
//       setFormData({ name: "", id: null });
//       setShowForm(false);
//       setIsEditing(false);
//       fetchLeads();
//     } catch (error) {
//       console.error("Error creating lead:", error);
//     }
//   };

//   const handleEdit = (lead) => {
//     setFormData({ name: lead.name, id: lead.id });
//     setShowForm(true);
//     setIsEditing(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/use_leadid/${formData.id}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ name: formData.name }),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to update lead");
//       setFormData({ name: "", id: null });
//       setShowForm(false);
//       setIsEditing(false);
//       fetchLeads();
//     } catch (error) {
//       console.error("Error updating lead:", error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/use_leadid/${deleteId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (!response.ok) throw new Error("Failed to delete lead");
//       setShowDeleteModal(false);
//       setDeleteId(null);
//       fetchLeads();
//     } catch (error) {
//       console.error("Error deleting lead:", error);
//     }
//   };

//   const handleView = (id) => {
//     navigate(`/user/lead/${id}`);
//   };

//   const totalLeads = leads.length;
//   const lastCreated = leads.length > 0 ? leads[leads.length - 1] : null;

//   return (
//     <div
//       className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:px-[150px] lg:py-10 xl:px-[150px] xl:py-12"
//     >
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-6">
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
//             List Dashboard
//           </h1>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700 mb-2">
//               Total List
//             </h2>
//             <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//               {totalLeads}
//             </p>
//           </div>
//           <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700 mb-2">
//               Last Created
//             </h2>
//             <p className="text-sm sm:text-base md:text-lg text-gray-700 truncate">
//               {lastCreated
//                 ? `${lastCreated.name} (${lastCreated.created_at})`
//                 : "No leads yet"}
//             </p>
//           </div>
//         </div>

//         {/* Create Button */}
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               setIsEditing(false);
//               setFormData({ name: "", id: null });
//             }}
//             className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2 shadow-md text-sm sm:text-base"
//           >
//             {showForm ? "Cancel" : "Create List"}
//             <svg
//               className="w-4 h-4 sm:w-5 sm:h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Create/Edit Form with Blur Backdrop */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-md">
//               <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700 mb-4">
//                 {isEditing ? "Edit Lead" : "Create Lead"}
//               </h2>
//               <div className="flex flex-col gap-4">
//                 <input
//                   type="text"
//                   placeholder="Lead Name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 w-full text-sm sm:text-base"
//                   aria-label="Lead Name"
//                 />
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={() => setShowForm(false)}
//                     className="text-gray-600 hover:text-gray-800 px-3 sm:px-4 py-2 rounded-lg transition duration-200 text-sm sm:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={isEditing ? handleUpdate : handleCreate}
//                     className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
//                   >
//                     {isEditing ? "Update" : "Submit"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal with Blur Backdrop */}
//         {showDeleteModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm">
//               <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
//                 Confirm Delete
//               </h2>
//               <p className="text-sm sm:text-base text-gray-700 mb-6">
//                 Are you sure you want to delete this lead?
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowDeleteModal(false)}
//                   className="text-gray-600 hover:text-gray-800 px-3 sm:px-4 py-2 rounded-lg transition duration-200 text-sm sm:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Leads List (Table) */}
//         <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//           <div className="p-4 sm:p-6 border-b border-gray-200">
//             <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700">
//               Lists
//             </h2>
//           </div>
//           <table className="w-full text-sm sm:text-base">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr className="hidden sm:table-row">
//                 <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[25%]">ID</th>
//                 <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[30%]">Name</th>
//                 <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[30%]">Created At</th>
//                 <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[15%]">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {leads.map((lead) => (
//                 <tr key={lead.id} className="hover:bg-gray-50 transition duration-200 block sm:table-row">
//                   <td className="p-4 sm:p-6 block sm:table-cell">
//                     <span className="sm:hidden font-semibold">ID: </span>
//                     {lead.id}
//                   </td>
//                   <td className="p-4 sm:p-6 block sm:table-cell">
//                     <span className="sm:hidden font-semibold">Name: </span>
//                     {lead.name}
//                   </td>
//                   <td className="p-4 sm:p-6 block sm:table-cell text-gray-600">
//                     <span className="sm:hidden font-semibold">Created At: </span>
//                     {lead.created_at}
//                   </td>
//                   <td className="p-4 sm:p-6 block sm:table-cell">
//                     <span className="sm:hidden font-semibold">Actions: </span>
//                     <div className="flex gap-2 sm:gap-3">
//                       <button
//                         onClick={() => handleView(lead.id)}
//                         className="text-blue-600 hover:text-blue-800 transition duration-200 p-2"
//                         aria-label="View lead"
//                       >
//                         <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleEdit(lead)}
//                         className="text-blue-600 hover:text-blue-800 transition duration-200 p-2"
//                         aria-label="Edit lead"
//                       >
//                         <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setDeleteId(lead.id);
//                           setShowDeleteModal(true);
//                         }}
//                         className="text-red-600 hover:text-red-700 transition duration-200 p-2"
//                         aria-label="Delete lead"
//                       >
//                         <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

// "use client";

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Trash2,
//   Eye,
//   RefreshCcw,
//   Search,
//   X,
//   Copy,
//   Check,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   UploadCloud,
//   FileSpreadsheet,
// } from "lucide-react";

// /**
//  * ListsDashboard.jsx (upload-only, modernized)
//  * - Clean lists dashboard
//  * - Modern, stylish "New List" modal (glass + gradient, drag-and-drop)
//  * - Center-aligned table column names
//  */

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// function classNames(...a) {
//   return a.filter(Boolean).join(" ");
// }

// export default function ListsDashboard() {
//   const navigate = useNavigate();

//   // data
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [sortKey, setSortKey] = useState("created_at");
//   const [sortDir, setSortDir] = useState("desc");

//   // upload modal
//   const [showUpload, setShowUpload] = useState(false);
//   const [uploadName, setUploadName] = useState("New List");
//   const [uploadFile, setUploadFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);

//   const [confirmDelete, setConfirmDelete] = useState({
//     open: false,
//     id: null,
//     name: "",
//   });

//   const inputRef = useRef(null);

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   async function fetchFiles() {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/files`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setFiles(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to load lists");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Derived
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const base = q
//       ? files.filter((f) =>
//           [f.name, f.alphanumeric_id, f.created_at]
//             .filter(Boolean)
//             .some((x) => String(x).toLowerCase().includes(q))
//         )
//       : files;

//     const sorted = [...base].sort((a, b) => {
//       let av = a[sortKey];
//       let bv = b[sortKey];
//       if (sortKey === "created_at") {
//         av = new Date(a.created_at).getTime();
//         bv = new Date(b.created_at).getTime();
//       }
//       if (av < bv) return sortDir === "asc" ? -1 : 1;
//       if (av > bv) return sortDir === "asc" ? 1 : -1;
//       return 0;
//     });

//     return sorted;
//   }, [files, query, sortKey, sortDir]);

//   const totalLists = files.length;
//   const totalLeads = files.reduce(
//     (acc, f) => acc + (Number(f.leads_count) || 0),
//     0
//   );
//   const lastCreated = files[0] || null; // API returns newest first

//   // Actions
//   async function handleUpload() {
//     if (!uploadFile) return toast.info("Choose a CSV file");
//     if (!uploadName.trim()) return toast.info("Enter a name");
//     setIsUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", uploadFile);
//       fd.append("name", uploadName.trim());
//       const res = await fetch(`${API_URL}/api/files`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         body: fd,
//       });
//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(txt || `HTTP ${res.status}`);
//       }
//       toast.success("List created");
//       setShowUpload(false);
//       setUploadFile(null);
//       setUploadName("New List");
//       fetchFiles();
//     } catch (e) {
//       console.error(e);
//       toast.error("Upload failed");
//     } finally {
//       setIsUploading(false);
//     }
//   }

//   async function deleteList(id) {
//     try {
//       const res = await fetch(`${API_URL}/api/files/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       toast.success("List deleted");
//       setConfirmDelete({ open: false, id: null, name: "" });
//       setFiles((prev) => prev.filter((f) => f.id !== id));
//     } catch (e) {
//       console.error(e);
//       toast.error("Delete failed");
//     }
//   }

//   function handleView(file) {
//     navigate(`/user/lead/${file.id}`);
//   }

//   function sortBy(key) {
//     if (sortKey === key) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortKey(key);
//       setSortDir("desc");
//     }
//   }

//   // drag & drop helpers
//   function onDragOver(e) {
//     e.preventDefault();
//     setDragActive(true);
//   }
//   function onDragLeave(e) {
//     e.preventDefault();
//     setDragActive(false);
//   }
//   function onDrop(e) {
//     e.preventDefault();
//     setDragActive(false);
//     const file = e.dataTransfer.files?.[0];
//     if (!file) return;
//     if (!isCsv(file)) {
//       toast.info("Please drop a .csv file");
//       return;
//     }
//     setUploadFile(file);
//   }
//   function isCsv(file) {
//     const nameOk = /\.csv$/i.test(file.name);
//     const typeOk =
//       file.type === "text/csv" ||
//       file.type === "application/vnd.ms-excel" ||
//       file.type === "";
//     return nameOk || typeOk;
//   }

//   return (
//     <div className="min-h-screen w-full bg-slate-50">
//       {/* Top gradient accent */}
//       <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-100/70 via-sky-50 to-transparent -z-10" />

//       <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
//         >
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
//               Lists
//             </h1>
//             <p className="text-slate-600 mt-1">
//               Create and manage your CSV lists.
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setShowUpload(true)}
//               className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
//             >
//               <Plus className="h-4 w-4" /> New List
//             </button>
//             <button
//               onClick={fetchFiles}
//               className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
//             >
//               <RefreshCcw className="h-4 w-4" /> Refresh
//             </button>
//           </div>
//         </motion.div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
//           <StatCard label="Total Lists" value={totalLists} />
//           <StatCard label="Total Leads" value={totalLeads} />
//           <StatCard
//             label="Last Created"
//             value={lastCreated ? lastCreated.name : "—"}
//             sub={
//               lastCreated ? formatDate(lastCreated.created_at) : "No lists yet"
//             }
//           />
//         </div>

//         {/* Toolbar */}
//         <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative w-full sm:max-w-sm">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search by name, ID, date..."
//               className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 outline-none"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <SortButton
//               label="Name"
//               active={sortKey === "name"}
//               dir={sortDir}
//               onClick={() => sortBy("name")}
//             />
//             <SortButton
//               label="Leads"
//               active={sortKey === "leads_count"}
//               dir={sortDir}
//               onClick={() => sortBy("leads_count")}
//             />
//             <SortButton
//               label="Created"
//               active={sortKey === "created_at"}
//               dir={sortDir}
//               onClick={() => sortBy("created_at")}
//             />
//           </div>
//         </div>

//         {/* Table / List */}
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {/* Center-aligned column names */}
//           <div className="hidden md:grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 text-center">
//             <div className="col-span-4">Name</div>
//             <div className="col-span-2">Leads</div>
//             <div className="col-span-3">Created</div>
//             <div className="col-span-3">Actions</div>
//           </div>

//           <div className="divide-y divide-slate-200">
//             <AnimatePresence initial={false}>
//               {loading ? (
//                 <RowSkeleton />
//               ) : filtered.length === 0 ? (
//                 <EmptyState onCreate={() => setShowUpload(true)} />
//               ) : (
//                 filtered.map((f) => (
//                   <motion.div
//                     key={f.id}
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.2 }}
//                     className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-4"
//                   >
//                     <div className="col-span-4">
//                       <div className="text-base font-semibold text-slate-900 flex items-center gap-2">
//                         {f.name}
//                         <IdPill id={f.alphanumeric_id} />
//                       </div>
//                       <div className="text-xs text-slate-500 mt-1">#{f.id}</div>
//                     </div>
//                     <div className="col-span-2 flex items-center md:justify-center">
//                       <span className="text-sm font-semibold text-slate-800">
//                         {f.leads_count ?? 0}
//                       </span>
//                     </div>
//                     <div className="col-span-3 flex flex-col justify-center md:items-center">
//                       <span className="text-sm text-slate-800">
//                         {formatDate(f.created_at)}
//                       </span>
//                     </div>
//                     <div className="col-span-3 flex flex-wrap gap-2 items-center md:justify-center">
//                       <RowButton
//                         onClick={() => handleView(f)}
//                         label="View"
//                         icon={<Eye className="h-4 w-4" />}
//                       />
//                       <RowDanger
//                         onClick={() =>
//                           setConfirmDelete({
//                             open: true,
//                             id: f.id,
//                             name: f.name,
//                           })
//                         }
//                         label="Delete"
//                         icon={<Trash2 className="h-4 w-4" />}
//                       />
//                     </div>
//                   </motion.div>
//                 ))
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* Upload CSV modal (New List) — MODERN/STYLISH */}
//       <Modal
//         open={showUpload}
//         onClose={() => setShowUpload(false)}
//         title=""
//       >
//         <div className="relative">
//           {/* gradient ring */}
//           <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-20 blur-lg" />
//           <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-xl">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg">
//                 <UploadCloud className="h-5 w-5" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-slate-900">Create New List</h3>
//                 <p className="text-sm text-slate-600">
//                   Name your list and upload a <span className="font-medium">.csv</span> file.
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {/* Name */}
//               <div>
//                 <label className="mb-1 block text-sm font-semibold text-slate-700">
//                   List name
//                 </label>
//                 <input
//                   value={uploadName}
//                   onChange={(e) => setUploadName(e.target.value)}
//                   placeholder="e.g., July Prospects"
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500"
//                 />
//               </div>

//               {/* Drag & drop CSV */}
//               <div
//                 onDragOver={onDragOver}
//                 onDragLeave={onDragLeave}
//                 onDrop={onDrop}
//                 className={classNames(
//                   "relative grid place-items-center rounded-2xl border-2 border-dashed px-4 py-10 transition",
//                   dragActive
//                     ? "border-blue-500 bg-blue-50/60"
//                     : "border-slate-300 bg-slate-50/60 hover:bg-slate-50"
//                 )}
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className="mb-2 rounded-xl bg-white p-3 shadow">
//                     <FileSpreadsheet className="h-6 w-6 text-slate-700" />
//                   </div>
//                   <p className="text-sm text-slate-700">
//                     Drag & drop your CSV here, or
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => inputRef.current?.click()}
//                     className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600"
//                   >
//                     <UploadCloud className="h-4 w-4" />
//                     Browse Files
//                   </button>
//                   <input
//                     ref={inputRef}
//                     type="file"
//                     accept=".csv,text/csv"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0] || null;
//                       if (!file) return setUploadFile(null);
//                       if (!isCsv(file)) {
//                         toast.info("Please choose a .csv file");
//                         e.target.value = "";
//                         return;
//                       }
//                       setUploadFile(file);
//                     }}
//                     className="hidden"
//                   />
//                   <p className="mt-2 text-xs text-slate-500">
//                     Only .csv files are supported.
//                   </p>
//                 </div>

//                 {/* Selected file chip */}
//                 {uploadFile && (
//                   <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
//                     <FileSpreadsheet className="h-4 w-4" />
//                     <span className="truncate max-w-[14rem]">{uploadFile.name}</span>
//                     <span className="opacity-70">• {prettyBytes(uploadFile.size)}</span>
//                     <button
//                       onClick={() => setUploadFile(null)}
//                       className="ml-1 rounded-full p-1 hover:bg-slate-100"
//                       title="Remove file"
//                     >
//                       <X className="h-3.5 w-3.5" />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="flex items-center justify-end gap-2 pt-2">
//                 <Ghost onClick={() => setShowUpload(false)}>Cancel</Ghost>
//                 <Primary onClick={handleUpload} disabled={isUploading}>
//                   {isUploading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="h-4 w-4" /> Create
//                     </>
//                   )}
//                 </Primary>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal>

//       {/* Delete confirm */}
//       <Modal
//         open={confirmDelete.open}
//         onClose={() => setConfirmDelete({ open: false, id: null, name: "" })}
//         title="Delete List?"
//       >
//         <p className="text-slate-600 mb-4">
//           This will permanently remove{" "}
//           <span className="font-semibold text-slate-900">
//             {confirmDelete.name}
//           </span>{" "}
//           and all its leads.
//         </p>
//         <div className="flex justify-end gap-2">
//           <Ghost
//             onClick={() =>
//               setConfirmDelete({ open: false, id: null, name: "" })
//             }
//           >
//             Cancel
//           </Ghost>
//           <Danger onClick={() => deleteList(confirmDelete.id)}>
//             <Trash2 className="h-4 w-4" /> Delete
//           </Danger>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// /* ---------------- UI Components ---------------- */
// function StatCard({ label, value, sub }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35 }}
//       whileHover={{ translateY: -3 }}
//       className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
//     >
//       <div className="text-sm font-semibold text-slate-600">{label}</div>
//       <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
//       {sub && <div className="text-sm text-slate-500 mt-1">{sub}</div>}
//     </motion.div>
//   );
// }

// function SortButton({ label, active, dir, onClick }) {
//   const Icon = dir === "asc" ? ChevronUp : ChevronDown;
//   return (
//     <button
//       onClick={onClick}
//       className={classNames(
//         "inline-flex items-center gap-1 rounded-xl border px-3 py-2",
//         active
//           ? "border-blue-300 bg-blue-50 text-blue-700"
//           : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
//       )}
//     >
//       {label} {active && <Icon className="h-4 w-4" />}
//     </button>
//   );
// }

// function RowButton({ onClick, icon, label }) {
//   return (
//     <button
//       onClick={onClick}
//       className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
//     >
//       {icon} <span>{label}</span>
//     </button>
//   );
// }

// function RowDanger({ onClick, icon, label }) {
//   return (
//     <button
//       onClick={onClick}
//       className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
//     >
//       {icon} <span>{label}</span>
//     </button>
//   );
// }

// function IdPill({ id }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button
//       onClick={async () => {
//         try {
//           await navigator.clipboard.writeText(String(id || ""));
//           setCopied(true);
//           setTimeout(() => setCopied(false), 1000);
//         } catch {}
//       }}
//       className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
//       title="Copy alphanumeric id"
//     >
//       {copied ? (
//         <Check className="h-3.5 w-3.5" />
//       ) : (
//         <Copy className="h-3.5 w-3.5" />
//       )}{" "}
//       {id}
//     </button>
//   );
// }

// function Modal({ open, onClose, title, children }) {
//   if (!open) return null;
//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm px-4"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -8 }}
//           transition={{ duration: 0.2 }}
//           className="w-full max-w-xl rounded-3xl"
//         >
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
//             {title ? (
//               <div className="mb-3 flex items-center justify-between">
//                 <h3 className="text-lg font-bold text-slate-900">{title}</h3>
//                 <button
//                   onClick={onClose}
//                   className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
//                 >
//                   <X className="h-4 w-4 text-slate-500" />
//                 </button>
//               </div>
//             ) : (
//               <div className="mb-1 flex justify-end">
//                 <button
//                   onClick={onClose}
//                   className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
//                 >
//                   <X className="h-4 w-4 text-slate-500" />
//                 </button>
//               </div>
//             )}
//             {children}
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// function Ghost({ children, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
//     >
//       {children}
//     </button>
//   );
// }

// function Primary({ children, onClick, disabled }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={classNames(
//         "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow-lg",
//         disabled
//           ? "bg-blue-400"
//           : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
//       )}
//     >
//       {children}
//     </button>
//   );
// }

// function Danger({ children, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-rose-700 hover:to-rose-600"
//     >
//       {children}
//     </button>
//   );
// }

// function RowSkeleton() {
//   return (
//     <div className="px-4 py-6">
//       <div className="animate-pulse grid grid-cols-1 md:grid-cols-12 gap-4">
//         <div className="col-span-4 h-6 rounded bg-slate-200" />
//         <div className="col-span-2 h-6 rounded bg-slate-200" />
//         <div className="col-span-3 h-6 rounded bg-slate-200" />
//         <div className="col-span-3 h-6 rounded bg-slate-200" />
//       </div>
//     </div>
//   );
// }

// function EmptyState({ onCreate }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-16">
//       <div className="text-5xl">🗂️</div>
//       <div className="text-lg font-semibold text-slate-800">No lists yet</div>
//       <div className="text-slate-600">Click below to upload your first CSV.</div>
//       <button
//         onClick={onCreate}
//         className="mt-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700"
//       >
//         New List
//       </button>
//     </div>
//   );
// }

// /* ---------------- utils ---------------- */
// function formatDate(d) {
//   try {
//     const dt = new Date(d);
//     if (isNaN(dt.getTime())) return String(d || "");
//     return dt.toLocaleString();
//   } catch {
//     return String(d || "");
//   }
// }

// function prettyBytes(num) {
//   if (!Number.isFinite(num)) return "0 B";
//   const UNITS = ["B", "KB", "MB", "GB"];
//   let i = 0;
//   while (num >= 1024 && i < UNITS.length - 1) {
//     num /= 1024;
//     i++;
//   }
//   return `${num.toFixed(num >= 10 || i === 0 ? 0 : 1)} ${UNITS[i]}`;
// }




































"use client";

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  RefreshCw,
  Search,
  X,
  UploadCloud,
  FileSpreadsheet,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
} from "lucide-react";

/* ---------------------------------------------------------
   Config
--------------------------------------------------------- */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

const R = {
  FILES: `${API_URL}/api/files`,
  FILE: (id) => `${API_URL}/api/files/${id}`,
  SYNC_LEADS: `${API_URL}/api/crm/ingest/hubspot`, // POST
};

const neonGrad = "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600";

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function classNames(...a) {
  return a.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------
   Reusable UI (matched to UserManagement page)
--------------------------------------------------------- */
function Button({ children, className = "", variant = "outline", size = "md", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  const sizes = { sm: "text-xs px-2.5 py-1.5", md: "text-sm px-3 py-2", lg: "text-sm px-4 py-2.5" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm",
    outline: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 shadow-sm",
    subtle: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent",
  };
  return (
    <button {...props} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-lg sm:max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
        initial={{ y: 20, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 10, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
          <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
          <Button onClick={onClose} variant="ghost" className="rounded-lg p-1.5" aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-4 sm:px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, tone = "blue" }) {
  const ring = tone === "blue" ? "ring-blue-200/60" : "ring-cyan-200/60";
  const bg = tone === "blue" ? "from-blue-600 to-cyan-500" : "from-cyan-500 to-blue-600";
  return (
    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl" style={{ background: `linear-gradient(135deg, #06b6d466, #ffffff00)` }} />
      <div className="relative z-10 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} text-white shadow-inner ring-1 ${ring}`}>
          <FileSpreadsheet className="h-7 w-7" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
          <div className="text-2xl font-black text-slate-900">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-4 align-middle">{children}</td>;
}

function IdPill({ id }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(String(id || ""));
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        } catch {}
      }}
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 max-w-full"
      title="Copy alphanumeric id"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="truncate max-w-[9rem]">{id}</span>
    </button>
  );
}

/* ---------------------------------------------------------
   Main Component
--------------------------------------------------------- */
export default function ListsDashboard() {
  const navigate = useNavigate();

  // data
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // search/sort
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  // upload modal
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("New List");
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // delete confirm
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: "" });

  // sync leads
  const [syncing, setSyncing] = useState(false);

  const fetchFiles = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFiles([]);
      setErr("No auth token found.");
      toast.error("No authentication token found.");
      return;
    }
    try {
      setLoading(true);
      setErr("");
      const res = await fetch(R.FILES, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Failed to load lists");
      toast.error(e?.message || "Failed to load lists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // derived
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? files.filter((f) => [f.name, f.alphanumeric_id, f.created_at].filter(Boolean).some((x) => String(x).toLowerCase().includes(q)))
      : files;
    const sorted = [...base].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "created_at") {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [files, query, sortKey, sortDir]);

  const totalLists = files.length;
  const totalLeads = files.reduce((acc, f) => acc + (Number(f.leads_count) || 0), 0);
  const lastCreated = files[0] || null; // assume API returns newest first

  // actions
  const sortBy = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleView = (file) => navigate(`/user/lead/${file.id}`);

  async function deleteList(id) {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");
    try {
      const res = await fetch(R.FILE(id), { method: "DELETE", headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("🗑️ List deleted");
      setConfirmDelete({ open: false, id: null, name: "" });
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  }

  async function handleUpload() {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");
    if (!uploadFile) return toast.info("Choose a CSV file");
    if (!uploadName.trim()) return toast.info("Enter a name");
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("name", uploadName.trim());
      const res = await fetch(R.FILES, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      toast.success("🎉 List created");
      setShowUpload(false);
      setUploadFile(null);
      setUploadName("New List");
      fetchFiles();
    } catch (e) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function syncLeads() {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");
    try {
      setSyncing(true);
      const res = await fetch(R.SYNC_LEADS, { method: "POST", headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      toast.success("🔄 Leads sync started");
      setTimeout(fetchFiles, 1500);
    } catch (e) {
      toast.error(e?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  // dnd
  function onDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }
  function onDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }
  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!isCsv(file)) return toast.info("Please drop a .csv file");
    setUploadFile(file);
  }
  function isCsv(file) {
    const nameOk = /\.csv$/i.test(file.name);
    const typeOk = file.type === "text/csv" || file.type === "application/vnd.ms-excel" || file.type === "";
    return nameOk || typeOk;
  }

  /* ---------------------------------------------------------
     UI (100% responsive, no horizontal scroll)
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* soft glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Header card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-7 shadow-xl relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(60% 60% at 0% 0%, rgba(14,165,233,0.25), transparent), radial-gradient(60% 60% at 100% 100%, rgba(37,99,235,0.25), transparent)",
            }}
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.2 }}
            aria-hidden
          />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-content-center rounded-2xl bg-gradient-to-br from-white to-slate-50 ring-1 ring-slate-200 shadow-inner shrink-0">
                <FileSpreadsheet className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
                  <span className={`bg-clip-text text-transparent ${neonGrad}`}>Lists</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Create and manage your CSV lists. Sync leads from HubSpot.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setShowUpload(true)} variant="primary">
                <Plus className="mr-2 h-4 w-4" /> New List
              </Button>
              <Button onClick={fetchFiles} disabled={loading}>
                {loading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing…</> : <><RefreshCw className="mr-2 h-4 w-4" /> Refresh</>}
              </Button>
              <Button onClick={syncLeads} disabled={syncing} className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                {syncing ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Syncing…</> : <>SYNC LEADS</>}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Lists" value={totalLists} />
          <StatCard label="Total Leads" value={totalLeads} tone="cyan" />
          <StatCard label="Last Created" value={lastCreated ? (lastCreated.name || "—") : "—"} />
          <StatCard label="Newest Date" value={lastCreated ? formatDate(lastCreated.created_at) : "—"} tone="cyan" />
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 lg:p-5 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <div className="relative flex-1 min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, ID, date…"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-500 shrink-0 text-xs font-medium">Sort</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SortButton label="Name" active={sortKey === "name"} dir={sortDir} onClick={() => sortBy("name")} />
              <SortButton label="Leads" active={sortKey === "leads_count"} dir={sortDir} onClick={() => sortBy("leads_count")} />
              <SortButton label="Created" active={sortKey === "created_at"} dir={sortDir} onClick={() => sortBy("created_at")} />
            </div>
          </div>
        </div>

        {/* Lists: Table on desktop (xl+), Card Grid on smaller */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* Header strip */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">All Lists ({filtered.length})</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500"><div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live</div>
          </div>

          {loading ? (
            <div className="grid place-content-center py-16">
              <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
              <div className="text-sm text-slate-600">Loading lists…</div>
            </div>
          ) : err ? (
            <div className="grid place-content-center py-16 px-4 text-center text-sm text-red-600">{err}</div>
          ) : filtered.length === 0 ? (
            <div className="grid place-content-center py-16 px-4 text-center">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-slate-100 mb-4">
                <FileSpreadsheet className="h-9 w-9 text-slate-400" />
              </div>
              <div className="text-lg font-semibold text-slate-700">No results</div>
              <div className="text-sm text-slate-500">Try searching or upload a CSV</div>
              <div className="mt-3"><Button onClick={() => setShowUpload(true)} variant="primary"><Plus className="h-4 w-4 mr-2" /> New List</Button></div>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE (≥xl) */}
              <div className="hidden xl:block w-full">
                <table className="w-full table-fixed">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <Th>Name</Th>
                      <Th>Leads</Th>
                      <Th>Created</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                        <Td>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2 min-w-0">
                            <span className="truncate max-w-[22rem]">{f.name}</span>
                            <IdPill id={f.alphanumeric_id} />
                          </div>
                          <div className="text-[11px] text-slate-500 break-all">#{f.id}</div>
                        </Td>
                        <Td>
                          <span className="text-sm font-semibold text-slate-800">{f.leads_count ?? 0}</span>
                        </Td>
                        <Td>
                          <span className="text-sm text-slate-800">{formatDate(f.created_at)}</span>
                        </Td>
                        <Td>
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={() => handleView(f)} size="sm" title="View"><Eye className="h-4 w-4" /></Button>
                            <Button onClick={() => setConfirmDelete({ open: true, id: f.id, name: f.name })} variant="danger" size="sm" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET CARDS (<xl) */}
              <div className="xl:hidden p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filtered.map((f) => (
                    <div key={f.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                      <div className="min-w-0">
                        <div className="text-base font-bold text-slate-900 truncate" title={f.name}>{f.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                          <IdPill id={f.alphanumeric_id} />
                          <span className="text-[11px] text-slate-500">ID #{f.id}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-xs text-slate-500">Leads</div>
                            <div className="font-semibold text-slate-900">{f.leads_count ?? 0}</div>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-xs text-slate-500">Created</div>
                            <div className="font-semibold text-slate-900 truncate" title={formatDate(f.created_at)}>{formatDate(f.created_at)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button onClick={() => handleView(f)} size="sm" className="grow sm:grow-0"><Eye className="h-4 w-4 mr-1" /> View</Button>
                        <Button onClick={() => setConfirmDelete({ open: true, id: f.id, name: f.name })} variant="danger" size="sm" className="grow sm:grow-0"><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload CSV modal */}
      <AnimatePresence>
        {showUpload && (
          <Modal onClose={() => setShowUpload(false)} title="Create New List">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">List name</label>
                <input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g., July Prospects"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={classNames(
                  "relative grid place-items-center rounded-2xl border-2 border-dashed px-4 py-10 transition",
                  dragActive ? "border-blue-500 bg-blue-50/60" : "border-slate-300 bg-slate-50/60 hover:bg-slate-50"
                )}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-xl bg-white p-3 shadow"><FileSpreadsheet className="h-6 w-6 text-slate-700" /></div>
                  <p className="text-sm text-slate-700">Drag & drop your CSV here, or</p>
                  <Button type="button" onClick={() => inputRef.current?.click()} variant="primary" className="mt-2">
                    <UploadCloud className="h-4 w-4 mr-2" /> Browse Files
                  </Button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) return setUploadFile(null);
                      if (!isCsv(file)) {
                        toast.info("Please choose a .csv file");
                        e.target.value = "";
                        return;
                      }
                      setUploadFile(file);
                    }}
                    className="hidden"
                  />
                  <p className="mt-2 text-xs text-slate-500">Only .csv files are supported.</p>
                </div>

                {uploadFile && (
                  <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span className="truncate max-w-[14rem]">{uploadFile.name}</span>
                    <span className="opacity-70">• {prettyBytes(uploadFile.size)}</span>
                    <button onClick={() => setUploadFile(null)} className="ml-1 rounded-full p-1 hover:bg-slate-100" title="Remove file">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button onClick={() => setShowUpload(false)} variant="subtle">Cancel</Button>
                <Button onClick={handleUpload} disabled={isUploading} variant="primary">
                  {isUploading ? <><RefreshCw className="h-4 w-4 animate-spin mr-2" /> Uploading…</> : <><Plus className="h-4 w-4 mr-2" /> Create</>}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete.open && (
          <Modal onClose={() => setConfirmDelete({ open: false, id: null, name: "" })} title="Delete List?">
            <p className="text-slate-700 mb-4">This will permanently remove <b className="text-slate-900 break-words">{confirmDelete.name}</b> and all its leads.</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setConfirmDelete({ open: false, id: null, name: "" })} variant="subtle">Cancel</Button>
              <Button onClick={() => deleteList(confirmDelete.id)} variant="danger"><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- utils ---------------- */
function formatDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d || "");
    return dt.toLocaleString();
  } catch {
    return String(d || "");
  }
}

function prettyBytes(num) {
  if (!Number.isFinite(num)) return "0 B";
  const UNITS = ["B", "KB", "MB", "GB"]; let i = 0;
  while (num >= 1024 && i < UNITS.length - 1) { num /= 1024; i++; }
  return `${num.toFixed(num >= 10 || i === 0 ? 0 : 1)} ${UNITS[i]}`;
}

function SortButton({ label, active, dir, onClick }) {
  const Icon = dir === "asc" ? ChevronUp : ChevronDown;
  return (
    <button
      onClick={onClick}
      className={classNames(
        "inline-flex items-center gap-1 rounded-xl border px-3 py-2",
        active ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      )}
    >
      {label} {active && <Icon className="h-4 w-4" />}
    </button>
  );
}
