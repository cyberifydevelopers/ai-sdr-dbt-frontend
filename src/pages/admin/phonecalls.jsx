

// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Phone,
//   PlayCircle,
//   RefreshCw,
//   Search,
//   Filter,
//   Loader2,
//   X,
//   Trash2,
//   FileAudio,
//   Info,
//   Clock,
//   DollarSign,
//   CheckCircle2,
//   AlertTriangle,
//   Radio,
//   Copy,
// } from "lucide-react";
// import { toast } from "react-toastify";

// /* ──────────────────────────────────────────────────────────────────────────
//  * Config
//  * ────────────────────────────────────────────────────────────────────────── */
// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
// const API_BASE = `${API_URL}/api`;

// /* Light theme — primary: white; secondary: blue/cyan/purple accents */
// const COLORS = {
//   bg: "#ffffff",         // primary white
//   panel: "#F8FAFC",      // slate-50
//   card: "#ffffff",       // pure white cards
//   border: "#E5E7EB",     // gray-200
//   text: "#0F172A",       // slate-900
//   dim: "#64748B",        // slate-500
//   primary: "#4F46E5",    // indigo-600
//   success: "#16A34A",    // green-600
//   danger: "#DC2626",     // red-600
//   amber: "#D97706",      // amber-600
//   cyan: "#06B6D4",       // cyan-500
//   purple: "#7C3AED",     // violet-600
//   row: "#F9FAFB",        // row alt
//   gradFrom: "#6366F1",   // indigo-500
//   gradTo: "#06B6D4",     // cyan-500
// };

// /* Small helpers */
// const cx = (...arr) => arr.filter(Boolean).join(" ");
// const prettyNum = (n) =>
//   n?.toLocaleString?.(undefined, { maximumFractionDigits: 2 }) ?? String(n ?? "");

// const fmtDateTime = (iso) => {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   if (isNaN(d.getTime())) return "—";
//   return d.toLocaleString();
// };

// const fmtDuration = (seconds) => {
//   if (seconds == null) return "—";
//   const s = Math.max(0, Math.round(seconds));
//   const m = Math.floor(s / 60);
//   const rem = s % 60;
//   return `${m}m ${rem}s`;
// };

// const maskPhone = (raw) => {
//   if (!raw) return "—";
//   const cleaned = String(raw).replace(/\D/g, "");
//   if (cleaned.length < 10) return raw;
//   const tail = cleaned.slice(-10);
//   const cc = cleaned.slice(0, cleaned.length - 10) || "1";
//   return `+${cc} (${tail.slice(0, 3)}) ${tail.slice(3, 6)}-${tail.slice(6)}`;
// };

// /* Admin endpoints (no /user/*) */
// const endpoints = {
//   ALL_LOGS: () => `${API_BASE}/all_call_logs`,
//   CALL_DETAIL: (id) => `${API_BASE}/call/${id}`,
//   DELETE_CALL: (id) => `${API_BASE}/call_log/${id}`,
//   UPDATE_MISSING: () => `${API_BASE}/update_calls`,
//   REFRESH_TRANSCRIPT: (id) => `${API_BASE}/refresh-transcript/${id}`,
//   CALL_STATUS: (id) => `${API_BASE}/call-status/${id}`,
//   SYNC_INBOUND: () => `${API_BASE}/sync-inbound-calls`,
// };

// /* Auth fetch */
// async function authedFetch(url, options = {}) {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("Authentication required. Please log in.");
//   const res = await fetch(url, {
//     ...options,
//     headers: {
//       "Authorization": `Bearer ${token}`,
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//   });
//   if (!res.ok) {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const data = await res.json();
//       msg = data?.detail || data?.message || msg;
//     } catch {}
//     throw new Error(msg);
//   }
//   return res;
// }

// /* ──────────────────────────────────────────────────────────────────────────
//  * Main Page
//  * ────────────────────────────────────────────────────────────────────────── */
// export default function AdminPhoneCallsPage() {
//   const [calls, setCalls] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [polling, setPolling] = useState(true);

//   // Filters
//   const [q, setQ] = useState("");
//   const [status, setStatus] = useState("any");
//   const [reason, setReason] = useState("any");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   // Pagination
//   const [page, setPage] = useState(1);
//   const pageSize = 12;

//   // Selection / detail
//   const [openDetail, setOpenDetail] = useState(false);
//   const [detailId, setDetailId] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [detail, setDetail] = useState(null);
//   const [statusProbe, setStatusProbe] = useState(null);
//   const audioRef = useRef(null);

//   // Bulk / top actions loading
//   const [busyAction, setBusyAction] = useState(false);

//   // Delete modal
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleteBusy, setDeleteBusy] = useState(false);

//   /* Initial load + polling */
//   useEffect(() => {
//     loadAll();
//   }, []);

//   useEffect(() => {
//     if (!polling) return;
//     const t = setInterval(loadAll, 15_000);
//     return () => clearInterval(t);
//   }, [polling]);

//   async function loadAll() {
//     try {
//       setLoading(true);
//       const res = await authedFetch(endpoints.ALL_LOGS());
//       const data = await res.json();

//       // Normalize typical fields from CallLog model
//       const norm = (data || []).map((c) => ({
//         id: c.id ?? null,
//         call_id: c.call_id ?? c.id ?? "",
//         customer_number: c.customer_number ?? "",
//         customer_name: c.customer_name ?? "",
//         status: c.status ?? "Unknown",
//         call_ended_reason: c.call_ended_reason ?? null,
//         call_started_at: c.call_started_at ?? c.created_at ?? null,
//         call_ended_at: c.call_ended_at ?? null,
//         call_duration: c.call_duration ?? null,
//         cost: typeof c.cost === "number" ? c.cost : parseFloat(c.cost || 0),
//         lead_id: c.lead_id ?? null,
//       }));

//       setCalls(norm);
//     } catch (err) {
//       console.error(err);
//       toast.error(`Load failed: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* Filtering */
//   const filtered = useMemo(() => {
//     return (calls || []).filter((c) => {
//       const text = `${c.call_id} ${c.customer_number} ${c.customer_name} ${c.status} ${c.call_ended_reason ?? ""}`.toLowerCase();
//       if (q && !text.includes(q.toLowerCase())) return false;

//       if (status !== "any" && (c.status || "Unknown") !== status) return false;

//       if (reason !== "any") {
//         const r = (c.call_ended_reason || "Unknown").toLowerCase();
//         if (reason === "null") {
//           if (c.call_ended_reason != null) return false;
//         } else if (!r.includes(reason.toLowerCase())) {
//           return false;
//         }
//       }

//       if (dateFrom) {
//         const start = new Date(dateFrom);
//         const ts = new Date(c.call_started_at || c.call_ended_at || 0);
//         if (isFinite(start) && isFinite(ts) && ts < start) return false;
//       }
//       if (dateTo) {
//         const end = new Date(dateTo);
//         const ts = new Date(c.call_started_at || c.call_ended_at || 0);
//         if (isFinite(end) && isFinite(ts) && ts > new Date(end.getTime() + 86399000)) return false;
//       }
//       return true;
//     });
//   }, [calls, q, status, reason, dateFrom, dateTo]);

//   /* Pagination pages */
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageSafe = Math.min(page, totalPages);
//   const pageSlice = useMemo(() => {
//     const start = (pageSafe - 1) * pageSize;
//     return filtered.slice(start, start + pageSize);
//   }, [filtered, pageSafe]);

//   /* Totals */
//   const totals = useMemo(() => {
//     const sumCost = filtered.reduce((acc, c) => acc + (Number(c.cost) || 0), 0);
//     const sumDur = filtered.reduce((acc, c) => acc + (Number(c.call_duration) || 0), 0);
//     return {
//       count: filtered.length,
//       cost: sumCost,
//       duration: sumDur,
//     };
//   }, [filtered]);

//   function resetFilters() {
//     setQ("");
//     setStatus("any");
//     setReason("any");
//     setDateFrom("");
//     setDateTo("");
//     setPage(1);
//   }

//   /* Detail drawer */
//   async function openCallDetail(id) {
//     try {
//       setDetailId(id);
//       setOpenDetail(true);
//       setDetailLoading(true);

//       const [detailRes, statusRes] = await Promise.all([
//         authedFetch(endpoints.CALL_DETAIL(id)),
//         authedFetch(endpoints.CALL_STATUS(id)),
//       ]);

//       const d = await detailRes.json();
//       const s = await statusRes.json();

//       setDetail(d);
//       setStatusProbe(s);
//     } catch (err) {
//       toast.error(`Failed to load call detail: ${err.message}`);
//     } finally {
//       setDetailLoading(false);
//     }
//   }

//   function closeDetail() {
//     setOpenDetail(false);
//     setDetailId(null);
//     setDetail(null);
//     setStatusProbe(null);
//   }

//   /* Delete flow with stylish modal */
//   function askDelete(call) {
//     setDeleteTarget(call); // opens modal
//   }

//   async function confirmDelete() {
//     if (!deleteTarget) return;
//     try {
//       setDeleteBusy(true);
//       const id = deleteTarget.call_id;
//       const res = await authedFetch(endpoints.DELETE_CALL(id), { method: "DELETE" });
//       await res.json().catch(() => {});
//       toast.success("Call log deleted");
//       setCalls((prev) => prev.filter((c) => c.call_id !== id));
//       if (detailId === id) closeDetail();
//       setDeleteTarget(null);
//     } catch (err) {
//       toast.error(`Delete failed: ${err.message}`);
//     } finally {
//       setDeleteBusy(false);
//     }
//   }

//   /* Other actions */
//   async function refreshTranscript(id) {
//     try {
//       setBusyAction(true);
//       const res = await authedFetch(endpoints.REFRESH_TRANSCRIPT(id), { method: "POST" });
//       const data = await res.json();
//       toast.success(data?.message || "Transcript refreshed");
//       if (detailId === id) {
//         setDetail((prev) => ({ ...(prev || {}), transcript: data?.transcript ?? prev?.transcript }));
//       }
//     } catch (err) {
//       toast.error(`Refresh failed: ${err.message}`);
//     } finally {
//       setBusyAction(false);
//     }
//   }

//   async function repairMissing() {
//     try {
//       setBusyAction(true);
//       const res = await authedFetch(endpoints.UPDATE_MISSING());
//       const data = await res.json();
//       toast.success(data?.message || "Updated missing details");
//       await loadAll();
//     } catch (err) {
//       toast.error(`Update failed: ${err.message}`);
//     } finally {
//       setBusyAction(false);
//     }
//   }

//   async function syncInbound() {
//     try {
//       setBusyAction(true);
//       const res = await authedFetch(endpoints.SYNC_INBOUND(), { method: "POST" });
//       const data = await res.json();
//       toast.success(data?.detail || "Synced inbound calls");
//       await loadAll();
//     } catch (err) {
//       toast.error(`Sync failed: ${err.message}`);
//     } finally {
//       setBusyAction(false);
//     }
//   }

//   async function probeStatus(id) {
//     try {
//       const res = await authedFetch(endpoints.CALL_STATUS(id));
//       const s = await res.json();
//       setStatusProbe(s);
//       toast.success("Status updated");
//     } catch (err) {
//       toast.error(`Status check failed: ${err.message}`);
//     }
//   }

//   /* Copy helper */
//   function copy(text, label = "Copied") {
//     navigator.clipboard.writeText(String(text ?? "")).then(
//       () => toast.success(label),
//       () => toast.error("Copy failed")
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ background: COLORS.bg }}>
//       {/* Hero/Header (scrolls with page, not sticky) */}
//       <div className="border-b">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="flex items-center gap-4">
//             <div
//               className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.12))",
//                 border: `1px solid ${COLORS.border}`,
//               }}
//             >
//               <Phone size={22} color={COLORS.primary} />
//             </div>
//             <div>
//               <div
//                 className="text-2xl md:text-3xl font-extrabold tracking-tight"
//                 style={{ color: COLORS.text }}
//               >
//                 Admin · Phone Calls
//               </div>
//               <div className="text-sm" style={{ color: COLORS.dim }}>
//                 Full control: logs, transcripts, recordings
//               </div>
//             </div>
//           </div>

//           {/* Quick actions under header */}
//           <div className="mt-4 flex flex-wrap items-center gap-2">
//             <button
//               onClick={() => setPolling((p) => !p)}
//               className="px-3 py-2 rounded-lg text-sm font-semibold border transition hover:opacity-90"
//               style={{
//                 background: "#FFFFFF",
//                 color: polling ? COLORS.primary : COLORS.text,
//                 borderColor: COLORS.border,
//                 boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
//               }}
//               title={polling ? "Auto-refresh is ON" : "Auto-refresh is OFF"}
//             >
//               <span className="inline-flex items-center gap-2">
//                 <Radio size={16} />
//                 {polling ? "Live" : "Paused"}
//               </span>
//             </button>

