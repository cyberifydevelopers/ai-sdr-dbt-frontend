





// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   Search,
//   Edit3,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw,
//   X,
//   Loader2,
//   Shield,
//   Smartphone,
//   Mail,
//   Hash,
//   CalendarDays,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// /* ──────────────────────────────────────────────────────────────────────────
//  * Config
//  * ────────────────────────────────────────────────────────────────────────── */
// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
// const ENDPOINTS = {
//   LIST: `${API_URL}/api/admin/leadss`, // ← fixed
//   UPDATE: (id) => `${API_URL}/api/admin/leads/${id}`,
// };

// /* Utility: classnames */
// function cx(...arr) {
//   return arr.filter(Boolean).join(" ");
// }

// /* Debounce */
// function useDebounce(value, delay = 250) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return debounced;
// }

// /* Date helpers */
// function toInputDate(value) {
//   if (!value) return "";
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return "";
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }
// function fmtDT(d) {
//   try {
//     const dt = new Date(d);
//     if (isNaN(dt.getTime())) return String(d || "");
//     return dt.toLocaleString();
//   } catch {
//     return String(d || "");
//   }
// }

// /* Simple motion variants */
// const fadeUp = {
//   hidden: { opacity: 0, y: 8 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } },
// };
// const stagger = { show: { transition: { staggerChildren: 0.05 } } };
// const glassPop = {
//   hidden: { opacity: 0, scale: 0.98, y: 12 },
//   show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
//   exit: { opacity: 0, scale: 0.98, y: 12, transition: { duration: 0.18 } },
// };
// const overlay = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1, transition: { duration: 0.18 } },
//   exit: { opacity: 0, transition: { duration: 0.12 } },
// };

// /* Pill chip */
// function Chip({ children, tone = "slate" }) {
//   const tones = {
//     slate: "bg-slate-100 text-slate-700 ring-slate-200",
//     green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
//     red: "bg-rose-100 text-rose-700 ring-rose-200",
//     blue: "bg-blue-100 text-blue-700 ring-blue-200",
//   };
//   return (
//     <span
//       className={cx(
//         "inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1",
//         tones[tone] || tones.slate
//       )}
//     >
//       {children}
//     </span>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//  * Page: Admin Leads (View + Edit)
//  * ────────────────────────────────────────────────────────────────────────── */
// export default function AdminLeads() {
//   const token = useRef(localStorage.getItem("token") || null);

//   // data
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // ui state
//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounce(query, 250);
//   const [sortBy, setSortBy] = useState("add_date");
//   const [sortDir, setSortDir] = useState("desc");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(12);

//   // editor (full-page slide-over)
//   const [showEditor, setShowEditor] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     add_date: "",
//     salesforce_id: "",
//     mobile: "",
//     state: "",
//   });

//   /* Fetch */
//   async function fetchLeads() {
//     if (!token.current) {
//       setLoading(false);
//       toast.error("No auth token found. Please log in.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const res = await fetch(ENDPOINTS.LIST, {
//         headers: { Authorization: `Bearer ${token.current}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       const list = Array.isArray(json) ? json : Array.isArray(json?.leads) ? json.leads : [];
//       setLeads(list);
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to fetch leads");
//       setLeads([]);
//     } finally {
//       setLoading(false);
//     }
//   }
//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   async function refreshAll() {
//     setRefreshing(true);
//     await fetchLeads();
//     setRefreshing(false);
//   }

//   /* Derived */
//   const filtered = useMemo(() => {
//     const q = debouncedQuery.trim().toLowerCase();
//     let list = leads.filter((l) => {
//       if (!q) return true;
//       const name = `${l.first_name || ""} ${l.last_name || ""}`.toLowerCase();
//       const fields = [
//         name,
//         (l.email || "").toLowerCase(),
//         (l.mobile || "").toLowerCase(),
//         (l.salesforce_id || "").toLowerCase(),
//         (l.state || "").toLowerCase(),
//       ];
//       return fields.some((f) => f.includes(q));
//     });

