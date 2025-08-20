// // import React, { useState, useEffect } from "react";
// // import { FaEdit, FaTrash, FaPhone } from "react-icons/fa";
// // import { useNavigate, useParams } from "react-router-dom";

// // const LeadDashboard = () => {
// //   const [leads, setLeads] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [lastLead, setLastLead] = useState(null);
// //   const [showForm, setShowForm] = useState(false);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     mobileno: "",
// //     custom_field_1: "",
// //     custom_field_2: "",
// //   });
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [editLeadId, setEditLeadId] = useState(null);
// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [deleteLeadId, setDeleteLeadId] = useState(null);
// //   const navigate = useNavigate();
// //   const { id } = useParams();

// //   // Get token from localStorage
// //   const getAuthToken = () => {
// //     return localStorage.getItem("token") || null;
// //   };

// //   // Fetch leads data
// //   useEffect(() => {
// //     const fetchLeads = async () => {
// //       const token = getAuthToken();
// //       if (!token) {
// //         console.error("No auth token found. Please log in.");
// //         setLoading(false);
// //         return;
// //       }

// //       try {
// //         setLoading(true);
// //         const response = await fetch(
// //           `http://localhost:8000/api/use_lead/${id}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );
// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         setLeads(data.lead_ids || []);
// //         if (data.lead_ids && data.lead_ids.length > 0) {
// //           setLastLead(data.lead_ids[data.lead_ids.length - 1]);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching leads:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchLeads();
// //   }, [id]);

// //   // Handle form input changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   // Handle form submission (create or update)
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const token = getAuthToken();
// //     if (!token) {
// //       console.error("No auth token found. Please log in.");
// //       return;
// //     }

// //     try {
// //       let response;
// //       if (isEditMode) {
// //         // Update existing lead
// //         response = await fetch(
// //           `http://localhost:8000/api/use_lead/${editLeadId}`,
// //           {
// //             method: "PUT",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${token}`,
// //             },
// //             body: JSON.stringify(formData),
// //           }
// //         );
// //       } else {
// //         // Create new lead
// //         response = await fetch(`http://localhost:8000/api/use_lead/${id}`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify(formData),
// //         });
// //       }

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const updatedLead = await response.json();
// //       if (isEditMode) {
// //         setLeads(
// //           leads.map((lead) =>
// //             lead.id === editLeadId ? { ...lead, ...updatedLead } : lead
// //           )
// //         );
// //         setLastLead(updatedLead);
// //       } else {
// //         setLeads([...leads, updatedLead]);
// //         setLastLead(updatedLead);
// //       }

// //       // Reset form and close
// //       setFormData({
// //         name: "",
// //         email: "",
// //         mobileno: "",
// //         custom_field_1: "",
// //         custom_field_2: "",
// //       });
// //       setShowForm(false);
// //       setIsEditMode(false);
// //       setEditLeadId(null);
// //       console.log(
// //         isEditMode ? "Lead updated successfully!" : "Lead created successfully!"
// //       );
// //     } catch (error) {
// //       console.error(
// //         isEditMode ? "Error updating lead:" : "Error creating lead:",
// //         error
// //       );
// //     }
// //   };

// //   // Handle edit action
// //   const handleEditLead = (lead) => {
// //     setFormData({
// //       name: lead.name,
// //       email: lead.email,
// //       mobileno: lead.mobileno,
// //       custom_field_1: lead.custom_field_1,
// //       custom_field_2: lead.custom_field_2,
// //     });
// //     setIsEditMode(true);
// //     setEditLeadId(lead.id);
// //     setShowForm(true);
// //   };

// //   // Handle delete action
// //   const handleDeleteLead = async () => {
// //     const token = getAuthToken();
// //     if (!token) {
// //       console.error("No auth token found. Please log in.");
// //       setShowDeleteModal(false);
// //       return;
// //     }

// //     try {
// //       const response = await fetch(
// //         `http://localhost:8000/api/remove_lead/${deleteLeadId}`,
// //         {
// //           method: "DELETE",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       setLeads(leads.filter((lead) => lead.id !== deleteLeadId));
// //       setShowDeleteModal(false);
// //       setDeleteLeadId(null);
// //       console.log("Lead deleted successfully!");
// //     } catch (error) {
// //       console.error("Error deleting lead:", error);
// //     }
// //   };

// //   // Handle call action
// //   const handleCallLead = (mobileNo) => {
// //     if (mobileNo) {
// //       window.location.href = `tel:${mobileNo}`;
// //     } else {
// //       console.error("No mobile number available for this lead.");
// //     }
// //   };

// //   // Navigate to CSV upload page
// //   const handleCSVUpload = () => {
// //     navigate("/user/upload-csv");
// //   };

// //   return (
// //     <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
// //       {/* First Section: Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
// //         <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 transition-transform transform hover:scale-105">
// //           <h2 className="text-xl font-bold text-gray-800">Total Leads</h2>
// //           <p className="text-4xl font-semibold text-blue-600">
// //             {loading ? "Loading..." : leads.length}
// //           </p>
// //         </div>
// //         <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 transition-transform transform hover:scale-105">
// //           <h2 className="text-xl font-bold text-gray-800">Last Created Lead</h2>
// //           <p className="text-lg text-gray-600">
// //             {loading
// //               ? "Loading..."
// //               : lastLead
// //               ? `${lastLead.name} (${new Date().toLocaleDateString()})`
// //               : "No leads yet"}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Second Section: Buttons */}
// //       <div className="flex justify-end gap-4 mb-10">
// //         <button
// //           onClick={() => {
// //             setShowForm(!showForm);
// //             if (showForm) {
// //               setFormData({
// //                 name: "",
// //                 email: "",
// //                 mobileno: "",
// //                 custom_field_1: "",
// //                 custom_field_2: "",
// //               });
// //               setIsEditMode(false);
// //               setEditLeadId(null);
// //             }
// //           }}
// //           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
// //         >
// //           {showForm ? "Cancel" : "Create Lead"}
// //         </button>
// //         <button
// //           onClick={handleCSVUpload}
// //           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
// //         >
// //           Upload CSV
// //         </button>
// //       </div>

// //       {/* Form for Creating/Editing Lead */}
// //       {showForm && (
// //         <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
// //           <h2 className="text-2xl font-bold text-gray-800 mb-6">
// //             {isEditMode ? "Edit Lead" : "Create New Lead"}
// //           </h2>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <input
// //               type="text"
// //               name="name"
// //               value={formData.name}
// //               onChange={handleInputChange}
// //               placeholder="Name"
// //               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// //             />
// //             <input
// //               type="email"
// //               name="email"
// //               value={formData.email}
// //               onChange={handleInputChange}
// //               placeholder="Email"
// //               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// //             />
// //             <input
// //               type="text"
// //               name="mobileno"
// //               value={formData.mobileno}
// //               onChange={handleInputChange}
// //               placeholder="Mobile No"
// //               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// //             />
// //             <input
// //               type="text"
// //               name="custom_field_1"
// //               value={formData.custom_field_1}
// //               onChange={handleInputChange}
// //               placeholder="Custom Field 1"
// //               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// //             />
// //             <input
// //               type="text"
// //               name="custom_field_2"
// //               value={formData.custom_field_2}
// //               onChange={handleInputChange}
// //               placeholder="Custom Field 2"
// //               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// //             />
// //           </div>
// //           <button
// //             onClick={handleSubmit}
// //             className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
// //           >
// //             {isEditMode ? "Update" : "Submit"}
// //           </button>
// //         </div>
// //       )}

// //       {/* Delete Confirmation Modal */}
// //       {showDeleteModal && (
// //         <div className="fixed inset-0 backdrop-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
// //             <h3 className="text-lg font-bold text-gray-800 mb-4">
// //               Confirm Delete
// //             </h3>
// //             <p className="text-gray-600 mb-6">
// //               Are you sure you want to delete this lead? This action cannot be
// //               undone.
// //             </p>
// //             <div className="flex justify-end gap-4">
// //               <button
// //                 onClick={() => {
// //                   setShowDeleteModal(false);
// //                   setDeleteLeadId(null);
// //                 }}
// //                 className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleDeleteLead}
// //                 className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
// //               >
// //                 Confirm
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Loading State */}
// //       {loading ? (
// //         <div className="text-center text-gray-600 text-lg">
// //           Loading leads...
// //         </div>
// //       ) : (
// //         <>
// //           {/* Table View (XL screens and above) */}
// //           <div className="hidden xl:block overflow-x-auto rounded-lg shadow-lg">
// //             <table className="w-full bg-white">
// //               <thead>
// //                 <tr className="bg-gray-100 text-gray-800">
// //                   <th className="p-4 text-left font-bold">Name</th>
// //                   <th className="p-4 text-left font-bold">Email</th>
// //                   <th className="p-4 text-left font-bold">Mobile No</th>
// //                   <th className="p-4 text-left font-bold">Custom Field 1</th>
// //                   <th className="p-4 text-left font-bold">Custom Field 2</th>
// //                   <th className="p-4 text-left font-bold">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {leads.map((lead) => (
// //                   <tr
// //                     key={lead.id}
// //                     className="border-b border-gray-200 hover:bg-gray-50"
// //                   >
// //                     <td className="p-4 text-gray-700">{lead.name}</td>
// //                     <td className="p-4 text-gray-700">{lead.email}</td>
// //                     <td className="p-4 text-gray-700">{lead.mobileno}</td>
// //                     <td className="p-4 text-gray-700">{lead.custom_field_1}</td>
// //                     <td className="p-4 text-gray-700">{lead.custom_field_2}</td>
// //                     <td className="p-4 flex gap-3">
// //                       <button
// //                         onClick={() => handleEditLead(lead)}
// //                         className="text-blue-600 hover:text-blue-800"
// //                       >
// //                         <FaEdit />
// //                       </button>
// //                       <button
// //                         onClick={() => {
// //                           setShowDeleteModal(true);
// //                           setDeleteLeadId(lead.id);
// //                         }}
// //                         className="text-red-600 hover:text-red-800"
// //                       >
// //                         <FaTrash />
// //                       </button>
// //                       <button
// //                         onClick={() => handleCallLead(lead.mobileno)}
// //                         className="text-green-600 hover:text-green-800"
// //                       >
// //                         <FaPhone />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Mobile View (Below XL) */}
// //           <div className="xl:hidden space-y-6">
// //             {leads.map((lead) => (
// //               <div
// //                 key={lead.id}
// //                 className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500"
// //               >
// //                 <p className="text-gray-700 mb-2">
// //                   <strong className="text-gray-800 font-semibold">Name:</strong>{" "}
// //                   {lead.name}
// //                 </p>
// //                 <p className="text-gray-700 mb-2">
// //                   <strong className="text-gray-800 font-semibold">
// //                     Email:
// //                   </strong>{" "}
// //                   {lead.email}
// //                 </p>
// //                 <p className="text-gray-700 mb-2">
// //                   <strong className="text-gray-800 font-semibold">
// //                     Mobile No:
// //                   </strong>{" "}
// //                   {lead.mobileno}
// //                 </p>
// //                 <p className="text-gray-700 mb-2">
// //                   <strong className="text-gray-800 font-semibold">
// //                     Custom Field 1:
// //                   </strong>{" "}
// //                   {lead.custom_field_1}
// //                 </p>
// //                 <p className="text-gray-700 mb-2">
// //                   <strong className="text-gray-800 font-semibold">
// //                     Custom Field 2:
// //                   </strong>{" "}
// //                   {lead.custom_field_2}
// //                 </p>
// //                 <div className="flex gap-3 mt-4">
// //                   <button
// //                     onClick={() => handleEditLead(lead)}
// //                     className="text-blue-600 hover:text-blue-800"
// //                   >
// //                     <FaEdit />
// //                   </button>
// //                   <button
// //                     onClick={() => {
// //                       setShowDeleteModal(true);
// //                       setDeleteLeadId(lead.id);
// //                     }}
// //                     className="text-red-600 hover:text-red-800"
// //                   >
// //                     <FaTrash />
// //                   </button>
// //                   <button
// //                     onClick={() => handleCallLead(lead.mobileno)}
// //                     className="text-green-600 hover:text-green-800"
// //                   >
// //                     <FaPhone />
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default LeadDashboard;

// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Trash2,
//   Phone,
//   Edit3,
//   Search,
//   X,
//   Loader2,
//   CheckCircle2,
//   ShieldAlert,
// } from "lucide-react";

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// function cx(...arr) {
//   return arr.filter(Boolean).join(" ");
// }

// const LeadDashboard = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // file_id
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [query, setQuery] = useState("");
//   const [selected, setSelected] = useState(new Set()); // bulk select

//   // create
//   const [showCreate, setShowCreate] = useState(false);
//   const [creating, setCreating] = useState(false);

//   // edit (full)
//   const [showEdit, setShowEdit] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // delete
//   const [showDelete, setShowDelete] = useState(false);
//   const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

//   // state quick edit
//   const [showStateEdit, setShowStateEdit] = useState(false);
//   const [stateEditId, setStateEditId] = useState(null);
//   const [stateValue, setStateValue] = useState("");

//   const fileIdNum = Number(id);
//   const token = useRef(localStorage.getItem("token") || null);

//   // Create form
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile: "",
//     salesforce_id: "",
//     custom0: "",
//     custom1: "",
//     add_date: new Date().toISOString(),
//   });

//   // Edit form
//   const [editForm, setEditForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile: "",
//     salesforce_id: "",
//     custom0: "",
//     custom1: "",
//     add_date: "",
//   });

//   useEffect(() => {
//     fetchLeads();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   async function fetchLeads() {
//     const t = token.current;
//     if (!t) {
//       console.error("No auth token found.");
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `${API_URL}/api/leads${fileIdNum ? `?file_id=${fileIdNum}` : ""}`,
//         { headers: { Authorization: `Bearer ${t}` } }
//       );
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setLeads(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to load leads");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return leads;
//     return leads.filter((l) =>
//       [
//         l.first_name,
//         l.last_name,
//         l.email,
//         l.mobile,
//         l.salesforce_id,
//         l?.other_data?.Custom_0,
//         l?.other_data?.Custom_1,
//       ]
//         .filter(Boolean)
//         .some((x) => String(x).toLowerCase().includes(q))
//     );
//   }, [leads, query]);

//   const totalLeads = leads.length;
//   const lastLead = leads[leads.length - 1] || null;

//   function onToggle(id) {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   }
//   function onToggleAll(list) {
//     if (selected.size === list.length) {
//       setSelected(new Set());
//     } else {
//       setSelected(new Set(list.map((l) => l.id)));
//     }
//   }

//   // CREATE
//   async function createLead() {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!form.first_name || !form.last_name || !form.email || !form.mobile) {
//       return toast.info("Please fill first, last, email and mobile.");
//     }
//     setCreating(true);
//     try {
//       const payload = {
//         first_name: form.first_name.trim(),
//         last_name: form.last_name.trim(),
//         email: form.email.trim(),
//         add_date: form.add_date,
//         mobile: form.mobile.trim(),
//         file_id: fileIdNum || null,
//         salesforce_id: form.salesforce_id.trim(),
//         other_data: { Custom_0: form.custom0 || "", Custom_1: form.custom1 || "" },
//       };
//       const res = await fetch(`${API_URL}/api/add_manually_lead`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       await res.json();
//       toast.success("Lead added");
//       setShowCreate(false);
//       setForm({
//         first_name: "",
//         last_name: "",
//         email: "",
//         mobile: "",
//         salesforce_id: "",
//         custom0: "",
//         custom1: "",
//         add_date: new Date().toISOString(),
//       });
//       fetchLeads();
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to add lead");
//     } finally {
//       setCreating(false);
//     }
//   }

//   // EDIT (full)
//   function openEdit(lead) {
//     setEditId(lead.id);
//     setEditForm({
//       first_name: lead.first_name || "",
//       last_name: lead.last_name || "",
//       email: lead.email || "",
//       mobile: lead.mobile || "",
//       salesforce_id: lead.salesforce_id || "",
//       custom0: lead?.other_data?.Custom_0 || "",
//       custom1: lead?.other_data?.Custom_1 || "",
//       add_date: lead.add_date || new Date().toISOString(),
//     });
//     setShowEdit(true);
//   }

//   async function saveEdit() {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!editId) return;

//     setEditing(true);
//     try {
//       const payload = {
//         first_name: editForm.first_name.trim(),
//         last_name: editForm.last_name.trim(),
//         email: editForm.email.trim(),
//         mobile: editForm.mobile.trim(),
//         salesforce_id: editForm.salesforce_id.trim(),
//         add_date: editForm.add_date,
//         // do not change file_id automatically; keep it in the same list
//         other_data: { Custom_0: editForm.custom0 || "", Custom_1: editForm.custom1 || "" },
//       };

//       const res = await fetch(`${API_URL}/api/leads/${editId}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const json = await res.json();
//       if (!res.ok || json?.success === false) {
//         throw new Error(json?.detail || `HTTP ${res.status}`);
//       }

//       toast.success(json?.detail || "Lead updated");
//       setShowEdit(false);
//       setEditId(null);
//       fetchLeads();
//     } catch (e) {
//       console.error(e);
//       toast.error(e.message || "Update failed");
//     } finally {
//       setEditing(false);
//     }
//   }

//   // DELETE (bulk/single)
//   async function deleteLeads(ids) {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!ids?.length) return;

//     try {
//       const res = await fetch(`${API_URL}/api/leads`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
//         body: JSON.stringify({ ids }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       await res.json();
//       toast.success("Lead(s) deleted");
//       setSelected(new Set());
//       fetchLeads();
//     } catch (e) {
//       console.error(e);
//       toast.error("Delete failed");
//     }
//   }

//   // STATE quick edit
//   async function updateState() {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!stateEditId) return;
//     try {
//       const res = await fetch(`${API_URL}/api/update-lead-state/${stateEditId}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
//         body: JSON.stringify({ state: stateValue || "" }),
//       });
//       const json = await res.json();
//       if (!res.ok || json?.success === false) {
//         toast.error(json?.detail || "Update failed");
//       } else {
//         toast.success(json?.detail || "Lead updated");
//         fetchLeads();
//       }
//       setShowStateEdit(false);
//       setStateEditId(null);
//       setStateValue("");
//     } catch (e) {
//       console.error(e);
//       toast.error("Update failed");
//     }
//   }

//   function openStateEditor(lead) {
//     setStateEditId(lead.id);
//     setStateValue(lead.state || "");
//     setShowStateEdit(true);
//   }

//   function callLead(mobile) {
//     if (!mobile) return toast.info("No mobile number");
//     window.location.href = `tel:${mobile}`;
//   }

//   return (
//     <div className="min-h-screen w-full bg-slate-50">
//       {/* Top gradient */}
//       <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-100/70 via-sky-50 to-transparent -z-10" />

//       <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35 }}
//           className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
//         >
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Leads</h1>
//             <p className="text-slate-600">
//               File: <span className="font-medium">{fileIdNum || "—"}</span>
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setShowCreate(true)}
//               className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
//             >
//               <Plus className="h-4 w-4" /> New Lead
//             </button>
//             <button
//               onClick={() => navigate("/user/upload-csv")}
//               className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
//             >
//               Upload CSV
//             </button>
//           </div>
//         </motion.div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
//           <StatCard label="Total Leads" value={totalLeads} />
//           <StatCard
//             label="Last Created"
//             value={
//               lastLead
//                 ? `${lastLead.first_name || ""} ${lastLead.last_name || ""}`.trim() || "—"
//                 : "—"
//             }
//             sub={
//               lastLead?.add_date
//                 ? formatDate(lastLead.add_date)
//                 : lastLead
//                 ? "Just now"
//                 : "No leads yet"
//             }
//           />
//           <StatCard
//             label="Selected"
//             value={selected.size}
//             sub={selected.size > 0 ? "Ready for bulk delete" : "Nothing selected"}
//           />
//         </div>

//         {/* Toolbar */}
//         <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative w-full sm:max-w-sm">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search name, email, mobile, Salesforce ID..."
//               className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 outline-none"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => {
//                 if (filtered.length === 0) return;
//                 onToggleAll(filtered);
//               }}
//               className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
//             >
//               {selected.size === filtered.length ? "Unselect all" : "Select all"}
//             </button>
//             <button
//               onClick={() => {
//                 if (selected.size === 0) return toast.info("No leads selected");
//                 setPendingDeleteIds(Array.from(selected));
//                 setShowDelete(true);
//               }}
//               className={cx(
//                 "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-white",
//                 selected.size > 0
//                   ? "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600"
//                   : "bg-slate-400 cursor-not-allowed"
//               )}
//               disabled={selected.size === 0}
//             >
//               <Trash2 className="h-4 w-4" /> Bulk Delete
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {/* Center-aligned header titles */}
//           <div className="hidden xl:grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 text-center">
//             <div className="col-span-1">Sel</div>
//             <div className="col-span-2">Name</div>
//             <div className="col-span-2">Email</div>
//             <div className="col-span-2">Mobile</div>
//             <div className="col-span-2">Custom 0 / 1</div>
//             <div className="col-span-1">State</div>
//             <div className="col-span-2">Actions</div>
//           </div>

//           <div className="divide-y divide-slate-200">
//             <AnimatePresence initial={false}>
//               {loading ? (
//                 <RowSkeleton />
//               ) : filtered.length === 0 ? (
//                 <EmptyState />
//               ) : (
//                 filtered.map((l) => {
//                   const name = `${l.first_name || ""} ${l.last_name || ""}`.trim();
//                   const c0 = l?.other_data?.Custom_0 || "";
//                   const c1 = l?.other_data?.Custom_1 || "";
//                   return (
//                     <motion.div
//                       key={l.id}
//                       initial={{ opacity: 0, y: 8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -8 }}
//                       transition={{ duration: 0.2 }}
//                       className="grid grid-cols-1 xl:grid-cols-12 gap-3 px-4 py-4"
//                     >
//                       {/* Select */}
//                       <div className="xl:col-span-1 flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={selected.has(l.id)}
//                           onChange={() => onToggle(l.id)}
//                           className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                         />
//                       </div>

//                       {/* Name */}
//                       <div className="xl:col-span-2">
//                         <div className="text-sm font-semibold text-slate-900">
//                           {name || "—"}
//                         </div>
//                         <div className="text-xs text-slate-500">
//                           #{l.id} &middot; {l.salesforce_id || "No SFDC ID"}
//                         </div>
//                       </div>

//                       {/* Email */}
//                       <div className="xl:col-span-2 flex items-center">
//                         <span className="text-sm text-slate-800">{l.email || "—"}</span>
//                       </div>

//                       {/* Mobile */}
//                       <div className="xl:col-span-2 flex items-center">
//                         <span className="text-sm text-slate-800">{l.mobile || "—"}</span>
//                       </div>

