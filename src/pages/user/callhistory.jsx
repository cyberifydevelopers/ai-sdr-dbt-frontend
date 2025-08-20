// "use client";

// import { useState, useEffect } from "react";
// import { Phone, MapPin, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function CallHistory() {
//   const [purchasedNumbers, setPurchasedNumbers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [deleteModal, setDeleteModal] = useState({ open: false, number: null });
//   const [deleting, setDeleting] = useState(false);
//   const itemsPerPage = 10;
//   const navigate = useNavigate();

//   // Fetch purchased numbers history
//   const fetchPurchasedNumbers = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found in localStorage");
//         setPurchasedNumbers([]);
//         return;
//       }
//       const response = await fetch("http://localhost:8000/api/purchased_numbers", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         let data;
//         try {
//           data = await response.json();
//         } catch (e) {
//           data = { message: "Unknown error" };
//         }
//         console.error("Failed to fetch purchased numbers:", data.message);
//         setPurchasedNumbers([]);
//         return;
//       }
//       const data = await response.json();
//       if (Array.isArray(data.numbers)) {
//         setPurchasedNumbers(data.numbers);
//       } else {
//         setPurchasedNumbers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching purchased numbers:", error);
//       setPurchasedNumbers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete number
//   const handleDelete = async () => {
//     if (!deleteModal.number) return;
//     setDeleting(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found in localStorage");
//       }
//       const id =
//         deleteModal.number.id ||
//         deleteModal.number.sid ||
//         deleteModal.number.phone_number;
//       const response = await fetch(
//         `http://localhost:8000/api/callhistory/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!response.ok) {
//         let data;
//         try {
//           data = await response.json();
//         } catch (e) {
//           data = { message: "Unknown error" };
//         }
//         throw new Error(data.message || "Failed to delete number");
//       }
//       setPurchasedNumbers((prev) =>
//         prev.filter(
//           (n) =>
//             (n.id || n.sid || n.phone_number) !==
//             (deleteModal.number.id ||
//               deleteModal.number.sid ||
//               deleteModal.number.phone_number)
//         )
//       );
//       setDeleteModal({ open: false, number: null });
//     } catch (err) {
//       alert("Failed to delete number: " + err.message);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // Load purchased numbers on component mount
//   useEffect(() => {
//     fetchPurchasedNumbers();
//     // eslint-disable-next-line
//   }, []);

//   // Format phone number for display
//   const formatPhoneNumber = (number) => {
//     if (!number) return "N/A";
//     const cleaned = String(number).replace(/\D/g, "");
//     const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
//     if (match) {
//       return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
//     }
//     return number;
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "N/A";
//     return date.toLocaleString(undefined, {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Get region name from code
//   const getRegionName = (regionCode) => {
//     if (!regionCode) return "Unknown";
//     const regionMap = {
//       KY: "Kentucky",
//       CA: "California",
//       NY: "New York",
//       TX: "Texas",
//       FL: "Florida",
//       IL: "Illinois",
//       PA: "Pennsylvania",
//       OH: "Ohio",
//       GA: "Georgia",
//       NC: "North Carolina",
//       MI: "Michigan",
//       NJ: "New Jersey",
//       VA: "Virginia",
//       WA: "Washington",
//       AZ: "Arizona",
//       MA: "Massachusetts",
//       TN: "Tennessee",
//       IN: "Indiana",
//       MO: "Missouri",
//       MD: "Maryland",
//       WI: "Wisconsin",
//       CO: "Colorado",
//       MN: "Minnesota",
//       SC: "South Carolina",
//       AL: "Alabama",
//       LA: "Louisiana",
//       OR: "Oregon",
//       OK: "Oklahoma",
//       CT: "Connecticut",
//       IA: "Iowa",
//       MS: "Mississippi",
//       AR: "Arkansas",
//       UT: "Utah",
//       KS: "Kansas",
//       NV: "Nevada",
//       NM: "New Mexico",
//       NE: "Nebraska",
//       WV: "West Virginia",
//       ID: "Idaho",
//       HI: "Hawaii",
//       NH: "New Hampshire",
//       ME: "Maine",
//       MT: "Montana",
//       RI: "Rhode Island",
//       DE: "Delaware",
//       SD: "South Dakota",
//       ND: "North Dakota",
//       AK: "Alaska",
//       VT: "Vermont",
//       WY: "Wyoming",
//     };
//     return regionMap[regionCode] || regionCode;
//   };

