
// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   motion,
//   useMotionValue,
//   useTransform,
//   animate,
// } from "framer-motion";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   Users,
//   FileText,
//   Database,
//   Phone,
//   Bot,
//   PhoneCall,
//   RefreshCw,
//   Shield,
// } from "lucide-react";

// /* ------------------------------ Config ------------------------------ */

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// /** Prioritize your new route; keep fallbacks for safety. */
// const ENDPOINTS = [
//   `${API_URL}/api/admin/basic-admin-stats`, // <— your main endpoint
//   `${API_URL}/basic-admin-stats`,
//   `${API_URL}/api/basic-admin-stats`,
//   `${API_URL}/statistics`,
//   `${API_URL}/api/statistics`,
// ];

// const COLORS = {
//   blue: "#2563eb",
//   sky: "#0ea5e9",
//   cyan: "#06b6d4",
//   slate: "#0f172a",
//   light: "#e6f6ff",
// };

// const CHART_BG_STROKE = "3 3";

// /* ------------------------------ Helpers ------------------------------ */

// function formatNumber(n) {
//   const v = Number(n || 0);
//   if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
//   if (v >= 1_000) return (v / 1_000).toFixed(1) + "k";
//   return v.toLocaleString();
// }

// function entriesToArray(obj = {}, labelKey = "name", valueKey = "value") {
//   return Object.entries(obj || {}).map(([k, v]) => ({
//     [labelKey]: String(k),
//     [valueKey]: Number(v || 0),
//   }));
// }

// /** tiny synthetic micro-series from a final value (for sparklines) */
// function makeSeries(endValue) {
//   const N = 12;
//   const end = Math.max(0, Number(endValue) || 0);
//   const arr = Array.from({ length: N }, (_, i) => {
//     const t = i / (N - 1);
//     const wave = Math.sin(t * Math.PI) * 0.45;
//     const jitter = (Math.random() - 0.5) * 0.18;
//     const v = Math.max(0, Math.round(end * (0.55 + wave + jitter)));
//     return { label: `P${i + 1}`, value: v };
//   });
//   if (arr.length) arr[arr.length - 1].value = end;
//   return arr;
// }

// /* ------------------------------ Fetch Hook ------------------------------ */

// async function fetchStatsWithFallback() {
//   const token = localStorage.getItem("token") || localStorage.getItem("auth_token");

//   let lastErr;
//   for (const url of ENDPOINTS) {
//     try {
//       const res = await fetch(url, {
//         headers: {
//           Accept: "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         mode: "cors",
//       });
//       if (!res.ok) {
//         lastErr = new Error(`HTTP ${res.status}`);
//         continue;
//       }
//       const json = await res.json();
//       if (json?.success && json?.stats?.totals) {
//         return json;
//       }
//       if (json) return json; // tolerate slightly different shapes
//     } catch (e) {
//       lastErr = e;
//     }
//   }
//   throw lastErr || new Error("Failed to fetch stats");
// }

// /* ------------------------------ Animated Counter ------------------------------ */

// function AnimatedNumber({ value, className }) {
//   const mv = useMotionValue(0);
//   const rounded = useTransform(mv, (latest) => Math.round(latest));
//   const [display, setDisplay] = useState(0);

//   useEffect(() => {
//     const controls = animate(mv, Number(value || 0), { duration: 0.8, ease: "easeOut" });
//     const unsub = rounded.on("change", (v) => setDisplay(v));
//     return () => {
//       controls.stop();
//       unsub();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);

//   return <span className={className}>{formatNumber(display)}</span>;
// }

// /* ------------------------------ Panels & Chrome ------------------------------ */

// function Panel({ title, right, children, className = "" }) {
//   return (
//     <div className={`relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ${className}`}>
//       <GlowBorder />
//       <div className="mb-4 flex items-center justify-between gap-4">
//         <h2 className="text-base font-semibold text-slate-700">{title}</h2>
//         {right}
//       </div>
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
//           background: `linear-gradient(90deg, ${COLORS.cyan}33, transparent)`,
//           filter: "blur(22px)",
//           opacity: 0.6,
//         }}
//       />
//       <div className="absolute inset-0 rounded-3xl ring-1 ring-white/60" />
//     </div>
//   );
// }

// /* ------------------------------ Stat Card ------------------------------ */

// function StatCard({ label, value, icon: Icon, color, series, badge = "Live", loading }) {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-60, 60], [10, -10]);
//   const rotateY = useTransform(x, [-60, 60], [-10, 10]);
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
//           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
//             <Icon className="h-7 w-7" style={{ color }} />
//           </div>
//           <div>
//             <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
//             <div className="flex items-baseline gap-2">
//               <h3 className="text-2xl font-black text-slate-900">
//                 {loading ? <SkeletonText /> : <AnimatedNumber value={value} />}
//               </h3>
//               {badge && (
//                 <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
//                   {badge}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="mt-3 h-[140px] sm:h-[150px] md:h-[160px]">
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
//                 <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.12} />
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

// /* ------------------------------ Main Dashboard ------------------------------ */

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [generatedAt, setGeneratedAt] = useState(null);

//   const [totals, setTotals] = useState({
//     users: 0,
//     leads: 0,
//     files: 0,
//     knowledge_base_documents: 0,
//     assistants: 0,
//     phone_numbers: 0,
//     call_logs: 0,
//   });
//   const [usersByRole, setUsersByRole] = useState({});
//   const [phoneNumbers, setPhoneNumbers] = useState({ attached_to_assistant: 0, unattached: 0 });
//   const [callLogs, setCallLogs] = useState({
//     transferred: 0,
//     not_transferred: 0,
//     by_status: {},
//   });

//   const refresh = async () => {
//     try {
//       setLoading(true);
//       setErr("");
//       const json = await fetchStatsWithFallback();

//       const s = json?.stats || json || {};
//       const t = s?.totals || {};
//       setTotals({
//         users: Number(t.users || 0),
//         leads: Number(t.leads || 0),
//         files: Number(t.files || 0),
//         knowledge_base_documents: Number(t.knowledge_base_documents || 0),
//         assistants: Number(t.assistants || 0),
//         phone_numbers: Number(t.phone_numbers || 0),
//         call_logs: Number(t.call_logs || 0),
//       });

