
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
//   Download,
//   Radio,
// } from "lucide-react";
// import { toast } from "react-toastify";

// /* ──────────────────────────────────────────────────────────────────────────
//  * Config
//  * ────────────────────────────────────────────────────────────────────────── */
// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
// // If your FastAPI router is mounted under /api, keep this as-is.
// // Adjust to match your server (e.g., "/api/calls" or just "").
// const API_BASE = `${API_URL}/api`;

// const COLORS = {
//   bg: "#0B1020",          // deep navy
//   panel: "#0F1629",       // dark slate
//   card: "#111A33",        // card surface
//   border: "#21304f",      // border tint
//   text: "#E5E7EB",        // gray-200
//   dim: "#9CA3AF",         // gray-400
//   primary: "#6D6AFB",     // indigo-ish neon
//   success: "#22C55E",     // green-500
//   danger: "#EF4444",      // red-500
//   amber: "#F59E0B",       // amber-500
//   cyan: "#22D3EE",        // cyan-400
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
//   return `+${cleaned.slice(0, cleaned.length - 10)} (${tail.slice(0, 3)}) ${tail.slice(3, 6)}-${tail.slice(6)}`;
// };

// /* Build admin-safe endpoints (no /user/*) */
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

//   /* Actions */
//   async function doDelete(id) {
//     if (!id) return;
//     if (!confirm("Delete this call log? This also attempts to delete the VAPI call.")) return;
//     try {
//       const res = await authedFetch(endpoints.DELETE_CALL(id), { method: "DELETE" });
//       await res.json().catch(() => {});
//       toast.success("Call log deleted");
//       setCalls((prev) => prev.filter((c) => c.call_id !== id));
//       if (detailId === id) closeDetail();
//     } catch (err) {
//       toast.error(`Delete failed: ${err.message}`);
//     }
//   }

//   async function refreshTranscript(id) {
//     try {
//       setBusyAction(true);
//       const res = await authedFetch(endpoints.REFRESH_TRANSCRIPT(id), { method: "POST" });
//       const data = await res.json();
//       toast.success(data?.message || "Transcript refreshed");
//       // If detail drawer open, merge in new transcript
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
//       {/* Top bar */}
//       <div className="sticky top-0 z-30 border-b/20 backdrop-blur supports-[backdrop-filter]:bg-opacity-60"
//            style={{ background: `${COLORS.bg}CC`, borderColor: COLORS.border }}>
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center"
//                  style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
//               <Phone size={20} color={COLORS.primary} />
//             </div>
//             <div>
//               <div className="text-xl font-bold" style={{ color: COLORS.text }}>
//                 Admin · Phone Calls
//               </div>
//               <div className="text-xs" style={{ color: COLORS.dim }}>
//                 Full control: logs, transcripts, recordings
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPolling((p) => !p)}
//               className={cx(
//                 "px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border transition",
//                 "hover:opacity-90"
//               )}
//               style={{
//                 background: polling ? `${COLORS.primary}22` : COLORS.card,
//                 color: polling ? COLORS.primary : COLORS.text,
//                 borderColor: COLORS.border,
//               }}
//               title={polling ? "Auto-refresh is ON" : "Auto-refresh is OFF"}
//             >
//               <Radio size={16} />
//               {polling ? "Live" : "Paused"}
//             </button>

//             <button
//               onClick={loadAll}
//               className="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border transition hover:opacity-90"
//               style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//             >
//               <RefreshCw size={16} />
//               Refresh
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
//               style={{ background: COLORS.panel, borderColor: COLORS.border }}
//             >
//               <div className="flex flex-col md:flex-row md:items-center gap-3">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color={COLORS.dim} />
//                   <input
//                     value={q}
//                     onChange={(e) => { setQ(e.target.value); setPage(1); }}
//                     placeholder="Search by call id, number, name, status, reason..."
//                     className="w-full pl-10 pr-3 py-2 rounded-lg outline-none"
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
//                     onChange={(e) => { setStatus(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
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
//                     onChange={(e) => { setReason(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
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
//                   <span className="text-xs" style={{ color: COLORS.dim }}>From</span>
//                   <input
//                     type="date"
//                     value={dateFrom}
//                     onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm flex-1"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs" style={{ color: COLORS.dim }}>To</span>
//                   <input
//                     type="date"
//                     value={dateTo}
//                     onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm flex-1"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 mt-3">
//                 <button
//                   onClick={resetFilters}
//                   className="px-3 py-2 rounded-lg text-sm border hover:opacity-90"
//                   style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//                 >
//                   Reset filters
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Top actions */}
//           <div
//             className="rounded-2xl p-4 border space-y-3"
//             style={{ background: COLORS.panel, borderColor: COLORS.border }}
//           >
//             <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
//               Admin Actions
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 onClick={repairMissing}
//                 disabled={busyAction}
//                 className="px-3 py-2 rounded-xl text-sm font-semibold border hover:opacity-90 flex items-center gap-2 justify-center disabled:opacity-50"
//                 style={{ background: COLORS.card, color: COLORS.amber, borderColor: COLORS.border }}
//                 title="Fill call_ended_reason, duration, etc. for incomplete rows"
//               >
//                 {busyAction ? <Loader2 className="animate-spin" size={16} /> : <AlertTriangle size={16} />}
//                 Repair Missing
//               </button>
//               <button
//                 onClick={syncInbound}
//                 disabled={busyAction}
//                 className="px-3 py-2 rounded-xl text-sm font-semibold border hover:opacity-90 flex items-center gap-2 justify-center disabled:opacity-50"
//                 style={{ background: COLORS.card, color: COLORS.cyan, borderColor: COLORS.border }}
//                 title="Sync inbound calls from VAPI for this admin's assistants"
//               >
//                 {busyAction ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
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
//           style={{ background: COLORS.panel, borderColor: COLORS.border }}
//         >
//           {/* Header row */}
//           <div
//             className="grid grid-cols-12 gap-3 px-4 py-3 text-xs border-b"
//             style={{ borderColor: COLORS.border, background: "#0c1326" }}
//           >
//             <div className="col-span-3" style={{ color: COLORS.dim }}>Customer</div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>Number</div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>Status</div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>Started</div>
//             <div className="col-span-1" style={{ color: COLORS.dim }}>Dur</div>
//             <div className="col-span-2 text-right" style={{ color: COLORS.dim }}>Actions</div>
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
//             pageSlice.map((c) => (
//               <div
//                 key={c.call_id}
//                 className="grid grid-cols-12 gap-3 px-4 py-3 border-b hover:bg-white/5 transition"
//                 style={{ borderColor: COLORS.border }}
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div
//                     className="w-9 h-9 rounded-lg flex items-center justify-center"
//                     style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
//                   >
//                     <Phone size={16} color={COLORS.primary} />
//                   </div>
//                   <div className="min-w-0">
//                     <div className="truncate font-semibold" style={{ color: COLORS.text }}>
//                       {c.customer_name || "—"}
//                     </div>
//                     <div className="text-xs truncate" style={{ color: COLORS.dim }}>
//                       ID:&nbsp;
//                       <button
//                         onClick={() => copy(c.call_id, "Call ID copied")}
//                         className="underline-offset-2 hover:underline"
//                         title="Copy call ID"
//                       >
//                         {c.call_id}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-span-2 flex items-center">
//                   <div className="text-sm" style={{ color: COLORS.text }}>{maskPhone(c.customer_number)}</div>
//                 </div>