//             <button
//               onClick={loadAll}
//               className="px-3 py-2 rounded-lg text-sm font-semibold border transition hover:opacity-90"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))",
//                 color: COLORS.text,
//                 borderColor: COLORS.border,
//               }}
//             >
//               <span className="inline-flex items-center gap-2">
//                 <RefreshCw size={16} color={COLORS.purple} />
//                 Refresh
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//         {/* Actions + Filters */}
//         <div className="grid lg:grid-cols-3 gap-4">
//           <div className="lg:col-span-2">
//             <div
//               className="rounded-2xl p-4 border"
//               style={{
//                 background: COLORS.panel,
//                 borderColor: COLORS.border,
//                 boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
//               }}
//             >
//               <div className="flex flex-col md:flex-row md:items-center gap-3">
//                 <div className="relative flex-1">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2"
//                     size={18}
//                     color={COLORS.dim}
//                   />
//                   <input
//                     value={q}
//                     onChange={(e) => {
//                       setQ(e.target.value);
//                       setPage(1);
//                     }}
//                     placeholder="Search by call id, number, name, status, reason..."
//                     className="w-full pl-10 pr-3 py-2 rounded-xl outline-none transition"
//                     style={{
//                       background: COLORS.card,
//                       color: COLORS.text,
//                       border: `1px solid ${COLORS.border}`,
//                     }}
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Filter size={16} color={COLORS.dim} />
//                   <select
//                     value={status}
//                     onChange={(e) => {
//                       setStatus(e.target.value);
//                       setPage(1);
//                     }}
//                     className="px-3 py-2 rounded-xl text-sm"
//                     style={{
//                       background: COLORS.card,
//                       color: COLORS.text,
//                       border: `1px solid ${COLORS.border}`,
//                     }}
//                   >
//                     <option value="any">Any status</option>
//                     <option value="completed">completed</option>
//                     <option value="failed">failed</option>
//                     <option value="in-progress">in-progress</option>
//                     <option value="queued">queued</option>
//                     <option value="connecting">connecting</option>
//                     <option value="Unknown">Unknown</option>
//                   </select>

//                   <select
//                     value={reason}
//                     onChange={(e) => {
//                       setReason(e.target.value);
//                       setPage(1);
//                     }}
//                     className="px-3 py-2 rounded-xl text-sm"
//                     style={{
//                       background: COLORS.card,
//                       color: COLORS.text,
//                       border: `1px solid ${COLORS.border}`,
//                     }}
//                   >
//                     <option value="any">Any reason</option>
//                     <option value="null">No reason (null)</option>
//                     <option value="completed">completed</option>
//                     <option value="hangup">hangup</option>
//                     <option value="no-answer">no-answer</option>
//                     <option value="busy">busy</option>
//                     <option value="failed">failed</option>
//                     <option value="Unknown">Unknown</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid sm:grid-cols-2 gap-3 mt-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs" style={{ color: COLORS.dim }}>
//                     From
//                   </span>
//                   <input
//                     type="date"
//                     value={dateFrom}
//                     onChange={(e) => {
//                       setDateFrom(e.target.value);
//                       setPage(1);
//                     }}
//                     className="px-3 py-2 rounded-xl text-sm flex-1"
//                     style={{
//                       background: COLORS.card,
//                       color: COLORS.text,
//                       border: `1px solid ${COLORS.border}`,
//                     }}
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs" style={{ color: COLORS.dim }}>
//                     To
//                   </span>
//                   <input
//                     type="date"
//                     value={dateTo}
//                     onChange={(e) => {
//                       setDateTo(e.target.value);
//                       setPage(1);
//                     }}
//                     className="px-3 py-2 rounded-xl text-sm flex-1"
//                     style={{
//                       background: COLORS.card,
//                       color: COLORS.text,
//                       border: `1px solid ${COLORS.border}`,
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 mt-3">
//                 <button
//                   onClick={resetFilters}
//                   className="px-3 py-2 rounded-xl text-sm border hover:bg-white transition"
//                   style={{
//                     background: COLORS.card,
//                     color: COLORS.text,
//                     borderColor: COLORS.border,
//                   }}
//                 >
//                   Reset filters
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Top actions */}
//           <div
//             className="rounded-2xl p-4 border space-y-3"
//             style={{
//               background: COLORS.panel,
//               borderColor: COLORS.border,
//               boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
//             }}
//           >
//             <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
//               Admin Actions
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 onClick={repairMissing}
//                 disabled={busyAction}
//                 className="px-3 py-2 rounded-xl text-sm font-semibold border hover:bg-amber-50 transition flex items-center gap-2 justify-center disabled:opacity-50"
//                 style={{
//                   background: COLORS.card,
//                   color: COLORS.amber,
//                   borderColor: COLORS.border,
//                 }}
//                 title="Fill call_ended_reason, duration, etc. for incomplete rows"
//               >
//                 {busyAction ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <AlertTriangle size={16} />
//                 )}
//                 Repair Missing
//               </button>
//               <button
//                 onClick={syncInbound}
//                 disabled={busyAction}
//                 className="px-3 py-2 rounded-xl text-sm font-semibold border hover:bg-cyan-50 transition flex items-center gap-2 justify-center disabled:opacity-50"
//                 style={{
//                   background: COLORS.card,
//                   color: COLORS.cyan,
//                   borderColor: COLORS.border,
//                 }}
//                 title="Sync inbound calls from VAPI for this admin's assistants"
//               >
//                 {busyAction ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <RefreshCw size={16} />
//                 )}
//                 Sync Inbound
//               </button>
//             </div>

//             <div className="grid grid-cols-3 gap-2 pt-2">
//               <StatTile
//                 icon={<CheckCircle2 size={16} color={COLORS.success} />}
//                 label="Filtered"
//                 value={prettyNum(totals.count)}
//               />
//               <StatTile
//                 icon={<Clock size={16} color={COLORS.primary} />}
//                 label="Duration"
//                 value={fmtDuration(totals.duration)}
//               />
//               <StatTile
//                 icon={<DollarSign size={16} color={COLORS.amber} />}
//                 label="Cost"
//                 value={`$${prettyNum(totals.cost)}`}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Results */}
//         <div
//           className="rounded-2xl border overflow-hidden"
//           style={{
//             background: COLORS.card,
//             borderColor: COLORS.border,
//             boxShadow:
//               "0 1px 0 rgba(0,0,0,0.02), 0 8px 24px -16px rgba(79,70,229,0.25)",
//           }}
//         >
//           {/* Desktop header row (hidden on small) */}
//           <div
//             className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 text-xs border-b"
//             style={{
//               borderColor: COLORS.border,
//               background:
//                 "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))",
//             }}
//           >
//             <div className="col-span-3" style={{ color: COLORS.dim }}>
//               Customer
//             </div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>
//               Number
//             </div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>
//               Status
//             </div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>
//               Started
//             </div>
//             <div className="col-span-1" style={{ color: COLORS.dim }}>
//               Dur
//             </div>
//             <div className="col-span-2 text-right" style={{ color: COLORS.dim }}>
//               Actions
//             </div>
//           </div>

//           {/* Body */}
//           {loading ? (
//             <div className="py-16 flex items-center justify-center">
//               <div className="flex items-center gap-3">
//                 <Loader2 className="animate-spin" color={COLORS.primary} />
//                 <span style={{ color: COLORS.dim }}>Loading calls…</span>
//               </div>
//             </div>
//           ) : pageSlice.length === 0 ? (
//             <div className="py-16 text-center" style={{ color: COLORS.dim }}>
//               No results match your filters.
//             </div>
//           ) : (
//             <>
//               {/* Desktop rows */}
//               <div className="hidden md:block">
//                 {pageSlice.map((c, idx) => (
//                   <div
//                     key={c.call_id}
//                     className="grid grid-cols-12 gap-3 px-4 py-3 border-b hover:bg-white transition"
//                     style={{
//                       borderColor: COLORS.border,
//                       background: idx % 2 ? COLORS.bg : COLORS.row,
//                     }}
//                   >
//                     <div className="col-span-3 flex items-center gap-3">
//                       <div
//                         className="w-9 h-9 rounded-lg flex items-center justify-center"
//                         style={{
//                           background: COLORS.panel,
//                           border: `1px solid ${COLORS.border}`,
//                         }}
//                       >
//                         <Phone size={16} color={COLORS.primary} />
//                       </div>
//                       <div className="min-w-0">
//                         <div
//                           className="truncate font-semibold"
//                           style={{ color: COLORS.text }}
//                         >
//                           {c.customer_name || "—"}
//                         </div>
//                         <div
//                           className="text-xs truncate flex items-center gap-1"
//                           style={{ color: COLORS.dim }}
//                         >
//                           <span>ID:</span>
//                           <button
//                             onClick={() => copy(c.call_id, "Call ID copied")}
//                             className="underline-offset-2 hover:underline flex items-center gap-1"
//                             title="Copy call ID"
//                           >
//                             <Copy size={12} />
//                             {c.call_id}
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-span-2 flex items-center">
//                       <div className="text-sm" style={{ color: COLORS.text }}>
//                         {maskPhone(c.customer_number)}
//                       </div>
//                     </div>

//                     <div className="col-span-2 flex items-center gap-2">
//                       <Badge
//                         color={
//                           c.status === "completed"
//                             ? COLORS.success
//                             : c.status === "failed"
//                             ? COLORS.danger
//                             : COLORS.primary
//                         }
//                         text={c.status || "Unknown"}
//                       />
//                       <span
//                         className="text-xs truncate"
//                         style={{ color: COLORS.dim }}
//                       >
//                         {c.call_ended_reason ?? "—"}
//                       </span>
//                     </div>

//                     <div className="col-span-2 flex items-center">
//                       <div className="text-sm" style={{ color: COLORS.text }}>
//                         {fmtDateTime(c.call_started_at)}
//                       </div>
//                     </div>

//                     <div className="col-span-1 flex items-center">
//                       <div className="text-sm" style={{ color: COLORS.text }}>
//                         {fmtDuration(c.call_duration)}
//                       </div>
//                     </div>

//                     <div className="col-span-2 flex items-center justify-end gap-2">
//                       <button
//                         onClick={() => openCallDetail(c.call_id)}
//                         className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-white flex items-center gap-2"
//                         style={{
//                           background: COLORS.card,
//                           color: COLORS.text,
//                           borderColor: COLORS.border,
//                         }}
//                         title="Open details"
//                       >
//                         <Info size={14} color={COLORS.purple} />
//                         Detail
//                       </button>
//                       <button
//                         onClick={() => askDelete(c)}
//                         className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-red-50 flex items-center gap-2"
//                         style={{
//                           background: COLORS.card,
//                           color: COLORS.danger,
//                           borderColor: COLORS.border,
//                         }}
//                         title="Delete"
//                       >
//                         <Trash2 size={14} />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Mobile CARDS */}
//               <div className="md:hidden p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {pageSlice.map((c) => (
//                   <CallCard
//                     key={c.call_id}
//                     c={c}
//                     onOpen={() => openCallDetail(c.call_id)}
//                     onDelete={() => askDelete(c)}
//                   />
//                 ))}
//               </div>
//             </>
//           )}

//           {/* Footer / Pagination */}
//           {!loading && filtered.length > 0 && (
//             <div
//               className="flex items-center justify-between px-4 py-3 border-t"
//               style={{ background: COLORS.panel, borderColor: COLORS.border }}
//             >
//               <div className="text-xs" style={{ color: COLORS.dim }}>
//                 Showing {(pageSafe - 1) * pageSize + 1}–
//                 {Math.min(filtered.length, pageSafe * pageSize)} of {filtered.length}
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={pageSafe === 1}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 hover:bg-white"
//                   style={{
//                     background: COLORS.card,
//                     color: COLORS.text,
//                     borderColor: COLORS.border,
//                   }}
//                 >
//                   Prev
//                 </button>
//                 <div className="text-xs" style={{ color: COLORS.dim }}>
//                   {pageSafe} / {totalPages}
//                 </div>
//                 <button
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={pageSafe >= totalPages}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 hover:bg-white"
//                   style={{
//                     background: COLORS.card,
//                     color: COLORS.text,
//                     borderColor: COLORS.border,
//                   }}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Detail Drawer */}
//       {openDetail && (
//         <div className="fixed inset-0 z-40">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black/30"
//             onClick={closeDetail}
//           />
//           {/* Panel */}
//           <div
//             className="absolute right-0 top-0 h-full w-full sm:w-[560px] shadow-2xl border-l overflow-y-auto"
//             style={{ background: COLORS.card, borderColor: COLORS.border }}
//           >
//             <div className="sticky top-0 px-4 py-3 flex items-center justify-between border-b bg-white">
//               <div className="flex items-center gap-2">
//                 <FileAudio size={18} color={COLORS.primary} />
//                 <div className="font-semibold" style={{ color: COLORS.text }}>
//                   Call Detail
//                 </div>
//               </div>
//               <button
//                 onClick={closeDetail}
//                 className="p-2 rounded-lg border hover:bg-slate-50"
//                 style={{ background: COLORS.card, borderColor: COLORS.border }}
//               >
//                 <X size={16} color={COLORS.dim} />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-4 space-y-4">
//               {detailLoading ? (
//                 <div className="flex items-center gap-3">
//                   <Loader2 className="animate-spin" color={COLORS.primary} />
//                   <span style={{ color: COLORS.dim }}>Loading…</span>
//                 </div>
//               ) : !detail ? (
//                 <div style={{ color: COLORS.dim }}>No detail available.</div>
//               ) : (
//                 <>
//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <MiniCard
//                       label="Status"
//                       value={statusProbe?.status || detail?.status || "—"}
//                     />
//                     <MiniCard
//                       label="Ended Reason"
//                       value={detail?.ended_reason || detail?.call_ended_reason || "—"}
//                     />
//                     <MiniCard
//                       label="Duration"
//                       value={fmtDuration(detail?.call_duration)}
//                     />
//                     <MiniCard
//                       label="Cost"
//                       value={`$${prettyNum(detail?.cost ?? 0)}`}
//                     />
//                   </div>

