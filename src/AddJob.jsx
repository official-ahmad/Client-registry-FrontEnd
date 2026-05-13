import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jobService } from "./api";
import { useTheme } from "./ThemeContext";

const AddJob = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deviceModel: "",
    cnic: "",
    serviceType: "",
    customService: "",
    price: "",
    paymentMethod: "Cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // CNIC validation - only allow numbers and max 13 digits
    if (name === "cnic") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 13) {
        setFormData({ ...formData, [name]: numericValue });
      }
      return;
    }

    if (name === "serviceType") {
      setFormData({
        ...formData,
        serviceType: value,
        customService: value === "Other" ? formData.customService : "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.cnic && formData.cnic.length !== 13) {
      toast.error("CNIC must be 13 digits when provided");
      return;
    }

    if (formData.serviceType === "Other" && !formData.customService.trim()) {
      toast.error("Please enter a custom service name");
      return;
    }

    const price = formData.price ? parseFloat(formData.price) : 0;
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        customService: formData.customService.trim(),
        price,
      };

      await jobService.createJob({
        ...payload,
      });

      toast.success("Client created successfully");

      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        deviceModel: "",
        cnic: "",
        serviceType: "",
        customService: "",
        price: "",
        paymentMethod: "Cash",
      });

      // Navigate to dashboard after short delay
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div
          className={`mb-6 sm:mb-8 ${isDark ? "text-white" : "text-slate-800"}`}
        >
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Register New Client
          </h1>
          <p
            className={`max-w-2xl ${isDark ? "text-gray-400" : "text-slate-600"}`}
          >
            Create a new service request and issue a receipt against job ID.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`backdrop-blur rounded-3xl shadow-xl p-5 sm:p-7 lg:p-8 border ${
            isDark
              ? "bg-gray-900/50 border-gray-700"
              : "bg-white/80 border-white"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
                placeholder="Enter customer name"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
                placeholder="03001234567"
              />
            </div>

            {/* Device Model */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Device Model
              </label>
              <input
                type="text"
                name="deviceModel"
                value={formData.deviceModel}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
                placeholder="Samsung Galaxy S21"
              />
            </div>

            {/* CNIC */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                CNIC (13 digits)
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                maxLength={13}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
                placeholder="3520212345671"
              />
              <p
                className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-slate-500"}`}
              >
                {formData.cnic.length}/13 digits
              </p>
            </div>

            {/* Service Type */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Service Type
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <option value="">Select Service (Optional)</option>
                <option value="FRP">FRP</option>
                <option value="Screen Lock">Screen Lock</option>
                <option value="Software">Software</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.serviceType === "Other" && (
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-slate-700"
                  }`}
                >
                  Other Service
                </label>
                <input
                  type="text"
                  name="customService"
                  value={formData.customService}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                    isDark
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                  placeholder="Enter custom service"
                />
              </div>
            )}

            {/* Price */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Price (PKR)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
                placeholder="2500"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <option value="Cash">Cash</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-48 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-7 rounded-xl transition duration-200 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Client...
                </span>
              ) : (
                "Create Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
