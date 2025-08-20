// // src/pages/user/Campain.jsx
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Plus, Calendar, Clock, Globe2, Trash2, Edit, X, User, ListChecks,
//   Check, Phone, Mail, RefreshCw, ChevronLeft, ChevronRight
// } from "lucide-react";

// /* ---------------------------------------------
//    Config
// ---------------------------------------------- */
// const API_URL = import.meta?.env?.VITE_API_URL || "http://localhost:8000";

// // Backend paths based on your pasted router:
// // - Files (lists):   GET   /api/leads/files
// // - Leads:           GET   /api/leads?file_id=ID
// // - Add lead:        POST  /api/leads/add_manually_lead
// // - Create list:     POST  /api/leads/create-list
// //
// // Campaign endpoints are not shown in your snippet. We'll try these first:
// // - List campaigns:  GET   /api/campaigns
// // - Create:          POST  /api/campaigns
// // - Update:          PUT   /api/campaigns/:id
// // - Delete:          DELETE /api/campaigns/:id
// // - Toggle:          POST  /api/campaigns/:id/toggle
// // If missing, we transparently fall back to localStorage so the page still works end-to-end.

// const R = {
//   LIST_FILES: `${API_URL}/api/leads/files`,
//   LEADS:      `${API_URL}/api/leads`,
//   ADD_LEAD:   `${API_URL}/api/leads/add_manually_lead`,
//   CREATE_LIST:`${API_URL}/api/leads/create-list`,

//   CAMPAIGNS:  `${API_URL}/api/campaigns`, // assumed
//   CAMPAIGN:   (id) => `${API_URL}/api/campaigns/${id}`,
//   TOGGLE:     (id) => `${API_URL}/api/campaigns/${id}/toggle`,
// };

// // Optionally forward auth:
// const authHeader = () => {
//   const token = localStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// /* ---------------------------------------------
//    Utilities
// ---------------------------------------------- */
// const neon = {
//   card: "shadow-[0_0_15px_rgba(59,130,246,0.25)]",
//   ring: "focus:ring-2 focus:ring-blue-500/30 focus:outline-none",
//   glowBorder: "border border-blue-100/50",
//   header: "bg-gradient-to-r from-white to-blue-50",
// };

// const tzOptions = [
//   { value: "UTC", label: "UTC" },
//   { value: "Etc/GMT+12", label: "Etc/GMT+12" },
//   { value: "Etc/GMT+11", label: "Etc/GMT+11" },
//   { value: "Etc/GMT+10", label: "Etc/GMT+10" },
//   { value: "Etc/GMT+9", label: "Etc/GMT+9" },
//   { value: "Etc/GMT+8", label: "Etc/GMT+8" },
//   { value: "Etc/GMT+7", label: "Etc/GMT+7" },
//   { value: "Etc/GMT+6", label: "Etc/GMT+6" },
//   { value: "Etc/GMT+5", label: "Etc/GMT+5" },
//   { value: "Etc/GMT+4", label: "Etc/GMT+4" },
//   { value: "Etc/GMT+3", label: "Etc/GMT+3" },
//   { value: "Etc/GMT+2", label: "Etc/GMT+2" },
//   { value: "Etc/GMT+1", label: "Etc/GMT+1" },
//   { value: "Etc/GMT-1", label: "Etc/GMT-1" },
//   { value: "Etc/GMT-2", label: "Etc/GMT-2" },
//   { value: "Etc/GMT-3", label: "Etc/GMT-3" },
//   { value: "Etc/GMT-4", label: "Etc/GMT-4" },
//   { value: "Etc/GMT-5", label: "Etc/GMT-5" },
//   { value: "Etc/GMT-6", label: "Etc/GMT-6" },
//   { value: "Etc/GMT-7", label: "Etc/GMT-7" },
//   { value: "Etc/GMT-8", label: "Etc/GMT-8" },
//   { value: "Etc/GMT-9", label: "Etc/GMT-9" },
//   { value: "Etc/GMT-10", label: "Etc/GMT-10" },
//   { value: "Etc/GMT-11", label: "Etc/GMT-11" },
//   { value: "Etc/GMT-12", label: "Etc/GMT-12" },
//   { value: "America/New_York", label: "America/New_York" },
//   { value: "America/Chicago", label: "America/Chicago" },
//   { value: "America/Denver", label: "America/Denver" },
//   { value: "America/Los_Angeles", label: "America/Los_Angeles" },
//   { value: "America/Phoenix", label: "America/Phoenix" },
//   { value: "America/Toronto", label: "America/Toronto" },
//   { value: "America/Vancouver", label: "America/Vancouver" },
//   { value: "America/Sao_Paulo", label: "America/Sao_Paulo" },
//   { value: "America/Buenos_Aires", label: "America/Buenos_Aires" },
//   { value: "America/Mexico_City", label: "America/Mexico_City" },
//   { value: "America/Bogota", label: "America/Bogota" },
//   { value: "America/Lima", label: "America/Lima" },
//   { value: "Europe/London", label: "Europe/London" },
//   { value: "Europe/Berlin", label: "Europe/Berlin" },
//   { value: "Europe/Paris", label: "Europe/Paris" },
//   { value: "Europe/Madrid", label: "Europe/Madrid" },
//   { value: "Europe/Rome", label: "Europe/Rome" },
//   { value: "Europe/Moscow", label: "Europe/Moscow" },
//   { value: "Europe/Istanbul", label: "Europe/Istanbul" },
//   { value: "Europe/Amsterdam", label: "Europe/Amsterdam" },
//   { value: "Europe/Stockholm", label: "Europe/Stockholm" },
//   { value: "Africa/Cairo", label: "Africa/Cairo" },
//   { value: "Africa/Johannesburg", label: "Africa/Johannesburg" },
//   { value: "Africa/Lagos", label: "Africa/Lagos" },
//   { value: "Africa/Accra", label: "Africa/Accra" },
//   { value: "Asia/Tokyo", label: "Asia/Tokyo" },
//   { value: "Asia/Seoul", label: "Asia/Seoul" },
//   { value: "Asia/Shanghai", label: "Asia/Shanghai" },
//   { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong" },
//   { value: "Asia/Singapore", label: "Asia/Singapore" },
//   { value: "Asia/Kolkata", label: "Asia/Kolkata" },
//   { value: "Asia/Dhaka", label: "Asia/Dhaka" },
//   { value: "Asia/Bangkok", label: "Asia/Bangkok" },
//   { value: "Asia/Tehran", label: "Asia/Tehran" },
//   { value: "Asia/Riyadh", label: "Asia/Riyadh" },
//   { value: "Asia/Jerusalem", label: "Asia/Jerusalem" },
//   { value: "Asia/Karachi", label: "Asia/Karachi" },
//   { value: "Australia/Sydney", label: "Australia/Sydney" },
//   { value: "Australia/Melbourne", label: "Australia/Melbourne" },
//   { value: "Australia/Adelaide", label: "Australia/Adelaide" },
//   { value: "Australia/Perth", label: "Australia/Perth" },
//   { value: "Pacific/Auckland", label: "Pacific/Auckland" },
//   { value: "Pacific/Fiji", label: "Pacific/Fiji" },
//   { value: "Pacific/Honolulu", label: "Pacific/Honolulu" },
//   { value: "Atlantic/Reykjavik", label: "Atlantic/Reykjavik" },
//   { value: "Arctic/Longyearbyen", label: "Arctic/Longyearbyen" },
//   { value: "Antarctica/McMurdo", label: "Antarctica/McMurdo" },
//   { value: "Indian/Maldives", label: "Indian/Maldives" },
//   { value: "Indian/Chagos", label: "Indian/Chagos" },
//   { value: "Indian/Cocos", label: "Indian/Cocos" },
//   { value: "Indian/Kerguelen", label: "Indian/Kerguelen" },
//   { value: "Europe/Lisbon", label: "Europe/Lisbon" },
//   { value: "Europe/Zurich", label: "Europe/Zurich" },
//   { value: "Europe/Vienna", label: "Europe/Vienna" },
//   { value: "Europe/Warsaw", label: "Europe/Warsaw" },
//   { value: "Europe/Bucharest", label: "Europe/Bucharest" },
//   { value: "Europe/Athens", label: "Europe/Athens" },
//   { value: "Asia/Yerevan", label: "Asia/Yerevan" },
//   { value: "Asia/Tbilisi", label: "Asia/Tbilisi" },
//   { value: "Asia/Yekaterinburg", label: "Asia/Yekaterinburg" },
//   { value: "Asia/Vladivostok", label: "Asia/Vladivostok" },
//   { value: "Asia/Yakutsk", label: "Asia/Yakutsk" },
//   { value: "Asia/Ulaanbaatar", label: "Asia/Ulaanbaatar" },
//   { value: "Asia/Urumqi", label: "Asia/Urumqi" },
// ];

// function todayYMD() {
//   return new Date().toISOString().slice(0, 10);
// }

