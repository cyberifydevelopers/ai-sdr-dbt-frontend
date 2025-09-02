"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  Phone as PhoneIcon,
  StickyNote,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Search,
} from "lucide-react";

/* ---------------------------------------------------------
   Config
--------------------------------------------------------- */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

const R = {
  LIST: `${API_URL}/api/appointments`,
  CREATE: `${API_URL}/api/appointments/tool/schedule`,
  DETAIL: (id) => `${API_URL}/api/appointments/${id}`,
  UPDATE: (id) => `${API_URL}/api/appointments/${id}`, 
};

const neonGrad = "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600";

/* ---------------------------------------------------------
   Tiny UI atoms (same visual language as your sample)
--------------------------------------------------------- */
function Button({ children, className = "", variant = "outline", size = "md", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  const sizes = { sm: "text-xs px-2.5 py-1.5", md: "text-sm px-3 py-2", lg: "text-sm px-4 py-2.5" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm",
    outline: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 shadow-sm",
    subtle: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent",
  };
  return (
    <button {...props} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</button>
  );
}

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
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

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div
        className="relative z-10 w-full max-w-lg sm:max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
        initial={{ y: 20, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 10, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
          <div className="text-base sm:text-lg font-bold text-slate-900">{title}</div>
          <Button onClick={onClose} variant="ghost" aria-label="Close" className="rounded-lg p-1.5">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-4 sm:px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------
   Utilities
--------------------------------------------------------- */
const statusTone = (s) => {
  switch (String(s || "").toLowerCase()) {
    case "scheduled":
      return { badge: "border-amber-200 bg-amber-50 text-amber-700", icon: Circle };
    case "completed":
      return { badge: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: CheckCircle2 };
    case "cancelled":
    case "canceled":
      return { badge: "border-red-200 bg-red-50 text-red-700", icon: XCircle };
    default:
      return { badge: "border-slate-200 bg-slate-50 text-slate-700", icon: Circle };
  }
};

function formatLocal(dtStr) {
  try {
    const d = new Date(dtStr);
    if (Number.isNaN(d.getTime())) return dtStr;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dtStr;
  }
}

function to24h(timeStr) {
  // Accept "15:30", "3 pm", "3:30 PM", "noon", "midnight"
  const s = String(timeStr || "").trim().toLowerCase();
  if (!s) return "";
  if (s === "noon") return "12:00";
  if (s === "midnight") return "00:00";
  const ampm = s.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)/i);
  if (ampm) {
    let h = parseInt(ampm[1]);
    const m = parseInt(ampm[2] || "0");
    const mer = (ampm[3] || "").toLowerCase();
    if (mer === "pm" && h < 12) h += 12;
    if (mer === "am" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const hhmm = s.match(/^(\d{1,2})(?::(\d{1,2}))?$/);
  if (hhmm) {
    let h = parseInt(hhmm[1]);
    const m = parseInt(hhmm[2] || "0");
    if (h <= 24 && m <= 59) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return s; // let backend validate if odd
}

function ensurePhone(s) {
  const raw = String(s || "").trim();
  if (!raw) return "";
  const plus = raw.startsWith("+") ? "+" : "";
  const digits = raw.replace(/\D+/g, "");
  return plus + digits;
}

/* ---------------------------------------------------------
   Main Page
--------------------------------------------------------- */
export default function AppointmentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all|scheduled|completed|cancelled
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // modal create
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi",
    durationMinutes: 30,
    phone: "",
    location: "",
    notes: "",
  });

  // status change busy
  const [busyId, setBusyId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch(R.LIST, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        mode: "cors",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Expecting an array of AppointmentOut
      const arr = Array.isArray(data) ? data : data?.appointments || [];
      const list = arr.map((a) => ({
        id: a.id,
        title: a.title,
        notes: a.notes,
        location: a.location,
        phone: a.phone,
        timezone: a.timezone,
        start_at: a.start_at,
        end_at: a.end_at,
        duration_minutes: a.duration_minutes,
        status: a.status,
        created_at: a.created_at,
        updated_at: a.updated_at,
      }));
      list.sort((a, b) => new Date(b.start_at) - new Date(a.start_at));
      setItems(list);
    } catch (e) {
      setErr(e?.message || "Failed to load appointments");
      toast.error(e?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // derived
  const filtered = useMemo(() => {
    let out = [...items];
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      out = out.filter((x) =>
        [x.title, x.location, x.phone, x.notes]
          .map((v) => String(v || "").toLowerCase())
          .some((t) => t.includes(s))
      );
    }
    if (statusFilter !== "all") {
      out = out.filter((x) => String(x.status).toLowerCase() === statusFilter);
    }
    if (dateFrom) {
      const from = new Date(`${dateFrom}T00:00:00`);
      out = out.filter((x) => new Date(x.start_at) >= from);
    }
    if (dateTo) {
      const to = new Date(`${dateTo}T23:59:59`);
      out = out.filter((x) => new Date(x.start_at) <= to);
    }
    return out;
  }, [items, q, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const idxLast = currentPage * perPage;
  const idxFirst = idxLast - perPage;
  const pageItems = filtered.slice(idxFirst, idxLast);

  useEffect(() => setCurrentPage(1), [q, statusFilter, dateFrom, dateTo]);

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    const scheduled = items.filter((x) => x.status === "scheduled").length;
    const completed = items.filter((x) => x.status === "completed").length;
    const cancelled = items.filter((x) => String(x.status).toLowerCase().startsWith("cancel")).length;
    return { total, scheduled, completed, cancelled };
  }, [items]);

  // actions
  async function changeStatus(id, newStatus) {
    try {
      setBusyId(id);
      const res = await fetch(R.UPDATE(id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}${txt ? ` — ${txt}` : ""}`);
      }
      toast.success(`Status set to ${newStatus}`);
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
    } catch (e) {
      toast.error(e?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  }

  async function submitCreate() {
    const payload = {
      title: String(form.title || "").trim(),
      date: String(form.date || "").trim(),
      time: to24h(form.time),
      timezone: String(form.timezone || "Asia/Karachi").trim(),
      durationMinutes: Math.max(1, parseInt(form.durationMinutes || 30)),
      phone: ensurePhone(form.phone),
      location: String(form.location || "").trim(),
      notes: String(form.notes || "").trim(),
    };

    if (!payload.title) return toast.error("Title is required");
    if (!payload.date) return toast.error("Date is required");
    if (!payload.time || !/^\d{2}:\d{2}$/.test(payload.time)) return toast.error("Time looks invalid");
    if (!payload.location) return toast.error("Location is required");
    if (!payload.phone || payload.phone.replace(/\D/g, "").length < 11) return toast.error("Phone looks invalid");

    try {
      setCreating(true);
      const res = await fetch(R.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}${txt ? ` — ${txt}` : ""}`);
      }
      const created = await res.json();
      toast.success("🎉 Appointment created");
      setCreateOpen(false);
      setForm({ title: "", date: "", time: "", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi", durationMinutes: 30, phone: "", location: "", notes: "" });
      // Optimistically add (ensure shape matches AppointmentOut)
      setItems((prev) => [{
        id: created.id || crypto.randomUUID(),
        title: created.title || payload.title,
        notes: created.notes || payload.notes,
        location: created.location || payload.location,
        phone: created.phone || payload.phone,
        timezone: created.timezone || payload.timezone,
        start_at: created.start_at || `${payload.date}T${payload.time}`,
        end_at: created.end_at || `${payload.date}T${payload.time}`,
        duration_minutes: created.duration_minutes || payload.durationMinutes,
        status: created.status || "scheduled",
        created_at: created.created_at || new Date().toISOString(),
        updated_at: created.updated_at || new Date().toISOString(),
      }, ...prev]);
    } catch (e) {
      toast.error(e?.message || "Failed to create appointment");
    } finally {
      setCreating(false);
    }
  }

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* soft glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
      </div>

      {/* Header */}
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
                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
                  <span className={`bg-clip-text text-transparent ${neonGrad}`}>Appointments</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Create, track, and update appointment statuses.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setCreateOpen(true)} variant="primary">
                <Plus className="mr-2 h-4 w-4" /> New Appointment
              </Button>
              <Button onClick={fetchAppointments}>
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
          <StatCard label="Total" value={stats.total} Icon={Calendar} tone="blue" />
          <StatCard label="Scheduled" value={stats.scheduled} Icon={Circle} tone="cyan" />
          <StatCard label="Completed" value={stats.completed} Icon={CheckCircle2} tone="blue" />
          <StatCard label="Cancelled" value={stats.cancelled} Icon={XCircle} tone="cyan" />
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
                  placeholder="Search title, phone, location, notes"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-500 shrink-0">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-medium">Filters</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-slate-500 text-sm">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              {(q || statusFilter !== "all" || dateFrom || dateTo) && (
                <Button
                  onClick={() => {
                    setQ("");
                    setStatusFilter("all");
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-slate-700"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table/Card list */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-8 w-8 place-content-center rounded-xl bg-blue-600 text-white shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">All Appointments ({filtered.length})</h2>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            )}
          </div>

          {err ? (
            <div className="p-6 text-sm text-red-600">{err}</div>
          ) : filtered.length === 0 ? (
            <div className="grid place-content-center py-16 px-4">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-slate-100 mb-4">
                <Calendar className="h-9 w-9 text-slate-400" />
              </div>
              <div className="text-lg font-semibold text-slate-700">No appointments</div>
              <div className="text-sm text-slate-500">Try changing filters or create a new one</div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden xl:block">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <Th>Title</Th>
                      <Th>When</Th>
                      <Th>Location</Th>
                      <Th>Phone</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pageItems.map((a) => {
                      const tone = statusTone(a.status);
                      const Icon = tone.icon;
                      return (
                        <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                          <Td>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 truncate">{a.title}</div>
                              <div className="text-[11px] text-slate-500 break-all">ID #{a.id}</div>
                            </div>
                          </Td>
                          <Td>
                            <div className="text-sm text-slate-800 flex items-center gap-1"><Clock className="h-4 w-4 text-slate-500" /> {formatLocal(a.start_at)}</div>
                          </Td>
                          <Td>
                            <div className="text-sm text-slate-800 flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-500" /> {a.location || "—"}</div>
                          </Td>
                          <Td>
                            <div className="text-sm text-slate-800 flex items-center gap-1"><PhoneIcon className="h-4 w-4 text-slate-500" /> {a.phone}</div>
                          </Td>
                          <Td>
                            <Pill className={`border ${tone.badge}`}>
                              <Icon className="mr-1 h-3.5 w-3.5" /> {String(a.status).charAt(0).toUpperCase() + String(a.status).slice(1)}
                            </Pill>
                          </Td>
                          <Td>
                            <div className="flex flex-wrap gap-2">
                              <StatusDropdown current={a.status} onChange={(s) => changeStatus(a.id, s)} busy={busyId === a.id} />
                              <DetailsButton a={a} />
                            </div>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Card grid for smaller screens */}
              <div className="xl:hidden p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {pageItems.map((a) => {
                    const tone = statusTone(a.status);
                    const Icon = tone.icon;
                    return (
                      <div key={a.id} className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 overflow-hidden">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-base font-bold text-slate-900 truncate">{a.title}</div>
                            <div className="mt-1 text-sm text-slate-700 flex items-center gap-1"><Clock className="h-4 w-4 text-slate-500" /> {formatLocal(a.start_at)}</div>
                            <div className="mt-1 text-sm text-slate-700 flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-500" /> {a.location || "—"}</div>
                            <div className="mt-1 text-sm text-slate-700 flex items-center gap-1"><PhoneIcon className="h-4 w-4 text-slate-500" /> {a.phone}</div>
                          </div>
                          <Pill className={`border ${tone.badge} shrink-0`}><Icon className="mr-1 h-3.5 w-3.5" /> {String(a.status).charAt(0).toUpperCase() + String(a.status).slice(1)}</Pill>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <StatusDropdown current={a.status} onChange={(s) => changeStatus(a.id, s)} busy={busyId === a.id} />
                          <DetailsButton a={a} />
                        </div>
                        <div className="mt-2 text-[11px] text-slate-500 break-all">ID #{a.id}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {filtered.length > perPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50">
                  <div className="text-sm text-slate-600">
                    Showing <b>{idxFirst + 1}</b>–<b>{Math.min(idxLast, filtered.length)}</b> of <b>{filtered.length}</b>
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
                              active ? "bg-blue-600 text-white" : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50"
                            }`}
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

      {/* Create Appointment Modal */}
      <AnimatePresence>
        {createOpen && (
          <Modal onClose={() => setCreateOpen(false)} title="New Appointment">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Consultation"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="+923001234567"
                />
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </Field>
              <Field label="Time">
                <input
                  value={form.time}
                  onChange={(e) => setForm((s) => ({ ...s, time: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="15:30 or 3:30 PM"
                />
              </Field>
              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Clinic, Main St."
                />
              </Field>
              <Field label="Timezone">
                <input
                  value={form.timezone}
                  onChange={(e) => setForm((s) => ({ ...s, timezone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Asia/Karachi"
                />
              </Field>
              <Field label="Duration (minutes)">
                <input
                  type="number"
                  min={1}
                  max={1440}
                  value={form.durationMinutes}
                  onChange={(e) => setForm((s) => ({ ...s, durationMinutes: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </Field>
              <Field label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Any extra details"
                  rows={3}
                />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setCreateOpen(false)} variant="subtle">Cancel</Button>
              <Button onClick={submitCreate} disabled={creating} variant="primary">
                {creating ? (<><RefreshCw className="h-4 w-4 animate-spin mr-2" /> Creating…</>) : (<><Plus className="h-4 w-4 mr-2" /> Create</>)}
              </Button>
            </div>
          </Modal>
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
      <div className="absolute -inset-0.5 rounded-3xl opacity-20 blur-2xl" style={{ background: `linear-gradient(135deg, #06b6d466, #ffffff00)` }} />
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

function StatusDropdown({ current, onChange, busy }) {
  const [open, setOpen] = useState(false);
  const opts = [
    { k: "scheduled", label: "Mark Scheduled", tone: statusTone("scheduled") },
    { k: "completed", label: "Mark Completed", tone: statusTone("completed") },
    { k: "cancelled", label: "Mark Cancelled", tone: statusTone("cancelled") },
  ];
  const curr = statusTone(current);
  const CurrIcon = curr.icon;
  return (
    <div className="relative">
      <Button onClick={() => setOpen((v) => !v)} size="sm" className="min-w-[150px] justify-between">
        <span className="flex items-center gap-2 text-slate-800">
          <CurrIcon className="h-4 w-4" /> {String(current).charAt(0).toUpperCase() + String(current).slice(1)}
        </span>
        {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4 opacity-60" />}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            {opts.map((o) => (
              <button
                key={o.k}
                onClick={() => {
                  setOpen(false);
                  if (o.k !== current) onChange(o.k);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <o.tone.icon className="h-4 w-4" /> {o.label}
                </span>
                {String(current) === o.k && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailsButton({ a }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm"><Eye className="h-4 w-4 mr-1" /> Details</Button>
      <AnimatePresence>
        {open && (
          <Modal title="Appointment Details" onClose={() => setOpen(false)}>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Title:</span> {a.title}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" /> <span className="font-semibold">When:</span> {formatLocal(a.start_at)}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Location:</span> {a.location || "—"}</div>
              <div className="flex items-center gap-2"><PhoneIcon className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Phone:</span> {a.phone}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Duration:</span> {a.duration_minutes} min</div>
              <div className="flex items-center gap-2"><StickyNote className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Notes:</span> {a.notes || "—"}</div>
              <div className="text-[11px] text-slate-500">ID #{a.id}</div>
            </div>
            <div className="mt-5 text-right">
              <Button onClick={() => setOpen(false)} variant="primary">Close</Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
