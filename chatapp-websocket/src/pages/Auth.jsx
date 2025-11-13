import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const field = e.target.id.split("-")[1];
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "signup") {
        if (formData.password !== formData.confirm) {
          toast.error('Passwords do not match')
          // alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        toast.success("Account created successfully!");
        setActiveTab("login");
      } else {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("user", res.data.user.name);

        toast.success("Logged in successfully!")
        navigate("/chat", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="p-8 bg-white/70 backdrop-blur-lg shadow-2xl border border-white/40 rounded-3xl">
          {/* Logo + Title */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-[#f37925] to-[#fbc02d] p-2.5 rounded-xl">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-[#f37925] to-[#fbc02d] bg-clip-text text-transparent tracking-tight">
              TalkZone
            </span>
          </Link>

          {/* Tabs */}
          <div className="grid grid-cols-2 rounded-full bg-white/30 p-1 mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`py-2.5 rounded-full text-sm font-semibold transition ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-[#f37925] to-[#fbc02d] text-white shadow-md"
                  : "text-gray-700 hover:bg-white/40"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-2.5 rounded-full text-sm font-semibold transition ${
                activeTab === "signup"
                  ? "bg-gradient-to-r from-[#f37925] to-[#fbc02d] text-white shadow-md"
                  : "text-gray-700 hover:bg-white/40"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Animated Forms */}
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fbc02d] placeholder-gray-500"
                    placeholder="you@example.com"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fbc02d] placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#f37925] to-[#fbc02d] text-white font-semibold rounded-full shadow-md hover:opacity-90 transition disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fbc02d] placeholder-gray-500"
                    placeholder="Your name"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fbc02d] placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fbc02d] placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm"
                    type="password"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fbc02d] placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#f37925] to-[#fbc02d] text-white font-semibold rounded-full shadow-md hover:opacity-90 transition disabled:opacity-70"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
