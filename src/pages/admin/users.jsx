// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Users,
//   Mail,
//   Calendar,
//   RefreshCw,
//   X,
//   Edit,
//   Trash2,
//   Eye,
//   Shield,
//   Crown,
//   ImageOff,
//   Image as ImageIcon,
//   CheckCircle2,
//   XCircle,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Filter,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// /* ---------------------------------------------------------
//    Config
// --------------------------------------------------------- */

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// // Back-end routes you shared (mounted under /api/admin)
// const R = {
//   USERS: `${API_URL}/api/admin/users`,
//   USER: (id) => `${API_URL}/api/admin/users/${id}`,
//   USER_DETAILS: (id) => `${API_URL}/api/admin/users/${id}/details`,
//   USER_PHOTO_INFO: (id) => `${API_URL}/api/admin/users/${id}/profile-photo`,
//   USER_PHOTO_DELETE: (id) => `${API_URL}/api/admin/users/${id}/profile-photo`,
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

// const roleBadgeClass = (role) =>
//   role === "admin"
//     ? "bg-red-100 text-red-700 border-red-200"
//     : "bg-blue-100 text-blue-700 border-blue-200";

// const formatDate = (val) => {
//   if (!val) return "—";
//   const d = new Date(val);
//   if (Number.isNaN(d.getTime())) return String(val);
//   return d.toLocaleString();
// };

// /* ---------------------------------------------------------
//    Tiny UI atoms
// --------------------------------------------------------- */

// function Pill({ children, className = "" }) {
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
//     >
//       {children}
//     </span>
//   );
// }

// function NeonRail() {
//   return (
//     <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
//   );
// }

// function Button({ children, className = "", ...props }) {
//   return (
//     <button
//       {...props}
//       className={`inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
//     >
//       {children}
//     </button>
//   );
// }

// /* ---------------------------------------------------------
//    Main Page
// --------------------------------------------------------- */

// export default function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     admins: 0,
//     verified: 0,
//     withPhoto: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [deletingId, setDeletingId] = useState(null);

//   // filters/search/pagination
//   const [q, setQ] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all"); // all | user | admin
//   const [verifiedFilter, setVerifiedFilter] = useState("all"); // all | verified | unverified
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // modals/drawers
//   const [editOpen, setEditOpen] = useState(false);
//   const [editUser, setEditUser] = useState(null);
//   const [editSaving, setEditSaving] = useState(false);

//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);

//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [details, setDetails] = useState(null);

//   // photo action
//   const [photoBusyId, setPhotoBusyId] = useState(null);

//   /* ---------------- Fetch ---------------- */

//   const fetchUsers = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setUsers([]);
//       setStats({ total: 0, admins: 0, verified: 0, withPhoto: 0 });
//       setErr("No auth token found.");
//       toast.error("No authentication token found.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setErr("");

//       const res = await fetch(R.USERS, {
//         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//         mode: "cors",
//       });

//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`HTTP ${res.status}${txt ? ` — ${txt}` : ""}`);
//       }

//       const data = await res.json();

//       if (!data?.success || !Array.isArray(data?.users)) {
//         throw new Error("Unexpected response shape.");
//       }

//       // Normalize & compute stats
//       const list = (data.users || []).map((u) => ({
//         id: u.id,
//         name: u.name || "—",
//         email: u.email || "—",
//         email_verified: !!u.email_verified,
//         role: u.role || "user",
//         profile_photo_url: toAbsoluteUrl(u.profile_photo_url || u.profile_photo),
//       }));

//       // Sort by name (fallback since created_at is not provided by API)
//       list.sort((a, b) => a.name.localeCompare(b.name));

//       setUsers(list);

//       const admins = list.filter((x) => x.role === "admin").length;
//       const verified = list.filter((x) => x.email_verified).length;
//       const withPhoto = list.filter((x) => !!x.profile_photo_url).length;

//       setStats({
//         total: data.total_users ?? list.length,
//         admins,
//         verified,
//         withPhoto,
//       });
//     } catch (e) {
//       setErr(e?.message || "Failed to load users");
//       toast.error(e?.message || "Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   /* ---------------- Filtering / Paging ---------------- */

//   const filtered = useMemo(() => {
//     let out = [...users];

//     if (q.trim()) {
//       const s = q.trim().toLowerCase();
//       out = out.filter(
//         (u) =>
//           String(u.name || "").toLowerCase().includes(s) ||
//           String(u.email || "").toLowerCase().includes(s)
//       );
//     }

//     if (roleFilter !== "all") {
//       out = out.filter((u) => u.role === roleFilter);
//     }

//     if (verifiedFilter !== "all") {
//       out = out.filter((u) =>
//         verifiedFilter === "verified" ? u.email_verified : !u.email_verified
//       );
//     }

//     return out;
//   }, [users, q, roleFilter, verifiedFilter]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

//   useEffect(() => {
//     // reset to page 1 when filters/search change
//     setCurrentPage(1);
//   }, [q, roleFilter, verifiedFilter]);

//   /* ---------------- Actions ---------------- */

//   const openEdit = (u) => {
//     setEditUser({ id: u.id, name: u.name, email: u.email, role: u.role });
//     setEditOpen(true);
//   };

//   const saveEdit = async () => {
//     if (!editUser) return;
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("No authentication token found.");

//     // Only send name/email/role per your backend
//     const payload = {
//       name: String(editUser.name || "").trim(),
//       email: String(editUser.email || "").trim(),
//       role: editUser.role === "admin" ? "admin" : "user",
//     };

//     try {
//       setEditSaving(true);
//       const res = await fetch(R.USER(editUser.id), {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       if (!res.ok || !data?.success) {
//         throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
//       }

//       toast.success("✅ User updated");
//       setEditOpen(false);
//       setEditUser(null);

//       // Update local list optimistically
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === payload.id
//             ? { ...u, ...payload }
//             : u.id === editUser.id
//             ? { ...u, ...payload }
//             : u
//         )
//       );
//       // But also refresh to sync avatars/derived fields
//       fetchUsers();
//     } catch (e) {
//       toast.error(e?.message || "Update failed");
//     } finally {
//       setEditSaving(false);
//     }
//   };

//   const askDelete = (id) => setConfirmDeleteId(id);

//   const doDelete = async () => {
//     const id = confirmDeleteId;
//     if (!id) return;
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("No authentication token found.");

//     try {
//       setDeletingId(id);
//       const res = await fetch(R.USER(id), {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//       });

//       const data = await res.json();
//       if (!res.ok || !data?.success) {
//         throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
//       }

