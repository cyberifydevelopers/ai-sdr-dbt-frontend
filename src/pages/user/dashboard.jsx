// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { motion, useMotionValue, useTransform } from "framer-motion";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { Database, Users, FileText, Phone, Bot } from "lucide-react";

// /**
//  * Dashboard — wired to FastAPI `GET /statistics`
//  *
//  * ✅ Matches your backend route exactly: `${API_URL}/statistics`.
//  * ✅ Sends Bearer token if present in localStorage as `auth_token`.
//  * ✅ Uses only white/blue/cyan palette, minimal neon accents.
//  * ✅ No key-in-spread mistakes; production-safe.
//  *
//  * Setup:
//  *   1) Create `.env` with VITE_API_URL=http://localhost:8000 (or your domain)
//  *   2) Ensure FastAPI CORS allows your Vite origin (http://localhost:5173 by default)
//  *   3) Drop this file as `src/pages/Dashboard.jsx` and render <Dashboard />
//  */
// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     leads: 0,
//     files: 0,
//     assistants: 0,
//     phone_numbers: 0,
//     knowledge_base: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

//   useEffect(() => {
//     let isMounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const token = localStorage.getItem("token");

//         // IMPORTANT: Your FastAPI route is "/statistics" (no /api prefix here)
//         const endpoint = `${API_URL}/api/statistics`;

//         const res = await fetch(endpoint, {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           // If you're using cookie-based auth instead of JWT, enable this:
//           // credentials: "include",
//           mode: "cors",
//         });

//         if (!res.ok) {
//           const body = await res.text();
//           throw new Error(`HTTP ${res.status}${body ? ` — ${body}` : ""}`);
//         }

//         const data = await res.json();
//         if (!isMounted) return;
//         setStats({
//           leads: Number(data?.leads ?? 0),
//           files: Number(data?.files ?? 0),
//           assistants: Number(data?.assistants ?? 0),
//           phone_numbers: Number(data?.phone_numbers ?? 0),
//           knowledge_base: Number(data?.knowledge_base ?? 0),
//         });
//       } catch (e) {
//         if (!isMounted) return;
//         const msg = e?.message || "Failed to load stats";
//         // Helpful hint for CORS issues
//         const hint = msg.includes("CORS")
//           ? " — Check FastAPI CORSMiddleware allow_origins/allow_credentials."
//           : "";
//         setError(msg + hint);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [API_URL]);

//   const COLORS = {
//     blue: "#2563eb",
//     sky: "#0ea5e9",
//     cyan: "#06b6d4",
//   };

//   const makeSeries = (endValue) => {
//     const N = 10;
//     const end = Math.max(0, Number(endValue) || 0);
//     const arr = Array.from({ length: N }, (_, i) => {
//       const t = i / (N - 1);
//       const wave = Math.sin(t * Math.PI) * 0.4;
//       const jitter = (Math.random() - 0.5) * 0.15;
//       const v = Math.max(0, Math.round(end * (0.6 + wave + jitter)));
//       return { label: `P${i + 1}`, value: v };
//     });
//     if (arr.length) arr[arr.length - 1].value = end;
//     return arr;
//   };

//   const overviewBar = useMemo(
//     () => [
//       { name: "Leads", value: stats.leads },
//       { name: "Files", value: stats.files },
//       { name: "Assistants", value: stats.assistants },
//       { name: "Phones", value: stats.phone_numbers },
//       { name: "KB", value: stats.knowledge_base },
//     ],
//     [stats]
//   );

//   const pieData = useMemo(() => {
//     const total = Math.max(
//       1,
//       stats.leads +
//         stats.files +
//         stats.assistants +
//         stats.phone_numbers +
//         stats.knowledge_base
//     );
//     return [
//       { name: "Leads", value: stats.leads },
//       { name: "Files", value: stats.files },
//       { name: "Assistants", value: stats.assistants },
//       { name: "Phones", value: stats.phone_numbers },
//       { name: "KB", value: stats.knowledge_base },
//     ].map((d) => ({ ...d, percent: (d.value / total) * 100 }));
//   }, [stats]);

//   const cards = useMemo(
//     () => [
//       {
//         key: "leads",
//         label: "Leads",
//         value: stats.leads,
//         icon: Users,
//         series: makeSeries(stats.leads),
//         color: COLORS.blue,
//       },
//       {
//         key: "files",
//         label: "Files",
//         value: stats.files,
//         icon: FileText,
//         series: makeSeries(stats.files),
//         color: COLORS.sky,
//       },
//       {
//         key: "assistants",
//         label: "Assistants",
//         value: stats.assistants,
//         icon: Bot,
//         series: makeSeries(stats.assistants),
//         color: COLORS.cyan,
//       },
//       {
//         key: "phone_numbers",
//         label: "Phone Numbers",
//         value: stats.phone_numbers,
//         icon: Phone,
//         series: makeSeries(stats.phone_numbers),
//         color: COLORS.sky,
//       },
//       {
//         key: "knowledge_base",
//         label: "Knowledge Base",
//         value: stats.knowledge_base,
//         icon: Database,
//         series: makeSeries(stats.knowledge_base),
//         color: COLORS.blue,
//       },
//     ],
//     [stats]
//   );

//   return (
//     <div className="min-h-[100dvh] bg-white text-slate-900">
//       {error && (
//         <div className="mx-auto max-w-9xl px-4 pt-4 mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow">
//           {error}
//         </div>
//       )}

//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
//         <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
//       </div>

//       <header className="mx-auto max-w-7xl px-4 pt-8 pb-6">
//         <h1 className="text-3xl md:text-4xl  -translate-x-[120px] font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
//           User Dashboard
//         </h1>
//         <p className="mt-1 text-sm  -translate-x-[120px] md:text-base text-slate-600">
//           Line • Bar • Pie — modern, minimal neon.
//         </p>
//       </header>

//       <main className="mx-auto max-w-9xl px-4">
//         <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
//           {cards.map((c) => (
//             <StatCard key={c.key} {...c} loading={loading} />
//           ))}
//         </section>