// function toISODate(dateStr) {
//   // "YYYY-MM-DD" -> ISO start of day
//   try {
//     return new Date(dateStr + "T00:00:00").toISOString();
//   } catch {
//     return new Date().toISOString();
//   }
// }

// /* ---------------------------------------------
//    LocalStorage Campaign Fallback
// ---------------------------------------------- */
// const LS_KEY = "campaigns-fallback";

// function lsGetCampaigns() {
//   try {
//     const raw = localStorage.getItem(LS_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }
// function lsSetCampaigns(data) {
//   try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
// }

// /* ---------------------------------------------
//    Minimal UI Helpers
// ---------------------------------------------- */
// const Modal = ({ open, onClose, children, wide }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className={`relative bg-white rounded-2xl p-6 w-[95vw] ${wide ? "max-w-5xl" : "max-w-3xl"} ${neon.glowBorder} ${neon.card}`}>
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 transition"
//           aria-label="Close"
//         >
//           <X className="w-6 h-6" />
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// const Confirm = ({ open, onClose, onConfirm, message }) => (
//   <Modal open={open} onClose={onClose}>
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-blue-900">Confirm Delete</h3>
//       <p className="text-gray-600">{message || "Are you sure?"}</p>
//       <div className="flex justify-end gap-2">
//         <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50" onClick={onClose}>Cancel</button>
//         <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => { onConfirm(); onClose(); }}>Delete</button>
//       </div>
//     </div>
//   </Modal>
// );

// /* ---------------------------------------------
//    Main Component
// ---------------------------------------------- */
// export default function Campain() {
//   // List & lead state
//   const [lists, setLists] = useState([]);
//   const [leads, setLeads] = useState([]);
//   const [selectedListId, setSelectedListId] = useState(null);
//   const [selectedLeadIds, setSelectedLeadIds] = useState([]);

//   // Campaigns
//   const [campaigns, setCampaigns] = useState([]);
//   const [loadingCampaigns, setLoadingCampaigns] = useState(false);

//   // Create/Edit flow
//   const [step, setStep] = useState(0);
//   const [campaignName, setCampaignName] = useState("");
//   const [assistantId, setAssistantId] = useState(""); // input text (since assistant service is unknown)
//   const [retryNonPicking, setRetryNonPicking] = useState(false);
//   const [maxRetries, setMaxRetries] = useState(3);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [callingDays, setCallingDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
//   const [callingHours, setCallingHours] = useState({ start: "09:00", end: "18:00" });
//   const [timezone, setTimezone] = useState("UTC");
//   const [creating, setCreating] = useState(false);
//   const [editingCampaign, setEditingCampaign] = useState(null);

//   // UI modals
//   const [openAddLead, setOpenAddLead] = useState(false);
//   const [openCreateList, setOpenCreateList] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

//   // Notifications (lightweight)
//   const notify = (msg, type = "info") => {
//     console[type === "error" ? "error" : type === "success" ? "log" : "log"]("[notice]", msg);
//   };

//   /* ---------------------------------------------
//      Fetch Lists & Campaigns
//   ---------------------------------------------- */
//   useEffect(() => {
//     fetchLists();
//     fetchCampaigns();
//   }, []);

//   async function fetchLists() {
//     try {
//       const res = await fetch(R.LIST_FILES, { headers: { ...authHeader() } });
//       if (!res.ok) throw new Error("Failed to fetch lists");
//       const data = await res.json();
//       setLists(Array.isArray(data) ? data : []);
//     } catch (e) {
//       notify("Could not load lists from server. Showing empty list.", "error");
//       setLists([]);
//     }
//   }

//   async function fetchLeadsForList(listId) {
//     if (!listId) return;
//     try {
//       const res = await fetch(`${R.LEADS}?file_id=${listId}`, { headers: { ...authHeader() } });
//       if (!res.ok) throw new Error("Failed to fetch leads");
//       const data = await res.json();
//       const normalized = (Array.isArray(data) ? data : []).map((d) => ({
//         id: d.id,
//         name: [d.first_name, d.last_name].filter(Boolean).join(" ") || "Unknown",
//         phone: d.mobile || "",
//         email: d.email || "",
//       }));
//       setLeads(normalized);
//       // default select all when (re)loading in create mode
//       setSelectedLeadIds(normalized.map((l) => l.id));
//     } catch (e) {
//       notify("Could not load leads for that list.", "error");
//       setLeads([]);
//       setSelectedLeadIds([]);
//     }
//   }

//   async function fetchCampaigns() {
//     setLoadingCampaigns(true);
//     try {
//       const res = await fetch(R.CAMPAIGNS, { headers: { ...authHeader() } });
//       if (!res.ok) throw new Error("Server campaigns endpoint missing");
//       const data = await res.json();
//       // Normalize
//       const arr = Array.isArray(data) ? data : [];
//       setCampaigns(arr);
//       lsSetCampaigns(arr); // keep local cache as well
//     } catch (e) {
//       // fallback to localStorage
//       const local = lsGetCampaigns();
//       setCampaigns(local);
//     } finally {
//       setLoadingCampaigns(false);
//     }
//   }

//   /* ---------------------------------------------
//      Campaign CRUD (API-first, LS fallback)
//   ---------------------------------------------- */
//   async function createCampaign(payload) {
//     try {
//       const res = await fetch(R.CAMPAIGNS, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeader() },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error("Create failed");
//       const saved = await res.json();
//       await fetchCampaigns();
//       notify("Campaign created", "success");
//       return saved;
//     } catch {
//       const local = lsGetCampaigns();
//       const id = Math.max(0, ...local.map((c) => c.id || 0)) + 1;
//       const created = { id, is_active: false, created_at: new Date().toISOString(), ...payload };
//       lsSetCampaigns([created, ...local]);
//       setCampaigns([created, ...campaigns]);
//       notify("Campaign created locally (fallback).", "success");
//       return created;
//     }
//   }

//   async function updateCampaign(id, payload) {
//     try {
//       const res = await fetch(R.CAMPAIGN(id), {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...authHeader() },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error("Update failed");
//       await fetchCampaigns();
//       notify("Campaign updated", "success");
//     } catch {
//       const local = lsGetCampaigns().map((c) => (c.id === id ? { ...c, ...payload } : c));
//       lsSetCampaigns(local);
//       setCampaigns(local);
//       notify("Campaign updated locally (fallback).", "success");
//     }
//   }

//   async function deleteCampaign(id) {
//     try {
//       const res = await fetch(R.CAMPAIGN(id), {
//         method: "DELETE",
//         headers: { ...authHeader() },
//       });
//       if (!res.ok) throw new Error("Delete failed");
//       await fetchCampaigns();
//       notify("Campaign deleted", "success");
//     } catch {
//       const local = lsGetCampaigns().filter((c) => c.id !== id);
//       lsSetCampaigns(local);
//       setCampaigns(local);
//       notify("Campaign deleted locally (fallback).", "success");
//     }
//   }

//   async function toggleCampaignStatus(id) {
//     try {
//       const res = await fetch(R.TOGGLE(id), { method: "POST", headers: { ...authHeader() } });
//       if (!res.ok) throw new Error("Toggle failed");
//       await fetchCampaigns();
//     } catch {
//       // LS toggle
//       const local = lsGetCampaigns().map((c) =>
//         c.id === id ? { ...c, is_active: !c.is_active } : c
//       );
//       lsSetCampaigns(local);
//       setCampaigns(local);
//       notify("Status toggled locally (fallback).", "success");
//     }
//   }

//   /* ---------------------------------------------
//      Leads & Lists mutations
//   ---------------------------------------------- */
//   async function addLeadManual(form) {
//     // Backend expects: first_name, last_name, email, add_date, mobile, file_id, salesforce_id?, other_data?
//     const body = {
//       first_name: form.first_name || "",
//       last_name: form.last_name || "",
//       email: form.email || "",
//       add_date: todayYMD(),
//       mobile: form.mobile || "",
//       file_id: selectedListId,
//       salesforce_id: form.salesforce_id || "",
//       other_data: {
//         Custom_0: form.custom1 || "",
//         Custom_1: form.custom2 || "",
//       },
//     };
//     const res = await fetch(R.ADD_LEAD, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", ...authHeader() },
//       body: JSON.stringify(body),
//     });
//     if (!res.ok) throw new Error("Failed to add lead");
//     // refresh leads
//     await fetchLeadsForList(selectedListId);
//     notify("Lead added", "success");
//   }

//   async function createList(name) {
//     const res = await fetch(R.CREATE_LIST, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", ...authHeader() },
//       body: JSON.stringify({ name }),
//     });
//     if (!res.ok) throw new Error("Failed to create list");
//     await fetchLists();
//     notify("List created", "success");
//   }