//       toast.success("🗑️ User deleted");
//       setUsers((prev) => prev.filter((u) => u.id !== id));
//       setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
//       setConfirmDeleteId(null);
//     } catch (e) {
//       toast.error(e?.message || "Delete failed");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const openDetails = async (u) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("No authentication token found.");
//       return;
//     }
//     try {
//       setDetailsOpen(true);
//       setDetailsLoading(true);
//       setDetails(null);
//       const res = await fetch(R.USER_DETAILS(u.id), {
//         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//       });
//       const data = await res.json();
//       if (!res.ok || !data?.success) {
//         throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
//       }
//       setDetails(data.details);
//     } catch (e) {
//       toast.error(e?.message || "Failed to load details");
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   const removePhoto = async (userId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("No authentication token found.");

//     try {
//       setPhotoBusyId(userId);
//       const res = await fetch(R.USER_PHOTO_DELETE(userId), {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//       });
//       const data = await res.json();
//       if (!res.ok || !data?.success) {
//         throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
//       }
//       toast.success("🧼 Profile photo removed");
//       setUsers((prev) =>
//         prev.map((u) => (u.id === userId ? { ...u, profile_photo_url: null } : u))
//       );
//       setStats((prev) => ({
//         ...prev,
//         withPhoto: Math.max(0, prev.withPhoto - 1),
//       }));
//     } catch (e) {
//       toast.error(e?.message || "Failed to remove photo");
//     } finally {
//       setPhotoBusyId(null);
//     }
//   };

//   /* ---------------------------------------------------------
//      UI
//   --------------------------------------------------------- */

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* soft glows */}
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
//         <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
//       </div>

//       {/* Header card */}
//       <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
//         <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xl relative overflow-hidden">
//           <motion.div
//             className="absolute inset-0 opacity-20"
//             style={{
//               background:
//                 "radial-gradient(60% 60% at 0% 0%, rgba(14,165,233,0.25), transparent), radial-gradient(60% 60% at 100% 100%, rgba(37,99,235,0.25), transparent)",
//             }}
//             initial={{ opacity: 0.1 }}
//             animate={{ opacity: 0.2 }}
//             transition={{ duration: 1.2 }}
//           />
//           <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div className="flex items-center gap-4">
//               <div className="grid h-14 w-14 place-content-center rounded-2xl bg-gradient-to-br from-white to-slate-50 ring-1 ring-slate-200 shadow-inner">
//                 <Users className="h-7 w-7 text-blue-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
//                   <span className={`bg-clip-text text-transparent ${neonGrad}`}>
//                     User Management
//                   </span>
//                 </h1>
//                 <p className="text-sm sm:text-base text-slate-600">
//                   Manage roles, verify status, and inspect user assets.
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <Button onClick={fetchUsers} disabled={loading}>
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
//           <StatCard
//             label="Total Users"
//             value={stats.total}
//             Icon={Users}
//             tone="blue"
//           />
//           <StatCard
//             label="Admins"
//             value={stats.admins}
//             Icon={Crown}
//             tone="cyan"
//           />
//           <StatCard
//             label="Verified"
//             value={stats.verified}
//             Icon={CheckCircle2}
//             tone="blue"
//           />
//           <StatCard
//             label="With Photo"
//             value={stats.withPhoto}
//             Icon={ImageIcon}
//             tone="cyan"
//           />
//         </div>

//         {/* Controls */}
//         <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <div className="flex flex-1 items-center gap-2">
//               <div className="relative flex-1">
//                 <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 <input
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                   placeholder="Search by name or email"
//                   className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div className="hidden md:flex items-center gap-2 text-slate-500">
//                 <Filter className="h-4 w-4" />
//                 <span className="text-xs font-medium">Filters</span>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="all">All roles</option>
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//               </select>

//               <select
//                 value={verifiedFilter}
//                 onChange={(e) => setVerifiedFilter(e.target.value)}
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="all">All statuses</option>
//                 <option value="verified">Verified</option>
//                 <option value="unverified">Unverified</option>
//               </select>

//               {(q || roleFilter !== "all" || verifiedFilter !== "all") && (
//                 <Button
//                   onClick={() => {
//                     setQ("");
//                     setRoleFilter("all");
//                     setVerifiedFilter("all");
//                   }}
//                   className="text-slate-700"
//                 >
//                   Clear
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Table / Cards */}
//         <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
//           {/* header */}
//           <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
//             <div className="flex items-center gap-2">
//               <div className="grid h-8 w-8 place-content-center rounded-xl bg-blue-600 text-white">
//                 <Users className="h-4 w-4" />
//               </div>
//               <h2 className="text-sm sm:text-base font-bold text-slate-900">
//                 All Users ({filtered.length})
//               </h2>
//             </div>
//             <div className="flex items-center gap-2 text-xs text-slate-500">
//               <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//               Live
//             </div>
//           </div>