//                       {/* Custom */}
//                       <div className="xl:col-span-2 flex flex-col justify-center">
//                         <span className="text-xs text-slate-500">Custom_0</span>
//                         <span className="text-sm font-medium text-slate-800 break-all">
//                           {c0 || "—"}
//                         </span>
//                         <span className="text-xs text-slate-500 mt-2">Custom_1</span>
//                         <span className="text-sm font-medium text-slate-800 break-all">
//                           {c1 || "—"}
//                         </span>
//                       </div>

//                       {/* State */}
//                       <div className="xl:col-span-1 flex items-center">
//                         <span className="text-sm text-slate-800">{l.state || "—"}</span>
//                       </div>

//                       {/* Actions */}
//                       <div className="xl:col-span-2 flex flex-wrap items-center gap-2">
//                         <RowButton
//                           onClick={() => callLead(l.mobile)}
//                           icon={<Phone className="h-4 w-4" />}
//                           label="Call"
//                         />
//                         <RowButton
//                           onClick={() => openEdit(l)}
//                           icon={<Edit3 className="h-4 w-4" />}
//                           label="Edit"
//                         />
//                         <RowButton
//                           onClick={() => openStateEditor(l)}
//                           icon={<Edit3 className="h-4 w-4" />}
//                           label="State"
//                         />
//                         <RowDanger
//                           onClick={() => {
//                             setPendingDeleteIds([l.id]);
//                             setShowDelete(true);
//                           }}
//                           icon={<Trash2 className="h-4 w-4" />}
//                           label="Delete"
//                         />
//                       </div>
//                     </motion.div>
//                   );
//                 })
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* Create Lead modal */}
//       <Modal open={showCreate} onClose={() => setShowCreate(false)} title="">
//         <CardGlass>
//           <HeaderIcon title="Create Lead" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <TextField label="First name" value={form.first_name} onChange={(v) => setForm((s) => ({ ...s, first_name: v }))} />
//             <TextField label="Last name" value={form.last_name} onChange={(v) => setForm((s) => ({ ...s, last_name: v }))} />
//             <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} />
//             <TextField label="Mobile (digits only)" value={form.mobile} onChange={(v) => setForm((s) => ({ ...s, mobile: v }))} />
//             <TextField label="Salesforce ID" value={form.salesforce_id} onChange={(v) => setForm((s) => ({ ...s, salesforce_id: v }))} />
//             <TextField label="Add date (ISO)" value={form.add_date} onChange={(v) => setForm((s) => ({ ...s, add_date: v }))} placeholder="2025-08-13T10:00:00.000Z" />
//             <TextField label="Custom_0" value={form.custom0} onChange={(v) => setForm((s) => ({ ...s, custom0: v }))} />
//             <TextField label="Custom_1" value={form.custom1} onChange={(v) => setForm((s) => ({ ...s, custom1: v }))} />
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <Ghost onClick={() => setShowCreate(false)}>Cancel</Ghost>
//             <Primary onClick={createLead} disabled={creating}>
//               {creating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>) : (<><CheckCircle2 className="h-4 w-4" /> Create</>)}
//             </Primary>
//           </div>
//         </CardGlass>
//       </Modal>

//       {/* Edit Lead modal (FULL EDIT) */}
//       <Modal open={showEdit} onClose={() => setShowEdit(false)} title="">
//         <CardGlass>
//           <HeaderIcon title="Edit Lead" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <TextField label="First name" value={editForm.first_name} onChange={(v) => setEditForm((s) => ({ ...s, first_name: v }))} />
//             <TextField label="Last name" value={editForm.last_name} onChange={(v) => setEditForm((s) => ({ ...s, last_name: v }))} />
//             <TextField label="Email" type="email" value={editForm.email} onChange={(v) => setEditForm((s) => ({ ...s, email: v }))} />
//             <TextField label="Mobile (digits only)" value={editForm.mobile} onChange={(v) => setEditForm((s) => ({ ...s, mobile: v }))} />
//             <TextField label="Salesforce ID" value={editForm.salesforce_id} onChange={(v) => setEditForm((s) => ({ ...s, salesforce_id: v }))} />
//             <TextField label="Add date (ISO)" value={editForm.add_date} onChange={(v) => setEditForm((s) => ({ ...s, add_date: v }))} />
//             <TextField label="Custom_0" value={editForm.custom0} onChange={(v) => setEditForm((s) => ({ ...s, custom0: v }))} />
//             <TextField label="Custom_1" value={editForm.custom1} onChange={(v) => setEditForm((s) => ({ ...s, custom1: v }))} />
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <Ghost onClick={() => setShowEdit(false)}>Cancel</Ghost>
//             <Primary onClick={saveEdit} disabled={editing}>
//               {editing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>) : (<><CheckCircle2 className="h-4 w-4" /> Save</>)}
//             </Primary>
//           </div>
//         </CardGlass>
//       </Modal>

//       {/* State quick-edit */}
//       <Modal
//         open={showStateEdit}
//         onClose={() => { setShowStateEdit(false); setStateEditId(null); setStateValue(""); }}
//         title="Update State"
//       >
//         <div className="space-y-3">
//           <p className="text-sm text-slate-600">Update the lead's state (timezone auto-detected server-side).</p>
//           <TextField label="State" value={stateValue} onChange={setStateValue} placeholder="e.g., California" />
//           <div className="flex justify-end gap-2">
//             <Ghost onClick={() => { setShowStateEdit(false); setStateEditId(null); setStateValue(""); }}>Cancel</Ghost>
//             <Primary onClick={updateState}><CheckCircle2 className="h-4 w-4" /> Update</Primary>
//           </div>
//         </div>
//       </Modal>

//       {/* Delete confirm */}
//       <Modal
//         open={showDelete}
//         onClose={() => { setShowDelete(false); setPendingDeleteIds([]); }}
//         title="Delete Lead(s)?"
//       >
//         <div className="flex items-start gap-3">
//           <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
//             <ShieldAlert className="h-5 w-5" />
//           </div>
//           <div>
//             <p className="text-slate-700">
//               This will permanently remove <span className="font-semibold">{pendingDeleteIds.length} lead(s)</span>. This action cannot be undone.
//             </p>
//             <div className="mt-4 flex justify-end gap-2">
//               <Ghost onClick={() => { setShowDelete(false); setPendingDeleteIds([]); }}>Cancel</Ghost>
//               <Danger onClick={async () => { await deleteLeads(pendingDeleteIds); setShowDelete(false); setPendingDeleteIds([]); }}>
//                 <Trash2 className="h-4 w-4" /> Delete
//               </Danger>
//             </div>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// /* ---------------- Reusable UI ---------------- */

// function CardGlass({ children }) {
//   return (
//     <div className="relative">
//       <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-20 blur-lg" />
//       <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-xl">
//         {children}
//       </div>
//     </div>
//   );
// }

// function HeaderIcon({ title }) {
//   return (
//     <div className="mb-4 flex items-center gap-3">
//       <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg">
//         <Edit3 className="h-5 w-5" />
//       </div>
//       <div>
//         <h3 className="text-lg font-bold text-slate-900">{title}</h3>
//         <p className="text-sm text-slate-600">Edit all fields easily.</p>
//       </div>
//     </div>
//   );
// }

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
//       className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
//     >
//       {icon} <span>{label}</span>
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
//           className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
//         >
//           <div className="mb-3 flex items-center justify-between">
//             {title ? <h3 className="text-lg font-bold text-slate-900">{title}</h3> : <div />}
//             <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">
//               <X className="h-4 w-4 text-slate-500" />
//             </button>
//           </div>
//           {children}
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// function Ghost({ children, onClick }) {
//   return (
//     <button onClick={onClick} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
//       {children}
//     </button>
//   );
// }

// function Primary({ children, onClick, disabled }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow-lg",
//         disabled ? "bg-blue-400" : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
//       )}
//     >
//       {children}
//     </button>
//   );
// }

// function Danger({ children, onClick }) {
//   return (
//     <button onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-rose-700 hover:to-rose-600">
//       {children}
//     </button>
//   );
// }

// function RowSkeleton() {
//   return (
//     <div className="px-4 py-6">
//       <div className="animate-pulse grid grid-cols-1 xl:grid-cols-12 gap-4">
//         <div className="xl:col-span-1 h-6 rounded bg-slate-200" />
//         <div className="xl:col-span-2 h-6 rounded bg-slate-200" />
//         <div className="xl:col-span-2 h-6 rounded bg-slate-200" />
//         <div className="xl:col-span-2 h-6 rounded bg-slate-200" />
//         <div className="xl:col-span-2 h-6 rounded bg-slate-200" />
//         <div className="xl:col-span-1 h-6 rounded bg-slate-200" />
//         <div className="xl:col-span-2 h-6 rounded bg-slate-200" />
//       </div>
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-16">
//       <div className="text-5xl">👤</div>
//       <div className="text-lg font-semibold text-slate-800">No leads yet</div>
//       <div className="text-slate-600">Add your first lead to this list.</div>
//     </div>
//   );
// }

// function TextField({ label, value, onChange, type = "text", placeholder = "" }) {
//   return (
//     <label className="block">
//       <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500"
//       />
//     </label>
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

// export default LeadDashboard;

// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Trash2,
//   Phone,
//   Edit3,
//   Search,
//   X,
//   Loader2,
//   CheckCircle2,
//   ShieldAlert,
//   RefreshCw,
//   Download,
//   Rows,
//   LayoutGrid,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
// } from "lucide-react";

// /** ---------------------------------------------------------
//  * Config
//  * --------------------------------------------------------- */
// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// /** Utility: classnames */
// function cx(...arr) {
//   return arr.filter(Boolean).join(" ");
// }

// /** Debounce for search */
// function useDebounce(value, delay = 250) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return debounced;
// }

// /** ---------------------------------------------------------
//  * Main Component
//  * --------------------------------------------------------- */
// const LeadDashboard = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // file_id
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // filters / search / sorting / paging
//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounce(query, 250);
//   const [filterState, setFilterState] = useState("");
//   const [sortBy, setSortBy] = useState("add_date"); // id | name | email | mobile | state | add_date
//   const [sortDir, setSortDir] = useState("desc"); // asc | desc
//   const [view, setView] = useState("table"); // table | cards
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const [selected, setSelected] = useState(new Set()); // bulk select

//   // create
//   const [showCreate, setShowCreate] = useState(false);
//   const [creating, setCreating] = useState(false);

//   // edit (full)
//   const [showEdit, setShowEdit] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // delete
//   const [showDelete, setShowDelete] = useState(false);
//   const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

//   // state quick edit
//   const [showStateEdit, setShowStateEdit] = useState(false);
//   const [stateEditId, setStateEditId] = useState(null);
//   const [stateValue, setStateValue] = useState("");

//   const fileIdNum = Number(id);
//   const token = useRef(localStorage.getItem("token") || null);

//   // Create form
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile: "",
//     salesforce_id: "",
//     custom0: "",
//     custom1: "",
//     add_date: new Date().toISOString(),
//   });

//   // Edit form
//   const [editForm, setEditForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile: "",
//     salesforce_id: "",
//     custom0: "",
//     custom1: "",
//     add_date: "",
//   });

//   // Load leads
//   useEffect(() => {
//     fetchLeads();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   async function fetchLeads() {
//     const t = token.current;
//     if (!t) {
//       console.error("No auth token found.");
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `${API_URL}/api/leads${fileIdNum ? `?file_id=${fileIdNum}` : ""}`,
//         { headers: { Authorization: `Bearer ${t}` } }
//       );
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setLeads(Array.isArray(data) ? data : []);
//       setSelected(new Set()); // clear selection on reload
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to load leads");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Unique states for filtering dropdown
//   const availableStates = useMemo(() => {
//     const s = new Set();
//     leads.forEach((l) => l?.state && s.add(l.state));
//     return Array.from(s).sort((a, b) => a.localeCompare(b));
//   }, [leads]);