//                   {/* Timestamps */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <MiniCard
//                       label="Started"
//                       value={fmtDateTime(
//                         detail?.call_started_at ||
//                           detail?.started_at ||
//                           detail?.startedAt
//                       )}
//                     />
//                     <MiniCard
//                       label="Ended"
//                       value={fmtDateTime(
//                         detail?.call_ended_at ||
//                           detail?.ended_at ||
//                           detail?.endedAt
//                       )}
//                     />
//                   </div>

//                   {/* Recording */}
//                   {detail?.recording_url && detail.recording_url !== "N/A" && (
//                     <div
//                       className="p-3 rounded-xl border"
//                       style={{ background: COLORS.panel, borderColor: COLORS.border }}
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         <PlayCircle size={18} color={COLORS.primary} />
//                         <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
//                           Recording
//                         </div>
//                       </div>
//                       <audio ref={audioRef} controls className="w-full">
//                         <source src={detail.recording_url} />
//                       </audio>
//                       <div
//                         className="mt-2 text-xs flex items-center gap-2"
//                         style={{ color: COLORS.dim }}
//                       >
//                         <button
//                           onClick={() =>
//                             copy(detail.recording_url, "Recording URL copied")
//                           }
//                           className="underline-offset-2 hover:underline"
//                         >
//                           Copy URL
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Assistant & Variables */}
//                   <div
//                     className="p-3 rounded-xl border"
//                     style={{ background: COLORS.panel, borderColor: COLORS.border }}
//                   >
//                     <div
//                       className="text-sm font-semibold mb-2"
//                       style={{ color: COLORS.text }}
//                     >
//                       Assistant
//                     </div>
//                     <div className="text-xs" style={{ color: COLORS.dim }}>
//                       ID: {detail?.assistant?.id || "—"}
//                     </div>
//                     <div className="text-xs" style={{ color: COLORS.dim }}>
//                       Name: {detail?.assistant?.name || "—"}
//                     </div>

//                     <div
//                       className="mt-3 text-sm font-semibold"
//                       style={{ color: COLORS.text }}
//                     >
//                       Variables
//                     </div>
//                     <div
//                       className="mt-1 grid grid-cols-2 gap-2 text-xs"
//                       style={{ color: COLORS.dim }}
//                     >
//                       {detail?.variableValues ? (
//                         Object.entries(detail.variableValues).map(([k, v]) => (
//                           <div key={k} className="truncate">
//                             <span className="opacity-70">{k}:</span>{" "}
//                             {String(v ?? "—")}
//                           </div>
//                         ))
//                       ) : (
//                         <div>—</div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Transcript */}
//                   <div
//                     className="p-3 rounded-xl border"
//                     style={{ background: COLORS.panel, borderColor: COLORS.border }}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div
//                         className="text-sm font-semibold"
//                         style={{ color: COLORS.text }}
//                       >
//                         Transcript
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => probeStatus(detailId)}
//                           className="px-2 py-1.5 rounded-lg text-xs font-semibold border hover:bg-white"
//                           style={{
//                             background: COLORS.card,
//                             color: COLORS.text,
//                             borderColor: COLORS.border,
//                           }}
//                         >
//                           Check Status
//                         </button>
//                         <button
//                           onClick={() => refreshTranscript(detailId)}
//                           className="px-2 py-1.5 rounded-lg text-xs font-semibold border"
//                           style={{
//                             background:
//                               "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))",
//                             color: COLORS.cyan,
//                             borderColor: COLORS.border,
//                           }}
//                         >
//                           Refresh
//                         </button>
//                       </div>
//                     </div>

//                     <div
//                       className="text-xs whitespace-pre-wrap leading-relaxed"
//                       style={{ color: COLORS.dim, maxHeight: 280, overflow: "auto" }}
//                     >
//                       {detail?.transcript && detail.transcript !== "No transcript available"
//                         ? detail.transcript
//                         : "No transcript available"}
//                     </div>
//                   </div>

//                   {/* Danger zone */}
//                   <div className="flex items-center justify-between">
//                     <div className="text-xs" style={{ color: COLORS.dim }}>
//                       Delete this call log (and attempt VAPI deletion)
//                     </div>
//                     <button
//                       onClick={() => askDelete({ call_id: detailId, ...detail })}
//                       className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-red-50"
//                       style={{
//                         background: COLORS.card,
//                         color: COLORS.danger,
//                         borderColor: COLORS.border,
//                       }}
//                     >
//                       <Trash2 size={14} />
//                       &nbsp;Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <DeleteModal
//         open={!!deleteTarget}
//         busy={deleteBusy}
//         call={deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//  * Mobile Card Component
//  * ────────────────────────────────────────────────────────────────────────── */
// function CallCard({ c, onOpen, onDelete }) {
//   return (
//     <div
//       className="rounded-2xl border p-4 flex flex-col gap-3"
//       style={{
//         background: COLORS.card,
//         borderColor: COLORS.border,
//         boxShadow:
//           "0 1px 0 rgba(0,0,0,0.02), 0 8px 24px -16px rgba(99,102,241,0.25)",
//       }}
//     >
//       <div className="flex items-start gap-3">
//         <div
//           className="w-10 h-10 rounded-xl flex items-center justify-center"
//           style={{
//             background:
//               "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.12))",
//             border: `1px solid ${COLORS.border}`,
//           }}
//         >
//           <Phone size={18} color={COLORS.primary} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="font-semibold truncate" style={{ color: COLORS.text }}>
//             {c.customer_name || "—"}
//           </div>
//           <div
//             className="text-xs flex items-center gap-1 mt-0.5"
//             style={{ color: COLORS.dim }}
//           >
//             <span className="opacity-70">ID:</span>
//             <span className="truncate">{c.call_id}</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2 text-sm">
//         <InfoRow label="Number" value={maskPhone(c.customer_number)} />
//         <InfoRow
//           label="Status"
//           value={
//             <span className="inline-flex items-center gap-2">
//               <Badge
//                 color={
//                   c.status === "completed"
//                     ? COLORS.success
//                     : c.status === "failed"
//                     ? COLORS.danger
//                     : COLORS.primary
//                 }
//                 text={c.status || "Unknown"}
//               />
//             </span>
//           }
//         />
//         <InfoRow label="Reason" value={c.call_ended_reason ?? "—"} />
//         <InfoRow label="Started" value={fmtDateTime(c.call_started_at)} />
//         <InfoRow label="Duration" value={fmtDuration(c.call_duration)} />
//         <InfoRow label="Lead ID" value={c.lead_id ?? "—"} />
//       </div>

//       <div className="flex items-center justify-end gap-2 pt-1">
//         <button
//           onClick={onOpen}
//           className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-white"
//           style={{
//             background: COLORS.card,
//             color: COLORS.text,
//             borderColor: COLORS.border,
//           }}
//           title="Open details"
//         >
//           <span className="inline-flex items-center gap-1.5">
//             <Info size={14} color={COLORS.purple} />
//             Detail
//           </span>
//         </button>
//         <button
//           onClick={onDelete}
//           className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-red-50"
//           style={{
//             background: COLORS.card,
//             color: COLORS.danger,
//             borderColor: COLORS.border,
//           }}
//           title="Delete"
//         >
//           <span className="inline-flex items-center gap-1.5">
//             <Trash2 size={14} />
//             Delete
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// }

// function InfoRow({ label, value }) {
//   return (
//     <div
//       className="flex flex-col rounded-lg p-2"
//       style={{
//         background: COLORS.panel,
//         border: `1px dashed ${COLORS.border}`,
//       }}
//     >
//       <span
//         className="text-[10px] uppercase tracking-wide font-semibold"
//         style={{ color: COLORS.dim }}
//       >
//         {label}
//       </span>
//       <span className="text-sm truncate" style={{ color: COLORS.text }}>
//         {value}
//       </span>
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//  * Delete Modal
//  * ────────────────────────────────────────────────────────────────────────── */
// function DeleteModal({ open, onClose, onConfirm, call, busy }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50">
//       <div
//         className="absolute inset-0 bg-black/30"
//         onClick={() => !busy && onClose?.()}
//       />
//       <div className="absolute inset-0 flex items-end sm:items-center justify-center">
//         <div
//           className="w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden animate-[fadeInUp_0.2s_ease]"
//           style={{ background: COLORS.card, borderColor: COLORS.border }}
//         >
//           {/* Header bar with gradient */}
//           <div
//             className="h-1 w-full"
//             style={{
//               background: `linear-gradient(90deg, ${COLORS.gradFrom}, ${COLORS.gradTo})`,
//             }}
//           />
//           <div className="px-5 py-4 flex items-start gap-3">
//             <div
//               className="w-10 h-10 rounded-xl flex items-center justify-center"
//               style={{
//                 background: "rgba(220,38,38,0.08)",
//                 border: `1px solid ${COLORS.border}`,
//               }}
//             >
//               <Trash2 size={18} color={COLORS.danger} />
//             </div>
//             <div className="flex-1">
//               <div
//                 className="text-lg font-bold"
//                 style={{ color: COLORS.text }}
//               >
//                 Delete call log?
//               </div>
//               <div className="text-sm mt-1" style={{ color: COLORS.dim }}>
//                 This will remove the call from your database and attempt to
//                 delete it from VAPI as well. This action cannot be undone.
//               </div>
//               <div className="mt-3 text-xs rounded-lg p-3"
//                    style={{ background: COLORS.panel, border: `1px dashed ${COLORS.border}`, color: COLORS.dim }}>
//                 <div><span className="font-semibold text-slate-700">Call ID:</span> {call?.call_id ?? "—"}</div>
//                 <div><span className="font-semibold text-slate-700">Number:</span> {maskPhone(call?.customer_number)}</div>
//                 <div><span className="font-semibold text-slate-700">Customer:</span> {call?.customer_name || "—"}</div>
//               </div>
//             </div>
//             <button
//               onClick={() => !busy && onClose?.()}
//               className="p-2 rounded-lg border hover:bg-slate-50"
//               style={{ borderColor: COLORS.border }}
//               aria-label="Close delete modal"
//             >
//               <X size={16} color={COLORS.dim} />
//             </button>
//           </div>