//     const dir = sortDir === "asc" ? 1 : -1;
//     list.sort((a, b) => {
//       const nameA = `${a.first_name || ""} ${a.last_name || ""}`.trim().toLowerCase();
//       const nameB = `${b.first_name || ""} ${b.last_name || ""}`.trim().toLowerCase();
//       let va, vb;
//       switch (sortBy) {
//         case "name":
//           va = nameA; vb = nameB; break;
//         case "email":
//           va = (a.email || "").toLowerCase(); vb = (b.email || "").toLowerCase(); break;
//         case "mobile":
//           va = (a.mobile || "").toLowerCase(); vb = (b.mobile || "").toLowerCase(); break;
//         case "state":
//           va = (a.state || "").toLowerCase(); vb = (b.state || "").toLowerCase(); break;
//         case "add_date":
//         default:
//           va = new Date(a.add_date || 0).getTime();
//           vb = new Date(b.add_date || 0).getTime();
//       }
//       if (va < vb) return -1 * dir;
//       if (va > vb) return 1 * dir;
//       return 0;
//     });
//     return list;
//   }, [leads, debouncedQuery, sortBy, sortDir]);

//   const totalLeads = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));
//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

//   const start = (page - 1) * pageSize;
//   const end = start + pageSize;
//   const pageItems = filtered.slice(start, end);

//   /* Edit */
//   function openEditor(lead) {
//     setCurrentLead(lead);
//     setForm({
//       first_name: lead.first_name || "",
//       last_name: lead.last_name || "",
//       email: lead.email || "",
//       add_date: toInputDate(lead.add_date),
//       salesforce_id: lead.salesforce_id || "",
//       mobile: lead.mobile || "",
//       state: lead.state || "",
//     });
//     setShowEditor(true);
//   }
//   function onFormChange(e) {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   }
//   async function saveLead() {
//     if (!currentLead) return;
//     if (!token.current) {
//       toast.error("No auth token found.");
//       return;
//     }
//     const payload = {
//       first_name: form.first_name || "",
//       last_name: form.last_name || "",
//       email: form.email || "",
//       add_date: form.add_date || "",
//       salesforce_id: form.salesforce_id || null,
//       mobile: form.mobile || "",
//       state: form.state || null,
//     };
//     try {
//       setSaving(true);
//       const res = await fetch(ENDPOINTS.UPDATE(currentLead.id), {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token.current}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const json = await res.json().catch(() => ({}));
//       if (!res.ok || json?.success === false) {
//         throw new Error(json?.detail || `HTTP ${res.status}`);
//       }
//       const updated = json?.updated_lead || { ...currentLead, ...payload };
//       setLeads((prev) => prev.map((l) => (l.id === currentLead.id ? { ...l, ...updated } : l)));
//       toast.success("Lead updated");
//       setShowEditor(false);
//       setCurrentLead(null);
//     } catch (e) {
//       console.error(e);
//       toast.error(e?.message || "Update failed");
//     } finally {
//       setSaving(false);
//     }
//   }
//   function setSort(nextKey) {
//     setSortBy((prevKey) => {
//       if (prevKey === nextKey) {
//         setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//         return prevKey;
//       } else {
//         setSortDir(nextKey === "add_date" ? "desc" : "asc");
//         return nextKey;
//       }
//     });
//     setPage(1);
//   }

//   /* Render */
//   return (
//     <div className="min-h-screen w-full text-slate-900 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
//       {/* Decorative aurora */}
//       <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
//         <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
//         <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
//         <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
//       </div>

//       {/* Header */}
//       <header className="sticky top-0 z-30 border-b border-slate-200/70 backdrop-blur bg-white/60">
//         <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-5">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="text-2xl font-black tracking-tight">
//                 Leads
//               </h1>
//               <p className="text-sm text-slate-600">
//                 Browse and edit your leads with style ✨
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <ButtonGhost
//                 onClick={refreshAll}
//                 icon={<RefreshCw className={cx("h-4 w-4", refreshing && "animate-spin")} />}
//               >
//                 Refresh
//               </ButtonGhost>
//             </div>
//           </div>

//           <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
//             {/* Search */}
//             <div className="relative sm:col-span-2">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//               <input
//                 value={query}
//                 onChange={(e) => {
//                   setQuery(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search name, email, mobile, Salesforce ID, state…"
//                 className="w-full rounded-2xl border border-slate-200/70 bg-white/80 pl-10 pr-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-1 ring-slate-100 transition focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300"
//               />
//             </div>

