




// "use client"

// import { useEffect, useMemo, useRef, useState } from "react"
// import { toast } from "react-toastify"
// import {
//   Search,
//   RefreshCw,
//   X,
//   Loader2,
//   Users,
//   CheckCircle2,
//   XCircle,
//   Plus,
//   Play,
//   Pause,
//   Square as StopSquare, // ✅ correct icon
//   Trash2,
//   Eye,
//   Download,
//   Settings,
//   Rocket,
//   ChevronLeft,
//   ChevronRight,
//   Check,
// } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// /* ──────────────────────────────────────────────────────────────────────────
//  * Config
//  * ────────────────────────────────────────────────────────────────────────── */
// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000"
// const API_PREFIX = import.meta.env?.VITE_API_PREFIX || "/api"

// // Campaign endpoints (aligned to your FastAPI router)
// const EP = {
//   LIST: `${API_URL}${API_PREFIX}/campaigns/campaigns`,
//   CREATE: `${API_URL}${API_PREFIX}/campaigns/campaigns`,
//   DETAIL: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}`,
//   SCHEDULE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/schedule`,
//   RETRY: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/retry-policy`,
//   PAUSE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/pause`,
//   RESUME: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/resume`,
//   STOP: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/stop`,
//   RUN_NOW: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/run-now`,
//   ICS: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/calendar.ics`,
//   DELETE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}`,
// }

// // Resource endpoints
// const RESOURCES = {
//   FILES: `${API_URL}${API_PREFIX}/files`, // should return [{id, name, ...}] or {items:[...]}
//   ASSISTANTS: `${API_URL}${API_PREFIX}/get-assistants`, // per your requirement
//   LEADS: (fileId) => `${API_URL}${API_PREFIX}/leads${fileId ? `?file_id=${fileId}` : ""}`, // [{id, first_name, ...}]
// }

// /* Utilities */
// function cx(...arr) {
//   return arr.filter(Boolean).join(" ")
// }
// const unknown = (v) => {
//   if (v === undefined || v === null) return "Unknown"
//   const s = String(v).trim()
//   return s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined" ? "Unknown" : s
// }
// function useDebounce(value, delay = 250) {
//   const [debounced, setDebounced] = useState(value)
//   useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delay)
//     return () => clearTimeout(t)
//   }, [value, delay])
//   return debounced
// }
// function fmtDT(d) {
//   try {
//     const dt = new Date(d)
//     if (isNaN(dt.getTime())) return "Unknown"
//     return dt.toLocaleString()
//   } catch {
//     return "Unknown"
//   }
// }
// function toInputDateTimeLocal(value) {
//   if (!value) return ""
//   const d = new Date(value)
//   if (isNaN(d.getTime())) return ""
//   const yyyy = d.getFullYear()
//   const mm = String(d.getMonth() + 1).padStart(2, "0")
//   const dd = String(d.getDate()).padStart(2, "0")
//   const hh = String(d.getHours()).padStart(2, "0")
//   const mi = String(d.getMinutes()).padStart(2, "0")
//   return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
// }
// function fromInputDateTimeLocal(s) {
//   if (!s) return null
//   const d = new Date(s)
//   return isNaN(d.getTime()) ? null : d.toISOString()
// }

// /* Motion variants */
// const fadeUp = {
//   hidden: { opacity: 0, y: 8 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } },
// }
// const stagger = { show: { transition: { staggerChildren: 0.05 } } }
// const overlay = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1, transition: { duration: 0.18 } },
//   exit: { opacity: 0, transition: { duration: 0.12 } },
// }
// const slideInFromBottom = {
//   hidden: { opacity: 0, y: 20, scale: 0.95 },
//   show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.4 } },
//   exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
// }
// const modalVariants = {
//   hidden: { opacity: 0, scale: 0.8, y: 50 },
//   show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.5 } },
//   exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
// }
// const stepTransition = {
//   hidden: { opacity: 0, x: 20 },
//   show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
//   exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
// }

// /* Pill chip */
// function Chip({ children, tone = "slate" }) {
//   const tones = {
//     slate: "bg-slate-100 text-slate-700 ring-slate-200",
//     green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
//     red: "bg-rose-100 text-rose-700 ring-rose-200",
//     blue: "bg-blue-100 text-blue-700 ring-blue-200",
//     orange: "bg-orange-100 text-orange-700 ring-orange-200",
//     purple: "bg-purple-100 text-purple-700 ring-purple-200",
//   }
//   return (
//     <motion.span
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.2 }}
//       className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", tones[tone] || tones.slate)}
//     >
//       {children}
//     </motion.span>
//   )
// }

// /* Stat card */
// function StatCard({ label, value, Icon, tone = "blue" }) {
//   const ring = tone === "blue" ? "ring-blue-200/60" : tone === "cyan" ? "ring-cyan-200/60" : "ring-slate-200/60"
//   const bg =
//     tone === "blue"
//       ? "from-blue-600 to-cyan-500"
//       : tone === "cyan"
//       ? "from-cyan-500 to-blue-600"
//       : "from-slate-500 to-slate-700"
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
//   )
// }

// /* Status chip */
// function StatusChip({ status }) {
//   const s = String(status || "").toLowerCase()
//   if (s === "scheduled") return <Chip tone="blue">Scheduled</Chip>
//   if (s === "running") return <Chip tone="green">Running</Chip>
//   if (s === "paused") return <Chip tone="orange">Paused</Chip>
//   if (s === "stopped") return <Chip tone="red">Stopped</Chip>
//   if (s === "completed") return <Chip tone="purple">Completed</Chip>
//   if (s === "draft") return <Chip tone="slate">Draft</Chip>
//   return <Chip tone="slate">{unknown(status)}</Chip>
// }

// /* Timezones (added Asia/Karachi for your locale) */
// const TIMEZONES = [
//   { value: "UTC", label: "UTC" },
//   { value: "America/New_York", label: "America/New_York" },
//   { value: "America/Chicago", label: "America/Chicago" },
//   { value: "America/Denver", label: "America/Denver" },
//   { value: "America/Los_Angeles", label: "America/Los_Angeles" },
//   { value: "America/Phoenix", label: "America/Phoenix" },
//   { value: "Europe/London", label: "Europe/London" },
//   { value: "Europe/Berlin", label: "Europe/Berlin" },
//   { value: "Europe/Paris", label: "Europe/Paris" },
//   { value: "Asia/Karachi", label: "Asia/Karachi" },
//   { value: "Asia/Kolkata", label: "Asia/Kolkata" },
//   { value: "Asia/Singapore", label: "Asia/Singapore" },
//   { value: "Asia/Tokyo", label: "Asia/Tokyo" },
//   { value: "Asia/Dubai", label: "Asia/Dubai" },
//   { value: "Australia/Sydney", label: "Australia/Sydney" },
// ]

// /* ──────────────────────────────────────────────────────────────────────────
//  * Page: Campaigns
//  * ────────────────────────────────────────────────────────────────────────── */
// export default function CampaignsPage() {
//   const token = useRef(localStorage.getItem("token") || null)

//   // Data & UI state
//   const [campaigns, setCampaigns] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)

//   const [files, setFiles] = useState([])
//   const [assistants, setAssistants] = useState([])
//   const [leadsForFile, setLeadsForFile] = useState([])
//   const [leadsLoading, setLeadsLoading] = useState(false)

//   const [query, setQuery] = useState("")
//   const debouncedQuery = useDebounce(query, 250)

//   // Sorting & paging
//   const [sortBy, setSortBy] = useState("created_at")
//   const [sortDir, setSortDir] = useState("desc")
//   const [page, setPage] = useState(1)
//   const [pageSize, setPageSize] = useState(10)

//   const [showCreate, setShowCreate] = useState(false)
//   const [step, setStep] = useState(1) // 1-6
//   const [creating, setCreating] = useState(false)
//   const [createForm, setCreateForm] = useState({
//     name: "",
//     file_id: "",
//     assistant_id: "",
//     selection_mode: "ALL",
//     include_lead_ids: [],
//     exclude_lead_ids: [],
//     timezone: "America/Los_Angeles",
//     days_of_week: [0, 1, 2, 3, 4],
//     daily_start: "09:00",
//     daily_end: "18:00",
//     start_at: "",
//     end_at: "",
//     calls_per_minute: 10,
//     parallel_calls: 2,
//     retry_on_busy: true,
//     busy_retry_delay_minutes: 15,
//     max_attempts: 3,
//     description: "", // optional (not sent to backend)
//   })
//   const [leadSearch, setLeadSearch] = useState("")

//   // Details drawer
//   const [showDetails, setShowDetails] = useState(false)
//   const [activeCampaign, setActiveCampaign] = useState(null)
//   const [detailsLoading, setDetailsLoading] = useState(false)
//   const [details, setDetails] = useState(null)

//   /* Fetch list + resources on mount */
//   useEffect(() => {
//     if (!token.current) {
//       setLoading(false)
//       toast.error("No auth token found. Please log in.")
//       return
//     }
//     fetchAll()
//     // eslint-disable-next-line
//   }, [])

//   async function fetchAll() {
//     setLoading(true)
//     try {
//       await Promise.all([fetchCampaigns(), fetchFiles(), fetchAssistants()])
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function authedFetch(url, options = {}) {
//     if (!token.current) {
//       toast.error("No auth token found. Please log in.")
//       throw new Error("No token")
//     }
//     const res = await fetch(url, {
//       ...options,
//       headers: {
//         ...(options.headers || {}),
//         Authorization: `Bearer ${token.current}`,
//       },
//     })
//     return res
//   }

//   async function fetchCampaigns() {
//     try {
//       const res = await authedFetch(EP.LIST)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       setCampaigns(Array.isArray(data) ? data : [])
//     } catch (e) {
//       console.error(e)
//       toast.error("Failed to fetch campaigns")
//       setCampaigns([])
//     }
//   }

//   async function fetchFiles() {
//     try {
//       const res = await authedFetch(RESOURCES.FILES)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       setFiles(Array.isArray(data) ? data : data?.items || [])
//     } catch (e) {
//       console.warn("Files fetch failed:", e.message)
//       setFiles([])
//     }
//   }

//   async function fetchAssistants() {
//     try {
//       const res = await authedFetch(RESOURCES.ASSISTANTS)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       const arr = (Array.isArray(data) && data) || data?.items || data?.assistants || data?.data || []
//       const normalized = arr.filter((a) => a && a.id !== undefined && a.id !== null)
//       setAssistants(normalized)
//     } catch (e) {
//       console.warn("Assistants fetch failed:", e.message)
//       setAssistants([])
//     }
//   }

//   async function loadLeadsForFile(fileId) {
//     if (!fileId) {
//       setLeadsForFile([])
//       return
//     }
//     try {
//       setLeadsLoading(true)
//       const res = await authedFetch(RESOURCES.LEADS(fileId))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json = await res.json()
//       const list = Array.isArray(json) ? json : json?.leads || json?.items || []
//       setLeadsForFile(list)
//     } catch (e) {
//       console.warn("Leads fetch failed:", e.message)
//       setLeadsForFile([])
//     } finally {
//       setLeadsLoading(false)
//     }
//   }

//   async function refreshAll() {
//     setRefreshing(true)
//     try {
//       await fetchCampaigns()
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   /* Derived list */
//   const filtered = useMemo(() => {
//     const q = debouncedQuery.trim().toLowerCase()
//     const list = campaigns.filter((c) => {
//       if (!q) return true
//       const fields = [
//         (c.name || "").toLowerCase(),
//         (c.status || "").toLowerCase(),
//         String(c.id || ""),
//         String(c.file_id || ""),
//         String(c.assistant_id || ""),
//       ]
//       return fields.some((f) => f.includes(q))
//     })
//     const dir = sortDir === "asc" ? 1 : -1
//     list.sort((a, b) => {
//       let va, vb
//       switch (sortBy) {
//         case "name":
//           va = (a.name || "").toLowerCase()
//           vb = (b.name || "").toLowerCase()
//           break
//         case "status":
//           va = (a.status || "").toLowerCase()
//           vb = (b.status || "").toLowerCase()
//           break
//         case "calls_per_minute":
//           va = a.calls_per_minute || 0
//           vb = b.calls_per_minute || 0
//           break
//         case "created_at":
//         default:
//           va = new Date(a.created_at || 0).getTime()
//           vb = new Date(b.created_at || 0).getTime()
//       }
//       if (va < vb) return -1 * dir
//       if (va > vb) return 1 * dir
//       return 0
//     })
//     return list
//   }, [campaigns, debouncedQuery, sortBy, sortDir])

//   const totalItems = filtered.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages)
//   }, [page, totalPages])
//   const start = (page - 1) * pageSize
//   const end = start + pageSize
//   const pageItems = filtered.slice(start, end)

//   // Stats
//   const stats = useMemo(() => {
//     const total = filtered.length
//     const running = filtered.filter((c) => (c.status || "").toLowerCase() === "running").length
//     const paused = filtered.filter((c) => (c.status || "").toLowerCase() === "paused").length
//     return { total, running, paused }
//   }, [filtered])

//   /* Create: behavior */
//   function onCreateChange(e) {
//     const { name, value, type, checked } = e.target
//     setCreateForm((f) => {
//       const next = { ...f, [name]: type === "checkbox" ? checked : value }
//       if (name === "file_id") {
//         const fileIdNum = Number(value) || ""
//         if (fileIdNum) loadLeadsForFile(fileIdNum)
//         else setLeadsForFile([])
//         next.include_lead_ids = []
//         next.exclude_lead_ids = []
//       }
//       if (name === "selection_mode") {
//         next.include_lead_ids = []
//         next.exclude_lead_ids = []
//       }
//       return next
//     })
//   }
//   function toggleDOW(d) {
//     setCreateForm((f) => {
//       const has = f.days_of_week.includes(d)
//       const days = has ? f.days_of_week.filter((x) => x !== d) : [...f.days_of_week, d]
//       days.sort((a, b) => a - b)
//       return { ...f, days_of_week: days }
//     })
//   }

//   async function createCampaign() {
//     if (!createForm.name || !createForm.file_id || !createForm.assistant_id) {
//       toast.error("Name, File and Assistant are required.")
//       return
//     }
//     if (createForm.selection_mode !== "ALL" && createForm.file_id && leadsForFile.length === 0) {
//       toast.error("No leads available for the selected file.")
//       return
//     }

//     const payload = {
//       name: String(createForm.name).trim(),
//       file_id: Number(createForm.file_id),
//       assistant_id: Number(createForm.assistant_id),
//       selection_mode: createForm.selection_mode,
//       include_lead_ids:
//         createForm.selection_mode === "ONLY" && createForm.include_lead_ids?.length ? createForm.include_lead_ids : null,
//       exclude_lead_ids:
//         createForm.selection_mode === "SKIP" && createForm.exclude_lead_ids?.length ? createForm.exclude_lead_ids : null,
//       timezone: createForm.timezone || "America/Los_Angeles",
//       days_of_week: createForm.days_of_week,
//       daily_start: createForm.daily_start || "09:00",
//       daily_end: createForm.daily_end || "18:00",
//       start_at: fromInputDateTimeLocal(createForm.start_at),
//       end_at: fromInputDateTimeLocal(createForm.end_at),
//       calls_per_minute: Number(createForm.calls_per_minute) || 10,
//       parallel_calls: Number(createForm.parallel_calls) || 2,
//       retry_on_busy: !!createForm.retry_on_busy,
//       busy_retry_delay_minutes: Number(createForm.busy_retry_delay_minutes) || 15,
//       max_attempts: Number(createForm.max_attempts) || 3,
//     }

//     try {
//       setCreating(true)
//       const res = await authedFetch(EP.CREATE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Campaign created.")
//       setShowCreate(false)
//       setStep(1)
//       setCreateForm((f) => ({
//         ...f,
//         name: "",
//         include_lead_ids: [],
//         exclude_lead_ids: [],
//       }))
//       await fetchCampaigns()
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Create failed")
//     } finally {
//       setCreating(false)
//     }
//   }

//   /* Details */
//   async function openDetails(c) {
//     setActiveCampaign(c)
//     setShowDetails(true)
//     await loadDetails(c.id)
//   }
//   async function loadDetails(id) {
//     if (!id) return
//     try {
//       setDetailsLoading(true)
//       const res = await authedFetch(EP.DETAIL(id))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json = await res.json()
//       setDetails(json)
//     } catch (e) {
//       console.error(e)
//       toast.error("Failed to load campaign details")
//       setDetails(null)
//     } finally {
//       setDetailsLoading(false)
//     }
//   }

//   /* Controls */
//   async function postAction(urlBuilder, id, okMsg) {
//     try {
//       const res = await authedFetch(urlBuilder(id), { method: "POST" })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || okMsg)
//       await fetchCampaigns()
//       if (activeCampaign && activeCampaign.id === id) {
//         await loadDetails(id)
//       }
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Action failed")
//     }
//   }
//   const doPause = (id) => postAction(EP.PAUSE, id, "Paused")
//   const doResume = (id) => postAction(EP.RESUME, id, "Resumed")
//   const doStop = (id) => postAction(EP.STOP, id, "Stopped")

//   async function doDelete(id) {
//     if (!confirm("Delete this campaign and its progress rows?")) return
//     try {
//       const res = await authedFetch(EP.DELETE(id), { method: "DELETE" })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Deleted")
//       setShowDetails(false)
//       setActiveCampaign(null)
//       await fetchCampaigns()
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Delete failed")
//     }
//   }

//   async function doRunNow(id, batchSize) {
//     try {
//       const res = await authedFetch(EP.RUN_NOW(id), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ batch_size: Number(batchSize) || 5 }),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Triggered.")
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Run-now failed")
//     }
//   }

//   async function updateSchedule(id, form) {
//     const payload = {
//       timezone: form.timezone || undefined,
//       days_of_week: form.days_of_week?.length ? form.days_of_week : undefined,
//       daily_start: form.daily_start || undefined,
//       daily_end: form.daily_end || undefined,
//       start_at: fromInputDateTimeLocal(form.start_at),
//       end_at: fromInputDateTimeLocal(form.end_at),
//     }
//     try {
//       const res = await authedFetch(EP.SCHEDULE(id), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Schedule updated")
//       await fetchCampaigns()
//       await loadDetails(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Update failed")
//     }
//   }

//   async function updateRetryPolicy(id, form) {
//     const payload = {
//       retry_on_busy: !!form.retry_on_busy,
//       busy_retry_delay_minutes: Number(form.busy_retry_delay_minutes) || 15,
//       max_attempts: Number(form.max_attempts) || 3,
//     }
//     try {
//       const res = await authedFetch(EP.RETRY(id), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Retry policy updated")
//       await loadDetails(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Update failed")
//     }
//   }

//   async function downloadICS(id, name = "campaign") {
//     try {
//       const res = await authedFetch(EP.ICS(id))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const blob = await res.blob()
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `${name || "campaign"}.ics`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       URL.revokeObjectURL(url)
//     } catch (e) {
//       console.error(e)
//       toast.error("ICS download failed")
//     }
//   }

//   const handleOpenCreate = () => {
//     setShowCreate(true)
//     setStep(1)
//   }

//   const handleCloseCreate = () => {
//     setShowCreate(false)
//     setStep(1)
//     setCreateForm((f) => ({
//       ...f,
//       name: "",
//       include_lead_ids: [],
//       exclude_lead_ids: [],
//     }))
//   }

//   const handleNext = () => {
//     setStep((s) => Math.min(6, s + 1))
//   }

//   const handleBack = () => {
//     setStep((s) => Math.max(1, s - 1))
//   }

//   /* Render */
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//         {/* Header */}
//         <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Campaigns</h1>
//             <p className="mt-1 text-sm sm:text-base text-slate-600">Manage your calling campaigns and schedules.</p>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-3">
//             <ButtonGhost onClick={refreshAll} disabled={refreshing} icon={refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}>
//               <span className="hidden sm:inline">Refresh</span>
//             </ButtonGhost>
//             <ButtonPrimary onClick={handleOpenCreate} icon={<Plus className="h-4 w-4" />}>
//               <span className="hidden sm:inline">Create Campaign</span>
//               <span className="sm:hidden">Create</span>
//             </ButtonPrimary>
//           </div>
//         </motion.div>

//         {/* Filters */}
//         <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="relative sm:col-span-1 lg:col-span-2">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//             <input
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value)
//                 setPage(1)
//               }}
//               placeholder="Search name, status, IDs…"
//               className="w-full rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/60 transition focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300"
//               aria-label="Search campaigns"
//             />
//           </div>

//           <div className="flex items-center justify-between sm:justify-end gap-3">
//             <div className="text-xs sm:text-sm text-slate-600 hidden sm:block">
//               Total: <span className="font-semibold text-slate-900">{totalItems}</span>
//             </div>
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value))
//                 setPage(1)
//               }}
//               className="rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none ring-1 ring-white/60 focus:ring-2 focus:ring-cyan-400/40"
//               aria-label="Rows per page"
//             >
//               {[10, 20, 40, 80].map((n) => (
//                 <option key={n} value={n}>
//                   {n} / page
//                 </option>
//               ))}
//             </select>
//           </div>
//         </motion.div>

//         {/* Stats */}
//         <motion.div initial="hidden" animate="show" variants={stagger} className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <motion.div variants={fadeUp}>
//             <StatCard label="Total Campaigns" value={stats.total} Icon={Users} tone="blue" />
//           </motion.div>
//           <motion.div variants={fadeUp}>
//             <StatCard label="Running" value={stats.running} Icon={CheckCircle2} tone="cyan" />
//           </motion.div>
//           <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1">
//             <StatCard label="Paused" value={stats.paused} Icon={XCircle} tone="blue" />
//           </motion.div>
//         </motion.div>

//         {/* Table */}
//         <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 sm:mt-6 overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/50">
//           <div className="min-w-full">
//             {/* Mobile Card View */}
//             <div className="block sm:hidden">
//               {loading ? (
//                 <div className="p-4 space-y-3">
//                   {Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} className="animate-pulse bg-slate-100 rounded-xl p-4 h-24" />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="divide-y divide-slate-200">
//                   {pageItems.map((camp, idx) => (
//                     <motion.div
//                       key={camp.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: idx * 0.05 }}
//                       className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
//                       onClick={() => openDetails(camp)}
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-semibold text-slate-900 truncate">{unknown(camp.name)}</h3>
//                           <p className="text-xs text-slate-500">ID: {camp.id}</p>
//                         </div>
//                         <StatusChip status={camp.status} />
//                       </div>
//                       <div className="flex items-center justify-between text-xs text-slate-600">
//                         <span>{fmtDT(camp.created_at)}</span>
//                         <span>{camp.counts?.total || 0} leads</span>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Desktop Table View */}
//             <table className="hidden sm:table min-w-full text-left">
//               <thead className="bg-slate-50/50 backdrop-blur">
//                 <tr>
//                   <Th sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>
//                     Name
//                   </Th>
//                   <Th sortKey="status" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>
//                     Status
//                   </Th>
//                   <th className="px-5 py-3 font-semibold">File</th>
//                   <th className="px-5 py-3 font-semibold">Assistant</th>
//                   <Th sortKey="calls_per_minute" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>
//                     Pacing
//                   </Th>
//                   <th className="px-5 py-3 font-semibold">Created</th>
//                   <th className="px-5 py-3 font-semibold">Leads</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <RowSkeleton rows={pageSize} cols={8} />
//                 ) : pageItems.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="px-5 py-4 text-center text-sm text-slate-500">
//                       No campaigns found.
//                     </td>
//                   </tr>
//                 ) : (
//                   pageItems.map((camp) => (
//                     <tr key={camp.id} className="group/row hover:bg-slate-50/50 transition-colors">
//                       <td className="px-5 py-3 font-medium text-slate-900">
//                         <button onClick={() => openDetails(camp)} className="group/cell flex items-center gap-2 text-left">
//                           {unknown(camp.name)}
//                         </button>
//                       </td>
//                       <td className="px-5 py-3">
//                         <StatusChip status={camp.status} />
//                       </td>
//                       <td className="px-5 py-3 text-slate-700">{camp.file_id}</td>
//                       <td className="px-5 py-3 text-slate-700">{camp.assistant_id}</td>
//                       <td className="px-5 py-3 text-slate-700">{camp.calls_per_minute}</td>
//                       <td className="px-5 py-3 text-slate-600">{fmtDT(camp.created_at)}</td>
//                       <td className="px-5 py-3 text-slate-700">{camp.counts?.total || 0}</td>
//                       <td className="px-5 py-3 text-right">
//                         <div className="invisible group-hover/row:visible flex items-center justify-end gap-2">
//                           <ButtonGhost onClick={() => downloadICS(camp.id, camp?.name)} icon={<Download className="h-4 w-4" />}>
//                             ICS
//                           </ButtonGhost>
//                           <ButtonGhost onClick={() => openDetails(camp)} icon={<Eye className="h-4 w-4" />}>
//                             Details
//                           </ButtonGhost>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         {/* Pagination */}
//         <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
//           <div className="text-xs sm:text-sm text-slate-600 order-2 sm:order-1">
//             Showing {totalItems === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
//           </div>
//           <div className="flex items-center gap-2 order-1 sm:order-2">
//             <PagerButton disabled={page <= 1} onClick={() => setPage(page - 1)}>
//               <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
//               <span className="hidden sm:inline">Previous</span>
//             </PagerButton>
//             <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-700">
//               {page} of {totalPages}
//             </span>
//             <PagerButton disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
//               <span className="hidden sm:inline">Next</span>
//               <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
//             </PagerButton>
//           </div>
//         </motion.div>
//       </main>