//   // Filtering + search
//   const filtered = useMemo(() => {
//     const q = debouncedQuery.trim().toLowerCase();
//     const list = leads.filter((l) => {
//       if (filterState && (l.state || "") !== filterState) return false;
//       if (!q) return true;
//       const vals = [
//         l.first_name,
//         l.last_name,
//         l.email,
//         l.mobile,
//         l.salesforce_id,
//         l?.other_data?.Custom_0,
//         l?.other_data?.Custom_1,
//       ]
//         .filter(Boolean)
//         .map((x) => String(x).toLowerCase());
//       return vals.some((x) => x.includes(q));
//     });
//     return list;
//   }, [leads, debouncedQuery, filterState]);

//   // Sorting
//   const sorted = useMemo(() => {
//     const copy = [...filtered];
//     const dir = sortDir === "asc" ? 1 : -1;
//     copy.sort((a, b) => {
//       const nameA = `${a.first_name || ""} ${a.last_name || ""}`.trim();
//       const nameB = `${b.first_name || ""} ${b.last_name || ""}`.trim();
//       let va, vb;
//       switch (sortBy) {
//         case "id":
//           va = a.id ?? 0;
//           vb = b.id ?? 0;
//           break;
//         case "name":
//           va = nameA.toLowerCase();
//           vb = nameB.toLowerCase();
//           break;
//         case "email":
//           va = (a.email || "").toLowerCase();
//           vb = (b.email || "").toLowerCase();
//           break;
//         case "mobile":
//           va = (a.mobile || "").toLowerCase();
//           vb = (b.mobile || "").toLowerCase();
//           break;
//         case "state":
//           va = (a.state || "").toLowerCase();
//           vb = (b.state || "").toLowerCase();
//           break;
//         case "add_date":
//         default:
//           va = new Date(a.add_date || 0).getTime();
//           vb = new Date(b.add_date || 0).getTime();
//       }
//       if (va < vb) return -1 * dir;
//       if (va > vb) return 1 * dir;
//       return 0;
//     });
//     return copy;
//   }, [filtered, sortBy, sortDir]);

//   // Pagination
//   const totalLeads = sorted.length;
//   const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));
//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);
//   const start = (page - 1) * pageSize;
//   const end = start + pageSize;
//   const pageItems = sorted.slice(start, end);

//   const lastLead = leads[leads.length - 1] || null;

//   // Bulk select toggles
//   function onToggle(id) {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   }
//   function onTogglePage() {
//     const ids = pageItems.map((l) => l.id);
//     const every = ids.every((id) => selected.has(id));
//     setSelected((prev) => {
//       const next = new Set(prev);
//       if (every) {
//         ids.forEach((id) => next.delete(id));
//       } else {
//         ids.forEach((id) => next.add(id));
//       }
//       return next;
//     });
//   }
//   function onSelectAllFiltered() {
//     setSelected(new Set(sorted.map((l) => l.id)));
//   }
//   function onClearSelection() {
//     setSelected(new Set());
//   }

//   // CREATE
//   async function createLead() {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!form.first_name || !form.last_name || !form.email || !form.mobile) {
//       return toast.info("Please fill first, last, email and mobile.");
//     }
//     setCreating(true);
//     try {
//       const payload = {
//         first_name: form.first_name.trim(),
//         last_name: form.last_name.trim(),
//         email: form.email.trim(),
//         add_date: form.add_date,
//         mobile: form.mobile.trim(),
//         file_id: fileIdNum || null,
//         salesforce_id: form.salesforce_id.trim(),
//         other_data: {
//           Custom_0: form.custom0 || "",
//           Custom_1: form.custom1 || "",
//         },
//       };
//       const res = await fetch(`${API_URL}/api/add_manually_lead`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${t}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       await res.json();
//       toast.success("Lead added");
//       setShowCreate(false);
//       setForm({
//         first_name: "",
//         last_name: "",
//         email: "",
//         mobile: "",
//         salesforce_id: "",
//         custom0: "",
//         custom1: "",
//         add_date: new Date().toISOString(),
//       });
//       fetchLeads();
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to add lead");
//     } finally {
//       setCreating(false);
//     }
//   }

//   // EDIT (full)
//   function openEdit(lead) {
//     setEditId(lead.id);
//     setEditForm({
//       first_name: lead.first_name || "",
//       last_name: lead.last_name || "",
//       email: lead.email || "",
//       mobile: lead.mobile || "",
//       salesforce_id: lead.salesforce_id || "",
//       custom0: lead?.other_data?.Custom_0 || "",
//       custom1: lead?.other_data?.Custom_1 || "",
//       add_date: lead.add_date || new Date().toISOString(),
//     });
//     setShowEdit(true);
//   }

//   async function saveEdit() {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!editId) return;

//     setEditing(true);
//     try {
//       const payload = {
//         first_name: editForm.first_name.trim(),
//         last_name: editForm.last_name.trim(),
//         email: editForm.email.trim(),
//         mobile: editForm.mobile.trim(),
//         salesforce_id: editForm.salesforce_id.trim(),
//         add_date: editForm.add_date,
//         other_data: {
//           Custom_0: editForm.custom0 || "",
//           Custom_1: editForm.custom1 || "",
//         },
//       };

//       const res = await fetch(`${API_URL}/api/leads/${editId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${t}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       const json = await res.json();
//       if (!res.ok || json?.success === false) {
//         throw new Error(json?.detail || `HTTP ${res.status}`);
//       }

//       toast.success(json?.detail || "Lead updated");
//       setShowEdit(false);
//       setEditId(null);
//       fetchLeads();
//     } catch (e) {
//       console.error(e);
//       toast.error(e.message || "Update failed");
//     } finally {
//       setEditing(false);
//     }
//   }

//   // DELETE (bulk/single)
//   async function deleteLeads(ids) {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!ids?.length) return;

//     try {
//       const res = await fetch(`${API_URL}/api/leads`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${t}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ids }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       await res.json();
//       toast.success("Lead(s) deleted");
//       setSelected(new Set());
//       fetchLeads();
//     } catch (e) {
//       console.error(e);
//       toast.error("Delete failed");
//     }
//   }

//   // STATE quick edit
//   async function updateState() {
//     const t = token.current;
//     if (!t) return toast.info("Missing token");
//     if (!stateEditId) return;
//     try {
//       const res = await fetch(`${API_URL}/api/update-lead-state/${stateEditId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${t}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ state: stateValue || "" }),
//       });
//       const json = await res.json();
//       if (!res.ok || json?.success === false) {
//         toast.error(json?.detail || "Update failed");
//       } else {
//         toast.success(json?.detail || "Lead updated");
//         fetchLeads();
//       }
//       setShowStateEdit(false);
//       setStateEditId(null);
//       setStateValue("");
//     } catch (e) {
//       console.error(e);
//       toast.error("Update failed");
//     }
//   }

//   function openStateEditor(lead) {
//     setStateEditId(lead.id);
//     setStateValue(lead.state || "");
//     setShowStateEdit(true);
//   }

//   function callLead(mobile) {
//     if (!mobile) return toast.info("No mobile number");
//     window.location.href = `tel:${mobile}`;
//   }

//   // Export CSV (filtered set, not just current page)
//   function exportCSV() {
//     if (sorted.length === 0) return toast.info("Nothing to export.");
//     const headers = [
//       "id",
//       "first_name",
//       "last_name",
//       "email",
//       "mobile",
//       "salesforce_id",
//       "state",
//       "Custom_0",
//       "Custom_1",
//       "add_date",
//     ];
//     const rows = sorted.map((l) => [
//       l.id ?? "",
//       safeCSV(l.first_name),
//       safeCSV(l.last_name),
//       safeCSV(l.email),
//       safeCSV(l.mobile),
//       safeCSV(l.salesforce_id),
//       safeCSV(l.state),
//       safeCSV(l?.other_data?.Custom_0),
//       safeCSV(l?.other_data?.Custom_1),
//       safeCSV(l.add_date),
//     ]);
//     const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }

//   const pageSelectedCount = pageItems.filter((l) => selected.has(l.id)).length;
//   const pageAllSelected = pageSelectedCount === pageItems.length && pageItems.length > 0;

//   /** ---------------------------------------------
//    * Table column model + resizable widths
//    * --------------------------------------------- */
//   const defaultWidths = {
//     sel: 64,
//     id: 80,
//     name: 230,
//     email: 260,
//     mobile: 160,
//     sfdc: 160,
//     c0: 200,
//     c1: 200,
//     state: 140,
//     added: 200,
//     actions: 220,
//   };

//   const [colWidths, setColWidths] = useState(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("leadColWidths") || "null");
//       return saved ? { ...defaultWidths, ...saved } : defaultWidths;
//     } catch {
//       return defaultWidths;
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem("leadColWidths", JSON.stringify(colWidths));
//   }, [colWidths]);

//   const [resizing, setResizing] = useState(null); // { key, startX, startW }
//   useEffect(() => {
//     function onMove(e) {
//       if (!resizing) return;
//       const dx = e.clientX - resizing.startX;
//       setColWidths((w) => {
//         const next = { ...w, [resizing.key]: clamp(resizing.startW + dx, 90, 600) };
//         return next;
//       });
//       document.body.style.userSelect = "none";
//     }
//     function onUp() {
//       setResizing(null);
//       document.body.style.userSelect = "";
//     }
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//     return () => {
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//     };
//   }, [resizing]);

//   // Resizable table height
//   const [tableHeight, setTableHeight] = useState(() => {
//     const saved = Number(localStorage.getItem("leadTableHeight"));
//     return isFinite(saved) && saved > 280 ? saved : 520;
//   });
//   useEffect(() => {
//     localStorage.setItem("leadTableHeight", String(tableHeight));
//   }, [tableHeight]);

//   const [dragH, setDragH] = useState(null); // { startY, startH }
//   useEffect(() => {
//     function onMove(e) {
//       if (!dragH) return;
//       const dy = e.clientY - dragH.startY;
//       setTableHeight((h) => clamp(dragH.startH + dy, 280, 1000));
//       document.body.style.userSelect = "none";
//     }
//     function onUp() {
//       setDragH(null);
//       document.body.style.userSelect = "";
//     }
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//     return () => {
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//     };
//   }, [dragH]);

//   /** ---------------------------------------------
//    * Render
//    * --------------------------------------------- */
//   return (
//     <div className="min-h-screen w-full bg-slate-50">
//       {/* Ambient gradient */}
//       <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-100/70 via-sky-50 to-transparent -z-10" />

//       <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35 }}
//           className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
//         >
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Leads</h1>
//             <p className="text-slate-600">
//               File: <span className="font-medium">{fileIdNum || "—"}</span>
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setShowCreate(true)}
//               className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
//             >
//               <Plus className="h-4 w-4" /> New Lead
//             </button>
//             <button
//               onClick={() => navigate("/user/upload-csv")}
//               className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
//             >
//               Upload CSV
//             </button>
//           </div>
//         </motion.div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
//           <StatCard label="Total Leads" value={totalLeads} />
//           <StatCard
//             label="Last Created"
//             value={
//               lastLead
//                 ? `${lastLead.first_name || ""} ${lastLead.last_name || ""}`.trim() || "—"
//                 : "—"
//             }
//             sub={
//               lastLead?.add_date
//                 ? formatDate(lastLead.add_date)
//                 : lastLead
//                 ? "Just now"
//                 : "No leads yet"
//             }
//           />
//           <StatCard
//             label="Selected"
//             value={selected.size}
//             sub={selected.size > 0 ? "Ready for bulk actions" : "Nothing selected"}
//           />
//         </div>

