import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { jobService } from "./api";
import { useTheme } from "./ThemeContext";

const Revenue = () => {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredJobs = () => {
    const now = new Date();
    let filtered = [...jobs];

    switch (dateFilter) {
      case "today":
        filtered = jobs.filter((job) => {
          const jobDate = new Date(job.receivedAt);
          return jobDate.toDateString() === now.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = jobs.filter((job) => new Date(job.receivedAt) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = jobs.filter((job) => new Date(job.receivedAt) >= monthAgo);
        break;
      case "custom":
        if (customDateRange.start && customDateRange.end) {
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          endDate.setHours(23, 59, 59, 999);
          filtered = jobs.filter((job) => {
            const jobDate = new Date(job.receivedAt);
            return jobDate >= startDate && jobDate <= endDate;
          });
        }
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredJobs = getFilteredJobs();
  const deliveredJobs = filteredJobs.filter((job) => job.status === "Delivered");
  const totalRevenue = deliveredJobs.reduce((sum, job) => sum + (job.price || 0), 0);
  const pendingRevenue = filteredJobs
    .filter((job) => job.status !== "Delivered")
    .reduce((sum, job) => sum + (job.price || 0), 0);
  const totalJobs = filteredJobs.length;
  const avgRevenue = deliveredJobs.length > 0 ? totalRevenue / deliveredJobs.length : 0;

  // Service type breakdown
  const serviceBreakdown = deliveredJobs.reduce((acc, job) => {
    const service = job.serviceType || "Other";
    if (!acc[service]) {
      acc[service] = { count: 0, revenue: 0 };
    }
    acc[service].count += 1;
    acc[service].revenue += job.price || 0;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-transparent" : "bg-transparent"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            💰 Revenue & Payments
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Track your earnings and payment history
          </p>
        </div>

        {/* Date Filter */}
        <div className={`mb-6 p-4 rounded-xl border ${
          isDark 
            ? "bg-gray-900/50 border-gray-700" 
            : "bg-white/80 border-gray-200"
        }`}>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "custom", label: "Custom Range" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  dateFilter === option.value
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                    : isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {dateFilter === "custom" && (
            <div className="flex flex-wrap gap-4">
              <div>
                <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) =>
                    setCustomDateRange({ ...customDateRange, start: e.target.value })
                  }
                  className={`px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) =>
                    setCustomDateRange({ ...customDateRange, end: e.target.value })
                  }
                  className={`px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Revenue */}
          <div className={`p-6 rounded-xl border shadow-lg ${
            isDark 
              ? "bg-gradient-to-br from-green-900/50 to-emerald-900/30 border-green-700/50" 
              : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? "text-green-300" : "text-green-700"}`}>
                Total Revenue
              </span>
              <span className="text-2xl">💵</span>
            </div>
            <p className={`text-3xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
              PKR {totalRevenue.toLocaleString()}
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-green-300/70" : "text-green-600/70"}`}>
              From {deliveredJobs.length} delivered jobs
            </p>
          </div>

          {/* Pending Revenue */}
          <div className={`p-6 rounded-xl border shadow-lg ${
            isDark 
              ? "bg-gradient-to-br from-yellow-900/50 to-amber-900/30 border-yellow-700/50" 
              : "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? "text-yellow-300" : "text-yellow-700"}`}>
                Pending Revenue
              </span>
              <span className="text-2xl">⏳</span>
            </div>
            <p className={`text-3xl font-bold ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
              PKR {pendingRevenue.toLocaleString()}
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-yellow-300/70" : "text-yellow-600/70"}`}>
              From {filteredJobs.length - deliveredJobs.length} pending jobs
            </p>
          </div>

          {/* Total Jobs */}
          <div className={`p-6 rounded-xl border shadow-lg ${
            isDark 
              ? "bg-gradient-to-br from-cyan-900/50 to-blue-900/30 border-cyan-700/50" 
              : "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>
                Total Jobs
              </span>
              <span className="text-2xl">📋</span>
            </div>
            <p className={`text-3xl font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
              {totalJobs}
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-cyan-300/70" : "text-cyan-600/70"}`}>
              In selected period
            </p>
          </div>

          {/* Average Revenue */}
          <div className={`p-6 rounded-xl border shadow-lg ${
            isDark 
              ? "bg-gradient-to-br from-purple-900/50 to-violet-900/30 border-purple-700/50" 
              : "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? "text-purple-300" : "text-purple-700"}`}>
                Average per Job
              </span>
              <span className="text-2xl">📊</span>
            </div>
            <p className={`text-3xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
              PKR {Math.round(avgRevenue).toLocaleString()}
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-purple-300/70" : "text-purple-600/70"}`}>
              Per delivered job
            </p>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className={`p-6 rounded-xl border shadow-lg mb-8 ${
          isDark 
            ? "bg-gray-900/50 border-gray-700" 
            : "bg-white/80 border-gray-200"
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            📈 Revenue by Service Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(serviceBreakdown).map(([service, data]) => (
              <div
                key={service}
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-800/50 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {service || "Other"}
                </h3>
                <p className={`text-2xl font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                  PKR {data.revenue.toLocaleString()}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {data.count} job{data.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
            {Object.keys(serviceBreakdown).length === 0 && (
              <p className={`col-span-3 text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                No delivered jobs in selected period
              </p>
            )}
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className={`rounded-xl border shadow-lg overflow-hidden ${
          isDark 
            ? "bg-gray-900/50 border-gray-700" 
            : "bg-white/80 border-gray-200"
        }`}>
          <div className="p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              💳 Recent Payments (Delivered Jobs)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? "bg-gray-800" : "bg-gray-100"}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>Job ID</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>Customer</th>
                  <th className={`hidden md:table-cell px-4 py-3 text-left text-xs font-semibold uppercase ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>Service</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>Date</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>Amount</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
                {deliveredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`px-4 py-12 text-center ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}>
                      No delivered jobs found in selected period
                    </td>
                  </tr>
                ) : (
                  deliveredJobs.slice(0, 10).map((job) => (
                    <tr key={job._id} className={`transition ${
                      isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                    }`}>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-mono ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                          {job.jobId}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                        {job.customerName}
                      </td>
                      <td className={`hidden md:table-cell px-4 py-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {job.serviceType || "-"}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(job.receivedAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className={`px-4 py-3 text-right text-sm font-semibold ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}>
                        PKR {(job.price || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