//           <div className="px-5 pb-5 flex items-center justify-end gap-2">
//             <button
//               onClick={() => !busy && onClose?.()}
//               disabled={busy}
//               className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-white disabled:opacity-50"
//               style={{
//                 background: COLORS.card,
//                 color: COLORS.text,
//                 borderColor: COLORS.border,
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               disabled={busy}
//               className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
//               style={{
//                 background: `linear-gradient(135deg, ${COLORS.gradFrom}, ${COLORS.gradTo})`,
//                 boxShadow:
//                   "0 10px 20px -10px rgba(79,70,229,0.5), 0 8px 24px -12px rgba(6,182,212,0.45)",
//               }}
//             >
//               {busy ? (
//                 <span className="inline-flex items-center gap-2">
//                   <Loader2 size={16} className="animate-spin" />
//                   Deleting…
//                 </span>
//               ) : (
//                 <span className="inline-flex items-center gap-2">
//                   <Trash2 size={16} />
//                   Delete
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* simple keyframes fallback */}
//       <style>{`
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(12px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//  * Small UI pieces
//  * ────────────────────────────────────────────────────────────────────────── */
// function Badge({ color, text }) {
//   return (
//     <span
//       className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
//       style={{ background: `${color}1A`, color }}
//     >
//       {text}
//     </span>
//   );
// }

// function StatTile({ icon, label, value }) {
//   return (
//     <div
//       className="p-3 rounded-xl border"
//       style={{ background: COLORS.card, borderColor: COLORS.border }}
//     >
//       <div className="flex items-center gap-2">
//         {icon}
//         <div className="text-xs" style={{ color: COLORS.dim }}>
//           {label}
//         </div>
//       </div>
//       <div className="mt-1 text-lg font-bold" style={{ color: COLORS.text }}>
//         {value}
//       </div>
//     </div>
//   );
// }

// function MiniCard({ label, value }) {
//   return (
//     <div
//       className="p-3 rounded-xl border"
//       style={{ background: COLORS.card, borderColor: COLORS.border }}
//     >
//       <div className="text-xs" style={{ color: COLORS.dim }}>{label}</div>
//       <div className="text-sm font-semibold truncate" style={{ color: COLORS.text }}>
//         {value}
//       </div>
//     </div>
//   );
// }

















// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   PhoneCall,
//   RefreshCw,
//   Trash2,
//   Eye,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   DollarSign,
//   PlayCircle,
//   PauseCircle,
//   Download,
//   Link as LinkIcon,
//   User as UserIcon,
//   Phone as PhoneIcon,
//   History,
//   Radio,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// /* ---------------------------------------------------------
//    Config
// --------------------------------------------------------- */

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// const R = {
//   CALL_LOGS: `${API_URL}/api/admin/call-logs`,
//   VAPI_CALL_LOGS: `${API_URL}/api/admin/vapi-call-logs`,
//   CALL_LOG: (id) => `${API_URL}/api/admin/call-logs/${id}`,
// };

// const neonGrad = "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600";

// /* ---------------------------------------------------------
//    Helpers
// --------------------------------------------------------- */

// const toAbsoluteUrl = (url) => {
//   if (!url) return null;
//   if (/^https?:\/\//i.test(url)) return url;
//   const path = url.startsWith("/") ? url : `/${url}`;
//   return `${API_URL}${path}`;
// };

// const fmtDate = (s) => {
//   if (!s) return "—";
//   try {
//     const d = new Date(s);
//     if (Number.isNaN(d.getTime())) return String(s);
//     return d.toLocaleString();
//   } catch {
//     return String(s);
//   }
// };

// const fmtDur = (secs) => {
//   const n = Number(secs || 0);
//   const m = Math.floor(n / 60);
//   const s = Math.floor(n % 60);
//   return `${m}m ${s}s`;
// };

// const safeLower = (v) => String(v ?? "").toLowerCase();

// /* Normalize local + VAPI rows to a common shape */
// function normalizeRows(localRows = [], vapiRows = []) {
//   const out = [];
//   const byCallId = new Map();

//   // Add local rows
//   for (const r of localRows) {
//     const row = {
//       _key: r.call_id ? `local:${r.call_id}` : `local-id:${r.id}`,
//       source: "local",
//       id: r.id,
//       call_id: r.call_id || null,
//       started_at: r.call_started_at || null,
//       ended_at: r.call_ended_at || null,
//       duration: r.call_duration ?? null,
//       cost: r.cost ?? null,
//       status: r.status || "",
//       ended_reason: r.call_ended_reason || "",
//       transferred: !!r.is_transferred,
//       criteria_satisfied: r.criteria_satisfied,
//       customer_name: r.customer_name || "",
//       customer_number: r.customer_number || "",
//       user: r.user || null,
//       assistant_id: null,
//       phone_number_id: null,
//       summary: null,
//       transcript: null,
//       analysis: null,
//       recording_url: null,
//       created_at: null,
//       updated_at: null,
//     };
//     out.push(row);
//     if (row.call_id) byCallId.set(row.call_id, row);
//   }

//   // Merge VAPI rows
//   for (const r of vapiRows) {
//     const existing = r.call_id && byCallId.get(r.call_id);
//     const vapi = {
//       _key: r.call_id ? `vapi:${r.call_id}` : `vapi-id:${r.id}`,
//       source: "vapi",
//       id: r.id,
//       call_id: r.call_id || null,
//       started_at: r.started_at || r.created_at || null,
//       ended_at: r.ended_at || null,
//       duration: r.duration ?? null,
//       cost: r.cost ?? null,
//       status: r.status || "",
//       ended_reason: r.ended_reason || "",
//       transferred: !!r.is_transferred,
//       criteria_satisfied: r.criteria_satisfied,
//       customer_name: r.customer_name || "",
//       customer_number: r.customer_number || "",
//       user: null,
//       assistant_id: r.assistant_id || null,
//       phone_number_id: r.phone_number_id || null,
//       summary: r.summary || null,
//       transcript: r.transcript || null,
//       analysis: r.analysis || null,
//       recording_url: r.recording_url || null,
//       created_at: r.created_at || null,
//       updated_at: r.updated_at || null,
//     };

//     if (existing) {
//       // Merge extras into the local row (keep local id for deletion)
//       existing.assistant_id = existing.assistant_id || vapi.assistant_id;
//       existing.phone_number_id = existing.phone_number_id || vapi.phone_number_id;
//       existing.summary = vapi.summary ?? existing.summary;
//       existing.transcript = vapi.transcript ?? existing.transcript;
//       existing.analysis = vapi.analysis ?? existing.analysis;
//       existing.recording_url = vapi.recording_url ?? existing.recording_url;
//       existing.created_at = vapi.created_at ?? existing.created_at;
//       existing.updated_at = vapi.updated_at ?? existing.updated_at;
//       existing.source = "both";
//     } else {
//       out.push(vapi);
//       if (vapi.call_id) byCallId.set(vapi.call_id, vapi);
//     }
//   }

//   // Stable sort: newest first
//   out.sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0));
//   return out;
// }

// function downloadText(filename, text) {
//   const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// function toCSV(rows) {
//   const headers = [
//     "id",
//     "call_id",
//     "source",
//     "customer_name",
//     "customer_number",
//     "started_at",
//     "ended_at",
//     "duration",
//     "cost",
//     "status",
//     "ended_reason",
//     "transferred",
//     "criteria_satisfied",
//     "assistant_id",
//     "phone_number_id",
//     "user_id",
//     "user_name",
//     "user_email",
//   ];
//   const escape = (v) => {
//     const s = v == null ? "" : String(v);
//     return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
//   };
//   const lines = [headers.join(",")];
//   for (const r of rows) {
//     lines.push(
//       [
//         r.id ?? "",
//         r.call_id ?? "",
//         r.source ?? "",
//         r.customer_name ?? "",
//         r.customer_number ?? "",
//         r.started_at ?? "",
//         r.ended_at ?? "",
//         r.duration ?? "",
//         r.cost ?? "",
//         r.status ?? "",
//         r.ended_reason ?? "",
//         r.transferred ?? "",
//         r.criteria_satisfied ?? "",
//         r.assistant_id ?? "",
//         r.phone_number_id ?? "",
//         r.user?.id ?? "",
//         r.user?.name ?? "",
//         r.user?.email ?? "",
//       ]
//         .map(escape)
//         .join(",")
//     );
//   }
//   return lines.join("\n");
// }

// /* ---------------------------------------------------------
//    Main Page
// --------------------------------------------------------- */

// export default function AdminCallHistory() {
//   const [localRows, setLocalRows] = useState([]);
//   const [vapiRows, setVapiRows] = useState([]);
//   const [rows, setRows] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const [includeVapi, setIncludeVapi] = useState(true);

//   const [q, setQ] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [transferFilter, setTransferFilter] = useState("all"); // all|yes|no
//   const [satisfiedFilter, setSatisfiedFilter] = useState("all"); // all|yes|no
//   const [dateFrom, setDateFrom] = useState(""); // yyyy-mm-dd
//   const [dateTo, setDateTo] = useState("");
//   const [minDur, setMinDur] = useState("");
//   const [maxDur, setMaxDur] = useState("");
//   const [minCost, setMinCost] = useState("");
//   const [maxCost, setMaxCost] = useState("");
//   const [sortKey, setSortKey] = useState("started_at");
//   const [sortDir, setSortDir] = useState("desc"); // asc|desc

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // details + delete
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [activeRow, setActiveRow] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   // impersonation banner
//   const [impersonationInfo, setImpersonationInfo] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("impersonation_info") || "null");
//     } catch {
//       return null;
//     }
//   });

//   const fetchAll = useCallback(async () => {
//     if (impersonationInfo) {
//       setErr("You're in impersonation mode. Exit impersonation to use admin tools.");
//       setLocalRows([]);
//       setVapiRows([]);
//       setRows([]);
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setErr("No auth token found.");
//       toast.error("No authentication token found.");
//       setLocalRows([]);
//       setVapiRows([]);
//       setRows([]);
//       return;
//     }

//     try {
//       setLoading(true);
//       setErr("");
//       const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

//       const [resLocal, resVapi] = await Promise.all([
//         fetch(R.CALL_LOGS, { headers, mode: "cors" }),
//         includeVapi ? fetch(R.VAPI_CALL_LOGS, { headers, mode: "cors" }) : Promise.resolve(null),
//       ]);

//       if (!resLocal?.ok) {
//         const txt = await resLocal.text();
//         throw new Error(`Call logs HTTP ${resLocal.status}${txt ? ` — ${txt}` : ""}`);
//       }
//       const localData = await resLocal.json();
//       const localList = Array.isArray(localData?.call_logs) ? localData.call_logs : [];

//       let vapiList = [];
//       if (includeVapi && resVapi) {
//         if (!resVapi.ok) {
//           const txt = await resVapi.text();
//           throw new Error(`VAPI call logs HTTP ${resVapi.status}${txt ? ` — ${txt}` : ""}`);
//         }
//         const vapiData = await resVapi.json();
//         vapiList = Array.isArray(vapiData?.call_logs) ? vapiData.call_logs : [];
//       }

//       setLocalRows(localList);
//       setVapiRows(vapiList);
//       setRows(normalizeRows(localList, vapiList));
//     } catch (e) {
//       setErr(e?.message || "Failed to load call logs");
//       toast.error(e?.message || "Failed to load call logs");
//     } finally {
//       setLoading(false);
//     }
//   }, [includeVapi, impersonationInfo]);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   // Rebuild normalized rows when toggling VAPI after first load
//   useEffect(() => {
//     setRows(normalizeRows(localRows, includeVapi ? vapiRows : []));
//   }, [localRows, vapiRows, includeVapi]);

//   /* ---------------- Filtering / Sorting / Paging ---------------- */

//   const statusesAvailable = useMemo(() => {
//     const set = new Set(rows.map((r) => (r.status || "").toLowerCase()).filter(Boolean));
//     return ["all", ...Array.from(set)];
//   }, [rows]);

//   const filtered = useMemo(() => {
//     let out = [...rows];

//     if (q.trim()) {
//       const s = q.trim().toLowerCase();
//       out = out.filter((r) =>
//         safeLower(r.customer_name).includes(s) ||
//         safeLower(r.customer_number).includes(s) ||
//         safeLower(r.call_id).includes(s) ||
//         safeLower(r.user?.email).includes(s) ||
//         safeLower(r.user?.name).includes(s)
//       );
//     }

//     if (statusFilter !== "all") {
//       out = out.filter((r) => safeLower(r.status) === statusFilter);
//     }

//     if (transferFilter !== "all") {
//       const want = transferFilter === "yes";
//       out = out.filter((r) => !!r.transferred === want);
//     }

//     if (satisfiedFilter !== "all") {
//       const want = satisfiedFilter === "yes";
//       out = out.filter((r) => Boolean(r.criteria_satisfied) === want);
//     }

//     if (dateFrom) {
//       const t = new Date(dateFrom).getTime();
//       out = out.filter((r) => new Date(r.started_at || 0).getTime() >= t);
//     }
//     if (dateTo) {
//       const t = new Date(dateTo).getTime();
//       out = out.filter((r) => new Date(r.started_at || 0).getTime() <= t);
//     }

//     const minD = Number(minDur || 0);
//     const maxD = Number(maxDur || 0);
//     if (minDur) out = out.filter((r) => Number(r.duration || 0) >= minD);
//     if (maxDur) out = out.filter((r) => Number(r.duration || 0) <= maxD);

//     const minC = Number(minCost || 0);
//     const maxC = Number(maxCost || 0);
//     if (minCost) out = out.filter((r) => Number(r.cost || 0) >= minC);
//     if (maxCost) out = out.filter((r) => Number(r.cost || 0) <= maxC);

//     // sort
//     out.sort((a, b) => {
//       const dir = sortDir === "asc" ? 1 : -1;
//       const va = a[sortKey];
//       const vb = b[sortKey];
//       if (sortKey.includes("date") || sortKey.includes("started")) {
//         return dir * (new Date(va || 0) - new Date(vb || 0));
//       }
//       return dir * ((va ?? 0) - (vb ?? 0));
//     });

//     return out;
//   }, [rows, q, statusFilter, transferFilter, satisfiedFilter, dateFrom, dateTo, minDur, maxDur, minCost, maxCost, sortKey, sortDir]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [q, statusFilter, transferFilter, satisfiedFilter, dateFrom, dateTo, minDur, maxDur, minCost, maxCost, sortKey, sortDir]);

//   // Stats (on filtered rows)
//   const stats = useMemo(() => {
//     const total = filtered.length;
//     const transferred = filtered.filter((r) => r.transferred).length;
//     const notTransferred = total - transferred;
//     const totalDuration = filtered.reduce((acc, r) => acc + Number(r.duration || 0), 0);
//     const totalCost = filtered.reduce((acc, r) => acc + Number(r.cost || 0), 0);
//     return { total, transferred, notTransferred, totalDuration, totalCost };
//   }, [filtered]);

//   /* ---------------- Actions ---------------- */

//   const openDetails = (row) => {
//     setActiveRow(row);
//     setDetailsOpen(true);
//   };

//   const askDelete = (row) => setConfirmDeleteId(row?.id || null);

//   const doDelete = async () => {
//     const id = confirmDeleteId;
//     if (!id) return;
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("No authentication token found.");

//     try {
//       setDeletingId(id);
//       const res = await fetch(R.CALL_LOG(id), {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//       });
//       const data = await res.json();
//       if (!res.ok || !data?.success) {
//         throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
//       }
//       toast.success("🗑️ Call log deleted");
//       setConfirmDeleteId(null);
//       // Remove from localRows only (that's all we can delete). Rebuild normalized set.
//       setLocalRows((prev) => prev.filter((r) => r.id !== id));
//     } catch (e) {
//       toast.error(e?.message || "Delete failed");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const exportCSV = () => {
//     const csv = toCSV(filtered);
//     const stamp = new Date().toISOString().replace(/[:.]/g, "-");
//     downloadText(`call-history-${stamp}.csv`, csv);
//   };

//   const clearFilters = () => {
//     setQ("");
//     setStatusFilter("all");
//     setTransferFilter("all");
//     setSatisfiedFilter("all");
//     setDateFrom("");
//     setDateTo("");
//     setMinDur("");
//     setMaxDur("");
//     setMinCost("");
//     setMaxCost("");
//     setSortKey("started_at");
//     setSortDir("desc");
//   };

//   const exitImpersonation = () => {
//     const adminToken = localStorage.getItem("admin_token_backup");
//     if (!adminToken) {
//       toast.error("No admin backup token found.");
//       return;
//     }
//     localStorage.setItem("token", adminToken);
//     localStorage.removeItem("admin_token_backup");
//     localStorage.removeItem("impersonation_info");
//     setImpersonationInfo(null);
//     toast.success("↩️ Exited impersonation");
//     window.location.reload();
//   };

//   /* ---------------------------------------------------------
//      UI
//   --------------------------------------------------------- */

//   return (
//     <div className="min-h-screen bg-slate-50 overflow-x-hidden">
//       {/* Impersonation banner */}
//       {impersonationInfo && (
//         <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-3 sm:px-4 py-2 text-amber-800">
//           <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-2">
//             <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
//               <History className="h-4 w-4 shrink-0" />
//               <span className="font-semibold shrink-0">Impersonation active:</span>
//               <span className="truncate">
//                 Acting as <b className="break-all">{impersonationInfo.acting_as?.email}</b>
//               </span>
//             </div>
//             <Button
//               onClick={exitImpersonation}
//               variant="outline"
//               className="text-amber-800 border-amber-300 hover:bg-amber-100"
//               size="sm"
//             >
//               Exit
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* soft glows */}
//       <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
//         <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
//         <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
//       </div>