//         {/* Toolbar */}
//         <div className="sticky top-0 z-20 mb-4 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 px-4 py-3 shadow-sm">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
//               {/* Search */}
//               <div className="relative w-full sm:max-w-sm">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   value={query}
//                   onChange={(e) => {
//                     setQuery(e.target.value);
//                     setPage(1);
//                   }}
//                   placeholder="Search name, email, mobile, Salesforce ID..."
//                   className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 outline-none"
//                 />
//               </div>

//               {/* State filter */}
//               <div className="flex items-center gap-2">
//                 <Filter className="h-4 w-4 text-slate-400" />
//                 <select
//                   value={filterState}
//                   onChange={(e) => {
//                     setFilterState(e.target.value);
//                     setPage(1);
//                   }}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:border-blue-500 outline-none"
//                 >
//                   <option value="">All states</option>
//                   {availableStates.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               {/* View toggle */}
//               <div className="hidden sm:flex rounded-xl border border-slate-200 bg-white p-1">
//                 <button
//                   onClick={() => setView("table")}
//                   className={cx(
//                     "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm",
//                     view === "table" ? "bg-slate-100 text-slate-900" : "text-slate-600"
//                   )}
//                   title="Table view"
//                 >
//                   <Rows className="h-4 w-4" /> Table
//                 </button>
//                 <button
//                   onClick={() => setView("cards")}
//                   className={cx(
//                     "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm",
//                     view === "cards" ? "bg-slate-100 text-slate-900" : "text-slate-600"
//                   )}
//                   title="Card view"
//                 >
//                   <LayoutGrid className="h-4 w-4" /> Cards
//                 </button>
//               </div>

//               {/* Page size */}
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:border-blue-500 outline-none"
//                 title="Rows per page"
//               >
//                 {[10, 25, 50, 100].map((n) => (
//                   <option key={n} value={n}>
//                     {n} / page
//                   </option>
//                 ))}
//               </select>

//               {/* Export / Refresh */}
//               <button
//                 onClick={exportCSV}
//                 className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
//               >
//                 <Download className="h-4 w-4" /> Export CSV
//               </button>
//               <button
//                 onClick={() => fetchLeads()}
//                 className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
//               >
//                 <RefreshCw className="h-4 w-4" /> Refresh
//               </button>
//             </div>
//           </div>

//           {/* Quick selection bar */}
//           {selected.size > 0 && (
//             <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2">
//               <div className="text-sm text-slate-700">
//                 <span className="font-semibold">{selected.size}</span> selected
//               </div>
//               <div className="flex flex-wrap items-center gap-2">
//                 <button
//                   onClick={() => {
//                     setPendingDeleteIds(Array.from(selected));
//                     setShowDelete(true);
//                   }}
//                   className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-3 py-2 text-sm font-semibold text-white shadow hover:from-rose-700 hover:to-rose-600"
//                 >
//                   <Trash2 className="h-4 w-4" /> Bulk Delete
//                 </button>
//                 <button
//                   onClick={onSelectAllFiltered}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
//                 >
//                   Select all filtered
//                 </button>
//                 <button
//                   onClick={onClearSelection}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
//                 >
//                   Clear selection
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="mb-3">
//           {/* TABLE VIEW */}
//           <div className={view === "table" ? "block" : "hidden sm:block"}>
//             <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//               {/* Scroll wrappers: x for small screens, y sized via height dragger */}
//               <div className="relative">
//                 <div
//                   className="overflow-x-auto"
//                   style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
//                 >
//                   <div
//                     className="overflow-y-auto"
//                     style={{ height: tableHeight }}
//                   >
//                     <table className="min-w-[1100px] w-full border-collapse">
//                       <thead className="sticky top-0 z-10 bg-slate-50">
//                         <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
//                           {/* Select all (page) */}
//                           <TH
//                             label="Sel"
//                             width={colWidths.sel}
//                             align="center"
//                             onResizeStart={(x, w) => setResizing({ key: "sel", startX: x, startW: w })}
//                           >
//                             <label className="inline-flex items-center gap-2 cursor-pointer select-none">
//                               <input
//                                 type="checkbox"
//                                 checked={pageAllSelected}
//                                 onChange={onTogglePage}
//                                 className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                               />
//                             </label>
//                           </TH>

//                           <SortableTH
//                             label="#"
//                             width={colWidths.id}
//                             active={sortBy === "id"}
//                             dir={sortBy === "id" ? sortDir : undefined}
//                             onSort={(dir) => handleSort("id", dir)}
//                             align="center"
//                             onResizeStart={(x, w) => setResizing({ key: "id", startX: x, startW: w })}
//                           />

//                           <SortableTH
//                             label="Name"
//                             width={colWidths.name}
//                             active={sortBy === "name"}
//                             dir={sortBy === "name" ? sortDir : undefined}
//                             onSort={(dir) => handleSort("name", dir)}
//                             onResizeStart={(x, w) => setResizing({ key: "name", startX: x, startW: w })}
//                           />

//                           <SortableTH
//                             label="Email"
//                             width={colWidths.email}
//                             active={sortBy === "email"}
//                             dir={sortBy === "email" ? sortDir : undefined}
//                             onSort={(dir) => handleSort("email", dir)}
//                             onResizeStart={(x, w) => setResizing({ key: "email", startX: x, startW: w })}
//                           />

//                           <SortableTH
//                             label="Mobile"
//                             width={colWidths.mobile}
//                             active={sortBy === "mobile"}
//                             dir={sortBy === "mobile" ? sortDir : undefined}
//                             onSort={(dir) => handleSort("mobile", dir)}
//                             onResizeStart={(x, w) => setResizing({ key: "mobile", startX: x, startW: w })}
//                           />

//                           <TH
//                             label="SFDC ID"
//                             width={colWidths.sfdc}
//                             onResizeStart={(x, w) => setResizing({ key: "sfdc", startX: x, startW: w })}
//                           />

//                           <TH
//                             label="Custom_0"
//                             width={colWidths.c0}
//                             onResizeStart={(x, w) => setResizing({ key: "c0", startX: x, startW: w })}
//                           />
//                           <TH
//                             label="Custom_1"
//                             width={colWidths.c1}
//                             onResizeStart={(x, w) => setResizing({ key: "c1", startX: x, startW: w })}
//                           />

//                           <SortableTH
//                             label="State"
//                             width={colWidths.state}
//                             active={sortBy === "state"}
//                             dir={sortBy === "state" ? sortDir : undefined}
//                             onSort={(dir) => handleSort("state", dir)}
//                             onResizeStart={(x, w) => setResizing({ key: "state", startX: x, startW: w })}
//                           />

//                           <SortableTH
//                             label="Added"
//                             width={colWidths.added}
//                             active={sortBy === "add_date"}
//                             dir={sortBy === "add_date" ? sortDir : undefined}
//                             onSort={(dir) => handleSort("add_date", dir)}
//                             onResizeStart={(x, w) => setResizing({ key: "added", startX: x, startW: w })}
//                           />

//                           <TH
//                             label="Actions"
//                             width={colWidths.actions}
//                             onResizeStart={(x, w) => setResizing({ key: "actions", startX: x, startW: w })}
//                           />
//                         </tr>
//                       </thead>

//                       <tbody className="divide-y divide-slate-200 text-sm">
//                         {loading ? (
//                           <tr>
//                             <td colSpan={11}>
//                               <RowSkeleton />
//                             </td>
//                           </tr>
//                         ) : pageItems.length === 0 ? (
//                           <tr>
//                             <td colSpan={11}>
//                               <EmptyState />
//                             </td>
//                           </tr>
//                         ) : (
//                           pageItems.map((l) => {
//                             const name = `${l.first_name || ""} ${l.last_name || ""}`.trim();
//                             const c0 = l?.other_data?.Custom_0 || "";
//                             const c1 = l?.other_data?.Custom_1 || "";
//                             const isChecked = selected.has(l.id);

//                             return (
//                               <tr
//                                 key={l.id}
//                                 className="hover:bg-slate-50 transition"
//                               >
//                                 {/* Sel */}
//                                 <TD width={colWidths.sel} align="center">
//                                   <input
//                                     type="checkbox"
//                                     checked={isChecked}
//                                     onChange={() => onToggle(l.id)}
//                                     className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                                   />
//                                 </TD>

//                                 {/* ID */}
//                                 <TD width={colWidths.id} align="center" mono>
//                                   #{l.id}
//                                 </TD>

//                                 {/* Name */}
//                                 <TD width={colWidths.name}>
//                                   <div className="font-semibold text-slate-900 truncate">
//                                     {name || "—"}
//                                   </div>
//                                   <div className="text-xs text-slate-500 truncate">
//                                     {l.salesforce_id ? `SFDC: ${l.salesforce_id}` : "No SFDC ID"}
//                                   </div>
//                                 </TD>

//                                 {/* Email */}
//                                 <TD width={colWidths.email}>
//                                   <span className="truncate block">{l.email || "—"}</span>
//                                 </TD>

//                                 {/* Mobile */}
//                                 <TD width={colWidths.mobile}>
//                                   <span className="truncate block">{l.mobile || "—"}</span>
//                                 </TD>

//                                 {/* SFDC */}
//                                 <TD width={colWidths.sfdc}>
//                                   <span className="truncate block">{l.salesforce_id || "—"}</span>
//                                 </TD>

//                                 {/* Custom_0 */}
//                                 <TD width={colWidths.c0}>
//                                   <span className="truncate block">{c0 || "—"}</span>
//                                 </TD>

//                                 {/* Custom_1 */}
//                                 <TD width={colWidths.c1}>
//                                   <span className="truncate block">{c1 || "—"}</span>
//                                 </TD>

//                                 {/* State */}
//                                 <TD width={colWidths.state}>
//                                   <StateBadge value={l.state} />
//                                 </TD>

//                                 {/* Added */}
//                                 <TD width={colWidths.added}>
//                                   {formatDate(l.add_date) || "—"}
//                                 </TD>

//                                 {/* Actions */}
//                                 <TD width={colWidths.actions}>
//                                   <div className="flex flex-wrap items-center gap-2">
//                                     <RowButton
//                                       onClick={() => callLead(l.mobile)}
//                                       icon={<Phone className="h-4 w-4" />}
//                                       label="Call"
//                                     />
//                                     <RowButton
//                                       onClick={() => openEdit(l)}
//                                       icon={<Edit3 className="h-4 w-4" />}
//                                       label="Edit"
//                                     />
//                                     <RowButton
//                                       onClick={() => openStateEditor(l)}
//                                       icon={<Edit3 className="h-4 w-4" />}
//                                       label="State"
//                                     />
//                                     <RowDanger
//                                       onClick={() => {
//                                         setPendingDeleteIds([l.id]);
//                                         setShowDelete(true);
//                                       }}
//                                       icon={<Trash2 className="h-4 w-4" />}
//                                       label="Delete"
//                                     />
//                                   </div>
//                                 </TD>
//                               </tr>
//                             );
//                           })
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Height drag handle */}
//                 <div
//                   onMouseDown={(e) => setDragH({ startY: e.clientY, startH: tableHeight })}
//                   className="group absolute inset-x-6 -bottom-3 z-20 grid place-items-center cursor-ns-resize"
//                 >
//                   <div className="h-2 w-24 rounded-full bg-slate-300 group-hover:bg-slate-400" />
//                 </div>
//               </div>
//             </div>