//       {/* Create Campaign Modal */}
//       <AnimatePresence>
//         {showCreate && (
//           <>
//             <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={handleCloseCreate} />
//             <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6" variants={modalVariants} initial="hidden" animate="show" exit="exit">
//               <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl xl:max-w-4xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
//                 {/* Modal Header */}
//                 <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
//                       <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-lg sm:text-xl font-bold text-slate-900">Create Campaign</h2>
//                       <p className="text-xs sm:text-sm text-slate-600">Step {step} of 6</p>
//                     </div>
//                   </div>
//                   <button onClick={handleCloseCreate} className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors" aria-label="Close">
//                     <X className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </button>
//                 </div>

//                 {/* Progress Bar (✅ fix shadowing) */}
//                 <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-50/50">
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     {[1, 2, 3, 4, 5, 6].map((i) => (
//                       <motion.div
//                         key={i}
//                         className={cx(
//                           "flex-1 h-1.5 sm:h-2 rounded-full transition-colors duration-300",
//                           i <= step ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-slate-200",
//                         )}
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: i <= step ? 1 : 0 }}
//                         transition={{ duration: 0.3, delay: i * 0.05 }}
//                       />
//                     ))}
//                   </div>
//                   <div className="flex justify-between mt-2 text-xs text-slate-500">
//                     <span className="hidden sm:inline">Details</span>
//                     <span className="hidden sm:inline">Files</span>
//                     <span className="hidden sm:inline">Leads</span>
//                     <span className="hidden sm:inline">Schedule</span>
//                     <span className="hidden sm:inline">Pacing</span>
//                     <span className="hidden sm:inline">Review</span>
//                   </div>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="flex-1 overflow-y-auto">
//                   <AnimatePresence mode="wait">
//                     <motion.div key={step} variants={stepTransition} initial="hidden" animate="show" exit="exit" className="p-4 sm:p-6 lg:p-8">
//                       {step === 1 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Campaign Details</h3>
//                             <p className="text-sm text-slate-600">Set up the basic information for your campaign.</p>
//                           </div>

//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                             <div>
//                               <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
//                               <input
//                                 value={createForm.name}
//                                 onChange={onCreateChange}
//                                 name="name"
//                                 placeholder="Enter campaign name"
//                                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition"
//                               />
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-slate-700 mb-2">Assistant</label>
//                               <select
//                                 value={createForm.assistant_id}
//                                 onChange={onCreateChange}
//                                 name="assistant_id"
//                                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition"
//                               >
//                                 <option value="">Select assistant</option>
//                                 {assistants.map((a) => (
//                                   <option key={a.id} value={a.id}>
//                                     {a.name}
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Description (optional)</label>
//                             <textarea
//                               value={createForm.description}
//                               onChange={onCreateChange}
//                               name="description"
//                               placeholder="Describe your campaign..."
//                               rows={3}
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition resize-none"
//                             />
//                           </div>
//                         </div>
//                       )}
//                       {step === 2 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select File</h3>
//                             <p className="text-sm text-slate-600">Choose the file containing the leads for your campaign.</p>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
//                             <select
//                               value={createForm.file_id}
//                               onChange={onCreateChange}
//                               name="file_id"
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition"
//                             >
//                               <option value="">Select file</option>
//                               {files.map((f) => (
//                                 <option key={f.id} value={f.id}>
//                                   {f.name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                         </div>
//                       )}
//                       {step === 3 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select Leads</h3>
//                             <p className="text-sm text-slate-600">Choose which leads to include in your campaign.</p>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Selection Mode</label>
//                             <select
//                               value={createForm.selection_mode}
//                               onChange={onCreateChange}
//                               name="selection_mode"
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition"
//                             >
//                               <option value="ALL">All Leads</option>
//                               <option value="ONLY">Only These Leads</option>
//                               <option value="SKIP">Skip These Leads</option>
//                             </select>
//                           </div>
//                           {createForm.selection_mode !== "ALL" && (
//                             <div className="space-y-3">
//                               <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//                                 <input
//                                   value={leadSearch}
//                                   onChange={(e) => setLeadSearch(e.target.value)}
//                                   placeholder="Search leads…"
//                                   className="w-full rounded-xl border border-slate-200 px-9 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition"
//                                 />
//                               </div>
//                               {leadsLoading ? (
//                                 <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
//                                   <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3" />
//                                   Loading leads…
//                                 </div>
//                               ) : (
//                                 <LeadMultiSelect
//                                   leads={leadsForFile}
//                                   mode={createForm.selection_mode}
//                                   search={leadSearch}
//                                   selectedIds={
//                                     createForm.selection_mode === "ONLY"
//                                       ? createForm.include_lead_ids
//                                       : createForm.exclude_lead_ids
//                                   }
//                                   onChange={(ids) => {
//                                     if (createForm.selection_mode === "ONLY") {
//                                       setCreateForm((f) => ({ ...f, include_lead_ids: ids }))
//                                     } else {
//                                       setCreateForm((f) => ({ ...f, exclude_lead_ids: ids }))
//                                     }
//                                   }}
//                                 />
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {step === 4 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Schedule</h3>
//                             <p className="text-sm text-slate-600">Set up the schedule for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <label className="block">
//                               <span className="mb-1 block text-sm font-semibold text-slate-700">Timezone (IANA)</span>
//                               <select
//                                 name="timezone"
//                                 value={createForm.timezone}
//                                 onChange={onCreateChange}
//                                 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40"
//                               >
//                                 {TIMEZONES.map((tz) => (
//                                   <option key={tz.value} value={tz.value}>
//                                     {tz.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             </label>
//                             <div>
//                               <div className="text-sm text-slate-700 mb-2">Days of week</div>
//                               <div className="flex flex-wrap gap-2">
//                                 {[0, 1, 2, 3, 4, 5, 6].map((d) => (
//                                   <button
//                                     key={d}
//                                     type="button"
//                                     onClick={() => toggleDOW(d)}
//                                     className={cx(
//                                       "px-3 py-1.5 rounded-xl border text-sm",
//                                       createForm.days_of_week.includes(d)
//                                         ? "border-blue-400 bg-blue-50 text-blue-700"
//                                         : "border-slate-200 bg-white text-slate-700",
//                                     )}
//                                   >
//                                     {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d]}
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <Field label="Daily start" name="daily_start" value={createForm.daily_start} onChange={onCreateChange} placeholder="HH:MM" />
//                               <Field label="Daily end" name="daily_end" value={createForm.daily_end} onChange={onCreateChange} placeholder="HH:MM" />
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <Field label="Start at (optional)" name="start_at" type="datetime-local" value={createForm.start_at} onChange={onCreateChange} />
//                               <Field label="End at (optional)" name="end_at" type="datetime-local" value={createForm.end_at} onChange={onCreateChange} />
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {step === 5 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Pacing</h3>
//                             <p className="text-sm text-slate-600">Set up the pacing for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <Field label="Calls per minute" name="calls_per_minute" value={createForm.calls_per_minute} onChange={onCreateChange} />
//                             <Field label="Parallel calls" name="parallel_calls" value={createForm.parallel_calls} onChange={onCreateChange} />
//                             <label className="inline-flex items-center gap-2">
//                               <input type="checkbox" name="retry_on_busy" checked={!!createForm.retry_on_busy} onChange={onCreateChange} />
//                               <span className="text-sm text-slate-800">Retry on busy / no-answer</span>
//                             </label>
//                             <Field label="Busy retry delay (min)" name="busy_retry_delay_minutes" value={createForm.busy_retry_delay_minutes} onChange={onCreateChange} />
//                             <Field label="Max attempts" name="max_attempts" value={createForm.max_attempts} onChange={onCreateChange} />
//                           </div>
//                         </div>
//                       )}
//                       {step === 6 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Review</h3>
//                             <p className="text-sm text-slate-600">Review your campaign details before creating.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <div>
//                               <div className="text-sm font-semibold text-slate-700">Name</div>
//                               <div className="text-sm text-slate-600">{createForm.name || "—"}</div>
//                             </div>
//                             <div>
//                               <div className="text-sm font-semibold text-slate-700">File</div>
//                               <div className="text-sm text-slate-600">
//                                 {files.find((f) => String(f.id) === String(createForm.file_id))?.name || "—"}
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-sm font-semibold text-slate-700">Assistant</div>
//                               <div className="text-sm text-slate-600">
//                                 {assistants.find((a) => String(a.id) === String(createForm.assistant_id))?.name || "—"}
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-sm font-semibold text-slate-700">Schedule</div>
//                               <div className="text-sm text-slate-600">
//                                 {dowLabel(createForm.days_of_week)} · {createForm.daily_start}–{createForm.daily_end} ({createForm.timezone})
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-sm font-semibold text-slate-700">Pacing</div>
//                               <div className="text-sm text-slate-600">
//                                 {createForm.calls_per_minute} CPM · {createForm.parallel_calls} parallel
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
//                   <div className="flex items-center gap-2 order-2 sm:order-1">
//                     {step > 1 && (
//                       <ButtonGhost onClick={handleBack} icon={<ChevronLeft className="h-4 w-4" />}>
//                         <span className="hidden sm:inline">Previous</span>
//                         <span className="sm:hidden">Back</span>
//                       </ButtonGhost>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2 order-1 sm:order-2">
//                     {step < 6 ? (
//                       <ButtonPrimary onClick={handleNext} icon={<ChevronRight className="h-4 w-4" />}>
//                         <span className="hidden sm:inline">Next Step</span>
//                         <span className="sm:hidden">Next</span>
//                       </ButtonPrimary>
//                     ) : (
//                       <ButtonPrimary onClick={createCampaign} disabled={creating} icon={creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}>
//                         {creating ? "Creating..." : "Create Campaign"}
//                       </ButtonPrimary>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Details Drawer */}
//       <AnimatePresence>
//         {showDetails && (
//           <>
//             <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={() => setShowDetails(false)} />
//             <motion.section
//               className="fixed inset-y-0 right-0 z-50 w-full sm:w-[90vw] md:w-[620px] lg:w-[880px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
//               initial={{ x: "100%" }}
//               animate={{ x: 0, transition: { type: "spring", stiffness: 260, damping: 28 } }}
//               exit={{ x: "100%", transition: { duration: 0.2 } }}
//               aria-label="Campaign details"
//             >
//               {/* Topbar */}
//               <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-3 sm:p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
//                   <button onClick={() => setShowDetails(false)} className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50 flex-shrink-0" aria-label="Close">
//                     <X className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </button>
//                   <div className="min-w-0 flex-1">
//                     <h3 className="text-base sm:text-lg font-bold leading-tight truncate">Campaign #{activeCampaign?.id}</h3>
//                     <p className="text-xs text-slate-600 truncate">{unknown(activeCampaign?.name)}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <ButtonGhost onClick={() => downloadICS(activeCampaign.id, activeCampaign?.name)} icon={<Download className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">ICS</span>
//                   </ButtonGhost>
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="flex-1 overflow-y-auto p-3 sm:p-6">
//                 {/* Info strip */}
//                 <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</div>
//                     <StatusChip status={details?.status || activeCampaign?.status} />
//                   </motion.div>
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Window</div>
//                     <div className="text-sm text-slate-800">
//                       <div className="truncate">{details ? dowLabel(details.days_of_week) : dowLabel(activeCampaign?.days_of_week)}</div>
//                       <div className="text-xs sm:text-sm">
//                         {(details?.daily_start || activeCampaign?.daily_start || "09:00") + "–" + (details?.daily_end || activeCampaign?.daily_end || "18:00")}
//                       </div>
//                       <div className="text-xs text-slate-500 truncate">{details?.timezone || activeCampaign?.timezone || "Local"}</div>
//                     </div>
//                   </motion.div>
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Counts</div>
//                     <div className="text-sm text-slate-800">
//                       <div>Total: {details?.totals?.total ?? activeCampaign?.counts?.total ?? "—"}</div>
//                       <div>Done: {details?.totals?.done ?? activeCampaign?.counts?.completed_or_failed ?? "—"}</div>
//                     </div>
//                   </motion.div>
//                 </motion.div>

//                 {/* Controls */}
//                 <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-2">
//                   {String(details?.status || activeCampaign?.status).toLowerCase() === "paused" ? (
//                     <ButtonPrimary onClick={() => doResume(activeCampaign.id)} icon={<Play className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">Resume</span>
//                     </ButtonPrimary>
//                   ) : (
//                     <ButtonPrimary onClick={() => doPause(activeCampaign.id)} icon={<Pause className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">Pause</span>
//                     </ButtonPrimary>
//                   )}
//                   <ButtonGhost onClick={() => doStop(activeCampaign.id)} icon={<StopSquare className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Stop</span>
//                   </ButtonGhost>
//                   <ButtonGhost onClick={() => doDelete(activeCampaign.id)} icon={<Trash2 className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Delete</span>
//                   </ButtonGhost>
//                 </motion.div>

//                 {/* Schedule + Retry forms */}
//                 <motion.div initial="hidden" animate="show" variants={stagger} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <motion.div variants={fadeUp}>
//                     <ScheduleForm details={details} onSubmit={(form) => updateSchedule(activeCampaign.id, form)} loading={detailsLoading} />
//                   </motion.div>
//                   <motion.div variants={fadeUp}>
//                     <RetryForm details={details} onSubmit={(form) => updateRetryPolicy(activeCampaign.id, form)} loading={detailsLoading} />
//                   </motion.div>
//                 </motion.div>

//                 {/* Run now */}
//                 <motion.div initial="hidden" animate="show" variants={fadeUp}>
//                   <RunNowCard onRun={(n) => doRunNow(activeCampaign.id, n)} />
//                 </motion.div>
//               </div>
//             </motion.section>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// /* ─────────────────────────── Subcomponents ─────────────────────────── */

// function RunNowCard({ onRun }) {
//   const [n, setN] = useState(5)
//   return (
//     <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div className="font-semibold text-slate-800 flex items-center gap-2">
//           <Rocket className="h-4 w-4" />
//           Run Now
//         </div>
//         <div className="flex items-center gap-2">
//           <input type="number" min={1} className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" value={n} onChange={(e) => setN(Number(e.target.value) || 5)} />
//           <ButtonPrimary onClick={() => onRun(n)} icon={<Play className="h-4 w-4" />}>
//             Trigger
//           </ButtonPrimary>
//         </div>
//       </div>
//       <p className="text-sm text-slate-600 mt-2">Immediately place a small batch of calls (ignores schedule window).</p>
//     </div>
//   )
// }

// function ScheduleForm({ details, onSubmit, loading }) {
//   const [form, setForm] = useState({
//     timezone: details?.timezone || "America/Los_Angeles",
//     days_of_week: details?.days_of_week || [0, 1, 2, 3, 4],
//     daily_start: details?.daily_start || "09:00",
//     daily_end: details?.daily_end || "18:00",
//     start_at: toInputDateTimeLocal(details?.start_at),
//     end_at: toInputDateTimeLocal(details?.end_at),
//   })
//   useEffect(() => {
//     setForm({
//       timezone: details?.timezone || "America/Los_Angeles",
//       days_of_week: details?.days_of_week || [0, 1, 2, 3, 4],
//       daily_start: details?.daily_start || "09:00",
//       daily_end: details?.daily_end || "18:00",
//       start_at: toInputDateTimeLocal(details?.start_at),
//       end_at: toInputDateTimeLocal(details?.end_at),
//     })
//   }, [details])

//   function onChange(e) {
//     const { name, value } = e.target
//     setForm((f) => ({ ...f, [name]: value }))
//   }
//   function toggleDOW(d) {
//     setForm((f) => {
//       const has = f.days_of_week.includes(d)
//       const days = has ? f.days_of_week.filter((x) => x !== d) : [...f.days_of_week, d]
//       days.sort((a, b) => a - b)
//       return { ...f, days_of_week: days }
//     })
//   }

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
//         <Settings className="h-4 w-4" />
//         Schedule
//       </div>
//       <div className="grid grid-cols-1 gap-3">
//         <label className="block">
//           <span className="mb-1 block text-sm font-semibold text-slate-700">Timezone (IANA)</span>
//           <select name="timezone" value={form.timezone} onChange={onChange} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
//             {TIMEZONES.map((tz) => (
//               <option key={tz.value} value={tz.value}>
//                 {tz.label}
//               </option>
//             ))}
//           </select>
//         </label>
//         <div>
//           <div className="text-sm text-slate-700 mb-2">Days of week</div>
//           <div className="flex flex-wrap gap-2">
//             {[0, 1, 2, 3, 4, 5, 6].map((d) => (
//               <button
//                 key={d}
//                 type="button"
//                 onClick={() => toggleDOW(d)}
//                 className={cx(
//                   "px-3 py-1.5 rounded-xl border text-sm",
//                   form.days_of_week.includes(d) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700",
//                 )}
//               >
//                 {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d]}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <Field label="Daily start" name="daily_start" value={form.daily_start} onChange={onChange} placeholder="HH:MM" />
//           <Field label="Daily end" name="daily_end" value={form.daily_end} onChange={onChange} placeholder="HH:MM" />
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <Field label="Start at (optional)" name="start_at" type="datetime-local" value={form.start_at} onChange={onChange} />
//           <Field label="End at (optional)" name="end_at" type="datetime-local" value={form.end_at} onChange={onChange} />
//         </div>
//         <div className="flex justify-end">
//           <ButtonPrimary onClick={() => onSubmit(form)} disabled={loading}>
//             Save Schedule
//           </ButtonPrimary>
//         </div>
//       </div>
//     </div>
//   )
// }

// function RetryForm({ details, onSubmit, loading }) {
//   const [form, setForm] = useState({
//     retry_on_busy: details?.retry_on_busy ?? true,
//     busy_retry_delay_minutes: details?.busy_retry_delay_minutes ?? 15,
//     max_attempts: details?.max_attempts ?? 3,
//   })
//   useEffect(() => {
//     setForm({
//       retry_on_busy: details?.retry_on_busy ?? true,
//       busy_retry_delay_minutes: details?.busy_retry_delay_minutes ?? 15,
//       max_attempts: details?.max_attempts ?? 3,
//     })
//   }, [details])

//   function onChange(e) {
//     const { name, value, type, checked } = e.target
//     setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
//   }

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
//         <Rocket className="h-4 w-4" />
//         Retry Policy
//       </div>
//       <div className="grid grid-cols-1 gap-3">
//         <label className="inline-flex items-center gap-2">
//           <input type="checkbox" name="retry_on_busy" checked={!!form.retry_on_busy} onChange={onChange} />
//           <span className="text-sm text-slate-800">Retry on busy / no-answer</span>
//         </label>
//         <Field label="Busy retry delay (min)" name="busy_retry_delay_minutes" value={form.busy_retry_delay_minutes} onChange={onChange} />
//         <Field label="Max attempts" name="max_attempts" value={form.max_attempts} onChange={onChange} />
//         <div className="flex justify-end">
//           <ButtonPrimary onClick={() => onSubmit(form)} disabled={loading}>
//             Save Retry Policy
//           </ButtonPrimary>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* Lead MultiSelect for ONLY/SKIP */
// function LeadMultiSelect({ leads, mode, search, selectedIds, onChange }) {
//   const [page, setPage] = useState(1)
//   const pageSize = 12

//   const filtered = useMemo(() => {
//     const q = (search || "").toLowerCase().trim()
//     if (!q) return leads
//     return leads.filter((l) => {
//       const name = `${l.first_name || ""} ${l.last_name || ""}`.toLowerCase()
//       return name.includes(q) || (l.email || "").toLowerCase().includes(q) || (l.mobile || "").toLowerCase().includes(q)
//     })
//   }, [leads, search])

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages)
//   }, [page, totalPages])

//   const start = (page - 1) * pageSize
//   const end = start + pageSize
//   const slice = filtered.slice(start, end)

//   function toggle(id) {
//     const has = selectedIds.includes(id)
//     if (has) onChange(selectedIds.filter((x) => x !== id))
//     else onChange([...selectedIds, id])
//   }

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white">
//       <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
//         {slice.length === 0 ? (
//           <div className="p-4 text-sm text-slate-600">No leads match your search.</div>
//         ) : (
//           slice.map((l) => {
//             const nameFull = `${l.first_name || ""} ${l.last_name || ""}`.trim() || "Unknown"
//             return (
//               <label key={l.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
//                 <input type="checkbox" checked={selectedIds.includes(l.id)} onChange={() => toggle(l.id)} />
//                 <div className="min-w-0">
//                   <div className="font-medium text-slate-900 text-sm">{nameFull}</div>
//                   <div className="text-xs text-slate-600 break-all">{(l.email || "—") + " · " + (l.mobile || "—")}</div>
//                 </div>
//                 {l.dnc ? <Chip tone="red">DNC</Chip> : <Chip tone="green">OK</Chip>}
//               </label>
//             )
//           })
//         )}
//       </div>
//       {filtered.length > pageSize && (
//         <div className="flex items-center justify-between p-2">
//           <span className="text-xs text-slate-600">Showing {Math.min(end, filtered.length)} of {filtered.length}</span>
//           <div className="flex items-center gap-2">
//             <PagerButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
//               <ChevronLeft className="h-3.5 w-3.5" /> Prev
//             </PagerButton>
//             <span className="text-xs text-slate-700">{page}/{totalPages}</span>
//             <PagerButton disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
//               Next <ChevronRight className="h-3.5 w-3.5" />
//             </PagerButton>
//           </div>
//         </div>
//       )}
//       <div className="p-3 border-t border-slate-200 text-xs text-slate-700">
//         Mode: <strong>{mode}</strong> · Selected: <strong>{selectedIds.length}</strong>
//       </div>
//     </div>
//   )
// }

// /* Helpers / small UI bits */
// function dowLabel(days) {
//   const map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
//   const set = new Set(Array.isArray(days) ? days : [])
//   if (set.size === 5 && [0, 1, 2, 3, 4].every((d) => set.has(d))) return "Mon–Fri"
//   if (set.size === 7) return "Every day"
//   return Array.from(set)
//     .sort((a, b) => a - b)
//     .map((d) => map[d] || "?")
//     .join(", ")
// }

// function setSort(nextKey, setKey, setDir) {
//   setKey((prevKey) => {
//     if (prevKey === nextKey) {
//       setDir((d) => (d === "asc" ? "desc" : "asc"))
//       return prevKey
//     } else {
//       setDir(nextKey === "created_at" ? "desc" : "asc")
//       return nextKey
//     }
//   })
// }

// function ButtonPrimary({ children, onClick, disabled, icon, type = "button" }) {
//   return (
//     <motion.button
//       whileHover={!disabled ? { scale: 1.02 } : undefined}
//       whileTap={!disabled ? { scale: 0.98 } : undefined}
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-semibold text-white transition-all duration-200",
//         "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700",
//         "shadow-[0_8px_24px_-12px_rgba(37,99,235,0.55)] hover:shadow-[0_12px_32px_-12px_rgba(37,99,235,0.65)]",
//         "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
//       )}
//     >
//       {icon}
//       <span className="whitespace-nowrap">{children}</span>
//     </motion.button>
//   )
// }

// function ButtonGhost({ children, onClick, icon, type = "button", disabled }) {
//   return (
//     <motion.button
//       whileHover={!disabled ? { scale: 1.02 } : undefined}
//       whileTap={!disabled ? { scale: 0.98 } : undefined}
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-medium text-slate-800 ring-1 ring-white/70 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm",
//         disabled && "opacity-60 cursor-not-allowed",
//       )}
//     >
//       {icon}
//       <span className="whitespace-nowrap">{children}</span>
//     </motion.button>
//   )
// }

// function PagerButton({ children, disabled, onClick }) {
//   return (
//     <motion.button
//       whileHover={!disabled ? { scale: 1.02 } : undefined}
//       whileTap={!disabled ? { scale: 0.98 } : undefined}
//       disabled={disabled}
//       onClick={onClick}
//       className={cx(
//         "inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl border px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200",
//         disabled ? "cursor-not-allowed border-slate-200 text-slate-400 bg-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:shadow-sm",
//       )}
//     >
//       {children}
//     </motion.button>
//   )
// }

// function Th({ children, sortKey, sortBy, sortDir, onSort }) {
//   const active = sortBy === sortKey
//   return (
//     <th className={cx("px-5 py-3 font-semibold select-none cursor-pointer", active && "text-slate-900")} onClick={() => onSort(sortKey)} title="Sort">
//       <span className="inline-flex items-center gap-1">
//         {children}
//         <span className={cx("text-xs", active ? "opacity-100" : "opacity-20")}>{active ? (sortDir === "asc" ? "▲" : "▼") : "▲"}</span>
//       </span>
//     </th>
//   )
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
//   )
// }
// function Field({ label, name, value, onChange, type = "text", placeholder, className }) {
//   return (
//     <label className={cx("block", className)}>
//       <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
//       <input
//         type={type}
//         name={name}
//         value={value ?? ""}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300"
//       />
//     </label>
//   )
// }








// "use client"

// import { useEffect, useMemo, useRef, useState } from "react"
// import { toast } from "react-toastify"
// import {
//   Search,
//   RefreshCw,
//   X,
//   Loader2,
//   Users,
//   CheckCircle2,
//   XCircle,
//   Plus,
//   Play,
//   Pause,
//   Square as StopSquare,
//   Trash2,
//   Eye,
//   Download,
//   Settings,
//   Rocket,
//   ChevronLeft,
//   ChevronRight,
//   Check,
// } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// /* ──────────────────────────────────────────────────────────────────────────
//  * Config (unchanged endpoints; added REFRESH_LEADS)
//  * ────────────────────────────────────────────────────────────────────────── */
// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000"
// const API_PREFIX = import.meta.env?.VITE_API_PREFIX || "/api"

// const EP = {
//   LIST: `${API_URL}${API_PREFIX}/campaigns/campaigns`,
//   CREATE: `${API_URL}${API_PREFIX}/campaigns/campaigns`,
//   DETAIL: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}`,
//   SCHEDULE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/schedule`,
//   RETRY: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/retry-policy`,
//   PAUSE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/pause`,
//   RESUME: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/resume`,
//   STOP: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/stop`,
//   RUN_NOW: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/run-now`,
//   ICS: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/calendar.ics`,
//   DELETE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}`,
//   // NEW (backend route already exists; just wiring it up in UI):
//   REFRESH_LEADS: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/refresh-leads`,
// }

// // Resource endpoints
// const RESOURCES = {
//   FILES: `${API_URL}${API_PREFIX}/files`,
//   ASSISTANTS: `${API_URL}${API_PREFIX}/get-assistants`,
//   LEADS: (fileId) => `${API_URL}${API_PREFIX}/leads${fileId ? `?file_id=${fileId}` : ""}`,
// }

// /* Utilities */
// function cx(...arr) { return arr.filter(Boolean).join(" ") }
// const unknown = (v) => {
//   if (v === undefined || v === null) return "Unknown"
//   const s = String(v).trim()
//   return s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined" ? "Unknown" : s
// }
// function useDebounce(value, delay = 250) {
//   const [debounced, setDebounced] = useState(value)
//   useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t) }, [value, delay])
//   return debounced
// }
// function fmtDT(d) {
//   try { const dt = new Date(d); if (isNaN(dt.getTime())) return "Unknown"; return dt.toLocaleString() } catch { return "Unknown" }
// }
// function toInputDateTimeLocal(value) {
//   if (!value) return ""
//   const d = new Date(value)
//   if (isNaN(d.getTime())) return ""
//   const yyyy = d.getFullYear()
//   const mm = String(d.getMonth() + 1).padStart(2, "0")
//   const dd = String(d.getDate()).padStart(2, "0")
//   const hh = String(d.getHours()).padStart(2, "0")
//   const mi = String(d.getMinutes()).padStart(2, "0")
//   return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
// }
// function fromInputDateTimeLocal(s) { if (!s) return null; const d = new Date(s); return isNaN(d.getTime()) ? null : d.toISOString() }

// /* Motion variants */
// const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } } }
// const stagger = { show: { transition: { staggerChildren: 0.05 } } }
// const overlay = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.18 } }, exit: { opacity: 0, transition: { duration: 0.12 } } }
// const slideInFromBottom = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.4 } }, exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } } }
// const modalVariants = { hidden: { opacity: 0, scale: 0.8, y: 50 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.5 } }, exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } } }
// const stepTransition = { hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } }, exit: { opacity: 0, x: -20, transition: { duration: 0.2 } } }

// /* Pill chip */
// function Chip({ children, tone = "slate" }) {
//   const tones = {
//     slate: "bg-slate-100 text-slate-700 ring-slate-200",
//     green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
//     red: "bg-rose-100 text-rose-700 ring-rose-200",
//     blue: "bg-blue-100 text-blue-700 ring-blue-200",
//     orange: "bg-orange-100 text-orange-700 ring-orange-200",
//     purple: "bg-purple-100 text-purple-700 ring-purple-200",
//   }
//   return (
//     <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
//       className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", tones[tone] || tones.slate)}>
//       {children}
//     </motion.span>
//   )
// }

// /* Stat card */
// function StatCard({ label, value, Icon, tone = "blue" }) {
//   const ring = tone === "blue" ? "ring-blue-200/60" : tone === "cyan" ? "ring-cyan-200/60" : "ring-slate-200/60"
//   const bg = tone === "blue" ? "from-blue-600 to-cyan-500" : tone === "cyan" ? "from-cyan-500 to-blue-600" : "from-slate-500 to-slate-700"
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
//   )
// }

// /* Status chip */
// function StatusChip({ status }) {
//   const s = String(status || "").toLowerCase()
//   if (s === "scheduled") return <Chip tone="blue">Scheduled</Chip>
//   if (s === "running") return <Chip tone="green">Running</Chip>
//   if (s === "paused") return <Chip tone="orange">Paused</Chip>
//   if (s === "stopped") return <Chip tone="red">Stopped</Chip>
//   if (s === "completed") return <Chip tone="purple">Completed</Chip>
//   if (s === "draft") return <Chip tone="slate">Draft</Chip>
//   return <Chip tone="slate">{unknown(status)}</Chip>
// }

// /* Timezones */
// const TIMEZONES = [
//   { value: "UTC", label: "UTC" },
//   { value: "America/New_York", label: "America/New_York" },
//   { value: "America/Chicago", label: "America/Chicago" },
//   { value: "America/Denver", label: "America/Denver" },
//   { value: "America/Los_Angeles", label: "America/Los_Angeles" },
//   { value: "America/Phoenix", label: "America/Phoenix" },
//   { value: "Europe/London", label: "Europe/London" },
//   { value: "Europe/Berlin", label: "Europe/Berlin" },
//   { value: "Europe/Paris", label: "Europe/Paris" },
//   { value: "Asia/Karachi", label: "Asia/Karachi" },
//   { value: "Asia/Kolkata", label: "Asia/Kolkata" },
//   { value: "Asia/Singapore", label: "Asia/Singapore" },
//   { value: "Asia/Tokyo", label: "Asia/Tokyo" },
//   { value: "Asia/Dubai", label: "Asia/Dubai" },
//   { value: "Australia/Sydney", label: "Australia/Sydney" },
// ]

// /* ──────────────────────────────────────────────────────────────────────────
//  * NEW: Progress bars
//  * ────────────────────────────────────────────────────────────────────────── */
// function percent(done, total) {
//   const d = Number(done) || 0
//   const t = Number(total) || 0
//   if (t <= 0) return 0
//   const v = Math.round((d / t) * 100)
//   return Math.min(100, Math.max(0, v))
// }

// function LivePulse({ active = false }) {
//   if (!active) return null
//   return (
//     <span className="relative inline-flex h-2.5 w-2.5">
//       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
//       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
//     </span>
//   )
// }

// function RowProgress({ done, total, status }) {
//   const p = percent(done, total)
//   const active = ["scheduled", "running"].includes(String(status || "").toLowerCase())
//   return (
//     <div className="flex items-center gap-2 min-w-[140px]">
//       <div className="relative h-2 w-36 rounded-full bg-slate-200 overflow-hidden">
//         <motion.div
//           className={cx("h-full bg-gradient-to-r from-blue-500 to-cyan-500", active && "shadow-[0_0_0_2px_rgba(59,130,246,0.15)]")}
//           initial={{ width: 0 }}
//           animate={{ width: `${p}%` }}
//           transition={{ type: "spring", stiffness: 160, damping: 20 }}
//         />
//       </div>
//       <div className="text-xs font-medium text-slate-700 tabular-nums">{(Number(done) || 0)}/{(Number(total) || 0)}</div>
//       <LivePulse active={active} />
//     </div>
//   )
// }

// function SegmentedProgress({ totals }) {
//   const total = totals?.total || 0
//   const done = totals?.done || 0
//   const calling = totals?.calling || 0
//   const retry = totals?.retry || 0
//   const pending = totals?.pending || 0

//   const seg = (n) => (total > 0 ? `${(n / total) * 100}%` : "0%")

//   return (
//     <div className="w-full">
//       <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden ring-1 ring-white/60">
//         <motion.div className="h-full bg-emerald-500" style={{ width: seg(done) }} initial={{ width: 0 }} animate={{ width: seg(done) }} />
//         <motion.div className="h-full bg-indigo-500 -mt-3" style={{ width: seg(calling) }} initial={{ width: 0 }} animate={{ width: seg(calling) }} />
//         <motion.div className="h-full bg-amber-500 -mt-3" style={{ width: seg(retry) }} initial={{ width: 0 }} animate={{ width: seg(retry) }} />
//         <motion.div className="h-full bg-slate-400 -mt-3" style={{ width: seg(pending) }} initial={{ width: 0 }} animate={{ width: seg(pending) }} />
//       </div>
//       <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-700">
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" />Done {done}</span>
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-indigo-500" />Calling {calling}</span>
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500" />Retry {retry}</span>
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-400" />Pending {pending}</span>
//         <span className="ml-auto font-semibold tabular-nums">{percent(done, total)}%</span>
//       </div>
//     </div>
//   )
// }

// /* ──────────────────────────────────────────────────────────────────────────
//  * Page: Campaigns
//  * ────────────────────────────────────────────────────────────────────────── */
// export default function CampaignsPage() {
//   const token = useRef(localStorage.getItem("token") || null)

//   const [campaigns, setCampaigns] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)

//   const [files, setFiles] = useState([])
//   const [assistants, setAssistants] = useState([])
//   const [leadsForFile, setLeadsForFile] = useState([])
//   const [leadsLoading, setLeadsLoading] = useState(false)

//   const [query, setQuery] = useState("")
//   const debouncedQuery = useDebounce(query, 250)

//   // Sorting & paging
//   const [sortBy, setSortBy] = useState("created_at")
//   const [sortDir, setSortDir] = useState("desc")
//   const [page, setPage] = useState(1)
//   const [pageSize, setPageSize] = useState(10)

//   // Create modal
//   const [showCreate, setShowCreate] = useState(false)
//   const [step, setStep] = useState(1)
//   const [creating, setCreating] = useState(false)
//   const [createForm, setCreateForm] = useState({
//     name: "",
//     file_id: "",
//     assistant_id: "",
//     selection_mode: "ALL",
//     include_lead_ids: [],
//     exclude_lead_ids: [],
//     timezone: "America/Los_Angeles",
//     days_of_week: [0, 1, 2, 3, 4],
//     daily_start: "09:00",
//     daily_end: "18:00",
//     start_at: "",
//     end_at: "",
//     calls_per_minute: 10,
//     parallel_calls: 2,
//     retry_on_busy: true,
//     busy_retry_delay_minutes: 15,
//     max_attempts: 3,
//     description: "",
//   })
//   const [leadSearch, setLeadSearch] = useState("")

//   // Details drawer
//   const [showDetails, setShowDetails] = useState(false)
//   const [activeCampaign, setActiveCampaign] = useState(null)
//   const [detailsLoading, setDetailsLoading] = useState(false)
//   const [details, setDetails] = useState(null)

//   // Auto-poll while details open
//   useEffect(() => {
//     if (!showDetails || !activeCampaign?.id) return
//     const timer = setInterval(() => {
//       loadDetails(activeCampaign.id)
//       fetchCampaigns()
//     }, 5000)
//     return () => clearInterval(timer)
//     // eslint-disable-next-line
//   }, [showDetails, activeCampaign?.id])

//   /* Fetch on mount */
//   useEffect(() => {
//     if (!token.current) {
//       setLoading(false)
//       toast.error("No auth token found. Please log in.")
//       return
//     }
//     fetchAll()
//     // eslint-disable-next-line
//   }, [])

//   async function fetchAll() {
//     setLoading(true)
//     try { await Promise.all([fetchCampaigns(), fetchFiles(), fetchAssistants()]) }
//     finally { setLoading(false) }
//   }

//   async function authedFetch(url, options = {}) {
//     if (!token.current) {
//       toast.error("No auth token found. Please log in.")
//       throw new Error("No token")
//     }
//     const res = await fetch(url, {
//       ...options,
//       headers: { ...(options.headers || {}), Authorization: `Bearer ${token.current}` },
//     })
//     return res
//   }

//   async function fetchCampaigns() {
//     try {
//       const res = await authedFetch(EP.LIST)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       setCampaigns(Array.isArray(data) ? data : [])
//     } catch (e) {
//       console.error(e)
//       toast.error("Failed to fetch campaigns")
//       setCampaigns([])
//     }
//   }

//   async function fetchFiles() {
//     try {
//       const res = await authedFetch(RESOURCES.FILES)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       setFiles(Array.isArray(data) ? data : data?.items || [])
//     } catch (e) {
//       console.warn("Files fetch failed:", e.message)
//       setFiles([])
//     }
//   }

//   async function fetchAssistants() {
//     try {
//       const res = await authedFetch(RESOURCES.ASSISTANTS)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       const arr = (Array.isArray(data) && data) || data?.items || data?.assistants || data?.data || []
//       const normalized = arr.filter((a) => a && a.id !== undefined && a.id !== null)
//       setAssistants(normalized)
//     } catch (e) {
//       console.warn("Assistants fetch failed:", e.message)
//       setAssistants([])
//     }
//   }

//   async function loadLeadsForFile(fileId) {
//     if (!fileId) { setLeadsForFile([]); return }
//     try {
//       setLeadsLoading(true)
//       const res = await authedFetch(RESOURCES.LEADS(fileId))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json = await res.json()
//       const list = Array.isArray(json) ? json : json?.leads || json?.items || []
//       setLeadsForFile(list)
//     } catch (e) {
//       console.warn("Leads fetch failed:", e.message)
//       setLeadsForFile([])
//     } finally {
//       setLeadsLoading(false)
//     }
//   }

//   async function refreshAll() {
//     setRefreshing(true)
//     try { await fetchCampaigns() }
//     finally { setRefreshing(false) }
//   }

//   /* Derived list */
//   const filtered = useMemo(() => {
//     const q = debouncedQuery.trim().toLowerCase()
//     const list = campaigns.filter((c) => {
//       if (!q) return true
//       const fields = [(c.name || "").toLowerCase(), (c.status || "").toLowerCase(), String(c.id || ""), String(c.file_id || ""), String(c.assistant_id || "")]
//       return fields.some((f) => f.includes(q))
//     })
//     const dir = sortDir === "asc" ? 1 : -1
//     list.sort((a, b) => {
//       let va, vb
//       switch (sortBy) {
//         case "name": va = (a.name || "").toLowerCase(); vb = (b.name || "").toLowerCase(); break
//         case "status": va = (a.status || "").toLowerCase(); vb = (b.status || "").toLowerCase(); break
//         case "calls_per_minute": va = a.calls_per_minute || 0; vb = b.calls_per_minute || 0; break
//         case "created_at":
//         default: va = new Date(a.created_at || 0).getTime(); vb = new Date(b.created_at || 0).getTime()
//       }
//       if (va < vb) return -1 * dir
//       if (va > vb) return 1 * dir
//       return 0
//     })
//     return list
//   }, [campaigns, debouncedQuery, sortBy, sortDir])

//   const totalItems = filtered.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])
//   const start = (page - 1) * pageSize
//   const end = start + pageSize
//   const pageItems = filtered.slice(start, end)

//   // Stats
//   const stats = useMemo(() => {
//     const total = filtered.length
//     const running = filtered.filter((c) => (c.status || "").toLowerCase() === "running").length
//     const paused = filtered.filter((c) => (c.status || "").toLowerCase() === "paused").length
//     return { total, running, paused }
//   }, [filtered])

//   /* Create: behavior */
//   function onCreateChange(e) {
//     const { name, value, type, checked } = e.target
//     setCreateForm((f) => {
//       const next = { ...f, [name]: type === "checkbox" ? checked : value }
//       if (name === "file_id") {
//         const fileIdNum = Number(value) || ""
//         if (fileIdNum) loadLeadsForFile(fileIdNum)
//         else setLeadsForFile([])
//         next.include_lead_ids = []
//         next.exclude_lead_ids = []
//       }
//       if (name === "selection_mode") {
//         next.include_lead_ids = []
//         next.exclude_lead_ids = []
//       }
//       return next
//     })
//   }
//   function toggleDOW(d) {
//     setCreateForm((f) => {
//       const has = f.days_of_week.includes(d)
//       const days = has ? f.days_of_week.filter((x) => x !== d) : [...f.days_of_week, d]
//       days.sort((a, b) => a - b)
//       return { ...f, days_of_week: days }
//     })
//   }

//   async function createCampaign() {
//     if (!createForm.name || !createForm.file_id || !createForm.assistant_id) {
//       toast.error("Name, File and Assistant are required.")
//       return
//     }
//     if (createForm.selection_mode !== "ALL" && createForm.file_id && leadsForFile.length === 0) {
//       toast.error("No leads available for the selected file.")
//       return
//     }

//     const payload = {
//       name: String(createForm.name).trim(),
//       file_id: Number(createForm.file_id),
//       assistant_id: Number(createForm.assistant_id),
//       selection_mode: createForm.selection_mode,
//       include_lead_ids: createForm.selection_mode === "ONLY" && createForm.include_lead_ids?.length ? createForm.include_lead_ids : null,
//       exclude_lead_ids: createForm.selection_mode === "SKIP" && createForm.exclude_lead_ids?.length ? createForm.exclude_lead_ids : null,
//       timezone: createForm.timezone || "America/Los_Angeles",
//       days_of_week: createForm.days_of_week,
//       daily_start: createForm.daily_start || "09:00",
//       daily_end: createForm.daily_end || "18:00",
//       start_at: fromInputDateTimeLocal(createForm.start_at),
//       end_at: fromInputDateTimeLocal(createForm.end_at),
//       calls_per_minute: Number(createForm.calls_per_minute) || 10,
//       parallel_calls: Number(createForm.parallel_calls) || 2,
//       retry_on_busy: !!createForm.retry_on_busy,
//       busy_retry_delay_minutes: Number(createForm.busy_retry_delay_minutes) || 15,
//       max_attempts: Number(createForm.max_attempts) || 3,
//     }

//     try {
//       setCreating(true)
//       const res = await authedFetch(EP.CREATE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Campaign created.")
//       setShowCreate(false)
//       setStep(1)
//       setCreateForm((f) => ({ ...f, name: "", include_lead_ids: [], exclude_lead_ids: [] }))
//       await fetchCampaigns()
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Create failed")
//     } finally {
//       setCreating(false)
//     }
//   }

//   /* Details */
//   async function openDetails(c) {
//     setActiveCampaign(c)
//     setShowDetails(true)
//     await loadDetails(c.id)
//   }
//   async function loadDetails(id) {
//     if (!id) return
//     try {
//       setDetailsLoading(true)
//       const res = await authedFetch(EP.DETAIL(id))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json = await res.json()
//       setDetails(json)
//     } catch (e) {
//       console.error(e)
//       toast.error("Failed to load campaign details")
//       setDetails(null)
//     } finally {
//       setDetailsLoading(false)
//     }
//   }

//   /* Controls */
//   async function postAction(urlBuilder, id, okMsg) {
//     try {
//       const res = await authedFetch(urlBuilder(id), { method: "POST" })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || okMsg)
//       await fetchCampaigns()
//       if (activeCampaign && activeCampaign.id === id) await loadDetails(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Action failed")
//     }
//   }
//   const doPause = (id) => postAction(EP.PAUSE, id, "Paused")
//   const doResume = (id) => postAction(EP.RESUME, id, "Resumed")
//   const doStop = (id) => postAction(EP.STOP, id, "Stopped")
//   const doRefreshLeads = (id) => postAction(EP.REFRESH_LEADS, id, "Leads synced")

//   async function doDelete(id) {
//     if (!confirm("Delete this campaign and its progress rows?")) return
//     try {
//       const res = await authedFetch(EP.DELETE(id), { method: "DELETE" })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Deleted")
//       setShowDetails(false)
//       setActiveCampaign(null)
//       await fetchCampaigns()
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Delete failed")
//     }
//   }

//   async function doRunNow(id, batchSize) {
//     try {
//       const res = await authedFetch(EP.RUN_NOW(id), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ batch_size: Number(batchSize) || 5 }),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Triggered.")
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Run-now failed")
//     }
//   }

//   async function updateSchedule(id, form) {
//     const payload = {
//       timezone: form.timezone || undefined,
//       days_of_week: form.days_of_week?.length ? form.days_of_week : undefined,
//       daily_start: form.daily_start || undefined,
//       daily_end: form.daily_end || undefined,
//       start_at: fromInputDateTimeLocal(form.start_at),
//       end_at: fromInputDateTimeLocal(form.end_at),
//     }
//     try {
//       const res = await authedFetch(EP.SCHEDULE(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Schedule updated")
//       await fetchCampaigns()
//       await loadDetails(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Update failed")
//     }
//   }

//   async function updateRetryPolicy(id, form) {
//     const payload = {
//       retry_on_busy: !!form.retry_on_busy,
//       busy_retry_delay_minutes: Number(form.busy_retry_delay_minutes) || 15,
//       max_attempts: Number(form.max_attempts) || 3,
//     }
//     try {
//       const res = await authedFetch(EP.RETRY(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Retry policy updated")
//       await loadDetails(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Update failed")
//     }
//   }

//   async function downloadICS(id, name = "campaign") {
//     try {
//       const res = await authedFetch(EP.ICS(id))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const blob = await res.blob()
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `${name || "campaign"}.ics`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       URL.revokeObjectURL(url)
//     } catch (e) {
//       console.error(e)
//       toast.error("ICS download failed")
//     }
//   }

//   const handleOpenCreate = () => { setShowCreate(true); setStep(1) }
//   const handleCloseCreate = () => {
//     setShowCreate(false); setStep(1)
//     setCreateForm((f) => ({ ...f, name: "", include_lead_ids: [], exclude_lead_ids: [] }))
//   }
//   const handleNext = () => { setStep((s) => Math.min(6, s + 1)) }
//   const handleBack = () => { setStep((s) => Math.max(1, s - 1)) }

//   /* Render */
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//         {/* Header */}
//         <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Campaigns</h1>
//             <p className="mt-1 text-sm sm:text-base text-slate-600">Manage your calling campaigns and schedules.</p>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-3">
//             <ButtonGhost onClick={refreshAll} disabled={refreshing} icon={refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}>
//               <span className="hidden sm:inline">Refresh</span>
//             </ButtonGhost>
//             <ButtonPrimary onClick={handleOpenCreate} icon={<Plus className="h-4 w-4" />}>
//               <span className="hidden sm:inline">Create Campaign</span>
//               <span className="sm:hidden">Create</span>
//             </ButtonPrimary>
//           </div>
//         </motion.div>

//         {/* Filters */}
//         <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="relative sm:col-span-1 lg:col-span-2">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//             <input
//               value={query}
//               onChange={(e) => { setQuery(e.target.value); setPage(1) }}
//               placeholder="Search name, status, IDs…"
//               className="w-full rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/60 transition focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300"
//               aria-label="Search campaigns"
//             />
//           </div>

//           <div className="flex items-center justify-between sm:justify-end gap-3">
//             <div className="text-xs sm:text-sm text-slate-600 hidden sm:block">
//               Total: <span className="font-semibold text-slate-900">{totalItems}</span>
//             </div>
//             <select
//               value={pageSize}
//               onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
//               className="rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none ring-1 ring-white/60 focus:ring-2 focus:ring-cyan-400/40"
//               aria-label="Rows per page"
//             >
//               {[10, 20, 40, 80].map((n) => (<option key={n} value={n}>{n} / page</option>))}
//             </select>
//           </div>
//         </motion.div>

//         {/* Stats */}
//         <motion.div initial="hidden" animate="show" variants={stagger} className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <motion.div variants={fadeUp}><StatCard label="Total Campaigns" value={stats.total} Icon={Users} tone="blue" /></motion.div>
//           <motion.div variants={fadeUp}><StatCard label="Running" value={stats.running} Icon={CheckCircle2} tone="cyan" /></motion.div>
//           <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1"><StatCard label="Paused" value={stats.paused} Icon={XCircle} tone="blue" /></motion.div>
//         </motion.div>

//         {/* Table */}
//         <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 sm:mt-6 overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/50">
//           <div className="min-w-full">
//             {/* Mobile Cards */}
//             <div className="block sm:hidden">
//               {loading ? (
//                 <div className="p-4 space-y-3">
//                   {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="animate-pulse bg-slate-100 rounded-xl p-4 h-24" />))}
//                 </div>
//               ) : (
//                 <div className="divide-y divide-slate-200">
//                   {pageItems.map((camp, idx) => {
//                     const total = camp.counts?.total || 0
//                     const done = camp.counts?.completed_or_failed || 0
//                     return (
//                       <motion.div key={camp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
//                         className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openDetails(camp)}>
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-slate-900 truncate">{unknown(camp.name)}</h3>
//                             <p className="text-xs text-slate-500">ID: {camp.id}</p>
//                           </div>
//                           <StatusChip status={camp.status} />
//                         </div>
//                         <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
//                           <span>{fmtDT(camp.created_at)}</span>
//                           <span>{total} leads</span>
//                         </div>
//                         <RowProgress done={done} total={total} status={camp.status} />
//                       </motion.div>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Desktop Table */}
//             <table className="hidden sm:table min-w-full text-left">
//               <thead className="bg-slate-50/50 backdrop-blur">
//                 <tr>
//                   <Th sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Name</Th>
//                   <Th sortKey="status" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Status</Th>
//                   <th className="px-5 py-3 font-semibold">File</th>
//                   <th className="px-5 py-3 font-semibold">Assistant</th>
//                   <Th sortKey="calls_per_minute" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Pacing</Th>
//                   <th className="px-5 py-3 font-semibold">Created</th>
//                   <th className="px-5 py-3 font-semibold">Leads</th>
//                   <th className="px-5 py-3 font-semibold">Progress</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <RowSkeleton rows={pageSize} cols={9} />
//                 ) : pageItems.length === 0 ? (
//                   <tr><td colSpan={9} className="px-5 py-4 text-center text-sm text-slate-500">No campaigns found.</td></tr>
//                 ) : (
//                   pageItems.map((camp) => {
//                     const total = camp.counts?.total || 0
//                     const done = camp.counts?.completed_or_failed || 0
//                     return (
//                       <tr key={camp.id} className="group/row hover:bg-slate-50/50 transition-colors">
//                         <td className="px-5 py-3 font-medium text-slate-900">
//                           <button onClick={() => openDetails(camp)} className="group/cell flex items-center gap-2 text-left">{unknown(camp.name)}</button>
//                         </td>
//                         <td className="px-5 py-3"><StatusChip status={camp.status} /></td>
//                         <td className="px-5 py-3 text-slate-700">{camp.file_id}</td>
//                         <td className="px-5 py-3 text-slate-700">{camp.assistant_id}</td>
//                         <td className="px-5 py-3 text-slate-700">{camp.calls_per_minute}</td>
//                         <td className="px-5 py-3 text-slate-600">{fmtDT(camp.created_at)}</td>
//                         <td className="px-5 py-3 text-slate-700">{total}</td>
//                         <td className="px-5 py-3"><RowProgress done={done} total={total} status={camp.status} /></td>
//                         <td className="px-5 py-3 text-right">
//                           <div className="invisible group-hover/row:visible flex items-center justify-end gap-2">
//                             <ButtonGhost onClick={() => downloadICS(camp.id, camp?.name)} icon={<Download className="h-4 w-4" />}>ICS</ButtonGhost>
//                             <ButtonGhost onClick={() => openDetails(camp)} icon={<Eye className="h-4 w-4" />}>Details</ButtonGhost>
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         {/* Pagination */}
//         <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
//           <div className="text-xs sm:text-sm text-slate-600 order-2 sm:order-1">
//             Showing {totalItems === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
//           </div>
//           <div className="flex items-center gap-2 order-1 sm:order-2">
//             <PagerButton disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" /><span className="hidden sm:inline">Previous</span></PagerButton>
//             <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-700">{page} of {totalPages}</span>
//             <PagerButton disabled={page >= totalPages} onClick={() => setPage(page + 1)}><span className="hidden sm:inline">Next</span><ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /></PagerButton>
//           </div>
//         </motion.div>
//       </main>

//       {/* Create Campaign Modal (unchanged except cosmetics) */}
//       <AnimatePresence>
//         {showCreate && (
//           <>
//             <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={handleCloseCreate} />
//             <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6" variants={modalVariants} initial="hidden" animate="show" exit="exit">
//               <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl xl:max-w-4xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
//                 {/* Modal Header */}
//                 <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" /></div>
//                     <div>
//                       <h2 className="text-lg sm:text-xl font-bold text-slate-900">Create Campaign</h2>
//                       <p className="text-xs sm:text-sm text-slate-600">Step {step} of 6</p>
//                     </div>
//                   </div>
//                   <button onClick={handleCloseCreate} className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors" aria-label="Close"><X className="h-4 w-4 sm:h-5 sm:w-5" /></button>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-50/50">
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     {[1, 2, 3, 4, 5, 6].map((i) => (
//                       <motion.div key={i}
//                         className={cx("flex-1 h-1.5 sm:h-2 rounded-full transition-colors duration-300", i <= step ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-slate-200")}
//                         initial={{ scaleX: 0 }} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} />
//                     ))}
//                   </div>
//                   <div className="flex justify-between mt-2 text-xs text-slate-500">
//                     <span className="hidden sm:inline">Details</span>
//                     <span className="hidden sm:inline">Files</span>
//                     <span className="hidden sm:inline">Leads</span>
//                     <span className="hidden sm:inline">Schedule</span>
//                     <span className="hidden sm:inline">Pacing</span>
//                     <span className="hidden sm:inline">Review</span>
//                   </div>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="flex-1 overflow-y-auto">
//                   <AnimatePresence mode="wait">
//                     <motion.div key={step} variants={stepTransition} initial="hidden" animate="show" exit="exit" className="p-4 sm:p-6 lg:p-8">
//                       {step === 1 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Campaign Details</h3>
//                             <p className="text-sm text-slate-600">Set up the basic information for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                             <div>
//                               <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
//                               <input value={createForm.name} onChange={onCreateChange} name="name" placeholder="Enter campaign name"
//                                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition" />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-slate-700 mb-2">Assistant</label>
//                               <select value={createForm.assistant_id} onChange={onCreateChange} name="assistant_id"
//                                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
//                                 <option value="">Select assistant</option>
//                                 {assistants.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
//                               </select>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Description (optional)</label>
//                             <textarea value={createForm.description} onChange={onCreateChange} name="description" placeholder="Describe your campaign..." rows={3}
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition resize-none" />
//                           </div>
//                         </div>
//                       )}
//                       {step === 2 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select File</h3>
//                             <p className="text-sm text-slate-600">Choose the file containing the leads for your campaign.</p>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
//                             <select value={createForm.file_id} onChange={onCreateChange} name="file_id"
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
//                               <option value="">Select file</option>
//                               {files.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
//                             </select>
//                           </div>
//                         </div>
//                       )}
//                       {step === 3 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select Leads</h3>
//                             <p className="text-sm text-slate-600">Choose which leads to include in your campaign.</p>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Selection Mode</label>
//                             <select value={createForm.selection_mode} onChange={onCreateChange} name="selection_mode"
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
//                               <option value="ALL">All Leads</option>
//                               <option value="ONLY">Only These Leads</option>
//                               <option value="SKIP">Skip These Leads</option>
//                             </select>
//                           </div>
//                           {createForm.selection_mode !== "ALL" && (
//                             <div className="space-y-3">
//                               <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//                                 <input value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search leads…"
//                                   className="w-full rounded-xl border border-slate-200 px-9 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition" />
//                               </div>
//                               {leadsLoading ? (
//                                 <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
//                                   <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3" /> Loading leads…
//                                 </div>
//                               ) : (
//                                 <LeadMultiSelect
//                                   leads={leadsForFile}
//                                   mode={createForm.selection_mode}
//                                   search={leadSearch}
//                                   selectedIds={createForm.selection_mode === "ONLY" ? createForm.include_lead_ids : createForm.exclude_lead_ids}
//                                   onChange={(ids) => {
//                                     if (createForm.selection_mode === "ONLY") setCreateForm((f) => ({ ...f, include_lead_ids: ids }))
//                                     else setCreateForm((f) => ({ ...f, exclude_lead_ids: ids }))
//                                   }}
//                                 />
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {step === 4 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Schedule</h3>
//                             <p className="text-sm text-slate-600">Set up the schedule for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <label className="block">
//                               <span className="mb-1 block text-sm font-semibold text-slate-700">Timezone (IANA)</span>
//                               <select name="timezone" value={createForm.timezone} onChange={onCreateChange}
//                                 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
//                                 {TIMEZONES.map((tz) => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
//                               </select>
//                             </label>
//                             <div>
//                               <div className="text-sm text-slate-700 mb-2">Days of week</div>
//                               <div className="flex flex-wrap gap-2">
//                                 {[0, 1, 2, 3, 4, 5, 6].map((d) => (
//                                   <button key={d} type="button" onClick={() => toggleDOW(d)}
//                                     className={cx("px-3 py-1.5 rounded-xl border text-sm",
//                                       createForm.days_of_week.includes(d) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700")}>
//                                     {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d]}
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <Field label="Daily start" name="daily_start" value={createForm.daily_start} onChange={onCreateChange} placeholder="HH:MM" />
//                               <Field label="Daily end" name="daily_end" value={createForm.daily_end} onChange={onCreateChange} placeholder="HH:MM" />
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <Field label="Start at (optional)" name="start_at" type="datetime-local" value={createForm.start_at} onChange={onCreateChange} />
//                               <Field label="End at (optional)" name="end_at" type="datetime-local" value={createForm.end_at} onChange={onCreateChange} />
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {step === 5 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Pacing</h3>
//                             <p className="text-sm text-slate-600">Set up the pacing for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <Field label="Calls per minute" name="calls_per_minute" value={createForm.calls_per_minute} onChange={onCreateChange} />
//                             <Field label="Parallel calls" name="parallel_calls" value={createForm.parallel_calls} onChange={onCreateChange} />
//                             <label className="inline-flex items-center gap-2">
//                               <input type="checkbox" name="retry_on_busy" checked={!!createForm.retry_on_busy} onChange={onCreateChange} />
//                               <span className="text-sm text-slate-800">Retry on busy / no-answer</span>
//                             </label>
//                             <Field label="Busy retry delay (min)" name="busy_retry_delay_minutes" value={createForm.busy_retry_delay_minutes} onChange={onCreateChange} />
//                             <Field label="Max attempts" name="max_attempts" value={createForm.max_attempts} onChange={onCreateChange} />
//                           </div>
//                         </div>
//                       )}
//                       {step === 6 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Review</h3>
//                             <p className="text-sm text-slate-600">Review your campaign details before creating.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <div><div className="text-sm font-semibold text-slate-700">Name</div><div className="text-sm text-slate-600">{createForm.name || "—"}</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">File</div><div className="text-sm text-slate-600">{files.find((f) => String(f.id) === String(createForm.file_id))?.name || "—"}</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">Assistant</div><div className="text-sm text-slate-600">{assistants.find((a) => String(a.id) === String(createForm.assistant_id))?.name || "—"}</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">Schedule</div><div className="text-sm text-slate-600">{dowLabel(createForm.days_of_week)} · {createForm.daily_start}–{createForm.daily_end} ({createForm.timezone})</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">Pacing</div><div className="text-sm text-slate-600">{createForm.calls_per_minute} CPM · {createForm.parallel_calls} parallel</div></div>
//                           </div>
//                         </div>
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
//                   <div className="flex items-center gap-2 order-2 sm:order-1">
//                     {step > 1 && (
//                       <ButtonGhost onClick={handleBack} icon={<ChevronLeft className="h-4 w-4" />}>
//                         <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Back</span>
//                       </ButtonGhost>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2 order-1 sm:order-2">
//                     {step < 6 ? (
//                       <ButtonPrimary onClick={handleNext} icon={<ChevronRight className="h-4 w-4" />}>
//                         <span className="hidden sm:inline">Next Step</span><span className="sm:hidden">Next</span>
//                       </ButtonPrimary>
//                     ) : (
//                       <ButtonPrimary onClick={createCampaign} disabled={creating} icon={creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}>
//                         {creating ? "Creating..." : "Create Campaign"}
//                       </ButtonPrimary>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Details Drawer */}
//       <AnimatePresence>
//         {showDetails && (
//           <>
//             <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={() => setShowDetails(false)} />
//             <motion.section
//               className="fixed inset-y-0 right-0 z-50 w-full sm:w-[90vw] md:w-[620px] lg:w-[880px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
//               initial={{ x: "100%" }} animate={{ x: 0, transition: { type: "spring", stiffness: 260, damping: 28 } }} exit={{ x: "100%", transition: { duration: 0.2 } }}
//               aria-label="Campaign details"
//             >
//               {/* Topbar */}
//               <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-3 sm:p-4">
//                 <div className="flex items-center justify-between gap-2 sm:gap-3">
//                   <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
//                     <button onClick={() => setShowDetails(false)} className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50 flex-shrink-0" aria-label="Close"><X className="h-4 w-4 sm:h-5 sm:w-5" /></button>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-base sm:text-lg font-bold leading-tight truncate">Campaign #{activeCampaign?.id}</h3>
//                       <p className="text-xs text-slate-600 truncate">{unknown(activeCampaign?.name)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     <ButtonGhost onClick={() => downloadICS(activeCampaign.id, activeCampaign?.name)} icon={<Download className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">ICS</span>
//                     </ButtonGhost>
//                   </div>
//                 </div>

//                 {/* NEW: Large progress header */}
//                 <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-2">
//                       <StatusChip status={details?.status || activeCampaign?.status} />
//                       <LivePulse active={["scheduled","running"].includes(String(details?.status || activeCampaign?.status || "").toLowerCase())} />
//                     </div>
//                     <div className="text-xs text-slate-600">
//                       {details?.timezone || activeCampaign?.timezone || "Local"} · {dowLabel(details?.days_of_week ?? activeCampaign?.days_of_week)} · {(details?.daily_start || activeCampaign?.daily_start || "09:00")}–{(details?.daily_end || activeCampaign?.daily_end || "18:00")}
//                     </div>
//                   </div>
//                   <div className="mt-3">
//                     <SegmentedProgress totals={details?.totals} />
//                   </div>
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="flex-1 overflow-y-auto p-3 sm:p-6">
//                 {/* Info strip */}
//                 <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</div>
//                     <StatusChip status={details?.status || activeCampaign?.status} />
//                   </motion.div>
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Window</div>
//                     <div className="text-sm text-slate-800">
//                       <div className="truncate">{details ? dowLabel(details.days_of_week) : dowLabel(activeCampaign?.days_of_week)}</div>
//                       <div className="text-xs sm:text-sm">{(details?.daily_start || activeCampaign?.daily_start || "09:00") + "–" + (details?.daily_end || activeCampaign?.daily_end || "18:00")}</div>
//                       <div className="text-xs text-slate-500 truncate">{details?.timezone || activeCampaign?.timezone || "Local"}</div>
//                     </div>
//                   </motion.div>
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Counts</div>
//                     <div className="text-sm text-slate-800">
//                       <div>Total: {details?.totals?.total ?? activeCampaign?.counts?.total ?? "—"}</div>
//                       <div>Done: {details?.totals?.done ?? activeCampaign?.counts?.completed_or_failed ?? "—"}</div>
//                     </div>
//                   </motion.div>
//                 </motion.div>

//                 {/* Controls */}
//                 <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-2">
//                   {String(details?.status || activeCampaign?.status).toLowerCase() === "paused" ? (
//                     <ButtonPrimary onClick={() => doResume(activeCampaign.id)} icon={<Play className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">Resume</span>
//                     </ButtonPrimary>
//                   ) : (
//                     <ButtonPrimary onClick={() => doPause(activeCampaign.id)} icon={<Pause className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">Pause</span>
//                     </ButtonPrimary>
//                   )}
//                   <ButtonGhost onClick={() => doStop(activeCampaign.id)} icon={<StopSquare className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Stop</span>
//                   </ButtonGhost>
//                   <ButtonGhost onClick={() => doRefreshLeads(activeCampaign.id)} icon={<RefreshCw className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Sync Leads</span>
//                   </ButtonGhost>
//                   <ButtonGhost onClick={() => doDelete(activeCampaign.id)} icon={<Trash2 className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Delete</span>
//                   </ButtonGhost>
//                 </motion.div>

//                 {/* Schedule + Retry forms */}
//                 <motion.div initial="hidden" animate="show" variants={stagger} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <motion.div variants={fadeUp}><ScheduleForm details={details} onSubmit={(form) => updateSchedule(activeCampaign.id, form)} loading={detailsLoading} /></motion.div>
//                   <motion.div variants={fadeUp}><RetryForm details={details} onSubmit={(form) => updateRetryPolicy(activeCampaign.id, form)} loading={detailsLoading} /></motion.div>
//                 </motion.div>

//                 {/* Run now */}
//                 <motion.div initial="hidden" animate="show" variants={fadeUp}>
//                   <RunNowCard onRun={(n) => doRunNow(activeCampaign.id, n)} />
//                 </motion.div>
//               </div>
//             </motion.section>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }























// "use client"

// import { useEffect, useMemo, useRef, useState } from "react"
// import { toast } from "react-toastify"
// import {
//   Search,
//   RefreshCw,
//   X,
//   Loader2,
//   Users,
//   CheckCircle2,
//   XCircle,
//   Plus,
//   Play,
//   Pause,
//   Square as StopSquare,
//   Trash2,
//   Eye,
//   Download,
//   Settings,
//   Rocket,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   Clock3,
// } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// /* ──────────────────────────────────────────────────────────────────────────
//  * Config (added STATS + uses REFRESH_LEADS)
//  * ────────────────────────────────────────────────────────────────────────── */
// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000"
// const API_PREFIX = import.meta.env?.VITE_API_PREFIX || "/api"

// const EP = {
//   LIST: `${API_URL}${API_PREFIX}/campaigns/campaigns`,
//   CREATE: `${API_URL}${API_PREFIX}/campaigns/campaigns`,
//   DETAIL: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}`,
//   STATS: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/stats`,
//   SCHEDULE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/schedule`,
//   RETRY: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/retry-policy`,
//   PAUSE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/pause`,
//   RESUME: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/resume`,
//   STOP: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/stop`,
//   RUN_NOW: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/run-now`,
//   ICS: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/calendar.ics`,
//   DELETE: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}`,
//   REFRESH_LEADS: (id) => `${API_URL}${API_PREFIX}/campaigns/campaigns/${id}/refresh-leads`,
// }

// // Resource endpoints
// const RESOURCES = {
//   FILES: `${API_URL}${API_PREFIX}/files`,
//   ASSISTANTS: `${API_URL}${API_PREFIX}/get-assistants`,
//   LEADS: (fileId) => `${API_URL}${API_PREFIX}/leads${fileId ? `?file_id=${fileId}` : ""}`,
// }

// /* Utilities */
// function cx(...arr) { return arr.filter(Boolean).join(" ") }
// const unknown = (v) => {
//   if (v === undefined || v === null) return "Unknown"
//   const s = String(v).trim()
//   return s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined" ? "Unknown" : s
// }
// function useDebounce(value, delay = 250) {
//   const [debounced, setDebounced] = useState(value)
//   useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t) }, [value, delay])
//   return debounced
// }
// function fmtDT(d) {
//   try { const dt = new Date(d); if (isNaN(dt.getTime())) return "Unknown"; return dt.toLocaleString() } catch { return "Unknown" }
// }
// function fmtTimeShort(d) {
//   try { const dt = new Date(d); if (isNaN(dt.getTime())) return "—"; return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } catch { return "—" }
// }
// function toInputDateTimeLocal(value) {
//   if (!value) return ""
//   const d = new Date(value)
//   if (isNaN(d.getTime())) return ""
//   const yyyy = d.getFullYear()
//   const mm = String(d.getMonth() + 1).padStart(2, "0")
//   const dd = String(d.getDate()).padStart(2, "0")
//   const hh = String(d.getHours()).padStart(2, "0")
//   const mi = String(d.getMinutes()).padStart(2, "0")
//   return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
// }
// function fromInputDateTimeLocal(s) { if (!s) return null; const d = new Date(s); return isNaN(d.getTime()) ? null : d.toISOString() }
// function timeUntil(ts) {
//   if (!ts) return "—"
//   const to = new Date(ts).getTime()
//   if (Number.isNaN(to)) return "—"
//   const diff = Math.max(0, to - Date.now())
//   const s = Math.floor(diff / 1000)
//   const m = Math.floor(s / 60)
//   const rS = s % 60
//   if (m > 0) return `${m}m ${rS}s`
//   return `${rS}s`
// }

// /* Motion variants */
// const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } } }
// const stagger = { show: { transition: { staggerChildren: 0.05 } } }
// const overlay = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.18 } }, exit: { opacity: 0, transition: { duration: 0.12 } } }
// const slideInFromBottom = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.4 } }, exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } } }
// const modalVariants = { hidden: { opacity: 0, scale: 0.8, y: 50 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.5 } }, exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } } }
// const stepTransition = { hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } }, exit: { opacity: 0, x: -20, transition: { duration: 0.2 } } }

// /* Pill chip */
// function Chip({ children, tone = "slate" }) {
//   const tones = {
//     slate: "bg-slate-100 text-slate-700 ring-slate-200",
//     green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
//     red: "bg-rose-100 text-rose-700 ring-rose-200",
//     blue: "bg-blue-100 text-blue-700 ring-blue-200",
//     orange: "bg-orange-100 text-orange-700 ring-orange-200",
//     purple: "bg-purple-100 text-purple-700 ring-purple-200",
//     amber: "bg-amber-100 text-amber-700 ring-amber-200",
//     indigo: "bg-indigo-100 text-indigo-700 ring-indigo-200",
//   }
//   return (
//     <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
//       className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", tones[tone] || tones.slate)}>
//       {children}
//     </motion.span>
//   )
// }

// /* Stat card */
// function StatCard({ label, value, Icon, tone = "blue" }) {
//   const ring = tone === "blue" ? "ring-blue-200/60" : tone === "cyan" ? "ring-cyan-200/60" : "ring-slate-200/60"
//   const bg = tone === "blue" ? "from-blue-600 to-cyan-500" : tone === "cyan" ? "from-cyan-500 to-blue-600" : "from-slate-500 to-slate-700"
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
//   )
// }

// /* Status chip */
// function StatusChip({ status }) {
//   const s = String(status || "").toLowerCase()
//   if (s === "scheduled") return <Chip tone="blue">Scheduled</Chip>
//   if (s === "running") return <Chip tone="green">Running</Chip>
//   if (s === "paused") return <Chip tone="orange">Paused</Chip>
//   if (s === "stopped") return <Chip tone="red">Stopped</Chip>
//   if (s === "completed") return <Chip tone="purple">Completed</Chip>
//   if (s === "draft") return <Chip tone="slate">Draft</Chip>
//   return <Chip tone="slate">{unknown(status)}</Chip>
// }

// /* Timezones */
// const TIMEZONES = [
//   { value: "UTC", label: "UTC" },
//   { value: "America/New_York", label: "America/New_York" },
//   { value: "America/Chicago", label: "America/Chicago" },
//   { value: "America/Denver", label: "America/Denver" },
//   { value: "America/Los_Angeles", label: "America/Los_Angeles" },
//   { value: "America/Phoenix", label: "America/Phoenix" },
//   { value: "Europe/London", label: "Europe/London" },
//   { value: "Europe/Berlin", label: "Europe/Berlin" },
//   { value: "Europe/Paris", label: "Europe/Paris" },
//   { value: "Asia/Karachi", label: "Asia/Karachi" },
//   { value: "Asia/Kolkata", label: "Asia/Kolkata" },
//   { value: "Asia/Singapore", label: "Asia/Singapore" },
//   { value: "Asia/Tokyo", label: "Asia/Tokyo" },
//   { value: "Asia/Dubai", label: "Asia/Dubai" },
//   { value: "Australia/Sydney", label: "Australia/Sydney" },
// ]

// /* ──────────────────────────────────────────────────────────────────────────
//  * NEW: Progress bars
//  * ────────────────────────────────────────────────────────────────────────── */
// function percent(done, total) {
//   const d = Number(done) || 0
//   const t = Number(total) || 0
//   if (t <= 0) return 0
//   const v = Math.round((d / t) * 100)
//   return Math.min(100, Math.max(0, v))
// }

// function LivePulse({ active = false }) {
//   if (!active) return null
//   return (
//     <span className="relative inline-flex h-2.5 w-2.5">
//       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
//       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
//     </span>
//   )
// }

// function RowProgress({ done, total, status }) {
//   const p = percent(done, total)
//   const active = ["scheduled", "running"].includes(String(status || "").toLowerCase())
//   return (
//     <div className="flex items-center gap-2 min-w-[140px]">
//       <div className="relative h-2 w-36 rounded-full bg-slate-200 overflow-hidden">
//         <motion.div
//           className={cx("h-full bg-gradient-to-r from-blue-500 to-cyan-500", active && "shadow-[0_0_0_2px_rgba(59,130,246,0.15)]")}
//           initial={{ width: 0 }}
//           animate={{ width: `${p}%` }}
//           transition={{ type: "spring", stiffness: 160, damping: 20 }}
//         />
//       </div>
//       <div className="text-xs font-medium text-slate-700 tabular-nums">{(Number(done) || 0)}/{(Number(total) || 0)}</div>
//       <LivePulse active={active} />
//     </div>
//   )
// }

// function SegmentedProgress({ totals }) {
//   const total = totals?.total || 0
//   const done = totals?.done || 0
//   const calling = totals?.calling || 0
//   const retry = totals?.retry || 0
//   const pending = totals?.pending || 0

//   const seg = (n) => (total > 0 ? `${(n / total) * 100}%` : "0%")

//   return (
//     <div className="w-full">
//       <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden ring-1 ring-white/60 relative">
//         <motion.div className="h-full bg-emerald-500 absolute left-0 top-0" style={{ width: seg(done) }} initial={{ width: 0 }} animate={{ width: seg(done) }} />
//         <motion.div className="h-full bg-indigo-500 absolute left-0 top-0" style={{ width: seg(done + calling) }} initial={{ width: 0 }} animate={{ width: seg(done + calling) }} />
//         <motion.div className="h-full bg-amber-500 absolute left-0 top-0" style={{ width: seg(done + calling + retry) }} initial={{ width: 0 }} animate={{ width: seg(done + calling + retry) }} />
//         {/* pending is simply the rest; background already shows it */}
//       </div>
//       <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-700">
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" />Done {done}</span>
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-indigo-500" />Calling {calling}</span>
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500" />Retry {retry}</span>
//         <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-400" />Pending {pending}</span>
//         <span className="ml-auto font-semibold tabular-nums">{percent(done, total)}%</span>
//       </div>
//     </div>
//   )
// }

// /* ──────────────────────────────────────────────────────────────────────────
//  * Page: Campaigns
//  * ────────────────────────────────────────────────────────────────────────── */
// export default function CampaignsPage() {
//   const token = useRef(localStorage.getItem("token") || null)

//   const [campaigns, setCampaigns] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)

//   const [files, setFiles] = useState([])
//   const [assistants, setAssistants] = useState([])
//   const [leadsForFile, setLeadsForFile] = useState([])
//   const [leadsLoading, setLeadsLoading] = useState(false)

//   const [query, setQuery] = useState("")
//   const debouncedQuery = useDebounce(query, 250)

//   // Sorting & paging
//   const [sortBy, setSortBy] = useState("created_at")
//   const [sortDir, setSortDir] = useState("desc")
//   const [page, setPage] = useState(1)
//   const [pageSize, setPageSize] = useState(10)

//   // Create modal
//   const [showCreate, setShowCreate] = useState(false)
//   const [step, setStep] = useState(1)
//   const [creating, setCreating] = useState(false)
//   const [createForm, setCreateForm] = useState({
//     name: "",
//     file_id: "",
//     assistant_id: "",
//     selection_mode: "ALL",
//     include_lead_ids: [],
//     exclude_lead_ids: [],
//     timezone: "America/Los_Angeles",
//     days_of_week: [0, 1, 2, 3, 4],
//     daily_start: "09:00",
//     daily_end: "18:00",
//     start_at: "",
//     end_at: "",
//     calls_per_minute: 10,
//     parallel_calls: 2,
//     retry_on_busy: true,
//     busy_retry_delay_minutes: 15,
//     max_attempts: 3,
//     description: "",
//   })
//   const [leadSearch, setLeadSearch] = useState("")

//   // Details drawer
//   const [showDetails, setShowDetails] = useState(false)
//   const [activeCampaign, setActiveCampaign] = useState(null)
//   const [detailsLoading, setDetailsLoading] = useState(false)
//   const [details, setDetails] = useState(null)

//   // NEW: live stats for the open campaign
//   const [stats, setStats] = useState(null)

//   // Auto-poll while details open (details + stats)
//   useEffect(() => {
//     if (!showDetails || !activeCampaign?.id) return
//     // fetch immediately
//     loadDetails(activeCampaign.id)
//     loadStats(activeCampaign.id)
//     const timer = setInterval(() => {
//       loadDetails(activeCampaign.id)
//       loadStats(activeCampaign.id)
//       fetchCampaigns() // also keep the list fresh
//     }, 4000)
//     return () => clearInterval(timer)
//     // eslint-disable-next-line
//   }, [showDetails, activeCampaign?.id])

//   /* Fetch on mount */
//   useEffect(() => {
//     if (!token.current) {
//       setLoading(false)
//       toast.error("No auth token found. Please log in.")
//       return
//     }
//     fetchAll()
//     // eslint-disable-next-line
//   }, [])

//   async function fetchAll() {
//     setLoading(true)
//     try { await Promise.all([fetchCampaigns(), fetchFiles(), fetchAssistants()]) }
//     finally { setLoading(false) }
//   }

//   async function authedFetch(url, options = {}) {
//     if (!token.current) {
//       toast.error("No auth token found. Please log in.")
//       throw new Error("No token")
//     }
//     const res = await fetch(url, {
//       ...options,
//       headers: { ...(options.headers || {}), Authorization: `Bearer ${token.current}` },
//     })
//     return res
//   }

//   async function fetchCampaigns() {
//     try {
//       const res = await authedFetch(EP.LIST)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       setCampaigns(Array.isArray(data) ? data : [])
//     } catch (e) {
//       console.error(e)
//       toast.error("Failed to fetch campaigns")
//       setCampaigns([])
//     }
//   }

//   async function fetchFiles() {
//     try {
//       const res = await authedFetch(RESOURCES.FILES)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       setFiles(Array.isArray(data) ? data : data?.items || [])
//     } catch (e) {
//       console.warn("Files fetch failed:", e.message)
//       setFiles([])
//     }
//   }

//   async function fetchAssistants() {
//     try {
//       const res = await authedFetch(RESOURCES.ASSISTANTS)
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       const arr = (Array.isArray(data) && data) || data?.items || data?.assistants || data?.data || []
//       const normalized = arr.filter((a) => a && a.id !== undefined && a.id !== null)
//       setAssistants(normalized)
//     } catch (e) {
//       console.warn("Assistants fetch failed:", e.message)
//       setAssistants([])
//     }
//   }

//   async function loadLeadsForFile(fileId) {
//     if (!fileId) { setLeadsForFile([]); return }
//     try {
//       setLeadsLoading(true)
//       const res = await authedFetch(RESOURCES.LEADS(fileId))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json = await res.json()
//       const list = Array.isArray(json) ? json : json?.leads || json?.items || []
//       setLeadsForFile(list)
//     } catch (e) {
//       console.warn("Leads fetch failed:", e.message)
//       setLeadsForFile([])
//     } finally {
//       setLeadsLoading(false)
//     }
//   }

//   async function refreshAll() {
//     setRefreshing(true)
//     try { await fetchCampaigns() }
//     finally { setRefreshing(false) }
//   }

//   /* Derived list */
//   const filtered = useMemo(() => {
//     const q = debouncedQuery.trim().toLowerCase()
//     const list = campaigns.filter((c) => {
//       if (!q) return true
//       const fields = [(c.name || "").toLowerCase(), (c.status || "").toLowerCase(), String(c.id || ""), String(c.file_id || ""), String(c.assistant_id || "")]
//       return fields.some((f) => f.includes(q))
//     })
//     const dir = sortDir === "asc" ? 1 : -1
//     list.sort((a, b) => {
//       let va, vb
//       switch (sortBy) {
//         case "name": va = (a.name || "").toLowerCase(); vb = (b.name || "").toLowerCase(); break
//         case "status": va = (a.status || "").toLowerCase(); vb = (b.status || "").toLowerCase(); break
//         case "calls_per_minute": va = a.calls_per_minute || 0; vb = b.calls_per_minute || 0; break
//         case "created_at":
//         default: va = new Date(a.created_at || 0).getTime(); vb = new Date(b.created_at || 0).getTime()
//       }
//       if (va < vb) return -1 * dir
//       if (va > vb) return 1 * dir
//       return 0
//     })
//     return list
//   }, [campaigns, debouncedQuery, sortBy, sortDir])

//   const totalItems = filtered.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])
//   const start = (page - 1) * pageSize
//   const end = start + pageSize
//   const pageItems = filtered.slice(start, end)

//   // Stats
//   const listStats = useMemo(() => {
//     const total = filtered.length
//     const running = filtered.filter((c) => (c.status || "").toLowerCase() === "running").length
//     const paused = filtered.filter((c) => (c.status || "").toLowerCase() === "paused").length
//     return { total, running, paused }
//   }, [filtered])

//   /* Create: behavior */
//   function onCreateChange(e) {
//     const { name, value, type, checked } = e.target
//     setCreateForm((f) => {
//       const next = { ...f, [name]: type === "checkbox" ? checked : value }
//       if (name === "file_id") {
//         const fileIdNum = Number(value) || ""
//         if (fileIdNum) loadLeadsForFile(fileIdNum)
//         else setLeadsForFile([])
//         next.include_lead_ids = []
//         next.exclude_lead_ids = []
//       }
//       if (name === "selection_mode") {
//         next.include_lead_ids = []
//         next.exclude_lead_ids = []
//       }
//       return next
//     })
//   }
//   function toggleDOW(d) {
//     setCreateForm((f) => {
//       const has = f.days_of_week.includes(d)
//       const days = has ? f.days_of_week.filter((x) => x !== d) : [...f.days_of_week, d]
//       days.sort((a, b) => a - b)
//       return { ...f, days_of_week: days }
//     })
//   }

//   async function createCampaign() {
//     if (!createForm.name || !createForm.file_id || !createForm.assistant_id) {
//       toast.error("Name, File and Assistant are required.")
//       return
//     }
//     if (createForm.selection_mode !== "ALL" && createForm.file_id && leadsForFile.length === 0) {
//       toast.error("No leads available for the selected file.")
//       return
//     }

//     const payload = {
//       name: String(createForm.name).trim(),
//       file_id: Number(createForm.file_id),
//       assistant_id: Number(createForm.assistant_id),
//       selection_mode: createForm.selection_mode,
//       include_lead_ids: createForm.selection_mode === "ONLY" && createForm.include_lead_ids?.length ? createForm.include_lead_ids : null,
//       exclude_lead_ids: createForm.selection_mode === "SKIP" && createForm.exclude_lead_ids?.length ? createForm.exclude_lead_ids : null,
//       timezone: createForm.timezone || "America/Los_Angeles",
//       days_of_week: createForm.days_of_week,
//       daily_start: createForm.daily_start || "09:00",
//       daily_end: createForm.daily_end || "18:00",
//       start_at: fromInputDateTimeLocal(createForm.start_at),
//       end_at: fromInputDateTimeLocal(createForm.end_at),
//       calls_per_minute: Number(createForm.calls_per_minute) || 10,
//       parallel_calls: Number(createForm.parallel_calls) || 2,
//       retry_on_busy: !!createForm.retry_on_busy,
//       busy_retry_delay_minutes: Number(createForm.busy_retry_delay_minutes) || 15,
//       max_attempts: Number(createForm.max_attempts) || 3,
//     }

//     try {
//       setCreating(true)
//       const res = await authedFetch(EP.CREATE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Campaign created.")
//       setShowCreate(false)
//       setStep(1)
//       setCreateForm((f) => ({ ...f, name: "", include_lead_ids: [], exclude_lead_ids: [] }))
//       await fetchCampaigns()
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Create failed")
//     } finally {
//       setCreating(false)
//     }
//   }

//   /* Details & Stats */
//   async function openDetails(c) {
//     setActiveCampaign(c)
//     setShowDetails(true)
//     await Promise.all([loadDetails(c.id), loadStats(c.id)])
//   }
//   async function loadDetails(id) {
//     if (!id) return
//     try {
//       setDetailsLoading(true)
//       const res = await authedFetch(EP.DETAIL(id))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json = await res.json()
//       setDetails(json)
//     } catch (e) {
//       console.error(e)
//       toast.error("Failed to load campaign details")
//       setDetails(null)
//     } finally {
//       setDetailsLoading(false)
//     }
//   }
//   async function loadStats(id) {
//     if (!id) return
//     try {
//       const res = await authedFetch(EP.STATS(id))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json = await res.json()
//       setStats(json)
//     } catch (e) {
//       console.error(e)
//       // don't toast every time; silent failure for a poll
//     }
//   }

//   /* Controls */
//   async function postAction(urlBuilder, id, okMsg) {
//     try {
//       const res = await authedFetch(urlBuilder(id), { method: "POST" })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || okMsg)
//       await fetchCampaigns()
//       if (activeCampaign && activeCampaign.id === id) {
//         await loadDetails(id)
//         await loadStats(id)
//       }
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Action failed")
//     }
//   }
//   const doPause = (id) => postAction(EP.PAUSE, id, "Paused")
//   const doResume = (id) => postAction(EP.RESUME, id, "Resumed")
//   const doStop = (id) => postAction(EP.STOP, id, "Stopped")
//   const doRefreshLeads = (id) => postAction(EP.REFRESH_LEADS, id, "Leads synced")

//   async function doDelete(id) {
//     if (!confirm("Delete this campaign and its progress rows?")) return
//     try {
//       const res = await authedFetch(EP.DELETE(id), { method: "DELETE" })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Deleted")
//       setShowDetails(false)
//       setActiveCampaign(null)
//       await fetchCampaigns()
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Delete failed")
//     }
//   }

//   async function doRunNow(id, batchSize) {
//     try {
//       const res = await authedFetch(EP.RUN_NOW(id), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ batch_size: Number(batchSize) || 5 }),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Triggered.")
//       await loadStats(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Run-now failed")
//     }
//   }

//   async function updateSchedule(id, form) {
//     const payload = {
//       timezone: form.timezone || undefined,
//       days_of_week: form.days_of_week?.length ? form.days_of_week : undefined,
//       daily_start: form.daily_start || undefined,
//       daily_end: form.daily_end || undefined,
//       start_at: fromInputDateTimeLocal(form.start_at),
//       end_at: fromInputDateTimeLocal(form.end_at),
//     }
//     try {
//       const res = await authedFetch(EP.SCHEDULE(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Schedule updated")
//       await fetchCampaigns()
//       await loadDetails(id)
//       await loadStats(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Update failed")
//     }
//   }

//   async function updateRetryPolicy(id, form) {
//     const payload = {
//       retry_on_busy: !!form.retry_on_busy,
//       busy_retry_delay_minutes: Number(form.busy_retry_delay_minutes) || 15,
//       max_attempts: Number(form.max_attempts) || 3,
//     }
//     try {
//       const res = await authedFetch(EP.RETRY(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
//       toast.success(json?.detail || "Retry policy updated")
//       await loadDetails(id)
//       await loadStats(id)
//     } catch (e) {
//       console.error(e)
//       toast.error(e?.message || "Update failed")
//     }
//   }

//   async function downloadICS(id, name = "campaign") {
//     try {
//       const res = await authedFetch(EP.ICS(id))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const blob = await res.blob()
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `${name || "campaign"}.ics`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       URL.revokeObjectURL(url)
//     } catch (e) {
//       console.error(e)
//       toast.error("ICS download failed")
//     }
//   }

//   const handleOpenCreate = () => { setShowCreate(true); setStep(1) }
//   const handleCloseCreate = () => {
//     setShowCreate(false); setStep(1)
//     setCreateForm((f) => ({ ...f, name: "", include_lead_ids: [], exclude_lead_ids: [] }))
//   }
//   const handleNext = () => { setStep((s) => Math.min(6, s + 1)) }
//   const handleBack = () => { setStep((s) => Math.max(1, s - 1)) }

//   /* Render */
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//         {/* Header */}
//         <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Campaigns</h1>
//             <p className="mt-1 text-sm sm:text-base text-slate-600">Manage your calling campaigns and schedules.</p>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-3">
//             <ButtonGhost onClick={refreshAll} disabled={refreshing} icon={refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}>
//               <span className="hidden sm:inline">Refresh</span>
//             </ButtonGhost>
//             <ButtonPrimary onClick={handleOpenCreate} icon={<Plus className="h-4 w-4" />}>
//               <span className="hidden sm:inline">Create Campaign</span>
//               <span className="sm:hidden">Create</span>
//             </ButtonPrimary>
//           </div>
//         </motion.div>

//         {/* Filters */}
//         <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="relative sm:col-span-1 lg:col-span-2">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//             <input
//               value={query}
//               onChange={(e) => { setQuery(e.target.value); setPage(1) }}
//               placeholder="Search name, status, IDs…"
//               className="w-full rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/60 transition focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300"
//               aria-label="Search campaigns"
//             />
//           </div>

//           <div className="flex items-center justify-between sm:justify-end gap-3">
//             <div className="text-xs sm:text-sm text-slate-600 hidden sm:block">
//               Total: <span className="font-semibold text-slate-900">{totalItems}</span>
//             </div>
//             <select
//               value={pageSize}
//               onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
//               className="rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none ring-1 ring-white/60 focus:ring-2 focus:ring-cyan-400/40"
//               aria-label="Rows per page"
//             >
//               {[10, 20, 40, 80].map((n) => (<option key={n} value={n}>{n} / page</option>))}
//             </select>
//           </div>
//         </motion.div>

//         {/* Stats */}
//         <motion.div initial="hidden" animate="show" variants={stagger} className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <motion.div variants={fadeUp}><StatCard label="Total Campaigns" value={listStats.total} Icon={Users} tone="blue" /></motion.div>
//           <motion.div variants={fadeUp}><StatCard label="Running" value={listStats.running} Icon={CheckCircle2} tone="cyan" /></motion.div>
//           <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1"><StatCard label="Paused" value={listStats.paused} Icon={XCircle} tone="blue" /></motion.div>
//         </motion.div>

//         {/* Table */}
//         <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 sm:mt-6 overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/50">
//           <div className="min-w-full">
//             {/* Mobile Cards */}
//             <div className="block sm:hidden">
//               {loading ? (
//                 <div className="p-4 space-y-3">
//                   {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="animate-pulse bg-slate-100 rounded-xl p-4 h-24" />))}
//                 </div>
//               ) : (
//                 <div className="divide-y divide-slate-200">
//                   {pageItems.map((camp, idx) => {
//                     const total = camp.counts?.total || 0
//                     const done = camp.counts?.completed_or_failed || 0
//                     return (
//                       <motion.div key={camp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
//                         className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openDetails(camp)}>
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-slate-900 truncate">{unknown(camp.name)}</h3>
//                             <p className="text-xs text-slate-500">ID: {camp.id}</p>
//                           </div>
//                           <StatusChip status={camp.status} />
//                         </div>
//                         <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
//                           <span>{fmtDT(camp.created_at)}</span>
//                           <span>{total} leads</span>
//                         </div>
//                         <RowProgress done={done} total={total} status={camp.status} />
//                       </motion.div>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Desktop Table */}
//             <table className="hidden sm:table min-w-full text-left">
//               <thead className="bg-slate-50/50 backdrop-blur">
//                 <tr>
//                   <Th sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Name</Th>
//                   <Th sortKey="status" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Status</Th>
//                   <th className="px-5 py-3 font-semibold">File</th>
//                   <th className="px-5 py-3 font-semibold">Assistant</th>
//                   <Th sortKey="calls_per_minute" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Pacing</Th>
//                   <th className="px-5 py-3 font-semibold">Created</th>
//                   <th className="px-5 py-3 font-semibold">Leads</th>
//                   <th className="px-5 py-3 font-semibold">Progress</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <RowSkeleton rows={pageSize} cols={9} />
//                 ) : pageItems.length === 0 ? (
//                   <tr><td colSpan={9} className="px-5 py-4 text-center text-sm text-slate-500">No campaigns found.</td></tr>
//                 ) : (
//                   pageItems.map((camp) => {
//                     const total = camp.counts?.total || 0
//                     const done = camp.counts?.completed_or_failed || 0
//                     return (
//                       <tr key={camp.id} className="group/row hover:bg-slate-50/50 transition-colors">
//                         <td className="px-5 py-3 font-medium text-slate-900">
//                           <button onClick={() => openDetails(camp)} className="group/cell flex items-center gap-2 text-left">{unknown(camp.name)}</button>
//                         </td>
//                         <td className="px-5 py-3"><StatusChip status={camp.status} /></td>
//                         <td className="px-5 py-3 text-slate-700">{camp.file_id}</td>
//                         <td className="px-5 py-3 text-slate-700">{camp.assistant_id}</td>
//                         <td className="px-5 py-3 text-slate-700">{camp.calls_per_minute}</td>
//                         <td className="px-5 py-3 text-slate-600">{fmtDT(camp.created_at)}</td>
//                         <td className="px-5 py-3 text-slate-700">{total}</td>
//                         <td className="px-5 py-3"><RowProgress done={done} total={total} status={camp.status} /></td>
//                         <td className="px-5 py-3 text-right">
//                           <div className="invisible group-hover/row:visible flex items-center justify-end gap-2">
//                             <ButtonGhost onClick={() => downloadICS(camp.id, camp?.name)} icon={<Download className="h-4 w-4" />}>ICS</ButtonGhost>
//                             <ButtonGhost onClick={() => openDetails(camp)} icon={<Eye className="h-4 w-4" />}>Details</ButtonGhost>
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         {/* Pagination */}
//         <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
//           <div className="text-xs sm:text-sm text-slate-600 order-2 sm:order-1">
//             Showing {totalItems === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
//           </div>
//           <div className="flex items-center gap-2 order-1 sm:order-2">
//             <PagerButton disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" /><span className="hidden sm:inline">Previous</span></PagerButton>
//             <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-700">{page} of {totalPages}</span>
//             <PagerButton disabled={page >= totalPages} onClick={() => setPage(page + 1)}><span className="hidden sm:inline">Next</span><ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /></PagerButton>
//           </div>
//         </motion.div>
//       </main>

//       {/* Create Campaign Modal */}
//       <AnimatePresence>
//         {showCreate && (
//           <>
//             <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={handleCloseCreate} />
//             <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6" variants={modalVariants} initial="hidden" animate="show" exit="exit">
//               <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl xl:max-w-4xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
//                 {/* Modal Header */}
//                 <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" /></div>
//                     <div>
//                       <h2 className="text-lg sm:text-xl font-bold text-slate-900">Create Campaign</h2>
//                       <p className="text-xs sm:text-sm text-slate-600">Step {step} of 6</p>
//                     </div>
//                   </div>
//                   <button onClick={handleCloseCreate} className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors" aria-label="Close"><X className="h-4 w-4 sm:h-5 sm:w-5" /></button>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-50/50">
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     {[1, 2, 3, 4, 5, 6].map((i) => (
//                       <motion.div key={i}
//                         className={cx("flex-1 h-1.5 sm:h-2 rounded-full transition-colors duration-300", i <= step ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-slate-200")}
//                         initial={{ scaleX: 0 }} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} />
//                     ))}
//                   </div>
//                   <div className="flex justify-between mt-2 text-xs text-slate-500">
//                     <span className="hidden sm:inline">Details</span>
//                     <span className="hidden sm:inline">Files</span>
//                     <span className="hidden sm:inline">Leads</span>
//                     <span className="hidden sm:inline">Schedule</span>
//                     <span className="hidden sm:inline">Pacing</span>
//                     <span className="hidden sm:inline">Review</span>
//                   </div>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="flex-1 overflow-y-auto">
//                   <AnimatePresence mode="wait">
//                     <motion.div key={step} variants={stepTransition} initial="hidden" animate="show" exit="exit" className="p-4 sm:p-6 lg:p-8">
//                       {step === 1 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Campaign Details</h3>
//                             <p className="text-sm text-slate-600">Set up the basic information for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                             <div>
//                               <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
//                               <input value={createForm.name} onChange={onCreateChange} name="name" placeholder="Enter campaign name"
//                                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition" />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-slate-700 mb-2">Assistant</label>
//                               <select value={createForm.assistant_id} onChange={onCreateChange} name="assistant_id"
//                                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
//                                 <option value="">Select assistant</option>
//                                 {assistants.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
//                               </select>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Description (optional)</label>
//                             <textarea value={createForm.description} onChange={onCreateChange} name="description" placeholder="Describe your campaign..." rows={3}
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition resize-none" />
//                           </div>
//                         </div>
//                       )}
//                       {step === 2 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select File</h3>
//                             <p className="text-sm text-slate-600">Choose the file containing the leads for your campaign.</p>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
//                             <select value={createForm.file_id} onChange={onCreateChange} name="file_id"
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
//                               <option value="">Select file</option>
//                               {files.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
//                             </select>
//                           </div>
//                         </div>
//                       )}
//                       {step === 3 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select Leads</h3>
//                             <p className="text-sm text-slate-600">Choose which leads to include in your campaign.</p>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Selection Mode</label>
//                             <select value={createForm.selection_mode} onChange={onCreateChange} name="selection_mode"
//                               className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
//                               <option value="ALL">All Leads</option>
//                               <option value="ONLY">Only These Leads</option>
//                               <option value="SKIP">Skip These Leads</option>
//                             </select>
//                           </div>
//                           {createForm.selection_mode !== "ALL" && (
//                             <div className="space-y-3">
//                               <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//                                 <input value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search leads…"
//                                   className="w-full rounded-xl border border-slate-200 px-9 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition" />
//                               </div>
//                               {leadsLoading ? (
//                                 <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
//                                   <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3" /> Loading leads…
//                                 </div>
//                               ) : (
//                                 <LeadMultiSelect
//                                   leads={leadsForFile}
//                                   mode={createForm.selection_mode}
//                                   search={leadSearch}
//                                   selectedIds={createForm.selection_mode === "ONLY" ? createForm.include_lead_ids : createForm.exclude_lead_ids}
//                                   onChange={(ids) => {
//                                     if (createForm.selection_mode === "ONLY") setCreateForm((f) => ({ ...f, include_lead_ids: ids }))
//                                     else setCreateForm((f) => ({ ...f, exclude_lead_ids: ids }))
//                                   }}
//                                 />
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {step === 4 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Schedule</h3>
//                             <p className="text-sm text-slate-600">Set up the schedule for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <label className="block">
//                               <span className="mb-1 block text-sm font-semibold text-slate-700">Timezone (IANA)</span>
//                               <select name="timezone" value={createForm.timezone} onChange={onCreateChange}
//                                 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
//                                 {TIMEZONES.map((tz) => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
//                               </select>
//                             </label>
//                             <div>
//                               <div className="text-sm text-slate-700 mb-2">Days of week</div>
//                               <div className="flex flex-wrap gap-2">
//                                 {[0, 1, 2, 3, 4, 5, 6].map((d) => (
//                                   <button key={d} type="button" onClick={() => toggleDOW(d)}
//                                     className={cx("px-3 py-1.5 rounded-xl border text-sm",
//                                       createForm.days_of_week.includes(d) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700")}>
//                                     {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d]}
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <Field label="Daily start" name="daily_start" value={createForm.daily_start} onChange={onCreateChange} placeholder="HH:MM" />
//                               <Field label="Daily end" name="daily_end" value={createForm.daily_end} onChange={onCreateChange} placeholder="HH:MM" />
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <Field label="Start at (optional)" name="start_at" type="datetime-local" value={createForm.start_at} onChange={onCreateChange} />
//                               <Field label="End at (optional)" name="end_at" type="datetime-local" value={createForm.end_at} onChange={onCreateChange} />
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {step === 5 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Pacing</h3>
//                             <p className="text-sm text-slate-600">Set up the pacing for your campaign.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <Field label="Calls per minute" name="calls_per_minute" value={createForm.calls_per_minute} onChange={onCreateChange} />
//                             <Field label="Parallel calls" name="parallel_calls" value={createForm.parallel_calls} onChange={onCreateChange} />
//                             <label className="inline-flex items-center gap-2">
//                               <input type="checkbox" name="retry_on_busy" checked={!!createForm.retry_on_busy} onChange={onCreateChange} />
//                               <span className="text-sm text-slate-800">Retry on busy / no-answer</span>
//                             </label>
//                             <Field label="Busy retry delay (min)" name="busy_retry_delay_minutes" value={createForm.busy_retry_delay_minutes} onChange={onCreateChange} />
//                             <Field label="Max attempts" name="max_attempts" value={createForm.max_attempts} onChange={onCreateChange} />
//                           </div>
//                         </div>
//                       )}
//                       {step === 6 && (
//                         <div className="space-y-4 sm:space-y-6">
//                           <div>
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Review</h3>
//                             <p className="text-sm text-slate-600">Review your campaign details before creating.</p>
//                           </div>
//                           <div className="grid grid-cols-1 gap-3">
//                             <div><div className="text-sm font-semibold text-slate-700">Name</div><div className="text-sm text-slate-600">{createForm.name || "—"}</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">File</div><div className="text-sm text-slate-600">{files.find((f) => String(f.id) === String(createForm.file_id))?.name || "—"}</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">Assistant</div><div className="text-sm text-slate-600">{assistants.find((a) => String(a.id) === String(createForm.assistant_id))?.name || "—"}</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">Schedule</div><div className="text-sm text-slate-600">{dowLabel(createForm.days_of_week)} · {createForm.daily_start}–{createForm.daily_end} ({createForm.timezone})</div></div>
//                             <div><div className="text-sm font-semibold text-slate-700">Pacing</div><div className="text-sm text-slate-600">{createForm.calls_per_minute} CPM · {createForm.parallel_calls} parallel</div></div>
//                           </div>
//                         </div>
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
//                   <div className="flex items-center gap-2 order-2 sm:order-1">
//                     {step > 1 && (
//                       <ButtonGhost onClick={handleBack} icon={<ChevronLeft className="h-4 w-4" />}>
//                         <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Back</span>
//                       </ButtonGhost>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2 order-1 sm:order-2">
//                     {step < 6 ? (
//                       <ButtonPrimary onClick={handleNext} icon={<ChevronRight className="h-4 w-4" />}>
//                         <span className="hidden sm:inline">Next Step</span><span className="sm:hidden">Next</span>
//                       </ButtonPrimary>
//                     ) : (
//                       <ButtonPrimary onClick={createCampaign} disabled={creating} icon={creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}>
//                         {creating ? "Creating..." : "Create Campaign"}
//                       </ButtonPrimary>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Details Drawer */}
//       <AnimatePresence>
//         {showDetails && (
//           <>
//             <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={() => setShowDetails(false)} />
//             <motion.section
//               className="fixed inset-y-0 right-0 z-50 w-full sm:w-[90vw] md:w-[620px] lg:w-[880px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
//               initial={{ x: "100%" }} animate={{ x: 0, transition: { type: "spring", stiffness: 260, damping: 28 } }} exit={{ x: "100%", transition: { duration: 0.2 } }}
//               aria-label="Campaign details"
//             >
//               {/* Topbar */}
//               <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-3 sm:p-4">
//                 <div className="flex items-center justify-between gap-2 sm:gap-3">
//                   <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
//                     <button onClick={() => setShowDetails(false)} className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50 flex-shrink-0" aria-label="Close"><X className="h-4 w-4 sm:h-5 sm:w-5" /></button>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-base sm:text-lg font-bold leading-tight truncate">Campaign #{activeCampaign?.id}</h3>
//                       <p className="text-xs text-slate-600 truncate">{unknown(activeCampaign?.name)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     <ButtonGhost onClick={() => downloadICS(activeCampaign.id, activeCampaign?.name)} icon={<Download className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">ICS</span>
//                     </ButtonGhost>
//                   </div>
//                 </div>

//                 {/* Live header */}
//                 <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                   <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
//                     <div className="flex items-center gap-2">
//                       <StatusChip status={stats?.status || details?.status || activeCampaign?.status} />
//                       <LivePulse active={!!stats?.active_now} />
//                       {stats?.active_now ? <Chip tone="green">Active now</Chip> : <Chip tone="amber">Idle</Chip>}
//                     </div>
//                     <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs sm:text-sm">
//                       <div className="flex items-center gap-2">
//                         <Clock3 className="h-4 w-4 text-slate-500" />
//                         <div className="truncate">
//                           <span className="text-slate-500">Local:</span>{" "}
//                           <span className="font-medium text-slate-800">{fmtDT(stats?.now?.local) || "—"}</span>
//                         </div>
//                       </div>
//                       <div className="truncate">
//                         <span className="text-slate-500">Window: </span>
//                         <span className="font-medium text-slate-800">
//                           {dowLabel(stats?.window?.days_of_week ?? details?.days_of_week ?? activeCampaign?.days_of_week)} ·{" "}
//                           {(stats?.window?.daily_start || details?.daily_start || activeCampaign?.daily_start || "09:00")}–{(stats?.window?.daily_end || details?.daily_end || activeCampaign?.daily_end || "18:00")}{" "}
//                           ({stats?.timezone || details?.timezone || activeCampaign?.timezone || "Local"})
//                         </span>
//                       </div>
//                       <div className="truncate">
//                         <span className="text-slate-500">Next tick:</span>{" "}
//                         <span className="font-medium text-slate-800">{stats?.next_tick_at ? `${fmtTimeShort(stats.next_tick_at)} · in ${timeUntil(stats.next_tick_at)}` : "—"}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-3">
//                     <SegmentedProgress totals={stats?.totals || details?.totals} />
//                   </div>
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="flex-1 overflow-y-auto p-3 sm:p-6">
//                 {/* Info strip */}
//                 <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</div>
//                     <StatusChip status={stats?.status || details?.status || activeCampaign?.status} />
//                   </motion.div>
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Window</div>
//                     <div className="text-sm text-slate-800">
//                       <div className="truncate">{dowLabel(stats?.window?.days_of_week ?? details?.days_of_week ?? activeCampaign?.days_of_week)}</div>
//                       <div className="text-xs sm:text-sm">
//                         {(stats?.window?.daily_start || details?.daily_start || activeCampaign?.daily_start || "09:00") + "–" + (stats?.window?.daily_end || details?.daily_end || activeCampaign?.daily_end || "18:00")}
//                       </div>
//                       <div className="text-xs text-slate-500 truncate">{stats?.timezone || details?.timezone || activeCampaign?.timezone || "Local"}</div>
//                     </div>
//                   </motion.div>
//                   <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
//                     <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Counts</div>
//                     <div className="text-sm text-slate-800 grid grid-cols-2 gap-y-1">
//                       <div>Total: {stats?.totals?.total ?? details?.totals?.total ?? activeCampaign?.counts?.total ?? "—"}</div>
//                       <div>Done: {stats?.totals?.done ?? details?.totals?.done ?? activeCampaign?.counts?.completed_or_failed ?? "—"}</div>
//                       <div>Calling: {stats?.totals?.calling ?? "—"}</div>
//                       <div>Retry: {stats?.totals?.retry ?? "—"}</div>
//                     </div>
//                   </motion.div>
//                 </motion.div>

//                 {/* Controls */}
//                 <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-2">
//                   {String(stats?.status || details?.status || activeCampaign?.status).toLowerCase() === "paused" ? (
//                     <ButtonPrimary onClick={() => doResume(activeCampaign.id)} icon={<Play className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">Resume</span>
//                     </ButtonPrimary>
//                   ) : (
//                     <ButtonPrimary onClick={() => doPause(activeCampaign.id)} icon={<Pause className="h-4 w-4" />}>
//                       <span className="hidden sm:inline">Pause</span>
//                     </ButtonPrimary>
//                   )}
//                   <ButtonGhost onClick={() => doStop(activeCampaign.id)} icon={<StopSquare className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Stop</span>
//                   </ButtonGhost>
//                   <ButtonGhost onClick={() => doRefreshLeads(activeCampaign.id)} icon={<RefreshCw className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Sync Leads</span>
//                   </ButtonGhost>
//                   <ButtonGhost onClick={() => doDelete(activeCampaign.id)} icon={<Trash2 className="h-4 w-4" />}>
//                     <span className="hidden sm:inline">Delete</span>
//                   </ButtonGhost>
//                 </motion.div>

//                 {/* Schedule + Retry forms */}
//                 <motion.div initial="hidden" animate="show" variants={stagger} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <motion.div variants={fadeUp}><ScheduleForm details={stats?.window ? { ...details, ...stats, days_of_week: stats.window?.days_of_week, daily_start: stats.window?.daily_start, daily_end: stats.window?.daily_end, timezone: stats.timezone } : details} onSubmit={(form) => updateSchedule(activeCampaign.id, form)} loading={detailsLoading} /></motion.div>
//                   <motion.div variants={fadeUp}><RetryForm details={details} onSubmit={(form) => updateRetryPolicy(activeCampaign.id, form)} loading={detailsLoading} /></motion.div>
//                 </motion.div>

//                 {/* Run now */}
//                 <motion.div initial="hidden" animate="show" variants={fadeUp}>
//                   <RunNowCard onRun={(n) => doRunNow(activeCampaign.id, n)} />
//                 </motion.div>
//               </div>
//             </motion.section>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }











// /* ─────────────────────────── Subcomponents ─────────────────────────── */

// function RunNowCard({ onRun }) {
//   const [n, setN] = useState(5)
//   return (
//     <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div className="font-semibold text-slate-800 flex items-center gap-2">
//           <Rocket className="h-4 w-4" /> Run Now
//         </div>
//         <div className="flex items-center gap-2">
//           <input type="number" min={1} className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" value={n} onChange={(e) => setN(Number(e.target.value) || 5)} />
//           <ButtonPrimary onClick={() => onRun(n)} icon={<Play className="h-4 w-4" />}>Trigger</ButtonPrimary>
//         </div>
//       </div>
//       <p className="text-sm text-slate-600 mt-2">Immediately place a small batch of calls (ignores schedule window).</p>
//     </div>
//   )
// }

// function ScheduleForm({ details, onSubmit, loading }) {
//   const [form, setForm] = useState({
//     timezone: details?.timezone || "America/Los_Angeles",
//     days_of_week: details?.days_of_week || [0, 1, 2, 3, 4],
//     daily_start: details?.daily_start || "09:00",
//     daily_end: details?.daily_end || "18:00",
//     start_at: toInputDateTimeLocal(details?.start_at),
//     end_at: toInputDateTimeLocal(details?.end_at),
//   })
//   useEffect(() => {
//     setForm({
//       timezone: details?.timezone || "America/Los_Angeles",
//       days_of_week: details?.days_of_week || [0, 1, 2, 3, 4],
//       daily_start: details?.daily_start || "09:00",
//       daily_end: details?.daily_end || "18:00",
//       start_at: toInputDateTimeLocal(details?.start_at),
//       end_at: toInputDateTimeLocal(details?.end_at),
//     })
//   }, [details])

//   function onChange(e) {
//     const { name, value } = e.target
//     setForm((f) => ({ ...f, [name]: value }))
//   }
//   function toggleDOW(d) {
//     setForm((f) => {
//       const has = f.days_of_week.includes(d)
//       const days = has ? f.days_of_week.filter((x) => x !== d) : [...f.days_of_week, d]
//       days.sort((a, b) => a - b)
//       return { ...f, days_of_week: days }
//     })
//   }

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
//         <Settings className="h-4 w-4" /> Schedule
//       </div>
//       <div className="grid grid-cols-1 gap-3">
//         <label className="block">
//           <span className="mb-1 block text-sm font-semibold text-slate-700">Timezone (IANA)</span>
//           <select name="timezone" value={form.timezone} onChange={onChange} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
//             {TIMEZONES.map((tz) => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
//           </select>
//         </label>
//         <div>
//           <div className="text-sm text-slate-700 mb-2">Days of week</div>
//           <div className="flex flex-wrap gap-2">
//             {[0, 1, 2, 3, 4, 5, 6].map((d) => (
//               <button key={d} type="button" onClick={() => toggleDOW(d)}
//                 className={cx("px-3 py-1.5 rounded-xl border text-sm", form.days_of_week.includes(d) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700")}>
//                 {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d]}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <Field label="Daily start" name="daily_start" value={form.daily_start} onChange={onChange} placeholder="HH:MM" />
//           <Field label="Daily end" name="daily_end" value={form.daily_end} onChange={onChange} placeholder="HH:MM" />
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <Field label="Start at (optional)" name="start_at" type="datetime-local" value={form.start_at} onChange={onChange} />
//           <Field label="End at (optional)" name="end_at" type="datetime-local" value={form.end_at} onChange={onChange} />
//         </div>
//         <div className="flex justify-end">
//           <ButtonPrimary onClick={() => onSubmit(form)} disabled={loading}>Save Schedule</ButtonPrimary>
//         </div>
//       </div>
//     </div>
//   )
// }

// function RetryForm({ details, onSubmit, loading }) {
//   const [form, setForm] = useState({
//     retry_on_busy: details?.retry_on_busy ?? true,
//     busy_retry_delay_minutes: details?.busy_retry_delay_minutes ?? 15,
//     max_attempts: details?.max_attempts ?? 3,
//   })
//   useEffect(() => {
//     setForm({
//       retry_on_busy: details?.retry_on_busy ?? true,
//       busy_retry_delay_minutes: details?.busy_retry_delay_minutes ?? 15,
//       max_attempts: details?.max_attempts ?? 3,
//     })
//   }, [details])

//   function onChange(e) {
//     const { name, value, type, checked } = e.target
//     setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
//   }

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
//         <Rocket className="h-4 w-4" /> Retry Policy
//       </div>
//       <div className="grid grid-cols-1 gap-3">
//         <label className="inline-flex items-center gap-2">
//           <input type="checkbox" name="retry_on_busy" checked={!!form.retry_on_busy} onChange={onChange} />
//           <span className="text-sm text-slate-800">Retry on busy / no-answer</span>
//         </label>
//         <Field label="Busy retry delay (min)" name="busy_retry_delay_minutes" value={form.busy_retry_delay_minutes} onChange={onChange} />
//         <Field label="Max attempts" name="max_attempts" value={form.max_attempts} onChange={onChange} />
//         <div className="flex justify-end">
//           <ButtonPrimary onClick={() => onSubmit(form)} disabled={loading}>Save Retry Policy</ButtonPrimary>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* Lead MultiSelect for ONLY/SKIP */
// function LeadMultiSelect({ leads, mode, search, selectedIds, onChange }) {
//   const [page, setPage] = useState(1)
//   const pageSize = 12

//   const filtered = useMemo(() => {
//     const q = (search || "").toLowerCase().trim()
//     if (!q) return leads
//     return leads.filter((l) => {
//       const name = `${l.first_name || ""} ${l.last_name || ""}`.toLowerCase()
//       return name.includes(q) || (l.email || "").toLowerCase().includes(q) || (l.mobile || "").toLowerCase().includes(q)
//     })
//   }, [leads, search])

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
//   useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])

//   const start = (page - 1) * pageSize
//   const end = start + pageSize
//   const slice = filtered.slice(start, end)

//   function toggle(id) {
//     const has = selectedIds.includes(id)
//     if (has) onChange(selectedIds.filter((x) => x !== id))
//     else onChange([...selectedIds, id])
//   }

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white">
//       <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
//         {slice.length === 0 ? (
//           <div className="p-4 text-sm text-slate-600">No leads match your search.</div>
//         ) : (
//           slice.map((l) => {
//             const nameFull = `${l.first_name || ""} ${l.last_name || ""}`.trim() || "Unknown"
//             return (
//               <label key={l.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
//                 <input type="checkbox" checked={selectedIds.includes(l.id)} onChange={() => toggle(l.id)} />
//                 <div className="min-w-0">
//                   <div className="font-medium text-slate-900 text-sm">{nameFull}</div>
//                   <div className="text-xs text-slate-600 break-all">{(l.email || "—") + " · " + (l.mobile || "—")}</div>
//                 </div>
//                 {l.dnc ? <Chip tone="red">DNC</Chip> : <Chip tone="green">OK</Chip>}
//               </label>
//             )
//           })
//         )}
//       </div>
//       {filtered.length > pageSize && (
//         <div className="flex items-center justify-between p-2">
//           <span className="text-xs text-slate-600">Showing {Math.min(end, filtered.length)} of {filtered.length}</span>
//           <div className="flex items-center gap-2">
//             <PagerButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft className="h-3.5 w-3.5" /> Prev</PagerButton>
//             <span className="text-xs text-slate-700">{page}/{totalPages}</span>
//             <PagerButton disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next <ChevronRight className="h-3.5 w-3.5" /></PagerButton>
//           </div>
//         </div>
//       )}
//       <div className="p-3 border-t border-slate-200 text-xs text-slate-700">
//         Mode: <strong>{mode}</strong> · Selected: <strong>{selectedIds.length}</strong>
//       </div>
//     </div>
//   )
// }

// /* Helpers / small UI bits */
// function dowLabel(days) {
//   const map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
//   const set = new Set(Array.isArray(days) ? days : [])
//   if (set.size === 5 && [0, 1, 2, 3, 4].every((d) => set.has(d))) return "Mon–Fri"
//   if (set.size === 7) return "Every day"
//   return Array.from(set).sort((a, b) => a - b).map((d) => map[d] || "?").join(", ")
// }
// function setSort(nextKey, setKey, setDir) {
//   setKey((prevKey) => {
//     if (prevKey === nextKey) { setDir((d) => (d === "asc" ? "desc" : "asc")); return prevKey }
//     else { setDir(nextKey === "created_at" ? "desc" : "asc"); return nextKey }
//   })
// }

// function ButtonPrimary({ children, onClick, disabled, icon, type = "button" }) {
//   return (
//     <motion.button whileHover={!disabled ? { scale: 1.02 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}
//       type={type} onClick={onClick} disabled={disabled}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-semibold text-white transition-all duration-200",
//         "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700",
//         "shadow-[0_8px_24px_-12px_rgba(37,99,235,0.55)] hover:shadow-[0_12px_32px_-12px_rgba(37,99,235,0.65)]",
//         "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
//       )}
//     >
//       {icon}
//       <span className="whitespace-nowrap">{children}</span>
//     </motion.button>
//   )
// }
// function ButtonGhost({ children, onClick, icon, type = "button", disabled }) {
//   return (
//     <motion.button whileHover={!disabled ? { scale: 1.02 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}
//       type={type} onClick={onClick} disabled={disabled}
//       className={cx(
//         "inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-medium text-slate-800 ring-1 ring-white/70 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm",
//         disabled && "opacity-60 cursor-not-allowed",
//       )}
//     >
//       {icon}
//       <span className="whitespace-nowrap">{children}</span>
//     </motion.button>
//   )
// }
// function PagerButton({ children, disabled, onClick }) {
//   return (
//     <motion.button whileHover={!disabled ? { scale: 1.02 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}
//       disabled={disabled} onClick={onClick}
//       className={cx(
//         "inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl border px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200",
//         disabled ? "cursor-not-allowed border-slate-200 text-slate-400 bg-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:shadow-sm",
//       )}
//     >
//       {children}
//     </motion.button>
//   )
// }
// function Th({ children, sortKey, sortBy, sortDir, onSort }) {
//   const active = sortBy === sortKey
//   return (
//     <th className={cx("px-5 py-3 font-semibold select-none cursor-pointer", active && "text-slate-900")} onClick={() => onSort(sortKey)} title="Sort">
//       <span className="inline-flex items-center gap-1">
//         {children}
//         <span className={cx("text-xs", active ? "opacity-100" : "opacity-20")}>{active ? (sortDir === "asc" ? "▲" : "▼") : "▲"}</span>
//       </span>
//     </th>
//   )
// }
// function RowSkeleton({ rows = 6, cols = 6 }) {
//   return (
//     <>
//       {Array.from({ length: rows }).map((_, r) => (
//         <tr key={r} className="animate-pulse">
//           {Array.from({ length: cols }).map((__, c) => (
//             <td key={c} className="px-5 py-3"><div className="h-4 w-28 rounded bg-slate-100" /></td>
//           ))}
//         </tr>
//       ))}
//     </>
//   )
// }
// function Field({ label, name, value, onChange, type = "text", placeholder, className }) {
//   return (
//     <label className={cx("block", className)}>
//       <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
//       <input type={type} name={name} value={value ?? ""} onChange={onChange} placeholder={placeholder}
//         className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300" />
//     </label>
//   )
// }































"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-toastify"
import {
  Search,
  RefreshCw,
  X,
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Play,
  Pause,
  Square as StopSquare,
  Trash2,
  Eye,
  Download,
  Settings,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock3,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

/* ──────────────────────────────────────────────────────────────────────────
 * Config — aligns to backend:
 *   POST/GET   /campaigns
 *   GET        /campaigns/{id}
 *   GET        /campaigns/{id}/stats
 *   POST       /campaigns/{id}/schedule
 *   POST       /campaigns/{id}/retry-policy
 *   POST       /campaigns/{id}/pause
 *   POST       /campaigns/{id}/resume
 *   POST       /campaigns/{id}/stop
 *   POST       /campaigns/{id}/run-now
 *   POST       /campaigns/{id}/refresh-leads
 *   GET        /campaigns/{id}/calendar.ics
 *   DELETE     /campaigns/{id}
 * ────────────────────────────────────────────────────────────────────────── */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000"
const API_PREFIX = import.meta.env?.VITE_API_PREFIX || "/api"

/** If your router is mounted with prefix "/campaigns", and the routes inside also start with "/campaigns",
 * keep the double "campaigns" below. If your mount does NOT add a prefix, change CAMPAIGNS_BASE to
 * `${API_URL}${API_PREFIX}/campaigns` (single "campaigns"). */
const CAMPAIGNS_BASE = `${API_URL}${API_PREFIX}/campaigns/campaigns`

const EP = {
  LIST: CAMPAIGNS_BASE,
  CREATE: CAMPAIGNS_BASE,
  DETAIL: (id) => `${CAMPAIGNS_BASE}/${id}`,
  STATS: (id) => `${CAMPAIGNS_BASE}/${id}/stats`,
  SCHEDULE: (id) => `${CAMPAIGNS_BASE}/${id}/schedule`,
  RETRY: (id) => `${CAMPAIGNS_BASE}/${id}/retry-policy`,
  PAUSE: (id) => `${CAMPAIGNS_BASE}/${id}/pause`,
  RESUME: (id) => `${CAMPAIGNS_BASE}/${id}/resume`,
  STOP: (id) => `${CAMPAIGNS_BASE}/${id}/stop`,
  RUN_NOW: (id) => `${CAMPAIGNS_BASE}/${id}/run-now`,
  ICS: (id) => `${CAMPAIGNS_BASE}/${id}/calendar.ics`,
  DELETE: (id) => `${CAMPAIGNS_BASE}/${id}`,
  REFRESH_LEADS: (id) => `${CAMPAIGNS_BASE}/${id}/refresh-leads`,
}

// Resource endpoints (HubSpot remains as-is in your backend — no other CRMs referenced here)
const RESOURCES = {
  FILES: `${API_URL}${API_PREFIX}/files`,
  ASSISTANTS: `${API_URL}${API_PREFIX}/get-assistants`,
  LEADS: (fileId) => `${API_URL}${API_PREFIX}/leads${fileId ? `?file_id=${fileId}` : ""}`,
}

/* Utilities */
function cx(...arr) { return arr.filter(Boolean).join(" ") }
const unknown = (v) => {
  if (v === undefined || v === null) return "Unknown"
  const s = String(v).trim()
  return s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined" ? "Unknown" : s
}
function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t) }, [value, delay])
  return debounced
}
function fmtDT(d) {
  try { const dt = new Date(d); if (isNaN(dt.getTime())) return "Unknown"; return dt.toLocaleString() } catch { return "Unknown" }
}
function fmtTimeShort(d) {
  try { const dt = new Date(d); if (isNaN(dt.getTime())) return "—"; return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } catch { return "—" }
}
function toInputDateTimeLocal(value) {
  if (!value) return ""
  const d = new Date(value)
  if (isNaN(d.getTime())) return ""
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const hh = String(d.getHours()).padStart(2, "0")
  const mi = String(d.getMinutes()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}
function fromInputDateTimeLocal(s) { if (!s) return null; const d = new Date(s); return isNaN(d.getTime()) ? null : d.toISOString() }
function timeUntil(ts) {
  if (!ts) return "—"
  const to = new Date(ts).getTime()
  if (Number.isNaN(to)) return "—"
  const diff = Math.max(0, to - Date.now())
  const s = Math.floor(diff / 1000)
  const m = Math.floor(s / 60)
  const rS = s % 60
  if (m > 0) return `${m}m ${rS}s`
  return `${rS}s`
}

/* Motion variants */
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } } }
const stagger = { show: { transition: { staggerChildren: 0.05 } } }
const overlay = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.18 } }, exit: { opacity: 0, transition: { duration: 0.12 } } }
const slideInFromBottom = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.4 } }, exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } } }
const modalVariants = { hidden: { opacity: 0, scale: 0.8, y: 50 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.5 } }, exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } } }
const stepTransition = { hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } }, exit: { opacity: 0, x: -20, transition: { duration: 0.2 } } }

