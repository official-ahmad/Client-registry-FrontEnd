import React, { useState } from "react";
import toast from "react-hot-toast";
import { jobService } from "./api";
import { useTheme } from "./ThemeContext";

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

const ClientSearch = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [loading, setLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    try {
      let client;

      if (searchType === "id") {
        client = await jobService.trackJob(searchQuery.trim());
      } else {
        const allJobs = await jobService.getAllJobs();

        if (searchType === "name") {
          client = allJobs.find((job) =>
            job.customerName?.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        } else if (searchType === "phone") {
          client = allJobs.find((job) =>
            job.customerPhone?.includes(searchQuery),
          );
        }
      }

      if (!client) {
        toast.error("Client not found");
        setClientDetails(null);
      } else {
        setClientDetails(client);
        toast.success("Client found!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Search failed");
      setClientDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`mb-8 ${isDark ? "text-white" : "text-slate-800"}`}>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Search Client
          </h1>
          <p
            className={`max-w-2xl ${isDark ? "text-gray-400" : "text-slate-600"}`}
          >
            Find client details by name, phone, or job ID
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className={`backdrop-blur rounded-3xl shadow-xl p-5 sm:p-7 lg:p-8 border mb-8 ${
            isDark
              ? "bg-gray-900/50 border-gray-700"
              : "bg-white/80 border-white"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Type */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <option value="name">Search by Name</option>
              <option value="phone">Search by Phone</option>
              <option value="id">Search by Job ID</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === "name"
                  ? "Enter client name..."
                  : searchType === "phone"
                    ? "Enter phone number..."
                    : "Enter job ID (e.g., OA-12345)..."
              }
              className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-7 rounded-xl transition duration-200 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <SearchIcon />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Client Details Receipt */}
        {clientDetails && (
          <div
            className={`backdrop-blur rounded-3xl shadow-xl p-6 sm:p-8 border ${
              isDark
                ? "bg-gray-900/50 border-gray-700"
                : "bg-white/80 border-white"
            }`}
          >
            {/* Receipt Header */}
            <div
              className={`text-center mb-8 pb-6 border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}
            >
              <h2
                className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}
              >
                Client Details Receipt
              </h2>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}
              >
                Job ID:{" "}
                <span className="font-semibold">{clientDetails.jobId}</span> |
                Receipt ID:{" "}
                <span className="font-semibold">{clientDetails.receiptId}</span>
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <h3
                  className={`text-lg font-bold mb-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                >
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Name
                    </label>
                    <p
                      className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {clientDetails.customerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Phone
                    </label>
                    <p
                      className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {clientDetails.customerPhone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      CNIC
                    </label>
                    <p
                      className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {clientDetails.cnic || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div>
                <h3
                  className={`text-lg font-bold mb-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                >
                  Device Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Device Model
                    </label>
                    <p
                      className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {clientDetails.deviceModel || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Service Type
                    </label>
                    <p
                      className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {clientDetails.serviceType || "Not specified"}
                    </p>
                  </div>
                  {clientDetails.customService && (
                    <div>
                      <label
                        className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                      >
                        Custom Service
                      </label>
                      <p
                        className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                      >
                        {clientDetails.customService}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Status */}
              <div>
                <h3
                  className={`text-lg font-bold mb-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                >
                  Service Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Status
                    </label>
                    <p
                      className={`text-base font-semibold ${
                        clientDetails.status === "Delivered"
                          ? "text-green-400"
                          : clientDetails.status === "Ready"
                            ? "text-blue-400"
                            : clientDetails.status === "In-Progress"
                              ? "text-yellow-400"
                              : "text-red-400"
                      }`}
                    >
                      {clientDetails.status}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Received Date
                    </label>
                    <p
                      className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {clientDetails.receivedAt
                        ? new Date(clientDetails.receivedAt).toLocaleDateString(
                            "ur-PK",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3
                  className={`text-lg font-bold mb-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                >
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Price
                    </label>
                    <p
                      className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      PKR {clientDetails.price || 0}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      Payment Status
                    </label>
                    <p
                      className={`text-base font-semibold ${
                        clientDetails.paymentStatus === "Paid"
                          ? "text-emerald-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {clientDetails.paymentStatus || "Pending"}
                    </p>
                  </div>
                  {clientDetails.paidAt && (
                    <div>
                      <label
                        className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}
                      >
                        Paid Date
                      </label>
                      <p
                        className={`text-base ${isDark ? "text-white" : "text-slate-800"}`}
                      >
                        {new Date(clientDetails.paidAt).toLocaleDateString(
                          "ur-PK",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`mt-8 pt-6 border-t text-center ${isDark ? "border-gray-700" : "border-slate-200"}`}
            >
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}
              >
                Generated on {new Date().toLocaleDateString("ur-PK")} at{" "}
                {new Date().toLocaleTimeString("ur-PK")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSearch;
