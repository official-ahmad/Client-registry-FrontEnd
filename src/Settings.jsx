import React from 'react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your application settings</p>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
          <div className="space-y-6">
            {/* Business Information */}
            <div className="pb-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value="Official-Ahmad Mobile Unlocking"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* API Configuration */}
            <div className="pb-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">API Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Backend URL
                  </label>
                  <input
                    type="text"
                    value="http://localhost:8000/api"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Current backend API endpoint
                  </p>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="pb-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="dark">Dark Theme (Current)</option>
                    <option value="light" disabled>Light Theme (Coming Soon)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-white">Version:</span> 1.0.0
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  <span className="font-semibold text-white">Developer:</span> Official-Ahmad
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Mobile Unlocking Service Management System
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-cyan-500/50"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