//         <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
//           <Panel title="Leads Trend (Synthetic)">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <LineChart
//                   data={cards[0].series}
//                   margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
//                 >
//                   <defs>
//                     <filter id="glowLineMain" x="-50%" y="-50%" width="200%" height="200%">
//                       <feGaussianBlur stdDeviation="3" result="blur" />
//                       <feMerge>
//                         <feMergeNode in="blur" />
//                         <feMergeNode in="SourceGraphic" />
//                       </feMerge>
//                     </filter>
//                     <linearGradient id="strokeLine" x1="0" y1="0" x2="1" y2="0">
//                       <stop offset="0%" stopColor={COLORS.cyan} />
//                       <stop offset="100%" stopColor={COLORS.blue} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
//                   <XAxis dataKey="label" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Line
//                     type="monotone"
//                     dataKey="value"
//                     stroke="url(#strokeLine)"
//                     strokeWidth={3.5}
//                     dot={false}
//                     activeDot={{ r: 6 }}
//                     style={{ filter: "url(#glowLineMain)" }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Overview by Metric">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <BarChart data={overviewBar} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
//                   <defs>
//                     <filter id="glowBarMain" x="-50%" y="-50%" width="200%" height="200%">
//                       <feGaussianBlur stdDeviation="2.5" result="blur" />
//                       <feMerge>
//                         <feMergeNode in="blur" />
//                         <feMergeNode in="SourceGraphic" />
//                       </feMerge>
//                     </filter>
//                     <linearGradient id="fillBars" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor={COLORS.sky} />
//                       <stop offset="100%" stopColor="#e6f6ff" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar dataKey="value" fill="url(#fillBars)" radius={[10, 10, 6, 6]} style={{ filter: "url(#glowBarMain)" }} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Share by Metric" className="lg:col-span-2">
//             <div className="h-80 w-full">
//               <ResponsiveContainer>
//                 <PieChart>
//                   <defs>
//                     <linearGradient id="pieGradBlue" x1="0" y1="0" x2="1" y2="1">
//                       <stop offset="0%" stopColor={COLORS.cyan} />
//                       <stop offset="100%" stopColor={COLORS.blue} />
//                     </linearGradient>
//                   </defs>
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Pie
//                     data={pieData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={110}
//                     innerRadius={70}
//                     paddingAngle={2}
//                   >
//                     <Cell fill="url(#pieGradBlue)" />
//                     <Cell fill="#bfe9ff" />
//                     <Cell fill="#8ed8ff" />
//                     <Cell fill="#60cfff" />
//                     <Cell fill="#a3d8ff" />
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </section>

//         <footer className="mx-auto mt-10 mb-12 text-center text-xs text-slate-500">
//           © {new Date().getFullYear()} – Minimal neon (white/blue) dashboard.
//         </footer>
//       </main>
//     </div>
//   );
// }

// function Panel({ title, children, className = "" }) {
//   return (
//     <div className={`relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ${className}`}>
//       <GlowBorder />
//       <h2 className="mb-4 text-base font-semibold text-slate-700">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function GlowBorder() {
//   return (
//     <div className="pointer-events-none absolute inset-0 rounded-3xl">
//       <div
//         className="absolute inset-0 rounded-3xl"
//         style={{
//           background: `linear-gradient(90deg, #06b6d433, transparent)`,
//           filter: "blur(22px)",
//           opacity: 0.6,
//         }}
//       />
//       <div className="absolute inset-0 rounded-3xl ring-1 ring-white/60" />
//     </div>
//   );
// }

// function StatCard({ label, value, icon: Icon, series, color, loading }) {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-50, 50], [8, -8]);
//   const rotateY = useTransform(x, [-50, 50], [-8, 8]);
//   const ref = useRef(null);

//   return (
//     <motion.div
//       ref={ref}
//       onMouseMove={(e) => {
//         const r = ref.current?.getBoundingClientRect();
//         if (!r) return;
//         x.set(e.clientX - r.left - r.width / 2);
//         y.set(e.clientY - r.top - r.height / 2);
//       }}
//       onMouseLeave={() => {
//         x.set(0);
//         y.set(0);
//       }}
//       style={{ rotateX, rotateY }}
//       className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl transition-transform duration-300"
    
//     >
//       <div
//         className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl"
//         style={{ background: `linear-gradient(135deg, ${color}66, #ffffff00)` }}
//       />
//       <div className="relative z-10">
//         <div className="flex items-center gap-3">
//           <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
//             <Icon className="h-6 w-6" style={{ color }} />
//           </div>
//           <div>
//             <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
//             <div className="flex items-baseline gap-2">
//               <h3 className="text-2xl font-black text-slate-900">
//                 {loading ? <SkeletonText /> : value}
//               </h3>
//               <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
//                 Live
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-3 h-20">
//           {loading ? (
//             <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
//           ) : (
//             <ResponsiveContainer>
//               <LineChart data={series} margin={{ top: 2, right: 8, left: -10, bottom: 0 }}>
//                 <defs>
//                   <filter id="glowMini" x="-50%" y="-50%" width="200%" height="200%">
//                     <feGaussianBlur stdDeviation="2" result="blur" />
//                     <feMerge>
//                       <feMergeNode in="blur" />
//                       <feMergeNode in="SourceGraphic" />
//                     </feMerge>
//                   </filter>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.12} />
//                 <XAxis dataKey="label" hide />
//                 <YAxis hide domain={[0, "dataMax+"]} />
//                 <Tooltip contentStyle={{ borderRadius: 12 }} />
//                 <Line
//                   type="monotone"
//                   dataKey="value"
//                   stroke={color}
//                   strokeWidth={2.5}
//                   dot={false}
//                   activeDot={{ r: 4 }}
//                   style={{ filter: "url(#glowMini)" }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function SkeletonText() {
//   return <span className="inline-block h-6 w-10 animate-pulse rounded bg-slate-200 align-middle" />;
// }



















// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { motion, useMotionValue, useTransform } from "framer-motion";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { Database, Users, FileText, Phone, Bot } from "lucide-react";

// /**
//  * Enhanced Dashboard — FastAPI `GET /api/statistics`
//  *
//  * ✨ What's new (this edit)
//  * - Share by Metric: neon curved arrows w/ glow & subtle motion
//  * - Modern gradient label pills w/ soft neon aura + micro animation
//  * - Zero-value labels stay hidden; smart non-overlapping layout retained
//  */
// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     leads: 0,
//     files: 0,
//     assistants: 0,
//     phone_numbers: 0,
//     knowledge_base: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

//   useEffect(() => {
//     let isMounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const token = localStorage.getItem("token");
//         const endpoint = `${API_URL}/api/statistics`;

//         const res = await fetch(endpoint, {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           mode: "cors",
//         });

//         if (!res.ok) {
//           const body = await res.text();
//           throw new Error(`HTTP ${res.status}${body ? ` — ${body}` : ""}`);
//         }

//         const data = await res.json();
//         if (!isMounted) return;
//         setStats({
//           leads: Number(data?.leads ?? 0),
//           files: Number(data?.files ?? 0),
//           assistants: Number(data?.assistants ?? 0),
//           phone_numbers: Number(data?.phone_numbers ?? 0),
//           knowledge_base: Number(data?.knowledge_base ?? 0),
//         });
//       } catch (e) {
//         if (!isMounted) return;
//         const msg = e?.message || "Failed to load stats";
//         const hint = msg.includes("CORS")
//           ? " — Check FastAPI CORSMiddleware allow_origins/allow_credentials."
//           : "";
//         setError(msg + hint);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [API_URL]);

//   const COLORS = {
//     blue: "#2563eb",
//     sky: "#0ea5e9",
//     cyan: "#06b6d4",
//   };

