"use client";

import { Outlet } from "react-router-dom";
import Header from "../components/user/headeruser";
import Sidebar from "../components/user/sidebaruser";

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header className="h-16 border-b" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
