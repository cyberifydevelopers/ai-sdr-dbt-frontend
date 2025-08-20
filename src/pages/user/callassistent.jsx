"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  FiEdit,
  FiFileText,
  FiTrash2,
  FiPhone,
  FiSearch,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiCheckSquare,
  FiHash,
  FiCopy,
  FiPlus,
  FiFilter,
  FiUsers,
  FiClock,
} from "react-icons/fi"

const colors = {
  primary: "#2563EB",
  primaryLight: "#3B82F6",
  primaryDark: "#1D4ED8",
  secondary: "#06B6D4",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  text: "#1F2937",
  textLight: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  background: "#F8FAFC",
  card: "#FFFFFF",
  hover: "#F1F5F9",
  accent: "#EFF6FF",
}

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000"

export default function AssistantList() {
  const navigate = useNavigate()

  // data
  const [assistants, setAssistants] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // ui/state
  const [search, setSearch] = useState("")
  const [providerFilter, setProviderFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortKey, setSortKey] = useState("created_at")
  const [sortDir, setSortDir] = useState("desc")

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDeleteId, setToDeleteId] = useState(null)

  // bulk selection
  const [selected, setSelected] = useState([])

  // call modal
  const [callOpen, setCallOpen] = useState(false)
  const [callPayload, setCallPayload] = useState({
    vapi_assistant_id: "",
    number: "",
    first_name: "",
    last_name: "",
    email: "",
  })

  // pagination
  const [page, setPage] = useState(1)
  const pageSize = 10

  const token = useMemo(() => localStorage.getItem("token"), [])

  const fetchAssistants = async () => {
    try {
      setRefreshing(true)
      const res = await fetch(`${API_URL}/api/get-assistants`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const arr = Array.isArray(data) ? data : Array.isArray(data?.assistants) ? data.assistants : []
      setAssistants(arr)
    } catch (e) {
      console.error(e)
      toast.error("Failed to fetch assistants")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAssistants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // auto refresh
  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(fetchAssistants, 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh])

  // filters
  const filtered = useMemo(() => {
    let list = [...assistants]

    if (providerFilter !== "all") {
      list = list.filter((a) => (a?.provider || "").toLowerCase() === providerFilter)
    }
    if (categoryFilter !== "all") {
      list = list.filter((a) => (a?.category || "").toLowerCase() === categoryFilter)
    }

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => {
        const fields = [a?.name, a?.model, a?.voice, a?.category, a?.attached_Number]
          .filter(Boolean)
          .map(String)
          .map((x) => x.toLowerCase())
        return fields.some((f) => f.includes(q))
      })
    }

    list.sort((a, b) => {
      if (sortKey === "created_at") {
        const ad = a?.created_at ? new Date(a.created_at).getTime() : 0
        const bd = b?.created_at ? new Date(b.created_at).getTime() : 0
        return sortDir === "asc" ? ad - bd : bd - ad
      }
      const av = (a?.[sortKey] ?? "").toString().toLowerCase()
      const bv = (b?.[sortKey] ?? "").toString().toLowerCase()
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return list
  }, [assistants, search, providerFilter, categoryFilter, sortKey, sortDir])

  const providerOptions = useMemo(() => {
    const set = new Set((assistants || []).map((a) => (a?.provider || "").toLowerCase()).filter(Boolean))
    return ["all", ...Array.from(set)]
  }, [assistants])

  const categoryOptions = useMemo(() => {
    const set = new Set((assistants || []).map((a) => (a?.category || "").toLowerCase()).filter(Boolean))
    return ["all", ...Array.from(set)]
  }, [assistants])

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageSafe = Math.min(page, totalPages)
  const pageData = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  // last created
  const lastCreated = useMemo(() => {
    if (!filtered.length) return null
    return filtered.reduce((best, cur) => {
      const b = best?.created_at ? new Date(best.created_at) : null
      const c = cur?.created_at ? new Date(cur.created_at) : null
      if (!b && c) return cur
      if (!c && b) return best
      if (!b && !c) return best
      return c > b ? cur : best
    }, filtered[0])
  }, [filtered])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const onDelete = (id) => {
    setToDeleteId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!toDeleteId) return
    try {
      const res = await fetch(`${API_URL}/api/assistants/${toDeleteId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      if (!res.ok) {
        let msg = `HTTP ${res.status}`
        try {
          const j = await res.json()
          if (j?.detail) msg = j.detail
        } catch {}
        throw new Error(msg)
      }
      toast.success("Assistant deleted")
      setSelected((s) => s.filter((x) => x !== toDeleteId))
      fetchAssistants()
    } catch (e) {
      console.error(e)
      toast.error(e?.message || "Delete failed")
    } finally {
      setConfirmOpen(false)
      setToDeleteId(null)
    }
  }

  const tryOpenFiles = (assistant) => {
    const kb = assistant?.knowledge_base
    if (Array.isArray(kb) && kb.length) {
      const urls = kb.filter((x) => typeof x === "string" && /^https?:\/\//i.test(x))
      if (urls.length) {
        urls.forEach((u) => window.open(u, "_blank", "noopener"))
        return
      }
    }
    toast.info("No file URLs available for this assistant.")
  }

  const openCallModal = (assistant) => {
    if (!assistant?.vapi_assistant_id) {
      toast.error("Missing VAPI Assistant ID")
      return
    }
    setCallPayload({
      vapi_assistant_id: assistant.vapi_assistant_id,
      number: "",
      first_name: "",
      last_name: "",
      email: "",
    })
    setCallOpen(true)
  }

  const startCall = async (e) => {
    e.preventDefault()
    const { vapi_assistant_id, number, first_name, last_name, email } = callPayload
    if (!number) return toast.error("Enter the customer's phone number (E.164 preferred)")
    try {
      const url = `${API_URL}/api/phone-call/${encodeURIComponent(vapi_assistant_id)}/${encodeURIComponent(number)}`
      const body = {
        first_name: first_name || "Caller",
        last_name: last_name || "",
        email: email || "caller@example.com",
        add_date: new Date().toISOString(),
        mobile_no: number,
        custom_field_01: null,
        custom_field_02: null,
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.success === false) {
        throw new Error(data?.detail || `HTTP ${res.status}`)
      }
      toast.success("Call initiated")
      setCallOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(err?.message || "Failed to initiate call")
    }
  }

  const isSelected = (id) => selected.includes(id)
  const toggleRow = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }
  const toggleAllPage = () => {
    const ids = pageData.map((x) => x.id).filter(Boolean)
    const allSelected = ids.every((id) => selected.includes(id))
    setSelected((s) => (allSelected ? s.filter((id) => !ids.includes(id)) : Array.from(new Set([...s, ...ids]))))
  }
  const bulkDelete = async () => {
    if (!selected.length) return toast.info("No rows selected")
    if (!window.confirm("Delete selected assistants? This cannot be undone.")) return
    try {
      for (const id of selected) {
        await fetch(`${API_URL}/api/assistants/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
      }
      toast.success("Bulk delete complete")
      setSelected([])
      fetchAssistants()
    } catch (e) {
      console.error(e)
      toast.error("Bulk delete encountered an error")
    }
  }

  const exportCSV = () => {
    const headers = ["Name", "Model", "Voice", "Attached Number", "Category", "Created"]
    const rows = filtered.map((a) => [
      a?.name ?? "",
      a?.model ?? "",
      a?.voice ?? "",
      a?.attached_Number ?? "",
      a?.category ?? "",
      a?.created_at ? new Date(a.created_at).toLocaleString() : "",
    ])
    const csv = [headers, ...rows].map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "assistants.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-100 to-cyan-100 p-8">
              <div className="mb-4 h-8 w-64 rounded-lg bg-white/60"></div>
              <div className="h-4 w-96 rounded-lg bg-white/40"></div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-3 h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-8 w-16 rounded bg-gray-300"></div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <div className="h-6 w-32 rounded bg-gray-200"></div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-50 p-6 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="mb-2 h-4 w-48 rounded bg-gray-200"></div>
                      <div className="h-3 w-32 rounded bg-gray-100"></div>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-8 w-8 rounded-lg bg-gray-100"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* HERO / BLUE BOX */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <FiUsers className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">AI Assistants</h1>
                  <p className="mt-1 text-lg text-blue-100">Manage your intelligent voice assistants</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span>{filtered.length} Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4" />
                  <span>Auto-refresh {autoRefresh ? "enabled" : "disabled"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setAutoRefresh((v) => !v)}
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-200 ${
                  autoRefresh
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-white/10 text-blue-100 hover:bg-white/20"
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${autoRefresh ? "bg-green-400" : "bg-gray-400"}`}></div>
                Auto Refresh
              </button>

              <button
                onClick={fetchAssistants}
                className="group flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                <FiRefreshCw
                  className={`h-4 w-4 transition-transform ${refreshing ? "animate-spin" : "group-hover:rotate-180"}`}
                />
                Refresh
              </button>

              <button
                onClick={exportCSV}
                className="group flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                <FiDownload className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                Export
              </button>

              <button
                onClick={() => navigate("/user/assistant/create")}
                className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:shadow-xl"
              >
                <FiPlus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Create Assistant
              </button>
            </div>
          </div>

          {/* Full-width search + filters */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assistants, models, voices..."
                className="w-full rounded-xl bg-white/10 py-3 pl-12 pr-4 text-white placeholder-white/70 backdrop-blur-sm outline-none ring-1 ring-white/20 transition-all duration-200 focus:bg-white/20 focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ModernFilterSelect
                label="Provider"
                value={providerFilter}
                onChange={setProviderFilter}
                options={providerOptions}
                icon={<FiFilter className="h-4 w-4" />}
              />
              <ModernFilterSelect
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryOptions}
                icon={<FiHash className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <ModernStatCard
            title="Total Assistants"
            value={filtered.length}
            icon={<FiUsers className="h-6 w-6 text-blue-600" />}
            trend="+12%"
            trendUp={true}
          />
          <ModernStatCard
            title="Active Calls"
            value="24"
            icon={<FiPhone className="h-6 w-6 text-green-600" />}
            trend="+5%"
            trendUp={true}
          />
          <ModernStatCard
            title="Success Rate"
            value="94.2%"
            icon={<FiCheckSquare className="h-6 w-6 text-emerald-600" />}
            trend="+2.1%"
            trendUp={true}
          />
          <ModernStatCard
            title="Last Created"
            value={
              lastCreated?.name
                ? lastCreated.name.length > 12
                  ? `${lastCreated.name.slice(0, 12)}…`
                  : lastCreated.name
                : "—"
            }
            icon={<FiClock className="h-6 w-6 text-cyan-600" />}
            subtitle={lastCreated?.created_at ? new Date(lastCreated.created_at).toLocaleDateString() : "—"}
          />
        </div>

        {selected.length > 0 && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/50 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <FiCheckSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">{selected.length} assistants selected</p>
                  <p className="text-sm text-blue-700">Choose an action to perform on selected items</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAllPage}
                  className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                >
                  Toggle Page
                </button>
                <button
                  onClick={bulkDelete}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <ModernEmpty />
        ) : (
          <>
            {/* Desktop Table (wider, centered headers, single-line actions) */}
            <div className="hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:block">
              <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Assistants Overview</h3>
                <p className="text-sm text-gray-600">Manage and monitor your AI assistants</p>
              </div>

              <table className="w-full table-auto divide-y divide-gray-100">
                <thead className="bg-gray-50/60">
                  <tr>
                    <ModernThCheckbox
                      className="w-12 text-center"
                      checked={pageData.every((r) => selected.includes(r.id)) && pageData.length > 0}
                      onChange={toggleAllPage}
                    />
                    <ModernTh
                      className="w-[26%]"
                      align="center"
                      label="Assistant"
                      sortKey="name"
                      sortDir={sortKey === "name" ? sortDir : null}
                      onSort={toggleSort}
                    />
                    <ModernTh
                      className="w-[12%]"
                      align="center"
                      label="Model"
                      sortKey="model"
                      sortDir={sortKey === "model" ? sortDir : null}
                      onSort={toggleSort}
                    />
                    <ModernTh
                      className="w-[12%]"
                      align="center"
                      label="Voice"
                      sortKey="voice"
                      sortDir={sortKey === "voice" ? sortDir : null}
                      onSort={toggleSort}
                    />
                    <ModernTh
                      className="w-[18%]"
                      align="center"
                      label="Phone Number"
                      sortKey="attached_Number"
                      sortDir={sortKey === "attached_Number" ? sortDir : null}
                      onSort={toggleSort}
                    />
                    <ModernTh
                      className="w-[10%]"
                      align="center"
                      label="Category"
                      sortKey="category"
                      sortDir={sortKey === "category" ? sortDir : null}
                      onSort={toggleSort}
                    />
                    <ModernTh
                      className="w-[8%]"
                      align="center"
                      label="Created"
                      sortKey="created_at"
                      sortDir={sortKey === "created_at" ? sortDir : null}
                      onSort={toggleSort}
                    />
                    <th className="w-[14%] px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 bg-white align-middle">
                  {pageData.map((a) => (
                    <tr
                      key={a.id ?? a.name}
                      className={`group transition-colors duration-150 hover:bg-blue-50/30 ${
                        isSelected(a.id) ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <ModernTdCheckbox
                        className="w-12 text-center"
                        checked={isSelected(a.id)}
                        onChange={() => toggleRow(a.id)}
                      />

                      {/* Assistant */}
                      <td className="w-[26%] px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm">
                            <FiHash className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="max-w-[40ch] truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-700">
                              {a.name || "—"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Array.isArray(a.knowledge_base) ? a.knowledge_base.length : 0} KB items
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Model */}
                      <td className="w-[12%] px-6 py-4">
                        <div className="mx-auto max-w-[26ch] truncate text-center">
                          <ModernBadge variant="secondary">{a.model || "—"}</ModernBadge>
                        </div>
                      </td>

                      {/* Voice */}
                      <td className="w-[12%] px-6 py-4">
                        <div className="mx-auto max-w-[26ch] truncate text-center">
                          <ModernBadge variant="accent">{a.voice || "—"}</ModernBadge>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="w-[18%] px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="break-all font-mono text-sm text-gray-700">{a.attached_Number || "—"}</span>
                          {a.attached_Number && (
                            <button
                              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                              title="Copy number"
                              onClick={() => copyToClipboard(a.attached_Number)}
                            >
                              <FiCopy className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="w-[10%] px-6 py-4">
                        <div className="text-center">
                          {a.category ? (
                            <ModernBadge variant="primary">{a.category}</ModernBadge>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* Created */}
                      <td className="w-[8%] px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                      </td>

                      {/* Actions */}
                      <td className="w-[14%] px-6 py-4">
                        <div className="mx-auto flex w-full min-w-[220px] items-center justify-center gap-2 whitespace-nowrap">
                          <ModernActionButton
                            title="Edit Assistant"
                            onClick={() => navigate(`/user/edit-assistant/${a.id}`)}
                            variant="primary"
                          >
                            <FiEdit className="h-4 w-4" />
                          </ModernActionButton>
                          <ModernActionButton title="View Files" onClick={() => tryOpenFiles(a)} variant="success">
                            <FiFileText className="h-4 w-4" />
                          </ModernActionButton>
                          <ModernActionButton title="Start Call" onClick={() => openCallModal(a)} variant="secondary">
                            <FiPhone className="h-4 w-4" />
                          </ModernActionButton>
                          <ModernActionButton title="Delete" onClick={() => onDelete(a.id)} variant="danger">
                            <FiTrash2 className="h-4 w-4" />
                          </ModernActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="space-y-4 xl:hidden">
              {pageData.map((a) => (
                <ModernMobileCard
                  key={a.id ?? a.name}
                  assistant={a}
                  isSelected={isSelected(a.id)}
                  onToggleSelect={() => toggleRow(a.id)}
                  onEdit={() => navigate(`/user/edit-assistant/${a.id}`)}
                  onViewFiles={() => tryOpenFiles(a)}
                  onCall={() => openCallModal(a)}
                  onDelete={() => onDelete(a.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                Showing {(pageSafe - 1) * pageSize + 1} to {Math.min(pageSafe * pageSize, filtered.length)} of{" "}
                {filtered.length} assistants
              </div>
              <div className="flex items-center gap-2">
                <ModernPageButton disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <FiChevronLeft className="h-4 w-4" />
                  Previous
                </ModernPageButton>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-10 w-10 rounded-xl text-sm font-medium transition-all ${
                          pageNum === pageSafe ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <ModernPageButton
                  disabled={pageSafe >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <FiChevronRight className="h-4 w-4" />
                </ModernPageButton>
              </div>
            </div>
          </>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {confirmOpen && (
        <ModernModal onClose={() => setConfirmOpen(false)}>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <FiTrash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Delete Assistant</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this assistant? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-red-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg"
                onClick={confirmDelete}
              >
                Delete Assistant
              </button>
            </div>
          </div>
        </ModernModal>
      )}

      {/* CALL MODAL */}
      {callOpen && (
        <ModernModal onClose={() => setCallOpen(false)}>
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <FiPhone className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Start Phone Call</h2>
            <p className="text-gray-600">Initiate a call with your AI assistant</p>
          </div>

          <form onSubmit={startCall} className="space-y-4">
            <ModernField
              label="Customer Phone Number"
              value={callPayload.number}
              onChange={(v) => setCallPayload((p) => ({ ...p, number: v }))}
              placeholder="+1 (555) 123-4567"
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ModernField
                label="First Name"
                value={callPayload.first_name}
                onChange={(v) => setCallPayload((p) => ({ ...p, first_name: v }))}
                placeholder="John"
              />
              <ModernField
                label="Last Name"
                value={callPayload.last_name}
                onChange={(v) => setCallPayload((p) => ({ ...p, last_name: v }))}
                placeholder="Doe"
              />
            </div>
            <ModernField
              label="Email Address"
              value={callPayload.email}
              onChange={(v) => setCallPayload((p) => ({ ...p, email: v }))}
              placeholder="john@example.com"
              type="email"
            />
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCallOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                Start Call
              </button>
            </div>
          </form>
        </ModernModal>
      )}
    </div>
  )
}

/* ---------- Components ---------- */

function ModernStatCard({ title, value, icon, trend, trendUp, subtitle }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-600">{title}</div>
          {icon}
        </div>
        <div className="mb-1 text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        {trend && (
          <div className={`text-sm font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trend} from last month
          </div>
        )}
      </div>
    </div>
  )
}

function ModernFilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl bg-white/10 py-3 pl-4 pr-10 text-white backdrop-blur-sm outline-none ring-1 ring-white/20 transition-all duration-200 focus:bg-white/20 focus:ring-2 focus:ring-white/40"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-gray-800 text-white">
            {option === "all" ? `All ${label}s` : option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <FiChevronDown className="h-4 w-4 text-white/70" />
      </div>
    </div>
  )
}

function ModernBadge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-cyan-100 text-cyan-800",
    success: "bg-green-100 text-green-800",
    accent: "bg-purple-100 text-purple-800",
  }
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

function ModernActionButton({ title, onClick, children, variant = "default" }) {
  const variants = {
    default: "text-gray-600 hover:bg-gray-100 hover:text-gray-800",
    primary: "text-blue-600 hover:bg-blue-100 hover:text-blue-800",
    secondary: "text-cyan-600 hover:bg-cyan-100 hover:text-cyan-800",
    success: "text-green-600 hover:bg-green-100 hover:text-green-800",
    danger: "text-red-600 hover:bg-red-100 hover:text-red-800",
  }
  return (
    <button title={title} onClick={onClick} className={`rounded-xl p-2.5 transition-all duration-200 ${variants[variant]}`}>
      {children}
    </button>
  )
}

function ModernTh({ label, sortKey, sortDir, onSort, className = "", align = "left" }) {
  const alignCls = align === "center" ? "text-center" : "text-left"
  return (
    <th className={`px-6 py-4 ${alignCls} ${className}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`group flex w-full items-center gap-2 ${
          align === "center" ? "justify-center" : "justify-start"
        } text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600`}
      >
        {label}
        <div className="flex flex-col">
          <FiChevronUp className={`h-3 w-3 transition-colors ${sortDir === "asc" ? "text-blue-600" : "text-gray-400"}`} />
          <FiChevronDown
            className={`-mt-1 h-3 w-3 transition-colors ${sortDir === "desc" ? "text-blue-600" : "text-gray-400"}`}
          />
        </div>
      </button>
    </th>
  )
}

function ModernThCheckbox({ checked, onChange, className = "" }) {
  return (
    <th className={`px-6 py-4 ${className}`}>
      <div className="flex items-center justify-center">
        <button
          onClick={onChange}
          className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
            checked ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 hover:border-blue-400"
          }`}
        >
          {checked && <FiCheckSquare className="h-3 w-3" />}
        </button>
      </div>
    </th>
  )
}

function ModernTdCheckbox({ checked, onChange, className = "" }) {
  return (
    <td className={`px-6 py-4 ${className}`}>
      <div className="flex items-center justify-center">
        <button
          onClick={onChange}
          className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
            checked ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 hover:border-blue-400"
          }`}
        >
          {checked && <FiCheckSquare className="h-3 w-3" />}
        </button>
      </div>
    </td>
  )
}

function ModernMobileCard({ assistant, isSelected, onToggleSelect, onEdit, onViewFiles, onCall, onDelete }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
        isSelected ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSelect}
            className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${
              isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {isSelected && <FiCheckSquare className="h-4 w-4" />}
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <FiHash className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{assistant.name || "—"}</h3>
            <p className="text-sm text-gray-500">
              {Array.isArray(assistant.knowledge_base) ? assistant.knowledge_base.length : 0} KB items
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {assistant.created_at ? new Date(assistant.created_at).toLocaleDateString() : "—"}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="mb-1 text-gray-500">Model</div>
          <ModernBadge variant="secondary">{assistant.model || "—"}</ModernBadge>
        </div>
        <div>
          <div className="mb-1 text-gray-500">Voice</div>
          <ModernBadge variant="accent">{assistant.voice || "—"}</ModernBadge>
        </div>
        <div>
          <div className="mb-1 text-gray-500">Phone</div>
          <div className="break-all font-mono text-sm">{assistant.attached_Number || "—"}</div>
        </div>
        <div>
          <div className="mb-1 text-gray-500">Category</div>
          {assistant.category ? (
            <ModernBadge variant="primary">{assistant.category}</ModernBadge>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          <FiEdit className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={onViewFiles}
          className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
        >
          <FiFileText className="h-4 w-4" />
          Files
        </button>
        <button
          onClick={onCall}
          className="flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-100"
        >
          <FiPhone className="h-4 w-4" />
          Call
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
        >
          <FiTrash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  )
}

function ModernPageButton({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
        disabled
          ? "cursor-not-allowed border-gray-200 text-gray-400"
          : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  )
}

function ModernModal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

function ModernField({ label, value, onChange, placeholder, required, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  )
}

function ModernEmpty() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100">
        <FiUsers className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">No assistants found</h3>
      <p className="mx-auto mb-6 max-w-sm text-gray-600">
        Get started by creating your first AI assistant to handle customer interactions.
      </p>
      <a
        href="/user/assistant/create"
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
      >
        <FiPlus className="h-5 w-5" />
        Create Your First Assistant
      </a>
    </div>
  )
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Copied to clipboard"))
    .catch(() => toast.info(text))
}


























