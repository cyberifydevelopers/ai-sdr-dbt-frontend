"use client";

import { useMemo, useState } from "react";
import {
  Phone,
  MapPin,
  ShoppingCart,
  Search,
  Filter,
  Globe,
  Loader2,
  Copy,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "react-toastify";

// Works in Vite (import.meta), and Next.js (process.env) — falls back to localhost
const API_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000";

function cn(...a) {
  return a.filter(Boolean).join(" ");
}

function Flag({ iso }) {
  if (!iso || typeof iso !== "string" || iso.length !== 2) return null;
  const codePoints = [...iso.toUpperCase()].map(
    (c) => 127397 + c.charCodeAt(0)
  );
  return (
    <span className="mr-1" aria-hidden>
      {String.fromCodePoint(...codePoints)}
    </span>
  );
}

function ConfirmModal({ open, onClose, onConfirm, numbers = [] }) {
  if (!open) return null;
  const preview = numbers.slice(0, 5);
  const more = Math.max(0, numbers.length - preview.length);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-3 text-gray-900">Confirm Purchase</h2>
        <p className="mb-4 text-gray-700">
          You are about to purchase{" "}
          <span className="font-semibold">{numbers.length}</span>{" "}
          number{numbers.length > 1 ? "s" : ""}.
        </p>
        <div className="bg-gray-50 rounded-xl p-3 max-h-48 overflow-auto border border-gray-100 mb-5">
          {preview.map((n) => (
            <div key={n} className="font-mono text-sm text-gray-800 py-0.5">
              {n}
            </div>
          ))}
          {more > 0 && <div className="text-xs text-gray-500">…and {more} more</div>}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(numbers)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Yes, Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PhoneNumbers() {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [allFetchedNumbers, setAllFetchedNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmSelection, setConfirmSelection] = useState([]);

  const numbersPerPage = 10;
  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
  ];

  const getAuthToken = () => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  };

  const parseAreaCodes = (input) =>
    input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  // selection across pages
  const [selected, setSelected] = useState(() => new Set());
  const isSelected = (num) => selected.has(num);
  const toggleSelected = (num) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  // pagination memo
  const currentSlice = useMemo(() => {
    const indexOfLastNumber = currentPage * numbersPerPage;
    const indexOfFirstNumber = indexOfLastNumber - numbersPerPage;
    return allFetchedNumbers.slice(indexOfFirstNumber, indexOfLastNumber);
  }, [allFetchedNumbers, currentPage]);
  const totalPages = Math.ceil(allFetchedNumbers.length / numbersPerPage) || 1;

  const fetchPhoneNumbers = async () => {
    const area_codes = parseAreaCodes(searchQuery);
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/available_phone_numbers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          country: selectedCountry,
          area_codes: area_codes.length ? area_codes : null,
          limit,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          (data && data.detail && (data.detail.error || data.detail)) ||
          data?.message ||
          "Failed to fetch phone numbers.";
        setAllFetchedNumbers([]);
        toast.error(message);
        return;
      }
      const list = Array.isArray(data) ? data : [];
      setAllFetchedNumbers(list);
      setCurrentPage(1);
      clearSelection();
      if (list.length === 0) toast.info("No numbers found for your query.");
    } catch (e) {
      console.error(e);
      setAllFetchedNumbers([]);
      toast.error("Network error while fetching numbers.");
    } finally {
      setLoading(false);
    }
  };

  const purchaseNumbers = async (numbers) => {
    if (!numbers?.length) return;
    setPurchasing(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/purchase_phone_number`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ phone_number: numbers }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        const message =
          (data && data.detail && (data.detail.error || data.detail)) ||
          data?.message ||
          "Failed to purchase numbers.";
        toast.error(message);
        return;
      }
      setAllFetchedNumbers((prev) =>
        prev.filter((n) => !numbers.includes(n.phone_number))
      );
      clearSelection();
      toast.success(
        `✅ Purchased ${numbers.length} number${numbers.length > 1 ? "s" : ""}.`
      );
    } catch (e) {
      console.error(e);
      toast.error("Network error while purchasing.");
    } finally {
      setPurchasing(false);
      setConfirmModalOpen(false);
      setConfirmSelection([]);
    }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    if (selectedCountry === "US" || selectedCountry === "CA") {
      const cleaned = number.replace(/\D/g, "");
      const m = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
      if (m) return `+1 (${m[1]}) ${m[2]}-${m[3]}`;
    }
    return number;
  };

  const copyNumber = async (num) => {
    try {
      await navigator.clipboard.writeText(num);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed.");
    }
  };

  const pageInfo = (() => {
    const start =
      allFetchedNumbers.length === 0
        ? 0
        : (currentPage - 1) * numbersPerPage + 1;
    const end = Math.min(
      currentPage * numbersPerPage,
      allFetchedNumbers.length
    );
    return { start, end };
  })();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_55%),linear-gradient(to_bottom,white,white)]">
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-500" />

      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={(arr) => purchaseNumbers(arr)}
        numbers={confirmSelection}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                <Phone className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                  Premium Phone Numbers
                </h1>
                <p className="text-gray-600 mt-1">
                  Search, select, and purchase numbers worldwide in seconds.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:ml-auto w-full lg:w-auto">
              {[
                {
                  label: "Available",
                  value: allFetchedNumbers.length
                    ? `${allFetchedNumbers.length}+`
                    : "—",
                },
                { label: "Uptime", value: "99.9%" },
                { label: "Support", value: "24/7" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-center hover:shadow transition"
                >
                  <div className="text-xl font-bold text-gray-900">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Find Your Perfect Number
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2 text-blue-500" />
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2 text-green-500" />
                Area Codes (comma-separated, optional)
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., 212, 415"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2 text-purple-500" />
                Results Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number.parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="lg:col-span-1 flex items-end">
              <button
                onClick={fetchPhoneNumbers}
                disabled={loading}
                className={cn(
                  "w-full px-6 py-3 rounded-xl font-semibold text-white transition shadow-sm",
                  loading
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                )}
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Searching…
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Tip: leave area codes empty to search nationwide.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const pageNums = currentSlice.map((n) => n.phone_number);
                  const allPageSelected = pageNums.every((n) => selected.has(n));
                  setSelected((prev) => {
                    const next = new Set(prev);
                    if (allPageSelected) pageNums.forEach((n) => next.delete(n));
                    else pageNums.forEach((n) => next.add(n));
                    return next;
                  });
                }}
                className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
              >
                {currentSlice.every((n) => selected.has(n.phone_number))
                  ? "Unselect Page"
                  : "Select Page"}
              </button>
              <button
                onClick={() => {
                  if (selected.size === 0) {
                    toast.info("Select numbers first.");
                    return;
                  }
                  const arr = Array.from(selected);
                  setConfirmSelection(arr);
                  setConfirmModalOpen(true);
                }}
                disabled={selected.size === 0 || purchasing}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold transition shadow-sm",
                  selected.size === 0 || purchasing
                    ? "bg-green-300 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Selected ({selected.size})
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {loading
                    ? "Searching…"
                    : `Available Numbers (${allFetchedNumbers.length})`}
                </h3>
              </div>
              <div className="text-sm text-gray-600">
                Showing {pageInfo.start} – {pageInfo.end} of{" "}
                {allFetchedNumbers.length}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 sm:p-8">
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            </div>
          ) : allFetchedNumbers.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  No numbers available
                </p>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  Try different area codes or another country.
                </p>
                <button
                  onClick={fetchPhoneNumbers}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Select
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Region
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Capabilities
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentSlice.map((n, idx) => {
                      const checked = isSelected(n.phone_number);
                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleSelected(n.phone_number)}
                              className="text-gray-700 hover:scale-105 transition"
                              aria-label={checked ? "Unselect" : "Select"}
                            >
                              {checked ? (
                                <CheckSquare className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center ring-1 ring-blue-100">
                                <Phone className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-lg font-semibold text-gray-900">
                                  {formatPhoneNumber(n.phone_number)}
                                </div>
                                <button
                                  onClick={() => copyNumber(n.phone_number)}
                                  className="p-1 rounded hover:bg-gray-100 transition"
                                  title="Copy"
                                >
                                  <Copy className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-900">
                              <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                              <Flag iso={n.iso_country} />
                              {n.region || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {n.capabilities?.SMS && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                  SMS
                                </span>
                              )}
                              {n.capabilities?.MMS && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                                  MMS
                                </span>
                              )}
                              {n.capabilities?.voice && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                  Voice
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setConfirmSelection([n.phone_number]);
                                setConfirmModalOpen(true);
                              }}
                              disabled={purchasing}
                              className={cn(
                                "px-5 py-2 rounded-lg font-semibold text-white transition",
                                purchasing
                                  ? "bg-green-300"
                                  : "bg-green-600 hover:bg-green-700"
                              )}
                            >
                              {purchasing ? (
                                <span className="inline-flex items-center">
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Buying…
                                </span>
                              ) : (
                                <span className="inline-flex items-center">
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Buy Now
                                </span>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {currentSlice.map((n, idx) => {
                  const checked = isSelected(n.phone_number);
                  return (
                    <div key={idx} className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => toggleSelected(n.phone_number)}
                          className="text-gray-700 mr-3"
                          aria-label={checked ? "Unselect" : "Select"}
                        >
                          {checked ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center ring-1 ring-blue-100">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatPhoneNumber(n.phone_number)}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                              <Flag iso={n.iso_country} />
                              {n.region || "N/A"}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {n.capabilities?.SMS && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                  SMS
                                </span>
                              )}
                              {n.capabilities?.MMS && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                                  MMS
                                </span>
                              )}
                              {n.capabilities?.voice && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                  Voice
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => copyNumber(n.phone_number)}
                          className="p-1 rounded hover:bg-gray-100 ml-3"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setConfirmSelection([n.phone_number]);
                          setConfirmModalOpen(true);
                        }}
                        disabled={purchasing}
                        className={cn(
                          "mt-4 w-full px-4 py-2 rounded-lg font-semibold text-white transition",
                          purchasing ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
                        )}
                      >
                        {purchasing ? (
                          <span className="inline-flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Buying…
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Now
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {allFetchedNumbers.length > numbersPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-3 sm:mb-0">
                Showing {pageInfo.start} to {pageInfo.end} of {allFetchedNumbers.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) pageNumber = i + 1;
                    else if (currentPage <= 3) pageNumber = i + 1;
                    else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
                    else pageNumber = currentPage - 2 + i;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={cn(
                          "px-3 py-2 text-sm font-medium rounded-lg transition",
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Sticky bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 inset-x-0 px-4 sm:px-6 lg:px-8 z-40">
          <div className="max-w-7xl mx-auto rounded-2xl bg-white/90 backdrop-blur border border-gray-200 shadow-lg p-3 sm:p-4 flex items-center justify-between">
            <div className="text-sm sm:text-base">
              <span className="font-semibold">{selected.size}</span> selected
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearSelection}
                className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  const arr = Array.from(selected);
                  setConfirmSelection(arr);
                  setConfirmModalOpen(true);
                }}
                disabled={purchasing}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold text-white transition text-sm",
                  purchasing ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Selected
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