//   // Create a short synthetic series that ends exactly on the metric value
//   const makeSeries = (endValue) => {
//     const N = 12;
//     const end = Math.max(0, Number(endValue) || 0);
//     const arr = Array.from({ length: N }, (_, i) => {
//       const t = i / (N - 1);
//       const wave = Math.sin(t * Math.PI) * 0.4;
//       const jitter = (Math.random() - 0.5) * 0.12;
//       const v = Math.max(0, Math.round(end * (0.6 + wave + jitter)));
//       return { label: `P${i + 1}`, value: v };
//     });
//     if (arr.length) arr[arr.length - 1].value = end;
//     return arr;
//   };

//   const overviewBar = useMemo(
//     () => [
//       { name: "Leads", value: stats.leads },
//       { name: "Files", value: stats.files },
//       { name: "Assistants", value: stats.assistants },
//       { name: "Phones", value: stats.phone_numbers },
//       { name: "KB", value: stats.knowledge_base },
//     ],
//     [stats]
//   );

//   const pieData = useMemo(() => {
//     const total = Math.max(
//       1,
//       stats.leads + stats.files + stats.assistants + stats.phone_numbers + stats.knowledge_base
//     );
//     return [
//       { name: "Leads", value: stats.leads },
//       { name: "Files", value: stats.files },
//       { name: "Assistants", value: stats.assistants },
//       { name: "Phones", value: stats.phone_numbers },
//       { name: "KB", value: stats.knowledge_base },
//     ].map((d) => ({ ...d, percent: (d.value / total) * 100 }));
//   }, [stats]);

//   const cards = useMemo(
//     () => [
//       { key: "leads", label: "Leads", value: stats.leads, icon: Users, series: makeSeries(stats.leads), color: COLORS.blue },
//       { key: "files", label: "Files", value: stats.files, icon: FileText, series: makeSeries(stats.files), color: COLORS.sky },
//       { key: "assistants", label: "Assistants", value: stats.assistants, icon: Bot, series: makeSeries(stats.assistants), color: COLORS.cyan },
//       { key: "phone_numbers", label: "Phone Numbers", value: stats.phone_numbers, icon: Phone, series: makeSeries(stats.phone_numbers), color: COLORS.sky },
//       { key: "knowledge_base", label: "Knowledge Base", value: stats.knowledge_base, icon: Database, series: makeSeries(stats.knowledge_base), color: COLORS.blue },
//     ],
//     [stats]
//   );

//   return (
//     <div className="min-h-[100dvh] w-full bg-white text-slate-900">
//       {/* errors */}
//       {error && (
//         <div className="w-full px-4 md:px-8 pt-4 mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow">
//           {error}
//         </div>
//       )}

//       {/* animated background */}
//       <BackgroundFX />

//       <header className="w-full px-4 md:px-8 pt-10 pb-6">
//         <motion.h1
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent"
//         >
//           User Dashboard
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className="mt-1 text-sm md:text-base text-slate-600"
//         >
//           Live stats • Animated charts • Arrow labels
//         </motion.p>
//       </header>

//       <main className="w-full px-4 md:px-8 pb-16">
//         {/* top stat cards */}
//         <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
//           {cards.map((c) => (
//             <StatCard key={c.key} {...c} loading={loading} />
//           ))}
//         </section>

//         {/* charts */}
//         <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
//           <Panel title="Leads Trend (Synthetic)">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <LineChart data={cards[0].series} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
//                   <defs>
//                     <filter id="glowLineMain" x="-50%" y="-50%" width="200%" height="200%">
//                       <feGaussianBlur stdDeviation="3" result="blur" />
//                       <feMerge>
//                         <feMergeNode in="blur" />
//                         <feMergeNode in="SourceGraphic" />
//                       </feMerge>
//                     </filter>
//                     <linearGradient id="strokeLine" x1="0" y1="0" x2="1" y2="0">
//                       <stop offset="0%" stopColor="#06b6d4" />
//                       <stop offset="100%" stopColor="#2563eb" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
//                   <XAxis dataKey="label" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Line
//                     type="monotone"
//                     dataKey="value"
//                     stroke="url(#strokeLine)"
//                     strokeWidth={3.5}
//                     dot={false}
//                     activeDot={{ r: 6 }}
//                     style={{ filter: "url(#glowLineMain)" }}
//                     isAnimationActive
//                     animationBegin={120}
//                     animationDuration={900}
//                     animationEasing="ease"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Overview by Metric">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <BarChart data={overviewBar} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
//                   <defs>
//                     <filter id="glowBarMain" x="-50%" y="-50%" width="200%" height="200%">
//                       <feGaussianBlur stdDeviation="2.5" result="blur" />
//                       <feMerge>
//                         <feMergeNode in="blur" />
//                         <feMergeNode in="SourceGraphic" />
//                       </feMerge>
//                     </filter>
//                     <linearGradient id="fillBars" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#0ea5e9" />
//                       <stop offset="100%" stopColor="#e6f6ff" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar
//                     dataKey="value"
//                     fill="url(#fillBars)"
//                     radius={[10, 10, 6, 6]}
//                     style={{ filter: "url(#glowBarMain)" }}
//                     isAnimationActive
//                     animationBegin={140}
//                     animationDuration={800}
//                     animationEasing="ease-out"
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Share by Metric" className="lg:col-span-2">
//             <div className="h-80 w-full">
//               <ResponsiveContainer>
//                 <ShareByMetricChart data={pieData} />
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </section>

//         <footer className="mx-auto mt-10 text-center text-xs text-slate-500">
//           © {new Date().getFullYear()} – Minimal neon (white/blue) dashboard.
//         </footer>
//       </main>
//     </div>
//   );
// }

// /* ---------------- UI atoms ---------------- */
// function BackgroundFX() {
//   return (
//     <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
//       {/* soft blobs */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 0.6, scale: 1 }}
//         transition={{ duration: 0.8 }}
//         className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl"
//       />
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 0.6, scale: 1 }}
//         transition={{ duration: 0.9, delay: 0.05 }}
//         className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl"
//       />
//       {/* subtle animated grid */}
//       <motion.div
//         aria-hidden
//         initial={{ backgroundPosition: "0px 0px" }}
//         animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
//         transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
//         className="absolute inset-0 opacity-[0.08]"
//         style={{
//           backgroundImage:
//             "repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000, #000 1px, transparent 1px, transparent 40px)",
//         }}
//       />
//     </div>
//   );
// }

// function Panel({ title, children, className = "" }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.2 }}
//       transition={{ duration: 0.5 }}
//       className={`relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ${className}`}
//     >
//       <GlowBorder />
//       <h2 className="mb-4 text-base font-semibold text-slate-700">{title}</h2>
//       {children}
//     </motion.div>
//   );
// }