//   /* ---------------------------------------------
//      Stepper Helpers
//   ---------------------------------------------- */
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   function toggleDay(d) {
//     setCallingDays((prev) =>
//       prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
//     );
//   }
//   function validateHours(s, e) {
//     if (!s || !e) return false;
//     const [sh, sm] = s.split(":").map(Number);
//     const [eh, em] = e.split(":").map(Number);
//     const start = sh * 60 + sm;
//     const end = eh * 60 + em;
//     return end > start;
//   }

//   function resetWizard() {
//     setStep(0);
//     setCampaignName("");
//     setAssistantId("");
//     setSelectedListId(null);
//     setLeads([]);
//     setSelectedLeadIds([]);
//     setRetryNonPicking(false);
//     setMaxRetries(3);
//     setStartDate("");
//     setEndDate("");
//     setCallingDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
//     setCallingHours({ start: "09:00", end: "18:00" });
//     setTimezone("UTC");
//     setEditingCampaign(null);
//   }

//   function goNext() {
//     const today = todayYMD();
//     if (step === 1) {
//       if (!campaignName.trim()) return notify("Enter a campaign name", "error");
//       if (!assistantId.trim()) return notify("Enter an assistant ID/Ref", "error");
//     }
//     if (step === 2) {
//       if (!selectedListId) return notify("Select a list first", "error");
//       // load leads when moving to step 3
//       fetchLeadsForList(selectedListId);
//     }
//     if (step === 3) {
//       if (selectedLeadIds.length === 0) return notify("Select at least one lead", "error");
//     }
//     if (step === 4) {
//       if (!startDate) return notify("Select a start date", "error");
//       if (startDate < today) return notify("Start date cannot be in the past", "error");
//       if (!endDate) return notify("Select an end date", "error");
//       if (endDate <= startDate) return notify("End date must be after start date", "error");
//     }
//     if (step === 5) {
//       if (!validateHours(callingHours.start, callingHours.end)) {
//         return notify("End time must be after start time", "error");
//       }
//     }
//     setStep(step + 1);
//   }
//   function goBack() {
//     setStep(step - 1);
//   }

//   async function onSaveCampaign() {
//     setCreating(true);
//     const payload = {
//       name: campaignName,
//       start_date: toISODate(startDate),
//       end_date: toISODate(endDate),
//       assistant_id: assistantId,
//       list_id: selectedListId,
//       calling_day: callingDays.join(","),
//       calling_hour_start: callingHours.start,
//       calling_hour_end: callingHours.end,
//       timezone,
//       skipped_leads: leads.filter((l) => !selectedLeadIds.includes(l.id)).map((l) => l.id),
//       call_again: retryNonPicking,
//       tries: retryNonPicking ? maxRetries : 0,
//     };
//     try {
//       if (editingCampaign?.id) {
//         await updateCampaign(editingCampaign.id, payload);
//       } else {
//         await createCampaign(payload);
//       }
//       resetWizard();
//     } catch (e) {
//       notify("Failed to save campaign", "error");
//     } finally {
//       setCreating(false);
//     }
//   }

//   /* ---------------------------------------------
//      Derived / memo
//   ---------------------------------------------- */
//   const selectedListObj = useMemo(() => lists.find((l) => l.id === selectedListId), [lists, selectedListId]);
//   const selectedCount = selectedLeadIds.length;
//   const skippedCount = Math.max(0, leads.length - selectedLeadIds.length);

//   /* ---------------------------------------------
//      Render
//   ---------------------------------------------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
//       <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
//         {/* Header */}
//         <div className={`rounded-2xl p-6 sm:p-8 mb-8 ${neon.header} ${neon.card} ${neon.glowBorder}`}>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight">
//               Campaigns
//             </h1>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setOpenCreateList(true)}
//                 className={`px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 ${neon.ring}`}
//               >
//                 Create List
//               </button>
//               <button
//                 onClick={() => setStep(1)}
//                 className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-[0_0_12px_rgba(37,99,235,0.35)] focus:ring-2 focus:ring-blue-400/30"
//               >
//                 <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Create Campaign</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Campaigns table / cards */}
//         <div className={`bg-white rounded-2xl ${neon.glowBorder} ${neon.card} overflow-hidden`}>
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-full divide-y divide-blue-100">
//               <thead className="bg-blue-50/70">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Name</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900">Status</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900">Statistics</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900">Created</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-blue-100">
//                 {loadingCampaigns ? (
//                   <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">Loading campaigns…</td></tr>
//                 ) : campaigns.length === 0 ? (
//                   <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">No campaigns yet.</td></tr>
//                 ) : campaigns.map((c) => (
//                   <tr key={c.id} className="hover:bg-blue-50/40">
//                     <td className="px-6 py-4 text-sm text-blue-900 font-medium">{c.name}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex justify-center">
//                         <button
//                           onClick={() => toggleCampaignStatus(c.id)}
//                           className={`w-12 h-6 rounded-full p-1 transition ${c.is_active ? "bg-blue-600" : "bg-blue-200"}`}
//                           aria-label="Toggle status"
//                         >
//                           <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${c.is_active ? "translate-x-6" : ""}`} />
//                         </button>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <div className="flex items-center justify-center gap-4 text-blue-800">
//                         <div className="flex items-center gap-1">
//                           <Check className="w-4 h-4" /> {c.completed_calls || 0}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Phone className="w-4 h-4" /> {c.queued_calls || 0}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Mail className="w-4 h-4" /> {c.scheduled || 0}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center text-sm text-gray-600">
//                       {new Date(c.created_at || c.start_date || Date.now()).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           className="text-blue-700 hover:text-blue-900"
//                           onClick={() => {
//                             // prefill edit
//                             setEditingCampaign(c);
//                             setCampaignName(c.name || "");
//                             setAssistantId(c.assistant_id || "");
//                             setSelectedListId(c.list_id || null);
//                             setRetryNonPicking(!!c.call_again);
//                             setMaxRetries(c.tries || 0);
//                             setStartDate((c.start_date || "").slice(0,10));
//                             setEndDate((c.end_date || "").slice(0,10));
//                             setCallingDays(c.calling_day ? c.calling_day.split(",") : ["Mon","Tue","Wed","Thu","Fri"]);
//                             setCallingHours({
//                               start: c.calling_hour_start || "09:00",
//                               end: c.calling_hour_end || "18:00"
//                             });
//                             setTimezone(c.timezone || "UTC");
//                             setStep(1);
//                           }}
//                         >
//                           <Edit className="w-4 h-4"/>
//                         </button>
//                         <button
//                           className="text-red-600 hover:text-red-700"
//                           onClick={() => setConfirmDelete({ open: true, id: c.id })}
//                         >
//                           <Trash2 className="w-4 h-4"/>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile cards */}
//           <div className="md:hidden divide-y divide-blue-100">
//             {loadingCampaigns ? (
//               <div className="p-4 text-center text-gray-500">Loading campaigns…</div>
//             ) : campaigns.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">No campaigns yet.</div>
//             ) : campaigns.map((c) => (
//               <div key={c.id} className="p-4">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <div className="text-blue-900 font-semibold">{c.name}</div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(c.created_at || c.start_date || Date.now()).toLocaleDateString()}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => toggleCampaignStatus(c.id)}
//                     className={`w-12 h-6 rounded-full p-1 transition ${c.is_active ? "bg-blue-600" : "bg-blue-200"}`}
//                     aria-label="Toggle status"
//                   >
//                     <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${c.is_active ? "translate-x-6" : ""}`} />
//                   </button>
//                 </div>
//                 <div className="mt-3 flex items-center gap-4 text-blue-800">
//                   <div className="flex items-center gap-1"><Check className="w-4 h-4"/>{c.completed_calls || 0}</div>
//                   <div className="flex items-center gap-1"><Phone className="w-4 h-4"/>{c.queued_calls || 0}</div>
//                   <div className="flex items-center gap-1"><Mail className="w-4 h-4"/>{c.scheduled || 0}</div>
//                 </div>
//                 <div className="mt-3 flex gap-2">
//                   <button
//                     className="px-3 py-1 rounded border border-blue-200 text-blue-700"
//                     onClick={() => {
//                       setEditingCampaign(c);
//                       setCampaignName(c.name || "");
//                       setAssistantId(c.assistant_id || "");
//                       setSelectedListId(c.list_id || null);
//                       setRetryNonPicking(!!c.call_again);
//                       setMaxRetries(c.tries || 0);
//                       setStartDate((c.start_date || "").slice(0,10));
//                       setEndDate((c.end_date || "").slice(0,10));
//                       setCallingDays(c.calling_day ? c.calling_day.split(",") : ["Mon","Tue","Wed","Thu","Fri"]);
//                       setCallingHours({
//                         start: c.calling_hour_start || "09:00",
//                         end: c.calling_hour_end || "18:00"
//                       });
//                       setTimezone(c.timezone || "UTC");
//                       setStep(1);
//                     }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="px-3 py-1 rounded border border-red-200 text-red-600"
//                     onClick={() => setConfirmDelete({ open: true, id: c.id })}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Create/Edit Wizard */}
//         {step >= 1 && step <= 6 && (
//           <Modal open wide onClose={resetWizard}>
//             <div className="space-y-6">
//               {/* Steps indicator */}
//               <div className="flex items-center justify-between">
//                 <div className="text-lg font-semibold text-blue-900">
//                   {editingCampaign ? "Edit Campaign" : "Create Campaign"}
//                 </div>
//                 <div className="text-sm text-gray-500">Step {step} / 6</div>
//               </div>

//               {/* Step content */}
//               {step === 1 && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-blue-900 mb-1">Campaign Name</label>
//                     <input
//                       value={campaignName}
//                       onChange={(e) => setCampaignName(e.target.value)}
//                       placeholder="e.g., Fall Outreach"
//                       className={`w-full rounded-lg px-4 py-2 bg-white ${neon.glowBorder} ${neon.ring}`}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-blue-900 mb-1">Assistant ID / Reference</label>
//                     <input
//                       value={assistantId}
//                       onChange={(e) => setAssistantId(e.target.value)}
//                       placeholder="Enter assistant ID or reference"
//                       className={`w-full rounded-lg px-4 py-2 bg-white ${neon.glowBorder} ${neon.ring}`}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       (Since assistant service isn’t provided, paste the ID/reference of the assistant you want to use.)
//                     </p>
//                   </div>
//                   <div className="flex justify-end">
//                     <button
//                       onClick={goNext}
//                       className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {step === 2 && (
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-semibold text-blue-900">Select a List</h3>
//                     <button
//                       onClick={() => setOpenCreateList(true)}
//                       className="px-3 py-2 rounded border border-blue-200 text-blue-700 hover:bg-blue-50"
//                     >
//                       New List
//                     </button>
//                   </div>
//                   {lists.length === 0 ? (
//                     <div className="text-center text-gray-500 py-8">No lists found.</div>
//                   ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       {lists.map((list) => (
//                         <button
//                           key={list.id}
//                           onClick={() => setSelectedListId(list.id)}
//                           className={`text-left rounded-xl p-4 bg-white hover:bg-blue-50 transition ${neon.glowBorder}
//                                       ${selectedListId === list.id ? "ring-2 ring-blue-500/30" : ""}`}
//                         >
//                           <div className="text-blue-900 font-semibold">{list.name}</div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             Leads: {list.leads_count ?? "-"}
//                           </div>
//                           <div className="text-xs text-gray-400 mt-1">
//                             Created: {list.created_at ? new Date(list.created_at).toLocaleDateString() : "-"}
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <button onClick={goBack} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">
//                       Back
//                     </button>
//                     <button onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {step === 3 && (
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-semibold text-blue-900">Select Leads</h3>
//                     <div className="flex gap-2">
//                       <button
//                         className="px-3 py-2 rounded border border-blue-200 text-blue-700 hover:bg-blue-50"
//                         onClick={() => setOpenAddLead(true)}
//                       >
//                         Add Lead
//                       </button>
//                       <button
//                         className="px-3 py-2 rounded border border-blue-200 text-blue-700 hover:bg-blue-50"
//                         onClick={() => fetchLeadsForList(selectedListId)}
//                         title="Refresh"
//                       >
//                         <RefreshCw className="w-4 h-4"/>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="inline-flex items-center gap-2 text-sm">
//                       <input
//                         type="checkbox"
//                         checked={leads.length > 0 && selectedLeadIds.length === leads.length}
//                         onChange={(e) =>
//                           setSelectedLeadIds(e.target.checked ? leads.map((l) => l.id) : [])
//                         }
//                       />
//                       <span>Select All</span>
//                     </label>
//                     <div className="text-sm text-gray-500">
//                       {selectedListObj?.name ? `List: ${selectedListObj.name}` : ""}
//                     </div>
//                   </div>

//                   <div className="max-h-72 overflow-y-auto rounded-xl bg-white border border-blue-100">
//                     <table className="min-w-full">
//                       <thead className="sticky top-0 bg-blue-50/70">
//                         <tr>
//                           <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">Sel</th>
//                           <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">Name</th>
//                           <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">Phone</th>
//                           <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">Email</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {leads.length === 0 ? (
//                           <tr>
//                             <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No leads.</td>
//                           </tr>
//                         ) : leads.map((lead) => (
//                           <tr key={lead.id} className="odd:bg-white even:bg-blue-50/30">
//                             <td className="px-4 py-2">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedLeadIds.includes(lead.id)}
//                                 onChange={() => setSelectedLeadIds((prev) =>
//                                   prev.includes(lead.id)
//                                     ? prev.filter((id) => id !== lead.id)
//                                     : [...prev, lead.id]
//                                 )}
//                               />
//                             </td>
//                             <td className="px-4 py-2 text-sm">{lead.name}</td>
//                             <td className="px-4 py-2 text-sm">{lead.phone}</td>
//                             <td className="px-4 py-2 text-sm">{lead.email}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="flex justify-between">
//                     <button onClick={goBack} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Back</button>
//                     <button onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Next</button>
//                   </div>
//                 </div>
//               )}

//               {step === 4 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-blue-900">Follow-up Settings</h3>
//                   <label className="flex items-center gap-3 cursor-pointer">
//                     <span className={`w-12 h-6 rounded-full p-1 transition ${retryNonPicking ? "bg-blue-600" : "bg-blue-200"}`}>
//                       <span className={`block bg-white w-4 h-4 rounded-full shadow transform transition ${retryNonPicking ? "translate-x-6" : ""}`} />
//                     </span>
//                     <input
//                       type="checkbox"
//                       checked={retryNonPicking}
//                       onChange={() => setRetryNonPicking(!retryNonPicking)}
//                       className="hidden"
//                     />
//                     <span className="text-sm text-blue-900">Call again for non-picking leads</span>
//                   </label>

//                   {retryNonPicking && (
//                     <div>
//                       <label className="block text-sm font-medium text-blue-900 mb-1">How many tries (per lead)</label>
//                       <input
//                         type="number"
//                         min="1"
//                         value={maxRetries}
//                         onChange={(e) => setMaxRetries(Number(e.target.value))}
//                         className={`w-full rounded-lg px-4 py-2 bg-white ${neon.glowBorder} ${neon.ring}`}
//                       />
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-sm font-medium text-blue-900 mb-1">Start Date</label>
//                     <input
//                       type="date"
//                       value={startDate}
//                       min={todayYMD()}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       className={`w-full rounded-lg px-4 py-2 bg-white ${neon.glowBorder} ${neon.ring}`}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-blue-900 mb-1">End Date</label>
//                     <input
//                       type="date"
//                       value={endDate}
//                       min={startDate || todayYMD()}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       className={`w-full rounded-lg px-4 py-2 bg-white ${neon.glowBorder} ${neon.ring}`}
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <button onClick={goBack} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Back</button>
//                     <button onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Next</button>
//                   </div>
//                 </div>
//               )}

//               {step === 5 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-blue-900">Schedule</h3>
//                   <div>
//                     <div className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
//                       <Calendar className="w-5 h-5" /> Calling Days
//                     </div>
//                     <div className="grid grid-cols-7 gap-2">
//                       {days.map((d) => {
//                         const active = callingDays.includes(d);
//                         return (
//                           <button
//                             key={d}
//                             onClick={() => toggleDay(d)}
//                             className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${active ? "bg-blue-600 text-white" : "bg-white text-blue-700 border border-blue-300"}`}
//                           >
//                             {d}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div>
//                       <div className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
//                         <Clock className="w-5 h-5" /> Calling Hours
//                       </div>
//                       <div className="flex items-center gap-3 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
//                         <div className="flex flex-col">
//                           <span className="text-xs text-gray-600 mb-1">Start</span>
//                           <select
//                             value={callingHours.start}
//                             onChange={(e) => setCallingHours((h) => ({ ...h, start: e.target.value }))}
//                             className={`rounded border border-blue-200 px-3 py-2 bg-white ${neon.ring}`}
//                           >
//                             {[...Array(24)].flatMap((_, h) =>
//                               ["00", "30"].map((m) => {
//                                 const v = `${String(h).padStart(2,"0")}:${m}`;
//                                 return <option key={`s-${v}`} value={v}>{v}</option>;
//                               })
//                             )}
//                           </select>
//                         </div>
//                         <span className="text-blue-700">—</span>
//                         <div className="flex flex-col">
//                           <span className="text-xs text-gray-600 mb-1">End</span>
//                           <select
//                             value={callingHours.end}
//                             onChange={(e) => setCallingHours((h) => ({ ...h, end: e.target.value }))}
//                             className={`rounded border border-blue-200 px-3 py-2 bg-white ${neon.ring}`}
//                           >
//                             {[...Array(24)].flatMap((_, h) =>
//                               ["00", "30"].map((m) => {
//                                 const v = `${String(h).padStart(2,"0")}:${m}`;
//                                 return <option key={`e-${v}`} value={v}>{v}</option>;
//                               })
//                             )}
//                           </select>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <div className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
//                         <Globe2 className="w-5 h-5" /> Timezone
//                       </div>
//                       <select
//                         value={timezone}
//                         onChange={(e) => setTimezone(e.target.value)}
//                         className={`w-full rounded-lg px-3 py-2 bg-white border border-blue-200 ${neon.ring}`}
//                       >
//                         {tzOptions.map((tz) => (
//                           <option key={tz.value} value={tz.value}>{tz.label}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex justify-between">
//                     <button onClick={goBack} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Back</button>
//                     <button onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Next</button>
//                   </div>
//                 </div>
//               )}

//               {step === 6 && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="bg-blue-50/60 rounded-xl p-6 border border-blue-100">
//                       <div className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-2">
//                         <ListChecks className="w-5 h-5" /> Campaign Info
//                       </div>
//                       <div><span className="font-medium">Name:</span> {campaignName || "-"}</div>
//                       <div><span className="font-medium">Assistant:</span> {assistantId || "-"}</div>
//                       <div><span className="font-medium">List:</span> {selectedListObj?.name || "-"}</div>
//                     </div>
//                     <div className="bg-blue-50/60 rounded-xl p-6 border border-blue-100">
//                       <div className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-2">
//                         <User className="w-5 h-5" /> Leads
//                       </div>
//                       <div><span className="font-medium">Selected:</span> {selectedCount}</div>
//                       <div><span className="font-medium">Skipped:</span> {skippedCount}</div>
//                     </div>
//                     <div className="md:col-span-2 bg-blue-50/60 rounded-xl p-6 border border-blue-100">
//                       <div className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-2">
//                         <Calendar className="w-5 h-5" /> Schedule
//                       </div>
//                       <div className="mb-1"><span className="font-medium">Days:</span> {callingDays.join(", ")}</div>
//                       <div className="mb-1">
//                         <span className="font-medium">Hours:</span> <Clock className="inline w-4 h-4 mx-1"/> {callingHours.start} - {callingHours.end}
//                       </div>
//                       <div className="mb-1"><span className="font-medium">Timezone:</span> <Globe2 className="inline w-4 h-4 mx-1"/> {timezone}</div>
//                       <div className="mt-1">
//                         <span className="font-medium">Dates:</span> {startDate} → {endDate}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <button onClick={goBack} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">
//                       Back
//                     </button>
//                     <button
//                       onClick={onSaveCampaign}
//                       disabled={creating || !validateHours(callingHours.start, callingHours.end)}
//                       className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
//                     >
//                       {creating ? (editingCampaign ? "Updating..." : "Creating...") : (editingCampaign ? "Update Campaign" : "Create Campaign")}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </Modal>
//         )}

//         {/* Add Lead Modal */}
//         <Modal open={openAddLead} onClose={() => setOpenAddLead(false)}>
//           <AddLeadForm
//             onCancel={() => setOpenAddLead(false)}
//             onSubmit={async (form) => {
//               try {
//                 await addLeadManual(form);
//                 setOpenAddLead(false);
//               } catch (e) {
//                 notify("Failed to add lead", "error");
//               }
//             }}
//           />
//         </Modal>

//         {/* Create List Modal */}
//         <Modal open={openCreateList} onClose={() => setOpenCreateList(false)}>
//           <CreateListForm
//             onCancel={() => setOpenCreateList(false)}
//             onSubmit={async (name) => {
//               try {
//                 await createList(name);
//                 setOpenCreateList(false);
//               } catch (e) {
//                 notify("Failed to create list", "error");
//               }
//             }}
//           />
//         </Modal>

//         {/* Confirm Delete */}
//         <Confirm
//           open={confirmDelete.open}
//           onClose={() => setConfirmDelete({ open: false, id: null })}
//           onConfirm={() => deleteCampaign(confirmDelete.id)}
//           message="Are you sure you want to delete this campaign? This action cannot be undone."
//         />
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------
//    Sub-Forms
// ---------------------------------------------- */
// function AddLeadForm({ onCancel, onSubmit }) {
//   const [first_name, setFirst] = useState("");
//   const [last_name, setLast] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [salesforce_id, setSf] = useState("");
//   const [custom1, setC1] = useState("");
//   const [custom2, setC2] = useState("");

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-blue-900">Add Lead</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm text-blue-900 mb-1">First Name</label>
//           <input value={first_name} onChange={(e)=>setFirst(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-blue-200"/>
//         </div>
//         <div>
//           <label className="block text-sm text-blue-900 mb-1">Last Name</label>
//           <input value={last_name} onChange={(e)=>setLast(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-blue-200"/>
//         </div>
//         <div>
//           <label className="block text-sm text-blue-900 mb-1">Email</label>
//           <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-blue-200"/>
//         </div>
//         <div>
//           <label className="block text-sm text-blue-900 mb-1">Phone (digits only)</label>
//           <input value={mobile} onChange={(e)=>setMobile(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-blue-200"/>
//         </div>
//         <div>
//           <label className="block text-sm text-blue-900 mb-1">Salesforce ID (optional)</label>
//           <input value={salesforce_id} onChange={(e)=>setSf(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-blue-200"/>
//         </div>
//         <div>
//           <label className="block text-sm text-blue-900 mb-1">Custom 1</label>
//           <input value={custom1} onChange={(e)=>setC1(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-blue-200"/>
//         </div>
//         <div>
//           <label className="block text-sm text-blue-900 mb-1">Custom 2</label>
//           <input value={custom2} onChange={(e)=>setC2(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-blue-200"/>
//         </div>
//       </div>
//       <div className="flex justify-end gap-2">
//         <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Cancel</button>
//         <button
//           onClick={()=>onSubmit({ first_name, last_name, email, mobile, salesforce_id, custom1, custom2 })}
//           className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//         >
//           Save Lead
//         </button>
//       </div>
//     </div>
//   );
// }

// function CreateListForm({ onCancel, onSubmit }) {
//   const [name, setName] = useState("");
//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-blue-900">Create List</h3>
//       <div>
//         <label className="block text-sm text-blue-900 mb-1">List Name</label>
//         <input
//           value={name}
//           onChange={(e)=>setName(e.target.value)}
//           placeholder="e.g., September Leads"
//           className="w-full rounded-lg px-3 py-2 border border-blue-200"
//         />
//       </div>
//       <div className="flex justify-end gap-2">
//         <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Cancel</button>
//         <button
//           onClick={()=> name.trim() && onSubmit(name.trim())}
//           className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
//           disabled={!name.trim()}
//         >
//           Create
//         </button>
//       </div>
//     </div>
//   );
// }


// Campain.jsx
// Campain.jsx (fixed)
// Campain.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus, Clock, Calendar, User, ListChecks, Globe2,
  Trash2, Edit3, Loader2, ChevronRight, X
} from "lucide-react";