//             {/* Page size */}
//             <div className="flex items-center justify-between sm:justify-end gap-3">
//               <div className="text-sm text-slate-600 hidden sm:block">
//                 Total: <span className="font-semibold text-slate-900">{totalLeads}</span>
//               </div>
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-400/30"
//               >
//                 {[12, 24, 48, 96].map((n) => (
//                   <option key={n} value={n}>
//                     {n} / page
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Content */}
//       <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
//         {/* Table (lg+) */}
//         <motion.div
//           initial="hidden"
//           animate="show"
//           variants={stagger}
//           className="hidden lg:block overflow-x-auto rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/50 shadow-[0_10px_40px_-20px_rgba(2,6,23,0.2)]"
//         >
//           <table className="min-w-full text-left">
//             <thead className="bg-slate-50/80 text-slate-600 text-sm">
//               <tr className="[&>th]:px-5 [&>th]:py-3">
//                 <Th sortKey="add_date" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
//                   Added
//                 </Th>
//                 <Th sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
//                   Name
//                 </Th>
//                 <Th sortKey="email" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
//                   Email
//                 </Th>
//                 <Th sortKey="mobile" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
//                   Mobile
//                 </Th>
//                 <Th sortKey="state" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
//                   State
//                 </Th>
//                 <th className="px-5 py-3">SFDC</th>
//                 <th className="px-5 py-3">Status</th>
//                 <th className="px-5 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {loading ? (
//                 <RowSkeleton rows={8} cols={8} />
//               ) : pageItems.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="px-5 py-12 text-center text-slate-600">
//                     No leads found. Try searching something else.
//                   </td>
//                 </tr>
//               ) : (
//                 pageItems.map((l) => {
//                   const name = `${l.first_name || ""} ${l.last_name || ""}`.trim() || "—";
//                   return (
//                     <motion.tr
//                       key={l.id}
//                       variants={fadeUp}
//                       className="hover:bg-slate-50/70 transition-colors"
//                     >
//                       <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">
//                         {l.add_date ? (
//                           <span className="inline-flex items-center gap-1.5">
//                             <CalendarDays className="h-4 w-4 text-slate-400" />
//                             {fmtDT(l.add_date)}
//                           </span>
//                         ) : "—"}
//                       </td>
//                       <td className="px-5 py-3 font-medium text-slate-900">{name}</td>
//                       <td className="px-5 py-3 text-slate-800 break-all">
//                         <span className="inline-flex items-center gap-1.5">
//                           <Mail className="h-4 w-4 text-slate-400" />
//                           {l.email || "—"}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3 text-slate-800 break-all">
//                         <span className="inline-flex items-center gap-1.5">
//                           <Smartphone className="h-4 w-4 text-slate-400" />
//                           {l.mobile || "—"}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3">
//                         {l.state ? <Chip tone="blue">{l.state}</Chip> : "—"}
//                       </td>
//                       <td className="px-5 py-3 text-slate-800">
//                         <span className="inline-flex items-center gap-1.5">
//                           <Hash className="h-4 w-4 text-slate-400" />
//                           {l.salesforce_id || "—"}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3">
//                         {l.dnc ? (
//                           <Chip tone="red">DNC</Chip>
//                         ) : (
//                           <Chip tone="green">Callable</Chip>
//                         )}
//                       </td>
//                       <td className="px-5 py-3">
//                         <div className="flex items-center justify-end">
//                           <ButtonPrimary onClick={() => openEditor(l)} icon={<Edit3 className="h-4 w-4" />}>
//                             Edit
//                           </ButtonPrimary>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </motion.div>

//         {/* Cards (sm & md) */}
//         <div className="lg:hidden">
//           {loading ? (
//             <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur shadow p-4">
//               <RowSkeleton rows={6} cols={1} />
//             </div>
//           ) : pageItems.length === 0 ? (
//             <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur shadow p-8 text-center text-slate-600">
//               No leads found. Try searching something else.
//             </div>
//           ) : (
//             <motion.div
//               initial="hidden"
//               animate="show"
//               variants={stagger}
//               className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//             >
//               {pageItems.map((l) => {
//                 const name = `${l.first_name || ""} ${l.last_name || ""}`.trim() || "—";
//                 return (
//                   <motion.article
//                     key={l.id}
//                     variants={glassPop}
//                     className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/60 shadow hover:shadow-lg transition-shadow p-4"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="min-w-0">
//                         <h3 className="text-base font-semibold text-slate-900 break-words">
//                           {name}
//                         </h3>
//                         <p className="text-xs text-slate-600 mt-0.5">
//                           {l.add_date ? fmtDT(l.add_date) : "—"}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {l.state ? <Chip tone="blue">{l.state}</Chip> : null}
//                         {l.dnc ? <Chip tone="red">DNC</Chip> : <Chip tone="green">Callable</Chip>}
//                       </div>
//                     </div>