// function GlowBorder() {
//   return (
//     <div className="pointer-events-none absolute inset-0 rounded-3xl">
//       <div
//         className="absolute inset-0 rounded-3xl"
//         style={{ background: `linear-gradient(90deg, #06b6d433, transparent)`, filter: "blur(22px)", opacity: 0.6 }}
//       />
//       <div className="absolute inset-0 rounded-3xl ring-1 ring-white/60" />
//     </div>
//   );
// }

// function StatCard({ label, value, icon: Icon, series, color, loading }) {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-50, 50], [8, -8]);
//   const rotateY = useTransform(x, [-50, 50], [-8, 8]);
//   const ref = useRef(null);

//   return (
//     <motion.div
//       ref={ref}
//       onMouseMove={(e) => {
//         const r = ref.current?.getBoundingClientRect();
//         if (!r) return;
//         x.set(e.clientX - r.left - r.width / 2);
//         y.set(e.clientY - r.top - r.height / 2);
//       }}
//       onMouseLeave={() => {
//         x.set(0);
//         y.set(0);
//       }}
//       style={{ rotateX, rotateY }}
//       className="group relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl transition-transform duration-300 will-change-transform hover:-translate-y-1"
//     >
//       <div className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl" style={{ background: `linear-gradient(135deg, ${color}66, #ffffff00)` }} />
//       <div className="relative z-10">
//         <div className="flex items-center gap-3">
//           <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
//             <Icon className="h-6 w-6" style={{ color }} />
//           </div>
//           <div>
//             <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
//             <div className="flex items-baseline gap-2">
//               <h3 className="text-2xl font-black text-slate-900">
//                 {loading ? <SkeletonText /> : (
//                   <NumberTicker value={value} />
//                 )}
//               </h3>
//               <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
//                 Live
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-3 h-20">
//           {loading ? (
//             <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
//           ) : (
//             <ResponsiveContainer>
//               <LineChart data={series} margin={{ top: 2, right: 8, left: -10, bottom: 0 }}>
//                 <defs>
//                   <filter id="glowMini" x="-50%" y="-50%" width="200%" height="200%">
//                     <feGaussianBlur stdDeviation="2" result="blur" />
//                     <feMerge>
//                       <feMergeNode in="blur" />
//                       <feMergeNode in="SourceGraphic" />
//                     </feMerge>
//                   </filter>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.12} />
//                 <XAxis dataKey="label" hide />
//                 <YAxis hide domain={[0, "dataMax+"]} />
//                 <Tooltip contentStyle={{ borderRadius: 12 }} />
//                 <Line
//                   type="monotone"
//                   dataKey="value"
//                   stroke={color}
//                   strokeWidth={2.5}
//                   dot={false}
//                   activeDot={{ r: 4 }}
//                   style={{ filter: "url(#glowMini)" }}
//                   isAnimationActive
//                   animationBegin={120}
//                   animationDuration={700}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function NumberTicker({ value, duration = 800 }) {
//   const [display, setDisplay] = useState(0);
//   useEffect(() => {
//     let raf;
//     const from = display;
//     const to = Number(value) || 0;
//     const start = performance.now();
//     const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
//     function tick(now) {
//       const p = Math.min(1, (now - start) / duration);
//       setDisplay(Math.round(from + (to - from) * ease(p)));
//       if (p < 1) raf = requestAnimationFrame(tick);
//     }
//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);
//   return <span>{(display || 0).toLocaleString()}</span>;
// }

// function SkeletonText() {
//   return <span className="inline-block h-6 w-10 animate-pulse rounded bg-slate-200 align-middle" />;
// }

// /* ----------- Neon Arrowed Labels for the Pie chart ----------- */
// /**
//  * ArrowLabelNeon
//  * - Neon curved connector w/ gradient stroke, glow, and subtle flowing dash
//  * - Gradient pill label w/ soft aura + tiny hover lift
//  * - Old constraints kept: no overlap, hide zero values, stays outside the donut
//  */
// function ArrowLabelNeon(props) {
//   const {
//     cx, cy, midAngle, outerRadius,
//     name, value, percent,
//     laneSlot, sideRight, laneGap = 24, fixedTy
//   } = props;

//   const RAD = Math.PI / 180;
//   const angle = -midAngle * RAD;

//   // Anchor points near slice
//   const r1 = outerRadius + 6;
//   const sx = cx + Math.cos(angle) * r1;
//   const sy = cy + Math.sin(angle) * r1;

//   const r2 = outerRadius + 22;
//   const ex = cx + Math.cos(angle) * r2;
//   const ey = cy + Math.sin(angle) * r2;

//   // Column X safely outside
//   const isRight = !!sideRight;
//   let colX = isRight ? ex + 36 : ex - 36;

//   // Vertical placement (pre-solved to avoid overlap)
//   let ty = typeof fixedTy === "number" ? fixedTy : cy + laneSlot * laneGap;

//   // Keep labels outside ring
//   const clearance = 34;
//   const safeRightX = cx + outerRadius + clearance;
//   const safeLeftX = cx - outerRadius - clearance;
//   if (isRight) colX = Math.max(colX, safeRightX + 12);
//   else colX = Math.min(colX, safeLeftX - 12);

//   // Curved connector (cubic)
//   const curveStrength = 18;
//   const bend = (typeof laneSlot === "number" ? laneSlot : 0) * curveStrength;
//   const c1x = isRight ? ex + 16 : ex - 16;
//   const c1y = ey + bend * 0.25;
//   const c2x = isRight ? colX - 22 : colX + 22;
//   const c2y = ty + bend * 0.75;

//   // Label content & sizing
//   const pct = typeof percent === "number" ? Math.round(percent * 100) : 0;
//   const labelText = `${name}`;
//   const subText = `${value} • ${pct}%`;
//   const labelWidth = Math.max(136, labelText.length * 8 + subText.length * 4.2);
//   const rectX = isRight ? 0 : -labelWidth;
//   const textAnchor = isRight ? "start" : "end";

//   // Small hover micro-lift on labels (Framer Motion)
//   return (
//     <motion.g
//       initial={{ opacity: 0, y: 6 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.42 }}
//       whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
//       pointerEvents="none"
//     >
//       {/* Soft glow base (underlay) */}
//       <path
//         d={`M ${sx},${sy} C ${c1x},${c1y} ${c2x},${c2y} ${colX},${ty}`}
//         stroke="url(#neonStroke)"
//         strokeWidth="6"
//         strokeOpacity="0.22"
//         fill="none"
//         filter="url(#neonGlow)"
//       />

//       {/* Main connector with animated dash + arrowhead */}
//       <path
//         d={`M ${sx},${sy} C ${c1x},${c1y} ${c2x},${c2y} ${colX},${ty}`}
//         stroke="url(#neonStroke)"
//         strokeWidth="2.2"
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         markerEnd="url(#arrowheadGrad)"
//       >
//         {/* flowing dash animation */}
//         <animate attributeName="stroke-dasharray" values="0,200;40,200;0,200" dur="3s" repeatCount="indefinite" />
//         <animate attributeName="stroke-dashoffset" values="0;-60;0" dur="3s" repeatCount="indefinite" />
//       </path>