/* Pill chip */
function Chip({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    red: "bg-rose-100 text-rose-700 ring-rose-200",
    blue: "bg-blue-100 text-blue-700 ring-blue-200",
    orange: "bg-orange-100 text-orange-700 ring-orange-200",
    purple: "bg-purple-100 text-purple-700 ring-purple-200",
    amber: "bg-amber-100 text-amber-700 ring-amber-200",
    indigo: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  }
  return (
    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
      className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", tones[tone] || tones.slate)}>
      {children}
    </motion.span>
  )
}

/* Stat card */
function StatCard({ label, value, Icon, tone = "blue" }) {
  const ring = tone === "blue" ? "ring-blue-200/60" : tone === "cyan" ? "ring-cyan-200/60" : "ring-slate-200/60"
  const bg = tone === "blue" ? "from-blue-600 to-cyan-500" : tone === "cyan" ? "from-cyan-500 to-blue-600" : "from-slate-500 to-slate-700"
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
  )
}

/* Status chip */
function StatusChip({ status }) {
  const s = String(status || "").toLowerCase()
  if (s === "scheduled") return <Chip tone="blue">Scheduled</Chip>
  if (s === "running") return <Chip tone="green">Running</Chip>
  if (s === "paused") return <Chip tone="orange">Paused</Chip>
  if (s === "stopped") return <Chip tone="red">Stopped</Chip>
  if (s === "completed") return <Chip tone="purple">Completed</Chip>
  if (s === "draft") return <Chip tone="slate">Draft</Chip>
  return <Chip tone="slate">{unknown(status)}</Chip>
}