//                 <div className="col-span-2 flex items-center gap-2">
//                   <Badge
//                     color={c.status === "completed" ? COLORS.success : c.status === "failed" ? COLORS.danger : COLORS.primary}
//                     text={c.status || "Unknown"}
//                   />
//                   <span className="text-xs truncate" style={{ color: COLORS.dim }}>
//                     {c.call_ended_reason ?? "—"}
//                   </span>
//                 </div>

//                 <div className="col-span-2 flex items-center">
//                   <div className="text-sm" style={{ color: COLORS.text }}>{fmtDateTime(c.call_started_at)}</div>
//                 </div>

//                 <div className="col-span-1 flex items-center">
//                   <div className="text-sm" style={{ color: COLORS.text }}>{fmtDuration(c.call_duration)}</div>
//                 </div>

//                 <div className="col-span-2 flex items-center justify-end gap-2">
//                   <button
//                     onClick={() => openCallDetail(c.call_id)}
//                     className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-90 flex items-center gap-2"
//                     style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//                     title="Open details"
//                   >
//                     <Info size={14} />
//                     Detail
//                   </button>
//                   <button
//                     onClick={() => doDelete(c.call_id)}
//                     className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-90 flex items-center gap-2"
//                     style={{ background: "#2a1520", color: COLORS.danger, borderColor: COLORS.border }}
//                     title="Delete"
//                   >
//                     <Trash2 size={14} />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}

//           {/* Footer / Pagination */}
//           {!loading && filtered.length > 0 && (
//             <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0c1326" }}>
//               <div className="text-xs" style={{ color: COLORS.dim }}>
//                 Showing {(pageSafe - 1) * pageSize + 1}–{Math.min(filtered.length, pageSafe * pageSize)} of {filtered.length}
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={pageSafe === 1}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50"
//                   style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//                 >
//                   Prev
//                 </button>
//                 <div className="text-xs" style={{ color: COLORS.dim }}>
//                   {pageSafe} / {totalPages}
//                 </div>
//                 <button
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={pageSafe >= totalPages}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50"
//                   style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
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
//             className="absolute inset-0"
//             style={{ background: "#00000080" }}
//             onClick={closeDetail}
//           />
//           {/* Panel */}
//           <div
//             className="absolute right-0 top-0 h-full w-full sm:w-[540px] shadow-2xl border-l overflow-y-auto"
//             style={{ background: COLORS.panel, borderColor: COLORS.border }}
//           >
//             <div className="sticky top-0 px-4 py-3 flex items-center justify-between border-b"
//                  style={{ background: COLORS.panel, borderColor: COLORS.border }}>
//               <div className="flex items-center gap-2">
//                 <FileAudio size={18} color={COLORS.primary} />
//                 <div className="font-semibold" style={{ color: COLORS.text }}>
//                   Call Detail
//                 </div>
//               </div>
//               <button
//                 onClick={closeDetail}
//                 className="p-2 rounded-lg border hover:opacity-90"
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
//                     <MiniCard label="Status" value={statusProbe?.status || detail?.status || "—"} />
//                     <MiniCard label="Ended Reason" value={detail?.ended_reason || detail?.call_ended_reason || "—"} />
//                     <MiniCard label="Duration" value={fmtDuration(detail?.call_duration)} />
//                     <MiniCard label="Cost" value={`$${prettyNum(detail?.cost ?? 0)}`} />
//                   </div>

//                   {/* Timestamps */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <MiniCard label="Started" value={fmtDateTime(detail?.call_started_at || detail?.started_at || detail?.startedAt)} />
//                     <MiniCard label="Ended" value={fmtDateTime(detail?.call_ended_at || detail?.ended_at || detail?.endedAt)} />
//                   </div>

//                   {/* Recording */}
//                   {detail?.recording_url && detail.recording_url !== "N/A" && (
//                     <div
//                       className="p-3 rounded-xl border"
//                       style={{ background: COLORS.card, borderColor: COLORS.border }}
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
//                       <div className="mt-2 text-xs flex items-center gap-2" style={{ color: COLORS.dim }}>
//                         <button
//                           onClick={() => copy(detail.recording_url, "Recording URL copied")}
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
//                     style={{ background: COLORS.card, borderColor: COLORS.border }}
//                   >
//                     <div className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
//                       Assistant
//                     </div>
//                     <div className="text-xs" style={{ color: COLORS.dim }}>
//                       ID: {detail?.assistant?.id || "—"}
//                     </div>
//                     <div className="text-xs" style={{ color: COLORS.dim }}>
//                       Name: {detail?.assistant?.name || "—"}
//                     </div>

//                     <div className="mt-3 text-sm font-semibold" style={{ color: COLORS.text }}>
//                       Variables
//                     </div>
//                     <div className="mt-1 grid grid-cols-2 gap-2 text-xs" style={{ color: COLORS.dim }}>
//                       {detail?.variableValues ? (
//                         Object.entries(detail.variableValues).map(([k, v]) => (
//                           <div key={k} className="truncate">
//                             <span className="opacity-70">{k}:</span> {String(v ?? "—")}
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
//                     style={{ background: COLORS.card, borderColor: COLORS.border }}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
//                         Transcript
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => probeStatus(detailId)}
//                           className="px-2 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-90"
//                           style={{ background: COLORS.panel, color: COLORS.text, borderColor: COLORS.border }}
//                         >
//                           Check Status
//                         </button>
//                         <button
//                           onClick={() => refreshTranscript(detailId)}
//                           className="px-2 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-90"
//                           style={{ background: COLORS.panel, color: COLORS.cyan, borderColor: COLORS.border }}
//                         >
//                           Refresh
//                         </button>
//                       </div>
//                     </div>

//                     <div className="text-xs whitespace-pre-wrap leading-relaxed"
//                          style={{ color: COLORS.dim, maxHeight: 280, overflow: "auto" }}>
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
//                       onClick={() => doDelete(detailId)}
//                       className="px-3 py-2 rounded-lg text-xs font-semibold border hover:opacity-90"
//                       style={{ background: "#2a1520", color: COLORS.danger, borderColor: COLORS.border }}
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
//       style={{ background: `${color}22`, color }}
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
//         <div className="text-xs" style={{ color: COLORS.dim }}>{label}</div>
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