//       {/* Gradient label pill w/ aura */}
//       <g transform={`translate(${colX}, ${ty})`}>
//         {/* glow aura */}
//         <rect
//           x={rectX - 6}
//           y={-22}
//           rx="14"
//           ry="14"
//           width={labelWidth + 12}
//           height={40}
//           fill="url(#pillGlow)"
//           opacity="0.55"
//           filter="url(#pillBlur)"
//         />
//         {/* pill */}
//         <rect
//           x={rectX}
//           y={-18}
//           rx="12"
//           ry="12"
//           width={labelWidth}
//           height={32}
//           fill="url(#pillGrad)"
//           stroke="url(#pillStroke)"
//           strokeWidth="1"
//         />
//         {/* title */}
//         <text
//           x={rectX + (isRight ? 14 : labelWidth - 14)}
//           y={-2}
//           textAnchor={textAnchor}
//           fill="url(#labelTextGrad)"
//           style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 0.2 }}
//         >
//           {labelText}
//         </text>
//         {/* sub */}
//         <text
//           x={rectX + (isRight ? 14 : labelWidth - 14)}
//           y={12}
//           textAnchor={textAnchor}
//           className="fill-slate-700"
//           style={{ fontSize: 11.2, fontWeight: 600, opacity: 0.85 }}
//         >
//           {subText}
//         </text>
//       </g>
//     </motion.g>
//   );
// }

// function ShareByMetricChart({ data, width, height }) {
//   const startAngle = -90;
//   const endAngle = 270;
//   const outerR = 110;
//   const total = data.reduce((a, d) => a + (Number(d.value) || 0), 0);

//   // Geometry derived from ResponsiveContainer
//   const cx = (width || 0) * 0.5;
//   const cy = (height || 0) * 0.5;
//   const RAD = Math.PI / 180;
//   const span = endAngle - startAngle;

//   // Build entries with original index and numeric value (filter zero for labels)
//   let acc = startAngle;
//   const entries = data.map((d, i) => ({ index: i, value: Number(d.value) || 0 }));
//   const items = entries
//     .filter((e) => e.value > 0)
//     .map((e) => {
//       const slice = total ? (e.value / total) * span : 0;
//       const mid = acc + slice / 2;
//       acc += slice;
//       const ang = -mid * RAD;
//       const right = Math.cos(ang) >= 0;
//       const ty0 = cy + Math.sin(ang) * outerR; // ideal label Y close to its slice
//       return { index: e.index, ang, right, ty0, mid };
//     });

//   // Split sides and sort by preferred Y
//   const leftSide = items.filter((o) => !o.right).sort((a, b) => a.ty0 - b.ty0);
//   const rightSide = items.filter((o) => o.right).sort((a, b) => a.ty0 - b.ty0);

//   // Solve non-overlapping Ys per side within bounds
//   const minGapBase = 28; // baseline spacing
//   const boundsPad = 40;  // vertical room above/below ring
//   const minY = cy - (outerR + boundsPad);
//   const maxY = cy + (outerR + boundsPad);

//   const solveY = (arr) => {
//     if (!arr.length) return [];
//     const n = arr.length;
//     const avail = maxY - minY;
//     const gap = Math.min(Math.max(minGapBase, n > 1 ? avail / (n - 1) : minGapBase), 36);
//     const ys = new Array(n);
//     ys[0] = Math.max(arr[0].ty0, minY);
//     for (let i = 1; i < n; i++) {
//       ys[i] = Math.max(arr[i].ty0, ys[i - 1] + gap);
//     }
//     const overflow = ys[n - 1] - maxY;
//     if (overflow > 0) {
//       for (let i = 0; i < n; i++) ys[i] -= overflow;
//       if (ys[0] < minY) {
//         const delta = minY - ys[0];
//         for (let i = 0; i < n; i++) ys[i] += delta;
//       }
//     }
//     return ys;
//   };

//   const yLeft = solveY(leftSide);
//   const yRight = solveY(rightSide);

//   // Lookup for ArrowLabel props
//   const laneMap = new Map();
//   leftSide.forEach((o, idx) => laneMap.set(o.index, { fixedTy: yLeft[idx], slot: idx - (yLeft.length - 1) / 2, right: false }));
//   rightSide.forEach((o, idx) => laneMap.set(o.index, { fixedTy: yRight[idx], slot: idx - (yRight.length - 1) / 2, right: true }));

//   // Empty-state ring when values are zero
//   if (total === 0) {
//     return (
//       <PieChart width={width} height={height}>
//         <Pie data={[{ name: "No data", value: 1 }]} dataKey="value" cx="50%" cy="50%" outerRadius={outerR} innerRadius={70} fill="#e5e7eb" stroke="#cbd5e1" isAnimationActive />
//         <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500" style={{ fontSize: 12 }}>
//           No data
//         </text>
//       </PieChart>
//     );
//   }

//   return (
//     <PieChart width={width} height={height}>
//       <defs>
//         {/* Neon stroke gradient for connectors */}
//         <linearGradient id="neonStroke" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#22d3ee" />
//           <stop offset="50%" stopColor="#60a5fa" />
//           <stop offset="100%" stopColor="#2563eb" />
//         </linearGradient>

//         {/* Arrowhead with gradient fill */}
//         <marker id="arrowheadGrad" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
//           <polygon points="0 0, 12 4, 0 8" fill="url(#neonStroke)" />
//           <filter id="arrowGlow">
//             <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="b" />
//             <feMerge>
//               <feMergeNode in="b" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </marker>

//         {/* Global neon glow for connectors */}
//         <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
//           <feGaussianBlur stdDeviation="4" result="blur" />
//           <feColorMatrix
//             in="blur"
//             type="matrix"
//             values="0 0 0 0 0.2  0 0 0 0 0.6  0 0 0 0 1  0 0 0 1 0"
//           />
//           <feMerge>
//             <feMergeNode />
//             <feMergeNode in="SourceGraphic" />
//           </feMerge>
//         </filter>

//         {/* Pill gradients & strokes */}
//         <linearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#ffffff" />
//           <stop offset="100%" stopColor="#eff6ff" />
//         </linearGradient>
//         <linearGradient id="pillStroke" x1="0" y1="0" x2="1" y2="0">
//           <stop offset="0%" stopColor="#a5f3fc" />
//           <stop offset="100%" stopColor="#93c5fd" />
//         </linearGradient>
//         <radialGradient id="pillGlow" cx="50%" cy="50%" r="60%">
//           <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.6" />
//           <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
//         </radialGradient>
//         <filter id="pillBlur" x="-50%" y="-50%" width="200%" height="200%">
//           <feGaussianBlur stdDeviation="8" />
//         </filter>

