"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import {
  Link as LinkIcon,
  Unlink,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  Loader2,
  Users2,
  Building2,
  Phone,
  Mail,
  Search,
  Database,
  ChevronLeft,
  ChevronRight,
  Plug,
  PlugZap,
  CircleAlert,
} from "lucide-react"

/* ──────────────────────────────────────────────────────────────────────────
 * Config
 * ────────────────────────────────────────────────────────────────────────── */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000"
const API_PREFIX = import.meta.env?.VITE_API_PREFIX || "/api"

/** Frontend origin (used for OAuth return) */
const APP_ORIGIN = typeof window !== "undefined" ? window.location.origin : ""
/** Path in *this* SPA that the popup will land on. Keep it /integrations to match your screenshot. */
const OAUTH_RETURN_PATH = "/integrations"

const EP = {
  PROVIDERS: `${API_URL}${API_PREFIX}/crm/providers`,
  ACCOUNTS: `${API_URL}${API_PREFIX}/crm/accounts`,
  CONNECT: (crm) => `${API_URL}${API_PREFIX}/crm/connect/${crm}`,
  DISCONNECT: (crm) => `${API_URL}${API_PREFIX}/crm/disconnect/${crm}`,
  ENSURE_FRESH: (crm) => `${API_URL}${API_PREFIX}/crm/ensure-fresh/${crm}`,
  SET_TOKEN: (crm) => `${API_URL}${API_PREFIX}/crm/token/${crm}`,
  CONTACTS: (crm) => `${API_URL}${API_PREFIX}/crm/${crm}/contacts`,
  LEADS: (crm) => `${API_URL}${API_PREFIX}/crm/${crm}/leads`,
}

/* ───────────────────────── Utilities / styling ───────────────────────── */
function cx(...arr) { return arr.filter(Boolean).join(" ") }
const fmtDT = (d) => { try { const dt = new Date(d); return isNaN(dt) ? "Unknown" : dt.toLocaleString() } catch { return "Unknown" } }
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } } }
const overlay = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.18 } }, exit: { opacity: 0, transition: { duration: 0.12 } } }
const modalVariants = { hidden: { opacity: 0, scale: 0.9, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }, exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } } }

function ButtonPrimary({ children, onClick, disabled, icon, type = "button", className }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white transition",
        "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700",
        "shadow-[0_8px_24px_-12px_rgba(37,99,235,0.55)] hover:shadow-[0_12px_32px_-12px_rgba(37,99,235,0.65)]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {icon}<span className="whitespace-nowrap">{children}</span>
    </motion.button>
  )
}
function ButtonGhost({ children, onClick, icon, type = "button", disabled, className }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-white/70 transition hover:bg-slate-50 hover:shadow-sm",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {icon}<span className="whitespace-nowrap">{children}</span>
    </motion.button>
  )
}
function RowSkeleton({ rows = 6, cols = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-4 py-3"><div className="h-4 w-28 rounded bg-slate-100" /></td>
          ))}
        </tr>
      ))}
    </>
  )
}