//       setUsersByRole(s?.users_by_role || {});
//       setPhoneNumbers(s?.phone_numbers || { attached_to_assistant: 0, unattached: 0 });
//       setCallLogs(s?.call_logs || { transferred: 0, not_transferred: 0, by_status: {} });
//       setGeneratedAt(json?.generated_at || new Date().toISOString());
//     } catch (e) {
//       const msg = e?.message || "Failed to load stats";
//       const hint = msg.includes("CORS")
//         ? " — Check FastAPI CORSMiddleware allow_origins/allow_credentials."
//         : "";
//       setErr(msg + hint);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refresh();
//   }, []);

//   /* ------------------------------ Derived Data ------------------------------ */

//   const cardDefs = useMemo(() => {
//     return [
//       { key: "users", label: "Users", value: totals.users, icon: Users, color: COLORS.blue, series: makeSeries(totals.users) },
//       { key: "leads", label: "Leads", value: totals.leads, icon: Shield, color: COLORS.cyan, series: makeSeries(totals.leads) },
//       { key: "files", label: "Files", value: totals.files, icon: FileText, color: COLORS.sky, series: makeSeries(totals.files) },
//       { key: "assistants", label: "Assistants", value: totals.assistants, icon: Bot, color: COLORS.cyan, series: makeSeries(totals.assistants) },
//       { key: "phone_numbers", label: "Phone Numbers", value: totals.phone_numbers, icon: Phone, color: COLORS.sky, series: makeSeries(totals.phone_numbers) },
//       { key: "knowledge_base_documents", label: "KB Docs", value: totals.knowledge_base_documents, icon: Database, color: COLORS.blue, series: makeSeries(totals.knowledge_base_documents) },
//       { key: "call_logs", label: "Call Logs", value: totals.call_logs, icon: PhoneCall, color: COLORS.cyan, series: makeSeries(totals.call_logs) },
//     ];
//   }, [totals]);

//   const roleData = useMemo(() => entriesToArray(usersByRole, "name", "value"), [usersByRole]);

//   const phoneAttachData = useMemo(
//     () => [
//       { name: "Attached", value: Number(phoneNumbers.attached_to_assistant || 0) },
//       { name: "Unattached", value: Number(phoneNumbers.unattached || 0) },
//     ],
//     [phoneNumbers]
//   );

//   const callTransferData = useMemo(
//     () => [
//       { name: "Transferred", value: Number(callLogs.transferred || 0) },
//       { name: "Not Transferred", value: Number(callLogs.not_transferred || 0) },
//     ],
//     [callLogs]
//   );

//   const callStatusData = useMemo(
//     () => entriesToArray(callLogs.by_status || {}, "status", "count"),
//     [callLogs]
//   );

//   const overviewBarData = useMemo(
//     () => [
//       { name: "Users", value: totals.users },
//       { name: "Leads", value: totals.leads },
//       { name: "Files", value: totals.files },
//       { name: "Assistants", value: totals.assistants },
//       { name: "Phones", value: totals.phone_numbers },
//       { name: "KB", value: totals.knowledge_base_documents },
//       { name: "Calls", value: totals.call_logs },
//     ],
//     [totals]
//   );

//   /* ------------------------------ UI ------------------------------ */

//   return (
//     <div className="min-h-[100dvh] w-full bg-white text-slate-900">
//       {/* Soft background glows */}
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
//         <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
//       </div>

//       {err && (
//         <div className="w-full px-3 sm:px-4 pt-4 mb-6">
//           <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow">
//             {err}
//           </div>
//         </div>
//       )}

//       <header className="w-full px-3 sm:px-4 pt-8 pb-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
//               Admin Dashboard
//             </h1>
//             <p className="mt-1 text-sm md:text-base text-slate-600">
//               Neon-lite analytics — blue / cyan palette.
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={refresh}
//               className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
//             >
//               <RefreshCw className="h-4 w-4" />
//               Refresh
//             </button>
//             <div className="text-xs text-slate-500">
//               {generatedAt ? `Updated: ${new Date(generatedAt).toLocaleString()}` : ""}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="w-full px-3 sm:px-4 pb-12">
//         {/* Stat Cards — full-width responsive grid */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
//           {cardDefs.map((c) => (
//             <StatCard
//               key={c.key}
//               label={c.label}
//               value={c.value}
//               icon={c.icon}
//               color={c.color}
//               series={c.series}
//               loading={loading}
//             />
//           ))}
//         </section>

//         {/* Charts Row 1 */}
//         <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Panel title="Overview by Metric" right={<LegendPill text="Bars" />}>
//             <div className="h-[280px] sm:h-[320px] md:h-[360px] w-full">
//               <ResponsiveContainer>
//                 <BarChart data={overviewBarData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
//                       <stop offset="100%" stopColor={COLORS.light} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar
//                     dataKey="value"
//                     fill="url(#fillBars)"
//                     radius={[10, 10, 6, 6]}
//                     style={{ filter: "url(#glowBarMain)" }}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Users by Role" right={<LegendPill text="Bars" />}>
//             <div className="h-[280px] sm:h-[320px] md:h-[360px] w-full">
//               <ResponsiveContainer>
//                 <BarChart data={roleData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="roleFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor={COLORS.blue} />
//                       <stop offset="100%" stopColor="#eaf2ff" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar dataKey="value" fill="url(#roleFill)" radius={[10, 10, 6, 6]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </section>