//       <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
//         {/* Header */}
//         <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-7 shadow-xl relative overflow-hidden">
//           <motion.div
//             className="absolute inset-0 opacity-20"
//             style={{
//               background:
//                 "radial-gradient(60% 60% at 0% 0%, rgba(14,165,233,0.25), transparent), radial-gradient(60% 60% at 100% 100%, rgba(37,99,235,0.25), transparent)",
//             }}
//             initial={{ opacity: 0.1 }}
//             animate={{ opacity: 0.2 }}
//             transition={{ duration: 1.2 }}
//             aria-hidden
//           />
//           <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div className="flex items-center gap-4 min-w-0">
//               <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-content-center rounded-2xl bg-gradient-to-br from-white to-slate-50 ring-1 ring-slate-200 shadow-inner shrink-0">
//                 <PhoneCall className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
//                   <span className={`bg-clip-text text-transparent ${neonGrad}`}>
//                     Call History
//                   </span>
//                 </h1>
//                 <p className="text-xs sm:text-sm text-slate-600">
//                   View, filter, export, and manage call logs from local DB and VAPI.
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <div className="text-xs sm:text-sm flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
//                 <Radio className="h-4 w-4" />
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={includeVapi}
//                     onChange={(e) => setIncludeVapi(e.target.checked)}
//                     disabled={!!impersonationInfo}
//                   />
//                   Include VAPI logs
//                 </label>
//               </div>
//               <Button onClick={exportCSV} disabled={filtered.length === 0 || !!impersonationInfo}>
//                 <Download className="mr-2 h-4 w-4" /> Export CSV
//               </Button>
//               <Button onClick={fetchAll} disabled={loading || !!impersonationInfo}>
//                 {loading ? (
//                   <>
//                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing…
//                   </>
//                 ) : (
//                   <>
//                     <RefreshCw className="mr-2 h-4 w-4" /> Refresh
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           <StatCard label="Total Calls" value={stats.total} Icon={History} tone="blue" />
//           <StatCard label="Transferred" value={stats.transferred} Icon={CheckCircle2} tone="cyan" />
//           <StatCard label="Not Transferred" value={stats.notTransferred} Icon={XCircle} tone="blue" />
//           <motion.div
//             initial={{ y: 8, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
//           >
//             <div className="relative z-10 flex items-center gap-3">
//               <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-inner ring-1 ring-cyan-200/60`}>
//                 <DollarSign className="h-7 w-7" />
//               </div>
//               <div>
//                 <div className="text-xs uppercase tracking-wider text-slate-500">Total Duration / Cost</div>
//                 <div className="text-sm font-black text-slate-900">{fmtDur(stats.totalDuration)} • ${stats.totalCost.toFixed(2)}</div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Controls */}
//         <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 lg:p-5 shadow-xl">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <div className="flex flex-1 items-center gap-2 min-w-0">
//               <div className="relative flex-1 min-w-0">
//                 <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 <input
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                   placeholder="Search by name, number, call id, user"
//                   className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   disabled={!!impersonationInfo}
//                 />
//               </div>
//               <div className="hidden md:flex items-center gap-2 text-slate-500 shrink-0">
//                 <Filter className="h-4 w-4" />
//                 <span className="text-xs font-medium">Filters</span>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 disabled={!!impersonationInfo}
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 {statusesAvailable.map((s) => (
//                   <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>
//                 ))}
//               </select>
//               <select
//                 value={transferFilter}
//                 onChange={(e) => setTransferFilter(e.target.value)}
//                 disabled={!!impersonationInfo}
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="all">All transfers</option>
//                 <option value="yes">Transferred</option>
//                 <option value="no">Not transferred</option>
//               </select>
//               <select
//                 value={satisfiedFilter}
//                 onChange={(e) => setSatisfiedFilter(e.target.value)}
//                 disabled={!!impersonationInfo}
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="all">All criteria</option>
//                 <option value="yes">Criteria satisfied</option>
//                 <option value="no">Not satisfied</option>
//               </select>

//               <div className="flex items-center gap-2 flex-wrap">
//                 <input
//                   type="datetime-local"
//                   value={dateFrom}
//                   onChange={(e) => setDateFrom(e.target.value)}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   title="From"
//                 />
//                 <input
//                   type="datetime-local"
//                   value={dateTo}
//                   onChange={(e) => setDateTo(e.target.value)}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   title="To"
//                 />
//               </div>

//               <div className="flex items-center gap-2 flex-wrap">
//                 <input
//                   type="number"
//                   placeholder="Min sec"
//                   value={minDur}
//                   onChange={(e) => setMinDur(e.target.value)}
//                   className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max sec"
//                   value={maxDur}
//                   onChange={(e) => setMaxDur(e.target.value)}
//                   className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Min $"
//                   value={minCost}
//                   onChange={(e) => setMinCost(e.target.value)}
//                   className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max $"
//                   value={maxCost}
//                   onChange={(e) => setMaxCost(e.target.value)}
//                   className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <select
//                   value={sortKey}
//                   onChange={(e) => setSortKey(e.target.value)}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 >
//                   <option value="started_at">Sort: Start time</option>
//                   <option value="duration">Sort: Duration</option>
//                   <option value="cost">Sort: Cost</option>
//                 </select>
//                 <select
//                   value={sortDir}
//                   onChange={(e) => setSortDir(e.target.value)}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 >
//                   <option value="desc">Desc</option>
//                   <option value="asc">Asc</option>
//                 </select>
//               </div>

//               {(q || statusFilter !== "all" || transferFilter !== "all" || satisfiedFilter !== "all" || dateFrom || dateTo || minDur || maxDur || minCost || maxCost || sortKey !== "started_at" || sortDir !== "desc") && (
//                 <Button onClick={clearFilters} className="text-slate-700">
//                   Clear
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Table/Card List */}
//         <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
//           {/* header */}
//           <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
//             <div className="flex items-center gap-2 min-w-0">
//               <div className="grid h-8 w-8 place-content-center rounded-xl bg-blue-600 text-white shrink-0">
//                 <PhoneCall className="h-4 w-4" />
//               </div>
//               <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
//                 All Calls ({filtered.length})
//               </h2>
//             </div>
//             <div className="flex items-center gap-2 text-xs text-slate-500">
//               <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//               Live
//             </div>
//           </div>

//           {/* impersonation overlay */}
//           {impersonationInfo ? (
//             <div className="grid place-content-center py-16 px-4 text-center">
//               <div className="grid h-20 w-20 place-content-center rounded-full bg-amber-100 mb-4 mx-auto">
//                 <History className="h-9 w-9 text-amber-500" />
//               </div>
//               <div className="text-base sm:text-lg font-semibold text-slate-700">
//                 Exit impersonation to access admin data
//               </div>
//               <div className="mt-3">
//                 <Button onClick={exitImpersonation} variant="primary">Exit Impersonation</Button>
//               </div>
//             </div>
//           ) : loading ? (
//             <div className="grid place-content-center py-16">
//               <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
//               <div className="text-sm text-slate-600">Loading calls…</div>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="grid place-content-center py-16 px-4">
//               <div className="grid h-20 w-20 place-content-center rounded-full bg-slate-100 mb-4">
//                 <PhoneIcon className="h-9 w-9 text-slate-400" />
//               </div>
//               <div className="text-lg font-semibold text-slate-700">No results</div>
//               <div className="text-sm text-slate-500">Try clearing filters or search</div>
//             </div>
//           ) : (
//             <>
//               {/* DESKTOP TABLE (≥xl) */}
//               <div className="hidden xl:block">
//                 <div className="w-full">
//                   <table className="w-full">
//                     <thead className="bg-slate-50 border-b border-slate-200">
//                       <tr>
//                         <Th>Caller</Th>
//                         <Th>User</Th>
//                         <Th>Start</Th>
//                         <Th>Duration</Th>
//                         <Th>Status</Th>
//                         <Th>Transferred</Th>
//                         <Th>Cost</Th>
//                         <Th>Source</Th>
//                         <Th>Actions</Th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                       {currentItems.map((r) => (
//                         <tr key={r._key} className="hover:bg-slate-50/60 transition-colors">
//                           <Td>
//                             <div className="min-w-0">
//                               <div className="text-sm font-bold text-slate-900 truncate">
//                                 {r.customer_name || "—"}
//                               </div>
//                               <div className="text-[11px] text-slate-500 break-all flex items-center gap-1">
//                                 <PhoneIcon className="h-3.5 w-3.5" /> {r.customer_number || "—"}
//                               </div>
//                               {r.call_id && (
//                                 <div className="text-[11px] text-slate-500 break-all">CID: {r.call_id}</div>
//                               )}
//                             </div>
//                           </Td>
//                           <Td>
//                             {r.user ? (
//                               <div className="min-w-0">
//                                 <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1">
//                                   <UserIcon className="h-3.5 w-3.5" /> {r.user.name}
//                                 </div>
//                                 <div className="text-[11px] text-slate-500 break-all">{r.user.email}</div>
//                               </div>
//                             ) : (
//                               <span className="text-xs text-slate-500">—</span>
//                             )}
//                           </Td>
//                           <Td>
//                             <div className="text-xs text-slate-800">{fmtDate(r.started_at)}</div>
//                             <div className="text-[11px] text-slate-500">{fmtDate(r.ended_at)}</div>
//                           </Td>
//                           <Td>
//                             <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
//                               <Clock className="h-3.5 w-3.5" /> {fmtDur(r.duration)}
//                             </div>
//                           </Td>
//                           <Td>
//                             {r.status ? (
//                               <Pill className="border bg-blue-100 text-blue-700 border-blue-200">
//                                 {r.status}
//                               </Pill>
//                             ) : (
//                               <Pill className="border bg-slate-100 text-slate-700 border-slate-200">—</Pill>
//                             )}
//                             {r.ended_reason && (
//                               <div className="text-[11px] text-slate-500 mt-1">{r.ended_reason}</div>
//                             )}
//                           </Td>
//                           <Td>
//                             {r.transferred ? (
//                               <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">
//                                 <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Yes
//                               </Pill>
//                             ) : (
//                               <Pill className="border bg-red-100 text-red-700 border-red-200">
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> No
//                               </Pill>
//                             )}
//                           </Td>
//                           <Td>
//                             <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
//                               <DollarSign className="h-3.5 w-3.5" /> {Number(r.cost || 0).toFixed(2)}
//                             </div>
//                           </Td>
//                           <Td>
//                             <Pill className="border bg-slate-100 text-slate-700 border-slate-200">
//                               {r.source}
//                             </Pill>
//                           </Td>
//                           <Td>
//                             <div className="flex flex-wrap gap-2 text-slate-700">
//                               <Button onClick={() => openDetails(r)} variant="outline" size="sm" title="View details">
//                                 <Eye className="h-4 w-4" />
//                               </Button>
//                               {r.source !== "vapi" && (
//                                 <Button onClick={() => askDelete(r)} variant="danger" size="sm" title="Delete">
//                                   {deletingId === r.id ? (
//                                     <RefreshCw className="h-4 w-4 animate-spin" />
//                                   ) : (
//                                     <Trash2 className="h-4 w-4" />
//                                   )}
//                                 </Button>
//                               )}
//                             </div>
//                           </Td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* CARD GRID (<xl) */}
//               <div className="xl:hidden p-3 sm:p-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                   {currentItems.map((r, idx) => (
//                     <div key={r._key} className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 overflow-hidden">
//                       {idx === 0 && <NeonRail />}
//                       <div className="min-w-0">
//                         <div className="text-base font-bold text-slate-900 truncate flex items-center gap-2">
//                           <PhoneIcon className="h-4 w-4 text-slate-500" /> {r.customer_name || "—"}
//                         </div>
//                         <div className="mt-0.5 text-sm text-slate-600 break-all">{r.customer_number || "—"}</div>
//                         {r.call_id && (
//                           <div className="mt-1 text-[11px] text-slate-500 break-all">CID: {r.call_id}</div>
//                         )}
//                         <div className="mt-2 flex flex-wrap items-center gap-2">
//                           <span className="inline-flex px-2 py-1 rounded-full border bg-slate-100 text-slate-700 text-[11px] font-semibold">
//                             {fmtDate(r.started_at)}
//                           </span>
//                           <span className="inline-flex px-2 py-1 rounded-full border bg-slate-100 text-slate-700 text-[11px] font-semibold">
//                             <Clock className="h-3.5 w-3.5 mr-1" /> {fmtDur(r.duration)}
//                           </span>
//                           {r.status && (
//                             <span className="inline-flex px-2 py-1 rounded-full border bg-blue-100 text-blue-700 text-[11px] font-semibold">
//                               {r.status}
//                             </span>
//                           )}
//                           <span className="inline-flex px-2 py-1 rounded-full border bg-slate-100 text-slate-700 text-[11px] font-semibold">
//                             {r.source}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="mt-4 flex flex-wrap gap-2">
//                         <Button onClick={() => openDetails(r)} size="sm" className="grow sm:grow-0">
//                           <Eye className="h-4 w-4 mr-1" /> View
//                         </Button>
//                         {r.source !== "vapi" && (
//                           <Button onClick={() => askDelete(r)} variant="danger" size="sm" className="grow sm:grow-0">
//                             {deletingId === r.id ? (
//                               <>
//                                 <RefreshCw className="h-4 w-4 animate-spin mr-1" /> Deleting…
//                               </>
//                             ) : (
//                               <>
//                                 <Trash2 className="h-4 w-4 mr-1" /> Delete
//                               </>
//                             )}
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Pagination */}
//               {filtered.length > itemsPerPage && (
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50">
//                   <div className="text-sm text-slate-600">
//                     Showing <b>{indexOfFirstItem + 1}</b>–<b>{Math.min(indexOfLastItem, filtered.length)}</b> of <b>{filtered.length}</b>
//                   </div>
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
//                       <ChevronLeft className="h-4 w-4 mr-1" /> Prev
//                     </Button>
//                     <div className="flex items-center gap-1 flex-wrap">
//                       {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         let pageNumber;
//                         if (totalPages <= 5) pageNumber = i + 1;
//                         else if (currentPage <= 3) pageNumber = i + 1;
//                         else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
//                         else pageNumber = currentPage - 2 + i;
//                         if (pageNumber < 1 || pageNumber > totalPages) return null;
//                         const active = currentPage === pageNumber;
//                         return (
//                           <button
//                             key={pageNumber}
//                             onClick={() => setCurrentPage(pageNumber)}
//                             className={`px-3 py-2 text-sm font-semibold rounded-xl ${
//                               active
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50"
//                             }`}
//                           >
//                             {pageNumber}
//                           </button>
//                         );
//                       })}
//                     </div>
//                     <Button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
//                       Next <ChevronRight className="h-4 w-4 ml-1" />
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Confirm Delete */}
//       <AnimatePresence>
//         {confirmDeleteId && (
//           <Modal onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
//             <div className="text-slate-800">
//               Are you sure you want to delete this call log? This action cannot be undone.
//             </div>
//             <div className="mt-6 flex flex-wrap justify-end gap-2">
//               <Button onClick={() => setConfirmDeleteId(null)} variant="subtle">Cancel</Button>
//               <Button onClick={doDelete} disabled={deletingId === confirmDeleteId} variant="danger">
//                 {deletingId === confirmDeleteId ? (
//                   <>
//                     <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Deleting…
//                   </>
//                 ) : (
//                   "Delete"
//                 )}
//               </Button>
//             </div>
//           </Modal>
//         )}
//       </AnimatePresence>

