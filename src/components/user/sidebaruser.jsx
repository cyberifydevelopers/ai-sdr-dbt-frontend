// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import {
// // //   Home,
// // //   Calendar,
// // //   Users,
// // //   Phone,
// // //   Settings,
// // //   ChevronLeft,
// // //   ChevronRight,
// // //   Menu,
// // //   X,
// // // } from "lucide-react";
// // // import { useLocation, useNavigate } from "react-router-dom";
// // // import { FaRobot } from "react-icons/fa";

// // // export default function Sidebar() {
// // //   const [isCollapsed, setIsCollapsed] = useState(false);
// // //   const [isMobileOpen, setIsMobileOpen] = useState(false);
// // //   const [isMobile, setIsMobile] = useState(false);
// // //   const [isTablet, setIsTablet] = useState(false);
// // //   const location = useLocation();
// // //   const navigate = useNavigate();

// // //   // Check screen size on mount and resize
// // //   useEffect(() => {
// // //     const checkScreenSize = () => {
// // //       const width = window.innerWidth;
// // //       setIsMobile(width < 768);
// // //       setIsTablet(width >= 768 && width < 1024);

// // //       if (width < 768) {
// // //         setIsCollapsed(true);
// // //       } else if (width >= 768 && width < 1024) {
// // //         setIsCollapsed(true);
// // //       }
// // //     };

// // //     checkScreenSize();
// // //     window.addEventListener("resize", checkScreenSize);
// // //     return () => window.removeEventListener("resize", checkScreenSize);
// // //   }, []);

// // //   const toggleSidebar = () => {
// // //     if (isMobile) {
// // //       setIsMobileOpen(!isMobileOpen);
// // //     } else {
// // //       setIsCollapsed(!isCollapsed);
// // //     }
// // //   };

// // //   const menuItems = [
// // //     {
// // //       id: "dashboard",
// // //       label: "Dashboard",
// // //       icon: Home,
// // //       href: "/user/dashboard",
// // //       color: "text-blue-600",
// // //     },
// // //     {
// // //       id: "phoneCalls",
// // //       label: "Phone Numbers",
// // //       icon: Phone,
// // //       href: "/user/callhistory", // Changed to point directly to callhistory
// // //       color: "text-orange-600",
// // //     },
// // //     {
// // //       id: "callassistence",
// // //       label: "Assistants",
// // //       icon: FaRobot,
// // //       href: "/user/callassistent",
// // //       color: "text-green-600",
// // //     },
// // //     {
// // //       id: "Leads",
// // //       label: "Leads",
// // //       icon: Users,
// // //       href: "/user/leads",
// // //       color: "text-purple-600",
// // //     },
// // //     {
// // //       id: "calendar",
// // //       label: "Calendar",
// // //       icon: Calendar,
// // //       href: "/user/calendar",
// // //       color: "text-green-600",
// // //     },

// // //     {
// // //       id: "settings",
// // //       label: "Settings",
// // //       icon: Settings,
// // //       href: "/user/settings",
// // //       color: "text-gray-600",
// // //     },
// // //   ];

// // //   const SidebarContent = () => (
// // //     <>
// // //       {/* Brand/Logo */}
// // //       <div
// // //         className={`flex items-center border-b border-gray-200 bg-white transition-all duration-300 ${
// // //           isCollapsed && !isMobile ? "justify-center p-3 sm:p-4" : "p-4 sm:p-6"
// // //         }`}
// // //       >
// // //         <div className="relative flex-shrink-0">
// // //           <div
// // //             className={`bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
// // //               isMobile ? "w-8 h-8" : "w-10 h-10"
// // //             }`}
// // //           >
// // //             <Calendar
// // //               className={`text-white ${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
// // //             />
// // //           </div>
// // //           <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
// // //         </div>
// // //         {(!isCollapsed || isMobile) && (
// // //           <div className="ml-3 sm:ml-4 min-w-0 flex-1">
// // //             <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
// // //               AI Assistant
// // //             </h2>
// // //             <p className="text-xs text-gray-500 font-medium truncate">
// // //               Smart & Simple
// // //             </p>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Navigation Menu */}
// // //       <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
// // //         {menuItems.map((item) => {
// // //           const Icon = item.icon;
// // //           const isActive = location.pathname === item.href;