/* ───────────────────────── Brand Icons (simple) ───────────────────────── */
function BrandIcon({ crm }) {
  const base = "h-6 w-6"
  switch (crm) {
    case "hubspot":
      return (<svg viewBox="0 0 24 24" className={base} fill="none" aria-label="HubSpot"><circle cx="12" cy="12" r="9.5" stroke="#2563eb" strokeWidth="2" /><circle cx="12" cy="12" r="3.5" fill="#2563eb" /></svg>)
    case "salesforce":
      return (<svg viewBox="0 0 24 24" className={base} fill="none" aria-label="Salesforce"><path d="M7 15a4 4 0 0 1 4-4h6a3 3 0 0 1 0 6H9a2 2 0 0 1-2-2Z" stroke="#2563eb" strokeWidth="2" /><circle cx="8" cy="10" r="3" fill="#2563eb" /></svg>)
    case "zoho":
      return (<svg viewBox="0 0 24 24" className={base} fill="none" aria-label="Zoho"><rect x="3" y="6" width="7.5" height="12" rx="2" stroke="#2563eb" strokeWidth="2" /><rect x="13.5" y="6" width="7.5" height="12" rx="2" stroke="#2563eb" strokeWidth="2" /><path d="M6 12h3M16.5 12h3" stroke="#2563eb" strokeWidth="2" /></svg>)
    case "pipedrive":
      return (<svg viewBox="0 0 24 24" className={base} fill="none" aria-label="Pipedrive"><path d="M6 5h8a5 5 0 1 1 0 10H6V5Z" stroke="#2563eb" strokeWidth="2" /><circle cx="14" cy="10" r="2.5" fill="#2563eb" /></svg>)
    case "close":
      return (<svg viewBox="0 0 24 24" className={base} fill="none" aria-label="Close CRM"><circle cx="12" cy="12" r="8.5" stroke="#2563eb" strokeWidth="2" /><path d="M8 12h8M12 8v8" stroke="#2563eb" strokeWidth="2" /></svg>)
    default:
      return <Plug className="h-6 w-6 text-blue-600" />
  }
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function CRMPage() {
  const token = useRef(localStorage.getItem("token") || null)

  const [providers, setProviders] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const [showTokenModal, setShowTokenModal] = useState(false)
  const [tokenForm, setTokenForm] = useState({ crm: "", value: "" })
  const [savingToken, setSavingToken] = useState(false)

  // Data browser
  const [activeCRM, setActiveCRM] = useState(null)
  const [mode, setMode] = useState("contacts")
  const [limit, setLimit] = useState(25)

  const [items, setItems] = useState([])
  const [zohoPage, setZohoPage] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const [rawPaging, setRawPaging] = useState({})
  const [query, setQuery] = useState("")
  const [loadingItems, setLoadingItems] = useState(false)

  /* Initial load */
  useEffect(() => {
    (async () => {
      if (!token.current) {
        toast.error("No auth token found. Please log in.")
        setLoading(false)
        return
      }
      try { await Promise.all([fetchProviders(), fetchAccounts()]) } finally { setLoading(false) }
    })()
    // eslint-disable-next-line
  }, [])

  /* If this page is opened *inside the popup* after OAuth, notify opener & close */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get("status")
    const crm = params.get("crm")
    if (status && window.opener) {
      // Tell parent and close
      try { window.opener.postMessage({ type: "crm-oauth", status, crm }, APP_ORIGIN) } catch {}
      window.close()
    }
  }, [])

  /* Listen for popup messages and refresh accounts immediately */
  useEffect(() => {
    function onMsg(ev) {
      // Only accept messages from our own origin
      if (ev.origin !== APP_ORIGIN) return
      const data = ev.data || {}
      if (data.type === "crm-oauth") {
        if (data.status === "success") {
          toast.success(`${(data.crm || "CRM").toString().toUpperCase()} connected`)
        } else {
          toast.error(`OAuth error: ${data.status || "unknown"}`)
        }
        fetchAccounts()
        setBusy(false)
      }
    }
    window.addEventListener("message", onMsg)
    return () => window.removeEventListener("message", onMsg)
  }, [])

  async function authedFetch(url, options = {}) {
    if (!token.current) throw new Error("No token")
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token.current}`,
        "Content-Type": options.body ? "application/json" : (options.headers || {})["Content-Type"],
      },
    })
    return res
  }

  async function fetchProviders() {
    try {
      const res = await authedFetch(EP.PROVIDERS)
      const data = await res.json()
      setProviders(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e); setProviders([]); toast.error("Failed to fetch providers")
    }
  }
  async function fetchAccounts() {
    try {
      const res = await authedFetch(EP.ACCOUNTS)
      const data = await res.json()
      setAccounts(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e); setAccounts([]); toast.error("Failed to fetch accounts")
    }
  }

  const isConnected = (crm) => accounts.some((a) => a.crm === crm)
  const accountFor = (crm) => accounts.find((a) => a.crm === crm)

  /* ───────────────────────── Connect Flow (OAuth) ───────────────────────── */
  async function startOAuth(crm) {
    try {
      setBusy(true)
      // Ask backend to start OAuth and tell it to send us back to *our* origin.
      const body = { redirect_to: `${APP_ORIGIN}${OAUTH_RETURN_PATH}` }
      const res = await authedFetch(EP.CONNECT(crm), { method: "POST", body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok || !json?.auth_url) throw new Error(json?.detail || "Failed to start OAuth")

      const url = json.auth_url
      const w = 680, h = 760
      const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2)
      const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2)
      const popup = window.open(url, "crm-oauth", `width=${w},height=${h},left=${left},top=${top}`)
      if (!popup) {
        // Fallback: full-page redirect
        window.location.href = url
        return
      }

      // Fallback polling in case postMessage is blocked or ALLOWED_REDIRECT_ORIGINS not set
      const start = Date.now()
      const interval = setInterval(async () => {
        if (popup.closed || Date.now() - start > 120000) {
          clearInterval(interval)
          await fetchAccounts()
          setBusy(false)
        } else {
          try { await fetchAccounts() } catch {}
        }
      }, 2000)
    } catch (e) {
      console.error(e); toast.error(e?.message || "OAuth failed to start"); setBusy(false)
    }
  }

  /* ───────────────────────── Token Flow (Close / HubSpot PAT) ───────────────────────── */
  function openTokenModal(crm) { setTokenForm({ crm, value: "" }); setShowTokenModal(true) }
  async function saveToken() {
    if (!tokenForm.crm || !tokenForm.value.trim()) { toast.error("Token is required"); return }
    try {
      setSavingToken(true)
      const res = await authedFetch(EP.SET_TOKEN(tokenForm.crm), { method: "POST", body: JSON.stringify({ access_token: tokenForm.value.trim() }) })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || j?.success === false) throw new Error(j?.detail || `HTTP ${res.status}`)
      toast.success(j?.message || "Token saved")
      setShowTokenModal(false)
      await fetchAccounts()
    } catch (e) {
      console.error(e); toast.error(e?.message || "Failed to save token")
    } finally { setSavingToken(false) }
  }

  /* Actions */
  async function disconnect(crm) {
    if (!confirm(`Disconnect ${crm}?`)) return
    try {
      const res = await authedFetch(EP.DISCONNECT(crm), { method: "DELETE" })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || j?.success === false) throw new Error(j?.detail || `HTTP ${res.status}`)
      toast.success(j?.message || "Disconnected")
      await fetchAccounts()
      if (activeCRM === crm) { setActiveCRM(null); setItems([]); setNextCursor(null); setRawPaging({}); setZohoPage(null) }
    } catch (e) {
      console.error(e); toast.error(e?.message || "Disconnect failed")
    }
  }
  async function ensureFresh(crm) {
    try {
      const res = await authedFetch(EP.ENSURE_FRESH(crm), { method: "POST" })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || j?.success === false) throw new Error(j?.detail || `HTTP ${res.status}`)
      toast.success("Token refreshed")
      await fetchAccounts()
    } catch (e) {
      console.error(e); toast.error(e?.message || "Refresh failed")
    }
  }

  /* ───────────────────────── Data browser ───────────────────────── */
  function selectCRM(crm) {
    setActiveCRM(crm || null)
    setItems([]); setNextCursor(null); setRawPaging({}); setZohoPage(null)
  }

  async function fetchList(initial = false) {
    if (!activeCRM) { toast.info("Select a connected CRM first"); return }
    try {
      setLoadingItems(true)
      const base = mode === "contacts" ? EP.CONTACTS(activeCRM) : EP.LEADS(activeCRM)
      const params = new URLSearchParams({ limit: String(limit || 25) })
      let url = `${base}?${params.toString()}`

      if (activeCRM === "zoho") {
        const pageParam = initial ? 1 : (nextCursor ? Number(nextCursor) : (zohoPage ? Number(zohoPage) : 1))
        url += `&page=${pageParam}`
      } else if (!initial && nextCursor) {
        url += `&cursor=${encodeURIComponent(nextCursor)}`
      }

      const res = await authedFetch(url)
      const j = await res.json()
      if (!res.ok) throw new Error(j?.detail || `HTTP ${res.status}`)

      const list = j?.items || []
      const next = j?.next_cursor || null

      setItems((prev) => (initial ? list : [...prev, ...list]))
      setNextCursor(next)
      setRawPaging(j?.raw_paging || {})
      if (activeCRM === "zoho") setZohoPage(next ? Number(next) : null)
    } catch (e) {
      console.error(e)
      const msg = String(e?.message || "")
      if (msg.includes("Invalid paging token")) {
        toast.error("Invalid/expired cursor; starting over.")
        setNextCursor(null); setZohoPage(null)
      } else { toast.error(msg || "Fetch failed") }
    } finally { setLoadingItems(false) }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => {
      const n = (it.name || "").toLowerCase()
      const e = (it.email || "").toLowerCase()
      const p = (it.phone || "").toLowerCase()
      const c = (it.company || "").toLowerCase()
      return n.includes(q) || e.includes(q) || p.includes(q) || c.includes(q)
    })
  }, [items, query])

  /* ───────────────────────── Render ───────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">CRM Integrations</h1>
            <p className="mt-1 text-sm sm:text-base text-slate-600">Connect HubSpot, Salesforce, Zoho, Pipedrive, or Close. Then browse Contacts & Leads.</p>
          </div>
          <div className="flex items-center gap-2">
            <ButtonGhost onClick={() => { fetchProviders(); fetchAccounts() }} icon={<RefreshCw className="h-4 w-4" />}>Refresh</ButtonGhost>
          </div>
        </motion.div>

        {/* Providers grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 animate-pulse h-28" />)
          ) : (
            providers.map((p) => {
              const connected = isConnected(p.name)
              const acc = accountFor(p.name)
              return (
                <motion.div key={p.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 ring-1 ring-blue-100"><BrandIcon crm={p.name} /></div>
                      <div>
                        <div className="text-base font-semibold text-slate-900 capitalize">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.type === "oauth" ? "OAuth" : "API key"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">{connected ? <Chip tone="green">Connected</Chip> : <Chip tone="slate">Not connected</Chip>}</div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {connected ? (
                      <>
                        {p.type === "oauth" && <ButtonGhost onClick={() => ensureFresh(p.name)} icon={<ShieldCheck className="h-4 w-4" />}>Ensure Fresh</ButtonGhost>}
                        <ButtonGhost onClick={() => disconnect(p.name)} icon={<Unlink className="h-4 w-4" />}>Disconnect</ButtonGhost>
                        <div className="ml-auto text-right">
                          <div className="text-xs text-slate-500">{acc?.external_account_name ? <span className="font-medium text-slate-700">{acc.external_account_name}</span> : "—"}</div>
                          <div className="text-[11px] text-slate-400">Connected: {fmtDT(acc?.connected_at)}</div>
                          {p.type === "oauth" && <div className="text-[11px] text-slate-400">Expires: {acc?.expires_at ? fmtDT(acc.expires_at) : "—"}</div>}
                        </div>
                      </>
                    ) : p.name === "close" ? (
                      <>
                        <ButtonPrimary onClick={() => openTokenModal("close")} icon={<KeyRound className="h-4 w-4" />}>Use API Key</ButtonPrimary>
                        <HelpText>Add a Close API key (Bearer) to connect.</HelpText>
                      </>
                    ) : p.name === "hubspot" ? (
                      <>
                        <ButtonPrimary onClick={() => startOAuth("hubspot")} disabled={busy} icon={busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}>Connect</ButtonPrimary>
                        <ButtonGhost onClick={() => openTokenModal("hubspot")} icon={<KeyRound className="h-4 w-4" />}>Use PAT</ButtonGhost>
                        <HelpText>OAuth recommended. PAT works for basic reads.</HelpText>
                      </>
                    ) : (
                      <>
                        <ButtonPrimary onClick={() => startOAuth(p.name)} disabled={busy} icon={busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}>Connect</ButtonPrimary>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[11rem]" title={p.scopes || ""}>Scopes: {p.scopes || "—"}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Dev hint if needed */}
                  {!connected && p.type === "oauth" && (
                    <div className="mt-2 text-[11px] text-slate-400 flex items-start gap-1">
                      <CircleAlert className="h-3.5 w-3.5 mt-0.5" />
                      <span>Ensure backend env <code>ALLOWED_REDIRECT_ORIGINS</code> includes <code>{APP_ORIGIN}</code>.</span>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </section>

        {/* Data browser */}
        <motion.section initial="hidden" animate="show" variants={fadeUp} className="mt-6 sm:mt-8 rounded-2xl border border-slate-200 bg-white">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 ring-1 ring-blue-100"><Database className="h-5 w-5 text-blue-600" /></div>
              <div>
                <div className="text-base font-semibold text-slate-900">Browse Data</div>
                <div className="text-xs text-slate-500">Contacts & Leads from your connected CRMs</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select value={activeCRM || ""} onChange={(e) => selectCRM(e.target.value || null)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
                <option value="">Select CRM</option>
                {accounts.map((a) => (
                  <option key={a.crm} value={a.crm}>{a.crm} {a.external_account_name ? `— ${a.external_account_name}` : ""}</option>
                ))}
              </select>
              <select value={mode} onChange={(e) => { setMode(e.target.value); setItems([]); setNextCursor(null); setRawPaging({}); setZohoPage(null) }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
                <option value="contacts">Contacts</option>
                <option value="leads">Leads</option>
              </select>
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value) || 25)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40">
                {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
              </select>
              <ButtonPrimary onClick={() => fetchList(true)} icon={<PlugZap className="h-4 w-4" />}>Fetch</ButtonPrimary>
              <ButtonGhost onClick={() => fetchList(false)} disabled={!nextCursor} icon={<ChevronRight className="h-4 w-4" />}>Load more</ButtonGhost>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 sm:px-5 pt-3">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, company…" className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-1 ring-white/60 transition focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300" />
            </div>
          </div>

          {/* Table */}
          <div className="p-4 sm:p-5">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Phone</th>
                    <th className="px-4 py-2 font-semibold">Company</th>
                    <th className="px-4 py-2 font-semibold">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingItems ? <RowSkeleton rows={5} cols={5} /> : (
                    filtered.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">No data. Click <span className="font-semibold">Fetch</span> to load {mode}.</td></tr>
                    ) : filtered.map((it) => (
                      <tr key={`${it.id}-${it.email || ""}`} className="odd:bg-white even:bg-slate-50/40">
                        <td className="px-4 py-2"><div className="flex items-center gap-2"><Users2 className="h-4 w-4 text-blue-600" /><span className="font-medium text-slate-900">{it.name || "—"}</span></div></td>
                        <td className="px-4 py-2 text-slate-700"><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /><span className="break-all">{it.email || "—"}</span></div></td>
                        <td className="px-4 py-2 text-slate-700"><div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /><span>{it.phone || "—"}</span></div></td>
                        <td className="px-4 py-2 text-slate-700"><div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" /><span>{it.company || "—"}</span></div></td>
                        <td className="px-4 py-2 text-slate-500 text-xs">{it.id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paging footer */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-xs text-slate-500">
                Next cursor: <span className="font-mono">{String(nextCursor || "—")}</span>
                {activeCRM === "zoho" && zohoPage ? <span className="ml-2">· Next page: <span className="font-mono">{zohoPage}</span></span> : null}
              </div>
              <div className="flex items-center gap-2">
                <ButtonGhost onClick={() => fetchList(true)} icon={<ChevronLeft className="h-4 w-4" />}>Reset</ButtonGhost>
                <ButtonPrimary onClick={() => fetchList(false)} disabled={!nextCursor} icon={<ChevronRight className="h-4 w-4" />}>Load more</ButtonPrimary>
              </div>
            </div>

            {/* Raw paging box */}
            {Object.keys(rawPaging || {}).length > 0 && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-700 mb-1">Provider paging</div>
                <pre className="text-[11px] text-slate-600 overflow-x-auto">{JSON.stringify(rawPaging, null, 2)}</pre>
              </div>
            )}
          </div>
        </motion.section>
      </main>

      {/* Token Modal */}
      <AnimatePresence>
        {showTokenModal && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={() => setShowTokenModal(false)} />
            <motion.div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6" variants={modalVariants} initial="hidden" animate="show" exit="exit">
              <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 grid place-items-center rounded-xl bg-blue-50 ring-1 ring-blue-100"><KeyRound className="h-5 w-5 text-blue-600" /></div>
                    <div><div className="font-semibold text-slate-900">Set Token</div><div className="text-xs text-slate-500">Provider: {tokenForm.crm}</div></div>
                  </div>
                  <ButtonGhost onClick={() => setShowTokenModal(false)}>Close</ButtonGhost>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="text-xs text-slate-600">Paste your {tokenForm.crm === "close" ? "Close API key (Bearer)" : "HubSpot Personal Access Token (PAT)"}.</div>
                  <input value={tokenForm.value} onChange={(e) => setTokenForm((f) => ({ ...f, value: e.target.value }))} placeholder="xxxxxxxxxxxxxxxxxxxxxxxx" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-cyan-400/40" />
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <ButtonGhost onClick={() => setShowTokenModal(false)}>Cancel</ButtonGhost>
                    <ButtonPrimary onClick={saveToken} disabled={savingToken} icon={savingToken ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}>{savingToken ? "Saving..." : "Save Token"}</ButtonPrimary>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-slate-500">
                    <CircleAlert className="h-3.5 w-3.5 mt-0.5" />
                    <span>Backend verifies via <code>/crm/token/{"{crm}"}</code>. Make sure CORS is enabled for your frontend origin.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── Small UI bits ───────────────────────── */
function Chip({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    blue: "bg-blue-100 text-blue-700 ring-blue-200",
  }
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", tones[tone] || tones.slate)}>{children}</span>
}
function HelpText({ children }) { return <div className="text-[11px] text-slate-500 inline-flex items-center gap-1">{children}</div> }