//   /* Actions */
//   async function doDelete(id) {
//     if (!id) return;
//     if (!confirm("Delete this call log? This also attempts to delete the VAPI call.")) return;
//     try {
//       const res = await authedFetch(endpoints.DELETE_CALL(id), { method: "DELETE" });
//       await res.json().catch(() => {});
//       toast.success("Call log deleted");
//       setCalls((prev) => prev.filter((c) => c.call_id !== id));
//       if (detailId === id) closeDetail();
//     } catch (err) {
//       toast.error(`Delete failed: ${err.message}`);
//     }
//   }

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
//       {/* Top bar */}
//       <div
//         className="sticky top-0 z-30 border-b backdrop-blur"
//         style={{ background: "#ffffffd9", borderColor: COLORS.border }}
//       >
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div
//               className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
//               style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
//             >
//               <Phone size={20} color={COLORS.primary} />
//             </div>
//             <div>
//               <div className="text-xl font-bold" style={{ color: COLORS.text }}>
//                 Admin · Phone Calls
//               </div>
//               <div className="text-xs" style={{ color: COLORS.dim }}>
//                 Full control: logs, transcripts, recordings
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPolling((p) => !p)}
//               className={cx(
//                 "px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border transition",
//                 "hover:opacity-90"
//               )}
//               style={{
//                 background: polling ? "#EEF2FF" : COLORS.card,
//                 color: polling ? COLORS.primary : COLORS.text,
//                 borderColor: COLORS.border,
//               }}
//               title={polling ? "Auto-refresh is ON" : "Auto-refresh is OFF"}
//             >
//               <Radio size={16} />
//               {polling ? "Live" : "Paused"}
//             </button>

//             <button
//               onClick={loadAll}
//               className="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border transition hover:opacity-90"
//               style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//             >
//               <RefreshCw size={16} color={COLORS.purple} />
//               Refresh
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
//               style={{ background: COLORS.panel, borderColor: COLORS.border }}
//             >
//               <div className="flex flex-col md:flex-row md:items-center gap-3">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color={COLORS.dim} />
//                   <input
//                     value={q}
//                     onChange={(e) => { setQ(e.target.value); setPage(1); }}
//                     placeholder="Search by call id, number, name, status, reason..."
//                     className="w-full pl-10 pr-3 py-2 rounded-lg outline-none"
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
//                     onChange={(e) => { setStatus(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
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
//                     onChange={(e) => { setReason(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
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
//                   <span className="text-xs" style={{ color: COLORS.dim }}>From</span>
//                   <input
//                     type="date"
//                     value={dateFrom}
//                     onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm flex-1"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs" style={{ color: COLORS.dim }}>To</span>
//                   <input
//                     type="date"
//                     value={dateTo}
//                     onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
//                     className="px-3 py-2 rounded-lg text-sm flex-1"
//                     style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 mt-3">
//                 <button
//                   onClick={resetFilters}
//                   className="px-3 py-2 rounded-lg text-sm border hover:bg-slate-50 transition"
//                   style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//                 >
//                   Reset filters
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Top actions */}
//           <div
//             className="rounded-2xl p-4 border space-y-3"
//             style={{ background: COLORS.panel, borderColor: COLORS.border }}
//           >
//             <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
//               Admin Actions
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 onClick={repairMissing}
//                 disabled={busyAction}
//                 className="px-3 py-2 rounded-xl text-sm font-semibold border hover:bg-amber-50 transition flex items-center gap-2 justify-center disabled:opacity-50"
//                 style={{ background: COLORS.card, color: COLORS.amber, borderColor: COLORS.border }}
//                 title="Fill call_ended_reason, duration, etc. for incomplete rows"
//               >
//                 {busyAction ? <Loader2 className="animate-spin" size={16} /> : <AlertTriangle size={16} />}
//                 Repair Missing
//               </button>
//               <button
//                 onClick={syncInbound}
//                 disabled={busyAction}
//                 className="px-3 py-2 rounded-xl text-sm font-semibold border hover:bg-cyan-50 transition flex items-center gap-2 justify-center disabled:opacity-50"
//                 style={{ background: COLORS.card, color: COLORS.cyan, borderColor: COLORS.border }}
//                 title="Sync inbound calls from VAPI for this admin's assistants"
//               >
//                 {busyAction ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
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
//           style={{ background: COLORS.card, borderColor: COLORS.border }}
//         >
//           {/* Desktop header row (hidden on small) */}
//           <div
//             className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 text-xs border-b"
//             style={{ borderColor: COLORS.border, background: COLORS.panel }}
//           >
//             <div className="col-span-3" style={{ color: COLORS.dim }}>Customer</div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>Number</div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>Status</div>
//             <div className="col-span-2" style={{ color: COLORS.dim }}>Started</div>
//             <div className="col-span-1" style={{ color: COLORS.dim }}>Dur</div>
//             <div className="col-span-2 text-right" style={{ color: COLORS.dim }}>Actions</div>
//           </div>

//           {/* Body – Desktop GRID */}
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
//                     className="grid grid-cols-12 gap-3 px-4 py-3 border-b hover:bg-slate-50 transition"
//                     style={{ borderColor: COLORS.border, background: idx % 2 ? COLORS.bg : COLORS.row }}
//                   >
//                     <div className="col-span-3 flex items-center gap-3">
//                       <div
//                         className="w-9 h-9 rounded-lg flex items-center justify-center"
//                         style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}
//                       >
//                         <Phone size={16} color={COLORS.primary} />
//                       </div>
//                       <div className="min-w-0">
//                         <div className="truncate font-semibold" style={{ color: COLORS.text }}>
//                           {c.customer_name || "—"}
//                         </div>
//                         <div className="text-xs truncate flex items-center gap-1" style={{ color: COLORS.dim }}>
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
//                       <div className="text-sm" style={{ color: COLORS.text }}>{maskPhone(c.customer_number)}</div>
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
//                       <span className="text-xs truncate" style={{ color: COLORS.dim }}>
//                         {c.call_ended_reason ?? "—"}
//                       </span>
//                     </div>

//                     <div className="col-span-2 flex items-center">
//                       <div className="text-sm" style={{ color: COLORS.text }}>{fmtDateTime(c.call_started_at)}</div>
//                     </div>

//                     <div className="col-span-1 flex items-center">
//                       <div className="text-sm" style={{ color: COLORS.text }}>{fmtDuration(c.call_duration)}</div>
//                     </div>

//                     <div className="col-span-2 flex items-center justify-end gap-2">
//                       <button
//                         onClick={() => openCallDetail(c.call_id)}
//                         className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-50 flex items-center gap-2"
//                         style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//                         title="Open details"
//                       >
//                         <Info size={14} color={COLORS.purple} />
//                         Detail
//                       </button>
//                       <button
//                         onClick={() => doDelete(c.call_id)}
//                         className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-red-50 flex items-center gap-2"
//                         style={{ background: COLORS.card, color: COLORS.danger, borderColor: COLORS.border }}
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
//                     onDelete={() => doDelete(c.call_id)}
//                   />
//                 ))}
//               </div>
//             </>
//           )}