//           {/* loading / empty */}
//           {loading ? (
//             <div className="grid place-content-center py-16">
//               <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
//               <div className="text-sm text-slate-600">Loading users…</div>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="grid place-content-center py-16">
//               <div className="grid h-20 w-20 place-content-center rounded-full bg-slate-100 mb-4">
//                 <Users className="h-9 w-9 text-slate-400" />
//               </div>
//               <div className="text-lg font-semibold text-slate-700">No results</div>
//               <div className="text-sm text-slate-500">
//                 Try clearing filters or search
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* desktop table */}
//               <div className="hidden xl:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50 border-b border-slate-200">
//                     <tr>
//                       <Th>User</Th>
//                       <Th>Email</Th>
//                       <Th>Role</Th>
//                       <Th>Status</Th>
//                       <Th>Actions</Th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {currentItems.map((u) => (
//                       <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
//                         <Td>
//                           <div className="flex items-center gap-3">
//                             <Avatar url={u.profile_photo_url} name={u.name} />
//                             <div className="min-w-0">
//                               <div className="text-sm font-bold text-slate-900 truncate">
//                                 {u.name}
//                               </div>
//                               <div className="text-[11px] text-slate-500">ID #{u.id}</div>
//                             </div>
//                           </div>
//                         </Td>
//                         <Td>
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-3.5 w-3.5 text-slate-500" />
//                             <span className="text-xs font-medium text-slate-700">
//                               {u.email}
//                             </span>
//                           </div>
//                         </Td>
//                         <Td>
//                           <Pill className={`border ${roleBadgeClass(u.role)}`}>
//                             {u.role === "admin" ? (
//                               <>
//                                 <Crown className="mr-1 h-3.5 w-3.5" /> Admin
//                               </>
//                             ) : (
//                               <>
//                                 <Shield className="mr-1 h-3.5 w-3.5" /> User
//                               </>
//                             )}
//                           </Pill>
//                         </Td>
//                         <Td>
//                           {u.email_verified ? (
//                             <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">
//                               <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
//                               Verified
//                             </Pill>
//                           ) : (
//                             <Pill className="border bg-red-100 text-red-700 border-red-200">
//                               <XCircle className="mr-1 h-3.5 w-3.5" />
//                               Unverified
//                             </Pill>
//                           )}
//                         </Td>
//                         <Td>
//                           <div className="flex items-center gap-2">
//                             <Button
//                               onClick={() => openDetails(u)}
//                               className="px-2 py-1.5"
//                               title="View details"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               onClick={() => openEdit(u)}
//                               className="px-2 py-1.5"
//                               title="Edit"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               onClick={() => askDelete(u.id)}
//                               className="px-2 py-1.5 border-red-200 text-red-700 hover:bg-red-50"
//                               title="Delete"
//                             >
//                               {deletingId === u.id ? (
//                                 <RefreshCw className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <Trash2 className="h-4 w-4" />
//                               )}
//                             </Button>
//                             {u.profile_photo_url ? (
//                               <Button
//                                 onClick={() => removePhoto(u.id)}
//                                 disabled={photoBusyId === u.id}
//                                 className="px-2 py-1.5 border-amber-200 text-amber-700 hover:bg-amber-50"
//                                 title="Remove profile photo"
//                               >
//                                 {photoBusyId === u.id ? (
//                                   <RefreshCw className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                   <ImageOff className="h-4 w-4" />
//                                 )}
//                               </Button>
//                             ) : null}
//                           </div>
//                         </Td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* mobile/tablet cards */}
//               <div className="xl:hidden divide-y divide-slate-100">
//                 {currentItems.map((u, idx) => (
//                   <div key={u.id} className="p-4 sm:p-5">
//                     <div className="relative">
//                       {idx === 0 && <NeonRail />}
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-3">
//                           <Avatar size={44} url={u.profile_photo_url} name={u.name} />
//                           <div>
//                             <div className="text-base font-bold text-slate-900">
//                               {u.name}
//                             </div>
//                             <div className="flex items-center gap-1 text-sm text-slate-600">
//                               <Mail className="h-4 w-4 text-slate-500" />
//                               {u.email}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button onClick={() => openDetails(u)} className="px-3 py-2">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button onClick={() => openEdit(u)} className="px-3 py-2">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             onClick={() => askDelete(u.id)}
//                             className="px-3 py-2 border-red-200 text-red-700 hover:bg-red-50"
//                           >
//                             {deletingId === u.id ? (
//                               <RefreshCw className="h-4 w-4 animate-spin" />
//                             ) : (
//                               <Trash2 className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </div>

//                       <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
//                         <div>
//                           <span className={`inline-flex px-2 py-1 rounded-full border ${roleBadgeClass(u.role)} text-xs font-semibold`}>
//                             {u.role === "admin" ? (
//                               <>
//                                 <Crown className="mr-1 h-3.5 w-3.5" /> Admin
//                               </>
//                             ) : (
//                               <>
//                                 <Shield className="mr-1 h-3.5 w-3.5" /> User
//                               </>
//                             )}
//                           </span>
//                         </div>
//                         <div className="justify-self-end">
//                           {u.email_verified ? (
//                             <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">
//                               <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
//                               Verified
//                             </Pill>
//                           ) : (
//                             <Pill className="border bg-red-100 text-red-700 border-red-200">
//                               <XCircle className="mr-1 h-3.5 w-3.5" />
//                               Unverified
//                             </Pill>
//                           )}
//                         </div>
//                       </div>

//                       {u.profile_photo_url && (
//                         <div className="mt-3">
//                           <Button
//                             onClick={() => removePhoto(u.id)}
//                             disabled={photoBusyId === u.id}
//                             className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
//                           >
//                             {photoBusyId === u.id ? (
//                               <>
//                                 <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                                 Removing photo…
//                               </>
//                             ) : (
//                               <>
//                                 <ImageOff className="h-4 w-4 mr-2" />
//                                 Remove profile photo
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pagination */}
//               {filtered.length > itemsPerPage && (
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50">
//                   <div className="text-sm text-slate-600">
//                     Showing <b>{indexOfFirstItem + 1}</b>–<b>{Math.min(indexOfLastItem, filtered.length)}</b> of{" "}
//                     <b>{filtered.length}</b>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       <ChevronLeft className="h-4 w-4 mr-1" />
//                       Prev
//                     </Button>
//                     <div className="flex items-center gap-1">
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
//                     <Button
//                       onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                       disabled={currentPage >= totalPages}
//                     >
//                       Next <ChevronRight className="h-4 w-4 ml-1" />
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <AnimatePresence>
//         {editOpen && editUser && (
//           <Modal onClose={() => setEditOpen(false)} title="Edit User">
//             <div className="space-y-4">
//               <Field label="Name">
//                 <input
//                   value={editUser.name}
//                   onChange={(e) => setEditUser((s) => ({ ...s, name: e.target.value }))}
//                   className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="Enter name"
//                 />
//               </Field>
//               <Field label="Email">
//                 <input
//                   type="email"
//                   value={editUser.email}
//                   onChange={(e) => setEditUser((s) => ({ ...s, email: e.target.value }))}
//                   className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="Enter email"
//                 />
//               </Field>
//               <Field label="Role">
//                 <select
//                   value={editUser.role}
//                   onChange={(e) => setEditUser((s) => ({ ...s, role: e.target.value }))}
//                   className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </Field>

//               {/* Note: email_verified and password are intentionally omitted per backend contract */}
//             </div>

//             <div className="mt-6 flex justify-end gap-2">
//               <Button onClick={() => setEditOpen(false)} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-900">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={saveEdit}
//                 disabled={editSaving || !editUser.name || !editUser.email}
//                 className="border-blue-600 text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 {editSaving ? (
//                   <>
//                     <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                     Saving…
//                   </>
//                 ) : (
//                   "Save"
//                 )}
//               </Button>
//             </div>
//           </Modal>
//         )}
//       </AnimatePresence>