//       {/* Details Drawer */}
//       <AnimatePresence>
//         {detailsOpen && activeRow && (
//           <Drawer onClose={() => setDetailsOpen(false)} title="Call Details">
//             <div className="space-y-6">
//               {/* Top card */}
//               <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <div className="flex items-start justify-between gap-3 min-w-0">
//                   <div className="min-w-0">
//                     <div className="font-bold text-slate-900 truncate flex items-center gap-2">
//                       <PhoneIcon className="h-4 w-4 text-slate-500" /> {activeRow.customer_name || "—"}
//                     </div>
//                     <div className="text-sm text-slate-600 break-all">{activeRow.customer_number || "—"}</div>
//                     {activeRow.call_id && (
//                       <div className="text-[11px] text-slate-500 break-all mt-1">Call ID: {activeRow.call_id}</div>
//                     )}
//                     <div className="mt-2 flex flex-wrap gap-2 items-center">
//                       <Pill className="border bg-slate-100 text-slate-700 border-slate-200">{activeRow.source}</Pill>
//                       {activeRow.status && (
//                         <Pill className="border bg-blue-100 text-blue-700 border-blue-200">{activeRow.status}</Pill>
//                       )}
//                       {activeRow.transferred ? (
//                         <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">Transferred</Pill>
//                       ) : (
//                         <Pill className="border bg-red-100 text-red-700 border-red-200">Not transferred</Pill>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right text-sm text-slate-700">
//                     <div><b>Start:</b> {fmtDate(activeRow.started_at)}</div>
//                     <div><b>End:</b> {fmtDate(activeRow.ended_at)}</div>
//                     <div className="mt-1"><b>Duration:</b> {fmtDur(activeRow.duration)}</div>
//                     <div><b>Cost:</b> ${Number(activeRow.cost || 0).toFixed(2)}</div>
//                   </div>
//                 </div>

//                 {activeRow.user && (
//                   <div className="mt-3 text-xs text-slate-600">
//                     <div className="flex items-center gap-1">
//                       <UserIcon className="h-3.5 w-3.5" />
//                       <span className="font-semibold">User:</span> {activeRow.user.name} 
//                     </div>
//                     <div className="ml-5 break-all">{activeRow.user.email}</div>
//                   </div>
//                 )}

//                 {(activeRow.assistant_id || activeRow.phone_number_id) && (
//                   <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
//                     {activeRow.assistant_id && <div><b>Assistant ID:</b> {activeRow.assistant_id}</div>}
//                     {activeRow.phone_number_id && <div><b>Phone Number ID:</b> {activeRow.phone_number_id}</div>}
//                   </div>
//                 )}
//               </div>

//               {/* Recording */}
//               {activeRow.recording_url && (
//                 <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                   <div className="text-sm font-semibold text-slate-900 mb-2">Recording</div>
//                   <audio controls className="w-full">
//                     <source src={toAbsoluteUrl(activeRow.recording_url) || activeRow.recording_url} />
//                   </audio>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     <a
//                       href={toAbsoluteUrl(activeRow.recording_url) || activeRow.recording_url}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 text-xs inline-flex items-center gap-1"
//                     >
//                       <LinkIcon className="h-3.5 w-3.5" /> Open recording URL
//                     </a>
//                   </div>
//                 </div>
//               )}

//               {/* Summary */}
//               {activeRow.summary && (
//                 <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                   <div className="text-sm font-semibold text-slate-900 mb-2">Summary</div>
//                   <div className="text-sm text-slate-700 whitespace-pre-wrap">{activeRow.summary}</div>
//                 </div>
//               )}

//               {/* Transcript */}
//               {activeRow.transcript && (
//                 <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm font-semibold text-slate-900">Transcript</div>
//                     <Button
//                       onClick={() => downloadText(`transcript-${activeRow.call_id || activeRow.id}.txt`, activeRow.transcript)}
//                       size="sm"
//                     >
//                       <Download className="h-4 w-4 mr-2" /> Save .txt
//                     </Button>
//                   </div>
//                   <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap max-h-72 overflow-auto">
//                     {activeRow.transcript}
//                   </div>
//                 </div>
//               )}

//               {/* Analysis (JSON-ish) */}
//               {activeRow.analysis && (
//                 <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                   <div className="text-sm font-semibold text-slate-900 mb-2">Analysis</div>
//                   <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-auto max-h-64">
//                     {typeof activeRow.analysis === "string" ? activeRow.analysis : JSON.stringify(activeRow.analysis, null, 2)}
//                   </pre>
//                 </div>
//               )}
//             </div>
//           </Drawer>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// /* ---------------------------------------------------------
//    Subcomponents
// --------------------------------------------------------- */

// function StatCard({ label, value, Icon, tone = "blue" }) {
//   const ring = tone === "blue" ? "ring-blue-200/60" : "ring-cyan-200/60";
//   const bg = tone === "blue" ? "from-blue-600 to-cyan-500" : "from-cyan-500 to-blue-600";
//   return (
//     <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
//       <div className="relative z-10 flex items-center gap-3">
//         <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} text-white shadow-inner ring-1 ${ring}`}>
//           <Icon className="h-7 w-7" />
//         </div>
//         <div>
//           <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
//           <div className="text-2xl font-black text-slate-900">{value}</div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function Pill({ children, className = "" }) {
//   return (
//     <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
//       {children}
//     </span>
//   );
// }

// function NeonRail() {
//   return (
//     <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
//   );
// }

// function Button({ children, className = "", variant = "outline", size = "md", ...props }) {
//   const base = "inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
//   const sizes = { sm: "text-xs px-2.5 py-1.5", md: "text-sm px-3 py-2", lg: "text-sm px-4 py-2.5" };
//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm",
//     danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm",
//     outline: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 shadow-sm",
//     subtle: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
//     ghost: "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent",
//   };
//   return (
//     <button {...props} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
//       {children}
//     </button>
//   );
// }

// function Th({ children }) {
//   return (
//     <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">{children}</th>
//   );
// }
// function Td({ children }) {
//   return <td className="px-4 py-4 align-middle">{children}</td>;
// }

// function Modal({ children, onClose, title }) {
//   return (
//     <motion.div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
//       <motion.div className="relative z-10 w-full max-w-lg sm:max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl" initial={{ y: 20, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 10, scale: 0.98, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 22 }}>
//         <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
//           <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
//           <button onClick={onClose} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100">✕</button>
//         </div>
//         <div className="px-4 sm:px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>
//       </motion.div>
//     </motion.div>
//   );
// }

// function Drawer({ children, onClose, title }) {
//   return (
//     <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
//       <motion.aside className="absolute right-0 top-0 h-full w-full sm:max-w-md md:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 220, damping: 28 }}>
//         <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
//           <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
//           <button onClick={onClose} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100" aria-label="Close">✕</button>
//         </div>
//         <div className="p-4 sm:p-5 overflow-y-auto">{children}</div>
//       </motion.aside>
//     </motion.div>
//   );
// }




















"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  PhoneCall,
  RefreshCw,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Download,
  Link as LinkIcon,
  User as UserIcon,
  Phone as PhoneIcon,
  History,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

/* ---------------------------------------------------------
   Config
--------------------------------------------------------- */

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

const R = {
  CALL_LOGS: `${API_URL}/api/admin/call-logs`,
  VAPI_CALL_LOGS: `${API_URL}/api/admin/vapi-call-logs`,
  CALL_LOG: (id) => `${API_URL}/api/admin/call-logs/${id}`,
};

