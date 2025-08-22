
// import { useState, useEffect } from "react";
// import {
//   Phone,
//   MapPin,
//   ShoppingCart,
//   Search,
//   Filter,
//   Globe,
//   Loader2,
//   Zap,
//   Shield,
// } from "lucide-react";
// import { toast } from "react-toastify";

// // Modal component for confirmation
// function ConfirmModal({ open, onClose, onConfirm, phoneNumber }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
//         <h2 className="text-lg font-bold mb-2 text-gray-900">
//           Confirm Purchase
//         </h2>
//         <p className="mb-4 text-gray-700">
//           Are you sure you want to purchase the number
//           <span className="font-mono font-semibold text-blue-700 ml-1">
//             {phoneNumber}
//           </span>
//           ?
//         </p>
//         <div className="flex justify-end space-x-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
//           >
//             Yes, Buy
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function PhoneNumbers() {
//   const [selectedCountry, setSelectedCountry] = useState("US");
//   const [allFetchedNumbers, setAllFetchedNumbers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [purchasing, setPurchasing] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [limit, setLimit] = useState(20);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [numbersPerPage] = useState(10); // Fixed at 10 numbers per page

//   // Modal state
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [pendingPurchaseNumber, setPendingPurchaseNumber] = useState(null);

//   const countries = [
//     { code: "US", name: "United States", flag: "🇺🇸" },
//     { code: "CA", name: "Canada", flag: "🇨🇦" },
//     { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
//     { code: "AU", name: "Australia", flag: "🇦🇺" },
//     { code: "DE", name: "Germany", flag: "🇩🇪" },
//     { code: "FR", name: "France", flag: "🇫🇷" },
//   ];

//   // Helper to get country name from code
//   const getCountryName = (code) => {
//     const found = countries.find((c) => c.code === code);
//     return found ? found.name : code;
//   };

//   // Helper to get token from localStorage (or other storage)
//   const getAuthToken = () => {
//     // Adjust this if your token is stored elsewhere
//     return localStorage.getItem("token");
//   };

//   const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
//   // Fetch available phone numbers
//   const fetchPhoneNumbers = async () => {
//     setLoading(true);
//     try {
//       const token = getAuthToken();
//       const response = await fetch(
//         `/api/twilio/available-numbers`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           body: JSON.stringify({
//             country: selectedCountry,
//             limit: limit,
//             areaCode: searchQuery || undefined,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setAllFetchedNumbers(data.available_numbers || []);
//         setCurrentPage(1); // Reset to first page on new search
//       } else {
//         console.error("Failed to fetch numbers:", data.message);
//         setAllFetchedNumbers([]);
//         toast.error(
//           `Failed to fetch numbers: ${data.message || "Unknown error"}`
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching phone numbers:", error);
//       setAllFetchedNumbers([]);
//       toast.error("Error fetching phone numbers.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Purchase phone number (actual API call)
//   const doPurchaseNumber = async (phoneNumber) => {
//     setPurchasing(phoneNumber);

//     // Find the number object to get its region
//     const numberObj = allFetchedNumbers.find(
//       (num) => num.phone_number === phoneNumber
//     );
//     const regionName =
//       numberObj && numberObj.region
//         ? numberObj.region
//         : getCountryName(selectedCountry);

//     try {
//       const token = getAuthToken();
//       const response = await fetch(
//         `http://localhost:8000/api/twilio/purchase-number`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           body: JSON.stringify({
//             phoneNumber: phoneNumber,
//             country: regionName,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         toast.success(`✅ Successfully purchased ${phoneNumber}!`);
//         // Remove purchased number from list
//         setAllFetchedNumbers((prev) =>
//           prev.filter((num) => num.phone_number !== phoneNumber)
//         );
//       } else {
//         toast.error(`Failed to purchase number: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Error purchasing number:", error);
//       toast.error("Network error. Please try again.");
//     } finally {
//       setPurchasing(null);
//       setConfirmModalOpen(false);
//       setPendingPurchaseNumber(null);
//     }
//   };

//   // Handler to open confirmation modal
//   const handleBuyClick = (phoneNumber) => {
//     setPendingPurchaseNumber(phoneNumber);
//     setConfirmModalOpen(true);
//   };

//   // Handler for confirming purchase in modal
//   const handleConfirmPurchase = () => {
//     if (pendingPurchaseNumber) {
//       doPurchaseNumber(pendingPurchaseNumber);
//     }
//   };

//   // Handler for closing modal
//   const handleCloseModal = () => {
//     setConfirmModalOpen(false);
//     setPendingPurchaseNumber(null);
//   };

//   // Load numbers on country change
//   useEffect(() => {
//     setAllFetchedNumbers([]);
//     setCurrentPage(1); // Reset to first page
//   }, [selectedCountry, searchQuery, limit]);

//   // Format phone number for display
//   const formatPhoneNumber = (number) => {
//     if (selectedCountry === "US" || selectedCountry === "CA") {
//       const cleaned = number.replace(/\D/g, "");
//       const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
//       if (match) {
//         return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
//       }
//     }
//     return number;
//   };

//   // Calculate pagination
//   const indexOfLastNumber = currentPage * numbersPerPage;
//   const indexOfFirstNumber = indexOfLastNumber - numbersPerPage;
//   const currentNumbers = allFetchedNumbers.slice(
//     indexOfFirstNumber,
//     indexOfLastNumber
//   );
//   const totalPages = Math.ceil(allFetchedNumbers.length / numbersPerPage);

//   // Handle pagination
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handlePageClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
//       {/* Confirmation Modal */}
//       <ConfirmModal
//         open={confirmModalOpen}
//         onClose={handleCloseModal}
//         onConfirm={handleConfirmPurchase}
//         phoneNumber={pendingPurchaseNumber}
//       />
//       <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
//         {/* Hero Section */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
//             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
//               <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
//                 Premium Phone Numbers
//               </h1>
//               <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">
//                 Get instant access to professional phone numbers worldwide
//               </p>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
//             <div className="text-center p-4 bg-gray-50 rounded-lg">
//               <div className="text-2xl sm:text-3xl font-bold text-blue-600">
//                 50K+
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
//                 Available Numbers
//               </div>
//             </div>
//             <div className="text-center p-4 bg-gray-50 rounded-lg">
//               <div className="text-2xl sm:text-3xl font-bold text-green-600">
//                 99.9%
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
//                 Uptime
//               </div>
//             </div>
//             <div className="text-center p-4 bg-gray-50 rounded-lg">
//               <div className="text-2xl sm:text-3xl font-bold text-purple-600">
//                 24/7
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
//                 Support
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Filters */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
//           <div className="flex items-center space-x-3 mb-4 sm:mb-6">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//               <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//             </div>
//             <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
//               Find Your Perfect Number
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {/* Country Selection */}
//             <div className="sm:col-span-2 lg:col-span-1">
//               <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
//                 <Globe className="w-4 h-4 inline mr-2 text-blue-500" />
//                 Country
//               </label>
//               <select
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base"
//               >
//                 {countries.map((country) => (
//                   <option key={country.code} value={country.code}>
//                     {country.flag} {country.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Area Code Search */}
//             <div className="sm:col-span-2 lg:col-span-1">
//               <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
//                 <Search className="w-4 h-4 inline mr-2 text-green-500" />
//                 Area Code (Optional)
//               </label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="e.g., 212, 415"
//                 className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
//               />
//             </div>

//             {/* Limit */}
//             <div className="sm:col-span-1 lg:col-span-1">
//               <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
//                 <Filter className="w-4 h-4 inline mr-2 text-purple-500" />
//                 Results Limit
//               </label>
//               <select
//                 value={limit}
//                 onChange={(e) => setLimit(Number.parseInt(e.target.value))}
//                 className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm sm:text-base"
//               >
//                 <option value={10}>10 Numbers</option>
//                 <option value={20}>20 Numbers</option>
//                 <option value={50}>50 Numbers</option>
//                 <option value={100}>100 Numbers</option>
//               </select>
//             </div>

//             {/* Search Button */}
//             <div className="sm:col-span-1 lg:col-span-1 flex items-end">
//               <button
//                 onClick={fetchPhoneNumbers}
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-h-[44px]"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
//                     <span className="hidden sm:inline">Searching...</span>
//                     <span className="sm:hidden">...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center">
//                     <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
//                     <span className="hidden sm:inline">Search Numbers</span>
//                     <span className="sm:hidden">Search</span>
//                   </div>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Results Table */}
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           {/* Header */}
//           <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
//               <div className="flex items-center space-x-3">
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
//                 </div>
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">
//                   Available Numbers ({allFetchedNumbers.length})
//                 </h2>
//               </div>
//               <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
//                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
//                 <span className="font-semibold">Live Results</span>
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           {loading ? (
//             <div className="flex items-center justify-center py-12 sm:py-20">
//               <div className="text-center">
//                 <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-blue-500 mx-auto mb-4" />
//                 <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
//                   Searching for available numbers...
//                 </p>
//                 <p className="text-sm sm:text-base text-gray-500">
//                   This may take a few seconds
//                 </p>
//               </div>
//             </div>
//           ) : allFetchedNumbers.length === 0 ? (
//             <div className="flex items-center justify-center py-12 sm:py-20">
//               <div className="text-center">
//                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
//                 </div>
//                 <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
//                   No numbers available
//                 </p>
//                 <p className="text-sm sm:text-base text-gray-500 mb-4">
//                   Try a different country or area code
//                 </p>
//                 <button
//                   onClick={fetchPhoneNumbers}
//                   className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm sm:text-base"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table */}
//               <div className="hidden lg:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
//                         Phone Number
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
//                         Region
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentNumbers.map((number, index) => (
//                       <tr
//                         key={index}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
//                               <Phone className="w-5 h-5 text-blue-600" />
//                             </div>
//                             <div className="text-lg font-bold text-gray-900">
//                               {formatPhoneNumber(number.phone_number)}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <MapPin className="w-4 h-4 text-gray-500 mr-2" />
//                             <span className="text-sm font-medium text-gray-900">
//                               {number.region || "N/A"}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
//                             Available
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             onClick={() => handleBuyClick(number.phone_number)}
//                             disabled={purchasing === number.phone_number}
//                             className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
//                           >
//                             {purchasing === number.phone_number ? (
//                               <div className="flex items-center justify-center">
//                                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                                 Buying...
//                               </div>
//                             ) : (
//                               <div className="flex items-center justify-center">
//                                 <ShoppingCart className="w-4 h-4 mr-2" />
//                                 Buy Now
//                               </div>
//                             )}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards */}
//               <div className="lg:hidden divide-y divide-gray-200">
//                 {currentNumbers.map((number, index) => (
//                   <div key={index} className="p-4 sm:p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                           <Phone className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <div className="text-lg font-bold text-gray-900">
//                             {formatPhoneNumber(number.phone_number)}
//                           </div>
//                           <div className="flex items-center mt-1">
//                             <MapPin className="w-4 h-4 text-gray-500 mr-1" />
//                             <span className="text-sm text-gray-600">
//                               {number.region || "N/A"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
//                         Available
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <button
//                         onClick={() => handleBuyClick(number.phone_number)}
//                         disabled={purchasing === number.phone_number}
//                         className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-h-[44px] min-w-[100px] sm:min-w-[120px] w-full"
//                       >
//                         {purchasing === number.phone_number ? (
//                           <div className="flex items-center justify-center">
//                             <Loader2 className="w-4 h-4 animate-spin mr-1 sm:mr-2" />
//                             <span className="hidden sm:inline">Buying...</span>
//                             <span className="sm:hidden">...</span>
//                           </div>
//                         ) : (
//                           <div className="flex items-center justify-center">
//                             <ShoppingCart className="w-4 h-4 mr-1 sm:mr-2" />
//                             <span className="hidden sm:inline">Buy Now</span>
//                             <span className="sm:hidden">Buy</span>
//                           </div>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Pagination Controls */}
//         {allFetchedNumbers.length > numbersPerPage && (
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
//               {/* Results Info */}
//               <div className="text-sm text-gray-700 mb-4 sm:mb-0">
//                 Showing {indexOfFirstNumber + 1} to{" "}
//                 {Math.min(indexOfLastNumber, allFetchedNumbers.length)} of{" "}
//                 {allFetchedNumbers.length} results
//               </div>

//               {/* Pagination Buttons */}
//               <div className="flex items-center space-x-2">
//                 {/* Previous Button */}
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Previous
//                 </button>

//                 {/* Page Numbers */}
//                 <div className="flex items-center space-x-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNumber;
//                     if (totalPages <= 5) {
//                       pageNumber = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNumber = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNumber = totalPages - 4 + i;
//                     } else {
//                       pageNumber = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => handlePageClick(pageNumber)}
//                         className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                           currentPage === pageNumber
//                             ? "bg-blue-600 text-white"
//                             : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {/* Next Button */}
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage >= totalPages}
//                   className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




























"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Phone,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  User2,
  Mail,
  MapPin,
  Globe,
  Link,
  X,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

/* ---------------------------------------------------------
   Config
--------------------------------------------------------- */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

const R = {
  PHONE_NUMBERS: `${API_URL}/api/admin/phone-numbers`,
  PHONE_NUMBER: (id) => `${API_URL}/api/admin/phone-numbers/${id}`,
};

const neonGrad = "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600";

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${API_URL}${path}`;
};

function fmtMoney(n) {
  if (n === null || n === undefined || isNaN(Number(n))) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(Number(n));
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

/* ---------------------------------------------------------
   Small UI atoms (kept inline for easy copy/paste)
--------------------------------------------------------- */
function Button({ children, className = "", variant = "outline", size = "md", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-3 py-2",
    lg: "text-sm px-4 py-2.5",
  };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm",
    outline: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 shadow-sm",
    subtle: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent",
  };
  return (
    <button {...props} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
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

function NeonRail() {
  return (
    <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
  );
}

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

function Avatar({ name = "?", size = 38, url = null }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div
      className="overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100 grid place-content-center text-slate-700 font-bold"
      style={{ width: size, height: size }}
      title={name}
    >
      {/* Image optional; owner object here usually has no photo */}
      <span style={{ fontSize: size < 40 ? 12 : 13 }}>{initials}</span>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
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
   Main Page: Admin Phone Numbers
--------------------------------------------------------- */
export default function AdminPhoneNumbers() {
  const [numbers, setNumbers] = useState([]);
  const [stats, setStats] = useState({ total: 0, attached: 0, unattached: 0, countries: 0 });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // filters/search/pagination
  const [q, setQ] = useState("");
  const [attachedFilter, setAttachedFilter] = useState("all"); // all | attached | unattached
  const [countryFilter, setCountryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // impersonation state (same UX as Users page)
  const [impersonationInfo, setImpersonationInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("impersonation_info") || "null");
    } catch {
      return null;
    }
  });

  // confirm delete modal
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchNumbers = useCallback(async () => {
    if (impersonationInfo) {
      setNumbers([]);
      setStats({ total: 0, attached: 0, unattached: 0, countries: 0 });
      setErr("You're in impersonation mode. Exit impersonation to use admin tools.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setNumbers([]);
      setStats({ total: 0, attached: 0, unattached: 0, countries: 0 });
      setErr("No auth token found.");
      toast.error("No authentication token found.");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const res = await fetch(R.PHONE_NUMBERS, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}${txt ? ` — ${txt}` : ""}`);
      }

      const data = await res.json();
      if (!data?.success || !Array.isArray(data?.phone_numbers)) {
        throw new Error("Unexpected response shape.");
      }

      const list = (data.phone_numbers || []).map((n) => ({
        id: n.id,
        phone_number: n.phone_number,
        friendly_name: n.friendly_name || "—",
        region: n.region || "—",
        postal_code: n.postal_code || "",
        iso_country: (n.iso_country || "").toUpperCase(),
        last_month_payment: n.last_month_payment,
        created_at: n.created_at,
        updated_at: n.updated_at,
        attached_assistant: n.attached_assistant, // id or null
        vapi_phone_uuid: n.vapi_phone_uuid || null,
        owner: n.user || null, // {id, name, email} | null
      }));

      // Sort newest first (updated_at if present, else created_at)
      list.sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));

      setNumbers(list);

      const attached = list.filter((x) => x.attached_assistant !== null && x.attached_assistant !== undefined).length;
      const total = data.total_phone_numbers ?? list.length;
      const unattached = Math.max(0, total - attached);
      const countries = new Set(list.map((x) => x.iso_country || "")).size;

      setStats({ total, attached, unattached, countries });
    } catch (e) {
      setErr(e?.message || "Failed to load phone numbers");
      toast.error(e?.message || "Failed to load phone numbers");
    } finally {
      setLoading(false);
    }
  }, [impersonationInfo]);

  useEffect(() => {
    fetchNumbers();
  }, [fetchNumbers]);

  // compute filters, available countries
  const availableCountries = useMemo(() => {
    const set = new Set(numbers.map((n) => n.iso_country).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [numbers]);

  const filtered = useMemo(() => {
    let out = [...numbers];

    if (q.trim()) {
      const s = q.trim().toLowerCase();
      out = out.filter((n) =>
        String(n.phone_number || "").toLowerCase().includes(s) ||
        String(n.friendly_name || "").toLowerCase().includes(s) ||
        String(n.region || "").toLowerCase().includes(s) ||
        String(n.postal_code || "").toLowerCase().includes(s) ||
        String(n.owner?.name || "").toLowerCase().includes(s) ||
        String(n.owner?.email || "").toLowerCase().includes(s)
      );
    }

    if (attachedFilter !== "all") {
      out = out.filter((n) => (attachedFilter === "attached" ? n.attached_assistant : !n.attached_assistant));
    }

    if (countryFilter !== "all") {
      out = out.filter((n) => (n.iso_country || "").toUpperCase() === countryFilter);
    }

    return out;
  }, [numbers, q, attachedFilter, countryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, attachedFilter, countryFilter]);

  const askDelete = (id) => setConfirmDeleteId(id);

  const doDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) return toast.error("No authentication token found.");

    const item = numbers.find((n) => n.id === id);
    if (item?.attached_assistant) {
      return toast.error("This number is attached to an assistant. Detach it first from the Assistants page.");
    }

    try {
      setDeletingId(id);
      const res = await fetch(R.PHONE_NUMBER(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
      }

      toast.success("🗑️ Phone number deleted");
      setNumbers((prev) => prev.filter((n) => n.id !== id));
      setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1), unattached: Math.max(0, prev.unattached - 1) }));
      setConfirmDeleteId(null);
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const exitImpersonation = () => {
    const adminToken = localStorage.getItem("admin_token_backup");
    if (!adminToken) {
      toast.error("No admin backup token found.");
      return;
    }
    localStorage.setItem("token", adminToken);
    localStorage.removeItem("admin_token_backup");
    localStorage.removeItem("impersonation_info");
    setImpersonationInfo(null);
    toast.success("↩️ Exited impersonation");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Impersonation banner */}
      {impersonationInfo && (
        <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-3 sm:px-4 py-2 text-amber-800">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <Link className="h-4 w-4 shrink-0" />
              <span className="font-semibold shrink-0">Impersonation active:</span>
              <span className="truncate">Acting as <b className="break-all">{impersonationInfo.acting_as?.email}</b></span>
            </div>
            <Button onClick={exitImpersonation} variant="outline" className="text-amber-800 border-amber-300 hover:bg-amber-100" size="sm">
              <X className="mr-2 h-4 w-4" /> Exit
            </Button>
          </div>
        </div>
      )}

      {/* soft glows (clipped so no overflow) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Header */}
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
                <Phone className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
                  <span className={`bg-clip-text text-transparent ${neonGrad}`}>Phone Numbers</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">View and manage purchased phone numbers. Delete numbers that are not attached to an assistant.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={fetchNumbers} disabled={loading || !!impersonationInfo}>
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
          <StatCard label="Total Numbers" value={stats.total} Icon={Phone} tone="blue" />
          <StatCard label="Attached" value={stats.attached} Icon={Link} tone="cyan" />
          <StatCard label="Unattached" value={stats.unattached} Icon={XCircle} tone="blue" />
          <StatCard label="Countries" value={stats.countries} Icon={Globe} tone="cyan" />
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
                  placeholder="Search number, name, region, or owner"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!!impersonationInfo}
                />
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-500 shrink-0">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-medium">Filters</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={attachedFilter}
                onChange={(e) => setAttachedFilter(e.target.value)}
                disabled={!!impersonationInfo}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All statuses</option>
                <option value="attached">Attached</option>
                <option value="unattached">Unattached</option>
              </select>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                disabled={!!impersonationInfo}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {availableCountries.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All countries" : c}
                  </option>
                ))}
              </select>

              {(q || attachedFilter !== "all" || countryFilter !== "all") && (
                <Button
                  onClick={() => {
                    setQ("");
                    setAttachedFilter("all");
                    setCountryFilter("all");
                  }}
                  className="text-slate-700"
                  disabled={!!impersonationInfo}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Numbers: Table on desktop, Card Grid on sub-xl */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-8 w-8 place-content-center rounded-xl bg-blue-600 text-white shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">All Phone Numbers ({filtered.length})</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>

          {impersonationInfo ? (
            <div className="grid place-content-center py-16 px-4 text-center">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-amber-100 mb-4 mx-auto">
                <Link className="h-9 w-9 text-amber-500" />
              </div>
              <div className="text-base sm:text-lg font-semibold text-slate-700">Exit impersonation to access admin data</div>
              <div className="mt-3">
                <Button onClick={exitImpersonation} variant="primary">
                  <X className="h-4 w-4 mr-2" /> Exit Impersonation
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="grid place-content-center py-16">
              <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
              <div className="text-sm text-slate-600">Loading phone numbers…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid place-content-center py-16 px-4">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-slate-100 mb-4">
                <Phone className="h-9 w-9 text-slate-400" />
              </div>
              <div className="text-lg font-semibold text-slate-700">No results</div>
              <div className="text-sm text-slate-500">Try clearing filters or search</div>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE (≥xl) */}
              <div className="hidden xl:block">
                <div className="w-full">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <Th>Number</Th>
                        <Th>Owner</Th>
                        <Th>Region</Th>
                        <Th>Country</Th>
                        <Th>Status</Th>
                        <Th>Last Month</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentItems.map((n) => {
                        const attached = !!n.attached_assistant;
                        return (
                          <tr key={n.id} className="hover:bg-slate-50/60 transition-colors">
                            <Td>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-900 break-all">{n.phone_number}</div>
                                <div className="text-[11px] text-slate-500 break-all">{n.friendly_name}</div>
                              </div>
                            </Td>
                            <Td>
                              {n.owner ? (
                                <div className="flex items-center gap-2 min-w-0 text-slate-700">
                                  <Avatar name={n.owner.name} size={34} />
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold truncate">{n.owner.name}</div>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-500 min-w-0">
                                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                      <span className="truncate break-all">{n.owner.email}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-500">—</div>
                              )}
                            </Td>
                            <Td>
                              <div className="flex items-center gap-1 text-slate-700">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                <span className="text-xs font-medium break-all">{n.region}</span>
                              </div>
                            </Td>
                            <Td>
                              <div className="flex items-center gap-1 text-slate-700">
                                <Globe className="h-4 w-4 text-slate-500" />
                                <span className="text-xs font-medium">{n.iso_country || "—"}</span>
                              </div>
                            </Td>
                            <Td>
                              {attached ? (
                                <Pill className="border bg-blue-100 text-blue-700 border-blue-200">
                                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                  Attached
                                </Pill>
                              ) : (
                                <Pill className="border bg-amber-100 text-amber-700 border-amber-200">
                                  <XCircle className="mr-1 h-3.5 w-3.5" />
                                  Unattached
                                </Pill>
                              )}
                            </Td>
                            <Td>
                              <div className="text-xs font-semibold text-slate-800">{fmtMoney(n.last_month_payment)}</div>
                            </Td>
                            <Td>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  onClick={() => askDelete(n.id)}
                                  variant="danger"
                                  size="sm"
                                  disabled={attached}
                                  title={attached ? "Detach from assistant before deleting" : "Delete number"}
                                >
                                  {deletingId === n.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARD GRID (<xl): 1col → 2col (sm) → 3col (lg) */}
              <div className="xl:hidden p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {currentItems.map((n, idx) => {
                    const attached = !!n.attached_assistant;
                    return (
                      <div key={n.id} className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 overflow-hidden">
                        {idx === 0 && <NeonRail />}
                        <div className="min-w-0">
                          <div className="text-base font-bold text-slate-900 break-words">{n.phone_number}</div>
                          <div className="text-[11px] text-slate-500 break-all">{n.friendly_name}</div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <User2 className="h-4 w-4 text-slate-500" />
                              <div className="min-w-0">
                                <div className="truncate font-semibold">{n.owner?.name || "—"}</div>
                                {n.owner?.email && (
                                  <div className="text-xs text-slate-500 truncate">{n.owner.email}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-500" />
                              <span className="text-xs font-medium">{n.iso_country || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <MapPin className="h-4 w-4 text-slate-500" />
                              <span className="text-xs font-medium break-words">{n.region}</span>
                            </div>
                            <div className="col-span-2">
                              {attached ? (
                                <Pill className="border bg-blue-100 text-blue-700 border-blue-200">
                                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Attached
                                </Pill>
                              ) : (
                                <Pill className="border bg-amber-100 text-amber-700 border-amber-200">
                                  <XCircle className="mr-1 h-3.5 w-3.5" /> Unattached
                                </Pill>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              onClick={() => askDelete(n.id)}
                              variant="danger"
                              size="sm"
                              className="grow sm:grow-0"
                              disabled={attached}
                            >
                              {deletingId === n.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin mr-1" /> Deleting…
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="mt-3 text-[11px] text-slate-500 break-all">{fmtMoney(n.last_month_payment)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {filtered.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50">
                  <div className="text-sm text-slate-600">
                    Showing <b>{indexOfFirstItem + 1}</b>–<b>{Math.min(indexOfLastItem, filtered.length)}</b> of <b>{filtered.length}</b>
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
                            className={`px-3 py-2 text-sm font-semibold rounded-xl ${active ? "bg-blue-600 text-white" : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50"}`}
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

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDeleteId && (
          <Modal onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
            <div className="text-slate-800">
              Are you sure you want to delete phone number
              {" "}
              <b className="break-words">{numbers.find((n) => n.id === confirmDeleteId)?.phone_number || "this number"}</b>?
              {" "}
              This action cannot be undone.
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button onClick={() => setConfirmDeleteId(null)} variant="subtle">
                Cancel
              </Button>
              <Button onClick={doDelete} disabled={deletingId === confirmDeleteId} variant="danger">
                {deletingId === confirmDeleteId ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