//           {/* Footer / Pagination */}
//           {!loading && filtered.length > 0 && (
//             <div className="flex items-center justify-between px-4 py-3 border-t" style={{ background: COLORS.panel, borderColor: COLORS.border }}>
//               <div className="text-xs" style={{ color: COLORS.dim }}>
//                 Showing {(pageSafe - 1) * pageSize + 1}–{Math.min(filtered.length, pageSafe * pageSize)} of {filtered.length}
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={pageSafe === 1}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 hover:bg-slate-50"
//                   style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//                 >
//                   Prev
//                 </button>
//                 <div className="text-xs" style={{ color: COLORS.dim }}>
//                   {pageSafe} / {totalPages}
//                 </div>
//                 <button
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={pageSafe >= totalPages}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 hover:bg-slate-50"
//                   style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
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
//                     <MiniCard label="Status" value={statusProbe?.status || detail?.status || "—"} />
//                     <MiniCard label="Ended Reason" value={detail?.ended_reason || detail?.call_ended_reason || "—"} />
//                     <MiniCard label="Duration" value={fmtDuration(detail?.call_duration)} />
//                     <MiniCard label="Cost" value={`$${prettyNum(detail?.cost ?? 0)}`} />
//                   </div>

//                   {/* Timestamps */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <MiniCard label="Started" value={fmtDateTime(detail?.call_started_at || detail?.started_at || detail?.startedAt)} />
//                     <MiniCard label="Ended" value={fmtDateTime(detail?.call_ended_at || detail?.ended_at || detail?.endedAt)} />
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
//                       <div className="mt-2 text-xs flex items-center gap-2" style={{ color: COLORS.dim }}>
//                         <button
//                           onClick={() => copy(detail.recording_url, "Recording URL copied")}
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
//                     <div className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
//                       Assistant
//                     </div>
//                     <div className="text-xs" style={{ color: COLORS.dim }}>
//                       ID: {detail?.assistant?.id || "—"}
//                     </div>
//                     <div className="text-xs" style={{ color: COLORS.dim }}>
//                       Name: {detail?.assistant?.name || "—"}
//                     </div>

//                     <div className="mt-3 text-sm font-semibold" style={{ color: COLORS.text }}>
//                       Variables
//                     </div>
//                     <div className="mt-1 grid grid-cols-2 gap-2 text-xs" style={{ color: COLORS.dim }}>
//                       {detail?.variableValues ? (
//                         Object.entries(detail.variableValues).map(([k, v]) => (
//                           <div key={k} className="truncate">
//                             <span className="opacity-70">{k}:</span> {String(v ?? "—")}
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
//                       <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
//                         Transcript
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => probeStatus(detailId)}
//                           className="px-2 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-50"
//                           style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//                         >
//                           Check Status
//                         </button>
//                         <button
//                           onClick={() => refreshTranscript(detailId)}
//                           className="px-2 py-1.5 rounded-lg text-xs font-semibold border hover:bg-cyan-50"
//                           style={{ background: COLORS.card, color: COLORS.cyan, borderColor: COLORS.border }}
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
//                       onClick={() => doDelete(detailId)}
//                       className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-red-50"
//                       style={{ background: COLORS.card, color: COLORS.danger, borderColor: COLORS.border }}
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
//       style={{ background: COLORS.card, borderColor: COLORS.border }}
//     >
//       <div className="flex items-start gap-3">
//         <div
//           className="w-10 h-10 rounded-xl flex items-center justify-center"
//           style={{ background: "#EEF2FF", border: `1px solid ${COLORS.border}` }}
//         >
//           <Phone size={18} color={COLORS.primary} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="font-semibold truncate" style={{ color: COLORS.text }}>
//             {c.customer_name || "—"}
//           </div>
//           <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: COLORS.dim }}>
//             <span>ID:</span>
//             <span className="truncate">{c.call_id}</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2 text-sm">
//         <InfoRow label="Number" value={maskPhone(c.customer_number)} />
//         <InfoRow label="Status" value={
//           <span className="inline-flex items-center gap-2">
//             <Badge
//               color={
//                 c.status === "completed"
//                   ? COLORS.success
//                   : c.status === "failed"
//                   ? COLORS.danger
//                   : COLORS.primary
//               }
//               text={c.status || "Unknown"}
//             />
//           </span>
//         }/>
//         <InfoRow label="Reason" value={c.call_ended_reason ?? "—"} />
//         <InfoRow label="Started" value={fmtDateTime(c.call_started_at)} />
//         <InfoRow label="Duration" value={fmtDuration(c.call_duration)} />
//         <InfoRow label="Lead ID" value={c.lead_id ?? "—"} />
//       </div>

//       <div className="flex items-center justify-end gap-2 pt-1">
//         <button
//           onClick={onOpen}
//           className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-slate-50"
//           style={{ background: COLORS.card, color: COLORS.text, borderColor: COLORS.border }}
//           title="Open details"
//         >
//           <Info size={14} color={COLORS.purple} />
//           &nbsp;Detail
//         </button>
//         <button
//           onClick={onDelete}
//           className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-red-50"
//           style={{ background: COLORS.card, color: COLORS.danger, borderColor: COLORS.border }}
//           title="Delete"
//         >
//           <Trash2 size={14} />
//           &nbsp;Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex flex-col rounded-lg p-2" style={{ background: COLORS.panel, border: `1px dashed ${COLORS.border}` }}>
//       <span className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: COLORS.dim }}>
//         {label}
//       </span>
//       <span className="text-sm truncate" style={{ color: COLORS.text }}>
//         {value}
//       </span>
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
//         <div className="text-xs" style={{ color: COLORS.dim }}>{label}</div>
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





























"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone,
  PlayCircle,
  RefreshCw,
  Search,
  Filter,
  Loader2,
  X,
  Trash2,
  FileAudio,
  Info,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Copy,
} from "lucide-react";
import { toast } from "react-toastify";

/* ──────────────────────────────────────────────────────────────────────────
 * Config
 * ────────────────────────────────────────────────────────────────────────── */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const API_BASE = `${API_URL}/api`;

/* Light theme — primary: white; secondary: blue/cyan/purple accents */
const COLORS = {
  bg: "#ffffff",         // primary white
  panel: "#F8FAFC",      // slate-50
  card: "#ffffff",       // pure white cards
  border: "#E5E7EB",     // gray-200
  text: "#0F172A",       // slate-900
  dim: "#64748B",        // slate-500
  primary: "#4F46E5",    // indigo-600
  success: "#16A34A",    // green-600
  danger: "#DC2626",     // red-600
  amber: "#D97706",      // amber-600
  cyan: "#06B6D4",       // cyan-500
  purple: "#7C3AED",     // violet-600
  row: "#F9FAFB",        // row alt
  gradFrom: "#6366F1",   // indigo-500
  gradTo: "#06B6D4",     // cyan-500
};