/* ============ API CONFIG (MATCHES YOUR Assistants page) ============ */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const BASE = `${API_URL}/api`;
const ENDPOINTS = {
  assistants: `${BASE}/get-assistants`,
  lists: `${BASE}/files`,
  leadsByList: (id) => `${BASE}/leads?file_id=${encodeURIComponent(id)}`,
  addLead: `${BASE}/add_manually_lead`,
  createList: `${BASE}/create-list`,
};

const getAuthHeaders = () => {
  const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* ============ UI THEME ============ */
const neon = {
  card:
    "bg-white/90 backdrop-blur border border-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.15)] rounded-2xl",
  btnPrimary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.45)] hover:shadow-[0_0_22px_rgba(59,130,246,0.65)]",
  btnGhost:
    "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200",
  pillOn:
    "bg-blue-600 text-white border-blue-600",
  pillOff:
    "bg-white text-blue-700 border-blue-600",
  glowText: "text-blue-700 drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]",
};

const dayLabels = [
  { key: "Mon", label: "Mon" },
  { key: "Tue", label: "Tue" },
  { key: "Wed", label: "Wed" },
  { key: "Thu", label: "Thu" },
  { key: "Fri", label: "Fri" },
];

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Chicago", label: "America/Chicago" },
  { value: "America/Denver", label: "America/Denver" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  // ... (keep the rest of your timezone list if you like)
];