//         {/* Gradient for label title text */}
//         <linearGradient id="labelTextGrad" x1="0" y1="0" x2="1" y2="0">
//           <stop offset="0%" stopColor="#0ea5e9" />
//           <stop offset="100%" stopColor="#2563eb" />
//         </linearGradient>

//         {/* Slice fill gradient for the first cell */}
//         <linearGradient id="pieGradBlue" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#06b6d4" />
//           <stop offset="100%" stopColor="#2563eb" />
//         </linearGradient>
//       </defs>

//       <Tooltip contentStyle={{ borderRadius: 12 }} />
//       <Pie
//         data={data}
//         dataKey="value"
//         nameKey="name"
//         cx="50%"
//         cy="50%"
//         startAngle={startAngle}
//         endAngle={endAngle}
//         outerRadius={outerR}
//         innerRadius={70}
//         paddingAngle={2}
//         isAnimationActive
//         animationBegin={140}
//         animationDuration={900}
//         animationEasing="ease-out"
//         label={(p) => {
//           if (!(p && p.value > 0)) return null; // hide label when value is 0
//           // Lane solution from earlier (attached via laneMap on parent):
//           // Recharts passes index; we recompute mapping here for a pure component.
//           // We'll mimic parent’s laneMap quickly:
//           // (We already computed yLeft/yRight above; reuse them)
//           const isRight = Math.cos((-p.midAngle * RAD)) >= 0;
//           // Find this index position on its side arrays:
//           const sideArr = isRight ? rightSide : leftSide;
//           const idx = sideArr.findIndex((o) => o.index === p.index);
//           const fixedTy = (isRight ? yRight : yLeft)[idx];
//           const slot = idx - ((isRight ? yRight : yLeft).length - 1) / 2;
//           return (
//             <ArrowLabelNeon
//               {...p}
//               laneSlot={slot}
//               sideRight={isRight}
//               fixedTy={fixedTy}
//               laneGap={30}
//             />
//           );
//         }}
//         labelLine={false}
//       >
//         {data.map((_, i) => (
//           <Cell
//             key={`cell-${i}`}
//             fill={
//               i === 0
//                 ? "url(#pieGradBlue)"
//                 : ["#bfe9ff", "#8ed8ff", "#60cfff", "#a3d8ff"][i - 1] || "#bfe9ff"
//             }
//             stroke="#ffffff"
//             strokeOpacity={0.9}
//           />
//         ))}
//       </Pie>
//     </PieChart>
//   );
// }










"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Database, Users, FileText, Phone, Bot } from "lucide-react";

/**
 * Enhanced Dashboard — FastAPI `GET /api/statistics`
 *
 * Desktop unchanged. Responsive upgrades:
 * - Bar chart X-axis labels hide on compact widths
 * - Pie switches from arrowed labels (desktop) to in-slice labels (compact)
 */