const neonGrad = "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600";

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${API_URL}${path}`;
};

const unknown = (v) => {
  if (v === undefined || v === null) return "Unknown";
  const s = String(v).trim();
  return s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined" ? "Unknown" : s;
};

const fmtDate = (s) => {
  if (!s) return "Unknown";
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return d.toLocaleString();
  } catch {
    return "Unknown";
  }
};

const fmtDur = (secs) => {
  if (secs === null || secs === undefined || Number.isNaN(Number(secs))) return "Unknown";
  const n = Number(secs);
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}m ${s}s`;
};

const safeLower = (v) => String(v ?? "").toLowerCase();

/* Normalize local + VAPI rows to a common shape */
function normalizeRows(localRows = [], vapiRows = []) {
  const out = [];
  const byCallId = new Map();

  // Add local rows
  for (const r of localRows) {
    const row = {
      _key: r.call_id ? `local:${r.call_id}` : `local-id:${r.id}`,
      source: "local",
      id: r.id,
      call_id: r.call_id || null,
      started_at: r.call_started_at || null,
      ended_at: r.call_ended_at || null,
      duration: r.call_duration ?? null,
      cost: r.cost ?? null,
      status: r.status || "",
      ended_reason: r.call_ended_reason || "",
      transferred: !!r.is_transferred,
      criteria_satisfied: r.criteria_satisfied,
      customer_name: r.customer_name || "",
      customer_number: r.customer_number || "",
      user: r.user || null,
      assistant_id: null,
      phone_number_id: null,
      summary: null,
      transcript: null,
      analysis: null,
      recording_url: null,
      created_at: null,
      updated_at: null,
    };
    out.push(row);
    if (row.call_id) byCallId.set(row.call_id, row);
  }

  // Merge VAPI rows
  for (const r of vapiRows) {
    const existing = r.call_id && byCallId.get(r.call_id);
    const vapi = {
      _key: r.call_id ? `vapi:${r.call_id}` : `vapi-id:${r.id}`,
      source: "vapi",
      id: r.id,
      call_id: r.call_id || null,
      started_at: r.started_at || r.created_at || null,
      ended_at: r.ended_at || null,
      duration: r.duration ?? null,
      cost: r.cost ?? null,
      status: r.status || "",
      ended_reason: r.ended_reason || "",
      transferred: !!r.is_transferred,
      criteria_satisfied: r.criteria_satisfied,
      customer_name: r.customer_name || "",
      customer_number: r.customer_number || "",
      user: null,
      assistant_id: r.assistant_id || null,
      phone_number_id: r.phone_number_id || null,
      summary: r.summary || null,
      transcript: r.transcript || null,
      analysis: r.analysis || null,
      recording_url: r.recording_url || null,
      created_at: r.created_at || null,
      updated_at: r.updated_at || null,
    };

    if (existing) {
      // Merge extras into the local row (keep local id for deletion)
      existing.assistant_id = existing.assistant_id || vapi.assistant_id;
      existing.phone_number_id = existing.phone_number_id || vapi.phone_number_id;
      existing.summary = vapi.summary ?? existing.summary;
      existing.transcript = vapi.transcript ?? existing.transcript;
      existing.analysis = vapi.analysis ?? existing.analysis;
      existing.recording_url = vapi.recording_url ?? existing.recording_url;
      existing.created_at = vapi.created_at ?? existing.created_at;
      existing.updated_at = vapi.updated_at ?? existing.updated_at;
      existing.source = "both";
    } else {
      out.push(vapi);
      if (vapi.call_id) byCallId.set(vapi.call_id, vapi);
    }
  }

  // Stable sort: newest first
  out.sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0));
  return out;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCSV(rows) {
  const headers = [
    "id",
    "call_id",
    "source",
    "customer_name",
    "customer_number",
    "started_at",
    "ended_at",
    "duration",
    "cost",
    "status",
    "ended_reason",
    "transferred",
    "criteria_satisfied",
    "assistant_id",
    "phone_number_id",
    "user_id",
    "user_name",
    "user_email",
  ];
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id ?? "",
        r.call_id ?? "",
        r.source ?? "",
        r.customer_name ?? "",
        r.customer_number ?? "",
        r.started_at ?? "",
        r.ended_at ?? "",
        r.duration ?? "",
        r.cost ?? "",
        r.status ?? "",
        r.ended_reason ?? "",
        r.transferred ?? "",
        r.criteria_satisfied ?? "",
        r.assistant_id ?? "",
        r.phone_number_id ?? "",
        r.user?.id ?? "",
        r.user?.name ?? "",
        r.user?.email ?? "",
      ]
        .map(escape)
        .join(",")
    );
  }
  return lines.join("\n");
}

/* ---------------------------------------------------------
   Main Page
--------------------------------------------------------- */