//         {/* Charts Row 2 */}
//         <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
//           <Panel title="Phone Numbers — Attached vs Unattached" right={<LegendPill text="Donut" />}>
//             <div className="h-[300px] sm:h-[340px] md:h-[380px] w-full">
//               <ResponsiveContainer>
//                 <PieChart>
//                   <defs>
//                     <linearGradient id="pieGradPhones" x1="0" y1="0" x2="1" y2="1">
//                       <stop offset="0%" stopColor={COLORS.cyan} />
//                       <stop offset="100%" stopColor={COLORS.blue} />
//                     </linearGradient>
//                   </defs>
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Pie
//                     data={phoneAttachData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={110}
//                     innerRadius={70}
//                     paddingAngle={2}
//                     stroke="#ffffff"
//                     strokeWidth={2}
//                   >
//                     <Cell fill="url(#pieGradPhones)" />
//                     <Cell fill="#bfe9ff" />
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Calls — Transferred vs Not" right={<LegendPill text="Donut" />}>
//             <div className="h-[300px] sm:h-[340px] md:h-[380px] w-full">
//               <ResponsiveContainer>
//                 <PieChart>
//                   <defs>
//                     <linearGradient id="pieGradCalls" x1="0" y1="0" x2="1" y2="1">
//                       <stop offset="0%" stopColor={COLORS.sky} />
//                       <stop offset="100%" stopColor={COLORS.blue} />
//                     </linearGradient>
//                   </defs>
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Pie
//                     data={callTransferData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={110}
//                     innerRadius={70}
//                     paddingAngle={2}
//                     stroke="#ffffff"
//                     strokeWidth={2}
//                   >
//                     <Cell fill="url(#pieGradCalls)" />
//                     <Cell fill="#d7eeff" />
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Call Logs — by Status" right={<LegendPill text="Bars" />}>
//             <div className="h-[300px] sm:h-[340px] md:h-[380px] w-full">
//               <ResponsiveContainer>
//                 <BarChart data={callStatusData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="statusFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor={COLORS.cyan} />
//                       <stop offset="100%" stopColor="#ecfbff" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
//                   <XAxis dataKey="status" tick={{ fontSize: 11 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar dataKey="count" fill="url(#statusFill)" radius={[10, 10, 6, 6]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </section>