/* Timezones */
const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Chicago", label: "America/Chicago" },
  { value: "America/Denver", label: "America/Denver" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "America/Phoenix", label: "America/Phoenix" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
  { value: "Europe/Paris", label: "Europe/Paris" },
  { value: "Asia/Karachi", label: "Asia/Karachi" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata" },
  { value: "Asia/Singapore", label: "Asia/Singapore" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Asia/Dubai", label: "Asia/Dubai" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
]

/* ──────────────────────────────────────────────────────────────────────────
 * Progress bars
 * ────────────────────────────────────────────────────────────────────────── */
function percent(done, total) {
  const d = Number(done) || 0
  const t = Number(total) || 0
  if (t <= 0) return 0
  const v = Math.round((d / t) * 100)
  return Math.min(100, Math.max(0, v))
}

function LivePulse({ active = false }) {
  if (!active) return null
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  )
}

function RowProgress({ done, total, status }) {
  const p = percent(done, total)
  const active = ["scheduled", "running"].includes(String(status || "").toLowerCase())
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="relative h-2 w-36 rounded-full bg-slate-200 overflow-hidden">
        <motion.div
          className={cx("h-full bg-gradient-to-r from-blue-500 to-cyan-500", active && "shadow-[0_0_0_2px_rgba(59,130,246,0.15)]")}
          initial={{ width: 0 }}
          animate={{ width: `${p}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
        />
      </div>
      <div className="text-xs font-medium text-slate-700 tabular-nums">{(Number(done) || 0)}/{(Number(total) || 0)}</div>
      <LivePulse active={active} />
    </div>
  )
}

function SegmentedProgress({ totals }) {
  const total = totals?.total || 0
  const done = totals?.done || 0
  const calling = totals?.calling || 0
  const retry = totals?.retry || 0
  const pending = totals?.pending || 0
  const seg = (n) => (total > 0 ? `${(n / total) * 100}%` : "0%")

  return (
    <div className="w-full">
      <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden ring-1 ring-white/60 relative">
        <motion.div className="h-full bg-emerald-500 absolute left-0 top-0" style={{ width: seg(done) }} initial={{ width: 0 }} animate={{ width: seg(done) }} />
        <motion.div className="h-full bg-indigo-500 absolute left-0 top-0" style={{ width: seg(done + calling) }} initial={{ width: 0 }} animate={{ width: seg(done + calling) }} />
        <motion.div className="h-full bg-amber-500 absolute left-0 top-0" style={{ width: seg(done + calling + retry) }} initial={{ width: 0 }} animate={{ width: seg(done + calling + retry) }} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-700">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" />Done {done}</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-indigo-500" />Calling {calling}</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500" />Retry {retry}</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-400" />Pending {pending}</span>
        <span className="ml-auto font-semibold tabular-nums">{percent(done, total)}%</span>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 * Page: Campaigns
 * ────────────────────────────────────────────────────────────────────────── */
export default function CampaignsPage() {
  const token = useRef(localStorage.getItem("token") || null)

  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [files, setFiles] = useState([])
  const [assistants, setAssistants] = useState([])
  const [leadsForFile, setLeadsForFile] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(false)

  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 250)

  // Sorting & paging
  const [sortBy, setSortBy] = useState("created_at")
  const [sortDir, setSortDir] = useState("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Create modal
  const [showCreate, setShowCreate] = useState(false)
  const [step, setStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    file_id: "",
    assistant_id: "",
    selection_mode: "ALL",
    include_lead_ids: [],
    exclude_lead_ids: [],
    timezone: "America/Los_Angeles",
    days_of_week: [0, 1, 2, 3, 4],
    daily_start: "09:00",
    daily_end: "18:00",
    start_at: "",
    end_at: "",
    calls_per_minute: 10,
    parallel_calls: 2,
    retry_on_busy: true,
    busy_retry_delay_minutes: 15,
    max_attempts: 3,
    description: "",
  })
  const [leadSearch, setLeadSearch] = useState("")

  // Details drawer
  const [showDetails, setShowDetails] = useState(false)
  const [activeCampaign, setActiveCampaign] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [details, setDetails] = useState(null)

  // Live stats for the open campaign
  const [stats, setStats] = useState(null)

  // Auto-poll while details open (details + stats)
  useEffect(() => {
    if (!showDetails || !activeCampaign?.id) return
    // fetch immediately
    loadDetails(activeCampaign.id)
    loadStats(activeCampaign.id)
    const timer = setInterval(() => {
      loadDetails(activeCampaign.id)
      loadStats(activeCampaign.id)
      fetchCampaigns() // keep list in sync
    }, 4000)
    return () => clearInterval(timer)
    // eslint-disable-next-line
  }, [showDetails, activeCampaign?.id])

  /* Fetch on mount */
  useEffect(() => {
    if (!token.current) {
      setLoading(false)
      toast.error("No auth token found. Please log in.")
      return
    }
    fetchAll()
    // eslint-disable-next-line
  }, [])

  async function fetchAll() {
    setLoading(true)
    try { await Promise.all([fetchCampaigns(), fetchFiles(), fetchAssistants()]) }
    finally { setLoading(false) }
  }

  async function authedFetch(url, options = {}) {
    if (!token.current) {
      toast.error("No auth token found. Please log in.")
      throw new Error("No token")
    }
    const res = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token.current}` },
    })
    return res
  }

  async function fetchCampaigns() {
    try {
      const res = await authedFetch(EP.LIST)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCampaigns(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      toast.error("Failed to fetch campaigns")
      setCampaigns([])
    }
  }

  async function fetchFiles() {
    try {
      const res = await authedFetch(RESOURCES.FILES)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setFiles(Array.isArray(data) ? data : data?.items || [])
    } catch (e) {
      console.warn("Files fetch failed:", e.message)
      setFiles([])
    }
  }

  async function fetchAssistants() {
    try {
      const res = await authedFetch(RESOURCES.ASSISTANTS)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const arr = (Array.isArray(data) && data) || data?.items || data?.assistants || data?.data || []
      const normalized = arr.filter((a) => a && a.id !== undefined && a.id !== null)
      setAssistants(normalized)
    } catch (e) {
      console.warn("Assistants fetch failed:", e.message)
      setAssistants([])
    }
  }

  async function loadLeadsForFile(fileId) {
    if (!fileId) { setLeadsForFile([]); return }
    try {
      setLeadsLoading(true)
      const res = await authedFetch(RESOURCES.LEADS(fileId))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const list = Array.isArray(json) ? json : json?.leads || json?.items || []
      setLeadsForFile(list)
    } catch (e) {
      console.warn("Leads fetch failed:", e.message)
      setLeadsForFile([])
    } finally {
      setLeadsLoading(false)
    }
  }

  async function refreshAll() {
    setRefreshing(true)
    try { await fetchCampaigns() }
    finally { setRefreshing(false) }
  }

  /* Derived list */
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    const list = campaigns.filter((c) => {
      if (!q) return true
      const fields = [(c.name || "").toLowerCase(), (c.status || "").toLowerCase(), String(c.id || ""), String(c.file_id || ""), String(c.assistant_id || "")]
      return fields.some((f) => f.includes(q))
    })
    const dir = sortDir === "asc" ? 1 : -1
    list.sort((a, b) => {
      let va, vb
      switch (sortBy) {
        case "name": va = (a.name || "").toLowerCase(); vb = (b.name || "").toLowerCase(); break
        case "status": va = (a.status || "").toLowerCase(); vb = (b.status || "").toLowerCase(); break
        case "calls_per_minute": va = a.calls_per_minute || 0; vb = b.calls_per_minute || 0; break
        case "created_at":
        default: va = new Date(a.created_at || 0).getTime(); vb = new Date(b.created_at || 0).getTime()
      }
      if (va < vb) return -1 * dir
      if (va > vb) return 1 * dir
      return 0
    })
    return list
  }, [campaigns, debouncedQuery, sortBy, sortDir])

  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pageItems = filtered.slice(start, end)

  // Header stats
  const listStats = useMemo(() => {
    const total = filtered.length
    const running = filtered.filter((c) => (c.status || "").toLowerCase() === "running").length
    const paused = filtered.filter((c) => (c.status || "").toLowerCase() === "paused").length
    return { total, running, paused }
  }, [filtered])

  /* Create: behavior */
  function onCreateChange(e) {
    const { name, value, type, checked } = e.target
    setCreateForm((f) => {
      const next = { ...f, [name]: type === "checkbox" ? checked : value }
      if (name === "file_id") {
        const fileIdNum = Number(value) || ""
        if (fileIdNum) loadLeadsForFile(fileIdNum)
        else setLeadsForFile([])
        next.include_lead_ids = []
        next.exclude_lead_ids = []
      }
      if (name === "selection_mode") {
        next.include_lead_ids = []
        next.exclude_lead_ids = []
      }
      return next
    })
  }
  function toggleDOW(d) {
    setCreateForm((f) => {
      const has = f.days_of_week.includes(d)
      const days = has ? f.days_of_week.filter((x) => x !== d) : [...f.days_of_week, d]
      days.sort((a, b) => a - b)
      return { ...f, days_of_week: days }
    })
  }

  async function createCampaign() {
    if (!createForm.name || !createForm.file_id || !createForm.assistant_id) {
      toast.error("Name, File and Assistant are required.")
      return
    }
    if (createForm.selection_mode !== "ALL" && createForm.file_id && leadsForFile.length === 0) {
      toast.error("No leads available for the selected file.")
      return
    }

    const payload = {
      name: String(createForm.name).trim(),
      file_id: Number(createForm.file_id),
      assistant_id: Number(createForm.assistant_id),
      selection_mode: createForm.selection_mode,
      include_lead_ids: createForm.selection_mode === "ONLY" && createForm.include_lead_ids?.length ? createForm.include_lead_ids : null,
      exclude_lead_ids: createForm.selection_mode === "SKIP" && createForm.exclude_lead_ids?.length ? createForm.exclude_lead_ids : null,
      timezone: createForm.timezone || "America/Los_Angeles",
      days_of_week: createForm.days_of_week,
      daily_start: createForm.daily_start || "09:00",
      daily_end: createForm.daily_end || "18:00",
      start_at: fromInputDateTimeLocal(createForm.start_at),
      end_at: fromInputDateTimeLocal(createForm.end_at),
      calls_per_minute: Number(createForm.calls_per_minute) || 10,
      parallel_calls: Number(createForm.parallel_calls) || 2,
      retry_on_busy: !!createForm.retry_on_busy,
      busy_retry_delay_minutes: Number(createForm.busy_retry_delay_minutes) || 15,
      max_attempts: Number(createForm.max_attempts) || 3,
    }

    try {
      setCreating(true)
      const res = await authedFetch(EP.CREATE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
      toast.success(json?.detail || "Campaign created.")
      setShowCreate(false)
      setStep(1)
      setCreateForm((f) => ({ ...f, name: "", include_lead_ids: [], exclude_lead_ids: [] }))
      await fetchCampaigns()
    } catch (e) {
      console.error(e)
      toast.error(e?.message || "Create failed")
    } finally {
      setCreating(false)
    }
  }

  /* Details & Stats */
  async function openDetails(c) {
    setActiveCampaign(c)
    setShowDetails(true)
    await Promise.all([loadDetails(c.id), loadStats(c.id)])
  }
  async function loadDetails(id) {
    if (!id) return
    try {
      setDetailsLoading(true)
      const res = await authedFetch(EP.DETAIL(id))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setDetails(json)
    } catch (e) {
      console.error(e)
      toast.error("Failed to load campaign details")
      setDetails(null)
    } finally {
      setDetailsLoading(false)
    }
  }
  async function loadStats(id) {
    if (!id) return
    try {
      const res = await authedFetch(EP.STATS(id))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setStats(json)
    } catch (e) {
      console.error(e)
      // silent during polling
    }
  }

  /* Controls */
  async function postAction(urlBuilder, id, okMsg) {
    try {
      const res = await authedFetch(urlBuilder(id), { method: "POST" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
      toast.success(json?.detail || okMsg)
      await fetchCampaigns()
      if (activeCampaign && activeCampaign.id === id) {
        await loadDetails(id)
        await loadStats(id)
      }
    } catch (e) {
      console.error(e)
      toast.error(e?.message || "Action failed")
    }
  }
  const doPause = (id) => postAction(EP.PAUSE, id, "Paused")
  const doResume = (id) => postAction(EP.RESUME, id, "Resumed")
  const doStop = (id) => postAction(EP.STOP, id, "Stopped")
  const doRefreshLeads = (id) => postAction(EP.REFRESH_LEADS, id, "Leads synced")

  async function doDelete(id) {
    if (!confirm("Delete this campaign and its progress rows?")) return
    try {
      const res = await authedFetch(EP.DELETE(id), { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
      toast.success(json?.detail || "Deleted")
      setShowDetails(false)
      setActiveCampaign(null)
      await fetchCampaigns()
    } catch (e) {
      console.error(e)
      toast.error(e?.message || "Delete failed")
    }
  }

  async function doRunNow(id, batchSize) {
    try {
      const res = await authedFetch(EP.RUN_NOW(id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_size: Number(batchSize) || 5 }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
      toast.success(json?.detail || "Triggered.")
      await loadStats(id)
    } catch (e) {
      console.error(e)
      toast.error(e?.message || "Run-now failed")
    }
  }

  async function updateSchedule(id, form) {
    const payload = {
      timezone: form.timezone || undefined,
      days_of_week: form.days_of_week?.length ? form.days_of_week : undefined,
      daily_start: form.daily_start || undefined,
      daily_end: form.daily_end || undefined,
      start_at: fromInputDateTimeLocal(form.start_at),
      end_at: fromInputDateTimeLocal(form.end_at),
    }
    try {
      const res = await authedFetch(EP.SCHEDULE(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
      toast.success(json?.detail || "Schedule updated")
      await fetchCampaigns()
      await loadDetails(id)
      await loadStats(id)
    } catch (e) {
      console.error(e)
      toast.error(e?.message || "Update failed")
    }
  }

  async function updateRetryPolicy(id, form) {
    const payload = {
      retry_on_busy: !!form.retry_on_busy,
      busy_retry_delay_minutes: Number(form.busy_retry_delay_minutes) || 15,
      max_attempts: Number(form.max_attempts) || 3,
    }
    try {
      const res = await authedFetch(EP.RETRY(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.detail || `HTTP ${res.status}`)
      toast.success(json?.detail || "Retry policy updated")
      await loadDetails(id)
      await loadStats(id)
    } catch (e) {
      console.error(e)
      toast.error(e?.message || "Update failed")
    }
  }

  async function downloadICS(id, name = "campaign") {
    try {
      const res = await authedFetch(EP.ICS(id))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${name || "campaign"}.ics`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      toast.error("ICS download failed")
    }
  }

  const handleOpenCreate = () => { setShowCreate(true); setStep(1) }
  const handleCloseCreate = () => {
    setShowCreate(false); setStep(1)
    setCreateForm((f) => ({ ...f, name: "", include_lead_ids: [], exclude_lead_ids: [] }))
  }
  const handleNext = () => { setStep((s) => Math.min(6, s + 1)) }
  const handleBack = () => { setStep((s) => Math.max(1, s - 1)) }

  /* Render */
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Campaigns</h1>
            <p className="mt-1 text-sm sm:text-base text-slate-600">Manage your calling campaigns and schedules.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ButtonGhost onClick={refreshAll} disabled={refreshing} icon={refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}>
              <span className="hidden sm:inline">Refresh</span>
            </ButtonGhost>
            <ButtonPrimary onClick={handleOpenCreate} icon={<Plus className="h-4 w-4" />}>
              <span className="hidden sm:inline">Create Campaign</span>
              <span className="sm:hidden">Create</span>
            </ButtonPrimary>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative sm:col-span-1 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search name, status, IDs…"
              className="w-full rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/60 transition focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300"
              aria-label="Search campaigns"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-xs sm:text-sm text-slate-600 hidden sm:block">
              Total: <span className="font-semibold text-slate-900">{totalItems}</span>
            </div>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none ring-1 ring-white/60 focus:ring-2 focus:ring-cyan-400/40"
              aria-label="Rows per page"
            >
              {[10, 20, 40, 80].map((n) => (<option key={n} value={n}>{n} / page</option>))}
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={fadeUp}><StatCard label="Total Campaigns" value={listStats.total} Icon={Users} tone="blue" /></motion.div>
          <motion.div variants={fadeUp}><StatCard label="Running" value={listStats.running} Icon={CheckCircle2} tone="cyan" /></motion.div>
          <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1"><StatCard label="Paused" value={listStats.paused} Icon={XCircle} tone="blue" /></motion.div>
        </motion.div>

        {/* Table */}
        <motion.div initial="hidden" animate="show" variants={slideInFromBottom} className="mt-4 sm:mt-6 overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur ring-1 ring-white/50">
          <div className="min-w-full">
            {/* Mobile Cards */}
            <div className="block sm:hidden">
              {loading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="animate-pulse bg-slate-100 rounded-xl p-4 h-24" />))}
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {pageItems.map((camp, idx) => {
                    const total = camp.counts?.total || 0
                    const done = camp.counts?.completed_or_failed || 0
                    return (
                      <motion.div key={camp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openDetails(camp)}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{unknown(camp.name)}</h3>
                            <p className="text-xs text-slate-500">ID: {camp.id}</p>
                          </div>
                          <StatusChip status={camp.status} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                          <span>{fmtDT(camp.created_at)}</span>
                          <span>{total} leads</span>
                        </div>
                        <RowProgress done={done} total={total} status={camp.status} />
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <table className="hidden sm:table min-w-full text-left">
              <thead className="bg-slate-50/50 backdrop-blur">
                <tr>
                  <Th sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Name</Th>
                  <Th sortKey="status" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Status</Th>
                  <th className="px-5 py-3 font-semibold">File</th>
                  <th className="px-5 py-3 font-semibold">Assistant</th>
                  <Th sortKey="calls_per_minute" sortBy={sortBy} sortDir={sortDir} onSort={(k) => setSort(k, setSortBy, setSortDir)}>Pacing</Th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 font-semibold">Leads</th>
                  <th className="px-5 py-3 font-semibold">Progress</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <RowSkeleton rows={pageSize} cols={9} />
                ) : pageItems.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-4 text-center text-sm text-slate-500">No campaigns found.</td></tr>
                ) : (
                  pageItems.map((camp) => {
                    const total = camp.counts?.total || 0
                    const done = camp.counts?.completed_or_failed || 0
                    return (
                      <tr key={camp.id} className="group/row hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-900">
                          <button onClick={() => openDetails(camp)} className="group/cell flex items-center gap-2 text-left">{unknown(camp.name)}</button>
                        </td>
                        <td className="px-5 py-3"><StatusChip status={camp.status} /></td>
                        <td className="px-5 py-3 text-slate-700">{camp.file_id}</td>
                        <td className="px-5 py-3 text-slate-700">{camp.assistant_id}</td>
                        <td className="px-5 py-3 text-slate-700">{camp.calls_per_minute}</td>
                        <td className="px-5 py-3 text-slate-600">{fmtDT(camp.created_at)}</td>
                        <td className="px-5 py-3 text-slate-700">{total}</td>
                        <td className="px-5 py-3"><RowProgress done={done} total={total} status={camp.status} /></td>
                        <td className="px-5 py-3 text-right">
                          <div className="invisible group-hover/row:visible flex items-center justify-end gap-2">
                            <ButtonGhost onClick={() => downloadICS(camp.id, camp?.name)} icon={<Download className="h-4 w-4" />}>ICS</ButtonGhost>
                            <ButtonGhost onClick={() => openDetails(camp)} icon={<Eye className="h-4 w-4" />}>Details</ButtonGhost>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm text-slate-600 order-2 sm:order-1">
            Showing {totalItems === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
          </div>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <PagerButton disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" /><span className="hidden sm:inline">Previous</span></PagerButton>
            <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-700">{page} of {totalPages}</span>
            <PagerButton disabled={page >= totalPages} onClick={() => setPage(page + 1)}><span className="hidden sm:inline">Next</span><ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /></PagerButton>
          </div>
        </motion.div>
      </main>

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={handleCloseCreate} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6" variants={modalVariants} initial="hidden" animate="show" exit="exit">
              <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl xl:max-w-4xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" /></div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Create Campaign</h2>
                      <p className="text-xs sm:text-sm text-slate-600">Step {step} of 6</p>
                    </div>
                  </div>
                  <button onClick={handleCloseCreate} className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors" aria-label="Close"><X className="h-4 w-4 sm:h-5 sm:w-5" /></button>
                </div>

                {/* Progress Bar */}
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-50/50">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div key={i}
                        className={cx("flex-1 h-1.5 sm:h-2 rounded-full transition-colors duration-300", i <= step ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-slate-200")}
                        initial={{ scaleX: 0 }} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span className="hidden sm:inline">Details</span>
                    <span className="hidden sm:inline">Files</span>
                    <span className="hidden sm:inline">Leads</span>
                    <span className="hidden sm:inline">Schedule</span>
                    <span className="hidden sm:inline">Pacing</span>
                    <span className="hidden sm:inline">Review</span>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div key={step} variants={stepTransition} initial="hidden" animate="show" exit="exit" className="p-4 sm:p-6 lg:p-8">
                      {step === 1 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Campaign Details</h3>
                            <p className="text-sm text-slate-600">Set up the basic information for your campaign.</p>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
                              <input value={createForm.name} onChange={onCreateChange} name="name" placeholder="Enter campaign name"
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Assistant</label>
                              <select value={createForm.assistant_id} onChange={onCreateChange} name="assistant_id"
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
                                <option value="">Select assistant</option>
                                {assistants.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description (optional)</label>
                            <textarea value={createForm.description} onChange={onCreateChange} name="description" placeholder="Describe your campaign..." rows={3}
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition resize-none" />
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select File</h3>
                            <p className="text-sm text-slate-600">Choose the file containing the leads for your campaign.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
                            <select value={createForm.file_id} onChange={onCreateChange} name="file_id"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
                              <option value="">Select file</option>
                              {files.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
                            </select>
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select Leads</h3>
                            <p className="text-sm text-slate-600">Choose which leads to include in your campaign.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Selection Mode</label>
                            <select value={createForm.selection_mode} onChange={onCreateChange} name="selection_mode"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition">
                              <option value="ALL">All Leads</option>
                              <option value="ONLY">Only These Leads</option>
                              <option value="SKIP">Skip These Leads</option>
                            </select>
                          </div>
                          {createForm.selection_mode !== "ALL" && (
                            <div className="space-y-3">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                <input value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search leads…"
                                  className="w-full rounded-xl border border-slate-200 px-9 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300 outline-none transition" />
                              </div>
                              {leadsLoading ? (
                                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
                                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3" /> Loading leads…
                                </div>
                              ) : (
                                <LeadMultiSelect
                                  leads={leadsForFile}
                                  mode={createForm.selection_mode}
                                  search={leadSearch}
                                  selectedIds={createForm.selection_mode === "ONLY" ? createForm.include_lead_ids : createForm.exclude_lead_ids}
                                  onChange={(ids) => {
                                    if (createForm.selection_mode === "ONLY") setCreateForm((f) => ({ ...f, include_lead_ids: ids }))
                                    else setCreateForm((f) => ({ ...f, exclude_lead_ids: ids }))
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {step === 4 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Schedule</h3>
                            <p className="text-sm text-slate-600">Set up the schedule for your campaign.</p>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <label className="block">
                              <span className="mb-1 block text-sm font-semibold text-slate-700">Timezone (IANA)</span>
                              <select name="timezone" value={createForm.timezone} onChange={onCreateChange}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
                                {TIMEZONES.map((tz) => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
                              </select>
                            </label>
                            <div>
                              <div className="text-sm text-slate-700 mb-2">Days of week</div>
                              <div className="flex flex-wrap gap-2">
                                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                                  <button key={d} type="button" onClick={() => toggleDOW(d)}
                                    className={cx("px-3 py-1.5 rounded-xl border text-sm",
                                      createForm.days_of_week.includes(d) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700")}>
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d]}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Daily start" name="daily_start" value={createForm.daily_start} onChange={onCreateChange} placeholder="HH:MM" />
                              <Field label="Daily end" name="daily_end" value={createForm.daily_end} onChange={onCreateChange} placeholder="HH:MM" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Start at (optional)" name="start_at" type="datetime-local" value={createForm.start_at} onChange={onCreateChange} />
                              <Field label="End at (optional)" name="end_at" type="datetime-local" value={createForm.end_at} onChange={onCreateChange} />
                            </div>
                          </div>
                        </div>
                      )}
                      {step === 5 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Pacing</h3>
                            <p className="text-sm text-slate-600">Set up the pacing for your campaign.</p>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <Field label="Calls per minute" name="calls_per_minute" value={createForm.calls_per_minute} onChange={onCreateChange} />
                            <Field label="Parallel calls" name="parallel_calls" value={createForm.parallel_calls} onChange={onCreateChange} />
                            <label className="inline-flex items-center gap-2">
                              <input type="checkbox" name="retry_on_busy" checked={!!createForm.retry_on_busy} onChange={onCreateChange} />
                              <span className="text-sm text-slate-800">Retry on busy / no-answer</span>
                            </label>
                            <Field label="Busy retry delay (min)" name="busy_retry_delay_minutes" value={createForm.busy_retry_delay_minutes} onChange={onCreateChange} />
                            <Field label="Max attempts" name="max_attempts" value={createForm.max_attempts} onChange={onCreateChange} />
                          </div>
                        </div>
                      )}
                      {step === 6 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Review</h3>
                            <p className="text-sm text-slate-600">Review your campaign details before creating.</p>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <div><div className="text-sm font-semibold text-slate-700">Name</div><div className="text-sm text-slate-600">{createForm.name || "—"}</div></div>
                            <div><div className="text-sm font-semibold text-slate-700">File</div><div className="text-sm text-slate-600">{files.find((f) => String(f.id) === String(createForm.file_id))?.name || "—"}</div></div>
                            <div><div className="text-sm font-semibold text-slate-700">Assistant</div><div className="text-sm text-slate-600">{assistants.find((a) => String(a.id) === String(createForm.assistant_id))?.name || "—"}</div></div>
                            <div><div className="text-sm font-semibold text-slate-700">Schedule</div><div className="text-sm text-slate-600">{dowLabel(createForm.days_of_week)} · {createForm.daily_start}–{createForm.daily_end} ({createForm.timezone})</div></div>
                            <div><div className="text-sm font-semibold text-slate-700">Pacing</div><div className="text-sm text-slate-600">{createForm.calls_per_minute} CPM · {createForm.parallel_calls} parallel</div></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 order-2 sm:order-1">
                    {step > 1 && (
                      <ButtonGhost onClick={handleBack} icon={<ChevronLeft className="h-4 w-4" />}>
                        <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Back</span>
                      </ButtonGhost>
                    )}
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    {step < 6 ? (
                      <ButtonPrimary onClick={handleNext} icon={<ChevronRight className="h-4 w-4" />}>
                        <span className="hidden sm:inline">Next Step</span><span className="sm:hidden">Next</span>
                      </ButtonPrimary>
                    ) : (
                      <ButtonPrimary onClick={createCampaign} disabled={creating} icon={creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}>
                        {creating ? "Creating..." : "Create Campaign"}
                      </ButtonPrimary>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Details Drawer */}
      <AnimatePresence>
        {showDetails && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={() => setShowDetails(false)} />
            <motion.section
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[90vw] md:w-[620px] lg:w-[880px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
              initial={{ x: "100%" }} animate={{ x: 0, transition: { type: "spring", stiffness: 260, damping: 28 } }} exit={{ x: "100%", transition: { duration: 0.2 } }}
              aria-label="Campaign details"
            >
              {/* Topbar */}
              <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <button onClick={() => setShowDetails(false)} className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50 flex-shrink-0" aria-label="Close"><X className="h-4 w-4 sm:h-5 sm:w-5" /></button>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold leading-tight truncate">Campaign #{activeCampaign?.id}</h3>
                      <p className="text-xs text-slate-600 truncate">{unknown(activeCampaign?.name)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ButtonGhost onClick={() => downloadICS(activeCampaign.id, activeCampaign?.name)} icon={<Download className="h-4 w-4" />}>
                      <span className="hidden sm:inline">ICS</span>
                    </ButtonGhost>
                  </div>
                </div>

                {/* Live header */}
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                    <div className="flex items-center gap-2">
                      <StatusChip status={stats?.status || details?.status || activeCampaign?.status} />
                      <LivePulse active={!!stats?.active_now} />
                      {stats?.active_now ? <Chip tone="green">Active now</Chip> : <Chip tone="amber">Idle</Chip>}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-slate-500" />
                        <div className="truncate">
                          <span className="text-slate-500">Local:</span>{" "}
                          <span className="font-medium text-slate-800">{fmtDT(stats?.now?.local) || "—"}</span>
                        </div>
                      </div>
                      <div className="truncate">
                        <span className="text-slate-500">Window: </span>
                        <span className="font-medium text-slate-800">
                          {dowLabel(stats?.window?.days_of_week ?? details?.days_of_week ?? activeCampaign?.days_of_week)} ·{" "}
                          {(stats?.window?.daily_start || details?.daily_start || activeCampaign?.daily_start || "09:00")}–{(stats?.window?.daily_end || details?.daily_end || activeCampaign?.daily_end || "18:00")}{" "}
                          ({stats?.timezone || details?.timezone || activeCampaign?.timezone || "Local"})
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="text-slate-500">Next tick:</span>{" "}
                        <span className="font-medium text-slate-800">{stats?.next_tick_at ? `${fmtTimeShort(stats.next_tick_at)} · in ${timeUntil(stats.next_tick_at)}` : "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <SegmentedProgress totals={stats?.totals || details?.totals} />
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                {/* Info strip */}
                <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</div>
                    <StatusChip status={stats?.status || details?.status || activeCampaign?.status} />
                  </motion.div>
                  <motion.div variants={fadeUp} className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Window</div>
                    <div className="text-sm text-slate-800">
                      <div className="truncate">{dowLabel(stats?.window?.days_of_week ?? details?.days_of_week ?? activeCampaign?.days_of_week)}</div>
                      <div className="text-xs sm:text-sm">
                        {(stats?.window?.daily_start || details?.daily_start || activeCampaign?.daily_start || "09:00") + "–" + (stats?.window?.daily_end || details?.daily_end || activeCampaign?.daily_end || "18:00")}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{stats?.timezone || details?.timezone || activeCampaign?.timezone || "Local"}</div>
                    </div>
                  </motion.div>
                  <motion.div variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Counts</div>
                    <div className="text-sm text-slate-800 grid grid-cols-2 gap-y-1">
                      <div>Total: {stats?.totals?.total ?? details?.totals?.total ?? activeCampaign?.counts?.total ?? "—"}</div>
                      <div>Done: {stats?.totals?.done ?? details?.totals?.done ?? activeCampaign?.counts?.completed_or_failed ?? "—"}</div>
                      <div>Calling: {stats?.totals?.calling ?? "—"}</div>
                      <div>Retry: {stats?.totals?.retry ?? "—"}</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Controls */}
                <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-2">
                  {String(stats?.status || details?.status || activeCampaign?.status).toLowerCase() === "paused" ? (
                    <ButtonPrimary onClick={() => doResume(activeCampaign.id)} icon={<Play className="h-4 w-4" />}>
                      <span className="hidden sm:inline">Resume</span>
                    </ButtonPrimary>
                  ) : (
                    <ButtonPrimary onClick={() => doPause(activeCampaign.id)} icon={<Pause className="h-4 w-4" />}>
                      <span className="hidden sm:inline">Pause</span>
                    </ButtonPrimary>
                  )}
                  <ButtonGhost onClick={() => doStop(activeCampaign.id)} icon={<StopSquare className="h-4 w-4" />}>
                    <span className="hidden sm:inline">Stop</span>
                  </ButtonGhost>
                  <ButtonGhost onClick={() => doRefreshLeads(activeCampaign.id)} icon={<RefreshCw className="h-4 w-4" />}>
                    <span className="hidden sm:inline">Sync Leads</span>
                  </ButtonGhost>
                  <ButtonGhost onClick={() => doDelete(activeCampaign.id)} icon={<Trash2 className="h-4 w-4" />}>
                    <span className="hidden sm:inline">Delete</span>
                  </ButtonGhost>
                </motion.div>

                {/* Schedule + Retry forms */}
                <motion.div initial="hidden" animate="show" variants={stagger} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <motion.div variants={fadeUp}><ScheduleForm details={stats?.window ? { ...details, ...stats, days_of_week: stats.window?.days_of_week, daily_start: stats.window?.daily_start, daily_end: stats.window?.daily_end, timezone: stats.timezone } : details} onSubmit={(form) => updateSchedule(activeCampaign.id, form)} loading={detailsLoading} /></motion.div>
                  <motion.div variants={fadeUp}><RetryForm details={details} onSubmit={(form) => updateRetryPolicy(activeCampaign.id, form)} loading={detailsLoading} /></motion.div>
                </motion.div>

                {/* Run now */}
                <motion.div initial="hidden" animate="show" variants={fadeUp}>
                  <RunNowCard onRun={(n) => doRunNow(activeCampaign.id, n)} />
                </motion.div>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────── Subcomponents ─────────────────────────── */

function RunNowCard({ onRun }) {
  const [n, setN] = useState(5)
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="font-semibold text-slate-800 flex items-center gap-2">
          <Rocket className="h-4 w-4" /> Run Now
        </div>
        <div className="flex items-center gap-2">
          <input type="number" min={1} className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" value={n} onChange={(e) => setN(Number(e.target.value) || 5)} />
          <ButtonPrimary onClick={() => onRun(n)} icon={<Play className="h-4 w-4" />}>Trigger</ButtonPrimary>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-2">Immediately place a small batch of calls (ignores schedule window).</p>
    </div>
  )
}

function ScheduleForm({ details, onSubmit, loading }) {
  const [form, setForm] = useState({
    timezone: details?.timezone || "America/Los_Angeles",
    days_of_week: details?.days_of_week || [0, 1, 2, 3, 4],
    daily_start: details?.daily_start || "09:00",
    daily_end: details?.daily_end || "18:00",
    start_at: toInputDateTimeLocal(details?.start_at),
    end_at: toInputDateTimeLocal(details?.end_at),
  })
  useEffect(() => {
    setForm({
      timezone: details?.timezone || "America/Los_Angeles",
      days_of_week: details?.days_of_week || [0, 1, 2, 3, 4],
      daily_start: details?.daily_start || "09:00",
      daily_end: details?.daily_end || "18:00",
      start_at: toInputDateTimeLocal(details?.start_at),
      end_at: toInputDateTimeLocal(details?.end_at),
    })
  }, [details])

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }
  function toggleDOW(d) {
    setForm((f) => {
      const has = f.days_of_week.includes(d)
      const days = has ? f.days_of_week.filter((x) => x !== d) : [...f.days_of_week, d]
      days.sort((a, b) => a - b)
      return { ...f, days_of_week: days }
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <Settings className="h-4 w-4" /> Schedule
      </div>
      <div className="grid grid-cols-1 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Timezone (IANA)</span>
          <select name="timezone" value={form.timezone} onChange={onChange} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
            {TIMEZONES.map((tz) => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
          </select>
        </label>
        <div>
          <div className="text-sm text-slate-700 mb-2">Days of week</div>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <button key={d} type="button" onClick={() => toggleDOW(d)}
                className={cx("px-3 py-1.5 rounded-xl border text-sm", form.days_of_week.includes(d) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700")}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Daily start" name="daily_start" value={form.daily_start} onChange={onChange} placeholder="HH:MM" />
          <Field label="Daily end" name="daily_end" value={form.daily_end} onChange={onChange} placeholder="HH:MM" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start at (optional)" name="start_at" type="datetime-local" value={form.start_at} onChange={onChange} />
          <Field label="End at (optional)" name="end_at" type="datetime-local" value={form.end_at} onChange={onChange} />
        </div>
        <div className="flex justify-end">
          <ButtonPrimary onClick={() => onSubmit(form)} disabled={loading}>Save Schedule</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

function RetryForm({ details, onSubmit, loading }) {
  const [form, setForm] = useState({
    retry_on_busy: details?.retry_on_busy ?? true,
    busy_retry_delay_minutes: details?.busy_retry_delay_minutes ?? 15,
    max_attempts: details?.max_attempts ?? 3,
  })
  useEffect(() => {
    setForm({
      retry_on_busy: details?.retry_on_busy ?? true,
      busy_retry_delay_minutes: details?.busy_retry_delay_minutes ?? 15,
      max_attempts: details?.max_attempts ?? 3,
    })
  }, [details])

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <Rocket className="h-4 w-4" /> Retry Policy
      </div>
      <div className="grid grid-cols-1 gap-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="retry_on_busy" checked={!!form.retry_on_busy} onChange={onChange} />
          <span className="text-sm text-slate-800">Retry on busy / no-answer</span>
        </label>
        <Field label="Busy retry delay (min)" name="busy_retry_delay_minutes" value={form.busy_retry_delay_minutes} onChange={onChange} />
        <Field label="Max attempts" name="max_attempts" value={form.max_attempts} onChange={onChange} />
        <div className="flex justify-end">
          <ButtonPrimary onClick={() => onSubmit(form)} disabled={loading}>Save Retry Policy</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

/* Lead MultiSelect for ONLY/SKIP */
function LeadMultiSelect({ leads, mode, search, selectedIds, onChange }) {
  const [page, setPage] = useState(1)
  const pageSize = 12

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim()
    if (!q) return leads
    return leads.filter((l) => {
      const name = `${l.first_name || ""} ${l.last_name || ""}`.toLowerCase()
      return name.includes(q) || (l.email || "").toLowerCase().includes(q) || (l.mobile || "").toLowerCase().includes(q)
    })
  }, [leads, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const slice = filtered.slice(start, end)

  function toggle(id) {
    const has = selectedIds.includes(id)
    if (has) onChange(selectedIds.filter((x) => x !== id))
    else onChange([...selectedIds, id])
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
        {slice.length === 0 ? (
          <div className="p-4 text-sm text-slate-600">No leads match your search.</div>
        ) : (
          slice.map((l) => {
            const nameFull = `${l.first_name || ""} ${l.last_name || ""}`.trim() || "Unknown"
            return (
              <label key={l.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" checked={selectedIds.includes(l.id)} onChange={() => toggle(l.id)} />
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 text-sm">{nameFull}</div>
                  <div className="text-xs text-slate-600 break-all">{(l.email || "—") + " · " + (l.mobile || "—")}</div>
                </div>
                {l.dnc ? <Chip tone="red">DNC</Chip> : <Chip tone="green">OK</Chip>}
              </label>
            )
          })
        )}
      </div>
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between p-2">
          <span className="text-xs text-slate-600">Showing {Math.min(end, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-2">
            <PagerButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft className="h-3.5 w-3.5" /> Prev</PagerButton>
            <span className="text-xs text-slate-700">{page}/{totalPages}</span>
            <PagerButton disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next <ChevronRight className="h-3.5 w-3.5" /></PagerButton>
          </div>
        </div>
      )}
      <div className="p-3 border-t border-slate-200 text-xs text-slate-700">
        Mode: <strong>{mode}</strong> · Selected: <strong>{selectedIds.length}</strong>
      </div>
    </div>
  )
}

/* Helpers / small UI bits */
function dowLabel(days) {
  const map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const set = new Set(Array.isArray(days) ? days : [])
  if (set.size === 5 && [0, 1, 2, 3, 4].every((d) => set.has(d))) return "Mon–Fri"
  if (set.size === 7) return "Every day"
  return Array.from(set).sort((a, b) => a - b).map((d) => map[d] || "?").join(", ")
}
function setSort(nextKey, setKey, setDir) {
  setKey((prevKey) => {
    if (prevKey === nextKey) { setDir((d) => (d === "asc" ? "desc" : "asc")); return prevKey }
    else { setDir(nextKey === "created_at" ? "desc" : "asc"); return nextKey }
  })
}

function ButtonPrimary({ children, onClick, disabled, icon, type = "button" }) {
  return (
    <motion.button whileHover={!disabled ? { scale: 1.02 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type} onClick={onClick} disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-semibold text-white transition-all duration-200",
        "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700",
        "shadow-[0_8px_24px_-12px_rgba(37,99,235,0.55)] hover:shadow-[0_12px_32px_-12px_rgba(37,99,235,0.65)]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
      )}
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </motion.button>
  )
}
function ButtonGhost({ children, onClick, icon, type = "button", disabled }) {
  return (
    <motion.button whileHover={!disabled ? { scale: 1.02 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type} onClick={onClick} disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-medium text-slate-800 ring-1 ring-white/70 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </motion.button>
  )
}
function PagerButton({ children, disabled, onClick }) {
  return (
    <motion.button whileHover={!disabled ? { scale: 1.02 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}
      disabled={disabled} onClick={onClick}
      className={cx(
        "inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl border px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200",
        disabled ? "cursor-not-allowed border-slate-200 text-slate-400 bg-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:shadow-sm",
      )}
    >
      {children}
    </motion.button>
  )
}
function Th({ children, sortKey, sortBy, sortDir, onSort }) {
  const active = sortBy === sortKey
  return (
    <th className={cx("px-5 py-3 font-semibold select-none cursor-pointer", active && "text-slate-900")} onClick={() => onSort(sortKey)} title="Sort">
      <span className="inline-flex items-center gap-1">
        {children}
        <span className={cx("text-xs", active ? "opacity-100" : "opacity-20")}>{active ? (sortDir === "asc" ? "▲" : "▼") : "▲"}</span>
      </span>
    </th>
  )
}
function RowSkeleton({ rows = 6, cols = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-5 py-3"><div className="h-4 w-28 rounded bg-slate-100" /></td>
          ))}
        </tr>
      ))}
    </>
  )
}
function Field({ label, name, value, onChange, type = "text", placeholder, className }) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input type={type} name={name} value={value ?? ""} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300" />
    </label>
  )
}
