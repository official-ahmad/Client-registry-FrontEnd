import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { jobService } from "./api";
import {
  sendWhatsApp,
  formatWhatsAppMessage,
  viewReceipt,
  downloadReceipt,
  getServiceLabel,
} from "./utils";
import { useTheme } from "./ThemeContext";

const STATUS_COLORS = {
  Received: "bg-red-500/20 text-red-400 border-red-500/50",
  "In-Progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  Ready: "bg-green-500/20 text-green-400 border-green-500/50",
  Delivered: "bg-blue-500/20 text-blue-400 border-blue-500/50",
};

const STATUS_OPTIONS = ["Received", "In-Progress", "Ready", "Delivered"];

const PAYMENT_STATUS_COLORS = {
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  Paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
};

const PAYMENT_STATUS_OPTIONS = ["Pending", "Paid"];

// Icons
const WhatsAppIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 10.5a6 6 0 005.5 5.5l1.4-1.4a1 1 0 011-.24 11 11 0 003.1.49 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 7a1 1 0 011-1h3.15a1 1 0 011 1 11 11 0 00.49 3.1 1 1 0 01-.24 1L8 10.5z"
    />
  </svg>
);

const ViewIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

const Dashboard = () => {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.cnic && job.cnic.includes(searchTerm)) ||
          job.jobId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (job, newStatus) => {
    setUpdatingJobId(job._id);

    const updates = { status: newStatus };
    if (
      newStatus !== "Delivered" &&
      (job.paymentStatus || "Pending") === "Paid"
    ) {
      updates.paymentStatus = "Pending";
      updates.paidAt = null;
    }

    try {
      await jobService.updateJob(job._id, updates);
      toast.success("Status updated successfully!");
      fetchJobs();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handlePaymentUpdate = async (job, newPaymentStatus) => {
    if (newPaymentStatus === "Paid" && job.status !== "Delivered") {
      toast.error("Mark job as Delivered before setting payment to Paid");
      return;
    }

    setUpdatingJobId(job._id);
    try {
      await jobService.updateJob(job._id, {
        paymentStatus: newPaymentStatus,
      });
      toast.success("Payment status updated successfully!");
      fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to update payment status",
      );
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handleWhatsApp = (job) => {
    const message = formatWhatsAppMessage(job);
    sendWhatsApp(job.customerPhone, message);
    toast.success("Opening WhatsApp...");
  };

  const handleViewReceipt = (job) => {
    viewReceipt(job);
  };

  const handleDownloadReceipt = (job) => {
    downloadReceipt(job);
    toast.success("Downloading receipt...");
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setEditFormData({
      customerName: job.customerName || "",
      customerPhone: job.customerPhone || "",
      deviceModel: job.deviceModel || "",
      cnic: job.cnic || "",
      serviceType: job.serviceType || "",
      customService: job.customService || "",
      price: job.price || 0,
      status: job.status || "Received",
      paymentStatus: job.paymentStatus || "Pending",
    });
  };

  const handleEditSave = async () => {
    if (
      editFormData.serviceType === "Other" &&
      !editFormData.customService?.trim()
    ) {
      toast.error("Please enter a custom service name");
      return;
    }

    if (
      editFormData.paymentStatus === "Paid" &&
      (editFormData.status || "Received") !== "Delivered"
    ) {
      toast.error("Only delivered jobs can be marked as Paid");
      return;
    }

    try {
      await jobService.updateJob(editingJob._id, {
        ...editFormData,
        customService: (editFormData.customService || "").trim(),
      });
      toast.success("Client updated successfully!");
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      toast.error("Failed to update client");
    }
  };

  const handleDeleteClick = (job) => {
    setDeleteConfirm(job);
  };

  const handleDeleteConfirm = async () => {
    try {
      await jobService.deleteJob(deleteConfirm._id);
      toast.success("Client deleted successfully!");
      setDeleteConfirm(null);
      fetchJobs();
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status] || "bg-gray-500/20 text-gray-400"}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const value = paymentStatus || "Pending";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${PAYMENT_STATUS_COLORS[value] || "bg-gray-500/20 text-gray-400"}`}
      >
        {value}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              All Jobs
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Manage and track all unlocking jobs
            </p>
          </div>
          <div
            className={`px-4 py-3 rounded-xl border shadow-sm ${
              isDark
                ? "bg-gray-900/50 border-gray-700"
                : "bg-white/80 border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Total Jobs
            </p>
            <p className="text-2xl font-bold text-cyan-500">{jobs.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Customer Name, CNIC, or Job ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition ${
              isDark
                ? "bg-gray-900/50 border-gray-700 text-white placeholder-gray-500"
                : "bg-white/80 border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        {/* Jobs Table */}
        <div className="2xl:hidden grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
          {filteredJobs.length === 0 ? (
            <div
              className={`rounded-xl border p-6 text-center lg:col-span-2 ${
                isDark
                  ? "bg-gray-900/50 border-gray-700 text-gray-500"
                  : "bg-white/80 border-gray-200 text-gray-500"
              }`}
            >
              {searchTerm
                ? "No jobs found matching your search"
                : "No jobs yet"}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className={`rounded-xl border p-4 ${
                  isDark
                    ? "bg-gray-900/50 border-gray-700"
                    : "bg-white/80 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-mono text-cyan-500">
                      {job.jobId}
                    </p>
                    <p
                      className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {job.customerName}
                    </p>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
                <div
                  className={`text-xs space-y-1 mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <p>Phone: {job.customerPhone || "-"}</p>
                  <p>Device: {job.deviceModel || "-"}</p>
                  <p>Service: {getServiceLabel(job)}</p>
                  <p>Price: PKR {(job.price || 0).toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusUpdate(job, e.target.value)}
                    disabled={updatingJobId === job._id}
                    className={`px-2 py-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 ${
                      isDark
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-200 text-gray-900"
                    }`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select
                    value={job.paymentStatus || "Pending"}
                    onChange={(e) => handlePaymentUpdate(job, e.target.value)}
                    disabled={updatingJobId === job._id}
                    className={`px-2 py-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                      isDark
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-200 text-gray-900"
                    }`}
                  >
                    {PAYMENT_STATUS_OPTIONS.map((paymentStatus) => (
                      <option
                        key={paymentStatus}
                        value={paymentStatus}
                        disabled={
                          paymentStatus === "Paid" && job.status !== "Delivered"
                        }
                      >
                        {paymentStatus}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">{getPaymentBadge(job.paymentStatus)}</div>
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => handleWhatsApp(job)}
                    className="h-9 w-9 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                    title="Send WhatsApp"
                  >
                    <WhatsAppIcon />
                  </button>
                  <button
                    onClick={() => handleViewReceipt(job)}
                    className="h-9 w-9 flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
                    title="View Receipt"
                  >
                    <ViewIcon />
                  </button>
                  <button
                    onClick={() => handleDownloadReceipt(job)}
                    className="h-9 w-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    title="Download PDF"
                  >
                    <DownloadIcon />
                  </button>
                  <button
                    onClick={() => handleEditClick(job)}
                    className="h-9 w-9 flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
                    title="Edit Client"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(job)}
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    title="Delete Client"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className={`hidden 2xl:block rounded-xl shadow-lg border overflow-hidden ${
            isDark
              ? "bg-gray-900/50 border-gray-700"
              : "bg-white/80 border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? "bg-gray-800/80" : "bg-gray-100"}>
                <tr>
                  <th
                    className={`px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Job ID
                  </th>
                  <th
                    className={`px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Customer
                  </th>
                  <th
                    className={`hidden md:table-cell px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone
                  </th>
                  <th
                    className={`hidden lg:table-cell px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Device
                  </th>
                  <th
                    className={`hidden xl:table-cell px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Service
                  </th>
                  <th
                    className={`px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Price
                  </th>
                  <th
                    className={`px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}
              >
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <p className={isDark ? "text-gray-500" : "text-gray-400"}>
                        {searchTerm
                          ? "No jobs found matching your search"
                          : "No jobs yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className={`transition ${
                        isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-cyan-500">
                          {job.jobId}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {job.customerName}
                          </div>
                          <div
                            className={`md:hidden text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {job.customerPhone}
                          </div>
                          <div
                            className={`lg:hidden text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {job.deviceModel}
                          </div>
                          <div
                            className={`xl:hidden text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {getServiceLabel(job)}
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {job.customerPhone}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {job.deviceModel}
                        </span>
                      </td>
                      <td className="hidden xl:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {getServiceLabel(job)}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-green-500 font-semibold">
                          {job.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(job.status)}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-col gap-2 min-w-[210px]">
                          <select
                            value={job.status}
                            onChange={(e) =>
                              handleStatusUpdate(job, e.target.value)
                            }
                            disabled={updatingJobId === job._id}
                            className={`px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 cursor-pointer ${
                              isDark
                                ? "bg-gray-800 border-gray-600 text-white"
                                : "bg-gray-100 border-gray-200 text-gray-900"
                            }`}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            {getPaymentBadge(job.paymentStatus)}
                            <select
                              value={job.paymentStatus || "Pending"}
                              onChange={(e) =>
                                handlePaymentUpdate(job, e.target.value)
                              }
                              disabled={updatingJobId === job._id}
                              className={`px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer ${
                                isDark
                                  ? "bg-gray-800 border-gray-600 text-white"
                                  : "bg-gray-100 border-gray-200 text-gray-900"
                              }`}
                            >
                              {PAYMENT_STATUS_OPTIONS.map((paymentStatus) => (
                                <option
                                  key={paymentStatus}
                                  value={paymentStatus}
                                  disabled={
                                    paymentStatus === "Paid" &&
                                    job.status !== "Delivered"
                                  }
                                >
                                  {paymentStatus}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleWhatsApp(job)}
                              className="h-8 w-8 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                              title="Send WhatsApp"
                            >
                              <WhatsAppIcon />
                            </button>
                            <button
                              onClick={() => handleViewReceipt(job)}
                              className="h-8 w-8 flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
                              title="View Receipt"
                            >
                              <ViewIcon />
                            </button>
                            <button
                              onClick={() => handleDownloadReceipt(job)}
                              className="h-8 w-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                              title="Download PDF"
                            >
                              <DownloadIcon />
                            </button>
                            <button
                              onClick={() => handleEditClick(job)}
                              className="h-8 w-8 flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
                              title="Edit Client"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(job)}
                              className="h-8 w-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                              title="Delete Client"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-lg rounded-2xl p-6 ${
                isDark ? "bg-gray-900 border border-gray-700" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Edit Client - {editingJob.jobId}
                </h2>
                <button
                  onClick={() => setEditingJob(null)}
                  className={
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.customerName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        customerName: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editFormData.customerPhone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        customerPhone: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Device Model
                  </label>
                  <input
                    type="text"
                    value={editFormData.deviceModel}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        deviceModel: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Service Type
                    </label>
                    <select
                      value={editFormData.serviceType}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          serviceType: e.target.value,
                          customService:
                            e.target.value === "Other"
                              ? editFormData.customService
                              : "",
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    >
                      <option value="">Select</option>
                      <option value="FRP">FRP</option>
                      <option value="Screen Lock">Screen Lock</option>
                      <option value="Software">Software</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Price (PKR)
                    </label>
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    />
                  </div>
                </div>
                {editFormData.serviceType === "Other" && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Other Service
                    </label>
                    <input
                      type="text"
                      value={editFormData.customService}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          customService: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    />
                  </div>
                )}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    CNIC
                  </label>
                  <input
                    type="text"
                    value={editFormData.cnic}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        cnic: e.target.value.replace(/\D/g, "").slice(0, 13),
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Payment Status
                  </label>
                  <select
                    value={editFormData.paymentStatus || "Pending"}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        paymentStatus: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    <option value="Pending">Pending</option>
                    <option
                      value="Paid"
                      disabled={
                        (editFormData.status || "Received") !== "Delivered"
                      }
                    >
                      Paid
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingJob(null)}
                  className={`flex-1 py-2 rounded-lg font-medium ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-sm rounded-2xl p-6 ${
                isDark ? "bg-gray-900 border border-gray-700" : "bg-white"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Delete Client?
              </h2>
              <p
                className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Are you sure you want to delete{" "}
                <strong>{deleteConfirm.customerName}</strong> (
                {deleteConfirm.jobId})? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`flex-1 py-2 rounded-lg font-medium ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {filteredJobs.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {STATUS_OPTIONS.map((status) => {
              const count = jobs.filter((job) => job.status === status).length;
              return (
                <div
                  key={status}
                  className={`p-4 rounded-xl border shadow-sm ${
                    isDark
                      ? "bg-gray-900/50 border-gray-700"
                      : "bg-white/80 border-gray-200"
                  }`}
                >
                  <p
                    className={`text-xs md:text-sm mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {status}
                  </p>
                  <p
                    className={`text-xl md:text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {count}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