//         {/* Compact status list */}
//         <section className="mt-8">
//           <Panel title="Status Breakdown (Compact List)">
//             {loading ? (
//               <div className="h-24 w-full animate-pulse rounded-xl bg-slate-100" />
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {callStatusData.length === 0 && (
//                   <div className="text-sm text-slate-500">No call status data.</div>
//                 )}
//                 {callStatusData.map((s) => (
//                   <div
//                     key={s.status}
//                     className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
//                   >
//                     <span className="text-sm font-medium text-slate-700">{s.status}</span>
//                     <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
//                       {formatNumber(s.count)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Panel>
//         </section>

//         <footer className="mt-10 mb-2 w-full text-center text-xs text-slate-500">
//           © {new Date().getFullYear()} – Minimal neon dashboard.
//         </footer>
//       </main>
//     </div>
//   );
// }

// /* ------------------------------ Tiny UI Bits ------------------------------ */

// function LegendPill({ text }) {
//   return (
//     <span className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
//       {text}
//     </span>
//   );
// }















// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { motion, useMotionValue, useTransform, animate } from "framer-motion";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   Users,
//   FileText,
//   Database,
//   Phone,
//   Bot,
//   PhoneCall,
//   RefreshCw,
//   Shield,
// } from "lucide-react";

// /* ------------------------------ Config ------------------------------ */

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

// /** Prioritize your new route; keep fallbacks for safety. */
// const ENDPOINTS = [
//   `${API_URL}/api/admin/basic-admin-stats`, // main endpoint
//   `${API_URL}/basic-admin-stats`,
//   `${API_URL}/api/basic-admin-stats`,
//   `${API_URL}/statistics`,
//   `${API_URL}/api/statistics`,
// ];

// const COLORS = {
//   blue: "#2563eb",
//   sky: "#0ea5e9",
//   cyan: "#06b6d4",
//   slate: "#0f172a",
//   light: "#e6f6ff",
// };

// const CHART_BG_STROKE = "3 3";

// /* ------------------------------ Helpers ------------------------------ */

// function useWindowSize() {
//   const [size, set] = useState({ width: 0, height: 0 });
//   useEffect(() => {
//     const onResize = () => set({ width: window.innerWidth, height: window.innerHeight });
//     onResize();
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);
//   return size;
// }

// function formatNumber(n) {
//   const v = Number(n || 0);
//   if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
//   if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
//   return v.toLocaleString();
// }

// function entriesToArray(obj = {}, labelKey = "name", valueKey = "value") {
//   return Object.entries(obj || {}).map(([k, v]) => ({
//     [labelKey]: String(k),
//     [valueKey]: Number(v || 0),
//   }));
// }

// /** tiny synthetic micro-series from a final value (for sparklines) */
// function makeSeries(endValue) {
//   const N = 12;
//   const end = Math.max(0, Number(endValue) || 0);
//   const arr = Array.from({ length: N }, (_, i) => {
//     const t = i / (N - 1);
//     const wave = Math.sin(t * Math.PI) * 0.45;
//     const jitter = (Math.random() - 0.5) * 0.14;
//     const v = Math.max(0, Math.round(end * (0.55 + wave + jitter)));
//     return { label: `P${i + 1}`, value: v };
//   });
//   if (arr.length) arr[arr.length - 1].value = end;
//   return arr;
// }

// /* ------------------------------ Fetch Hook ------------------------------ */

// async function fetchStatsWithFallback() {
//   const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
//   let lastErr;
//   for (const url of ENDPOINTS) {
//     try {
//       const res = await fetch(url, {
//         headers: {
//           Accept: "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         mode: "cors",
//       });
//       if (!res.ok) {
//         lastErr = new Error(`HTTP ${res.status}`);
//         continue;
//       }
//       const json = await res.json();
//       if (json?.success && json?.stats?.totals) return json;
//       if (json) return json; // tolerate slightly different shapes
//     } catch (e) {
//       lastErr = e;
//     }
//   }
//   throw lastErr || new Error("Failed to fetch stats");
// }

// /* ------------------------------ Animated Counter ------------------------------ */

// function AnimatedNumber({ value, className }) {
//   const mv = useMotionValue(0);
//   const [display, setDisplay] = useState(0);

//   useEffect(() => {
//     const controls = animate(mv, Number(value || 0), { duration: 0.8, ease: "easeOut" });
//     const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
//     return () => {
//       controls.stop();
//       unsub();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);

//   return <span className={className}>{formatNumber(display)}</span>;
// }

// /* ------------------------------ Panels & Chrome ------------------------------ */

// function Panel({ title, right, children, className = "" }) {
//   return (
//     <div className={`relative rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl ${className}`}>
//       <GlowBorder />
//       <div className="mb-4 flex items-center justify-between gap-4">
//         <h2 className="text-sm sm:text-base font-semibold text-slate-700">{title}</h2>
//         {right}
//       </div>
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
//           background: `linear-gradient(90deg, ${COLORS.cyan}33, transparent)`,
//           filter: "blur(22px)",
//           opacity: 0.6,
//         }}
//       />
//       <div className="absolute inset-0 rounded-3xl ring-1 ring-white/60" />
//     </div>
//   );
// }

// /* ------------------------------ Stat Card ------------------------------ */

// function StatCard({ label, value, icon: Icon, color, series, badge = "Live", loading }) {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-60, 60], [10, -10]);
//   const rotateY = useTransform(x, [-60, 60], [-10, 10]);
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
//       className="relative rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl transition-transform duration-300"
//     >
//       <div
//         className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl"
//         style={{ background: `linear-gradient(135deg, ${color}66, #ffffff00)` }}
//       />
//       <div className="relative z-10">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
//             <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color }} />
//           </div>
//           <div>
//             <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">{label}</p>
//             <div className="flex items-baseline gap-2">
//               <h3 className="text-xl sm:text-2xl font-black text-slate-900">
//                 {loading ? <SkeletonText /> : <AnimatedNumber value={value} />}
//               </h3>
//               {badge && (
//                 <span className="hidden xs:inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white shadow-sm">
//                   {badge}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="mt-3 h-[110px] xs:h-[130px] sm:h-[140px] md:h-[160px]">
//           {loading ? (
//             <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
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
//                 <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.12} />
//                 <XAxis dataKey="label" hide />
//                 <YAxis hide domain={[0, "dataMax+"]} />
//                 <Tooltip contentStyle={{ borderRadius: 12 }} />
//                 <Line
//                   type="monotone"
//                   dataKey="value"
//                   stroke={color}
//                   strokeWidth={2.2}
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

// /* ------------------------------ Main Dashboard ------------------------------ */

// export default function Dashboard() {
//   const { width } = useWindowSize();
//   const isDesktop = width >= 1280; // keep desktop visuals exactly
//   const isTablet = width >= 768 && width < 1280;
//   const isCompact = width < 768;

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [generatedAt, setGeneratedAt] = useState(null);

//   const [totals, setTotals] = useState({
//     users: 0,
//     leads: 0,
//     files: 0,
//     knowledge_base_documents: 0,
//     assistants: 0,
//     phone_numbers: 0,
//     call_logs: 0,
//   });
//   const [usersByRole, setUsersByRole] = useState({});
//   const [phoneNumbers, setPhoneNumbers] = useState({ attached_to_assistant: 0, unattached: 0 });
//   const [callLogs, setCallLogs] = useState({
//     transferred: 0,
//     not_transferred: 0,
//     by_status: {},
//   });

//   const refresh = async () => {
//     try {
//       setLoading(true);
//       setErr("");
//       const json = await fetchStatsWithFallback();
//       const s = json?.stats || json || {};
//       const t = s?.totals || {};
//       setTotals({
//         users: Number(t.users || 0),
//         leads: Number(t.leads || 0),
//         files: Number(t.files || 0),
//         knowledge_base_documents: Number(t.knowledge_base_documents || 0),
//         assistants: Number(t.assistants || 0),
//         phone_numbers: Number(t.phone_numbers || 0),
//         call_logs: Number(t.call_logs || 0),
//       });

//       setUsersByRole(s?.users_by_role || {});
//       setPhoneNumbers(s?.phone_numbers || { attached_to_assistant: 0, unattached: 0 });
//       setCallLogs(s?.call_logs || { transferred: 0, not_transferred: 0, by_status: {} });
//       setGeneratedAt(json?.generated_at || new Date().toISOString());
//     } catch (e) {
//       const msg = e?.message || "Failed to load stats";
//       const hint = msg.includes("CORS")
//         ? " — Check FastAPI CORSMiddleware allow_origins/allow_credentials."
//         : "";
//       setErr(msg + hint);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refresh();
//   }, []);

//   /* ------------------------------ Derived Data ------------------------------ */

//   const cardDefs = useMemo(() => {
//     return [
//       { key: "users", label: "Users", value: totals.users, icon: Users, color: COLORS.blue, series: makeSeries(totals.users) },
//       { key: "leads", label: "Leads", value: totals.leads, icon: Shield, color: COLORS.cyan, series: makeSeries(totals.leads) },
//       { key: "files", label: "Files", value: totals.files, icon: FileText, color: COLORS.sky, series: makeSeries(totals.files) },
//       { key: "assistants", label: "Assistants", value: totals.assistants, icon: Bot, color: COLORS.cyan, series: makeSeries(totals.assistants) },
//       { key: "phone_numbers", label: "Phone Numbers", value: totals.phone_numbers, icon: Phone, color: COLORS.sky, series: makeSeries(totals.phone_numbers) },
//       { key: "knowledge_base_documents", label: "KB Docs", value: totals.knowledge_base_documents, icon: Database, color: COLORS.blue, series: makeSeries(totals.knowledge_base_documents) },
//       { key: "call_logs", label: "Call Logs", value: totals.call_logs, icon: PhoneCall, color: COLORS.cyan, series: makeSeries(totals.call_logs) },
//     ];
//   }, [totals]);

//   const roleData = useMemo(() => entriesToArray(usersByRole, "name", "value"), [usersByRole]);

//   const phoneAttachData = useMemo(
//     () => [
//       { name: "Attached", value: Number(phoneNumbers.attached_to_assistant || 0) },
//       { name: "Unattached", value: Number(phoneNumbers.unattached || 0) },
//     ],
//     [phoneNumbers]
//   );

//   const callTransferData = useMemo(
//     () => [
//       { name: "Transferred", value: Number(callLogs.transferred || 0) },
//       { name: "Not Transferred", value: Number(callLogs.not_transferred || 0) },
//     ],
//     [callLogs]
//   );

//   const callStatusData = useMemo(
//     () => entriesToArray(callLogs.by_status || {}, "status", "count"),
//     [callLogs]
//   );

//   const overviewBarData = useMemo(
//     () => [
//       { name: "Users", value: totals.users },
//       { name: "Leads", value: totals.leads },
//       { name: "Files", value: totals.files },
//       { name: "Assistants", value: totals.assistants },
//       { name: "Phones", value: totals.phone_numbers },
//       { name: "KB", value: totals.knowledge_base_documents },
//       { name: "Calls", value: totals.call_logs },
//     ],
//     [totals]
//   );

//   /* ------------------------------ UI ------------------------------ */

//   return (
//     <div className="min-h-[100dvh] w-full bg-white text-slate-900">
//       {/* Soft background glows */}
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-28 -left-28 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-cyan-300/40 blur-3xl" />
//         <div className="absolute -bottom-28 -right-28 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-blue-300/40 blur-3xl" />
//       </div>

//       {err && (
//         <div className="w-full px-3 sm:px-4 pt-4 mb-6">
//           <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow">
//             {err}
//           </div>
//         </div>
//       )}

//       <header className="w-full px-3 sm:px-4 pt-8 pb-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
//               Admin Dashboard
//             </h1>
//             <p className="mt-1 text-xs sm:text-sm md:text-base text-slate-600">
//               Neon-lite analytics — blue / cyan palette.
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={refresh}
//               className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
//             >
//               <RefreshCw className="h-4 w-4" />
//               Refresh
//             </button>
//             <div className="text-[10px] sm:text-xs text-slate-500">
//               {generatedAt ? `Updated: ${new Date(generatedAt).toLocaleString()}` : ""}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="w-full px-3 sm:px-4 pb-12">
//         {/* Stat Cards — responsive grid */}
//         <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
//           {cardDefs.map((c) => (
//             <StatCard
//               key={c.key}
//               label={c.label}
//               value={c.value}
//               icon={c.icon}
//               color={c.color}
//               series={c.series}
//               loading={loading}
//             />
//           ))}
//         </section>

//         {/* Charts Row 1 */}
//         <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-6">
//           <Panel title="Overview by Metric" right={<LegendPill text="Bars" />}>
//             <div className="h-[240px] sm:h-[300px] md:h-[340px] xl:h-[360px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={overviewBarData}
//                   margin={{
//                     top: 10,
//                     right: isCompact ? 8 : 20,
//                     left: isCompact ? 0 : -10,
//                     bottom: 4,
//                   }}
//                   barCategoryGap={isCompact ? 30 : 20}
//                 >
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
//                       <stop offset="100%" stopColor={COLORS.light} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
//                   <XAxis
//                     dataKey="name"
//                     tick={{ fontSize: isCompact ? 10 : 12 }}
//                     interval={isCompact ? 0 : "preserveEnd"}
//                     tickMargin={8}
//                     height={isCompact ? 28 : 36}
//                   />
//                   <YAxis
//                     tick={{ fontSize: isCompact ? 10 : 12 }}
//                     width={isCompact ? 28 : 40}
//                     tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
//                   />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar
//                     dataKey="value"
//                     fill="url(#fillBars)"
//                     radius={[10, 10, 6, 6]}
//                     style={{ filter: "url(#glowBarMain)" }}
//                     maxBarSize={isCompact ? 38 : 60}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Users by Role" right={<LegendPill text="Bars" />}>
//             <div className="h-[240px] sm:h-[300px] md:h-[340px] xl:h-[360px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={roleData}
//                   margin={{ top: 10, right: isCompact ? 8 : 20, left: isCompact ? 0 : -10, bottom: 4 }}
//                   barCategoryGap={isCompact ? 30 : 20}
//                 >
//                   <defs>
//                     <linearGradient id="roleFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor={COLORS.blue} />
//                       <stop offset="100%" stopColor="#eaf2ff" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
//                   <XAxis
//                     dataKey="name"
//                     tick={{ fontSize: isCompact ? 10 : 12 }}
//                     interval={isCompact ? 0 : "preserveEnd"}
//                     tickMargin={8}
//                     height={isCompact ? 28 : 36}
//                   />
//                   <YAxis
//                     tick={{ fontSize: isCompact ? 10 : 12 }}
//                     width={isCompact ? 28 : 40}
//                     tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
//                   />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar dataKey="value" fill="url(#roleFill)" radius={[10, 10, 6, 6]} maxBarSize={isCompact ? 38 : 60} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </section>

//         {/* Charts Row 2 */}
//         <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-6">
//           <Panel title="Phone Numbers — Attached vs Unattached" right={<LegendPill text="Donut" />}>
//             <div className="h-[240px] sm:h-[300px] md:h-[340px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <defs>
//                     <linearGradient id="pieGradPhones" x1="0" y1="0" x2="1" y2="1">
//                       <stop offset="0%" stopColor={COLORS.cyan} />
//                       <stop offset="100%" stopColor={COLORS.blue} />
//                     </linearGradient>
//                   </defs>
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Pie
//                     data={phoneAttachData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={isCompact ? 90 : 110}
//                     innerRadius={isCompact ? 58 : 70}
//                     paddingAngle={2}
//                     stroke="#ffffff"
//                     strokeWidth={2}
//                     label={isCompact ? ({ name, percent }) => (percent >= 0.18 ? name : "") : false}
//                     labelLine={false}
//                   >
//                     <Cell fill="url(#pieGradPhones)" />
//                     <Cell fill="#bfe9ff" />
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Calls — Transferred vs Not" right={<LegendPill text="Donut" />}>
//             <div className="h-[240px] sm:h-[300px] md:h-[340px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <defs>
//                     <linearGradient id="pieGradCalls" x1="0" y1="0" x2="1" y2="1">
//                       <stop offset="0%" stopColor={COLORS.sky} />
//                       <stop offset="100%" stopColor={COLORS.blue} />
//                     </linearGradient>
//                   </defs>
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Pie
//                     data={callTransferData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={isCompact ? 90 : 110}
//                     innerRadius={isCompact ? 58 : 70}
//                     paddingAngle={2}
//                     stroke="#ffffff"
//                     strokeWidth={2}
//                     label={isCompact ? ({ name, percent }) => (percent >= 0.18 ? name : "") : false}
//                     labelLine={false}
//                   >
//                     <Cell fill="url(#pieGradCalls)" />
//                     <Cell fill="#d7eeff" />
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Call Logs — by Status" right={<LegendPill text="Bars" />}>
//             <div className="h-[240px] sm:h-[300px] md:h-[340px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={callStatusData}
//                   margin={{ top: 10, right: isCompact ? 8 : 20, left: isCompact ? 0 : -10, bottom: 4 }}
//                   barCategoryGap={isCompact ? 30 : 20}
//                 >
//                   <defs>
//                     <linearGradient id="statusFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor={COLORS.cyan} />
//                       <stop offset="100%" stopColor="#ecfbff" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
//                   <XAxis
//                     dataKey="status"
//                     tick={{ fontSize: isCompact ? 10 : 12 }}
//                     interval={isCompact ? 0 : "preserveEnd"}
//                     tickMargin={8}
//                     height={isCompact ? 28 : 36}
//                   />
//                   <YAxis
//                     tick={{ fontSize: isCompact ? 10 : 12 }}
//                     width={isCompact ? 28 : 40}
//                     tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
//                   />
//                   <Tooltip contentStyle={{ borderRadius: 12 }} />
//                   <Bar dataKey="count" fill="url(#statusFill)" radius={[10, 10, 6, 6]} maxBarSize={isCompact ? 38 : 60} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </section>

//         {/* Compact status list */}
//         <section className="mt-8">
//           <Panel title="Status Breakdown (Compact List)">
//             {loading ? (
//               <div className="h-24 w-full animate-pulse rounded-xl bg-slate-100" />
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {callStatusData.length === 0 && (
//                   <div className="text-sm text-slate-500">No call status data.</div>
//                 )}
//                 {callStatusData.map((s) => (
//                   <div
//                     key={s.status}
//                     className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
//                   >
//                     <span className="text-sm font-medium text-slate-700 truncate pr-3">{s.status}</span>
//                     <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
//                       {formatNumber(s.count)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Panel>
//         </section>

//         <footer className="mt-10 mb-2 w-full text-center text-xs text-slate-500">
//           © {new Date().getFullYear()} – Minimal neon dashboard.
//         </footer>
//       </main>
//     </div>
//   );
// }

// /* ------------------------------ Tiny UI Bits ------------------------------ */

// function LegendPill({ text }) {
//   return (
//     <span className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
//       {text}
//     </span>
//   );
// }
























"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import {
  Users,
  FileText,
  Database,
  Phone,
  Bot,
  PhoneCall,
  RefreshCw,
  Shield,
} from "lucide-react";

/* ------------------------------ Config ------------------------------ */

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

/** Prioritize your new route; keep fallbacks for safety. */
const ENDPOINTS = [
  `${API_URL}/api/admin/basic-admin-stats`, // main endpoint
  `${API_URL}/basic-admin-stats`,
  `${API_URL}/api/basic-admin-stats`,
  `${API_URL}/statistics`,
  `${API_URL}/api/statistics`,
];

const COLORS = {
  blue: "#2563eb",
  sky: "#0ea5e9",
  cyan: "#06b6d4",
  slate: "#0f172a",
  light: "#e6f6ff",
};

const CHART_BG_STROKE = "3 3";

/* ------------------------------ Helpers ------------------------------ */

function useWindowSize() {
  const [size, set] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const onResize = () => set({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function formatNumber(n) {
  const v = Number(n || 0);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return v.toLocaleString();
}

function entriesToArray(obj = {}, labelKey = "name", valueKey = "value") {
  return Object.entries(obj || {}).map(([k, v]) => ({
    [labelKey]: String(k),
    [valueKey]: Number(v || 0),
  }));
}

/** tiny synthetic micro-series from a final value (for sparklines) */
function makeSeries(endValue) {
  const N = 12;
  const end = Math.max(0, Number(endValue) || 0);
  const arr = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const wave = Math.sin(t * Math.PI) * 0.45;
    const jitter = (Math.random() - 0.5) * 0.14;
    const v = Math.max(0, Math.round(end * (0.55 + wave + jitter)));
    return { label: `P${i + 1}`, value: v };
  });
  if (arr.length) arr[arr.length - 1].value = end;
  return arr;
}

/* ------------------------------ Fetch Hook ------------------------------ */

async function fetchStatsWithFallback() {
  const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
  let lastErr;
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        mode: "cors",
      });
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      const json = await res.json();
      if (json?.success && json?.stats?.totals) return json;
      if (json) return json; // tolerate slightly different shapes
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Failed to fetch stats");
}

/* ------------------------------ Animated Counter ------------------------------ */

function AnimatedNumber({ value, className }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(mv, Number(value || 0), { duration: 0.5, ease: "easeOut" });
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{formatNumber(display)}</span>;
}

/* ------------------------------ Neon cursors & shapes ------------------------------ */

/** vertical neon line for LineChart tooltip cursor */
function NeonCursorLine({ points, width, height }) {
  if (!points || !points[0]) return null;
  const x = points[0].x;
  return (
    <g>
      <defs>
        <linearGradient id="neonStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="neonGlowLine" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1={x}
        x2={x}
        y1={0}
        y2={height}
        stroke="url(#neonStroke)"
        strokeWidth={2}
        opacity={0.85}
        filter="url(#neonGlowLine)"
      />
    </g>
  );
}

/** soft neon rectangle for BarChart tooltip cursor */
function NeonCursorBar(props) {
  const { x, y, width, height } = props;
  return (
    <g>
      <defs>
        <filter id="neonGlowRect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(34,211,238,0.18)" /* cyan-400 @ ~18% */
        stroke="rgba(37,99,235,0.6)" /* blue-600 */
        strokeWidth={1}
        rx={8}
        filter="url(#neonGlowRect)"
      />
    </g>
  );
}

/** pie active (hover) shape with glow & tiny bump */
function NeonActiveSector(props) {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
  } = props;
  // slight bump on hover
  const bump = 6;
  return (
    <g>
      <defs>
        <filter id="neonGlowPie" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + bump}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={2}
        filter="url(#neonGlowPie)"
      />
    </g>
  );
}