// // //           return (
// // //             <a
// // //               key={item.id}
// // //               href={item.href}
// // //               className={`group relative flex items-center rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation ${
// // //                 isActive
// // //                   ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
// // //                   : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
// // //               } ${
// // //                 isCollapsed && !isMobile
// // //                   ? "justify-center p-2 sm:p-3"
// // //                   : "p-3 sm:p-3"
// // //               } ${isMobile ? "min-h-[48px]" : "min-h-[44px]"}`}
// // //               title={isCollapsed && !isMobile ? item.label : ""}
// // //             >
// // //               <Icon
// // //                 className={`flex-shrink-0 transition-all duration-200 ${
// // //                   isMobile ? "w-5 h-5" : "w-5 h-5"
// // //                 } ${
// // //                   isActive
// // //                     ? item.color
// // //                     : "text-gray-500 group-hover:text-gray-700"
// // //                 } ${isActive ? "scale-110" : "group-hover:scale-105"}`}
// // //               />
// // //               {(!isCollapsed || isMobile) && (
// // //                 <span className="ml-3 font-semibold transition-all duration-200 truncate text-sm sm:text-base">
// // //                   {item.label}
// // //                 </span>
// // //               )}
// // //               {isActive && (!isCollapsed || isMobile) && (
// // //                 <div className="ml-auto flex-shrink-0">
// // //                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
// // //                 </div>
// // //               )}
// // //             </a>
// // //           );
// // //         })}
// // //       </nav>

// // //       {/* Toggle Button - Desktop/Tablet Only */}
// // //       {!isMobile && (
// // //         <div className="p-2 sm:p-4 border-t border-gray-200 bg-gray-50">
// // //           <button
// // //             onClick={toggleSidebar}
// // //             className={`group flex items-center w-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 touch-manipulation ${
// // //               isCollapsed ? "justify-center p-2 sm:p-3" : "p-3"
// // //             } min-h-[44px]`}
// // //             title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
// // //           >
// // //             {isCollapsed ? (
// // //               <ChevronRight className="w-5 h-5 transition-transform group-hover:scale-110" />
// // //             ) : (
// // //               <>
// // //                 <ChevronLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
// // //                 <span className="ml-3 font-semibold text-sm sm:text-base">
// // //                   Collapse
// // //                 </span>
// // //               </>
// // //             )}
// // //           </button>
// // //         </div>
// // //       )}
// // //     </>
// // //   );

// // //   return (
// // //     <>
// // //       {/* Mobile Toggle Button */}
// // //       {isMobile && (
// // //         <button
// // //           onClick={toggleSidebar}
// // //           className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 md:hidden hover:shadow-xl transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
// // //           aria-label={isMobileOpen ? "Close menu" : "Open menu"}
// // //         >
// // //           {isMobileOpen ? (
// // //             <X className="w-5 h-5" />
// // //           ) : (
// // //             <Menu className="w-5 h-5" />
// // //           )}
// // //         </button>
// // //       )}

// // //       {/* Desktop/Tablet Sidebar */}
// // //       {!isMobile && (
// // //         <aside
// // //           className={`sticky top-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex-shrink-0 ${
// // //             isCollapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
// // //           }`}
// // //           style={{ zIndex: 30 }}
// // //         >
// // //           <div className="flex flex-col h-full">
// // //             <SidebarContent />
// // //           </div>
// // //         </aside>
// // //       )}

// // //       {/* Mobile Sidebar Overlay */}
// // //       {isMobile && isMobileOpen && (
// // //         <div className="fixed inset-0 z-40 md:hidden">
// // //           {/* Backdrop */}
// // //           <div
// // //             className="fixed inset-0 bg-black/20 backdrop-blur-sm"
// // //             onClick={() => setIsMobileOpen(false)}
// // //             aria-hidden="true"
// // //           />
// // //           {/* Sidebar */}
// // //           <aside
// // //             className="fixed left-0 top-0 h-full w-64 sm:w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
// // //             role="dialog"
// // //             aria-modal="true"
// // //             aria-label="Navigation menu"
// // //           >
// // //             <div className="flex flex-col h-full">
// // //               <SidebarContent />
// // //             </div>
// // //           </aside>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // }




// // "use client";

// // import { useState, useEffect } from "react";
// // import {
// //   Home,
// //   Calendar,
// //   Users,
// //   Phone,
// //   Settings,
// //   ChevronLeft,
// //   ChevronRight,
// //   Menu,
// //   X,
// // } from "lucide-react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { FaRobot } from "react-icons/fa";
// // import { motion } from "framer-motion";