/* Small helpers */
const cx = (...arr) => arr.filter(Boolean).join(" ");
const prettyNum = (n) =>
  n?.toLocaleString?.(undefined, { maximumFractionDigits: 2 }) ?? String(n ?? "");

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const fmtDuration = (seconds) => {
  if (seconds == null) return "—";
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
};

const maskPhone = (raw) => {
  if (!raw) return "—";
  const cleaned = String(raw).replace(/\D/g, "");
  if (cleaned.length < 10) return raw;
  const tail = cleaned.slice(-10);
  const cc = cleaned.slice(0, cleaned.length - 10) || "1";
  return `+${cc} (${tail.slice(0, 3)}) ${tail.slice(3, 6)}-${tail.slice(6)}`;
};

/* Admin endpoints (no /user/*) */
const endpoints = {
  ALL_LOGS: () => `${API_BASE}/all_call_logs`,
  CALL_DETAIL: (id) => `${API_BASE}/call/${id}`,
  DELETE_CALL: (id) => `${API_BASE}/call_log/${id}`,
  UPDATE_MISSING: () => `${API_BASE}/update_calls`,
  REFRESH_TRANSCRIPT: (id) => `${API_BASE}/refresh-transcript/${id}`,
  CALL_STATUS: (id) => `${API_BASE}/call-status/${id}`,
  SYNC_INBOUND: () => `${API_BASE}/sync-inbound-calls`,
};

/* Auth fetch */
async function authedFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required. Please log in.");
  const res = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      msg = data?.detail || data?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Main Page
 * ────────────────────────────────────────────────────────────────────────── */
