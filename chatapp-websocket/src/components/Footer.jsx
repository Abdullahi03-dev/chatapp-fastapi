import { Github, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-8 sm:py-10 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#f37925] p-2 rounded-xl">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#f37925]">
              TalkZone
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-gray-400 text-center text-sm sm:text-base order-3 sm:order-2">
            © {new Date().getFullYear()} TalkZone. Built by Abdullahi Abbas Ribadu hehe
          </p>

          
        </div>
      </div>
    </footer>
  );
};