// // /* ---------------- Neon Funnel Logo (same as header) ---------------- */
// // function NeonFunnelLogo() {
// //   return (
// //     <div className="relative h-11 w-11 sm:h-12 sm:w-12">
// //       {/* Outer soft glow */}
// //       <motion.div
// //         className="absolute inset-0 rounded-2xl blur-md"
// //         style={{
// //           background:
// //             "conic-gradient(from 0deg, rgba(59,130,246,0.25), rgba(34,211,238,0.25), rgba(59,130,246,0.25))",
// //         }}
// //         animate={{ rotate: 360 }}
// //         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
// //         aria-hidden
// //       />
// //       {/* Inner ring */}
// //       <div className="absolute inset-0 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-[2px] shadow-[0_0_30px_rgba(59,130,246,0.15)]" />
// //       {/* SVG Funnel path */}
// //       <motion.svg
// //         viewBox="0 0 48 48"
// //         className="relative z-10 h-full w-full p-2"
// //         initial={{ opacity: 0.9 }}
// //         animate={{ opacity: 1 }}
// //         transition={{ duration: 0.6 }}
// //         role="img"
// //         aria-label="Lead generation funnel"
// //       >
// //         <defs>
// //           <linearGradient id="neonStroke" x1="0" y1="0" x2="1" y2="1">
// //             <stop offset="0%" stopColor="#3B82F6" />
// //             <stop offset="100%" stopColor="#06B6D4" />
// //           </linearGradient>
// //           <filter id="glow">
// //             <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
// //             <feMerge>
// //               <feMergeNode in="coloredBlur" />
// //               <feMergeNode in="SourceGraphic" />
// //             </feMerge>
// //           </filter>
// //         </defs>

// //         <motion.path
// //           d="M6 8h36l-14 15v7l-8 10v-17L6 8z"
// //           fill="none"
// //           stroke="url(#neonStroke)"
// //           strokeWidth="2.8"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           filter="url(#glow)"
// //           initial={{ pathLength: 0, pathOffset: 1 }}
// //           animate={{ pathLength: 1, pathOffset: 0 }}
// //           transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
// //         />
// //         <motion.circle
// //           cx="23"
// //           cy="20"
// //           r="1.6"
// //           fill="#22D3EE"
// //           initial={{ y: -8, opacity: 0.6 }}
// //           animate={{ y: 12, opacity: [0.6, 1, 0.6] }}
// //           transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
// //         />
// //         <motion.circle
// //           cx="28"
// //           cy="22"
// //           r="1.3"
// //           fill="#60A5FA"
// //           initial={{ y: -10, opacity: 0.6 }}
// //           animate={{ y: 14, opacity: [0.6, 1, 0.6] }}
// //           transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
// //         />
// //       </motion.svg>
// //       {/* Pulsing rim */}
// //       <motion.div
// //         className="absolute inset-0 rounded-2xl"
// //         style={{ boxShadow: "0 0 22px 4px rgba(34,211,238,0.25)" }}
// //         animate={{ opacity: [0.45, 0.9, 0.45] }}
// //         transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
// //         aria-hidden
// //       />
// //     </div>
// //   );
// // }

// // /* ---------------- Sidebar ---------------- */
// // export default function Sidebar() {
// //   const [isCollapsed, setIsCollapsed] = useState(false);
// //   const [isMobileOpen, setIsMobileOpen] = useState(false);
// //   const [isMobile, setIsMobile] = useState(false);
// //   const [isTablet, setIsTablet] = useState(false);
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   // Check screen size on mount and resize
// //   useEffect(() => {
// //     const checkScreenSize = () => {
// //       const width = window.innerWidth;
// //       setIsMobile(width < 768);
// //       setIsTablet(width >= 768 && width < 1024);

// //       if (width < 768) {
// //         setIsCollapsed(true);
// //       } else if (width >= 768 && width < 1024) {
// //         setIsCollapsed(true);
// //       } else {
// //         setIsCollapsed(false);
// //       }
// //     };

// //     checkScreenSize();
// //     window.addEventListener("resize", checkScreenSize);
// //     return () => window.removeEventListener("resize", checkScreenSize);
// //   }, []);

// //   const toggleSidebar = () => {
// //     if (isMobile) {
// //       setIsMobileOpen((v) => !v);
// //     } else {
// //       setIsCollapsed((v) => !v);
// //     }
// //   };