export default function Dashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    files: 0,
    assistants: 0,
    phone_numbers: 0,
    knowledge_base: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

  // simple breakpoint hook (desktop >= 1024px)
  const { width } = useWindowSize();
  const isDesktop = (width || 0) >= 1024;
  const isCompact = !isDesktop; // tablet + mobile behavior

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const endpoint = `${API_URL}/api/statistics`;

        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          mode: "cors",
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`HTTP ${res.status}${body ? ` — ${body}` : ""}`);
        }

        const data = await res.json();
        if (!isMounted) return;
        setStats({
          leads: Number(data?.leads ?? 0),
          files: Number(data?.files ?? 0),
          assistants: Number(data?.assistants ?? 0),
          phone_numbers: Number(data?.phone_numbers ?? 0),
          knowledge_base: Number(data?.knowledge_base ?? 0),
        });
      } catch (e) {
        if (!isMounted) return;
        const msg = (e && e.message) || "Failed to load stats";
        const hint = msg.includes("CORS")
          ? " — Check FastAPI CORSMiddleware allow_origins/allow_credentials."
          : "";
        setError(msg + hint);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const COLORS = {
    blue: "#2563eb",
    sky: "#0ea5e9",
    cyan: "#06b6d4",
  };

  // Create a short synthetic series that ends exactly on the metric value
  const makeSeries = (endValue) => {
    const N = 12;
    const end = Math.max(0, Number(endValue) || 0);
    const arr = Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1);
      const wave = Math.sin(t * Math.PI) * 0.4;
      const jitter = (Math.random() - 0.5) * 0.12;
      const v = Math.max(0, Math.round(end * (0.6 + wave + jitter)));
      return { label: `P${i + 1}`, value: v };
    });
    if (arr.length) arr[arr.length - 1].value = end;
    return arr;
  };

  const overviewBar = useMemo(
    () => [
      { name: "Leads", value: stats.leads },
      { name: "Files", value: stats.files },
      { name: "Assistants", value: stats.assistants },
      { name: "Phones", value: stats.phone_numbers },
      { name: "KB", value: stats.knowledge_base },
    ],
    [stats]
  );

  const pieData = useMemo(() => {
    const total = Math.max(
      1,
      stats.leads +
        stats.files +
        stats.assistants +
        stats.phone_numbers +
        stats.knowledge_base
    );
    return [
      { name: "Leads", value: stats.leads },
      { name: "Files", value: stats.files },
      { name: "Assistants", value: stats.assistants },
      { name: "Phones", value: stats.phone_numbers },
      { name: "KB", value: stats.knowledge_base },
    ].map((d) => ({ ...d, percent: (d.value / total) * 100 }));
  }, [stats]);

  const cards = useMemo(
    () => [
      {
        key: "leads",
        label: "Leads",
        value: stats.leads,
        icon: Users,
        series: makeSeries(stats.leads),
        color: COLORS.blue,
      },
      {
        key: "files",
        label: "Files",
        value: stats.files,
        icon: FileText,
        series: makeSeries(stats.files),
        color: COLORS.sky,
      },
      {
        key: "assistants",
        label: "Assistants",
        value: stats.assistants,
        icon: Bot,
        series: makeSeries(stats.assistants),
        color: COLORS.cyan,
      },
      {
        key: "phone_numbers",
        label: "Phone Numbers",
        value: stats.phone_numbers,
        icon: Phone,
        series: makeSeries(stats.phone_numbers),
        color: COLORS.sky,
      },
      {
        key: "knowledge_base",
        label: "Knowledge Base",
        value: stats.knowledge_base,
        icon: Database,
        series: makeSeries(stats.knowledge_base),
        color: COLORS.blue,
      },
    ],
    [stats]
  );

  return (
    <div className="min-h-[100dvh] w-full bg-white text-slate-900">
      {/* errors */}
      {error && (
        <div className="w-full px-4 md:px-8 pt-4 mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow">
          {error}
        </div>
      )}

      {/* animated background */}
      <BackgroundFX />

      <header className="w-full px-4 md:px-8 pt-10 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent"
        >
          User Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-1 text-sm md:text-base text-slate-600"
        >
          Live stats • Animated charts • Arrow labels
        </motion.p>
      </header>

      <main className="w-full px-4 md:px-8 pb-16">
        {/* top stat cards */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((c) => (
            <StatCard key={c.key} {...c} loading={loading} />
          ))}
        </section>

        {/* charts */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Leads Trend (Synthetic)">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart
                  data={cards[0].series}
                  margin={{ top: 12, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <filter
                      id="glowLineMain"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="strokeLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#strokeLine)"
                    strokeWidth={3.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                    style={{ filter: "url(#glowLineMain)" }}
                    isAnimationActive
                    animationBegin={120}
                    animationDuration={900}
                    animationEasing="ease"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Overview by Metric">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={overviewBar}
                  margin={{
                    top: 10,
                    right: 20,
                    left: isCompact ? 0 : -10,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <filter
                      id="glowBarMain"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="fillBars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#e6f6ff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    hide={isCompact} // hide labels on compact screens
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Bar
                    dataKey="value"
                    fill="url(#fillBars)"
                    radius={[10, 10, 6, 6]}
                    style={{ filter: "url(#glowBarMain)" }}
                    isAnimationActive
                    animationBegin={140}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Share by Metric" className="lg:col-span-2">
            <div className="h-80 w-full">
              <ResponsiveContainer>
                {/* ResponsiveContainer passes width/height to this child */}
                <ShareByMetricChart
                  data={pieData}
                  mode={isDesktop ? "desktop" : "compact"}
                />
              </ResponsiveContainer>
            </div>
          </Panel>
        </section>

        <footer className="mx-auto mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} – Minimal neon (white/blue) dashboard.
        </footer>
      </main>
    </div>
  );
}

/* ---------------- hooks ---------------- */
function useWindowSize() {
  const [size, set] = useState({ width: null, height: null });
  useEffect(() => {
    function onResize() {
      set({ width: window.innerWidth, height: window.innerHeight });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/* ---------------- UI atoms ---------------- */
function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.05 }}
        className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl"
      />
      {/* subtle animated grid */}
      <motion.div
        aria-hidden
        initial={{ backgroundPosition: "0px 0px" }}
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000, #000 1px, transparent 1px, transparent 40px)",
        }}
      />
    </div>
  );
}

function Panel({ title, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ${className}`}
    >
      <GlowBorder />
      <h2 className="mb-4 text-base font-semibold text-slate-700">{title}</h2>
      {children}
    </motion.div>
  );
}

function GlowBorder() {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-3xl">
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `linear-gradient(90deg, #06b6d433, transparent)`,
          filter: "blur(22px)",
          opacity: 0.6,
        }}
      />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/60" />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, series, color, loading }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(e.clientX - r.left - r.width / 2);
        y.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY }}
      className="group relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl transition-transform duration-300 will-change-transform hover:-translate-y-1"
    >
      <div
        className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl"
        style={{
          background: `linear-gradient(135deg, ${color}66, #ffffff00)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900">
                {loading ? <SkeletonText /> : <NumberTicker value={value} />}
              </h3>
              <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                Live
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 h-20">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <ResponsiveContainer>
              <LineChart
                data={series}
                margin={{ top: 2, right: 8, left: -10, bottom: 0 }}
              >
                <defs>
                  <filter
                    id="glowMini"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.12} />
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, "dataMax+"]} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  style={{ filter: "url(#glowMini)" }}
                  isAnimationActive
                  animationBegin={120}
                  animationDuration={700}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function NumberTicker({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const from = display;
    const to = Number(value) || 0;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(from + (to - from) * ease(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span>{(display || 0).toLocaleString()}</span>;
}

function SkeletonText() {
  return (
    <span className="inline-block h-6 w-10 animate-pulse rounded bg-slate-200 align-middle" />
  );
}

/* ----------- Neon Arrowed Labels (desktop) & Compact In-Slice Labels ----------- */

function ArrowLabelNeon(props) {
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
    percent,
    laneSlot,
    sideRight,
    laneGap = 24,
    fixedTy,
  } = props;

  const RAD = Math.PI / 180;
  const angle = -midAngle * RAD;

  // Anchor points near slice
  const r1 = outerRadius + 6;
  const sx = cx + Math.cos(angle) * r1;
  const sy = cy + Math.sin(angle) * r1;

  const r2 = outerRadius + 22;
  const ex = cx + Math.cos(angle) * r2;
  const ey = cy + Math.sin(angle) * r2;

  // Column X safely outside
  const isRight = !!sideRight;
  let colX = isRight ? ex + 36 : ex - 36;

  // Vertical placement (pre-solved to avoid overlap)
  let ty = typeof fixedTy === "number" ? fixedTy : cy + laneSlot * laneGap;

  // Keep labels outside ring
  const clearance = 34;
  const safeRightX = cx + outerRadius + clearance;
  const safeLeftX = cx - outerRadius - clearance;
  if (isRight) colX = Math.max(colX, safeRightX + 12);
  else colX = Math.min(colX, safeLeftX - 12);

  // Curved connector (cubic)
  const curveStrength = 18;
  const bend = (typeof laneSlot === "number" ? laneSlot : 0) * curveStrength;
  const c1x = isRight ? ex + 16 : ex - 16;
  const c1y = ey + bend * 0.25;
  const c2x = isRight ? colX - 22 : colX + 22;
  const c2y = ty + bend * 0.75;

  const pct = typeof percent === "number" ? Math.round(percent * 100) : 0;
  const labelText = `${name}`;
  const subText = `${value} • ${pct}%`;
  const labelWidth = Math.max(
    136,
    labelText.length * 8 + subText.length * 4.2
  );
  const rectX = isRight ? 0 : -labelWidth;
  const textAnchor = isRight ? "start" : "end";

  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      pointerEvents="none"
    >
      {/* Soft glow base */}
      <path
        d={`M ${sx},${sy} C ${c1x},${c1y} ${c2x},${c2y} ${colX},${ty}`}
        stroke="url(#neonStroke)"
        strokeWidth="6"
        strokeOpacity="0.22"
        fill="none"
        filter="url(#neonGlow)"
      />
      {/* Main connector */}
      <path
        d={`M ${sx},${sy} C ${c1x},${c1y} ${c2x},${c2y} ${colX},${ty}`}
        stroke="url(#neonStroke)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd="url(#arrowheadGrad)"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0,200;40,200;0,200"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="0;-60;0"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {/* Gradient pill */}
      <g transform={`translate(${colX}, ${ty})`}>
        <rect
          x={rectX - 6}
          y={-22}
          rx="14"
          ry="14"
          width={labelWidth + 12}
          height={40}
          fill="url(#pillGlow)"
          opacity="0.55"
          filter="url(#pillBlur)"
        />
        <rect
          x={rectX}
          y={-18}
          rx="12"
          ry="12"
          width={labelWidth}
          height={32}
          fill="url(#pillGrad)"
          stroke="url(#pillStroke)"
          strokeWidth="1"
        />
        <text
          x={rectX + (isRight ? 14 : labelWidth - 14)}
          y={-2}
          textAnchor={textAnchor}
          fill="url(#labelTextGrad)"
          style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 0.2 }}
        >
          {labelText}
        </text>
        <text
          x={rectX + (isRight ? 14 : labelWidth - 14)}
          y={12}
          textAnchor={textAnchor}
          className="fill-slate-700"
          style={{ fontSize: 11.2, fontWeight: 600, opacity: 0.85 }}
        >
          {subText}
        </text>
      </g>
    </motion.g>
  );
}

/** Compact in-slice label (no arrows) */
function CompactSliceLabel(p) {
  const RAD = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
    percent,
  } = p;
  const r = innerRadius + (outerRadius - innerRadius) * 0.58;
  const x = cx + Math.cos(-midAngle * RAD) * r;
  const y = cy + Math.sin(-midAngle * RAD) * r;

  const pct = Math.round((percent || 0) * 100);
  // hide labels for tiny slices to avoid clutter on small screens
  if (pct < 7) return null;

  return (
    <g>
      <text
        x={x}
        y={y - 6}
        textAnchor="middle"
        className="fill-slate-800"
        style={{ fontSize: 11.5, fontWeight: 800 }}
      >
        {name}
      </text>
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        className="fill-slate-600"
        style={{ fontSize: 10.5, fontWeight: 700 }}
      >
        {value} • {pct}%
      </text>
    </g>
  );
}

function ShareByMetricChart({
  data,
  mode = "desktop",
  width,
  height,
}) {
  const startAngle = -90;
  const endAngle = 270;
  const outerR = 110;

  const RAD = Math.PI / 180;
  const total = data.reduce((a, d) => a + (Number(d.value) || 0), 0);
  const cx = (width || 0) * 0.5;
  const cy = (height || 0) * 0.5;

  const desktop = mode === "desktop";

  // ---------- Early empty state ----------
  if (total === 0) {
    return (
      <PieChart width={width} height={height}>
        <Pie
          data={[{ name: "No data", value: 1 }]}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={outerR}
          innerRadius={70}
          fill="#e5e7eb"
          stroke="#cbd5e1"
          isAnimationActive
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-500"
          style={{ fontSize: 12 }}
        >
          No data
        </text>
      </PieChart>
    );
  }

  // ---------- Lane solving for desktop arrows ----------
  const start = startAngle;
  const end = endAngle;
  const span = end - start;

  let acc = start;
  const entries = data.map((d, i) => ({ index: i, value: Number(d.value) || 0 }));
  const items = entries
    .filter((e) => e.value > 0)
    .map((e) => {
      const slice = total ? (e.value / total) * span : 0;
      const mid = acc + slice / 2;
      acc += slice;
      const ang = -mid * RAD;
      const right = Math.cos(ang) >= 0;
      const ty0 = cy + Math.sin(ang) * outerR;
      return { index: e.index, ang, right, ty0, mid };
    });

  const leftSide = items.filter((o) => !o.right).sort((a, b) => a.ty0 - b.ty0);
  const rightSide = items.filter((o) => o.right).sort((a, b) => a.ty0 - b.ty0);

  const minGapBase = 28;
  const boundsPad = 40;
  const minY = cy - (outerR + boundsPad);
  const maxY = cy + (outerR + boundsPad);

  const solveY = (arr) => {
    if (!arr.length) return [];
    const n = arr.length;
    const avail = maxY - minY;
    const gap = Math.min(
      Math.max(minGapBase, n > 1 ? avail / (n - 1) : minGapBase),
      36
    );
    const ys = new Array(n);
    ys[0] = Math.max(arr[0].ty0, minY);
    for (let i = 1; i < n; i++) {
      ys[i] = Math.max(arr[i].ty0, ys[i - 1] + gap);
    }
    const overflow = ys[n - 1] - maxY;
    if (overflow > 0) {
      for (let i = 0; i < n; i++) ys[i] -= overflow;
      if (ys[0] < minY) {
        const delta = minY - ys[0];
        for (let i = 0; i < n; i++) ys[i] += delta;
      }
    }
    return ys;
  };

  const yLeft = solveY(leftSide);
  const yRight = solveY(rightSide);

  return (
    <PieChart width={width} height={height}>
      <defs>
        {/* Neon stroke gradient for connectors */}
        <linearGradient id="neonStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Arrowhead with gradient fill */}
        <marker
          id="arrowheadGrad"
          markerWidth="12"
          markerHeight="8"
          refX="10"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 12 4, 0 8" fill="url(#neonStroke)" />
          <filter id="arrowGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </marker>

        {/* Global neon glow for connectors */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.2  0 0 0 0 0.6  0 0 0 0 1  0 0 0 1 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Pill gradients & strokes */}
        <linearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>
        <linearGradient id="pillStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <radialGradient id="pillGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <filter id="pillBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>

        {/* Gradient for label title text */}
        <linearGradient id="labelTextGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Slice fill gradient for the first cell */}
        <linearGradient id="pieGradBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      <Tooltip contentStyle={{ borderRadius: 12 }} />

      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        startAngle={startAngle}
        endAngle={endAngle}
        outerRadius={outerR}
        innerRadius={70}
        paddingAngle={2}
        isAnimationActive
        animationBegin={140}
        animationDuration={900}
        animationEasing="ease-out"
        label={
          desktop
            ? (p) => {
                if (!(p && p.value > 0)) return null;
                const RAD = Math.PI / 180;
                const isRight = Math.cos(-p.midAngle * RAD) >= 0;
                const sideArr = isRight ? rightSide : leftSide;
                const idx = sideArr.findIndex((o) => o.index === p.index);
                if (idx === -1) return null; // guard
                const sideYs = isRight ? yRight : yLeft;
                const fixedTy = sideYs[idx];
                if (typeof fixedTy !== "number") return null; // guard
                const slot = idx - (sideYs.length - 1) / 2;
                return (
                  <ArrowLabelNeon
                    {...p}
                    laneSlot={slot}
                    sideRight={isRight}
                    fixedTy={fixedTy}
                    laneGap={30}
                  />
                );
              }
            : (p) => <CompactSliceLabel {...p} />
        }
        labelLine={false}
      >
        {data.map((_, i) => (
          <Cell
            key={`cell-${i}`}
            fill={
              i === 0
                ? "url(#pieGradBlue)"
                : ["#bfe9ff", "#8ed8ff", "#60cfff", "#a3d8ff"][i - 1] ||
                  "#bfe9ff"
            }
            stroke="#ffffff"
            strokeOpacity={0.9}
          />
        ))}
      </Pie>
    </PieChart>
  );
}