//   // Calculate pagination
//   const totalPages = Math.ceil(purchasedNumbers.length / itemsPerPage);
//   const indexOfLastItem = Math.min(
//     currentPage * itemsPerPage,
//     purchasedNumbers.length
//   );
//   const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);
//   const currentItems = purchasedNumbers.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   // Handle pagination
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const handlePageClick = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   // Defensive: reset to page 1 if purchasedNumbers changes and currentPage is out of range
//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(1);
//     }
//     // eslint-disable-next-line
//   }, [purchasedNumbers]);

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
//       {/* Delete Modal */}
//       {deleteModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-opacity-40 backdrop-blur-sm transition-opacity"
//             onClick={() =>
//               !deleting && setDeleteModal({ open: false, number: null })
//             }
//           ></div>
//           {/* Modal */}
//           <div className="relative z-10 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
//             <div className="flex items-center space-x-3 mb-4">
//               <Trash2 className="w-6 h-6 text-red-500" />
//               <h3 className="text-lg font-bold text-gray-900">Delete Number</h3>
//             </div>
//             <div className="mb-4 text-gray-700">
//               Are you sure you want to delete this number?
//               <div className="mt-2 text-gray-900 font-semibold">
//                 {formatPhoneNumber(deleteModal.number?.phone_number)}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 Created: {formatDate(deleteModal.number?.created_at)}
//               </div>
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
//                 onClick={() =>
//                   !deleting && setDeleteModal({ open: false, number: null })
//                 }
//                 disabled={deleting}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
//                 onClick={handleDelete}
//                 disabled={deleting}
//               >
//                 {deleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
//         {/* Header */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//               </div>
//               <div className="flex-1">
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
//                   Purchased Numbers
//                 </h1>
//                 <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">
//                   View your purchased phone numbers
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate("/user/phonecalls")}
//               className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
//               aria-label="Buy Numbers"
//             >
//               <div className="flex items-center">
//                 <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
//                 <span className="hidden sm:inline">Buy Numbers</span>
//                 <span className="sm:hidden">Buy</span>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Total Count */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-center">
//           <div className="text-3xl sm:text-4xl font-bold text-blue-600">
//             {purchasedNumbers.length}
//           </div>
//           <div className="text-sm sm:text-base text-gray-600 font-medium mt-2">
//             Total Purchased Numbers
//           </div>
//         </div>

//         {/* Purchased Numbers Table */}
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           {/* Header */}
//           <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
//               <div className="flex items-center space-x-3">
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
//                 </div>
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">
//                   Purchased Numbers ({purchasedNumbers.length})
//                 </h2>
//               </div>
//               <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
//                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
//                 <span className="font-semibold">Live Data</span>
//               </div>
//             </div>
//           </div>