// //   const menuItems = [
// //     { id: "dashboard", label: "Dashboard", icon: Home, href: "/user/dashboard", color: "text-blue-600" },
// //     { id: "phoneCalls", label: "Phone Numbers", icon: Phone, href: "/user/callhistory", color: "text-orange-600" },
// //     { id: "callassistence", label: "Assistants", icon: FaRobot, href: "/user/callassistent", color: "text-green-600" },
// //     { id: "Leads", label: "Leads", icon: Users, href: "/user/leads", color: "text-purple-600" },
// //     { id: "calendar", label: "Calendar", icon: Calendar, href: "/user/calendar", color: "text-green-600" },
// //     { id: "settings", label: "Settings", icon: Settings, href: "/user/settings", color: "text-gray-600" },
// //   ];

// //   const SidebarContent = () => (
// //     <>
// //       {/* Brand / Logo — matches header */}
// //       <div
// //         className={`flex items-center border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300 ${
// //           isCollapsed && !isMobile ? "justify-center p-3 sm:p-4" : "p-4 sm:p-6"
// //         }`}
// //       >
// //         <NeonFunnelLogo />
// //         {(!isCollapsed || isMobile) && (
// //           <div className="ml-3 sm:ml-4 min-w-0 flex-1">
// //             <h2 className="text-base sm:text-lg font-extrabold tracking-tight truncate">
// //               <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600">
// //                 AI SDR - DBT
// //               </span>
// //             </h2>
// //             <p className="text-xs text-slate-500 font-medium truncate">
// //               Smart lead capture & scheduling
// //             </p>
// //           </div>
// //         )}
// //       </div>

// //       {/* Navigation Menu */}
// //       <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
// //         {menuItems.map((item) => {
// //           const Icon = item.icon;
// //           const isActive = location.pathname === item.href;

// //           return (
// //             <button
// //               key={item.id}
// //               type="button"
// //               onClick={() => {
// //                 navigate(item.href);
// //                 if (isMobile) setIsMobileOpen(false);
// //               }}
// //               className={`group relative w-full text-left flex items-center rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation ${
// //                 isActive
// //                   ? "bg-blue-50/70 text-blue-700 border border-blue-200 shadow-sm"
// //                   : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
// //               } ${
// //                 isCollapsed && !isMobile
// //                   ? "justify-center p-2 sm:p-3"
// //                   : "p-3 sm:p-3"
// //               } ${isMobile ? "min-h-[48px]" : "min-h-[44px]"}`}
// //               title={isCollapsed && !isMobile ? item.label : ""}
// //             >
// //               {/* Neon left rail on active */}
// //               {isActive && !isCollapsed && (
// //                 <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
// //               )}

// //               <Icon
// //                 className={`flex-shrink-0 transition-all duration-200 ${
// //                   isMobile ? "w-5 h-5" : "w-5 h-5"
// //                 } ${
// //                   isActive
// //                     ? item.color
// //                     : "text-slate-500 group-hover:text-slate-700"
// //                 } ${isActive ? "scale-110" : "group-hover:scale-105"}`}
// //               />
// //               {(!isCollapsed || isMobile) && (
// //                 <span className="ml-3 font-semibold transition-all duration-200 truncate text-sm sm:text-base">
// //                   {item.label}
// //                 </span>
// //               )}

// //               {/* Pulsing dot on active */}
// //               {isActive && (!isCollapsed || isMobile) && (
// //                 <div className="ml-auto flex-shrink-0">
// //                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
// //                 </div>
// //               )}
// //             </button>
// //           );
// //         })}
// //       </nav>

// //       {/* Toggle Button - Desktop/Tablet Only */}
// //       {!isMobile && (
// //         <div className="p-2 sm:p-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-md">
// //           <button
// //             onClick={toggleSidebar}
// //             className={`group flex items-center w-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 touch-manipulation ${
// //               isCollapsed ? "justify-center p-2 sm:p-3" : "p-3"
// //             } min-h-[44px]`}
// //             title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
// //           >
// //             {isCollapsed ? (
// //               <ChevronRight className="w-5 h-5 transition-transform group-hover:scale-110" />
// //             ) : (
// //               <>
// //                 <ChevronLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
// //                 <span className="ml-3 font-semibold text-sm sm:text-base">Collapse</span>
// //               </>
// //             )}
// //           </button>
// //         </div>
// //       )}
// //     </>
// //   );

// //   return (
// //     <>
// //       {/* Mobile Toggle Button */}
// //       {isMobile && (
// //         <button
// //           onClick={toggleSidebar}
// //           className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 p-2 sm:p-3 bg-white/90 rounded-lg sm:rounded-xl shadow-lg border border-slate-200 md:hidden hover:shadow-xl transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
// //           aria-label={isMobileOpen ? "Close menu" : "Open menu"}
// //         >
// //           {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// //         </button>
// //       )}