//       {/* Confirm Delete */}
//       <AnimatePresence>
//         {confirmDeleteId && (
//           <Modal onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
//             <div className="text-slate-800">
//               Are you sure you want to delete{" "}
//               <b>
//                 {users.find((u) => u.id === confirmDeleteId)?.name || "this user"}
//               </b>
//               ? This action cannot be undone.
//             </div>
//             <div className="mt-6 flex justify-end gap-2">
//               <Button onClick={() => setConfirmDeleteId(null)} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-900">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={doDelete}
//                 disabled={deletingId === confirmDeleteId}
//                 className="border-red-600 text-white bg-red-600 hover:bg-red-700"
//               >
//                 {deletingId === confirmDeleteId ? (
//                   <>
//                     <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                     Deleting…
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
//         {detailsOpen && (
//           <Drawer onClose={() => setDetailsOpen(false)} title="User Details">
//             {detailsLoading ? (
//               <div className="grid place-content-center h-48">
//                 <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
//                 <div className="text-sm text-slate-600">Loading details…</div>
//               </div>
//             ) : !details ? (
//               <div className="text-sm text-slate-600">No details.</div>
//             ) : (
//               <div className="space-y-6">
//                 {/* Top user card */}
//                 <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                   <div className="flex items-center gap-3">
//                     <Avatar
//                       url={toAbsoluteUrl(details.user.profile_photo_url || details.user.profile_photo)}
//                       name={details.user.name}
//                       size={48}
//                     />
//                     <div>
//                       <div className="font-bold text-slate-900">{details.user.name}</div>
//                       <div className="text-sm text-slate-600">{details.user.email}</div>
//                       <div className="mt-1">
//                         <span className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold ${roleBadgeClass(details.user.role)}`}>
//                           {details.user.role}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Counts */}
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   <MiniStat label="Phone Numbers" value={details.counts.purchased_numbers} />
//                   <MiniStat label="Assistants" value={details.counts.assistants} />
//                   <MiniStat label="Call Logs" value={details.counts.call_logs} />
//                   <MiniStat label="Documents" value={details.counts.documents} />
//                   <MiniStat label="Leads" value={details.counts.leads} />
//                 </div>

//                 {/* Simple lists (first few) */}
//                 <ListPreview
//                   title="Phone Numbers"
//                   items={(details.purchased_numbers || []).map((n) => ({
//                     k: n.id,
//                     primary: n.phone_number,
//                     secondary: n.iso_country || n.region || "",
//                     badge: n.friendly_name,
//                   }))}
//                 />
//                 <ListPreview
//                   title="Assistants"
//                   items={(details.assistants || []).map((a) => ({
//                     k: a.id,
//                     primary: a.name || a.vapi_assistant_id,
//                     secondary: a.provider || a.model || "",
//                     badge: a.category,
//                   }))}
//                 />
//                 <ListPreview
//                   title="Documents"
//                   items={(details.documents || []).map((d) => ({
//                     k: d.id,
//                     primary: d.file_name,
//                     secondary: d.vapi_file_id,
//                   }))}
//                 />
//                 <ListPreview
//                   title="Leads"
//                   items={(details.leads || []).map((l) => ({
//                     k: l.id,
//                     primary: `${l.first_name || ""} ${l.last_name || ""}`.trim() || l.email,
//                     secondary: l.email || l.mobile || "",
//                     badge: l.state || l.timezone,
//                   }))}
//                 />
//                 <ListPreview
//                   title="Call Logs"
//                   items={(details.call_logs || []).map((c) => ({
//                     k: c.id,
//                     primary: c.customer_name || c.customer_number || c.call_id,
//                     secondary: `${c.status || ""} • ${c.call_duration || 0}s`,
//                   }))}
//                 />
//               </div>
//             )}
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
//   const color = tone === "blue" ? "from-blue-600 to-cyan-500" : "from-cyan-500 to-blue-600";
//   return (
//     <motion.div
//       initial={{ y: 8, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
//     >
//       <div
//         className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl"
//         style={{ background: `linear-gradient(135deg, #06b6d466, #ffffff00)` }}
//       />
//       <div className="relative z-10 flex items-center gap-3">
//         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
//           <Icon className={`h-7 w-7 text-transparent bg-clip-text bg-gradient-to-br ${color}`} />
//         </div>
//         <div>
//           <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
//           <div className="text-2xl font-black text-slate-900">{value}</div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function Avatar({ url, name, size = 38 }) {
//   const initials = (name || "?")
//     .split(" ")
//     .map((w) => w.charAt(0))
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div
//       className="overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100 grid place-content-center text-slate-700 font-bold"
//       style={{ width: size, height: size }}
//     >
//       {url ? (
//         // eslint-disable-next-line @next/next/no-img-element
//         <img
//           src={url}
//           alt={name}
//           width={size}
//           height={size}
//           className="h-full w-full object-cover"
//           onError={(e) => {
//             e.currentTarget.style.display = "none";
//           }}
//         />
//       ) : (
//         <span style={{ fontSize: size < 40 ? 12 : 13 }}>{initials}</span>
//       )}
//     </div>
//   );
// }

// function Th({ children }) {
//   return (
//     <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
//       {children}
//     </th>
//   );
// }
// function Td({ children }) {
//   return <td className="px-4 py-4 align-middle">{children}</td>;
// }

// function Field({ label, children }) {
//   return (
//     <div>
//       <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
//       {children}
//     </div>
//   );
// }

// function MiniStat({ label, value }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="text-xs text-slate-500">{label}</div>
//       <div className="text-lg font-extrabold text-slate-900">{value}</div>
//     </div>
//   );
// }

// function ListPreview({ title, items }) {
//   const top = (items || []).slice(0, 5);
//   if (top.length === 0) return null;
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="mb-3 text-sm font-semibold text-slate-900">{title}</div>
//       <div className="space-y-2">
//         {top.map((it) => (
//           <div
//             key={it.k}
//             className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
//           >
//             <div className="min-w-0">
//               <div className="font-semibold text-slate-800 truncate">{it.primary}</div>
//               <div className="text-xs text-slate-500 truncate">{it.secondary}</div>
//             </div>
//             {it.badge && (
//               <span className="ml-3 shrink-0 rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700">
//                 {it.badge}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------
//    Modal & Drawer (animated)
// --------------------------------------------------------- */

// function Modal({ children, onClose, title }) {
//   return (
//     <motion.div
//       className="fixed inset-0 z-50 grid place-items-center p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div
//         className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//         onClick={onClose}
//         aria-hidden="true"
//       />
//       <motion.div
//         className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
//         initial={{ y: 20, scale: 0.98, opacity: 0 }}
//         animate={{ y: 0, scale: 1, opacity: 1 }}
//         exit={{ y: 10, scale: 0.98, opacity: 0 }}
//         transition={{ type: "spring", stiffness: 240, damping: 22 }}
//       >
//         <div className="mb-4 flex items-center justify-between">
//           <div className="text-lg font-bold text-slate-900">{title}</div>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// }

// function Drawer({ children, onClose, title }) {
//   return (
//     <motion.div
//       className="fixed inset-0 z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
//       <motion.aside
//         className="absolute right-0 top-0 h-full w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl p-5 overflow-y-auto"
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "100%" }}
//         transition={{ type: "spring", stiffness: 220, damping: 28 }}
//       >
//         <div className="mb-4 flex items-center justify-between">
//           <div className="text-lg font-bold text-slate-900">{title}</div>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//         {children}
//       </motion.aside>
//     </motion.div>
//   );
// }






