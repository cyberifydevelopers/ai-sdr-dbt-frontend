

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
// } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaRobot } from "react-icons/fa";
// import { motion } from "framer-motion";

// /* ---------------- Typewriter Banner ---------------- */
// function TypewriterBanner({ compact = false }) {
//   const items = useMemo(
//     () => [
//       { text: "Make Calls", Icon: Phone, from: "#3B82F6", to: "#06B6D4" },
//       { text: "Buy Numbers", Icon: Calendar, from: "#2563EB", to: "#22D3EE" }, // (kept, not in menu)
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
//       <div className="relative mr-0 sm:mr-5">
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

// /* ---------------- Sidebar ---------------- */
// export default function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Screen size logic (responsive)
//   useEffect(() => {
//     const checkScreenSize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width < 768);
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

//   // Listen for header logo clicks to toggle sidebar
//   useEffect(() => {
//     const onToggle = () => {
//       if (isMobile) setIsMobileOpen((v) => !v);
//       else setIsCollapsed((v) => !v);
//     };
//     window.addEventListener("app:toggle-sidebar", onToggle);
//     return () => window.removeEventListener("app:toggle-sidebar", onToggle);
//   }, [isMobile]);

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: Home, href: "/user/dashboard", color: "text-blue-600" },
//     { id: "phoneCalls", label: "Phone Numbers", icon: Phone, href: "/user/callhistory", color: "text-orange-600" },
//     { id: "callassistence", label: "Assistants", icon: FaRobot, href: "/user/callassistent", color: "text-green-600" },
//     { id: "Leads", label: "Leads", icon: Users, href: "/user/leads", color: "text-purple-600" },
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

//       {/* Toggle Button - Desktop/Tablet Only (kept) */}
//       {!isMobile && (
//         <div className="p-2 sm:p-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-md">
//           <button
//             onClick={() => setIsCollapsed((v) => !v)}
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

//       {/* Mobile Sidebar Drawer (no floating toggle; opened by header logo) */}
//       {isMobile && (
//         <div className="md:hidden">
//           {/* Backdrop (kept under header so header remains clickable if needed) */}
//           {isMobileOpen && (
//             <div
//               className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
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
// } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaRobot } from "react-icons/fa";
// import { motion } from "framer-motion";

// /* ---------------- Typewriter Banner ---------------- */
// function TypewriterBanner({ compact = false }) {
//   const items = useMemo(
//     () => [
//       { text: "Make Calls", Icon: Phone, from: "#3B82F6", to: "#06B6D4" },
//       { text: "Buy Numbers", Icon: Calendar, from: "#2563EB", to: "#22D3EE" },
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
//       <div className="relative mr-0 sm:mr-5">
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

// /* ---------------- Sidebar ---------------- */
// export default function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width < 768);
//       setIsCollapsed(width < 1024);
//     };
//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   useEffect(() => {
//     setIsMobileOpen(false);
//   }, [location.pathname]);

//   useEffect(() => {
//     const onToggle = () => {
//       if (isMobile) setIsMobileOpen((v) => !v);
//       else setIsCollapsed((v) => !v);
//     };
//     window.addEventListener("app:toggle-sidebar", onToggle);
//     return () => window.removeEventListener("app:toggle-sidebar", onToggle);
//   }, [isMobile]);

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: Home, href: "/user/dashboard", color: "text-blue-600" },
//     { id: "phoneCalls", label: "Phone Numbers", icon: Phone, href: "/user/callhistory", color: "text-orange-600" },
//     { id: "callassistence", label: "Assistants", icon: FaRobot, href: "/user/callassistent", color: "text-green-600" },
//     { id: "Leads", label: "Leads", icon: Users, href: "/user/leads", color: "text-purple-600" },
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

//           // add a bit of left padding when the neon rail is visible
//           const leftRailPadding = isActive && (!isCollapsed || isMobile) ? "pl-4" : "";

//           return (
//             <button
//               key={item.id}
//               type="button"
//               onClick={() => navigate(item.href)}
//               className={`group relative w-full text-left flex items-center rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation
//                 ${isActive ? "bg-blue-50/70 text-blue-700 border border-blue-200 shadow-sm" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}
//                 ${isCollapsed && !isMobile ? "justify-center p-2 sm:p-3" : `p-3 sm:p-3 ${leftRailPadding}`}
//                 ${isMobile ? "min-h-[52px]" : "min-h-[44px]"}`}
//               title={isCollapsed && !isMobile ? item.label : ""}
//             >
//               {/* Neon left rail on active (kept, but ensure it sits under the icon) */}
//               {isActive && !isCollapsed && (
//                 <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] z-0" />
//               )}