//                     <div className="mt-3 grid grid-cols-1 gap-2">
//                       <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={l.email || "—"} copySafe />
//                       <InfoRow icon={<Smartphone className="h-4 w-4" />} label="Mobile" value={l.mobile || "—"} copySafe />
//                       <InfoRow icon={<Hash className="h-4 w-4" />} label="SFDC" value={l.salesforce_id || "—"} />
//                       {l.timezone ? <InfoRow icon={<Shield className="h-4 w-4" />} label="Timezone" value={l.timezone} /> : null}
//                     </div>

//                     <div className="mt-4 flex justify-end">
//                       <ButtonPrimary onClick={() => openEditor(l)} icon={<Edit3 className="h-4 w-4" />}>
//                         Edit
//                       </ButtonPrimary>
//                     </div>
//                   </motion.article>
//                 );
//               })}
//             </motion.div>
//           )}
//         </div>

//         {/* Pagination */}
//         {!loading && totalLeads > 0 && (
//           <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row text-slate-700">
//             <div className="text-sm">
//               Showing{" "}
//               <span className="font-semibold text-slate-900">{Math.min(end, totalLeads)}</span> of {totalLeads}
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               <PagerButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
//                 <ChevronLeft className="h-4 w-4" /> Prev
//               </PagerButton>
//               <div className="text-sm">
//                 Page <span className="font-semibold text-slate-900">{page}</span> / {totalPages}
//               </div>
//               <PagerButton disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
//                 Next <ChevronRight className="h-4 w-4" />
//               </PagerButton>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Full-page Editor Slide-Over */}
//       <AnimatePresence>
//         {showEditor && (
//           <>
//             <motion.div
//               className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
//               variants={overlay}
//               initial="hidden"
//               animate="show"
//               exit="exit"
//               onClick={() => setShowEditor(false)}
//             />
//             <motion.section
//               className="fixed inset-y-0 right-0 z-50 w-full sm:w-[560px] md:w-[720px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
//               initial={{ x: "100%" }}
//               animate={{ x: 0, transition: { type: "spring", stiffness: 260, damping: 28 } }}
//               exit={{ x: "100%", transition: { duration: 0.2 } }}
//               aria-label="Edit lead"
//             >
//               {/* Topbar */}
//               <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setShowEditor(false)}
//                     className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50"
//                     aria-label="Close"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                   <div>
//                     <h3 className="text-lg font-bold leading-tight">Edit Lead</h3>
//                     <p className="text-xs text-slate-600">
//                       Changes are saved to <span className="font-medium">#{currentLead?.id}</span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <ButtonGhost onClick={() => setShowEditor(false)}>Cancel</ButtonGhost>
//                   <ButtonPrimary
//                     onClick={saveLead}
//                     disabled={saving}
//                     icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
//                   >
//                     {saving ? "Saving…" : "Save"}
//                   </ButtonPrimary>
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="flex-1 overflow-y-auto p-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <Field label="First name" name="first_name" value={form.first_name} onChange={onFormChange} />
//                   <Field label="Last name" name="last_name" value={form.last_name} onChange={onFormChange} />
//                   <Field label="Email" name="email" value={form.email} onChange={onFormChange} type="email" />
//                   <Field label="Mobile" name="mobile" value={form.mobile} onChange={onFormChange} />
//                   <Field label="Salesforce ID" name="salesforce_id" value={form.salesforce_id} onChange={onFormChange} />
//                   <Field label="Add date (YYYY-MM-DD)" name="add_date" value={form.add_date} onChange={onFormChange} />
//                   <Field label="State" name="state" value={form.state} onChange={onFormChange} />
//                 </div>

//                 {/* Mini summary */}
//                 <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700">
//                   <div className="font-semibold mb-2">Quick Summary</div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                     <div><span className="text-slate-500">Name:</span> {form.first_name || "—"} {form.last_name || ""}</div>
//                     <div><span className="text-slate-500">Email:</span> {form.email || "—"}</div>
//                     <div><span className="text-slate-500">Mobile:</span> {form.mobile || "—"}</div>
//                     <div><span className="text-slate-500">State:</span> {form.state || "—"}</div>
//                   </div>
//                 </div>
//               </div>
//             </motion.section>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// /* ─────────────────────────── UI bits ─────────────────────────── */

