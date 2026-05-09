import React, { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "./api";
import { saveAuthSession } from "./auth";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Username aur password dono required hain");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        username: username.trim(),
        password,
      });

      saveAuthSession(response);
      onLoginSuccess?.();
      toast.success("Login successful");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Invalid credentials, dobara try karein",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_42%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20">
            <span className="text-2xl font-black">A</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sirf authorized access ke liye dashboard unlock karein.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