//               {/* ✅ Icon wrapper for mobile to prevent overlap */}
//               <div className={`relative ${isCollapsed && !isMobile ? "" : "mr-3"} ${isMobile ? "mr-3" : ""} z-10`}>
//                 <Icon
//                   className={`flex-shrink-0 transition-all duration-200
//                     ${isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5"}
//                     ${isActive ? item.color : "text-slate-500 group-hover:text-slate-700"}
//                     ${isActive ? "scale-110" : "group-hover:scale-105"}`}
//                 />
//               </div>

//               {(!isCollapsed || isMobile) && (
//                 <span className="ml-0 font-semibold transition-all duration-200 truncate text-sm sm:text-base min-w-0">
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
//             onClick={() => setIsCollapsed((v) => !v)}
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

//       {/* Mobile Sidebar Drawer (opened by header logo) */}
//       {isMobile && (
//         <div className="md:hidden">
//           {isMobileOpen && (
//             <div
//               className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
//               onClick={() => setIsMobileOpen(false)}
//               aria-hidden="true"
//             />
//           )}
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
import { FaUsers, FaHandshake ,} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import { CalendarRange } from "lucide-react";
/* ---------------- Typewriter Banner ---------------- */
function TypewriterBanner({ compact = false }) {
  const items = useMemo(
    () => [
      { text: "Make Calls", Icon: Phone, from: "#3B82F6", to: "#06B6D4" },
      { text: "Buy Numbers", Icon: Calendar, from: "#2563EB", to: "#22D3EE" },
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
    <div
      className={[
        "relative flex items-center",
        compact ? "justify-center p-3 sm:p-4" : "p-4 sm:p-6",
        // ✅ add clean, responsive spacing between icon and text
        compact ? "" : "gap-4 sm:gap-6",
      ].join(" ")}
    >
      <div className="relative shrink-0">
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

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

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
    { id: "Campain", label: "Campaigns", icon: Calendar, href: "/user/campain", color: "text-blue-600" },
    { id: "settings", label: "Settings", icon: Settings, href: "/user/settings", color: "text-gray-600" },
    { id: "CRM", label: "CRMS", icon: FaHandshake, href: "/user/CRM", color: "text-orange-600" },
    {id: "Appointments" , label : "Appointments" , icon : CalendarRange , href: "/user/Appointments" , color:"text-purple-600" }

   
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

          // more left padding when the neon rail is visible (a bit extra on mobile)
          const leftRailPadding =
            isActive && (!isCollapsed || isMobile) ? (isMobile ? "pl-5" : "pl-4") : "";

          // spacing between icon and text:
          const gapClass =
            isCollapsed && !isMobile ? "gap-0" : isMobile ? "gap-4" : "gap-3";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.href)}
              className={`group relative w-full text-left flex items-center ${gapClass} rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation
                ${isActive ? "bg-blue-50/70 text-blue-700 border border-blue-200 shadow-sm" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}
                ${isCollapsed && !isMobile ? "justify-center p-2 sm:p-3" : `p-3 sm:p-3 ${leftRailPadding}`}
                ${isMobile ? "min-h-[52px]" : "min-h-[44px]"}`}
              title={isCollapsed && !isMobile ? item.label : ""}
            >
              {/* Neon left rail on active */}
              {isActive && !isCollapsed && (
                <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] z-0" />
              )}

              {/* Icon (spacing handled by gap-*) */}
              <div className="relative z-10">
                <Icon
                  className={`flex-shrink-0 transition-all duration-200
                    ${isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5"}
                    ${isActive ? item.color : "text-slate-500 group-hover:text-slate-700"}
                    ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                />
              </div>

              {(!isCollapsed || isMobile) && (
                <span className="font-semibold transition-all duration-200 truncate text-sm sm:text-base min-w-0">
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

      {/* Toggle Button - Desktop/Tablet Only */}
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

      {/* Mobile Sidebar Drawer (opened by header logo) */}
      {isMobile && (
        <div className="md:hidden">
          {isMobileOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
          )}
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