// //       {/* Desktop/Tablet Sidebar */}
// //       {!isMobile && (
// //         <aside
// //           className={`sticky top-0 h-screen bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex-shrink-0 ${
// //             isCollapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
// //           }`}
// //           style={{ zIndex: 30 }}
// //         >
// //           <div className="flex flex-col h-full">
// //             <SidebarContent />
// //           </div>
// //         </aside>
// //       )}

// //       {/* Mobile Sidebar Overlay */}
// //       {isMobile && isMobileOpen && (
// //         <div className="fixed inset-0 z-40 md:hidden">
// //           {/* Backdrop */}
// //           <div
// //             className="fixed inset-0 bg-black/20 backdrop-blur-sm"
// //             onClick={() => setIsMobileOpen(false)}
// //             aria-hidden="true"
// //           />
// //           {/* Sidebar */}
// //           <aside
// //             className="fixed left-0 top-0 h-full w-64 sm:w-72 bg-white border-r border-slate-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
// //             role="dialog"
// //             aria-modal="true"
// //             aria-label="Navigation menu"
// //           >
// //             <div className="flex flex-col h-full">
// //               <SidebarContent />
// //             </div>
// //           </aside>
// //         </div>
// //       )}
// //     </>
// //   );
// // }


// "use client";

// import { useState, useEffect, useMemo } from "react";
// import {
//   Home,
//   Calendar,
//   Users,
//   Phone,
//   Settings,
//   ChevronLeft,
//   ChevronRight,
//   Menu as MenuIcon,
//   X as XIcon,
//   ShoppingCart,
// } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaRobot } from "react-icons/fa";
// import { motion } from "framer-motion";

// /* ---------------- Typewriter Banner ---------------- */
// function TypewriterBanner({ compact = false }) {
//   const items = useMemo(
//     () => [
//       { text: "Make Calls", Icon: Phone, from: "#3B82F6", to: "#06B6D4" },
//       { text: "Buy Numbers", Icon: ShoppingCart, from: "#2563EB", to: "#22D3EE" },
//       { text: "Build Assistants", Icon: FaRobot, from: "#06B6D4", to: "#3B82F6" },
//       { text: "Generate Leads", Icon: Users, from: "#3B82F6", to: "#60A5FA" },
//       { text: "Schedule Meetings", Icon: Calendar, from: "#22D3EE", to: "#2563EB" },
//     ],
//     []
//   );

//   const [index, setIndex] = useState(0);
//   const [display, setDisplay] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     const current = items[index].text;
//     const typingSpeed = 40;
//     const deletingSpeed = 28;
//     const holdTime = 1100;

//     let t;
//     if (!deleting && display.length < current.length) {
//       t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), typingSpeed);
//     } else if (!deleting && display.length === current.length) {
//       t = setTimeout(() => setDeleting(true), holdTime);
//     } else if (deleting && display.length > 0) {
//       t = setTimeout(() => setDisplay(current.slice(0, display.length - 1)), deletingSpeed);
//     } else if (deleting && display.length === 0) {
//       setDeleting(false);
//       setIndex((i) => (i + 1) % items.length);
//     }
//     return () => clearTimeout(t);
//   }, [display, deleting, index, items]);

//   const { Icon, from, to } = items[index];

//   return (
//     <div className={`relative flex items-center ${compact ? "justify-center p-3 sm:p-4" : "p-4 sm:p-6"}`}>
//       {/* Neon icon (no solid bg plate; soft glow only) */}
//       <div className="relative mr-0 sm:mr-3">
//         <motion.div
//           className={`grid place-content-center rounded-2xl ${compact ? "h-9 w-9" : "h-10 w-10"}`}
//           style={{
//             background: `linear-gradient(135deg, ${from}, ${to})`,
//             boxShadow: `0 0 24px 6px ${to}44`,
//           }}
//           animate={{ scale: [1, 1.06, 1], rotate: [0, 1.5, 0] }}
//           transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
//         >
//           <Icon className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-white`} />
//         </motion.div>
//         <motion.div
//           className="absolute inset-0 rounded-2xl -z-10 blur-md"
//           style={{ background: `radial-gradient(60% 60% at 50% 50%, ${to}33, transparent)` }}
//           animate={{ opacity: [0.5, 0.9, 0.5] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           aria-hidden
//         />
//       </div>

