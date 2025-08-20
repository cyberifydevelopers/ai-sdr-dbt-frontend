// src/components/admin/AdminHeader.jsx
"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

/* ---------------- Neon Funnel Logo (click to toggle sidebar) ---------------- */
function NeonFunnelLogo({ onClick }) {
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKey}
      title="Toggle menu"
      aria-label="Toggle menu"
      className="group relative h-12 w-12 sm:h-12 sm:w-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl blur-md"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(59,130,246,0.25), rgba(34,211,238,0.25), rgba(59,130,246,0.25))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />
      <div className="absolute inset-0 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-[2px] shadow-[0_0_30px_rgba(59,130,246,0.15)]" />
      <motion.svg
        viewBox="0 0 48 48"
        className="relative z-10 h-full w-full p-2"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        role="img"
        aria-label="Lead generation funnel"
      >
        <defs>
          <linearGradient id="neonStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M6 8h36l-14 15v7l-8 10v-17L6 8z"
          fill="none"
          stroke="url(#neonStroke)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.circle
          cx="23"
          cy="20"
          r="1.6"
          fill="#22D3EE"
          initial={{ y: -8, opacity: 0.6 }}
          animate={{ y: 12, opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="28"
          cy="22"
          r="1.3"
          fill="#60A5FA"
          initial={{ y: -10, opacity: 0.6 }}
          animate={{ y: 14, opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
        />
      </motion.svg>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ boxShadow: "0 0 22px 4px rgba(34,211,238,0.25)" }}
        animate={{ opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    </button>
  );
}

/* ---------------- Admin Header (mirrors user header) ---------------- */
export default function Header({ className = "", onMenuToggle, profilePath = "/admin/settings" }) {
  const [username, setUsername] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("name") || "User");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const controller = new AbortController();

    async function loadPhoto() {
      try {
        // same endpoint as user header for exact parity
        const res = await fetch(`${API_URL}/api/profile-photo`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: controller.signal,
          mode: "cors",
        });
        if (!res.ok) {
          setPhotoError(true);
          return;
        }
        const data = await res.json();
        let url = data?.photo_url;
        if (url) {
          if (!/^https?:\/\//i.test(url)) {
            url = `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
          }
          const bust = (url.includes("?") ? "&" : "?") + "t=" + Date.now();
          setPhotoUrl(url + bust);
          setPhotoError(false);
        } else {
          setPhotoError(true);
        }
      } catch {
        setPhotoError(true);
      }
    }

    loadPhoto();
    return () => controller.abort();
  }, []);

  const getUserInitials = (name) =>
    name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const AvatarButton = ({ size = 40 }) => {
    const imgSize = size;
    return (
      <button
        type="button"
        onClick={() => navigate(profilePath)}
        className="group relative rounded-full p-1 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.25)] focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Edit profile"
      >
        <div className="rounded-full bg-white p-0.5">
          {photoUrl && !photoError ? (
            <img
              src={photoUrl}
              alt="Profile photo"
              width={imgSize}
              height={imgSize}
              className="rounded-full object-cover"
              style={{ width: imgSize, height: imgSize }}
              onLoad={() => setPhotoError(false)}
              onError={() => setPhotoError(true)}
            />
          ) : (
            <div
              className="rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white grid place-content-center font-bold"
              style={{ width: imgSize, height: imgSize, fontSize: imgSize < 36 ? 10 : 12 }}
            >
              {getUserInitials(username)}
            </div>
          )}
        </div>

        <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
        <span
          className="
            pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2
            whitespace-nowrap rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1
            text-xs font-medium text-slate-700 shadow-lg opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150
          "
        >
          Edit profile
        </span>
      </button>
    );
  };

  const handleToggleSidebar = () => {
    // same global event as user header so layout stays in sync
    window.dispatchEvent(new CustomEvent("app:toggle-sidebar"));
    if (typeof onMenuToggle === "function") onMenuToggle();
  };

  return (
    <header
      className={cx(
        "sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md shadow-sm",
        className
      )}
      style={{ left: 0, right: 0, height: "96px" }}
    >
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            {/* Click logo to toggle (exact behavior) */}
            <NeonFunnelLogo onClick={handleToggleSidebar} />

            <div className="min-w-0 flex-1">
              {/* Desktop title */}
              <div className="hidden lg:block">
                <h1 className="font-extrabold tracking-tight text-2xl text-slate-900 select-none truncate">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600">
                    AI SDR - DBT
                  </span>
                </h1>
                <div className="relative">
                  <p className="text-xs font-medium text-slate-500 pr-6">
                    Control center for users, leads & calls
                  </p>
                  <motion.div
                    className="absolute -bottom-1 left-0 h-[2px] w-24 bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent rounded-full"
                    initial={{ x: -20, opacity: 0.4 }}
                    animate={{ x: 40, opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
              {/* Tablet title */}
              <div className="hidden sm:block lg:hidden">
                <h1 className="font-bold text-lg text-slate-900 select-none truncate">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                    AI SDR - DBT
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium truncate">Insights & controls</p>
              </div>
              {/* Mobile title */}
              <div className="sm:hidden">
                <h1 className="font-bold text-base text-slate-900 select-none truncate">
                  AI SDR - DBT
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
            {/* Desktop welcome card */}
            <motion.div
              className="hidden lg:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <div className="relative">
                <AvatarButton size={40} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
                  Welcome!
                </p>
                <p className="text-xs text-slate-600 font-medium truncate">{username}</p>
              </div>
            </motion.div>

            {/* Tablet compact */}
            <div className="hidden sm:flex lg:hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
              <AvatarButton size={32} />
              <span className="text-sm font-semibold text-slate-900 truncate max-w-[90px]">
                {username}
              </span>
            </div>

            {/* Mobile avatar only */}
            <div className="sm:hidden">
              <AvatarButton size={36} />
            </div>

            {/* Logout */}
            <motion.button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              aria-label="Sign out"
              whileTap={{ scale: 0.96 }}
              className="group relative flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-100 hover:border-red-300 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all shadow-sm px-3 py-2 lg:px-4 lg:py-2.5 text-xs sm:text-sm min-h-[40px]"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="hidden lg:inline">Sign out</span>
              <span className="hidden sm:inline lg:hidden">Out</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </header>
  );
}