// second update 
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  Mail,
  RefreshCw,
  X,
  Edit,
  Trash2,
  Eye,
  Shield,
  Crown,
  ImageOff,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  LogIn,
  LogOut,
  Plus,
  KeyRound,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

/* ---------------------------------------------------------
   Config
--------------------------------------------------------- */

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const AFTER_IMPERSONATE_PATH =
  import.meta.env?.VITE_AFTER_IMPERSONATE_PATH || "/";

// Back-end routes (admin router mounted under /api/admin)
const R = {
  USERS: `${API_URL}/api/admin/users`,
  USER: (id) => `${API_URL}/api/admin/users/${id}`,
  USER_DETAILS: (id) => `${API_URL}/api/admin/users/${id}/details`,
  USER_PHOTO_DELETE: (id) => `${API_URL}/api/admin/users/${id}/profile-photo`,
  RESET_PASSWORD: (id) => `${API_URL}/api/admin/users/${id}/reset-password`,
  IMPERSONATE_LOGIN_AS: `${API_URL}/api/admin/impersonate/login-as`,
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

const roleBadgeClass = (role) =>
  role === "admin"
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-blue-100 text-blue-700 border-blue-200";

/* ---------------------------------------------------------
   Tiny UI atoms
--------------------------------------------------------- */

function Pill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function NeonRail() {
  return (
    <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
  );
}

/** Button with variants/sizes for consistent contrast everywhere */
function Button({
  children,
  className = "",
  variant = "outline",
  size = "md",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-3 py-2",
    lg: "text-sm px-4 py-2.5",
  };
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm",
    danger:
      "bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm",
    outline:
      "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 shadow-sm",
    subtle:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent",
  };

  return (
    <button
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------
   Main Page
--------------------------------------------------------- */

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    verified: 0,
    withPhoto: 0,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // filters/search/pagination
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | user | admin
  const [verifiedFilter, setVerifiedFilter] = useState("all"); // all | verified | unverified
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // modals/drawers
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);

  // create-user modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createdAutoPassword, setCreatedAutoPassword] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    role: "user",
    setPasswordManually: false,
    password: "",
  });

  // reset-password modal
  const [resetForId, setResetForId] = useState(null);
  const [resetSaving, setResetSaving] = useState(false);
  const [resetAutoPassword, setResetAutoPassword] = useState(null);
  const [resetManual, setResetManual] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  // photo action
  const [photoBusyId, setPhotoBusyId] = useState(null);

  // impersonation states
  const [impersonatingId, setImpersonatingId] = useState(null);
  const [impersonationInfo, setImpersonationInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("impersonation_info") || "null");
    } catch {
      return null;
    }
  });

  /* ---------------- Fetch ---------------- */

  const fetchUsers = useCallback(async () => {
    if (impersonationInfo) {
      setUsers([]);
      setStats({ total: 0, admins: 0, verified: 0, withPhoto: 0 });
      setErr("You're in impersonation mode. Exit impersonation to use admin tools.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setUsers([]);
      setStats({ total: 0, admins: 0, verified: 0, withPhoto: 0 });
      setErr("No auth token found.");
      toast.error("No authentication token found.");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const res = await fetch(R.USERS, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}${txt ? ` — ${txt}` : ""}`);
      }

      const data = await res.json();

      if (!data?.success || !Array.isArray(data?.users)) {
        throw new Error("Unexpected response shape.");
      }

      const list = (data.users || []).map((u) => ({
        id: u.id,
        name: u.name || "—",
        email: u.email || "—",
        email_verified: !!u.email_verified,
        role: u.role || "user",
        profile_photo_url: toAbsoluteUrl(u.profile_photo_url || u.profile_photo),
      }));

      list.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(list);

      const admins = list.filter((x) => x.role === "admin").length;
      const verified = list.filter((x) => x.email_verified).length;
      const withPhoto = list.filter((x) => !!x.profile_photo_url).length;

      setStats({
        total: data.total_users ?? list.length,
        admins,
        verified,
        withPhoto,
      });
    } catch (e) {
      setErr(e?.message || "Failed to load users");
      toast.error(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [impersonationInfo]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ---------------- Filtering / Paging ---------------- */

  const filtered = useMemo(() => {
    let out = [...users];

    if (q.trim()) {
      const s = q.trim().toLowerCase();
      out = out.filter(
        (u) =>
          String(u.name || "").toLowerCase().includes(s) ||
          String(u.email || "").toLowerCase().includes(s)
      );
    }

    if (roleFilter !== "all") {
      out = out.filter((u) => u.role === roleFilter);
    }

    if (verifiedFilter !== "all") {
      out = out.filter((u) =>
        verifiedFilter === "verified" ? u.email_verified : !u.email_verified
      );
    }

    return out;
  }, [users, q, roleFilter, verifiedFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, roleFilter, verifiedFilter]);

  /* ---------------- Actions ---------------- */

  const openEdit = (u) => {
    setEditUser({ id: u.id, name: u.name, email: u.email, role: u.role });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editUser) return;
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    const payload = {
      name: String(editUser.name || "").trim(),
      email: String(editUser.email || "").trim(),
      role: editUser.role === "admin" ? "admin" : "user",
    };

    try {
      setEditSaving(true);
      const res = await fetch(R.USER(editUser.id), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }

      toast.success("✅ User updated");
      setEditOpen(false);
      setEditUser(null);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === data.updated_user?.id
            ? {
                ...u,
                name: data.updated_user.name,
                email: data.updated_user.email,
                role: data.updated_user.role,
                profile_photo_url: toAbsoluteUrl(
                  data.updated_user.profile_photo_url || data.updated_user.profile_photo
                ),
              }
            : u
        )
      );

      fetchUsers();
    } catch (e) {
      toast.error(e?.message || "Update failed");
    } finally {
      setEditSaving(false);
    }
  };

  const askDelete = (id) => setConfirmDeleteId(id);

  const doDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    try {
      setDeletingId(id);
      const res = await fetch(R.USER(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }

      toast.success("🗑️ User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      setConfirmDeleteId(null);
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openDetails = async (u) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found.");
      return;
    }
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      setDetails(null);
      const res = await fetch(R.USER_DETAILS(u.id), {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }
      setDetails(data.details);
    } catch (e) {
      toast.error(e?.message || "Failed to load details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const removePhoto = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    try {
      setPhotoBusyId(userId);
      const res = await fetch(R.USER_PHOTO_DELETE(userId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }
      toast.success("🧼 Profile photo removed");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, profile_photo_url: null } : u))
      );
      setStats((prev) => ({
        ...prev,
        withPhoto: Math.max(0, prev.withPhoto - 1),
      }));
    } catch (e) {
      toast.error(e?.message || "Failed to remove photo");
    } finally {
      setPhotoBusyId(null);
    }
  };

  // Create user
  const createUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    const payload = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      role: createForm.role,
      password: createForm.setPasswordManually ? (createForm.password || "").trim() : null,
    };

    if (!payload.name || !payload.email) {
      return toast.error("Name and email are required.");
    }
    if (createForm.setPasswordManually && payload.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      setCreateSaving(true);
      const res = await fetch(R.USERS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }

      const cu = data.created_user;
      const newUser = {
        id: cu.id,
        name: cu.name,
        email: cu.email,
        role: cu.role || "user",
        email_verified: !!cu.email_verified,
        profile_photo_url: toAbsoluteUrl(cu.profile_photo_url || cu.profile_photo),
      };
      setUsers((prev) => [newUser, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        admins: prev.admins + (newUser.role === "admin" ? 1 : 0),
        verified: prev.verified + (newUser.email_verified ? 1 : 0),
        withPhoto: prev.withPhoto + (newUser.profile_photo_url ? 1 : 0),
      }));

      if (data.initial_password) {
        setCreatedAutoPassword(data.initial_password);
      } else {
        toast.success("🎉 User created");
      }

      // reset and close
      setCreateOpen(false);
      setCreateForm({
        name: "",
        email: "",
        role: "user",
        setPasswordManually: false,
        password: "",
      });
    } catch (e) {
      toast.error(e?.message || "Create failed");
    } finally {
      setCreateSaving(false);
    }
  };

  // Reset password
  const doResetPassword = async () => {
    if (!resetForId) return;
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    const payload =
      resetManual && resetPassword ? { new_password: resetPassword } : { new_password: null };

    try {
      setResetSaving(true);
      const res = await fetch(R.RESET_PASSWORD(resetForId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }

      if (data.new_password) {
        setResetAutoPassword(data.new_password);
      } else {
        toast.success("🔑 Password updated");
        setResetForId(null);
        setResetPassword("");
        setResetManual(false);
      }
    } catch (e) {
      toast.error(e?.message || "Reset failed");
    } finally {
      setResetSaving(false);
    }
  };

  // Impersonation
  const startImpersonation = async (user) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    try {
      setImpersonatingId(user.id);
      const res = await fetch(R.IMPERSONATE_LOGIN_AS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          reason: "Admin impersonation from Users panel",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }

      const { token: userToken, acting_as, impersonated_by } = data;

      localStorage.setItem("admin_token_backup", token);
      localStorage.setItem("token", userToken);
      localStorage.setItem(
        "impersonation_info",
        JSON.stringify({
          acting_as,
          impersonated_by,
          started_at: Date.now(),
        })
      );

      toast.success(`🔑 Now impersonating ${acting_as?.email || "user"}`);
      window.location.assign(AFTER_IMPERSONATE_PATH);
    } catch (e) {
      toast.error(e?.message || "Impersonation failed");
    } finally {
      setImpersonatingId(null);
    }
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
              <LogIn className="h-4 w-4 shrink-0" />
              <span className="font-semibold shrink-0">Impersonation active:</span>
              <span className="truncate">
                Acting as <b className="break-all">{impersonationInfo.acting_as?.email}</b>
              </span>
            </div>
            <Button
              onClick={exitImpersonation}
              variant="outline"
              className="text-amber-800 border-amber-300 hover:bg-amber-100"
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      )}

      {/* soft glows (clipped so no overflow) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
      </div>

      {/* Header card */}
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
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
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
                  <span className={`bg-clip-text text-transparent ${neonGrad}`}>
                    User Management
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Create users, manage roles, inspect assets, and impersonate users.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => setCreateOpen(true)}
                disabled={!!impersonationInfo}
                variant="primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>

              <Button onClick={fetchUsers} disabled={loading || !!impersonationInfo}>
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
          <StatCard label="Total Users" value={stats.total} Icon={Users} tone="blue" />
          <StatCard label="Admins" value={stats.admins} Icon={Crown} tone="cyan" />
          <StatCard label="Verified" value={stats.verified} Icon={CheckCircle2} tone="blue" />
          <StatCard label="With Photo" value={stats.withPhoto} Icon={ImageIcon} tone="cyan" />
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 lg:p-5 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <div className="relative flex-1 min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!!impersonationInfo}
                />
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-500 shrink-0">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-medium">Filters</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                disabled={!!impersonationInfo}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                disabled={!!impersonationInfo}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All statuses</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>

              {(q || roleFilter !== "all" || verifiedFilter !== "all") && (
                <Button
                  onClick={() => {
                    setQ("");
                    setRoleFilter("all");
                    setVerifiedFilter("all");
                  }}
                  className="text-slate-700"
                  disabled={!!impersonationInfo}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Users: Table on desktop, Card Grid on sub-xl */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-8 w-8 place-content-center rounded-xl bg-blue-600 text-white shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                All Users ({filtered.length})
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
                <LogIn className="h-9 w-9 text-amber-500" />
              </div>
              <div className="text-base sm:text-lg font-semibold text-slate-700">
                Exit impersonation to access admin data
              </div>
              <div className="mt-3">
                <Button onClick={exitImpersonation} variant="primary">
                  <LogOut className="h-4 w-4 mr-2" /> Exit Impersonation
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="grid place-content-center py-16">
              <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
              <div className="text-sm text-slate-600">Loading users…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid place-content-center py-16 px-4">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-slate-100 mb-4">
                <Users className="h-9 w-9 text-slate-400" />
              </div>
              <div className="text-lg font-semibold text-slate-700">No results</div>
              <div className="text-sm text-slate-500">Try clearing filters or search</div>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE (≥xl) */}
              <div className="hidden xl:block">
                <div className="w-full">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <Th>User</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentItems.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                          <Td>
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar url={u.profile_photo_url} name={u.name} />
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-900 truncate">
                                  {u.name}
                                </div>
                                <div className="text-[11px] text-slate-500 break-all">ID #{u.id}</div>
                              </div>
                            </div>
                          </Td>
                          <Td>
                            <div className="flex items-center gap-2 text-slate-700 min-w-0">
                              <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                              <span className="text-xs font-medium break-words">
                                {u.email}
                              </span>
                            </div>
                          </Td>
                          <Td>
                            <Pill className={`border ${roleBadgeClass(u.role)}`}>
                              {u.role === "admin" ? (
                                <>
                                  <Crown className="mr-1 h-3.5 w-3.5" /> Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="mr-1 h-3.5 w-3.5" /> User
                                </>
                              )}
                            </Pill>
                          </Td>
                          <Td>
                            {u.email_verified ? (
                              <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                Verified
                              </Pill>
                            ) : (
                              <Pill className="border bg-red-100 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Unverified
                              </Pill>
                            )}
                          </Td>
                          <Td>
                            <div className="flex flex-wrap gap-2 text-slate-700">
                              <Button onClick={() => openDetails(u)} variant="outline" size="sm" title="View details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => openEdit(u)} variant="outline" size="sm" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => setResetForId(u.id)}
                                variant="subtle"
                                size="sm"
                                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                title="Reset password"
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => startImpersonation(u)}
                                disabled={impersonatingId === u.id}
                                variant="subtle"
                                size="sm"
                                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                title="Login as this user"
                              >
                                {impersonatingId === u.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <LogIn className="h-4 w-4" />
                                )}
                              </Button>
                              <Button onClick={() => askDelete(u.id)} variant="danger" size="sm" title="Delete">
                                {deletingId === u.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                              {u.profile_photo_url ? (
                                <Button
                                  onClick={() => removePhoto(u.id)}
                                  disabled={photoBusyId === u.id}
                                  variant="subtle"
                                  size="sm"
                                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                                  title="Remove profile photo"
                                >
                                  {photoBusyId === u.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <ImageOff className="h-4 w-4" />
                                  )}
                                </Button>
                              ) : null}
                            </div>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARD GRID (<xl): 1col → 2col (sm) → 3col (lg) */}
              <div className="xl:hidden p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {currentItems.map((u, idx) => (
                    <div
                      key={u.id}
                      className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 overflow-hidden"
                    >
                      {idx === 0 && <NeonRail />}
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar size={48} url={u.profile_photo_url} name={u.name} />
                        <div className="min-w-0">
                          <div className="text-base font-bold text-slate-900 truncate">
                            {u.name}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-sm text-slate-600 min-w-0">
                            <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                            <span className="truncate break-words">{u.email}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full border ${roleBadgeClass(
                                u.role
                              )} text-[11px] font-semibold`}
                            >
                              {u.role === "admin" ? (
                                <>
                                  <Crown className="mr-1 h-3.5 w-3.5" /> Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="mr-1 h-3.5 w-3.5" /> User
                                </>
                              )}
                            </span>

                            {u.email_verified ? (
                              <Pill className="border bg-emerald-100 text-emerald-700 border-emerald-200">
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                Verified
                              </Pill>
                            ) : (
                              <Pill className="border bg-red-100 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Unverified
                              </Pill>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions (wrap, no overflow) */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => openDetails(u)} size="sm" className="grow sm:grow-0">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button onClick={() => openEdit(u)} size="sm" className="grow sm:grow-0">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => setResetForId(u.id)}
                          size="sm"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 grow sm:grow-0"
                        >
                          <KeyRound className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                        <Button
                          onClick={() => startImpersonation(u)}
                          disabled={impersonatingId === u.id}
                          size="sm"
                          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 grow sm:grow-0"
                          title="Login as this user"
                        >
                          {impersonatingId === u.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin mr-1" /> Acting…
                            </>
                          ) : (
                            <>
                              <LogIn className="h-4 w-4 mr-1" /> Login as
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => askDelete(u.id)}
                          variant="danger"
                          size="sm"
                          className="grow sm:grow-0"
                        >
                          {deletingId === u.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin mr-1" /> Deleting…
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </>
                          )}
                        </Button>

                        {u.profile_photo_url && (
                          <Button
                            onClick={() => removePhoto(u.id)}
                            disabled={photoBusyId === u.id}
                            className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                          >
                            {photoBusyId === u.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                Removing photo…
                              </>
                            ) : (
                              <>
                                <ImageOff className="h-4 w-4 mr-2" />
                                Remove photo
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* tiny id line that wraps safely */}
                      <div className="mt-3 text-[11px] text-slate-500 break-all">ID #{u.id}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {filtered.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50">
                  <div className="text-sm text-slate-600">
                    Showing <b>{indexOfFirstItem + 1}</b>–<b>{Math.min(indexOfLastItem, filtered.length)}</b> of{" "}
                    <b>{filtered.length}</b>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Prev
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
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {createOpen && (
          <Modal onClose={() => setCreateOpen(false)} title="Add User">
            <div className="space-y-4">
              <Field label="Name">
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter full name"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((s) => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="name@example.com"
                />
              </Field>
              <Field label="Role">
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm((s) => ({ ...s, role: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>

              <div className="rounded-xl border border-slate-200 p-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={createForm.setPasswordManually}
                    onChange={(e) =>
                      setCreateForm((s) => ({
                        ...s,
                        setPasswordManually: e.target.checked,
                        password: e.target.checked ? s.password : "",
                      }))
                    }
                  />
                  <span>Set password manually (otherwise it’ll auto-generate)</span>
                </label>
                {createForm.setPasswordManually && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={createForm.password}
                      onChange={(e) => setCreateForm((s) => ({ ...s, password: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter initial password"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button onClick={() => setCreateOpen(false)} variant="subtle">
                Cancel
              </Button>
              <Button
                onClick={createUser}
                disabled={
                  createSaving ||
                  !createForm.name.trim() ||
                  !createForm.email.trim() ||
                  (createForm.setPasswordManually && createForm.password.trim().length < 6)
                }
                variant="primary"
              >
                {createSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </>
                )}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Show generated password after create */}
      <AnimatePresence>
        {createdAutoPassword && (
          <Modal onClose={() => setCreatedAutoPassword(null)} title="Initial Password">
            <div className="text-sm text-slate-700">
              This user was created with an auto-generated password. Copy it now and share securely.
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <KeyRound className="h-4 w-4 text-slate-600" />
              <code className="font-mono text-slate-900 break-all">{createdAutoPassword}</code>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(createdAutoPassword);
                  toast.success("Copied!");
                }}
                className="ml-auto"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setCreatedAutoPassword(null)} variant="primary">
                Got it
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editOpen && editUser && (
          <Modal onClose={() => setEditOpen(false)} title="Edit User">
            <div className="space-y-4">
              <Field label="Name">
                <input
                  value={editUser.name}
                  onChange={(e) => setEditUser((s) => ({ ...s, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter name"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser((s) => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter email"
                />
              </Field>
              <Field label="Role">
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser((s) => ({ ...s, role: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button onClick={() => setEditOpen(false)} variant="subtle">
                Cancel
              </Button>
              <Button
                onClick={saveEdit}
                disabled={editSaving || !editUser.name || !editUser.email}
                variant="primary"
              >
                {editSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDeleteId && (
          <Modal onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
            <div className="text-slate-800">
              Are you sure you want to delete{" "}
              <b className="break-words">
                {users.find((u) => u.id === confirmDeleteId)?.name || "this user"}
              </b>
              ? This action cannot be undone.
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button onClick={() => setConfirmDeleteId(null)} variant="subtle">
                Cancel
              </Button>
              <Button
                onClick={doDelete}
                disabled={deletingId === confirmDeleteId}
                variant="danger"
              >
                {deletingId === confirmDeleteId ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reset Password */}
      <AnimatePresence>
        {resetForId && (
          <Modal
            onClose={() => {
              setResetForId(null);
              setResetAutoPassword(null);
              setResetManual(false);
              setResetPassword("");
            }}
            title="Reset Password"
          >
            {!resetAutoPassword ? (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={resetManual}
                      onChange={(e) => setResetManual(e.target.checked)}
                    />
                    <span>Set password manually (otherwise it’ll auto-generate)</span>
                  </label>
                  {resetManual && (
                    <input
                      type="text"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter new password"
                    />
                  )}
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <Button
                    onClick={() => {
                      setResetForId(null);
                      setResetManual(false);
                      setResetPassword("");
                    }}
                    variant="subtle"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={doResetPassword}
                    disabled={resetSaving || (resetManual && resetPassword.trim().length < 6)}
                    variant="primary"
                  >
                    {resetSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Updating…
                      </>
                    ) : (
                      "Reset"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-slate-700">
                  Auto-generated password. Copy it now and share securely.
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <KeyRound className="h-4 w-4 text-slate-600" />
                  <code className="font-mono text-slate-900 break-all">{resetAutoPassword}</code>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(resetAutoPassword);
                      toast.success("Copied!");
                    }}
                    className="ml-auto"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      setResetForId(null);
                      setResetAutoPassword(null);
                    }}
                    variant="primary"
                  >
                    Done
                  </Button>
                </div>
              </>
            )}
          </Modal>
        )}
      </AnimatePresence>

      {/* Details Drawer */}
      <AnimatePresence>
        {detailsOpen && (
          <Drawer onClose={() => setDetailsOpen(false)} title="User Details">
            {detailsLoading ? (
              <div className="grid place-content-center h-48">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-slate-600">Loading details…</div>
              </div>
            ) : !details ? (
              <div className="text-sm text-slate-600">No details.</div>
            ) : (
              <div className="space-y-6">
                {/* Top user card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      url={toAbsoluteUrl(
                        details.user.profile_photo_url || details.user.profile_photo
                      )}
                      name={details.user.name}
                      size={48}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{details.user.name}</div>
                      <div className="text-sm text-slate-600 break-words">{details.user.email}</div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold ${roleBadgeClass(
                            details.user.role
                          )}`}
                        >
                          {details.user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Counts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <MiniStat label="Phone Numbers" value={details.counts.purchased_numbers} />
                  <MiniStat label="Assistants" value={details.counts.assistants} />
                  <MiniStat label="Call Logs" value={details.counts.call_logs} />
                  <MiniStat label="Documents" value={details.counts.documents} />
                  <MiniStat label="Leads" value={details.counts.leads} />
                </div>

                {/* Simple lists (first few) */}
                <ListPreview
                  title="Phone Numbers"
                  items={(details.purchased_numbers || []).map((n) => ({
                    k: n.id,
                    primary: n.phone_number,
                    secondary: n.iso_country || n.region || "",
                    badge: n.friendly_name,
                  }))}
                />
                <ListPreview
                  title="Assistants"
                  items={(details.assistants || []).map((a) => ({
                    k: a.id,
                    primary: a.name || a.vapi_assistant_id,
                    secondary: a.provider || a.model || "",
                    badge: a.category,
                  }))}
                />
                <ListPreview
                  title="Documents"
                  items={(details.documents || []).map((d) => ({
                    k: d.id,
                    primary: d.file_name,
                    secondary: d.vapi_file_id,
                  }))}
                />
                <ListPreview
                  title="Leads"
                  items={(details.leads || []).map((l) => ({
                    k: l.id,
                    primary: `${l.first_name || ""} ${l.last_name || ""}`.trim() || l.email,
                    secondary: (l.email || l.mobile || "").toString(),
                    badge: l.state || l.timezone,
                  }))}
                />
                <ListPreview
                  title="Call Logs"
                  items={(details.call_logs || []).map((c) => ({
                    k: c.id,
                    primary: c.customer_name || c.customer_number || c.call_id,
                    secondary: `${c.status || ""} • ${c.call_duration || 0}s`,
                  }))}
                />
              </div>
            )}
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
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
    >
      <div
        className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl"
        style={{ background: `linear-gradient(135deg, #06b6d466, #ffffff00)` }}
      />
      <div className="relative z-10 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} text-white shadow-inner ring-1 ${ring}`}
        >
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

function Avatar({ url, name, size = 38 }) {
  const [broken, setBroken] = useState(false);
  const initials = (name || "?")
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const showInitials = broken || !url;

  return (
    <div
      className="overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100 grid place-content-center text-slate-700 font-bold"
      style={{ width: size, height: size }}
    >
      {!showInitials ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover max-w-full"
          onError={() => setBroken(true)}
        />
      ) : (
        <span style={{ fontSize: size < 40 ? 12 : 13 }}>{initials}</span>
      )}
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-4 py-4 align-middle">{children}</td>;
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

function ListPreview({ title, items }) {
  const top = (items || []).slice(0, 5);
  if (top.length === 0) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-900">{title}</div>
      <div className="space-y-2">
        {top.map((it) => (
          <div
            key={it.k}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          >
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 truncate">{it.primary}</div>
              <div className="text-xs text-slate-500 break-words">{it.secondary}</div>
            </div>
            {it.badge && (
              <span className="ml-3 shrink-0 rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                {it.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Modal & Drawer (animated)
--------------------------------------------------------- */

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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        className="relative z-10 w-full max-w-lg sm:max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
        initial={{ y: 20, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 10, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
          <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
          <Button
            onClick={onClose}
            variant="ghost"
            aria-label="Close"
            className="rounded-lg p-1.5"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-4 sm:px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Drawer({ children, onClose, title }) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.aside
        className="absolute right-0 top-0 h-full w-full sm:max-w-md md:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
          <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
          <Button onClick={onClose} variant="ghost" className="rounded-lg p-1.5" aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto">{children}</div>
      </motion.aside>
    </motion.div>
  );
}