//           {/* Table Content */}
//           {loading ? (
//             <div className="flex items-center justify-center py-12 sm:py-20">
//               <div className="text-center">
//                 <Phone className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse text-blue-500 mx-auto mb-4" />
//                 <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
//                   Loading purchased numbers...
//                 </p>
//                 <p className="text-sm sm:text-base text-gray-500">
//                   Please wait while we fetch your data
//                 </p>
//               </div>
//             </div>
//           ) : purchasedNumbers.length === 0 ? (
//             <div className="flex items-center justify-center py-12 sm:py-20">
//               <div className="text-center">
//                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
//                 </div>
//                 <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
//                   No purchased numbers found
//                 </p>
//                 <p className="text-sm sm:text-base text-gray-500 mb-4">
//                   Your purchased numbers will appear here
//                 </p>
//                 <button
//                   onClick={() => navigate("/user/phonecalls")}
//                   className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm sm:text-base"
//                   aria-label="Buy Numbers"
//                 >
//                   Buy Numbers
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
//                         Created
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentItems.map((number, index) => (
//                       <tr
//                         key={
//                           number.id ||
//                           number.sid ||
//                           number.phone_number ||
//                           index
//                         }
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
//                             <div>
//                               <span className="text-sm font-medium text-gray-900">
//                                 {getRegionName(number.region)}
//                               </span>
//                               <div className="text-xs text-gray-500">
//                                 ({number.region || "N/A"})
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
//                             {formatDate(number.created_at)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-colors"
//                             onClick={() =>
//                               setDeleteModal({ open: true, number })
//                             }
//                           >
//                             <Trash2 className="w-4 h-4 mr-1" />
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards */}
//               <div className="lg:hidden divide-y divide-gray-200">
//                 {currentItems.map((number, index) => (
//                   <div
//                     key={
//                       number.id || number.sid || number.phone_number || index
//                     }
//                     className="p-4 sm:p-6"
//                   >
//                     <div className="flex items-start space-x-3">
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Phone className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="text-lg font-bold text-gray-900 mb-2">
//                           {formatPhoneNumber(number.phone_number)}
//                         </div>
//                         <div className="flex items-center mb-2">
//                           <MapPin className="w-4 h-4 text-gray-500 mr-1" />
//                           <span className="text-sm text-gray-600">
//                             {getRegionName(number.region)} (
//                             {number.region || "N/A"})
//                           </span>
//                         </div>
//                         <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
//                           {formatDate(number.created_at)}
//                         </div>
//                         <div>
//                           <button
//                             className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-colors"
//                             onClick={() =>
//                               setDeleteModal({ open: true, number })
//                             }
//                           >
//                             <Trash2 className="w-4 h-4 mr-1" />
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Pagination Controls */}
//         {purchasedNumbers.length > itemsPerPage && (
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
//               {/* Results Info */}
//               <div className="text-sm text-gray-700 mb-4 sm:mb-0">
//                 Showing{" "}
//                 {purchasedNumbers.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
//                 {indexOfLastItem} of {purchasedNumbers.length} results
//               </div>

//               {/* Pagination Buttons */}
//               <div className="flex items-center space-x-2">
//                 {/* Previous Button */}
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Previous page"
//                 >
//                   Previous
//                 </button>

//                 {/* Page Numbers */}
//                 <div className="flex items-center space-x-1">
//                   {(() => {
//                     let pages = [];
//                     let startPage = 1;
//                     let endPage = totalPages;
//                     if (totalPages > 5) {
//                       if (currentPage <= 3) {
//                         startPage = 1;
//                         endPage = 5;
//                       } else if (currentPage >= totalPages - 2) {
//                         startPage = totalPages - 4;
//                         endPage = totalPages;
//                       } else {
//                         startPage = currentPage - 2;
//                         endPage = currentPage + 2;
//                       }
//                     }
//                     for (let i = startPage; i <= endPage; i++) {
//                       pages.push(
//                         <button
//                           key={i}
//                           onClick={() => handlePageClick(i)}
//                           className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                             currentPage === i
//                               ? "bg-blue-600 text-white"
//                               : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
//                           }`}
//                           aria-current={currentPage === i ? "page" : undefined}
//                         >
//                           {i}
//                         </button>
//                       );
//                     }
//                     return pages;
//                   })()}
//                 </div>

//                 {/* Next Button */}
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage >= totalPages}
//                   className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Next page"
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