export default function AdminCallHistory() {
  const [localRows, setLocalRows] = useState([]);
  const [vapiRows, setVapiRows] = useState([]);
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [includeVapi, setIncludeVapi] = useState(true);

  // Main filters only
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transferFilter, setTransferFilter] = useState("all"); // all|yes|no
  const [dateFrom, setDateFrom] = useState(""); // yyyy-mm-ddTHH:mm
  const [dateTo, setDateTo] = useState("");     // yyyy-mm-ddTHH:mm
  const [sortKey, setSortKey] = useState("started_at");
  const [sortDir, setSortDir] = useState("desc"); // asc|desc

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // details + delete
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // impersonation banner
  const [impersonationInfo, setImpersonationInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("impersonation_info") || "null");
    } catch {
      return null;
    }
  });

  const fetchAll = useCallback(async () => {
    if (impersonationInfo) {
      setErr("You're in impersonation mode. Exit impersonation to use admin tools.");
      setLocalRows([]);
      setVapiRows([]);
      setRows([]);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErr("No auth token found.");
      toast.error("No authentication token found.");
      setLocalRows([]);
      setVapiRows([]);
      setRows([]);
      return;
    }

    try {
      setLoading(true);
      setErr("");
      const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

      const [resLocal, resVapi] = await Promise.all([
        fetch(R.CALL_LOGS, { headers, mode: "cors" }),
        includeVapi ? fetch(R.VAPI_CALL_LOGS, { headers, mode: "cors" }) : Promise.resolve(null),
      ]);

      if (!resLocal?.ok) {
        const txt = await resLocal.text();
        throw new Error(`Call logs HTTP ${resLocal.status}${txt ? ` — ${txt}` : ""}`);
      }
      const localData = await resLocal.json();
      const localList = Array.isArray(localData?.call_logs) ? localData.call_logs : [];

      let vapiList = [];
      if (includeVapi && resVapi) {
        if (!resVapi.ok) {
          const txt = await resVapi.text();
          throw new Error(`VAPI call logs HTTP ${resVapi.status}${txt ? ` — ${txt}` : ""}`);
        }
        const vapiData = await resVapi.json();
        vapiList = Array.isArray(vapiData?.call_logs) ? vapiData.call_logs : [];
      }

      setLocalRows(localList);
      setVapiRows(vapiList);
      setRows(normalizeRows(localList, vapiList));
    } catch (e) {
      setErr(e?.message || "Failed to load call logs");
      toast.error(e?.message || "Failed to load call logs");
    } finally {
      setLoading(false);
    }
  }, [includeVapi, impersonationInfo]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Rebuild normalized rows when toggling VAPI after first load
  useEffect(() => {
    setRows(normalizeRows(localRows, includeVapi ? vapiRows : []));
  }, [localRows, vapiRows, includeVapi]);

  /* ---------------- Filtering / Sorting / Paging ---------------- */

  const statusesAvailable = useMemo(() => {
    const set = new Set(rows.map((r) => (r.status || "").toLowerCase()).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    let out = [...rows];

    if (q.trim()) {
      const s = q.trim().toLowerCase();
      out = out.filter((r) =>
        safeLower(r.customer_name).includes(s) ||
        safeLower(r.customer_number).includes(s) ||
        safeLower(r.call_id).includes(s) ||
        safeLower(r.user?.email).includes(s) ||
        safeLower(r.user?.name).includes(s)
      );
    }

    if (statusFilter !== "all") {
      out = out.filter((r) => safeLower(r.status) === statusFilter);
    }

    if (transferFilter !== "all") {
      const want = transferFilter === "yes";
      out = out.filter((r) => !!r.transferred === want);
    }

    if (dateFrom) {
      const t = new Date(dateFrom).getTime();
      out = out.filter((r) => new Date(r.started_at || 0).getTime() >= t);
    }
    if (dateTo) {
      const t = new Date(dateTo).getTime();
      out = out.filter((r) => new Date(r.started_at || 0).getTime() <= t);
    }

    // sort
    out.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const va = a[sortKey];
      const vb = b[sortKey];
      if (sortKey.includes("date") || sortKey.includes("started")) {
        return dir * (new Date(va || 0) - new Date(vb || 0));
      }
      return dir * ((va ?? 0) - (vb ?? 0));
    });

    return out;
  }, [rows, q, statusFilter, transferFilter, dateFrom, dateTo, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, statusFilter, transferFilter, dateFrom, dateTo, sortKey, sortDir]);

  // Stats (on filtered rows)
  const stats = useMemo(() => {
    const total = filtered.length;
    const transferred = filtered.filter((r) => r.transferred).length;
    const notTransferred = total - transferred;
    const totalDuration = filtered.reduce((acc, r) => acc + (Number.isFinite(Number(r.duration)) ? Number(r.duration) : 0), 0);
    const totalCost = filtered.reduce((acc, r) => acc + (Number.isFinite(Number(r.cost)) ? Number(r.cost) : 0), 0);
    return { total, transferred, notTransferred, totalDuration, totalCost };
  }, [filtered]);

  /* ---------------- Actions ---------------- */

  const openDetails = (row) => {
    setActiveRow(row);
    setDetailsOpen(true);
  };

  const askDelete = (row) => setConfirmDeleteId(row?.id || null);

  const doDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    try {
      setDeletingId(id);
      const res = await fetch(R.CALL_LOG(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }
      toast.success("🗑️ Call log deleted");
      setConfirmDeleteId(null);
      // Remove from localRows only (that's all we can delete). Rebuild normalized set.
      setLocalRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    const csv = toCSV(filtered);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadText(`call-history-${stamp}.csv`, csv);
  };

  const clearFilters = () => {
    setQ("");
    setStatusFilter("all");
    setTransferFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortKey("started_at");
    setSortDir("desc");
  };

  const exitImpersonation = () => {
    const adminToken = localStorage.getItem("admin_token_backup");
    if (!adminToken) {
      toast.error("No admin backup token found.");
      return;
    }
    localStorage.setItem("token", adminToken);
    localStorage.removeItem("admin_token_backup");
    localStorage.removeItem("impersonation_info");
    setImpersonationInfo(null);
    toast.success("↩️ Exited impersonation");
    window.location.reload();
  };

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Impersonation banner */}
      {impersonationInfo && (
        <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-3 sm:px-4 py-2 text-amber-800">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <History className="h-4 w-4 shrink-0" />
              <span className="font-semibold shrink-0">Impersonation active:</span>
              <span className="truncate">
                Acting as <b className="break-all">{unknown(impersonationInfo.acting_as?.email)}</b>
              </span>
            </div>
            <Button
              onClick={exitImpersonation}
              variant="outline"
              className="text-amber-800 border-amber-300 hover:bg-amber-100"
              size="sm"
            >
              Exit
            </Button>
          </div>
        </div>
      )}

      {/* soft glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Header */}
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
                <PhoneCall className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
                  <span className={`bg-clip-text text-transparent ${neonGrad}`}>
                    Call History
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  View, filter, export, and manage call logs from local DB and VAPI.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xs sm:text-sm flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Radio className="h-4 w-4" />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeVapi}
                    onChange={(e) => setIncludeVapi(e.target.checked)}
                    disabled={!!impersonationInfo}
                    aria-label="Include VAPI logs"
                  />
                  Include VAPI logs
                </label>
              </div>
              <Button onClick={exportCSV} disabled={filtered.length === 0 || !!impersonationInfo} aria-label="Export CSV">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button onClick={fetchAll} disabled={loading || !!impersonationInfo} aria-label="Refresh">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing…
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Calls" value={stats.total} Icon={History} tone="blue" />
          <StatCard label="Transferred" value={stats.transferred} Icon={CheckCircle2} tone="cyan" />
          <StatCard label="Not Transferred" value={stats.notTransferred} Icon={XCircle} tone="blue" />
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-inner ring-1 ring-cyan-200/60`}>
                <DollarSign className="h-7 w-7" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Total Duration / Cost</div>
                <div className="text-sm font-black text-slate-900">
                  {fmtDur(stats.totalDuration)} • ${stats.totalCost.toFixed(2)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls: simplified & aligned */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 lg:p-5 shadow-xl">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
            {/* Search */}
            <div className="md:col-span-4">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Name, number, call id, user"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!!impersonationInfo}
                  aria-label="Search calls"
                />
              </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={!!impersonationInfo}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Filter by status"
              >
                {statusesAvailable.map((s) => (
                  <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>
                ))}
              </select>
            </div>

            {/* Transferred */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Transferred</label>
              <select
                value={transferFilter}
                onChange={(e) => setTransferFilter(e.target.value)}
                disabled={!!impersonationInfo}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Filter by transfer"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Date range */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">From</label>
              <input
                type="datetime-local"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="From date"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">To</label>
              <input
                type="datetime-local"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="To date"
              />
            </div>

            {/* Sort */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Sort</label>
              <div className="flex items-center gap-2">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Sort by"
                >
                  <option value="started_at">Start time</option>
                  <option value="duration">Duration</option>
                  <option value="cost">Cost</option>
                </select>
                <select
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value)}
                  className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Sort order"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>

            {/* Clear (right-aligned) */}
            <div className="md:col-span-12 flex justify-end">
              {(q || statusFilter !== "all" || transferFilter !== "all" || dateFrom || dateTo || sortKey !== "started_at" || sortDir !== "desc") && (
                <Button onClick={clearFilters} className="text-slate-700" aria-label="Clear filters">
                  <Filter className="h-4 w-4 mr-2" /> Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table/Card List */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-8 w-8 place-content-center rounded-xl bg-blue-600 text-white shrink-0">
                <PhoneCall className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                All Calls ({filtered.length})
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>

          {/* impersonation overlay */}
          {impersonationInfo ? (
            <div className="grid place-content-center py-16 px-4 text-center">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-amber-100 mb-4 mx-auto">
                <History className="h-9 w-9 text-amber-500" />
              </div>
              <div className="text-base sm:text-lg font-semibold text-slate-700">
                Exit impersonation to access admin data
              </div>
              <div className="mt-3">
                <Button onClick={exitImpersonation} variant="primary">Exit Impersonation</Button>
              </div>
            </div>
          ) : loading ? (
            <div className="grid place-content-center py-16">
              <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
              <div className="text-sm text-slate-600">Loading calls…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid place-content-center py-16 px-4">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-slate-100 mb-4">
                <PhoneIcon className="h-9 w-9 text-slate-400" />
              </div>
              <div className="text-lg font-semibold text-slate-700">No results</div>
              <div className="text-sm text-slate-500">Try clearing filters or search</div>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE (≥xl) */}
              <div className="hidden xl:block">
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <Th>Caller</Th>
                        <Th>User</Th>
                        <Th>Start</Th>
                        <Th>Duration</Th>
                        <Th>Status</Th>
                        <Th>Transferred</Th>
                        <Th>Cost</Th>
                        <Th>Source</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentItems.map((r) => {
                        const costLabel = r.cost === null || r.cost === undefined || Number.isNaN(Number(r.cost))
                          ? "Unknown"
                          : Number(r.cost).toFixed(2);
                        return (
                          <tr key={r._key} className="hover:bg-slate-50/60 transition-colors">
                            <Td>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-900 truncate">
                                  {unknown(r.customer_name)}
                                </div>
                                <div className="text-[11px] text-slate-500 break-all flex items-center gap-1">
                                  <PhoneIcon className="h-3.5 w-3.5" /> {unknown(r.customer_number)}
                                </div>
                                <div className="text-[11px] text-slate-500 break-all">CID: {unknown(r.call_id)}</div>
                              </div>
                            </Td>
                            <Td>
                              {r.user ? (
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1">
                                    <UserIcon className="h-3.5 w-3.5" /> {unknown(r.user.name)}
                                  </div>
                                  <div className="text-[11px] text-slate-500 break-all">{unknown(r.user.email)}</div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500">Unknown</span>
                              )}
                            </Td>
                            <Td>
                              <div className="text-xs text-slate-800">{fmtDate(r.started_at)}</div>
                              <div className="text-[11px] text-slate-500">{fmtDate(r.ended_at)}</div>
                            </Td>
                            <Td>
                              <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                                <Clock className="h-3.5 w-3.5" /> {fmtDur(r.duration)}
                              </div>
                            </Td>
                            <Td>
                              <Pill className="border bg-blue-100 text-blue-700 border-blue-200">
                                {unknown(r.status)}
                              </Pill>
                              <div className="text-[11px] text-slate-500 mt-1">Reason: {unknown(r.ended_reason)}</div>
                            </Td>
                            <Td>
                              {r.transferred ? (
                                <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">
                                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Yes
                                </Pill>
                              ) : (
                                <Pill className="border bg-red-100 text-red-700 border-red-200">
                                  <XCircle className="mr-1 h-3.5 w-3.5" /> No
                                </Pill>
                              )}
                            </Td>
                            <Td>
                              <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                                <DollarSign className="h-3.5 w-3.5" /> {costLabel}
                              </div>
                            </Td>
                            <Td>
                              <Pill className="border bg-slate-100 text-slate-700 border-slate-200">
                                {unknown(r.source)}
                              </Pill>
                            </Td>
                            <Td>
                              <div className="flex flex-wrap gap-2 text-slate-700">
                                <Button onClick={() => openDetails(r)} variant="outline" size="sm" title="View details" aria-label="View details">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {r.source !== "vapi" && (
                                  <Button onClick={() => askDelete(r)} variant="danger" size="sm" title="Delete" aria-label="Delete">
                                    {deletingId === r.id ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARD GRID (<xl) */}
              <div className="xl:hidden p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {currentItems.map((r, idx) => {
                    const costLabel = r.cost === null || r.cost === undefined || Number.isNaN(Number(r.cost))
                      ? "Unknown"
                      : Number(r.cost).toFixed(2);
                    return (
                      <div key={r._key} className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 overflow-hidden">
                        {idx === 0 && <NeonRail />}
                        <div className="min-w-0">
                          <div className="text-base font-bold text-slate-900 truncate flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-slate-500" /> {unknown(r.customer_name)}
                          </div>
                          <div className="mt-0.5 text-sm text-slate-600 break-all">{unknown(r.customer_number)}</div>
                          <div className="mt-1 text-[11px] text-slate-500 break-all">CID: {unknown(r.call_id)}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex px-2 py-1 rounded-full border bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {fmtDate(r.started_at)}
                            </span>
                            <span className="inline-flex px-2 py-1 rounded-full border bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              <Clock className="h-3.5 w-3.5 mr-1" /> {fmtDur(r.duration)}
                            </span>
                            <span className="inline-flex px-2 py-1 rounded-full border bg-blue-100 text-blue-700 text-[11px] font-semibold">
                              {unknown(r.status)}
                            </span>
                            <span className="inline-flex px-2 py-1 rounded-full border bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {unknown(r.source)}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">Reason: {unknown(r.ended_reason)}</div>
                          <div className="mt-1 text-[11px] text-slate-500">Cost: {costLabel}</div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button onClick={() => openDetails(r)} size="sm" className="grow sm:grow-0" aria-label="View">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          {r.source !== "vapi" && (
                            <Button onClick={() => askDelete(r)} variant="danger" size="sm" className="grow sm:grow-0" aria-label="Delete">
                              {deletingId === r.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin mr-1" /> Deleting…
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {filtered.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50">
                  <div className="text-sm text-slate-600">
                    Showing <b>{indexOfFirstItem + 1}</b>–<b>{Math.min(indexOfLastItem, filtered.length)}</b> of <b>{filtered.length}</b>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <div className="flex items-center gap-1 flex-wrap">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) pageNumber = i + 1;
                        else if (currentPage <= 3) pageNumber = i + 1;
                        else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
                        else pageNumber = currentPage - 2 + i;
                        if (pageNumber < 1 || pageNumber > totalPages) return null;
                        const active = currentPage === pageNumber;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`px-3 py-2 text-sm font-semibold rounded-xl ${
                              active
                                ? "bg-blue-600 text-white"
                                : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50"
                            }`}
                            aria-label={`Page ${pageNumber}`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>
                    <Button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDeleteId && (
          <Modal onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
            <div className="text-slate-800">
              Are you sure you want to delete this call log? This action cannot be undone.
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button onClick={() => setConfirmDeleteId(null)} variant="subtle">Cancel</Button>
              <Button onClick={doDelete} disabled={deletingId === confirmDeleteId} variant="danger">
                {deletingId === confirmDeleteId ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Details Drawer */}
      <AnimatePresence>
        {detailsOpen && activeRow && (
          <Drawer onClose={() => setDetailsOpen(false)} title="Call Details">
            <div className="space-y-6">
              {/* Top card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-slate-500" /> {unknown(activeRow.customer_name)}
                    </div>
                    <div className="text-sm text-slate-600 break-all">{unknown(activeRow.customer_number)}</div>
                    <div className="text-[11px] text-slate-500 break-all mt-1">Call ID: {unknown(activeRow.call_id)}</div>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <Pill className="border bg-slate-100 text-slate-700 border-slate-200">{unknown(activeRow.source)}</Pill>
                      <Pill className="border bg-blue-100 text-blue-700 border-blue-200">{unknown(activeRow.status)}</Pill>
                      {activeRow.transferred ? (
                        <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">Transferred</Pill>
                      ) : (
                        <Pill className="border bg-red-100 text-red-700 border-red-200">Not transferred</Pill>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-700">
                    <div><b>Start:</b> {fmtDate(activeRow.started_at)}</div>
                    <div><b>End:</b> {fmtDate(activeRow.ended_at)}</div>
                    <div className="mt-1"><b>Duration:</b> {fmtDur(activeRow.duration)}</div>
                    <div>
                      <b>Cost:</b>{" "}
                      {activeRow.cost === null || activeRow.cost === undefined || Number.isNaN(Number(activeRow.cost))
                        ? "Unknown"
                        : `$${Number(activeRow.cost).toFixed(2)}`}
                    </div>
                  </div>
                </div>

                {activeRow.user ? (
                  <div className="mt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" />
                      <span className="font-semibold">User:</span> {unknown(activeRow.user.name)}
                    </div>
                    <div className="ml-5 break-all">{unknown(activeRow.user.email)}</div>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" />
                      <span className="font-semibold">User:</span> Unknown
                    </div>
                  </div>
                )}

                {(activeRow.assistant_id || activeRow.phone_number_id) && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div><b>Assistant ID:</b> {unknown(activeRow.assistant_id)}</div>
                    <div><b>Phone Number ID:</b> {unknown(activeRow.phone_number_id)}</div>
                  </div>
                )}

                <div className="mt-2 text-xs text-slate-600">
                  <b>End Reason:</b> {unknown(activeRow.ended_reason)}
                </div>
              </div>

              {/* Recording */}
              {activeRow.recording_url && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900 mb-2">Recording</div>
                  <audio controls className="w-full">
                    <source src={toAbsoluteUrl(activeRow.recording_url) || activeRow.recording_url} />
                  </audio>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={toAbsoluteUrl(activeRow.recording_url) || activeRow.recording_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-xs inline-flex items-center gap-1"
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> Open recording URL
                    </a>
                  </div>
                </div>
              )}

              {/* Summary */}
              {activeRow.summary && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900 mb-2">Summary</div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">{activeRow.summary}</div>
                </div>
              )}

              {/* Transcript */}
              {activeRow.transcript && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Transcript</div>
                    <Button
                      onClick={() => downloadText(`transcript-${activeRow.call_id || activeRow.id}.txt`, activeRow.transcript)}
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" /> Save .txt
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap max-h-72 overflow-auto">
                    {activeRow.transcript}
                  </div>
                </div>
              )}

              {/* Analysis (JSON-ish) */}
              {activeRow.analysis && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900 mb-2">Analysis</div>
                  <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-auto max-h-64">
                    {typeof activeRow.analysis === "string" ? activeRow.analysis : JSON.stringify(activeRow.analysis, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------
   Subcomponents
--------------------------------------------------------- */

function StatCard({ label, value, Icon, tone = "blue" }) {
  const ring = tone === "blue" ? "ring-blue-200/60" : "ring-cyan-200/60";
  const bg = tone === "blue" ? "from-blue-600 to-cyan-500" : "from-cyan-500 to-blue-600";
  return (
    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="relative z-10 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} text-white shadow-inner ring-1 ${ring}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
          <div className="text-2xl font-black text-slate-900">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function NeonRail() {
  return (
    <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
  );
}

function Button({ children, className = "", variant = "outline", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
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

function Th({ children }) {
  return (
    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">{children}</th>
  );
}
function Td({ children }) {
  return <td className="px-4 py-4 align-middle">{children}</td>;
}

function Modal({ children, onClose, title }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div className="relative z-10 w-full max-w-lg sm:max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl" initial={{ y: 20, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 10, scale: 0.98, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 22 }}>
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
          <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100" aria-label="Close">✕</button>
        </div>
        <div className="px-4 sm:px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Drawer({ children, onClose, title }) {
  return (
    <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.aside className="absolute right-0 top-0 h-full w-full sm:max-w-md md:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 220, damping: 28 }}>
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
          <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100" aria-label="Close">✕</button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto">{children}</div>
      </motion.aside>
    </motion.div>
  );
}