//             <Pagination
//               page={page}
//               totalPages={totalPages}
//               onPrev={() => setPage((p) => Math.max(1, p - 1))}
//               onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
//             />
//           </div>

//           {/* CARD VIEW (mobile-first) */}
//           <div className={view === "cards" ? "mt-2 block" : "mt-2 block sm:hidden"}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
//               <AnimatePresence initial={false}>
//                 {loading ? (
//                   <CardSkeleton />
//                 ) : pageItems.length === 0 ? (
//                   <EmptyState />
//                 ) : (
//                   pageItems.map((l) => {
//                     const name = `${l.first_name || ""} ${l.last_name || ""}`.trim();
//                     const c0 = l?.other_data?.Custom_0 || "";
//                     const c1 = l?.other_data?.Custom_1 || "";
//                     const checked = selected.has(l.id);
//                     return (
//                       <motion.div
//                         key={`card-${l.id}`}
//                         initial={{ opacity: 0, y: 8 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -8 }}
//                         transition={{ duration: 0.2 }}
//                         className={cx(
//                           "rounded-2xl border p-4 shadow-sm bg-white",
//                           checked ? "border-blue-400 ring-1 ring-blue-200" : "border-slate-200"
//                         )}
//                       >
//                         <div className="flex items-start justify-between gap-3">
//                           <div>
//                             <div className="text-base font-semibold text-slate-900">{name || "—"}</div>
//                             <div className="text-xs text-slate-500">
//                               #{l.id} &middot; {l.salesforce_id || "No SFDC ID"}
//                             </div>
//                           </div>
//                           <input
//                             type="checkbox"
//                             checked={checked}
//                             onChange={() => onToggle(l.id)}
//                             className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                           />
//                         </div>

//                         <div className="mt-3 space-y-2 text-sm">
//                           <Line label="Email" value={l.email || "—"} />
//                           <Line label="Mobile" value={l.mobile || "—"} />
//                           <Line label="State" value={<StateBadge value={l.state} />} />
//                           <Line label="Custom_0" value={<span className="break-all">{c0 || "—"}</span>} />
//                           <Line label="Custom_1" value={<span className="break-all">{c1 || "—"}</span>} />
//                           <Line label="Added" value={formatDate(l.add_date) || "—"} />
//                         </div>

//                         <div className="mt-3 flex flex-wrap items-center gap-2">
//                           <RowButton onClick={() => callLead(l.mobile)} icon={<Phone className="h-4 w-4" />} label="Call" />
//                           <RowButton onClick={() => openEdit(l)} icon={<Edit3 className="h-4 w-4" />} label="Edit" />
//                           <RowButton onClick={() => openStateEditor(l)} icon={<Edit3 className="h-4 w-4" />} label="State" />
//                           <RowDanger
//                             onClick={() => {
//                               setPendingDeleteIds([l.id]);
//                               setShowDelete(true);
//                             }}
//                             icon={<Trash2 className="h-4 w-4" />}
//                             label="Delete"
//                           />
//                         </div>
//                       </motion.div>
//                     );
//                   })
//                 )}
//               </AnimatePresence>
//             </div>

//             <Pagination
//               className="mt-4"
//               page={page}
//               totalPages={totalPages}
//               onPrev={() => setPage((p) => Math.max(1, p - 1))}
//               onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Create Lead modal */}
//       <Modal open={showCreate} onClose={() => setShowCreate(false)} title="">
//         <CardGlass>
//           <HeaderIcon title="Create Lead" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <TextField label="First name" value={form.first_name} onChange={(v) => setForm((s) => ({ ...s, first_name: v }))} />
//             <TextField label="Last name" value={form.last_name} onChange={(v) => setForm((s) => ({ ...s, last_name: v }))} />
//             <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} />
//             <TextField label="Mobile (digits only)" value={form.mobile} onChange={(v) => setForm((s) => ({ ...s, mobile: v }))} />
//             <TextField label="Salesforce ID" value={form.salesforce_id} onChange={(v) => setForm((s) => ({ ...s, salesforce_id: v }))} />
//             <TextField label="Add date (ISO)" value={form.add_date} onChange={(v) => setForm((s) => ({ ...s, add_date: v }))} placeholder="2025-08-13T10:00:00.000Z" />
//             <TextField label="Custom_0" value={form.custom0} onChange={(v) => setForm((s) => ({ ...s, custom0: v }))} />
//             <TextField label="Custom_1" value={form.custom1} onChange={(v) => setForm((s) => ({ ...s, custom1: v }))} />
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <Ghost onClick={() => setShowCreate(false)}>Cancel</Ghost>
//             <Primary onClick={createLead} disabled={creating}>
//               {creating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>) : (<><CheckCircle2 className="h-4 w-4" /> Create</>)}
//             </Primary>
//           </div>
//         </CardGlass>
//       </Modal>

//       {/* Edit Lead modal (FULL EDIT) */}
//       <Modal open={showEdit} onClose={() => setShowEdit(false)} title="">
//         <CardGlass>
//           <HeaderIcon title="Edit Lead" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <TextField label="First name" value={editForm.first_name} onChange={(v) => setEditForm((s) => ({ ...s, first_name: v }))} />
//             <TextField label="Last name" value={editForm.last_name} onChange={(v) => setEditForm((s) => ({ ...s, last_name: v }))} />
//             <TextField label="Email" type="email" value={editForm.email} onChange={(v) => setEditForm((s) => ({ ...s, email: v }))} />
//             <TextField label="Mobile (digits only)" value={editForm.mobile} onChange={(v) => setEditForm((s) => ({ ...s, mobile: v }))} />
//             <TextField label="Salesforce ID" value={editForm.salesforce_id} onChange={(v) => setEditForm((s) => ({ ...s, salesforce_id: v }))} />
//             <TextField label="Add date (ISO)" value={editForm.add_date} onChange={(v) => setEditForm((s) => ({ ...s, add_date: v }))} />
//             <TextField label="Custom_0" value={editForm.custom0} onChange={(v) => setEditForm((s) => ({ ...s, custom0: v }))} />
//             <TextField label="Custom_1" value={editForm.custom1} onChange={(v) => setEditForm((s) => ({ ...s, custom1: v }))} />
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <Ghost onClick={() => setShowEdit(false)}>Cancel</Ghost>
//             <Primary onClick={saveEdit} disabled={editing}>
//               {editing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>) : (<><CheckCircle2 className="h-4 w-4" /> Save</>)}
//             </Primary>
//           </div>
//         </CardGlass>
//       </Modal>

//       {/* State quick-edit */}
//       <Modal
//         open={showStateEdit}
//         onClose={() => { setShowStateEdit(false); setStateEditId(null); setStateValue(""); }}
//         title="Update State"
//       >
//         <div className="space-y-3">
//           <p className="text-sm text-slate-600">Update the lead's state (timezone auto-detected server-side).</p>
//           <TextField label="State" value={stateValue} onChange={setStateValue} placeholder="e.g., California" />
//           <div className="flex justify-end gap-2">
//             <Ghost onClick={() => { setShowStateEdit(false); setStateEditId(null); setStateValue(""); }}>Cancel</Ghost>
//             <Primary onClick={updateState}><CheckCircle2 className="h-4 w-4" /> Update</Primary>
//           </div>
//         </div>
//       </Modal>

//       {/* Delete confirm */}
//       <Modal
//         open={showDelete}
//         onClose={() => { setShowDelete(false); setPendingDeleteIds([]); }}
//         title="Delete Lead(s)?"
//       >
//         <div className="flex items-start gap-3">
//           <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
//             <ShieldAlert className="h-5 w-5" />
//           </div>
//           <div>
//             <p className="text-slate-700">
//               This will permanently remove <span className="font-semibold">{pendingDeleteIds.length} lead(s)</span>. This action cannot be undone.
//             </p>
//             <div className="mt-4 flex justify-end gap-2">
//               <Ghost onClick={() => { setShowDelete(false); setPendingDeleteIds([]); }}>Cancel</Ghost>
//               <Danger onClick={async () => { await deleteLeads(pendingDeleteIds); setShowDelete(false); setPendingDeleteIds([]); }}>
//                 <Trash2 className="h-4 w-4" /> Delete
//               </Danger>
//             </div>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );

//   function handleSort(col, nextDir) {
//     setSort(col, nextDir);
//   }

//   function setSort(col, dir) {
//     setSortBy(col);
//     setSortDir(dir);
//     setPage(1);
//   }
// };

// /** ---------------------------------------------------------
//  * Reusable UI
//  * --------------------------------------------------------- */

// function TH({ label, width, align = "left", onResizeStart, children }) {
//   return (
//     <th
//       scope="col"
//       style={{ width, minWidth: width }}
//       className={cx(
//         "sticky top-0 border-b border-slate-200 px-3 py-3 text-slate-700",
//         align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
//       )}
//     >
//       <div className="relative flex items-center">
//         <span className="truncate">{children ?? label}</span>
//         {/* Resize handle */}
//         <span
//           onMouseDown={(e) => onResizeStart?.(e.clientX, width)}
//           className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none"
//           title="Drag to resize column"
//         />
//       </div>
//     </th>
//   );
// }

// function SortableTH({ label, width, active, dir, onSort, align = "left", onResizeStart }) {
//   const next = active && dir === "asc" ? "desc" : "asc";
//   return (
//     <TH label={label} width={width} align={align} onResizeStart={onResizeStart}>
//       <button
//         onClick={() => onSort(next)}
//         className="group inline-flex items-center gap-1.5"
//         title={`Sort by ${label}`}
//       >
//         <span className="truncate">{label}</span>
//         <ArrowUpDown
//           className={cx(
//             "h-4 w-4 transition",
//             active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
//           )}
//         />
//         {active && <span className="text-[10px] text-slate-500 uppercase">{dir}</span>}
//       </button>
//     </TH>
//   );
// }

// function TD({ children, width, align = "left", mono = false }) {
//   return (
//     <td
//       style={{ width, minWidth: width, maxWidth: width }}
//       className={cx(
//         "px-3 py-3 align-middle",
//         "whitespace-nowrap",
//         align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left",
//         mono && "font-mono"
//       )}
//     >
//       {typeof children === "string" ? <span className="truncate block">{children}</span> : children}
//     </td>
//   );
// }

// function CardGlass({ children }) {
//   return (
//     <div className="relative">
//       <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-20 blur-lg" />
//       <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-xl">
//         {children}
//       </div>
//     </div>
//   );
// }

// function HeaderIcon({ title }) {
//   return (
//     <div className="mb-4 flex items-center gap-3">
//       <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg">
//         <Edit3 className="h-5 w-5" />
//       </div>
//       <div>
//         <h3 className="text-lg font-bold text-slate-900">{title}</h3>
//         <p className="text-sm text-slate-600">Edit all fields easily.</p>
//       </div>
//     </div>
//   );
// }

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
//       className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
//     >
//       {icon} <span>{label}</span>
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
//           className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
//         >
//           <div className="mb-3 flex items-center justify-between">
//             {title ? <h3 className="text-lg font-bold text-slate-900">{title}</h3> : <div />}
//             <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">
//               <X className="h-4 w-4 text-slate-500" />
//             </button>
//           </div>
//           {children}
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// function Ghost({ children, onClick }) {
//   return (
//     <button onClick={onClick} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
//       {children}
//     </button>
//   );
// }

// function Primary({ children, onClick, disabled }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow-lg",
//         disabled ? "bg-blue-400" : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
//       )}
//     >
//       {children}
//     </button>
//   );
// }

// function Danger({ children, onClick }) {
//   return (
//     <button onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-rose-700 hover:to-rose-600">
//       {children}
//     </button>
//   );
// }

