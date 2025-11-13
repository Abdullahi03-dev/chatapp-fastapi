import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, X } from "lucide-react";

export default function Navbar (){
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md "
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-[#f37925] p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-[#f37925] bg-clip-text text-transparent">
              TalkZone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`relative text-foreground hover:text-[#f37925] transition-colors ${
                isActive("/") ? "text-[#f37925]" : ""
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
              className="text-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <Link to="/auth">
              <button className="hover:opacity-90 transition-opacity bg-gradient-to-r from-[#f37925] to-[#fbc02d] py-2 px-3 text-white font-semibold rounded-2xl">
                Join Now
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pt-4 pb-2 flex flex-col gap-4"
          >
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <a
              href="#features"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <button className="bg-gradient-primary w-full bg-gradient-to-r from-[#f37925] to-[#fbc02d] py-2 px-3 rounded-[12px]">Join Now</button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