//       {!compact && (
//         <div className="min-w-0 flex-1">
//           <div className="text-base sm:text-lg font-extrabold tracking-tight truncate">
//             <span
//               className="bg-clip-text text-transparent"
//               style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
//             >
//               {display}
//             </span>
//             <motion.span
//               className="inline-block w-[2px] h-[1.1em] align-[-0.15em] ml-1 bg-slate-800"
//               animate={{ opacity: [0, 1, 0] }}
//               transition={{ duration: 0.8, repeat: Infinity }}
//             />
//           </div>
//           <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
//             Neon-typed actions that guide your workflow
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------------- Neon Mobile Toggle ---------------- */
// function NeonToggleButton({ open, onClick, topOffset = 64 }) {
//   // topOffset ≈ header height in px; adjust if your header is taller/shorter
//   return (
//     <motion.button
//       onClick={onClick}
//       aria-label={open ? "Close menu" : "Open menu"}
//       className="fixed left-3 md:hidden z-40"
//       style={{
//         // Keep it visually below the header so it does not overlap
//         top: `calc(env(safe-area-inset-top, 0px) + ${topOffset}px)`,
//       }}
//       whileTap={{ scale: 0.96 }}
//     >
//       <div className="relative">
//         {/* rotating neon halo */}
//         <motion.span
//           className="absolute -inset-1 rounded-2xl blur"
//           style={{
//             background:
//               "conic-gradient(from 0deg, #22D3EE 0%, #3B82F6 25%, #06B6D4 50%, #60A5FA 75%, #22D3EE 100%)",
//             opacity: 0.85,
//           }}
//           animate={{ rotate: 360 }}
//           transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
//           aria-hidden
//         />
//         {/* button body */}
//         <div className="relative bg-white/95 backdrop-blur border border-slate-200 rounded-2xl px-3.5 py-3 shadow-lg">
//           <div className="flex items-center gap-2">
//             {/* animated hamburger → X */}
//             <div className="relative h-5 w-6">
//               <motion.span
//                 className="absolute left-0 right-0 h-[2px] rounded bg-slate-900"
//                 initial={false}
//                 animate={{ top: open ? "10px" : "4px", rotate: open ? 45 : 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
//               />
//               <motion.span
//                 className="absolute left-0 right-0 h-[2px] rounded bg-slate-900"
//                 initial={false}
//                 animate={{ top: "10px", opacity: open ? 0 : 1 }}
//                 transition={{ duration: 0.15 }}
//               />
//               <motion.span
//                 className="absolute left-0 right-0 h-[2px] rounded bg-slate-900"
//                 initial={false}
//                 animate={{ top: open ? "10px" : "16px", rotate: open ? -45 : 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
//               />
//             </div>
//             <motion.span
//               className="text-sm font-semibold text-slate-800"
//               initial={false}
//               animate={{ opacity: 1, x: 0 }}
//             >
//               {open ? "Close" : "Menu"}
//             </motion.span>
//           </div>
//         </div>
//       </div>
//     </motion.button>
//   );
// }

// /* ---------------- Sidebar ---------------- */
// export default function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTablet, setIsTablet] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Screen size logic (responsive)
//   useEffect(() => {
//     const checkScreenSize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width < 768);
//       setIsTablet(width >= 768 && width < 1024);
//       setIsCollapsed(width < 1024);
//     };
//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   // Close drawer when route changes (mobile)
//   useEffect(() => {
//     setIsMobileOpen(false);
//   }, [location.pathname]);

//   const toggleSidebar = () => {
//     if (isMobile) setIsMobileOpen((v) => !v);
//     else setIsCollapsed((v) => !v);
//   };

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: Home, href: "/user/dashboard", color: "text-blue-600" },
//     { id: "phoneCalls", label: "Phone Numbers", icon: Phone, href: "/user/callhistory", color: "text-orange-600" },
//     { id: "callassistence", label: "Assistants", icon: FaRobot, href: "/user/callassistent", color: "text-green-600" },
//     { id: "Leads", label: "Leads", icon: Users, href: "/user/leads", color: "text-purple-600" },
//     // { id: "calendar", label: "Calendar", icon: Calendar, href: "/user/calendar", color: "text-green-600" },
//     { id: "settings", label: "Settings", icon: Settings, href: "/user/settings", color: "text-gray-600" },
//   ];

//   const SidebarContent = () => (
//     <>
//       {/* Banner */}
//       <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
//         <TypewriterBanner compact={isCollapsed && !isMobile} />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.href;