import { useState, useEffect } from "react";
import { Phone, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

export default function CallHistory() {
  const [purchasedNumbers, setPurchasedNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, number: null });
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // ----- helpers -----
  const normalizePurchased = (data) => {
    // Backend may return [] OR { message, purchased_numbers: [] }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.purchased_numbers)) return data.purchased_numbers;
    return [];
    // Expected item shape:
    // { phone_number, friendly_name, date_purchased, user: {username,email}, attached_assistant }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "N/A";
    const cleaned = String(number).replace(/\D/g, "");
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
    return number; // Keep E.164 or whatever Twilio returns
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ----- data -----
  const fetchPurchasedNumbers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setPurchasedNumbers([]);
        return;
      }
      const res = await fetch(`${API_URL}/api/purchased_numbers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = [];
      }
      if (!res.ok) {
        console.error("Failed to fetch purchased numbers:", data?.message || data?.detail || "Unknown error");
        setPurchasedNumbers([]);
        return;
      }
      setPurchasedNumbers(normalizePurchased(data));
    } catch (err) {
      console.error("Error fetching purchased numbers:", err);
      setPurchasedNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete number (return number)
  const handleDelete = async () => {
    if (!deleteModal.number?.phone_number) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");

      const res = await fetch(`${API_URL}/api/remove-phone-number`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: deleteModal.number.phone_number }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || data?.success === false) {
        throw new Error(data?.detail || data?.error || "Failed to remove phone number");
      }

      setPurchasedNumbers((prev) =>
        prev.filter((n) => n.phone_number !== deleteModal.number.phone_number)
      );
      setDeleteModal({ open: false, number: null });
    } catch (err) {
      alert("Failed to delete number: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchPurchasedNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pagination
  const totalPages = Math.ceil(purchasedNumbers.length / itemsPerPage) || 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, purchasedNumbers.length);
  const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);
  const currentItems = purchasedNumbers.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handlePageClick = (n) => n >= 1 && n <= totalPages && setCurrentPage(n);

  // keep page valid on data changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasedNumbers]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => !deleting && setDeleteModal({ open: false, number: null })}
          />
          <div className="relative z-10 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold text-gray-900">Delete Number</h3>
            </div>
            <div className="mb-4 text-gray-700">
              Are you sure you want to delete this number?
              <div className="mt-2 text-gray-900 font-semibold">
                {formatPhoneNumber(deleteModal.number?.phone_number)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Purchased: {formatDate(deleteModal.number?.date_purchased)}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                onClick={() => !deleting && setDeleteModal({ open: false, number: null })}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Purchased Numbers
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">
                  View your purchased phone numbers
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/user/phonecalls")}
              className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
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

        {/* Total Count */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-blue-600">{purchasedNumbers.length}</div>
          <div className="text-sm sm:text-base text-gray-600 font-medium mt-2">Total Purchased Numbers</div>
        </div>

        {/* Table/Card list */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Purchased Numbers ({purchasedNumbers.length})
                </h2>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full" />
                <span className="font-semibold">Live Data</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <Phone className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse text-blue-500 mx-auto mb-4" />
                <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Loading purchased numbers...
                </p>
                <p className="text-sm sm:text-base text-gray-500">Please wait while we fetch your data</p>
              </div>
            </div>
          ) : purchasedNumbers.length === 0 ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No purchased numbers found</p>
                <p className="text-sm sm:text-base text-gray-500 mb-4">Your purchased numbers will appear here</p>
                <button
                  onClick={() => navigate("/user/phonecalls")}
                  className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm sm:text-base"
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
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Friendly Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Date Purchased
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Attached Assistant
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((n, idx) => (
                      <tr key={n.phone_number || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                              <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatPhoneNumber(n.phone_number)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <div className="text-sm font-medium text-gray-900">
                              {n.friendly_name || "—"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {formatDate(n.date_purchased)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">
                            {n.attached_assistant ?? "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                            onClick={() => setDeleteModal({ open: true, number: n })}
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
              <div className="lg:hidden divide-y divide-gray-200">
                {currentItems.map((n, idx) => (
                  <div key={n.phone_number || idx} className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {formatPhoneNumber(n.phone_number)}
                        </div>
                        <div className="flex items-center mb-2">
                          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            {n.friendly_name || "—"}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                          {formatDate(n.date_purchased)}
                        </div>
                        <div className="text-sm text-gray-700 mb-3">
                          Assistant: {n.attached_assistant ?? "—"}
                        </div>
                        <div>
                          <button
                            className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                            onClick={() => setDeleteModal({ open: true, number: n })}
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

        {/* Pagination */}
        {purchasedNumbers.length > itemsPerPage && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing {purchasedNumbers.length === 0 ? 0 : indexOfFirstItem + 1} to {indexOfLastItem} of {purchasedNumbers.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = [];
                    let start = 1, end = totalPages;
                    if (totalPages > 5) {
                      if (currentPage <= 3) { start = 1; end = 5; }
                      else if (currentPage >= totalPages - 2) { start = totalPages - 4; end = totalPages; }
                      else { start = currentPage - 2; end = currentPage + 2; }
                    }
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageClick(i)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === i
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                          aria-current={currentPage === i ? "page" : undefined}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
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