// function RowSkeleton() {
//   return (
//     <div className="px-4 py-6">
//       <div className="animate-pulse grid grid-cols-7 gap-4">
//         {Array.from({ length: 7 }).map((_, i) => (
//           <div key={i} className="h-6 rounded bg-slate-200" />
//         ))}
//       </div>
//     </div>
//   );
// }

// function CardSkeleton() {
//   return (
//     <>
//       {Array.from({ length: 6 }).map((_, i) => (
//         <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="h-5 w-1/2 rounded bg-slate-200" />
//           <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
//           <div className="mt-4 h-4 w-full rounded bg-slate-200" />
//           <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
//           <div className="mt-6 flex gap-2">
//             <div className="h-8 w-20 rounded bg-slate-200" />
//             <div className="h-8 w-20 rounded bg-slate-200" />
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-16">
//       <div className="text-5xl">👤</div>
//       <div className="text-lg font-semibold text-slate-800">No leads found</div>
//       <div className="text-slate-600">Try adjusting filters or add a new lead.</div>
//     </div>
//   );
// }

// function TextField({ label, value, onChange, type = "text", placeholder = "" }) {
//   return (
//     <label className="block">
//       <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500"
//       />
//     </label>
//   );
// }

// function Pagination({ page, totalPages, onPrev, onNext, className }) {
//   return (
//     <div className={cx("mt-3 flex items-center justify-between text-sm text-slate-600 px-2", className)}>
//       <div>
//         Page <span className="font-semibold">{page}</span> of{" "}
//         <span className="font-semibold">{totalPages}</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <button
//           onClick={onPrev}
//           disabled={page <= 1}
//           className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//         >
//           <ChevronLeft className="h-4 w-4" /> Prev
//         </button>
//         <button
//           onClick={onNext}
//           disabled={page >= totalPages}
//           className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//         >
//           Next <ChevronRight className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// function StateBadge({ value }) {
//   if (!value) return <span className="text-sm text-slate-500">—</span>;
//   return (
//     <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
//       {value}
//     </span>
//   );
// }

// function Line({ label, value }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className="w-24 shrink-0 text-xs text-slate-500">{label}</span>
//       <span className="text-sm text-slate-800">{value}</span>
//     </div>
//   );
// }

// /** ---------------------------------------------------------
//  * utils
//  * --------------------------------------------------------- */
// function clamp(n, min, max) {
//   return Math.max(min, Math.min(max, n));
// }
// function formatDate(d) {
//   try {
//     const dt = new Date(d);
//     if (isNaN(dt.getTime())) return String(d || "");
//     return dt.toLocaleString();
//   } catch {
//     return String(d || "");
//   }
// }
// function safeCSV(v) {
//   if (v === undefined || v === null) return "";
//   const s = String(v);
//   if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
//   return s;
// }

// export default LeadDashboard;

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Phone,
  Edit3,
  Search,
  X,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

/** ---------------------------------------------------------
 * Config
 * --------------------------------------------------------- */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

/** Utility: classnames */
function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

/** Debounce for search */
function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Viewport helper (tracks width + height) */
function useViewport() {
  const isBrowser = typeof window !== "undefined";
  const [size, setSize] = useState({
    width: isBrowser ? window.innerWidth : 1024,
    height: isBrowser ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (!isBrowser) return;
    const onResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isBrowser]);

  // mobile 100vh fix via CSS var
  useEffect(() => {
    if (!isBrowser) return;
    document.documentElement.style.setProperty("--vh", `${size.height * 0.01}px`);
  }, [isBrowser, size.height]);

  return {
    width: size.width,
    height: size.height,
    isMdUp: size.width >= 768,
    isShortH: size.height < 700, // force 1-col when height is short
    isTinyH: size.height < 540,  // more compact card
  };
}

/** ---------------------------------------------------------
 * Main Component (Cards-only)
 * --------------------------------------------------------- */
const LeadDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // file_id
  const { isMdUp, isShortH, isTinyH, height } = useViewport();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters / search / sorting / paging
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [filterState, setFilterState] = useState("");
  const [sortBy, setSortBy] = useState("add_date"); // id | name | email | mobile | state | add_date
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selected, setSelected] = useState(new Set());

  // create/edit/delete modals
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

  const [showStateEdit, setShowStateEdit] = useState(false);
  const [stateEditId, setStateEditId] = useState(null);
  const [stateValue, setStateValue] = useState("");

  const fileIdNum = Number(id);
  const token = useRef(localStorage.getItem("token") || null);

  // forms
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    salesforce_id: "",
    custom0: "",
    custom1: "",
    add_date: new Date().toISOString(),
  });

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    salesforce_id: "",
    custom0: "",
    custom1: "",
    add_date: "",
  });

  // Load leads
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchLeads() {
    const t = token.current;
    if (!t) {
      console.error("No auth token found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/leads${fileIdNum ? `?file_id=${fileIdNum}` : ""}`,
        { headers: { Authorization: `Bearer ${t}` } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
      setSelected(new Set()); // clear selection on reload
    } catch (e) {
      console.error(e);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  // Unique states for filtering dropdown
  const availableStates = useMemo(() => {
    const s = new Set();
    leads.forEach((l) => l?.state && s.add(l.state));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [leads]);

  // Filtering + search
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const list = leads.filter((l) => {
      if (filterState && (l.state || "") !== filterState) return false;
      if (!q) return true;
      const vals = [
        l.first_name,
        l.last_name,
        l.email,
        l.mobile,
        l.salesforce_id,
        l?.other_data?.Custom_0,
        l?.other_data?.Custom_1,
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      return vals.some((x) => x.includes(q));
    });
    return list;
  }, [leads, debouncedQuery, filterState]);

  // Sorting (still needed for cards)
  const sorted = useMemo(() => {
    const copy = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      const nameA = `${a.first_name || ""} ${a.last_name || ""}`.trim();
      const nameB = `${b.first_name || ""} ${b.last_name || ""}`.trim();
      let va, vb;
      switch (sortBy) {
        case "id":
          va = a.id ?? 0;
          vb = b.id ?? 0;
          break;
        case "name":
          va = nameA.toLowerCase();
          vb = nameB.toLowerCase();
          break;
        case "email":
          va = (a.email || "").toLowerCase();
          vb = (b.email || "").toLowerCase();
          break;
        case "mobile":
          va = (a.mobile || "").toLowerCase();
          vb = (b.mobile || "").toLowerCase();
          break;
        case "state":
          va = (a.state || "").toLowerCase();
          vb = (b.state || "").toLowerCase();
          break;
        case "add_date":
        default:
          va = new Date(a.add_date || 0).getTime();
          vb = new Date(b.add_date || 0).getTime();
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  // Pagination
  const totalLeads = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = sorted.slice(start, end);

  const lastLead = leads[leads.length - 1] || null;

  // Selection
  function onToggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function onSelectAllFiltered() {
    setSelected(new Set(sorted.map((l) => l.id)));
  }
  function onClearSelection() {
    setSelected(new Set());
  }

  // CREATE
  async function createLead() {
    const t = token.current;
    if (!t) return toast.info("Missing token");
    if (!form.first_name || !form.last_name || !form.email || !form.mobile) {
      return toast.info("Please fill first, last, email and mobile.");
    }
    setCreating(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        add_date: form.add_date,
        mobile: form.mobile.trim(),
        file_id: fileIdNum || null,
        salesforce_id: form.salesforce_id.trim(),
        other_data: {
          Custom_0: form.custom0 || "",
          Custom_1: form.custom1 || "",
        },
      };
      const res = await fetch(`${API_URL}/api/add_manually_lead`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      toast.success("Lead added");
      setShowCreate(false);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        salesforce_id: "",
        custom0: "",
        custom1: "",
        add_date: new Date().toISOString(),
      });
      fetchLeads();
    } catch (e) {
      console.error(e);
      toast.error("Failed to add lead");
    } finally {
      setCreating(false);
    }
  }

  // EDIT
  function openEdit(lead) {
    setEditId(lead.id);
    setEditForm({
      first_name: lead.first_name || "",
      last_name: lead.last_name || "",
      email: lead.email || "",
      mobile: lead.mobile || "",
      salesforce_id: lead.salesforce_id || "",
      custom0: lead?.other_data?.Custom_0 || "",
      custom1: lead?.other_data?.Custom_1 || "",
      add_date: lead.add_date || new Date().toISOString(),
    });
    setShowEdit(true);
  }

  async function saveEdit() {
    const t = token.current;
    if (!t) return toast.info("Missing token");
    if (!editId) return;

    setEditing(true);
    try {
      const payload = {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim(),
        mobile: editForm.mobile.trim(),
        salesforce_id: editForm.salesforce_id.trim(),
        add_date: editForm.add_date,
        other_data: {
          Custom_0: editForm.custom0 || "",
          Custom_1: editForm.custom1 || "",
        },
      };

      const res = await fetch(`${API_URL}/api/leads/${editId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.detail || `HTTP ${res.status}`);
      }

      toast.success(json?.detail || "Lead updated");
      setShowEdit(false);
      setEditId(null);
      fetchLeads();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Update failed");
    } finally {
      setEditing(false);
    }
  }

  // DELETE
  async function deleteLeads(ids) {
    const t = token.current;
    if (!t) return toast.info("Missing token");
    if (!ids?.length) return;

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      toast.success("Lead(s) deleted");
      setSelected(new Set());
      fetchLeads();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  }

  // STATE quick edit
  async function updateState() {
    const t = token.current;
    if (!t) return toast.info("Missing token");
    if (!stateEditId) return;
    try {
      const res = await fetch(`${API_URL}/api/update-lead-state/${stateEditId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: stateValue || "" }),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        toast.error(json?.detail || "Update failed");
      } else {
        toast.success(json?.detail || "Lead updated");
        fetchLeads();
      }
      setShowStateEdit(false);
      setStateEditId(null);
      setStateValue("");
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  }

  function openStateEditor(lead) {
    setStateEditId(lead.id);
    setStateValue(lead.state || "");
    setShowStateEdit(true);
  }

  function callLead(mobile) {
    if (!mobile) return toast.info("No mobile number");
    window.location.href = `tel:${mobile}`;
  }

  // Export CSV (filtered set)
  function exportCSV() {
    if (sorted.length === 0) return toast.info("Nothing to export.");
    const headers = [
      "id",
      "first_name",
      "last_name",
      "email",
      "mobile",
      "salesforce_id",
      "state",
      "Custom_0",
      "Custom_1",
      "add_date",
    ];
    const rows = sorted.map((l) => [
      l.id ?? "",
      safeCSV(l.first_name),
      safeCSV(l.last_name),
      safeCSV(l.email),
      safeCSV(l.mobile),
      safeCSV(l.salesforce_id),
      safeCSV(l.state),
      safeCSV(l?.other_data?.Custom_0),
      safeCSV(l?.other_data?.Custom_1),
      safeCSV(l.add_date),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const pageSelectedCount = pageItems.filter((l) => selected.has(l.id)).length;

  /** ---------------------------------------------
   * Cards-only Render
   * --------------------------------------------- */
  // 2 columns on desktop (md+), but if height is short -> 1 column
  const gridCols = isShortH ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";
  const cardPad = isTinyH ? "p-3" : "p-4";
  const cardTitle = isTinyH ? "text-sm" : "text-base";
  const cardSub = "text-xs";
  // cap card max height on short/tiny viewports, allow inner scrolling
  const maxCardH =
    isTinyH ? Math.max(220, Math.floor(height - 220)) :
    isShortH ? Math.max(260, Math.floor(height - 260)) :
    undefined;

  return (
    <div className="min-h-screen w-full bg-slate-50 touch-pan-y">
      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-100/70 via-sky-50 to-transparent -z-10" />

      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Leads</h1>
            <p className="text-slate-600">
              File: <span className="font-medium">{fileIdNum || "—"}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
            >
              <Plus className="h-4 w-4" /> New Lead
            </button>
            <button
              onClick={() => navigate("/user/upload-csv")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              Upload CSV
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <StatCard label="Total Leads" value={totalLeads} />
          <StatCard
            label="Last Created"
            value={
              lastLead
                ? `${lastLead.first_name || ""} ${lastLead.last_name || ""}`.trim() || "—"
                : "—"
            }
            sub={
              lastLead?.add_date
                ? formatDate(lastLead.add_date)
                : lastLead
                ? "Just now"
                : "No leads yet"
            }
          />
          <StatCard
            label="Selected"
            value={selected.size}
            sub={selected.size > 0 ? "Ready for bulk actions" : "Nothing selected"}
          />
        </div>

        {/* Toolbar */}
        <div className="sticky top-2 sm:top-0 z-20 mb-4 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, email, mobile, Salesforce ID..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 outline-none"
                />
              </div>

              {/* State filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filterState}
                  onChange={(e) => {
                    setFilterState(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:border-blue-500 outline-none"
                >
                  <option value="">All states</option>
                  {availableStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Page size */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:border-blue-500 outline-none"
                title="Cards per page"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>

              {/* Export / Refresh */}
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={() => fetchLeads()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick selection bar */}
          {selected.size > 0 && (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2">
              <div className="text-sm text-slate-700">
                <span className="font-semibold">{selected.size}</span> selected
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setPendingDeleteIds(Array.from(selected));
                    setShowDelete(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-3 py-2 text-sm font-semibold text-white shadow hover:from-rose-700 hover:to-rose-600"
                >
                  <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Bulk Delete</span>
                </button>
                <button
                  onClick={onSelectAllFiltered}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Select all filtered
                </button>
                <button
                  onClick={onClearSelection}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cards Grid (only view) */}
        <div className="mb-3">
          <div className={cx("grid gap-4", gridCols)}>
            <AnimatePresence initial={false}>
              {loading ? (
                <CardSkeleton />
              ) : pageItems.length === 0 ? (
                <EmptyState />
              ) : (
                pageItems.map((l) => {
                  const name = `${l.first_name || ""} ${l.last_name || ""}`.trim();
                  const c0 = l?.other_data?.Custom_0 || "";
                  const c1 = l?.other_data?.Custom_1 || "";
                  const checked = selected.has(l.id);

                  return (
                    <motion.div
                      key={`card-${l.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className={cx(
                        "rounded-2xl border shadow-sm bg-white",
                        checked ? "border-blue-400 ring-1 ring-blue-200" : "border-slate-200"
                      )}
                      style={
                        maxCardH
                          ? { maxHeight: maxCardH, display: "flex", flexDirection: "column" }
                          : { display: "flex", flexDirection: "column" }
                      }
                    >
                      {/* Card header */}
                      <div className={cx("flex items-start justify-between gap-3", cardPad)}>
                        <div>
                          <div className={cx(cardTitle, "font-semibold text-slate-900")}>
                            {name || "—"}
                          </div>
                          <div className={cx(cardSub, "text-slate-500")}>
                            #{l.id} &middot; {l.salesforce_id || "No SFDC ID"}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(l.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          title="Select"
                        />
                      </div>

                      {/* Card body (scrollable when short height) */}
                      <div
                        className={cx("space-y-2 text-sm", cardPad)}
                        style={maxCardH ? { overflowY: "auto" } : undefined}
                      >
                        <Line label="Email" value={l.email || "—"} />
                        <Line label="Mobile" value={l.mobile || "—"} />
                        <Line label="State" value={<StateBadge value={l.state} />} />
                        <Line
                          label="Custom_0"
                          value={<span className="break-all">{c0 || "—"}</span>}
                        />
                        <Line
                          label="Custom_1"
                          value={<span className="break-all">{c1 || "—"}</span>}
                        />
                        <Line label="Added" value={formatDate(l.add_date) || "—"} />
                      </div>

                      {/* Card actions */}
                      <div className={cx("flex flex-wrap items-center gap-2", cardPad, "pt-2")}>
                        <RowButton
                          onClick={() => callLead(l.mobile)}
                          icon={<Phone className="h-4 w-4" />}
                          label="Call"
                        />
                        <RowButton
                          onClick={() => openEdit(l)}
                          icon={<Edit3 className="h-4 w-4" />}
                          label="Edit"
                        />
                        <RowButton
                          onClick={() => openStateEditor(l)}
                          icon={<Edit3 className="h-4 w-4" />}
                          label="State"
                        />
                        <RowDanger
                          onClick={() => {
                            setPendingDeleteIds([l.id]);
                            setShowDelete(true);
                          }}
                          icon={<Trash2 className="h-4 w-4" />}
                          label="Delete"
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          <Pagination
            className="mt-4"
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>

      {/* Create Lead modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="">
        <CardGlass>
          <HeaderIcon title="Create Lead" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="First name"
              value={form.first_name}
              onChange={(v) => setForm((s) => ({ ...s, first_name: v }))}
            />
            <TextField
              label="Last name"
              value={form.last_name}
              onChange={(v) => setForm((s) => ({ ...s, last_name: v }))}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((s) => ({ ...s, email: v }))}
            />
            <TextField
              label="Mobile (digits only)"
              value={form.mobile}
              onChange={(v) => setForm((s) => ({ ...s, mobile: v }))}
            />
            <TextField
              label="Salesforce ID"
              value={form.salesforce_id}
              onChange={(v) => setForm((s) => ({ ...s, salesforce_id: v }))}
            />
            <TextField
              label="Add date (ISO)"
              value={form.add_date}
              onChange={(v) => setForm((s) => ({ ...s, add_date: v }))}
              placeholder="2025-08-13T10:00:00.000Z"
            />
            <TextField
              label="Custom_0"
              value={form.custom0}
              onChange={(v) => setForm((s) => ({ ...s, custom0: v }))}
            />
            <TextField
              label="Custom_1"
              value={form.custom1}
              onChange={(v) => setForm((s) => ({ ...s, custom1: v }))}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Ghost onClick={() => setShowCreate(false)}>Cancel</Ghost>
            <Primary onClick={createLead} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Create
                </>
              )}
            </Primary>
          </div>
        </CardGlass>
      </Modal>

      {/* Edit Lead modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="">
        <CardGlass>
          <HeaderIcon title="Edit Lead" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="First name"
              value={editForm.first_name}
              onChange={(v) => setEditForm((s) => ({ ...s, first_name: v }))}
            />
            <TextField
              label="Last name"
              value={editForm.last_name}
              onChange={(v) => setEditForm((s) => ({ ...s, last_name: v }))}
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(v) => setEditForm((s) => ({ ...s, email: v }))}
            />
            <TextField
              label="Mobile (digits only)"
              value={editForm.mobile}
              onChange={(v) => setEditForm((s) => ({ ...s, mobile: v }))}
            />
            <TextField
              label="Salesforce ID"
              value={editForm.salesforce_id}
              onChange={(v) => setEditForm((s) => ({ ...s, salesforce_id: v }))}
            />
            <TextField
              label="Add date (ISO)"
              value={editForm.add_date}
              onChange={(v) => setEditForm((s) => ({ ...s, add_date: v }))}
            />
            <TextField
              label="Custom_0"
              value={editForm.custom0}
              onChange={(v) => setEditForm((s) => ({ ...s, custom0: v }))}
            />
            <TextField
              label="Custom_1"
              value={editForm.custom1}
              onChange={(v) => setEditForm((s) => ({ ...s, custom1: v }))}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Ghost onClick={() => setShowEdit(false)}>Cancel</Ghost>
            <Primary onClick={saveEdit} disabled={editing}>
              {editing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Save
                </>
              )}
            </Primary>
          </div>
        </CardGlass>
      </Modal>

      {/* State quick-edit */}
      <Modal
        open={showStateEdit}
        onClose={() => {
          setShowStateEdit(false);
          setStateEditId(null);
          setStateValue("");
        }}
        title="Update State"
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Update the lead's state (timezone auto-detected server-side).
          </p>
          <TextField
            label="State"
            value={stateValue}
            onChange={setStateValue}
            placeholder="e.g., California"
          />
          <div className="flex justify-end gap-2">
            <Ghost
              onClick={() => {
                setShowStateEdit(false);
                setStateEditId(null);
                setStateValue("");
              }}
            >
              Cancel
            </Ghost>
            <Primary onClick={updateState}>
              <CheckCircle2 className="h-4 w-4" /> Update
            </Primary>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setPendingDeleteIds([]);
        }}
        title="Delete Lead(s)?"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-slate-700">
              This will permanently remove{" "}
              <span className="font-semibold">{pendingDeleteIds.length} lead(s)</span>. This action
              cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Ghost
                onClick={() => {
                  setShowDelete(false);
                  setPendingDeleteIds([]);
                }}
              >
                Cancel
              </Ghost>
              <Danger
                onClick={async () => {
                  await deleteLeads(pendingDeleteIds);
                  setShowDelete(false);
                  setPendingDeleteIds([]);
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Danger>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );

  function setSort(col, dir) {
    setSortBy(col);
    setSortDir(dir);
    setPage(1);
  }
};

/** ---------------------------------------------------------
 * Reusable UI
 * --------------------------------------------------------- */

function CardGlass({ children }) {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-20 blur-lg" />
      <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-xl">
        {children}
      </div>
    </div>
  );
}

function HeaderIcon({ title }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg">
        <Edit3 className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">Edit all fields easily.</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ translateY: -3 }}
      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
    >
      <div className="text-sm font-semibold text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-sm text-slate-500 mt-1">{sub}</div>}
    </motion.div>
  );
}

function RowButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      title={label}
    >
      {icon} <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function RowDanger({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
      title={label}
    >
      {icon} <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[min(42rem,calc(100vw-2rem))] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            {title ? <h3 className="text-lg font-bold text-slate-900">{title}</h3> : <div />}
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Ghost({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function Primary({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow-lg",
        disabled
          ? "bg-blue-400"
          : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
      )}
    >
      {children}
    </button>
  );
}

function Danger({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 font-semibold text-white shadow-lg hover:from-rose-700 hover:to-rose-600"
    >
      {children}
    </button>
  );
}

function CardSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="h-5 w-1/2 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full rounded bg-slate-200" />
          <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
          <div className="mt-6 flex gap-2">
            <div className="h-8 w-20 rounded bg-slate-200" />
            <div className="h-8 w-20 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="text-5xl">👤</div>
      <div className="text-lg font-semibold text-slate-800">No leads found</div>
      <div className="text-slate-600">Try adjusting filters or add a new lead.</div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Pagination({ page, totalPages, onPrev, onNext, className }) {
  return (
    <div
      className={cx(
        "mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600 px-2",
        className
      )}
    >
      <div className="text-center sm:text-left">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Prev</span>
        </button>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StateBadge({ value }) {
  if (!value) return <span className="text-sm text-slate-500">—</span>;
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {value}
    </span>
  );
}

function Line({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs text-slate-500">{label}</span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}

/** ---------------------------------------------------------
 * utils
 * --------------------------------------------------------- */
function formatDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d || "");
    return dt.toLocaleString();
  } catch {
    return String(d || "");
  }
}
function safeCSV(v) {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default LeadDashboard;