/* ------------------------------ Panels & Chrome ------------------------------ */

function Panel({ title, right, children, className = "" }) {
  return (
    <div className={`relative rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl overflow-hidden ${className}`}>
      {/* overflow-hidden prevents any chart from causing horizontal scroll */}
      <GlowBorder />
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm sm:text-base font-semibold text-slate-700">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function GlowBorder() {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-3xl">
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `linear-gradient(90deg, ${COLORS.cyan}33, transparent)`,
          filter: "blur(22px)",
          opacity: 0.6,
        }}
      />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/60" />
    </div>
  );
}

/* ------------------------------ Stat Card ------------------------------ */

function StatCard({ label, value, icon: Icon, color, series, badge = "Live", loading }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [10, -10]);
  const rotateY = useTransform(x, [-60, 60], [-10, 10]);
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
      className="relative rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl transition-transform duration-300"
    >
      <div
        className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl"
        style={{ background: `linear-gradient(135deg, ${color}66, #ffffff00)` }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color }} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">{label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {loading ? <SkeletonText /> : <AnimatedNumber value={value} />}
              </h3>
              {badge && (
                <span className="hidden xs:inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white shadow-sm">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 h-[110px] xs:h-[130px] sm:h-[140px] md:h-[160px]">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={series}
                margin={{ top: 2, right: 8, left: -10, bottom: 0 }}
              >
                <defs>
                  <filter id="glowMini" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.12} />
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, "dataMax+"]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12 }}
                  cursor={<NeonCursorLine />}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  style={{ filter: "url(#glowMini)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonText() {
  return <span className="inline-block h-6 w-10 animate-pulse rounded bg-slate-200 align-middle" />;
}

/* ------------------------------ Main Dashboard ------------------------------ */

export default function Dashboard() {
  const { width } = useWindowSize();
  const isDesktop = width >= 1280; // keep desktop visuals exactly
  const isCompact = width < 768;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [generatedAt, setGeneratedAt] = useState(null);
  const [activePhoneSlice, setActivePhoneSlice] = useState(null);
  const [activeCallSlice, setActiveCallSlice] = useState(null);

  const [totals, setTotals] = useState({
    users: 0,
    leads: 0,
    files: 0,
    knowledge_base_documents: 0,
    assistants: 0,
    phone_numbers: 0,
    call_logs: 0,
  });
  const [usersByRole, setUsersByRole] = useState({});
  const [phoneNumbers, setPhoneNumbers] = useState({ attached_to_assistant: 0, unattached: 0 });
  const [callLogs, setCallLogs] = useState({
    transferred: 0,
    not_transferred: 0,
    by_status: {},
  });

  const refresh = async () => {
    try {
      setLoading(true);
      setErr("");
      const json = await fetchStatsWithFallback();
      const s = json?.stats || json || {};
      const t = s?.totals || {};
      setTotals({
        users: Number(t.users || 0),
        leads: Number(t.leads || 0),
        files: Number(t.files || 0),
        knowledge_base_documents: Number(t.knowledge_base_documents || 0),
        assistants: Number(t.assistants || 0),
        phone_numbers: Number(t.phone_numbers || 0),
        call_logs: Number(t.call_logs || 0),
      });

      setUsersByRole(s?.users_by_role || {});
      setPhoneNumbers(s?.phone_numbers || { attached_to_assistant: 0, unattached: 0 });
      setCallLogs(s?.call_logs || { transferred: 0, not_transferred: 0, by_status: {} });
      setGeneratedAt(json?.generated_at || new Date().toISOString());
    } catch (e) {
      const msg = e?.message || "Failed to load stats";
      const hint = msg.includes("CORS")
        ? " — Check FastAPI CORSMiddleware allow_origins/allow_credentials."
        : "";
      setErr(msg + hint);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  /* ------------------------------ Derived Data ------------------------------ */

  const cardDefs = useMemo(() => {
    return [
      { key: "users", label: "Users", value: totals.users, icon: Users, color: COLORS.blue, series: makeSeries(totals.users) },
      { key: "leads", label: "Leads", value: totals.leads, icon: Shield, color: COLORS.cyan, series: makeSeries(totals.leads) },
      { key: "files", label: "Files", value: totals.files, icon: FileText, color: COLORS.sky, series: makeSeries(totals.files) },
      { key: "assistants", label: "Assistants", value: totals.assistants, icon: Bot, color: COLORS.cyan, series: makeSeries(totals.assistants) },
      { key: "phone_numbers", label: "Phone Numbers", value: totals.phone_numbers, icon: Phone, color: COLORS.sky, series: makeSeries(totals.phone_numbers) },
      { key: "knowledge_base_documents", label: "KB Docs", value: totals.knowledge_base_documents, icon: Database, color: COLORS.blue, series: makeSeries(totals.knowledge_base_documents) },
      { key: "call_logs", label: "Call Logs", value: totals.call_logs, icon: PhoneCall, color: COLORS.cyan, series: makeSeries(totals.call_logs) },
    ];
  }, [totals]);

  const roleData = useMemo(() => entriesToArray(usersByRole, "name", "value"), [usersByRole]);

  const phoneAttachData = useMemo(
    () => [
      { name: "Attached", value: Number(phoneNumbers.attached_to_assistant || 0) },
      { name: "Unattached", value: Number(phoneNumbers.unattached || 0) },
    ],
    [phoneNumbers]
  );

  const callTransferData = useMemo(
    () => [
      { name: "Transferred", value: Number(callLogs.transferred || 0) },
      { name: "Not Transferred", value: Number(callLogs.not_transferred || 0) },
    ],
    [callLogs]
  );

  const callStatusData = useMemo(
    () => entriesToArray(callLogs.by_status || {}, "status", "count"),
    [callLogs]
  );

  const overviewBarData = useMemo(
    () => [
      { name: "Users", value: totals.users },
      { name: "Leads", value: totals.leads },
      { name: "Files", value: totals.files },
      { name: "Assistants", value: totals.assistants },
      { name: "Phones", value: totals.phone_numbers },
      { name: "KB", value: totals.knowledge_base_documents },
      { name: "Calls", value: totals.call_logs },
    ],
    [totals]
  );

  /* ------------------------------ UI ------------------------------ */

  return (
    <div className="min-h-[100dvh] w-full bg-white text-slate-900">
      {/* Soft background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-28 -left-28 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-blue-300/40 blur-3xl" />
      </div>

      {err && (
        <div className="w-full px-3 sm:px-4 pt-4 mb-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow">
            {err}
          </div>
        </div>
      )}

      <header className="w-full px-3 sm:px-4 pt-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm md:text-base text-slate-600">
              Neon-lite analytics — blue / cyan palette.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <div className="text-[10px] sm:text-xs text-slate-500">
              {generatedAt ? `Updated: ${new Date(generatedAt).toLocaleString()}` : ""}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 pb-12">
        {/* Stat Cards — responsive grid */}
        <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {cardDefs.map((c) => (
            <StatCard
              key={c.key}
              label={c.label}
              value={c.value}
              icon={c.icon}
              color={c.color}
              series={c.series}
              loading={loading}
            />
          ))}
        </section>

        {/* Charts Row 1 */}
        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-6">
          <Panel title="Overview by Metric" right={<LegendPill text="Bars" />}>
            <div className="h-[240px] sm:h-[300px] md:h-[340px] xl:h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overviewBarData}
                  margin={{
                    top: 10,
                    right: isCompact ? 8 : 20,
                    left: isCompact ? 0 : -10,
                    bottom: 4,
                  }}
                  barCategoryGap={isCompact ? 30 : 20}
                >
                  <defs>
                    <filter id="glowBarMain" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="fillBars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.sky} />
                      <stop offset="100%" stopColor={COLORS.light} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: isCompact ? 10 : 12 }}
                    interval={isCompact ? 0 : "preserveEnd"}
                    tickMargin={8}
                    height={isCompact ? 28 : 36}
                  />
                  <YAxis
                    tick={{ fontSize: isCompact ? 10 : 12 }}
                    width={isCompact ? 28 : 40}
                    tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12 }}
                    cursor={<NeonCursorBar />}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#fillBars)"
                    radius={[10, 10, 6, 6]}
                    style={{ filter: "url(#glowBarMain)" }}
                    maxBarSize={isCompact ? 38 : 60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Users by Role" right={<LegendPill text="Bars" />}>
            <div className="h-[240px] sm:h-[300px] md:h-[340px] xl:h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roleData}
                  margin={{ top: 10, right: isCompact ? 8 : 20, left: isCompact ? 0 : -10, bottom: 4 }}
                  barCategoryGap={isCompact ? 30 : 20}
                >
                  <defs>
                    <linearGradient id="roleFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} />
                      <stop offset="100%" stopColor="#eaf2ff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: isCompact ? 10 : 12 }}
                    interval={isCompact ? 0 : "preserveEnd"}
                    tickMargin={8}
                    height={isCompact ? 28 : 36}
                  />
                  <YAxis
                    tick={{ fontSize: isCompact ? 10 : 12 }}
                    width={isCompact ? 28 : 40}
                    tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12 }}
                    cursor={<NeonCursorBar />}
                  />
                  <Bar dataKey="value" fill="url(#roleFill)" radius={[10, 10, 6, 6]} maxBarSize={isCompact ? 38 : 60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </section>

        {/* Charts Row 2 */}
        <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-6">
          <Panel title="Phone Numbers — Attached vs Unattached" right={<LegendPill text="Donut" />}>
            <div className="h-[240px] sm:h-[300px] md:h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="pieGradPhones" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS.cyan} />
                      <stop offset="100%" stopColor={COLORS.blue} />
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Pie
                    data={phoneAttachData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={isCompact ? 90 : 110}
                    innerRadius={isCompact ? 58 : 70}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                    activeIndex={activePhoneSlice}
                    onMouseEnter={(_, idx) => setActivePhoneSlice(idx)}
                    onMouseLeave={() => setActivePhoneSlice(null)}
                    activeShape={NeonActiveSector}
                    label={isCompact ? ({ name, percent }) => (percent >= 0.18 ? name : "") : false}
                    labelLine={false}
                  >
                    <Cell fill="url(#pieGradPhones)" />
                    <Cell fill="#bfe9ff" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Calls — Transferred vs Not" right={<LegendPill text="Donut" />}>
            <div className="h-[240px] sm:h-[300px] md:h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="pieGradCalls" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS.sky} />
                      <stop offset="100%" stopColor={COLORS.blue} />
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Pie
                    data={callTransferData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={isCompact ? 90 : 110}
                    innerRadius={isCompact ? 58 : 70}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                    activeIndex={activeCallSlice}
                    onMouseEnter={(_, idx) => setActiveCallSlice(idx)}
                    onMouseLeave={() => setActiveCallSlice(null)}
                    activeShape={NeonActiveSector}
                    label={isCompact ? ({ name, percent }) => (percent >= 0.18 ? name : "") : false}
                    labelLine={false}
                  >
                    <Cell fill="url(#pieGradCalls)" />
                    <Cell fill="#d7eeff" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Call Logs — by Status" right={<LegendPill text="Bars" />}>
            <div className="h-[240px] sm:h-[300px] md:h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={callStatusData}
                  margin={{ top: 10, right: isCompact ? 8 : 20, left: isCompact ? 0 : -10, bottom: 4 }}
                  barCategoryGap={isCompact ? 30 : 20}
                >
                  <defs>
                    <linearGradient id="statusFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.cyan} />
                      <stop offset="100%" stopColor="#ecfbff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: isCompact ? 10 : 12 }}
                    interval={isCompact ? 0 : "preserveEnd"}
                    tickMargin={8}
                    height={isCompact ? 28 : 36}
                  />
                  <YAxis
                    tick={{ fontSize: isCompact ? 10 : 12 }}
                    width={isCompact ? 28 : 40}
                    tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12 }}
                    cursor={<NeonCursorBar />}
                  />
                  <Bar dataKey="count" fill="url(#statusFill)" radius={[10, 10, 6, 6]} maxBarSize={isCompact ? 38 : 60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </section>

        {/* Compact status list */}
        <section className="mt-8">
          <Panel title="Status Breakdown (Compact List)">
            {loading ? (
              <div className="h-24 w-full animate-pulse rounded-xl bg-slate-100" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {callStatusData.length === 0 && (
                  <div className="text-sm text-slate-500">No call status data.</div>
                )}
                {callStatusData.map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="text-sm font-medium text-slate-700 truncate pr-3">{s.status}</span>
                    <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                      {formatNumber(s.count)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>

        <footer className="mt-10 mb-2 w-full text-center text-xs text-slate-500">
          © {new Date().getFullYear()} – Minimal neon dashboard.
        </footer>
      </main>
    </div>
  );
}

/* ------------------------------ Tiny UI Bits ------------------------------ */

function LegendPill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
      {text}
    </span>
  );
}
