import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#f37925] p-2 rounded-xl">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#f37925]">
              TalkZone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`relative font-medium hover:text-[#f37925] transition-colors ${
                isActive("/") ? "text-[#f37925]" : "text-gray-700"
              }`}
            >
              Home
              {isActive("/") && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f37925]"
                />
              )}
            </Link>
            <a
              href="#features"
              className="font-medium text-gray-700 hover:text-[#f37925] transition-colors"
            >
              Features
            </a>
            <Link to="/auth">
              <button className="hover:bg-[#e06820] transition-all bg-[#f37925] py-2.5 px-5 text-white font-semibold rounded-full">
                Join Now
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-3 flex flex-col gap-3 border-t mt-3">
                <Link
                  to="/"
                  className="py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <a
                  href="#features"
                  className="py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </a>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-[#f37925] hover:bg-[#e06820] py-3 px-5 text-white font-semibold rounded-full">
                    Join Now
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