// function ButtonPrimary({ children, onClick, disabled, icon, type = "button" }) {
//   return (
//     <motion.button
//       whileTap={!disabled ? { scale: 0.98 } : undefined}
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 font-semibold text-white transition",
//         "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700",
//         "shadow-[0_8px_24px_-12px_rgba(37,99,235,0.5)]",
//         "disabled:opacity-60 disabled:cursor-not-allowed"
//       )}
//     >
//       {icon}
//       <span className="whitespace-nowrap">{children}</span>
//     </motion.button>
//   );
// }

// function ButtonGhost({ children, onClick, icon, type = "button" }) {
//   return (
//     <motion.button
//       whileTap={{ scale: 0.98 }}
//       type={type}
//       onClick={onClick}
//       className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-800 ring-1 ring-white/70 transition hover:bg-slate-50"
//     >
//       {icon}
//       <span className="whitespace-nowrap">{children}</span>
//     </motion.button>
//   );
// }

// function PagerButton({ children, disabled, onClick }) {
//   return (
//     <motion.button
//       whileTap={!disabled ? { scale: 0.98 } : undefined}
//       disabled={disabled}
//       onClick={onClick}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-sm transition",
//         disabled
//           ? "cursor-not-allowed border-slate-200 text-slate-400 bg-white"
//           : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
//       )}
//     >
//       {children}
//     </motion.button>
//   );
// }

// function Th({ children, sortKey, sortBy, sortDir, onSort }) {
//   const active = sortBy === sortKey;
//   return (
//     <th
//       className={cx(
//         "px-5 py-3 font-semibold select-none cursor-pointer",
//         active && "text-slate-900"
//       )}
//       onClick={() => onSort(sortKey)}
//       title="Sort"
//     >
//       <span className="inline-flex items-center gap-1">
//         {children}
//         <span className={cx("text-xs", active ? "opacity-100" : "opacity-20")}>
//           {active ? (sortDir === "asc" ? "▲" : "▼") : "▲"}
//         </span>
//       </span>
//     </th>
//   );
// }

// function RowSkeleton({ rows = 6, cols = 6 }) {
//   return (
//     <>
//       {Array.from({ length: rows }).map((_, r) => (
//         <tr key={r} className="animate-pulse">
//           {Array.from({ length: cols }).map((__, c) => (
//             <td key={c} className="px-5 py-3">
//               <div className="h-4 w-28 rounded bg-slate-100" />
//             </td>
//           ))}
//         </tr>
//       ))}
//     </>
//   );
// }

// function Field({ label, name, value, onChange, type = "text" }) {
//   return (
//     <label className="block">
//       <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-blue-400/30"
//       />
//     </label>
//   );
// }

// function InfoRow({ label, value, copySafe = false, icon }) {
//   return (
//     <div className="flex items-start gap-3">
//       <span className="mt-0.5 text-slate-400">{icon}</span>
//       <div className="min-w-0">
//         <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
//         <div className={cx("text-sm text-slate-800", copySafe ? "break-all" : "break-words")}>{value}</div>
//       </div>
//     </div>
//   );
// }





















"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Edit3,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Loader2,
  Shield,
  Smartphone,
  Mail,
  Hash,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────────────
 * Config
 * ────────────────────────────────────────────────────────────────────────── */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const ENDPOINTS = {
  LIST: `${API_URL}/api/admin/leadss`,
  UPDATE: (id) => `${API_URL}/api/admin/leads/${id}`,
};

/* Utility: classnames */
function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

/* Debounce */
function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* Date helpers */
function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function fmtDT(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d || "");
    return dt.toLocaleString();
  } catch {
    return String(d || "");
  }
}

/* Motion variants */
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.05 } } };
const glassPop = {
  hidden: { opacity: 0, scale: 0.98, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.98, y: 12, transition: { duration: 0.18 } },
};
const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/* Pill chip */
function Chip({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    red: "bg-rose-100 text-rose-700 ring-rose-200",
    blue: "bg-blue-100 text-blue-700 ring-blue-200",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1",
        tones[tone] || tones.slate
      )}
    >
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Page: Admin Leads (View + Edit)
 * ────────────────────────────────────────────────────────────────────────── */