//           return (
//             <button
//               key={item.id}
//               type="button"
//               onClick={() => navigate(item.href)}
//               className={`group relative w-full text-left flex items-center rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation ${
//                 isActive
//                   ? "bg-blue-50/70 text-blue-700 border border-blue-200 shadow-sm"
//                   : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
//               } ${isCollapsed && !isMobile ? "justify-center p-2 sm:p-3" : "p-3 sm:p-3"} ${
//                 isMobile ? "min-h-[52px]" : "min-h-[44px]"
//               }`}
//               title={isCollapsed && !isMobile ? item.label : ""}
//             >
//               {/* Neon left rail on active */}
//               {isActive && !isCollapsed && (
//                 <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
//               )}

//               <Icon
//                 className={`flex-shrink-0 transition-all duration-200 ${
//                   isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5"
//                 } ${isActive ? item.color : "text-slate-500 group-hover:text-slate-700"} ${
//                   isActive ? "scale-110" : "group-hover:scale-105"
//                 }`}
//               />

//               {(!isCollapsed || isMobile) && (
//                 <span className="ml-3 font-semibold transition-all duration-200 truncate text-sm sm:text-base">
//                   {item.label}
//                 </span>
//               )}

//               {isActive && (!isCollapsed || isMobile) && (
//                 <div className="ml-auto flex-shrink-0">
//                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </nav>

//       {/* Toggle Button - Desktop/Tablet Only */}
//       {!isMobile && (
//         <div className="p-2 sm:p-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-md">
//           <button
//             onClick={toggleSidebar}
//             className={`group flex items-center w-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 touch-manipulation ${
//               isCollapsed ? "justify-center p-2 sm:p-3" : "p-3"
//             } min-h-[44px]`}
//             title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//           >
//             {isCollapsed ? (
//               <ChevronRight className="w-5 h-5 transition-transform group-hover:scale-110" />
//             ) : (
//               <>
//                 <ChevronLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
//                 <span className="ml-3 font-semibold text-sm sm:text-base">Collapse</span>
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </>
//   );

//   return (
//     <>
//       {/* Mobile Neon Toggle (does not overlap header) */}
//       {isMobile && (
//         <NeonToggleButton
//           open={isMobileOpen}
//           onClick={() => setIsMobileOpen((v) => !v)}
//           topOffset={64} // adjust to your actual header height
//         />
//       )}

//       {/* Desktop/Tablet Sidebar */}
//       {!isMobile && (
//         <aside
//           className={`sticky top-0 h-screen bg-white border-r border-slate-200 shadow-sm transition-[width] duration-300 flex-shrink-0 ${
//             isCollapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
//           }`}
//           style={{ zIndex: 30 }}
//         >
//           <div className="flex flex-col h-full">
//             <SidebarContent />
//           </div>
//         </aside>
//       )}

//       {/* Mobile Sidebar Drawer */}
//       {isMobile && (
//         <div className="md:hidden">
//           {/* Backdrop */}
//           {isMobileOpen && (
//             <div
//               className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
//               onClick={() => setIsMobileOpen(false)}
//               aria-hidden="true"
//             />
//           )}
//           {/* Drawer */}
//           <aside
//             className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
//               isMobileOpen ? "translate-x-0" : "-translate-x-full"
//             }`}
//             role="dialog"
//             aria-modal="true"
//             aria-label="Navigation menu"
//           >
//             <div className="flex flex-col h-full">
//               <SidebarContent />
//             </div>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// }


"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Home,
  Calendar,
  Users,
  Phone,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