export default function AdminPhoneCallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(true);

  // Filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("any");
  const [reason, setReason] = useState("any");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Selection / detail
  const [openDetail, setOpenDetail] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [statusProbe, setStatusProbe] = useState(null);
  const audioRef = useRef(null);

  // Bulk / top actions loading
  const [busyAction, setBusyAction] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /* Initial load + polling */
  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!polling) return;
    const t = setInterval(loadAll, 15_000);
    return () => clearInterval(t);
  }, [polling]);

  async function loadAll() {
    try {
      setLoading(true);
      const res = await authedFetch(endpoints.ALL_LOGS());
      const data = await res.json();

      // Normalize typical fields from CallLog model
      const norm = (data || []).map((c) => ({
        id: c.id ?? null,
        call_id: c.call_id ?? c.id ?? "",
        customer_number: c.customer_number ?? "",
        customer_name: c.customer_name ?? "",
        status: c.status ?? "Unknown",
        call_ended_reason: c.call_ended_reason ?? null,
        call_started_at: c.call_started_at ?? c.created_at ?? null,
        call_ended_at: c.call_ended_at ?? null,
        call_duration: c.call_duration ?? null,
        cost: typeof c.cost === "number" ? c.cost : parseFloat(c.cost || 0),
        lead_id: c.lead_id ?? null,
      }));

      setCalls(norm);
    } catch (err) {
      console.error(err);
      toast.error(`Load failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  /* Filtering */
  const filtered = useMemo(() => {
    return (calls || []).filter((c) => {
      const text = `${c.call_id} ${c.customer_number} ${c.customer_name} ${c.status} ${c.call_ended_reason ?? ""}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;

      if (status !== "any" && (c.status || "Unknown") !== status) return false;

      if (reason !== "any") {
        const r = (c.call_ended_reason || "Unknown").toLowerCase();
        if (reason === "null") {
          if (c.call_ended_reason != null) return false;
        } else if (!r.includes(reason.toLowerCase())) {
          return false;
        }
      }

      if (dateFrom) {
        const start = new Date(dateFrom);
        const ts = new Date(c.call_started_at || c.call_ended_at || 0);
        if (isFinite(start) && isFinite(ts) && ts < start) return false;
      }
      if (dateTo) {
        const end = new Date(dateTo);
        const ts = new Date(c.call_started_at || c.call_ended_at || 0);
        if (isFinite(end) && isFinite(ts) && ts > new Date(end.getTime() + 86399000)) return false;
      }
      return true;
    });
  }, [calls, q, status, reason, dateFrom, dateTo]);

  /* Pagination pages */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe]);

  /* Totals */
  const totals = useMemo(() => {
    const sumCost = filtered.reduce((acc, c) => acc + (Number(c.cost) || 0), 0);
    const sumDur = filtered.reduce((acc, c) => acc + (Number(c.call_duration) || 0), 0);
    return {
      count: filtered.length,
      cost: sumCost,
      duration: sumDur,
    };
  }, [filtered]);

  function resetFilters() {
    setQ("");
    setStatus("any");
    setReason("any");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  /* Detail drawer */
  async function openCallDetail(id) {
    try {
      setDetailId(id);
      setOpenDetail(true);
      setDetailLoading(true);

      const [detailRes, statusRes] = await Promise.all([
        authedFetch(endpoints.CALL_DETAIL(id)),
        authedFetch(endpoints.CALL_STATUS(id)),
      ]);

      const d = await detailRes.json();
      const s = await statusRes.json();

      setDetail(d);
      setStatusProbe(s);
    } catch (err) {
      toast.error(`Failed to load call detail: ${err.message}`);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setOpenDetail(false);
    setDetailId(null);
    setDetail(null);
    setStatusProbe(null);
  }

  /* Delete flow with stylish modal */
  function askDelete(call) {
    setDeleteTarget(call); // opens modal
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      setDeleteBusy(true);
      const id = deleteTarget.call_id;
      const res = await authedFetch(endpoints.DELETE_CALL(id), { method: "DELETE" });
      await res.json().catch(() => {});
      toast.success("Call log deleted");
      setCalls((prev) => prev.filter((c) => c.call_id !== id));
      if (detailId === id) closeDetail();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setDeleteBusy(false);
    }
  }

  /* Other actions */
  async function refreshTranscript(id) {
    try {
      setBusyAction(true);
      const res = await authedFetch(endpoints.REFRESH_TRANSCRIPT(id), { method: "POST" });
      const data = await res.json();
      toast.success(data?.message || "Transcript refreshed");
      if (detailId === id) {
        setDetail((prev) => ({ ...(prev || {}), transcript: data?.transcript ?? prev?.transcript }));
      }
    } catch (err) {
      toast.error(`Refresh failed: ${err.message}`);
    } finally {
      setBusyAction(false);
    }
  }

  async function repairMissing() {
    try {
      setBusyAction(true);
      const res = await authedFetch(endpoints.UPDATE_MISSING());
      const data = await res.json();
      toast.success(data?.message || "Updated missing details");
      await loadAll();
    } catch (err) {
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setBusyAction(false);
    }
  }

  async function syncInbound() {
    try {
      setBusyAction(true);
      const res = await authedFetch(endpoints.SYNC_INBOUND(), { method: "POST" });
      const data = await res.json();
      toast.success(data?.detail || "Synced inbound calls");
      await loadAll();
    } catch (err) {
      toast.error(`Sync failed: ${err.message}`);
    } finally {
      setBusyAction(false);
    }
  }

  async function probeStatus(id) {
    try {
      const res = await authedFetch(endpoints.CALL_STATUS(id));
      const s = await res.json();
      setStatusProbe(s);
      toast.success("Status updated");
    } catch (err) {
      toast.error(`Status check failed: ${err.message}`);
    }
  }

  /* Copy helper */
  function copy(text, label = "Copied") {
    navigator.clipboard.writeText(String(text ?? "")).then(
      () => toast.success(label),
      () => toast.error("Copy failed")
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      {/* Hero/Header (scrolls with page, not sticky) */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.12))",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <Phone size={22} color={COLORS.primary} />
            </div>
            <div>
              <div
                className="text-2xl md:text-3xl font-extrabold tracking-tight"
                style={{ color: COLORS.text }}
              >
                Admin · Phone Calls
              </div>
              <div className="text-sm" style={{ color: COLORS.dim }}>
                Full control: logs, transcripts, recordings
              </div>
            </div>
          </div>

          {/* Quick actions under header */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPolling((p) => !p)}
              className="px-3 py-2 rounded-lg text-sm font-semibold border transition hover:opacity-90"
              style={{
                background: "#FFFFFF",
                color: polling ? COLORS.primary : COLORS.text,
                borderColor: COLORS.border,
                boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              }}
              title={polling ? "Auto-refresh is ON" : "Auto-refresh is OFF"}
            >
              <span className="inline-flex items-center gap-2">
                <Radio size={16} />
                {polling ? "Live" : "Paused"}
              </span>
            </button>

            <button
              onClick={loadAll}
              className="px-3 py-2 rounded-lg text-sm font-semibold border transition hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))",
                color: COLORS.text,
                borderColor: COLORS.border,
              }}
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={16} color={COLORS.purple} />
                Refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Actions + Filters */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: COLORS.panel,
                borderColor: COLORS.border,
                boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                    color={COLORS.dim}
                  />
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by call id, number, name, status, reason..."
                    className="w-full pl-10 pr-3 py-2 rounded-xl outline-none transition"
                    style={{
                      background: COLORS.card,
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={16} color={COLORS.dim} />
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-xl text-sm"
                    style={{
                      background: COLORS.card,
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <option value="any">Any status</option>
                    <option value="completed">completed</option>
                    <option value="failed">failed</option>
                    <option value="in-progress">in-progress</option>
                    <option value="queued">queued</option>
                    <option value="connecting">connecting</option>
                    <option value="Unknown">Unknown</option>
                  </select>

                  <select
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-xl text-sm"
                    style={{
                      background: COLORS.card,
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <option value="any">Any reason</option>
                    <option value="null">No reason (null)</option>
                    <option value="completed">completed</option>
                    <option value="hangup">hangup</option>
                    <option value="no-answer">no-answer</option>
                    <option value="busy">busy</option>
                    <option value="failed">failed</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: COLORS.dim }}>
                    From
                  </span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-xl text-sm flex-1"
                    style={{
                      background: COLORS.card,
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: COLORS.dim }}>
                    To
                  </span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-xl text-sm flex-1"
                    style={{
                      background: COLORS.card,
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl text-sm border hover:bg-white transition"
                  style={{
                    background: COLORS.card,
                    color: COLORS.text,
                    borderColor: COLORS.border,
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>

          {/* Top actions */}
          <div
            className="rounded-2xl p-4 border space-y-3"
            style={{
              background: COLORS.panel,
              borderColor: COLORS.border,
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
            }}
          >
            <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
              Admin Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={repairMissing}
                disabled={busyAction}
                className="px-3 py-2 rounded-xl text-sm font-semibold border hover:bg-amber-50 transition flex items-center gap-2 justify-center disabled:opacity-50"
                style={{
                  background: COLORS.card,
                  color: COLORS.amber,
                  borderColor: COLORS.border,
                }}
                title="Fill call_ended_reason, duration, etc. for incomplete rows"
              >
                {busyAction ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
                Repair Missing
              </button>
              <button
                onClick={syncInbound}
                disabled={busyAction}
                className="px-3 py-2 rounded-xl text-sm font-semibold border hover:bg-cyan-50 transition flex items-center gap-2 justify-center disabled:opacity-50"
                style={{
                  background: COLORS.card,
                  color: COLORS.cyan,
                  borderColor: COLORS.border,
                }}
                title="Sync inbound calls from VAPI for this admin's assistants"
              >
                {busyAction ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <RefreshCw size={16} />
                )}
                Sync Inbound
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <StatTile
                icon={<CheckCircle2 size={16} color={COLORS.success} />}
                label="Filtered"
                value={prettyNum(totals.count)}
              />
              <StatTile
                icon={<Clock size={16} color={COLORS.primary} />}
                label="Duration"
                value={fmtDuration(totals.duration)}
              />
              <StatTile
                icon={<DollarSign size={16} color={COLORS.amber} />}
                label="Cost"
                value={`$${prettyNum(totals.cost)}`}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: COLORS.card,
            borderColor: COLORS.border,
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.02), 0 8px 24px -16px rgba(79,70,229,0.25)",
          }}
        >
          {/* Desktop header row (hidden on small) */}
          <div
            className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 text-xs border-b"
            style={{
              borderColor: COLORS.border,
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))",
            }}
          >
            <div className="col-span-3" style={{ color: COLORS.dim }}>
              Customer
            </div>
            <div className="col-span-2" style={{ color: COLORS.dim }}>
              Number
            </div>
            <div className="col-span-2" style={{ color: COLORS.dim }}>
              Status
            </div>
            <div className="col-span-2" style={{ color: COLORS.dim }}>
              Started
            </div>
            <div className="col-span-1" style={{ color: COLORS.dim }}>
              Dur
            </div>
            <div className="col-span-2 text-right" style={{ color: COLORS.dim }}>
              Actions
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" color={COLORS.primary} />
                <span style={{ color: COLORS.dim }}>Loading calls…</span>
              </div>
            </div>
          ) : pageSlice.length === 0 ? (
            <div className="py-16 text-center" style={{ color: COLORS.dim }}>
              No results match your filters.
            </div>
          ) : (
            <>
              {/* Desktop rows */}
              <div className="hidden md:block">
                {pageSlice.map((c, idx) => (
                  <div
                    key={c.call_id}
                    className="grid grid-cols-12 gap-3 px-4 py-3 border-b hover:bg-white transition"
                    style={{
                      borderColor: COLORS.border,
                      background: idx % 2 ? COLORS.bg : COLORS.row,
                    }}
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{
                          background: COLORS.panel,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <Phone size={16} color={COLORS.primary} />
                      </div>
                      <div className="min-w-0">
                        <div
                          className="truncate font-semibold"
                          style={{ color: COLORS.text }}
                        >
                          {c.customer_name || "—"}
                        </div>
                        <div
                          className="text-xs truncate flex items-center gap-1"
                          style={{ color: COLORS.dim }}
                        >
                          <span>ID:</span>
                          <button
                            onClick={() => copy(c.call_id, "Call ID copied")}
                            className="underline-offset-2 hover:underline flex items-center gap-1"
                            title="Copy call ID"
                          >
                            <Copy size={12} />
                            {c.call_id}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div className="text-sm" style={{ color: COLORS.text }}>
                        {maskPhone(c.customer_number)}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <Badge
                        color={
                          c.status === "completed"
                            ? COLORS.success
                            : c.status === "failed"
                            ? COLORS.danger
                            : COLORS.primary
                        }
                        text={c.status || "Unknown"}
                      />
                      <span
                        className="text-xs truncate"
                        style={{ color: COLORS.dim }}
                      >
                        {c.call_ended_reason ?? "—"}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div className="text-sm" style={{ color: COLORS.text }}>
                        {fmtDateTime(c.call_started_at)}
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="text-sm" style={{ color: COLORS.text }}>
                        {fmtDuration(c.call_duration)}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openCallDetail(c.call_id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-white flex items-center gap-2"
                        style={{
                          background: COLORS.card,
                          color: COLORS.text,
                          borderColor: COLORS.border,
                        }}
                        title="Open details"
                      >
                        <Info size={14} color={COLORS.purple} />
                        Detail
                      </button>
                      <button
                        onClick={() => askDelete(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-red-50 flex items-center gap-2"
                        style={{
                          background: COLORS.card,
                          color: COLORS.danger,
                          borderColor: COLORS.border,
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile CARDS */}
              <div className="md:hidden p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pageSlice.map((c) => (
                  <CallCard
                    key={c.call_id}
                    c={c}
                    onOpen={() => openCallDetail(c.call_id)}
                    onDelete={() => askDelete(c)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Footer / Pagination */}
          {!loading && filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-4 py-3 border-t"
              style={{ background: COLORS.panel, borderColor: COLORS.border }}
            >
              <div className="text-xs" style={{ color: COLORS.dim }}>
                Showing {(pageSafe - 1) * pageSize + 1}–
                {Math.min(filtered.length, pageSafe * pageSize)} of {filtered.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pageSafe === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 hover:bg-white"
                  style={{
                    background: COLORS.card,
                    color: COLORS.text,
                    borderColor: COLORS.border,
                  }}
                >
                  Prev
                </button>
                <div className="text-xs" style={{ color: COLORS.dim }}>
                  {pageSafe} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={pageSafe >= totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 hover:bg-white"
                  style={{
                    background: COLORS.card,
                    color: COLORS.text,
                    borderColor: COLORS.border,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {openDetail && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={closeDetail}
          />
          {/* Panel */}
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-[560px] shadow-2xl border-l overflow-y-auto"
            style={{ background: COLORS.card, borderColor: COLORS.border }}
          >
            <div className="sticky top-0 px-4 py-3 flex items-center justify-between border-b bg-white">
              <div className="flex items-center gap-2">
                <FileAudio size={18} color={COLORS.primary} />
                <div className="font-semibold" style={{ color: COLORS.text }}>
                  Call Detail
                </div>
              </div>
              <button
                onClick={closeDetail}
                className="p-2 rounded-lg border hover:bg-slate-50"
                style={{ background: COLORS.card, borderColor: COLORS.border }}
              >
                <X size={16} color={COLORS.dim} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {detailLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" color={COLORS.primary} />
                  <span style={{ color: COLORS.dim }}>Loading…</span>
                </div>
              ) : !detail ? (
                <div style={{ color: COLORS.dim }}>No detail available.</div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <MiniCard
                      label="Status"
                      value={statusProbe?.status || detail?.status || "—"}
                    />
                    <MiniCard
                      label="Ended Reason"
                      value={detail?.ended_reason || detail?.call_ended_reason || "—"}
                    />
                    <MiniCard
                      label="Duration"
                      value={fmtDuration(detail?.call_duration)}
                    />
                    <MiniCard
                      label="Cost"
                      value={`$${prettyNum(detail?.cost ?? 0)}`}
                    />
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-3">
                    <MiniCard
                      label="Started"
                      value={fmtDateTime(
                        detail?.call_started_at ||
                          detail?.started_at ||
                          detail?.startedAt
                      )}
                    />
                    <MiniCard
                      label="Ended"
                      value={fmtDateTime(
                        detail?.call_ended_at ||
                          detail?.ended_at ||
                          detail?.endedAt
                      )}
                    />
                  </div>

                  {/* Recording */}
                  {detail?.recording_url && detail.recording_url !== "N/A" && (
                    <div
                      className="p-3 rounded-xl border"
                      style={{ background: COLORS.panel, borderColor: COLORS.border }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <PlayCircle size={18} color={COLORS.primary} />
                        <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                          Recording
                        </div>
                      </div>
                      <audio ref={audioRef} controls className="w-full">
                        <source src={detail.recording_url} />
                      </audio>
                      <div
                        className="mt-2 text-xs flex items-center gap-2"
                        style={{ color: COLORS.dim }}
                      >
                        <button
                          onClick={() =>
                            copy(detail.recording_url, "Recording URL copied")
                          }
                          className="underline-offset-2 hover:underline"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Assistant & Variables */}
                  <div
                    className="p-3 rounded-xl border"
                    style={{ background: COLORS.panel, borderColor: COLORS.border }}
                  >
                    <div
                      className="text-sm font-semibold mb-2"
                      style={{ color: COLORS.text }}
                    >
                      Assistant
                    </div>
                    <div className="text-xs" style={{ color: COLORS.dim }}>
                      ID: {detail?.assistant?.id || "—"}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.dim }}>
                      Name: {detail?.assistant?.name || "—"}
                    </div>

                    <div
                      className="mt-3 text-sm font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      Variables
                    </div>
                    <div
                      className="mt-1 grid grid-cols-2 gap-2 text-xs"
                      style={{ color: COLORS.dim }}
                    >
                      {detail?.variableValues ? (
                        Object.entries(detail.variableValues).map(([k, v]) => (
                          <div key={k} className="truncate">
                            <span className="opacity-70">{k}:</span>{" "}
                            {String(v ?? "—")}
                          </div>
                        ))
                      ) : (
                        <div>—</div>
                      )}
                    </div>
                  </div>

                  {/* Transcript */}
                  <div
                    className="p-3 rounded-xl border"
                    style={{ background: COLORS.panel, borderColor: COLORS.border }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="text-sm font-semibold"
                        style={{ color: COLORS.text }}
                      >
                        Transcript
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => probeStatus(detailId)}
                          className="px-2 py-1.5 rounded-lg text-xs font-semibold border hover:bg-white"
                          style={{
                            background: COLORS.card,
                            color: COLORS.text,
                            borderColor: COLORS.border,
                          }}
                        >
                          Check Status
                        </button>
                        <button
                          onClick={() => refreshTranscript(detailId)}
                          className="px-2 py-1.5 rounded-lg text-xs font-semibold border"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))",
                            color: COLORS.cyan,
                            borderColor: COLORS.border,
                          }}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    <div
                      className="text-xs whitespace-pre-wrap leading-relaxed"
                      style={{ color: COLORS.dim, maxHeight: 280, overflow: "auto" }}
                    >
                      {detail?.transcript && detail.transcript !== "No transcript available"
                        ? detail.transcript
                        : "No transcript available"}
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs" style={{ color: COLORS.dim }}>
                      Delete this call log (and attempt VAPI deletion)
                    </div>
                    <button
                      onClick={() => askDelete({ call_id: detailId, ...detail })}
                      className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-red-50"
                      style={{
                        background: COLORS.card,
                        color: COLORS.danger,
                        borderColor: COLORS.border,
                      }}
                    >
                      <Trash2 size={14} />
                      &nbsp;Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={!!deleteTarget}
        busy={deleteBusy}
        call={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Mobile Card Component
 * ────────────────────────────────────────────────────────────────────────── */
function CallCard({ c, onOpen, onDelete }) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{
        background: COLORS.card,
        borderColor: COLORS.border,
        boxShadow:
          "0 1px 0 rgba(0,0,0,0.02), 0 8px 24px -16px rgba(99,102,241,0.25)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.12))",
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Phone size={18} color={COLORS.primary} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate" style={{ color: COLORS.text }}>
            {c.customer_name || "—"}
          </div>
          <div
            className="text-xs flex items-center gap-1 mt-0.5"
            style={{ color: COLORS.dim }}
          >
            <span className="opacity-70">ID:</span>
            <span className="truncate">{c.call_id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <InfoRow label="Number" value={maskPhone(c.customer_number)} />
        <InfoRow
          label="Status"
          value={
            <span className="inline-flex items-center gap-2">
              <Badge
                color={
                  c.status === "completed"
                    ? COLORS.success
                    : c.status === "failed"
                    ? COLORS.danger
                    : COLORS.primary
                }
                text={c.status || "Unknown"}
              />
            </span>
          }
        />
        <InfoRow label="Reason" value={c.call_ended_reason ?? "—"} />
        <InfoRow label="Started" value={fmtDateTime(c.call_started_at)} />
        <InfoRow label="Duration" value={fmtDuration(c.call_duration)} />
        <InfoRow label="Lead ID" value={c.lead_id ?? "—"} />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onOpen}
          className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-white"
          style={{
            background: COLORS.card,
            color: COLORS.text,
            borderColor: COLORS.border,
          }}
          title="Open details"
        >
          <span className="inline-flex items-center gap-1.5">
            <Info size={14} color={COLORS.purple} />
            Detail
          </span>
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 rounded-lg text-xs font-semibold border hover:bg-red-50"
          style={{
            background: COLORS.card,
            color: COLORS.danger,
            borderColor: COLORS.border,
          }}
          title="Delete"
        >
          <span className="inline-flex items-center gap-1.5">
            <Trash2 size={14} />
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      className="flex flex-col rounded-lg p-2"
      style={{
        background: COLORS.panel,
        border: `1px dashed ${COLORS.border}`,
      }}
    >
      <span
        className="text-[10px] uppercase tracking-wide font-semibold"
        style={{ color: COLORS.dim }}
      >
        {label}
      </span>
      <span className="text-sm truncate" style={{ color: COLORS.text }}>
        {value}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Delete Modal
 * ────────────────────────────────────────────────────────────────────────── */
function DeleteModal({ open, onClose, onConfirm, call, busy }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => !busy && onClose?.()}
      />
      <div className="absolute inset-0 flex items-end sm:items-center justify-center">
        <div
          className="w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden animate-[fadeInUp_0.2s_ease]"
          style={{ background: COLORS.card, borderColor: COLORS.border }}
        >
          {/* Header bar with gradient */}
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, ${COLORS.gradFrom}, ${COLORS.gradTo})`,
            }}
          />
          <div className="px-5 py-4 flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(220,38,38,0.08)",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <Trash2 size={18} color={COLORS.danger} />
            </div>
            <div className="flex-1">
              <div
                className="text-lg font-bold"
                style={{ color: COLORS.text }}
              >
                Delete call log?
              </div>
              <div className="text-sm mt-1" style={{ color: COLORS.dim }}>
                This will remove the call from your database and attempt to
                delete it from VAPI as well. This action cannot be undone.
              </div>
              <div className="mt-3 text-xs rounded-lg p-3"
                   style={{ background: COLORS.panel, border: `1px dashed ${COLORS.border}`, color: COLORS.dim }}>
                <div><span className="font-semibold text-slate-700">Call ID:</span> {call?.call_id ?? "—"}</div>
                <div><span className="font-semibold text-slate-700">Number:</span> {maskPhone(call?.customer_number)}</div>
                <div><span className="font-semibold text-slate-700">Customer:</span> {call?.customer_name || "—"}</div>
              </div>
            </div>
            <button
              onClick={() => !busy && onClose?.()}
              className="p-2 rounded-lg border hover:bg-slate-50"
              style={{ borderColor: COLORS.border }}
              aria-label="Close delete modal"
            >
              <X size={16} color={COLORS.dim} />
            </button>
          </div>

          <div className="px-5 pb-5 flex items-center justify-end gap-2">
            <button
              onClick={() => !busy && onClose?.()}
              disabled={busy}
              className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-white disabled:opacity-50"
              style={{
                background: COLORS.card,
                color: COLORS.text,
                borderColor: COLORS.border,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={busy}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${COLORS.gradFrom}, ${COLORS.gradTo})`,
                boxShadow:
                  "0 10px 20px -10px rgba(79,70,229,0.5), 0 8px 24px -12px rgba(6,182,212,0.45)",
              }}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Deleting…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* simple keyframes fallback */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Small UI pieces
 * ────────────────────────────────────────────────────────────────────────── */
function Badge({ color, text }) {
  return (
    <span
      className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
      style={{ background: `${color}1A`, color }}
    >
      {text}
    </span>
  );
}

function StatTile({ icon, label, value }) {
  return (
    <div
      className="p-3 rounded-xl border"
      style={{ background: COLORS.card, borderColor: COLORS.border }}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-xs" style={{ color: COLORS.dim }}>
          {label}
        </div>
      </div>
      <div className="mt-1 text-lg font-bold" style={{ color: COLORS.text }}>
        {value}
      </div>
    </div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div
      className="p-3 rounded-xl border"
      style={{ background: COLORS.card, borderColor: COLORS.border }}
    >
      <div className="text-xs" style={{ color: COLORS.dim }}>{label}</div>
      <div className="text-sm font-semibold truncate" style={{ color: COLORS.text }}>
        {value}
      </div>
    </div>
  );
}
