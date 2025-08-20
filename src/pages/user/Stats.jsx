"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Database,
  Files,
  Layers,
  Phone,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

/**
 * NeonStatisticsPage
 * - Neon-themed, animated dashboard with hover/3D effects
 * - Includes Bar, Line, Pie charts
 * - Fetches JSON from GET http://localhost:8000/api/statistics returning: {leads, files, assistants, phone_numbers, knowledge_base}
 * - Built with TailwindCSS, Framer Motion, and Recharts.
 * - Drop this file into your project and render <NeonStatisticsPage />.
 */
export default function NeonStatisticsPage() {
  const [stats, setStats] = useState({
    leads: 0,
    files: 0,
    assistants: 0,
    phone_numbers: 0,
    knowledge_base: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Change this if your API lives somewhere else
  const API_URL = "http://localhost:8000/api/statistics";

  const fetchStats = async (signal) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(API_URL, { signal, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const sanitized = sanitizeStats(data);
      setStats(sanitized);
      setLastUpdated(new Date());
    } catch (e) {
      if (e && e.name === "AbortError") return;
      setError((e && e.message) || "Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    fetchStats(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  // Optional auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(() => fetchStats(), 60000);
    return () => clearInterval(id);
  }, []);

  const total = useMemo(
    () => stats.leads + stats.files + stats.assistants + stats.phone_numbers + stats.knowledge_base,
    [stats]
  );

  const chartData = useMemo(
    () => [
      { key: "Leads", value: stats.leads, icon: Activity },
      { key: "Files", value: stats.files, icon: Files },
      { key: "Assistants", value: stats.assistants, icon: Layers },
      { key: "Phones", value: stats.phone_numbers, icon: Phone },
      { key: "Knowledge", value: stats.knowledge_base, icon: Database },
    ],
    [stats]
  );

  const neon = {
    bg: "from-[#0A0E1A] via-[#0B1020] to-[#0C1228]",
    panel: "bg-white/5 backdrop-blur-xl border border-white/10",
    glow: "drop-shadow-[0_0_14px_rgba(99,102,241,0.75)]",
    glowSoft: "drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]",
    txt: "text-white",
    accent: "from-indigo-500 via-fuchsia-500 to-cyan-400",
    line: "bg-gradient-to-r from-indigo-500/70 via-fuchsia-500/70 to-cyan-400/70",
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${neon.bg} ${neon.txt} py-10`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header onRefresh={() => fetchStats()} lastUpdated={lastUpdated} neon={neon} />

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-6 rounded-2xl ${neon.panel} p-4 text-rose-300 flex items-center gap-3`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Could not load data: {error}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* KPI cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {chartData.map((d) => (
            <TiltCard key={d.key} className={`rounded-2xl ${neon.panel} p-5 group`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm/5 text-zinc-300/70">{d.key}</p>
                  <AnimatedNumber value={d.value} className={`mt-2 text-3xl font-semibold ${neon.glow}`} />
                </div>
                <div className="relative">
                  <div className={`absolute -inset-2 rounded-full blur-lg opacity-40 bg-gradient-to-br ${neon.accent}`} />
                  <d.icon className="relative h-8 w-8 text-white/90" />
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full overflow-hidden">
                <div className={`h-full ${neon.line}`} style={{ width: `${computePercent(d.value, chartData)}%` }} />
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Charts row: Bar + Pie */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TiltCard className={`col-span-2 rounded-3xl ${neon.panel} p-6`}>
            <SectionTitle title="Overview" subtitle="Category totals (Bar)" />
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.85} />
                      <stop offset="60%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2b2f55" />
                  <XAxis dataKey="key" tick={{ fill: "#e5e7eb" }} axisLine={{ stroke: "#2b2f55" }} tickLine={false} />
                  <YAxis tick={{ fill: "#e5e7eb" }} axisLine={{ stroke: "#2b2f55" }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0e1326", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#e5e7eb" }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1200} animationEasing="ease-out">
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>

          <TiltCard className={`rounded-3xl ${neon.panel} p-6`}>
            <SectionTitle title="Composition" subtitle="Share of total (Pie)" />
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <radialGradient id="pieGrad" cx="50%" cy="50%" r="80%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
                      <stop offset="50%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.95} />
                    </radialGradient>
                  </defs>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="key"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="url(#pieGrad)" stroke="#0b0f22" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0e1326", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-200">
              {chartData.map((d) => (
                <div key={d.key} className="flex items-center justify-between">
                  <span className="text-zinc-300/80">{d.key}</span>
                  <span className="font-medium">{total ? Math.round((d.value / total) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>

        {/* Line charts row (per-category trend) */}
        <div className="mt-8">
          <TiltCard className={`rounded-3xl ${neon.panel} p-6`}>
            <SectionTitle title="Activity" subtitle="Animated sparkline/lines by category" />
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {chartData.map((d, idx) => (
                <div key={d.key} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-300/80">{d.key}</p>
                      <AnimatedNumber value={d.value} className="mt-1 text-2xl font-semibold" />
                    </div>
                    <d.icon className="h-5 w-5 text-white/90" />
                  </div>
                  <div className="mt-3 h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={buildSparkline(d.value, idx)} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`lineGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 4" stroke="#293050" />
                        <XAxis dataKey="i" hide tick={{ fill: "#e5e7eb" }} />
                        <YAxis hide tick={{ fill: "#e5e7eb" }} domain={[0, "dataMax + 5"]} />
                        <Tooltip contentStyle={{ background: "#0e1326", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#e5e7eb" }} />
                        <Line type="monotone" dataKey="v" stroke={`url(#lineGrad-${idx})`} strokeWidth={2} dot={false} isAnimationActive />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>

        {/* Loading toast */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none"
            >
              <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-white shadow-[0_0_25px_rgba(99,102,241,0.35)] border border-white/10">
                <BarChart3 className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Loading latest stats…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header({ onRefresh, lastUpdated, neon }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={`text-3xl font-bold tracking-tight sm:text-4xl ${neon.glow}`}>Neon Statistics</h1>
        <p className="mt-1 text-zinc-300/80">Live metrics from your platform API</p>
        <div className="mt-3 text-xs text-zinc-300/70">
          {lastUpdated ? (
            <span>
              Updated at {lastUpdated.toLocaleTimeString()} · {lastUpdated.toLocaleDateString()}
            </span>
          ) : (
            <span>Waiting for first update…</span>
          )}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onRefresh}
        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
      >
        <RefreshCcw className="h-4 w-4 transition group-hover:rotate-180" />
        Refresh
      </motion.button>
    </div>
  );
}

/** 3D-tilt utility card */
function TiltCard({ className = "", children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set(Math.max(-50, Math.min(50, px)));
    y.set(Math.max(-50, Math.min(50, py)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div className="pointer-events-none absolute -inset-px rounded-[22px] bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/40 to-cyan-300/40 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-zinc-300/80">{subtitle}</p>}
    </div>
  );
}

/** Animated number using requestAnimationFrame */
function AnimatedNumber({ value, className = "" }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  const start = useRef(0);
  const from = useRef(0);

  useEffect(() => {
    cancel();
    const duration = 700; // ms
    start.current = performance.now();
    from.current = display;

    const tick = (t) => {
      const p = Math.min(1, (t - start.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(from.current + (value - from.current) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const cancel = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  return <span className={className}>{display.toLocaleString()}</span>;
}

/** Helpers */
function sanitizeStats(raw) {
  const safe = (n) => (Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0);
  return {
    leads: safe(raw && raw.leads),
    files: safe(raw && raw.files),
    assistants: safe(raw && raw.assistants),
    phone_numbers: safe(raw && raw.phone_numbers),
    knowledge_base: safe(raw && raw.knowledge_base),
  };
}

function computePercent(v, arr) {
  const max = Math.max(1, ...arr.map((a) => a.value));
  return Math.round((v / max) * 100);
}

/** Create a small synthetic sparkline dataset from a value; deterministic per category */
function buildSparkline(value, seed = 0) {
  const len = 20;
  const base = Math.max(1, value);
  let x = (seed + 1) * 97; // deterministic seed
  const rand = () => {
    x ^= x << 13; x ^= x >> 17; x ^= x << 5; // xorshift32-ish
    return (x >>> 0) / 4294967295;
  };
  return Array.from({ length: len }, (_, i) => ({ i, v: Math.round(base * (0.5 + rand())) }));
}