/* ---------------- Typewriter Banner ---------------- */
function TypewriterBanner({ compact = false }) {
  const items = useMemo(
    () => [
      { text: "Make Calls", Icon: Phone, from: "#3B82F6", to: "#06B6D4" },
      { text: "Buy Numbers", Icon: Calendar, from: "#2563EB", to: "#22D3EE" }, // (kept, not in menu)
      { text: "Build Assistants", Icon: FaRobot, from: "#06B6D4", to: "#3B82F6" },
      { text: "Generate Leads", Icon: Users, from: "#3B82F6", to: "#60A5FA" },
      { text: "Schedule Meetings", Icon: Calendar, from: "#22D3EE", to: "#2563EB" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = items[index].text;
    const typingSpeed = 40;
    const deletingSpeed = 28;
    const holdTime = 1100;

    let t;
    if (!deleting && display.length < current.length) {
      t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), typingSpeed);
    } else if (!deleting && display.length === current.length) {
      t = setTimeout(() => setDeleting(true), holdTime);
    } else if (deleting && display.length > 0) {
      t = setTimeout(() => setDisplay(current.slice(0, display.length - 1)), deletingSpeed);
    } else if (deleting && display.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % items.length);
    }
    return () => clearTimeout(t);
  }, [display, deleting, index, items]);

  const { Icon, from, to } = items[index];

  return (
    <div className={`relative flex items-center ${compact ? "justify-center p-3 sm:p-4" : "p-4 sm:p-6"}`}>
      <div className="relative mr-0 sm:mr-3">
        <motion.div
          className={`grid place-content-center rounded-2xl ${compact ? "h-9 w-9" : "h-10 w-10"}`}
          style={{
            background: `linear-gradient(135deg, ${from}, ${to})`,
            boxShadow: `0 0 24px 6px ${to}44`,
          }}
          animate={{ scale: [1, 1.06, 1], rotate: [0, 1.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-white`} />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-2xl -z-10 blur-md"
          style={{ background: `radial-gradient(60% 60% at 50% 50%, ${to}33, transparent)` }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </div>

      {!compact && (
        <div className="min-w-0 flex-1">
          <div className="text-base sm:text-lg font-extrabold tracking-tight truncate">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
            >
              {display}
            </span>
            <motion.span
              className="inline-block w-[2px] h-[1.1em] align-[-0.15em] ml-1 bg-slate-800"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
            Neon-typed actions that guide your workflow
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Screen size logic (responsive)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsCollapsed(width < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close drawer when route changes (mobile)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Listen for header logo clicks to toggle sidebar
  useEffect(() => {
    const onToggle = () => {
      if (isMobile) setIsMobileOpen((v) => !v);
      else setIsCollapsed((v) => !v);
    };
    window.addEventListener("app:toggle-sidebar", onToggle);
    return () => window.removeEventListener("app:toggle-sidebar", onToggle);
  }, [isMobile]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/user/dashboard", color: "text-blue-600" },
    { id: "phoneCalls", label: "Phone Numbers", icon: Phone, href: "/user/callhistory", color: "text-orange-600" },
    { id: "callassistence", label: "Assistants", icon: FaRobot, href: "/user/callassistent", color: "text-green-600" },
    { id: "Leads", label: "Leads", icon: Users, href: "/user/leads", color: "text-purple-600" },
    { id: "settings", label: "Settings", icon: Settings, href: "/user/settings", color: "text-gray-600" },
  ];

  const SidebarContent = () => (
    <>
      {/* Banner */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <TypewriterBanner compact={isCollapsed && !isMobile} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.href)}
              className={`group relative w-full text-left flex items-center rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation ${
                isActive
                  ? "bg-blue-50/70 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              } ${isCollapsed && !isMobile ? "justify-center p-2 sm:p-3" : "p-3 sm:p-3"} ${
                isMobile ? "min-h-[52px]" : "min-h-[44px]"
              }`}
              title={isCollapsed && !isMobile ? item.label : ""}
            >
              {/* Neon left rail on active */}
              {isActive && !isCollapsed && (
                <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              )}

              <Icon
                className={`flex-shrink-0 transition-all duration-200 ${
                  isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5"
                } ${isActive ? item.color : "text-slate-500 group-hover:text-slate-700"} ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              />

              {(!isCollapsed || isMobile) && (
                <span className="ml-3 font-semibold transition-all duration-200 truncate text-sm sm:text-base">
                  {item.label}
                </span>
              )}

              {isActive && (!isCollapsed || isMobile) && (
                <div className="ml-auto flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button - Desktop/Tablet Only (kept) */}
      {!isMobile && (
        <div className="p-2 sm:p-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-md">
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className={`group flex items-center w-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 touch-manipulation ${
              isCollapsed ? "justify-center p-2 sm:p-3" : "p-3"
            } min-h-[44px]`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 transition-transform group-hover:scale-110" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="ml-3 font-semibold text-sm sm:text-base">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <aside
          className={`sticky top-0 h-screen bg-white border-r border-slate-200 shadow-sm transition-[width] duration-300 flex-shrink-0 ${
            isCollapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
          }`}
          style={{ zIndex: 30 }}
        >
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </aside>
      )}

      {/* Mobile Sidebar Drawer (no floating toggle; opened by header logo) */}
      {isMobile && (
        <div className="md:hidden">
          {/* Backdrop (kept under header so header remains clickable if needed) */}
          {isMobileOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
          )}
          {/* Drawer */}
          <aside
            className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
