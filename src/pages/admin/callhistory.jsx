
import { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  ShoppingCart,
  Search,
  Filter,
  Globe,
  Loader2,
  Zap,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";

// Modal component for confirmation
function ConfirmModal({ open, onClose, onConfirm, phoneNumber }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-bold mb-2 text-gray-900">
          Confirm Purchase
        </h2>
        <p className="mb-4 text-gray-700">
          Are you sure you want to purchase the number
          <span className="font-mono font-semibold text-blue-700 ml-1">
            {phoneNumber}
          </span>
          ?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
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
  const [purchasing, setPurchasing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [numbersPerPage] = useState(10); // Fixed at 10 numbers per page

  // Modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingPurchaseNumber, setPendingPurchaseNumber] = useState(null);

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
  ];

  // Helper to get country name from code
  const getCountryName = (code) => {
    const found = countries.find((c) => c.code === code);
    return found ? found.name : code;
  };

  // Helper to get token from localStorage (or other storage)
  const getAuthToken = () => {
    // Adjust this if your token is stored elsewhere
    return localStorage.getItem("token");
  };

  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
  // Fetch available phone numbers
  const fetchPhoneNumbers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `/api/twilio/available-numbers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            country: selectedCountry,
            limit: limit,
            areaCode: searchQuery || undefined,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAllFetchedNumbers(data.available_numbers || []);
        setCurrentPage(1); // Reset to first page on new search
      } else {
        console.error("Failed to fetch numbers:", data.message);
        setAllFetchedNumbers([]);
        toast.error(
          `Failed to fetch numbers: ${data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
      setAllFetchedNumbers([]);
      toast.error("Error fetching phone numbers.");
    } finally {
      setLoading(false);
    }
  };

  // Purchase phone number (actual API call)
  const doPurchaseNumber = async (phoneNumber) => {
    setPurchasing(phoneNumber);

    // Find the number object to get its region
    const numberObj = allFetchedNumbers.find(
      (num) => num.phone_number === phoneNumber
    );
    const regionName =
      numberObj && numberObj.region
        ? numberObj.region
        : getCountryName(selectedCountry);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:8000/api/twilio/purchase-number`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            country: regionName,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(`✅ Successfully purchased ${phoneNumber}!`);
        // Remove purchased number from list
        setAllFetchedNumbers((prev) =>
          prev.filter((num) => num.phone_number !== phoneNumber)
        );
      } else {
        toast.error(`Failed to purchase number: ${data.message}`);
      }
    } catch (error) {
      console.error("Error purchasing number:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setPurchasing(null);
      setConfirmModalOpen(false);
      setPendingPurchaseNumber(null);
    }
  };

  // Handler to open confirmation modal
  const handleBuyClick = (phoneNumber) => {
    setPendingPurchaseNumber(phoneNumber);
    setConfirmModalOpen(true);
  };

  // Handler for confirming purchase in modal
  const handleConfirmPurchase = () => {
    if (pendingPurchaseNumber) {
      doPurchaseNumber(pendingPurchaseNumber);
    }
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setConfirmModalOpen(false);
    setPendingPurchaseNumber(null);
  };

  // Load numbers on country change
  useEffect(() => {
    setAllFetchedNumbers([]);
    setCurrentPage(1); // Reset to first page
  }, [selectedCountry, searchQuery, limit]);

  // Format phone number for display
  const formatPhoneNumber = (number) => {
    if (selectedCountry === "US" || selectedCountry === "CA") {
      const cleaned = number.replace(/\D/g, "");
      const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return number;
  };

  // Calculate pagination
  const indexOfLastNumber = currentPage * numbersPerPage;
  const indexOfFirstNumber = indexOfLastNumber - numbersPerPage;
  const currentNumbers = allFetchedNumbers.slice(
    indexOfFirstNumber,
    indexOfLastNumber
  );
  const totalPages = Math.ceil(allFetchedNumbers.length / numbersPerPage);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPurchase}
        phoneNumber={pendingPurchaseNumber}
      />
      <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Premium Phone Numbers
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">
                Get instant access to professional phone numbers worldwide
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                50K+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Available Numbers
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                99.9%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Uptime
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Support
              </div>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Find Your Perfect Number
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Country Selection */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                <Globe className="w-4 h-4 inline mr-2 text-blue-500" />
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Code Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                <Search className="w-4 h-4 inline mr-2 text-green-500" />
                Area Code (Optional)
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., 212, 415"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
              />
            </div>

            {/* Limit */}
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                <Filter className="w-4 h-4 inline mr-2 text-purple-500" />
                Results Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm sm:text-base"
              >
                <option value={10}>10 Numbers</option>
                <option value={20}>20 Numbers</option>
                <option value={50}>50 Numbers</option>
                <option value={100}>100 Numbers</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-1 lg:col-span-1 flex items-end">
              <button
                onClick={fetchPhoneNumbers}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-h-[44px]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                    <span className="hidden sm:inline">Searching...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Search Numbers</span>
                    <span className="sm:hidden">Search</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Available Numbers ({allFetchedNumbers.length})
                </h2>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                <span className="font-semibold">Live Results</span>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Searching for available numbers...
                </p>
                <p className="text-sm sm:text-base text-gray-500">
                  This may take a few seconds
                </p>
              </div>
            </div>
          ) : allFetchedNumbers.length === 0 ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  No numbers available
                </p>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  Try a different country or area code
                </p>
                <button
                  onClick={fetchPhoneNumbers}
                  className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Region
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentNumbers.map((number, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                              <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatPhoneNumber(number.phone_number)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {number.region || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                            Available
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleBuyClick(number.phone_number)}
                            disabled={purchasing === number.phone_number}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
                          >
                            {purchasing === number.phone_number ? (
                              <div className="flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Buying...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Buy Now
                              </div>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {currentNumbers.map((number, index) => (
                  <div key={index} className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatPhoneNumber(number.phone_number)}
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-600">
                              {number.region || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                        Available
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleBuyClick(number.phone_number)}
                        disabled={purchasing === number.phone_number}
                        className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-h-[44px] min-w-[100px] sm:min-w-[120px] w-full"
                      >
                        {purchasing === number.phone_number ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Buying...</span>
                            <span className="sm:hidden">...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Buy Now</span>
                            <span className="sm:hidden">Buy</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {allFetchedNumbers.length > numbersPerPage && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
              {/* Results Info */}
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing {indexOfFirstNumber + 1} to{" "}
                {Math.min(indexOfLastNumber, allFetchedNumbers.length)} of{" "}
                {allFetchedNumbers.length} results
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

