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
//           Admin Dashboard
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




// src/pages/Dashboard.jsx
// src/pages/Dashboard.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
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
  `${API_URL}/api/admin/basic-admin-stats`, // <— your main endpoint
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

function formatNumber(n) {
  const v = Number(n || 0);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "k";
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
    const jitter = (Math.random() - 0.5) * 0.18;
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
      if (json?.success && json?.stats?.totals) {
        return json;
      }
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
  const rounded = useTransform(mv, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(mv, Number(value || 0), { duration: 0.8, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{formatNumber(display)}</span>;
}

/* ------------------------------ Panels & Chrome ------------------------------ */

function Panel({ title, right, children, className = "" }) {
  return (
    <div className={`relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ${className}`}>
      <GlowBorder />
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-700">{title}</h2>
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
      className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl transition-transform duration-300"
    >
      <div
        className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl"
        style={{ background: `linear-gradient(135deg, ${color}66, #ffffff00)` }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner ring-1 ring-slate-200">
            <Icon className="h-7 w-7" style={{ color }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900">
                {loading ? <SkeletonText /> : <AnimatedNumber value={value} />}
              </h3>
              {badge && (
                <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 h-[140px] sm:h-[150px] md:h-[160px]">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <ResponsiveContainer>
              <LineChart data={series} margin={{ top: 2, right: 8, left: -10, bottom: 0 }}>
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
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2.5}
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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [generatedAt, setGeneratedAt] = useState(null);

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
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
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
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-600">
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
            <div className="text-xs text-slate-500">
              {generatedAt ? `Updated: ${new Date(generatedAt).toLocaleString()}` : ""}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 pb-12">
        {/* Stat Cards — full-width responsive grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
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
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title="Overview by Metric" right={<LegendPill text="Bars" />}>
            <div className="h-[280px] sm:h-[320px] md:h-[360px] w-full">
              <ResponsiveContainer>
                <BarChart data={overviewBarData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Bar
                    dataKey="value"
                    fill="url(#fillBars)"
                    radius={[10, 10, 6, 6]}
                    style={{ filter: "url(#glowBarMain)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Users by Role" right={<LegendPill text="Bars" />}>
            <div className="h-[280px] sm:h-[320px] md:h-[360px] w-full">
              <ResponsiveContainer>
                <BarChart data={roleData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="roleFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} />
                      <stop offset="100%" stopColor="#eaf2ff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="value" fill="url(#roleFill)" radius={[10, 10, 6, 6]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </section>

        {/* Charts Row 2 */}
        <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Panel title="Phone Numbers — Attached vs Unattached" right={<LegendPill text="Donut" />}>
            <div className="h-[300px] sm:h-[340px] md:h-[380px] w-full">
              <ResponsiveContainer>
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
                    outerRadius={110}
                    innerRadius={70}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    <Cell fill="url(#pieGradPhones)" />
                    <Cell fill="#bfe9ff" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Calls — Transferred vs Not" right={<LegendPill text="Donut" />}>
            <div className="h-[300px] sm:h-[340px] md:h-[380px] w-full">
              <ResponsiveContainer>
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
                    outerRadius={110}
                    innerRadius={70}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    <Cell fill="url(#pieGradCalls)" />
                    <Cell fill="#d7eeff" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Call Logs — by Status" right={<LegendPill text="Bars" />}>
            <div className="h-[300px] sm:h-[340px] md:h-[380px] w-full">
              <ResponsiveContainer>
                <BarChart data={callStatusData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="statusFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.cyan} />
                      <stop offset="100%" stopColor="#ecfbff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray={CHART_BG_STROKE} strokeOpacity={0.2} />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="count" fill="url(#statusFill)" radius={[10, 10, 6, 6]} />
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
                    <span className="text-sm font-medium text-slate-700">{s.status}</span>
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
