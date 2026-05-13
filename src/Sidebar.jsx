import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { getAuthUser } from "./auth";

// Simple SVG Icons
const HomeIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RevenueIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const WrenchIcon = () => (
  <svg
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const Sidebar = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const authUser = getAuthUser();

  const navItems = [
    { name: "All Jobs", path: "/dashboard", Icon: HomeIcon },
    { name: "Add New Job", path: "/add", Icon: PlusIcon },
    { name: "Search Client", path: "/search", Icon: SearchIcon },
    { name: "Revenue", path: "/revenue", Icon: RevenueIcon },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur border-b transition-colors duration-200 ${
          isDark
            ? "bg-gray-900/95 border-gray-700"
            : "bg-white/95 border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="text-cyan-500">
              <WrenchIcon />
            </div>
            <div>
              <h1
                className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Official-Ahmad
              </h1>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}
              >
                Digital Services
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition ${
              isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 backdrop-blur flex flex-col z-50 transition-all duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } ${
          isDark
            ? "bg-gray-900/95 border-r border-gray-700 text-white"
            : "bg-white/95 border-r border-slate-200 text-slate-900"
        }`}
      >
        {/* Logo/Header - Hidden on mobile (shown in mobile header instead) */}
        <div
          className={`hidden lg:block p-6 border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}
        >
          <div className="flex items-center space-x-3">
            <div className="text-cyan-500">
              <WrenchIcon />
            </div>
            <div>
              <h1
                className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Official-Ahmad
              </h1>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}
              >
                Digital Servicesw
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-16 lg:mt-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                      : "bg-slate-900 text-white shadow-lg"
                    : isDark
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <item.Icon />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div
          className={`p-4 border-t ${isDark ? "border-gray-700" : "border-slate-200"}`}
        >
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900"
            }`}
          >
            <span className="font-medium">Theme</span>
            <div className="flex items-center space-x-2">
              {isDark ? <MoonIcon /> : <SunIcon />}
              <span className="text-sm">{isDark ? "Dark" : "Light"}</span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${isDark ? "border-gray-700" : "border-slate-200"}`}
        >
          <div
            className={`mb-3 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "border-gray-700 bg-gray-800/70 text-gray-200"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <p className="font-semibold">Logged in as</p>
            <p className="truncate text-xs opacity-80">{authUser || "Admin"}</p>
          </div>

          <button
            onClick={onLogout}
            className={`mb-3 w-full rounded-lg border px-4 py-3 font-semibold transition ${
              isDark
                ? "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            Logout
          </button>

          <p
            className={`text-xs text-center ${isDark ? "text-gray-500" : "text-slate-500"}`}
          >
            © 2026 Official-Ahmad
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