/* ============ UTIL ============ */
const cx = (...arr) => arr.filter(Boolean).join(" ");
const fmtDate = (iso) => new Date(iso).toLocaleDateString();

/* ============ LOCAL STORAGE "CAMPAIGN" CRUD ============ */
const readLocalCampaigns = () => {
  try {
    const raw = localStorage.getItem("campaigns");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeLocalCampaigns = (arr) =>
  localStorage.setItem("campaigns", JSON.stringify(arr));

const createLocalCampaign = (payload) => {
  const arr = readLocalCampaigns();
  const id = Date.now();
  const out = {
    id,
    created_at: new Date().toISOString(),
    is_active: false,
    ...payload,
  };
  arr.unshift(out);
  writeLocalCampaigns(arr);
  return out;
};
const updateLocalCampaign = (id, patch) => {
  const arr = readLocalCampaigns().map((c) =>
    c.id === id ? { ...c, ...patch } : c
  );
  writeLocalCampaigns(arr);
};
const deleteLocalCampaign = (id) => {
  const arr = readLocalCampaigns().filter((c) => c.id !== id);
  writeLocalCampaigns(arr);
};
const getLocalCampaignById = (id) =>
  readLocalCampaigns().find((c) => c.id === id);

/* ============ FETCH HELPERS (send token + JSON) ============ */
async function getJSON(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ============ SMALL UI PIECES ============ */
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cx(
      "w-12 h-6 rounded-full p-1 transition-all",
      checked ? "bg-blue-600 shadow-[0_0_16px_rgba(59,130,246,0.65)]" : "bg-blue-200"
    )}
  >
    <div
      className={cx(
        "w-4 h-4 bg-white rounded-full transition-transform",
        checked ? "translate-x-6" : "translate-x-0"
      )}
    />
  </button>
);

const Badge = ({ children }) => (
  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
    {children}
  </span>
);

const EmptyState = ({ title, subtitle }) => (
  <div className={cx(neon.card, "p-8 text-center")}>
    <div className="text-lg font-semibold text-blue-800 mb-1">{title}</div>
    <div className="text-blue-500">{subtitle}</div>
  </div>
);

/* ============ MODALS ============ */
const Modal = ({ open, onClose, children, maxWidth = "max-w-3xl" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-blue-700/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cx(
          neon.card,
          "relative w-[92vw] md:w-auto",
          maxWidth,
          "p-6 md:p-8"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const ConfirmModal = ({ open, onClose, onConfirm, children }) => (
  <Modal open={open} onClose={onClose} maxWidth="max-w-md">
    <div className="text-blue-900 font-semibold text-lg mb-3">Confirm</div>
    <div className="text-blue-700 mb-6">{children}</div>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
        Cancel
      </button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg")}
      >
        Yes, proceed
      </button>
    </div>
  </Modal>
);

const AddLeadModal = ({ open, onClose, onSubmit, fileId }) => {
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [salesforce_id, setSalesforceId] = useState("");
  const [custom0, setCustom0] = useState("");
  const [custom1, setCustom1] = useState("");
  const valid = first_name && mobile && email;

  const handle = async () => {
    const payload = {
      first_name,
      last_name,
      email,
      mobile,
      salesforce_id,
      add_date: new Date().toISOString(),
      file_id: fileId,
      other_data:
        custom0 || custom1
          ? { Custom_0: custom0, Custom_1: custom1 }
          : null,
    };
    await onSubmit(payload);
    setFirst(""); setLast(""); setEmail(""); setMobile(""); setSalesforceId("");
    setCustom0(""); setCustom1("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-2xl font-bold mb-1 text-blue-700">Add Lead</div>
      <div className="text-sm text-blue-500 mb-6">
        This will add the lead to the currently selected list.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First name">
          <input value={first_name} onChange={(e)=>setFirst(e.target.value)} className="input" placeholder="Jane" />
        </Field>
        <Field label="Last name">
          <input value={last_name} onChange={(e)=>setLast(e.target.value)} className="input" placeholder="Doe" />
        </Field>
        <Field label="Email">
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input" placeholder="jane@company.com" />
        </Field>
        <Field label="Mobile (10 digits)">
          <input value={mobile} onChange={(e)=>setMobile(e.target.value)} className="input" placeholder="5551234567" />
        </Field>
        <Field label="Salesforce ID (optional)">
          <input value={salesforce_id} onChange={(e)=>setSalesforceId(e.target.value)} className="input" placeholder="SF-001" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Custom_0">
            <input value={custom0} onChange={(e)=>setCustom0(e.target.value)} className="input" placeholder="Any text" />
          </Field>
          <Field label="Custom_1">
            <input value={custom1} onChange={(e)=>setCustom1(e.target.value)} className="input" placeholder="Any text" />
          </Field>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
          Close
        </button>
        <button
          disabled={!valid}
          onClick={handle}
          className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg disabled:opacity-50")}
        >
          Add Lead
        </button>
      </div>
    </Modal>
  );
};

const Field = ({ label, children }) => (
  <label className="text-sm text-blue-800">
    <span className="block mb-1">{label}</span>
    <div className="rounded-lg border border-blue-200 focus-within:ring-2 focus-within:ring-blue-200 shadow-[inset_0_0_0_999px_rgba(255,255,255,0.2)]">
      {React.cloneElement(children, {
        className:
          "w-full px-3 py-2 bg-transparent outline-none",
      })}
    </div>
  </label>
);

/* ============ MAIN ============ */
const CampaignRowStats = ({ campaign }) => {
  const selectedCount = useMemo(
    () => (campaign?.selected_lead_ids?.length ?? 0),
    [campaign]
  );
  const skippedCount = useMemo(
    () => (campaign?.skipped_leads?.length ?? 0),
    [campaign]
  );
  return (
    <div className="flex items-center justify-center gap-3">
      <Badge>Selected: {selectedCount}</Badge>
      <Badge>Skipped: {skippedCount}</Badge>
      <Badge>Days: {campaign.calling_day?.split(",").length || 0}</Badge>
    </div>
  );
};

function Stepper({ step }) {
  const steps = ["Details", "List", "Leads", "Follow-up", "Schedule", "Summary"];
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = step === idx;
        const done = step > idx;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cx(
                "w-8 h-8 rounded-full grid place-items-center text-sm font-semibold border",
                active
                  ? "bg-blue-600 text-white border-blue-600 shadow-[0_0_16px_rgba(59,130,246,0.65)]"
                  : done
                  ? "bg-blue-100 text-blue-900 border-blue-200"
                  : "bg-white text-blue-700 border-blue-200"
              )}
            >
              {idx}
            </div>
            <div
              className={cx(
                "hidden md:block text-sm",
                active ? "text-blue-800 font-semibold" : "text-blue-500"
              )}
            >
              {s}
            </div>
            {idx < steps.length && (
              <ChevronRight className="w-4 h-4 text-blue-300 hidden sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}

const Campain = () => {
  /* --- state --- */
  const [campaigns, setCampaigns] = useState(() => readLocalCampaigns());
  const [loadingCampaigns] = useState(false);

  const [assistants, setAssistants] = useState([]);
  const [loadingAssistants, setLoadingAssistants] = useState(false);

  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  const [displayLeads, setDisplayLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // wizard
  const [step, setStep] = useState(0);
  const [campaignName, setCampaignName] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);

  // follow-up & schedule
  const [retryNonPicking, setRetryNonPicking] = useState(false);
  const [maxRetries, setMaxRetries] = useState(3);
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [callingHours, setCallingHours] = useState({ start: "09:00", end: "18:00" });
  const [timezone, setTimezone] = useState("UTC");

  // dialogs
  const [showAddLead, setShowAddLead] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);

  /* --- effects --- */
  useEffect(() => {
    loadAssistants();
    loadLists();
  }, []);

  useEffect(() => {
    if (step === 3 && selectedList) {
      loadLeads(selectedList);
    }
  }, [step, selectedList]);

  // when editing and leads load, pre-select not-skipped
  useEffect(() => {
    if (step === 3 && isEditMode && editingId && displayLeads.length) {
      const campaign = getLocalCampaignById(editingId);
      const skipped = new Set(campaign?.skipped_leads || []);
      setSelectedLeads(displayLeads.map((l) => l.id).filter((id) => !skipped.has(id)));
    }
  }, [step, isEditMode, editingId, displayLeads]);

  // when creating new (not edit), select all
  useEffect(() => {
    if (step === 3 && !isEditMode && displayLeads.length) {
      setSelectedLeads(displayLeads.map((l) => l.id));
    }
  }, [step, isEditMode, displayLeads]);

  /* --- loaders --- */
  async function loadAssistants() {
    try {
      setLoadingAssistants(true);
      const data = await getJSON(ENDPOINTS.assistants);
      // show only assistants with an attached phone number (backend key: attached_Number)
      const filtered = (Array.isArray(data) ? data : []).filter((a) => !!a.attached_Number);
      setAssistants(filtered);
    } catch (e) {
      console.error("Assistants fetch error:", e);
      setAssistants([]);
    } finally {
      setLoadingAssistants(false);
    }
  }

  async function loadLists() {
    try {
      setLoadingLists(true);
      const data = await getJSON(ENDPOINTS.lists);
      setLists(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Lists fetch error:", e);
      setLists([]);
    } finally {
      setLoadingLists(false);
    }
  }

  async function loadLeads(listId) {
    try {
      setLoadingLeads(true);
      const data = await getJSON(ENDPOINTS.leadsByList(listId));
      const rows = (Array.isArray(data) ? data : []).map((l) => ({
        id: l.id,
        name: [l.first_name, l.last_name].filter(Boolean).join(" ").trim() || "-",
        phone: l.mobile || "-",
        email: l.email || "-",
      }));
      setDisplayLeads(rows);
    } catch (e) {
      console.error("Leads fetch error:", e);
      setDisplayLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  }

  /* --- helpers --- */
  const toggleDay = (d) =>
    setSelectedDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const validateCallingHours = (start, end) => {
    if (!start || !end) return false;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const s = sh * 60 + sm, e = eh * 60 + em;
    return e > s;
  };

  const resetWizard = () => {
    setStep(0);
    setCampaignName("");
    setSelectedAssistant(null);
    setSelectedList(null);
    setDisplayLeads([]);
    setSelectedLeads([]);
    setRetryNonPicking(false);
    setMaxRetries(3);
    setCampaignStartDate("");
    setCampaignEndDate("");
    setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setCallingHours({ start: "09:00", end: "18:00" });
    setTimezone("UTC");
    setIsEditMode(false);
    setEditingId(null);
  };

  /* --- lead/list actions --- */
  const handleAddLead = async (payload) => {
    try {
      await postJSON(ENDPOINTS.addLead, payload);
      await loadLeads(selectedList);
      // Keep existing selections; make sure the newly added will be selectable on next load
      setSelectedLeads((prev) => Array.from(new Set(prev)));
      setShowAddLead(false);
    } catch (e) {
      console.error("add lead failed:", e);
      alert("Failed to add lead.");
    }
  };

  const handleCreateList = async () => {
    const name = prompt("List name?");
    if (!name) return;
    try {
      await postJSON(ENDPOINTS.createList, { name });
      await loadLists();
    } catch (e) {
      console.error("create list failed:", e);
      alert("Failed to create list.");
    }
  };

  /* --- campaign actions --- */
  const handleCreateOrUpdateCampaign = async () => {
    if (!validateCallingHours(callingHours.start, callingHours.end)) {
      alert("End time must be after start time");
      return;
    }
    if (!campaignStartDate || !campaignEndDate) {
      alert("Please set start and end date");
      return;
    }
    if (campaignEndDate <= campaignStartDate) {
      alert("End date must be after start date");
      return;
    }
    if (!selectedLeads.length) {
      alert("Please select at least one lead.");
      return;
    }

    setCreating(true);
    try {
      const startDateUTC = new Date(campaignStartDate).toISOString();
      const endDateUTC = new Date(campaignEndDate).toISOString();

      const allLeadIds = displayLeads.map((l) => l.id);
      const skipped = allLeadIds.filter((id) => !selectedLeads.includes(id));

      const payload = {
        name: campaignName.trim(),
        start_date: startDateUTC,
        end_date: endDateUTC,
        assistant_id: selectedAssistant,
        list_id: selectedList,
        calling_day: selectedDays.join(","),
        calling_hour_start: callingHours.start,
        calling_hour_end: callingHours.end,
        timezone,
        skipped_leads: skipped,
        selected_lead_ids: selectedLeads,
        call_again: retryNonPicking,
        tries: retryNonPicking ? maxRetries : 0,
      };

      if (isEditMode && editingId) {
        updateLocalCampaign(editingId, payload);
      } else {
        createLocalCampaign(payload);
      }
      setCampaigns(readLocalCampaigns());
      resetWizard();
    } catch (e) {
      console.error("create/update campaign error:", e);
      alert("Failed to save campaign.");
    } finally {
      setCreating(false);
    }
  };

  const startCreateFlow = () => {
    setIsEditMode(false);
    setEditingId(null);
    setStep(1);
  };

  const startEditFlow = (campaignId) => {
    const c = getLocalCampaignById(campaignId);
    if (!c) return;
    setIsEditMode(true);
    setEditingId(campaignId);
    setCampaignName(c.name || "");
    setSelectedAssistant(c.assistant_id || null);
    setSelectedList(c.list_id || null);
    setRetryNonPicking(!!c.call_again);
    setMaxRetries(c.tries ?? 1);
    setCampaignStartDate(c.start_date?.slice(0, 10) || "");
    setCampaignEndDate(c.end_date?.slice(0, 10) || "");
    setSelectedDays(c.calling_day ? c.calling_day.split(",") : ["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setCallingHours({
      start: c.calling_hour_start || "09:00",
      end: c.calling_hour_end || "18:00",
    });
    setTimezone(c.timezone || "UTC");
    setStep(1);
  };

  const toggleActive = (id) => {
    const c = getLocalCampaignById(id);
    if (!c) return;
    updateLocalCampaign(id, { is_active: !c.is_active });
    setCampaigns(readLocalCampaigns());
  };

  const askDelete = (id) => {
    setToDelete(id);
    setConfirmOpen(true);
  };
  const doDelete = () => {
    if (toDelete != null) {
      deleteLocalCampaign(toDelete);
      setCampaigns(readLocalCampaigns());
      setToDelete(null);
    }
  };

  /* --- UI --- */
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className={cx("text-3xl font-extrabold", neon.glowText)}>Campaigns</h1>
          <div className="flex gap-2">
            <button onClick={handleCreateList} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
              + New List
            </button>
            <button
              onClick={startCreateFlow}
              className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg flex items-center gap-2")}
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </button>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className={cx(neon.card, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-50">
                <tr className="text-blue-900">
                  <Th>Name</Th>
                  <Th>Status</Th>
                  <Th>Statistics</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loadingCampaigns ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-blue-600">
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                      Loading campaigns…
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6">
                      <EmptyState
                        title="No campaigns yet."
                        subtitle="Click 'Create Campaign' to start a new dialing plan."
                      />
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c) => (
                    <tr key={c.id} className="border-t border-blue-100 hover:bg-blue-50/50">
                      <Td>{c.name}</Td>
                      <Td>
                        <div className="flex justify-center">
                          <Toggle checked={!!c.is_active} onChange={() => toggleActive(c.id)} />
                        </div>
                      </Td>
                      <Td>
                        <CampaignRowStats campaign={c} />
                      </Td>
                      <Td>{fmtDate(c.created_at || c.start_date)}</Td>
                      <Td>
                        <div className="flex justify-center gap-2">
                          <IconBtn title="Edit" onClick={() => startEditFlow(c.id)}>
                            <Edit3 className="w-4 h-4" />
                          </IconBtn>
                          <IconBtn title="Delete" onClick={() => askDelete(c.id)}>
                            <Trash2 className="w-4 h-4" />
                          </IconBtn>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wizard Modal */}
        {step >= 1 && step <= 6 && (
          <Modal open={true} onClose={resetWizard} maxWidth="max-w-4xl">
            <Stepper step={step} />
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                  {isEditMode ? "Edit Campaign" : "Campaign Details"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <Field label="Campaign Name">
                    <input
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Summer Outreach"
                    />
                  </Field>
                  <div>
                    <div className="text-sm text-blue-800 mb-2">Select Assistant</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {loadingAssistants ? (
                        <div className="col-span-2 text-blue-600 py-8 text-center">
                          <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                          Loading assistants…
                        </div>
                      ) : assistants.length === 0 ? (
                        <div className="col-span-2">
                          <EmptyState
                            title="No assistants found."
                            subtitle="Create an assistant with an attached phone number first."
                          />
                        </div>
                      ) : (
                        assistants.map((a) => {
                          const active = selectedAssistant === a.id;
                          return (
                            <button
                              key={a.id}
                              onClick={() => setSelectedAssistant(a.id)}
                              className={cx(
                                "text-left p-4 rounded-xl border transition-all",
                                active
                                  ? "border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                                  : "border-blue-100 hover:border-blue-300"
                              )}
                            >
                              <div className="text-blue-800 font-semibold">{a.name || "Untitled"}</div>
                              <div className="text-blue-500 text-xs mt-1">
                                Number: {a.attached_Number || "-"}
                              </div>
                              <div className="text-blue-400 text-xs mt-1">Model: {a.model}</div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                  <button onClick={resetWizard} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
                    Close
                  </button>
                  <button
                    disabled={!campaignName.trim() || !selectedAssistant}
                    onClick={() => setStep(2)}
                    className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg disabled:opacity-50")}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Select a List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loadingLists ? (
                    <div className="col-span-2 text-center text-blue-600 py-8">
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                      Loading lists…
                    </div>
                  ) : lists.length === 0 ? (
                    <div className="col-span-2">
                      <EmptyState
                        title="No lists yet."
                        subtitle="Create your first list from the dashboard."
                      />
                    </div>
                  ) : (
                    lists.map((list) => {
                      const active = selectedList === list.id;
                      return (
                        <button
                          key={list.id}
                          onClick={() => setSelectedList(list.id)}
                          className={cx(
                            "text-left p-4 rounded-xl border transition-all",
                            active
                              ? "border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                              : "border-blue-100 hover:border-blue-300"
                          )}
                        >
                          <div className="text-blue-800 font-semibold text-lg">
                            {list.name?.charAt(0).toUpperCase() + list.name?.slice(1)}
                          </div>
                          <div className="text-blue-600 text-sm mt-1">
                            Leads: <span className="font-semibold">{list.leads_count ?? "-"}</span>
                          </div>
                          <div className="text-blue-400 text-xs mt-1">
                            Created: {list.created_at ? fmtDate(list.created_at) : "-"}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(1)} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
                    Back
                  </button>
                  <button
                    disabled={!selectedList}
                    onClick={() => setStep(3)}
                    className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg disabled:opacity-50")}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-blue-700">Select Leads</h2>
                  <div className="text-sm text-blue-600">
                    List:{" "}
                    <span className="font-semibold">
                      {lists.find((l) => l.id === selectedList)?.name || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => setShowAddLead(true)}
                    className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg")}
                  >
                    + Add Lead
                  </button>
                  <div className="text-blue-600 text-sm">
                    Selected: <span className="font-semibold">{selectedLeads.length}</span> /{" "}
                    {displayLeads.length}
                  </div>
                </div>

                <div className={cx(neon.card, "p-0 overflow-hidden border-0")}>
                  <div className="max-h-80 overflow-auto">
                    <table className="min-w-full table-auto">
                      <thead className="bg-blue-50 sticky top-0">
                        <tr className="text-blue-900">
                          <Th tight>
                            <input
                              type="checkbox"
                              checked={
                                displayLeads.length > 0 &&
                                selectedLeads.length === displayLeads.length
                              }
                              onChange={(e) =>
                                setSelectedLeads(
                                  e.target.checked ? displayLeads.map((l) => l.id) : []
                                )
                              }
                            />
                          </Th>
                          <Th>Name</Th>
                          <Th>Phone</Th>
                          <Th>Email</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingLeads ? (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-blue-600">
                              <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                              Loading leads…
                            </td>
                          </tr>
                        ) : displayLeads.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-6">
                              <EmptyState
                                title="No leads in this list."
                                subtitle="Add leads to continue."
                              />
                            </td>
                          </tr>
                        ) : (
                          displayLeads.map((lead) => (
                            <tr key={lead.id} className="border-t border-blue-100">
                              <Td tight>
                                <input
                                  type="checkbox"
                                  checked={selectedLeads.includes(lead.id)}
                                  onChange={() =>
                                    setSelectedLeads((prev) =>
                                      prev.includes(lead.id)
                                        ? prev.filter((x) => x !== lead.id)
                                        : [...prev, lead.id]
                                    )
                                  }
                                />
                              </Td>
                              <Td>{lead.name}</Td>
                              <Td>{lead.phone}</Td>
                              <Td>{lead.email}</Td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(2)} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
                    Back
                  </button>
                  <button
                    disabled={selectedLeads.length === 0}
                    onClick={() => setStep(4)}
                    className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg disabled:opacity-50")}
                  >
                    Next
                  </button>
                </div>

                <AddLeadModal
                  open={showAddLead}
                  onClose={() => setShowAddLead(false)}
                  onSubmit={handleAddLead}
                  fileId={selectedList}
                />
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Follow-up Settings</h2>

                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setRetryNonPicking((p) => !p)}
                >
                  <Toggle checked={retryNonPicking} onChange={setRetryNonPicking} />
                  <div className="text-blue-800 text-sm">Call again to non-picking leads</div>
                </div>

                {retryNonPicking && (
                  <div className="mt-4">
                    <Field label="How many tries (per lead)">
                      <input
                        type="number"
                        min={1}
                        value={maxRetries}
                        onChange={(e) => setMaxRetries(Number(e.target.value))}
                        placeholder="e.g. 3"
                      />
                    </Field>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Field label="Start Date">
                    <input
                      type="date"
                      value={campaignStartDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCampaignStartDate(e.target.value)}
                    />
                  </Field>
                  <Field label="End Date">
                    <input
                      type="date"
                      value={campaignEndDate}
                      min={campaignStartDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCampaignEndDate(e.target.value)}
                    />
                  </Field>
                </div>

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(3)} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
                    Back
                  </button>
                  <button onClick={() => setStep(5)} className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg")}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Schedule</h2>

                <div className="mb-6">
                  <div className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                    <Calendar className="w-5 h-5" />
                    Select Calling Days
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {dayLabels.map((d) => {
                      const on = selectedDays.includes(d.key);
                      return (
                        <button
                          key={d.key}
                          onClick={() => toggleDay(d.key)}
                          className={cx(
                            "rounded-lg py-3 text-center border font-semibold",
                            on ? neon.pillOn : neon.pillOff
                          )}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                      <Clock className="w-5 h-5" />
                      Calling Hours
                    </div>
                    <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div>
                        <div className="text-xs text-blue-500 mb-1">Start</div>
                        <select
                          value={callingHours.start}
                          onChange={(e) =>
                            setCallingHours((h) => ({ ...h, start: e.target.value }))
                          }
                          className="px-3 py-2 rounded-lg border border-blue-200 bg-white"
                        >
                          {Array.from({ length: 24 }).map((_, h) =>
                            ["00", "30"].map((m) => {
                              const val = `${String(h).padStart(2, "0")}:${m}`;
                              return (
                                <option key={`s-${val}`} value={val}>
                                  {val}
                                </option>
                              );
                            })
                          )}
                        </select>
                      </div>
                      <span className="text-blue-500">—</span>
                      <div>
                        <div className="text-xs text-blue-500 mb-1">End</div>
                        <select
                          value={callingHours.end}
                          onChange={(e) => {
                            const newEnd = e.target.value;
                            if (validateCallingHours(callingHours.start, newEnd)) {
                              setCallingHours((h) => ({ ...h, end: newEnd }));
                            } else {
                              alert("End time must be after start time");
                            }
                          }}
                          className="px-3 py-2 rounded-lg border border-blue-200 bg-white"
                        >
                          {Array.from({ length: 24 }).map((_, h) =>
                            ["00", "30"].map((m) => {
                              const val = `${String(h).padStart(2, "0")}:${m}`;
                              return (
                                <option key={`e-${val}`} value={val}>
                                  {val}
                                </option>
                              );
                            })
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                      <Globe2 className="w-5 h-5" />
                      Timezone
                    </div>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(4)} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg")}>
                    Back
                  </button>
                  <button
                    disabled={!validateCallingHours(callingHours.start, callingHours.end)}
                    onClick={() => setStep(6)}
                    className={cx(neon.btnPrimary, "px-4 py-2 rounded-lg disabled:opacity-50")}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={cx(neon.card, "p-5")}>
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-lg mb-3">
                    <ListChecks className="w-5 h-5" />
                    Campaign Info
                  </div>
                  <div className="text-blue-900">
                    <div className="mb-2">
                      <span className="font-medium">Name:</span> {campaignName}
                    </div>
                    <div>
                      <span className="font-medium">Assistant:</span>{" "}
                      {assistants.find((a) => a.id === selectedAssistant)?.name || "-"}
                    </div>
                  </div>
                </div>

                <div className={cx(neon.card, "p-5")}>
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-lg mb-3">
                    <User className="w-5 h-5" />
                    Leads
                  </div>
                  <div className="text-blue-900">
                    <div className="mb-2">
                      <span className="font-medium">Selected:</span> {selectedLeads.length}
                    </div>
                    <div>
                      <span className="font-medium">Skipped:</span>{" "}
                      {Math.max(displayLeads.length - selectedLeads.length, 0)}
                    </div>
                  </div>
                </div>

                <div className={cx(neon.card, "p-5 md:col-span-2")}>
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-lg mb-3">
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </div>
                  <div className="text-blue-900 space-y-2">
                    <div>
                      <span className="font-medium">Days:</span>{" "}
                      {selectedDays.join(", ")}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Hours:</span>{" "}
                      <Clock className="w-4 h-4 text-blue-600" />{" "}
                      {callingHours.start} - {callingHours.end}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Timezone:</span>{" "}
                      <Globe2 className="w-4 h-4 text-blue-600" />{" "}
                      {timezones.find((t) => t.value === timezone)?.label || timezone}
                    </div>
                    <div>
                      <span className="font-medium">Start:</span> {campaignStartDate || "-"}
                      {"  "}
                      <span className="font-medium ml-4">End:</span> {campaignEndDate || "-"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end md:col-span-2">
                  <button onClick={() => setStep(5)} className={cx(neon.btnGhost, "px-4 py-2 rounded-lg mr-2")}>
                    Back
                  </button>
                  <button
                    disabled={creating || !validateCallingHours(callingHours.start, callingHours.end)}
                    onClick={handleCreateOrUpdateCampaign}
                    className={cx(neon.btnPrimary, "px-6 py-2 rounded-lg disabled:opacity-50")}
                  >
                    {creating ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Campaign" : "Create Campaign"}
                  </button>
                </div>
              </div>
            )}
          </Modal>
        )}

        {/* Delete confirm */}
        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={doDelete}
        >
          Are you sure you want to delete this campaign? This action cannot be undone.
        </ConfirmModal>
      </div>

      {/* small styles for inputs */}
      <style>{`
        .input {
          border: none;
          outline: none;
        }
      `}</style>
    </div>
  );
};

/* simple table cells */
const Th = ({ children, tight }) => (
  <th className={cx("px-6 py-4 text-sm font-semibold text-center", tight && "w-[60px]")}>
    {children}
  </th>
);
const Td = ({ children, tight }) => (
  <td className={cx("px-6 py-4 text-sm text-center text-blue-900", tight && "w-[60px]")}>{children}</td>
);
const IconBtn = ({ title, onClick, children }) => (
  <button
    title={title}
    onClick={onClick}
    className="p-2 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700"
  >
    {children}
  </button>
);

export default Campain;