export default function AdminLeads() {
  const token = useRef(localStorage.getItem("token") || null);

  // data
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ui state
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [sortBy, setSortBy] = useState("add_date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // editor (full-page slide-over)
  const [showEditor, setShowEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    add_date: "",
    salesforce_id: "",
    mobile: "",
    state: "",
  });

  /* Fetch */
  async function fetchLeads() {
    if (!token.current) {
      setLoading(false);
      toast.error("No auth token found. Please log in.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(ENDPOINTS.LIST, {
        headers: { Authorization: `Bearer ${token.current}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json) ? json : Array.isArray(json?.leads) ? json.leads : [];
      setLeads(list);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchLeads();
  }, []);

  async function refreshAll() {
    setRefreshing(true);
    await fetchLeads();
    setRefreshing(false);
  }

  /* Derived */
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let list = leads.filter((l) => {
      if (!q) return true;
      const name = `${l.first_name || ""} ${l.last_name || ""}`.toLowerCase();
      const fields = [
        name,
        (l.email || "").toLowerCase(),
        (l.mobile || "").toLowerCase(),
        (l.salesforce_id || "").toLowerCase(),
        (l.state || "").toLowerCase(),
      ];
      return fields.some((f) => f.includes(q));
    });

    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const nameA = `${a.first_name || ""} ${a.last_name || ""}`.trim().toLowerCase();
      const nameB = `${b.first_name || ""} ${b.last_name || ""}`.trim().toLowerCase();
      let va, vb;
      switch (sortBy) {
        case "name":
          va = nameA; vb = nameB; break;
        case "email":
          va = (a.email || "").toLowerCase(); vb = (b.email || "").toLowerCase(); break;
        case "mobile":
          va = (a.mobile || "").toLowerCase(); vb = (b.mobile || "").toLowerCase(); break;
        case "state":
          va = (a.state || "").toLowerCase(); vb = (b.state || "").toLowerCase(); break;
        case "add_date":
        default:
          va = new Date(a.add_date || 0).getTime();
          vb = new Date(b.add_date || 0).getTime();
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return list;
  }, [leads, debouncedQuery, sortBy, sortDir]);

  const totalLeads = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);

  /* Edit */
  function openEditor(lead) {
    setCurrentLead(lead);
    setForm({
      first_name: lead.first_name || "",
      last_name: lead.last_name || "",
      email: lead.email || "",
      add_date: toInputDate(lead.add_date),
      salesforce_id: lead.salesforce_id || "",
      mobile: lead.mobile || "",
      state: lead.state || "",
    });
    setShowEditor(true);
  }
  function onFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  async function saveLead() {
    if (!currentLead) return;
    if (!token.current) {
      toast.error("No auth token found.");
      return;
    }
    const payload = {
      first_name: form.first_name || "",
      last_name: form.last_name || "",
      email: form.email || "",
      add_date: form.add_date || "",
      salesforce_id: form.salesforce_id || null,
      mobile: form.mobile || "",
      state: form.state || null,
    };
    try {
      setSaving(true);
      const res = await fetch(ENDPOINTS.UPDATE(currentLead.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.current}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.detail || `HTTP ${res.status}`);
      }
      const updated = json?.updated_lead || { ...currentLead, ...payload };
      setLeads((prev) => prev.map((l) => (l.id === currentLead.id ? { ...l, ...updated } : l)));
      toast.success("Lead updated");
      setShowEditor(false);
      setCurrentLead(null);
    } catch (e) {
      console.error(e);
      toast.error(e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }
  function setSort(nextKey) {
    setSortBy((prevKey) => {
      if (prevKey === nextKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prevKey;
      } else {
        setSortDir(nextKey === "add_date" ? "desc" : "asc");
        return nextKey;
      }
    });
    setPage(1);
  }

  /* Render */
  return (
    <div className="min-h-screen w-full text-slate-900 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
      {/* Decorative aurora + neon glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      {/* Header (scrolls with page, now BELOW your global header) */}
      <header className="relative z-0 border-b border-slate-200/70 bg-white/60 backdrop-blur after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-cyan-400/70 after:to-transparent">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
                  Leads
                </span>
              </h1>
              <p className="text-sm text-slate-600">
                Browse and edit your leads with style ✨
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ButtonGhost
                onClick={refreshAll}
                icon={<RefreshCw className={cx("h-4 w-4", refreshing && "animate-spin")} />}
              >
                Refresh
              </ButtonGhost>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, email, mobile, Salesforce ID, state…"
                className="w-full rounded-2xl border border-slate-200/70 bg-white/80 pl-10 pr-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/60 transition focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 shadow-[0_0_0_0_rgba(0,0,0,0)] focus:shadow-[0_0_24px_-8px_rgba(34,211,238,0.55)]"
              />
            </div>

            {/* Page size */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="text-sm text-slate-600 hidden sm:block">
                Total: <span className="font-semibold text-slate-900">{totalLeads}</span>
              </div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm outline-none ring-1 ring-white/60 focus:ring-2 focus:ring-cyan-400/40 shadow-[0_0_24px_-12px_rgba(34,211,238,0.45)]"
              >
                {[12, 24, 48, 96].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        {/* Table (lg+) */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="hidden lg:block overflow-x-auto rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/50 shadow-[0_10px_40px_-18px_rgba(6,182,212,0.45)]"
        >
          <table className="min-w-full text-left">
            <thead className="bg-slate-50/80 text-slate-600 text-sm">
              <tr className="[&>th]:px-5 [&>th]:py-3">
                <Th sortKey="add_date" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
                  Added
                </Th>
                <Th sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
                  Name
                </Th>
                <Th sortKey="email" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
                  Email
                </Th>
                <Th sortKey="mobile" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
                  Mobile
                </Th>
                <Th sortKey="state" sortBy={sortBy} sortDir={sortDir} onSort={setSort}>
                  State
                </Th>
                <th className="px-5 py-3">SFDC</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <RowSkeleton rows={8} cols={8} />
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-600">
                    No leads found. Try searching something else.
                  </td>
                </tr>
              ) : (
                pageItems.map((l) => {
                  const name = `${l.first_name || ""} ${l.last_name || ""}`.trim() || "—";
                  return (
                    <motion.tr
                      key={l.id}
                      variants={fadeUp}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {l.add_date ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {fmtDT(l.add_date)}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900">{name}</td>
                      <td className="px-5 py-3 text-slate-800 break-all">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {l.email || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-800 break-all">
                        <span className="inline-flex items-center gap-1.5">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          {l.mobile || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {l.state ? <Chip tone="blue">{l.state}</Chip> : "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-800">
                        <span className="inline-flex items-center gap-1.5">
                          <Hash className="h-4 w-4 text-slate-400" />
                          {l.salesforce_id || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {l.dnc ? (
                          <Chip tone="red">DNC</Chip>
                        ) : (
                          <Chip tone="green">Callable</Chip>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end">
                          <ButtonPrimary onClick={() => openEditor(l)} icon={<Edit3 className="h-4 w-4" />}>
                            Edit
                          </ButtonPrimary>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Cards (sm & md) */}
        <div className="lg:hidden">
          {loading ? (
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur shadow p-4">
              <RowSkeleton rows={6} cols={1} />
            </div>
          ) : pageItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur shadow p-8 text-center text-slate-600">
              No leads found. Try searching something else.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {pageItems.map((l) => {
                const name = `${l.first_name || ""} ${l.last_name || ""}`.trim() || "—";
                return (
                  <motion.article
                    key={l.id}
                    variants={glassPop}
                    className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/60 shadow hover:shadow-lg transition-shadow p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 break-words">
                          {name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {l.add_date ? fmtDT(l.add_date) : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {l.state ? <Chip tone="blue">{l.state}</Chip> : null}
                        {l.dnc ? <Chip tone="red">DNC</Chip> : <Chip tone="green">Callable</Chip>}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={l.email || "—"} copySafe />
                      <InfoRow icon={<Smartphone className="h-4 w-4" />} label="Mobile" value={l.mobile || "—"} copySafe />
                      <InfoRow icon={<Hash className="h-4 w-4" />} label="SFDC" value={l.salesforce_id || "—"} />
                      {l.timezone ? <InfoRow icon={<Shield className="h-4 w-4" />} label="Timezone" value={l.timezone} /> : null}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <ButtonPrimary onClick={() => openEditor(l)} icon={<Edit3 className="h-4 w-4" />}>
                        Edit
                      </ButtonPrimary>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalLeads > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row text-slate-700">
            <div className="text-sm">
              Showing{" "}
              <span className="font-semibold text-slate-900">{Math.min(end, totalLeads)}</span> of {totalLeads}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PagerButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" /> Prev
              </PagerButton>
              <div className="text-sm">
                Page <span className="font-semibold text-slate-900">{page}</span> / {totalPages}
              </div>
              <PagerButton disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next <ChevronRight className="h-4 w-4" />
              </PagerButton>
            </div>
          </div>
        )}
      </main>

      {/* Full-page Editor Slide-Over */}
      <AnimatePresence>
        {showEditor && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setShowEditor(false)}
            />
            <motion.section
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[560px] md:w-[720px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0, transition: { type: "spring", stiffness: 260, damping: 28 } }}
              exit={{ x: "100%", transition: { duration: 0.2 } }}
              aria-label="Edit lead"
            >
              {/* Topbar */}
              <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">Edit Lead</h3>
                    <p className="text-xs text-slate-600">
                      Changes are saved to <span className="font-medium">#{currentLead?.id}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ButtonGhost onClick={() => setShowEditor(false)}>Cancel</ButtonGhost>
                  <ButtonPrimary
                    onClick={saveLead}
                    disabled={saving}
                    icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                  >
                    {saving ? "Saving…" : "Save"}
                  </ButtonPrimary>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First name" name="first_name" value={form.first_name} onChange={onFormChange} />
                  <Field label="Last name" name="last_name" value={form.last_name} onChange={onFormChange} />
                  <Field label="Email" name="email" value={form.email} onChange={onFormChange} type="email" />
                  <Field label="Mobile" name="mobile" value={form.mobile} onChange={onFormChange} />
                  <Field label="Salesforce ID" name="salesforce_id" value={form.salesforce_id} onChange={onFormChange} />
                  <Field label="Add date (YYYY-MM-DD)" name="add_date" value={form.add_date} onChange={onFormChange} />
                  <Field label="State" name="state" value={form.state} onChange={onFormChange} />
                </div>

                {/* Mini summary */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700">
                  <div className="font-semibold mb-2">Quick Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div><span className="text-slate-500">Name:</span> {form.first_name || "—"} {form.last_name || ""}</div>
                    <div><span className="text-slate-500">Email:</span> {form.email || "—"}</div>
                    <div><span className="text-slate-500">Mobile:</span> {form.mobile || "—"}</div>
                    <div><span className="text-slate-500">State:</span> {form.state || "—"}</div>
                  </div>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────── UI bits ─────────────────────────── */

function ButtonPrimary({ children, onClick, disabled, icon, type = "button" }) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 font-semibold text-white transition",
        "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700",
        "shadow-[0_8px_24px_-12px_rgba(37,99,235,0.55)]",
        "disabled:opacity-60 disabled:cursor-not-allowed"
      )}
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </motion.button>
  );
}

function ButtonGhost({ children, onClick, icon, type = "button" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-800 ring-1 ring-white/70 transition hover:bg-slate-50"
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </motion.button>
  );
}

function PagerButton({ children, disabled, onClick }) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-sm transition",
        disabled
          ? "cursor-not-allowed border-slate-200 text-slate-400 bg-white"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      )}
    >
      {children}
    </motion.button>
  );
}

function Th({ children, sortKey, sortBy, sortDir, onSort }) {
  const active = sortBy === sortKey;
  return (
    <th
      className={cx(
        "px-5 py-3 font-semibold select-none cursor-pointer",
        active && "text-slate-900"
      )}
      onClick={() => onSort(sortKey)}
      title="Sort"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <span className={cx("text-xs", active ? "opacity-100" : "opacity-20")}>
          {active ? (sortDir === "asc" ? "▲" : "▼") : "▲"}
        </span>
      </span>
    </th>
  );
}

function RowSkeleton({ rows = 6, cols = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-5 py-3">
              <div className="h-4 w-28 rounded bg-slate-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 shadow-[0_0_24px_-12px_rgba(34,211,238,0.45)]"
      />
    </label>
  );
}

function InfoRow({ label, value, copySafe = false, icon }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
        <div className={cx("text-sm text-slate-800", copySafe ? "break-all" : "break-words")}>{value}</div>
      </div>
    </div>
  );
}
