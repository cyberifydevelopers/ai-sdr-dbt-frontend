import { useState, useEffect, useRef } from "react";
import { Phone, MapPin, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Color scheme for consistency with AssistantList
const colors = {
  primary: "#4F46E5", // indigo-600
  secondary: "#10B981", // emerald-500
  danger: "#EF4444", // red-500
  text: "#111827", // gray-900
  lightText: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  background: "#F3F4F6", // gray-100
  card: "#FFFFFF", // white
  hover: "#F9FAFB", // gray-50
};

export default function CallHistory() {
  const [purchasedNumbers, setPurchasedNumbers] = useState([]);
  const [filteredNumbers, setFilteredNumbers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, number: null });
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Fetch purchased numbers history
  const fetchPurchasedNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }
      const response = await fetch("http://localhost:8000/api/twillosendall", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = { message: "Failed to parse server response" };
        }
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }
      const data = await response.json();
      if (Array.isArray(data.numbers)) {
        if (data.numbers.some((num) => !num.hasOwnProperty("username"))) {
          console.warn("Some numbers are missing the 'username' field");
        }
        setPurchasedNumbers(data.numbers);
        setFilteredNumbers(data.numbers);
        console.log("Fetched numbers:", data.numbers);
      } else {
        console.warn("API response does not contain a numbers array:", data);
        setPurchasedNumbers([]);
        setFilteredNumbers([]);
      }
    } catch (error) {
      console.error("Error fetching purchased numbers:", error);
      setError(error.message);
      setPurchasedNumbers([]);
      setFilteredNumbers([]);
      toast.error(error.message || "Failed to fetch purchased numbers.");
    } finally {
      setLoading(false);
    }
  };

  // Filter numbers based on search term
  useEffect(() => {
    const filtered = purchasedNumbers.filter((number) =>
      (number.username || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Filtering numbers:", {
      searchTerm,
      filteredCount: filtered.length,
    });
    setFilteredNumbers(filtered);
    setCurrentPage(1);
  }, [searchTerm, purchasedNumbers]);

  // Delete number
  const handleDelete = async () => {
    if (!deleteModal.number) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }
      const id =
        deleteModal.number.id ||
        deleteModal.number.sid ||
        deleteModal.number.phone_number;
      const response = await fetch(
        `http://localhost:8000/api/callhistory/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = { message: "Failed to parse server response" };
        }
        throw new Error(data.message || "Failed to delete number");
      }
      setPurchasedNumbers((prev) =>
        prev.filter(
          (n) =>
            (n.id || n.sid || n.phone_number) !==
            (deleteModal.number.id ||
              deleteModal.number.sid ||
              deleteModal.number.phone_number)
        )
      );
      setFilteredNumbers((prev) =>
        prev.filter(
          (n) =>
            (n.id || n.sid || n.phone_number) !==
            (deleteModal.number.id ||
              deleteModal.number.sid ||
              deleteModal.number.phone_number)
        )
      );
      setDeleteModal({ open: false, number: null });
      toast.success("Number deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete number: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Load purchased numbers on component mount with polling
  useEffect(() => {
    fetchPurchasedNumbers();
    const interval = setInterval(fetchPurchasedNumbers, 10000);
    return () => clearInterval(interval);
  }, []);

  // Focus management for delete modal
  useEffect(() => {
    if (deleteModal.open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [deleteModal.open]);

  // Format phone number for display
  const formatPhoneNumber = (number) => {
    if (!number) return "N/A";
    const cleaned = String(number).replace(/\D/g, "");
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get region name from code
  const getRegionName = (regionCode) => {
    if (!regionCode) return "Unknown";
    const regionMap = {
      KY: "Kentucky",
      CA: "California",
      NY: "New York",
      TX: "Texas",
      FL: "Florida",
      IL: "Illinois",
      PA: "Pennsylvania",
      OH: "Ohio",
      GA: "Georgia",
      NC: "North Carolina",
      MI: "Michigan",
      NJ: "New Jersey",
      VA: "Virginia",
      WA: "Washington",
      AZ: "Arizona",
      MA: "Massachusetts",
      TN: "Tennessee",
      IN: "Indiana",
      MO: "Missouri",
      MD: "Maryland",
      WI: "Wisconsin",
      CO: "Colorado",
      MN: "Minnesota",
      SC: "South Carolina",
      AL: "Alabama",
      LA: "Louisiana",
      OR: "Oregon",
      OK: "Oklahoma",
      CT: "Connecticut",
      IA: "Iowa",
      MS: "Mississippi",
      AR: "Arkansas",
      UT: "Utah",
      KS: "Kansas",
      NV: "Nevada",
      NM: "New Mexico",
      NE: "Nebraska",
      WV: "West Virginia",
      ID: "Idaho",
      HI: "Hawaii",
      NH: "New Hampshire",
      ME: "Maine",
      MT: "Montana",
      RI: "Rhode Island",
      DE: "Delaware",
      SD: "South Dakota",
      ND: "North Dakota",
      AK: "Alaska",
      VT: "Vermont",
      WY: "Wyoming",
    };
    return regionMap[regionCode] || regionCode;
  };

  // Calculate pagination
  const totalPages = Math.ceil((filteredNumbers.length || 0) / itemsPerPage);
  const indexOfLastItem = Math.min(
    (currentPage || 1) * itemsPerPage,
    filteredNumbers.length || 0
  );
  const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);
  const currentItems = filteredNumbers.slice(indexOfFirstItem, indexOfLastItem);

  // Log pagination values for debugging
  useEffect(() => {
    console.log("Pagination values:", {
      currentPage,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem,
      filteredNumbersLength: filteredNumbers.length,
    });
  }, [
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    filteredNumbers,
  ]);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Defensive: reset to page 1 if filteredNumbers changes and currentPage is out of range
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredNumbers, totalPages, currentPage]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Delete Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-opacity-40 backdrop-blur-sm transition-opacity"
              onClick={() =>
                !deleting && setDeleteModal({ open: false, number: null })
              }
            ></div>
            {/* Modal */}
            <div
              className="relative z-10 bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              ref={modalRef}
              tabIndex={-1}
              aria-labelledby="delete-modal-title"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
                <h3
                  id="delete-modal-title"
                  className="text-lg font-bold"
                  style={{ color: colors.text }}
                >
                  Delete Number
                </h3>
              </div>
              <div className="mb-4" style={{ color: colors.lightText }}>
                Are you sure you want to delete this number?
                <div
                  className="mt-2 font-semibold"
                  style={{ color: colors.text }}
                >
                  {formatPhoneNumber(deleteModal.number?.phone_number)}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: colors.lightText }}
                >
                  Created: {formatDate(deleteModal.number?.created_at)}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-gray-200"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                  onClick={() =>
                    !deleting && setDeleteModal({ open: false, number: null })
                  }
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-red-600 disabled:opacity-50"
                  style={{ backgroundColor: colors.danger, color: "white" }}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className="mb-8 bg-white rounded-xl shadow-sm border py-4 px-6"
          style={{ borderColor: colors.border }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
              <div className="flex items-center space-x-4 flex-1">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Purchased Numbers
                  </h1>
                  <p
                    className="text-base sm:text-lg mt-1 sm:mt-2"
                    style={{ color: colors.lightText }}
                  >
                    View your purchased phone numbers
                  </p>
                </div>
              </div>
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.lightText }}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by username..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    color: colors.text,
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                try {
                  navigate("/admin/callhistory");
                } catch (err) {
                  toast.error("Navigation failed: " + err.message);
                }
              }}
              className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              style={{ backgroundColor: colors.primary, color: "white" }}
              aria-label="Buy Numbers"
            >
              <div className="flex items-center">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Buy Numbers</span>
                <span className="sm:hidden">Buy</span>
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 border rounded-lg p-4 text-center"
            style={{ borderColor: colors.border }}
          >
            <p className="text-sm" style={{ color: colors.danger }}>
              {error || "Failed to load purchased numbers"}
            </p>
            <button
              onClick={fetchPurchasedNumbers}
              className="mt-2 px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-indigo-700"
              style={{ backgroundColor: colors.primary, color: "white" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Total Count */}
        <div
          className="bg-white rounded-xl border p-4 sm:p-6 text-center"
          style={{ borderColor: colors.border }}
        >
          <div
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: colors.primary }}
          >
            {filteredNumbers.length || 0}
          </div>
          <div
            className="text-sm sm:text-base font-medium mt-2"
            style={{ color: colors.lightText }}
          >
            Total Purchased Numbers
          </div>
        </div>

        {/* Purchased Numbers Table */}
        <div
          className="bg-white rounded-xl border overflow-hidden"
          style={{ borderColor: colors.border }}
          id="purchased-numbers-table"
        >
          {/* Header */}
          <div
            className="px-4 sm:px-6 py-3 sm:py-4 border-b"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h2
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Purchased Numbers ({filteredNumbers.length || 0})
                </h2>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                <span
                  className="font-semibold"
                  style={{ color: colors.lightText }}
                >
                  Live Data
                </span>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <Phone
                  className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse mx-auto mb-4"
                  style={{ color: colors.primary }}
                />
                <p
                  className="text-lg sm:text-xl font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  Loading purchased numbers...
                </p>
                <p
                  className="text-sm sm:text-base"
                  style={{ color: colors.lightText }}
                >
                  Please wait while we fetch your data
                </p>
              </div>
            </div>
          ) : filteredNumbers.length === 0 ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: colors.background }}
                >
                  <Phone
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    style={{ color: colors.lightText }}
                  />
                </div>
                <p
                  className="text-lg sm:text-xl font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  No purchased numbers found
                </p>
                <p
                  className="text-sm sm:text-base mb-4"
                  style={{ color: colors.lightText }}
                >
                  Your purchased numbers will appear here
                </p>
                <button
                  onClick={() => {
                    try {
                      navigate("/admin/callhistory");
                    } catch (err) {
                      toast.error("Navigation failed: " + err.message);
                    }
                  }}
                  className="px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold transition-colors hover:bg-indigo-600"
                  style={{ backgroundColor: colors.primary, color: "white" }}
                  aria-label="Buy Numbers"
                >
                  Buy Numbers
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead
                    className="border-b"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    }}
                  >
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                        style={{ color: colors.text }}
                      >
                        Username
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                        style={{ color: colors.text }}
                      >
                        Phone Number
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                        style={{ color: colors.text }}
                      >
                        Region
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                        style={{ color: colors.text }}
                      >
                        Created
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                        style={{ color: colors.text }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{ borderColor: colors.border }}
                  >
                    {currentItems.map((number, index) => (
                      <tr
                        key={
                          number.id ||
                          number.sid ||
                          number.phone_number ||
                          index
                        }
                        className="transition-colors"
                        style={{ backgroundColor: colors.card }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="text-sm font-medium"
                            style={{ color: colors.text }}
                          >
                            {number.username || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                              style={{ backgroundColor: colors.primary + "20" }}
                            >
                              <Phone
                                className="w-5 h-5"
                                style={{ color: colors.primary }}
                              />
                            </div>
                            <div
                              className="text-lg font-bold"
                              style={{ color: colors.text }}
                            >
                              {formatPhoneNumber(number.phone_number)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin
                              className="w-4 h-4 mr-2"
                              style={{ color: colors.lightText }}
                            />
                            <div>
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.text }}
                              >
                                {getRegionName(number.region)}
                              </span>
                              <div
                                className="text-xs"
                                style={{ color: colors.lightText }}
                              >
                                ({number.region || "N/A"})
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="text-xs font-mono bg-gray-100 px-2 py-1 rounded"
                            style={{ color: colors.lightText }}
                          >
                            {formatDate(number.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="flex items-center px-3 py-2 rounded-lg font-semibold transition-colors hover:bg-red-100"
                            style={{
                              backgroundColor: colors.danger + "10",
                              color: colors.danger,
                            }}
                            onClick={() =>
                              setDeleteModal({ open: true, number })
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div
                className="lg:hidden divide-y"
                style={{ borderColor: colors.border }}
              >
                {currentItems.map((number, index) => (
                  <div
                    key={
                      number.id || number.sid || number.phone_number || index
                    }
                    className="p-4 sm:p-6"
                    style={{ backgroundColor: colors.card }}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.primary + "20" }}
                      >
                        <Phone
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-sm font-medium mb-2"
                          style={{ color: colors.text }}
                        >
                          {number.username || "N/A"}
                        </div>
                        <div
                          className="text-lg font-bold mb-2"
                          style={{ color: colors.text }}
                        >
                          {formatPhoneNumber(number.phone_number)}
                        </div>
                        <div className="flex items-center mb-2">
                          <MapPin
                            className="w-4 h-4 mr-1"
                            style={{ color: colors.lightText }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: colors.lightText }}
                          >
                            {getRegionName(number.region)} (
                            {number.region || "N/A"})
                          </span>
                        </div>
                        <div
                          className="text-xs font-mono bg-gray-100 px-2 py-1 rounded inline-block mb-2"
                          style={{ color: colors.lightText }}
                        >
                          {formatDate(number.created_at)}
                        </div>
                        <div>
                          <button
                            className="flex items-center px-3 py-2 rounded-lg font-semibold transition-colors hover:bg-red-100"
                            style={{
                              backgroundColor: colors.danger + "10",
                              color: colors.danger,
                            }}
                            onClick={() =>
                              setDeleteModal({ open: true, number })
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && (filteredNumbers.length || 0) > itemsPerPage && (
          <div
            className="bg-white rounded-xl border overflow-hidden"
            style={{ borderColor: colors.border }}
          >
            <div
              className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              {/* Results Info */}
              <div
                className="text-sm mb-4 sm:mb-0"
                style={{ color: colors.lightText }}
              >
                Showing{" "}
                {(filteredNumbers.length || 0) === 0 ? 0 : indexOfFirstItem + 1}{" "}
                to {indexOfLastItem} of {filteredNumbers.length || 0} results
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: colors.lightText,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  aria-label="Previous page"
                  aria-controls="purchased-numbers-table"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    let pages = [];
                    let startPage = 1;
                    let endPage = totalPages;
                    if (totalPages > 5) {
                      if (currentPage <= 3) {
                        startPage = 1;
                        endPage = 5;
                      } else if (currentPage >= totalPages - 2) {
                        startPage = totalPages - 4;
                        endPage = totalPages;
                      } else {
                        startPage = currentPage - 2;
                        endPage = currentPage + 2;
                      }
                    }
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageClick(i)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === i
                              ? "text-white"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          style={{
                            backgroundColor:
                              currentPage === i ? colors.primary : colors.card,
                            color:
                              currentPage === i ? "white" : colors.lightText,
                            borderColor: colors.border,
                          }}
                          aria-current={currentPage === i ? "page" : undefined}
                          aria-controls="purchased-numbers-table"
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: colors.lightText,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  aria-label="Next page"
                  aria-controls="purchased-numbers-table"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
