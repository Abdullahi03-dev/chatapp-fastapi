import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../assets/image/hero.png";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20 pt-20 pb-10 md:pt-0 bg-gray-50">
      {/* Left Content */}
      <motion.div
        className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight">
          <span className="text-[#f37925]">
            Connect
          </span>{" "}
          with your circle in a fun way!
        </h1>

        <p className="mt-4 sm:mt-6 text-gray-600 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
          Join TalkZone and experience real-time messaging with your friends. 
          Fast, reliable, and always connected.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-[#f37925] hover:bg-[#e06820] py-3 px-8 text-white font-semibold rounded-full shadow-md transition-colors"
            >
              Get Started Free
            </motion.button>
          </Link>
          <a href="#features">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto border-2 border-[#f37925] text-[#f37925] py-3 px-8 font-semibold rounded-full hover:bg-[#f37925] hover:text-white transition-colors"
            >
              Learn More
            </motion.button>
          </a>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.img
          src={heroImage}
          alt="TalkZone Chat"
          className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] object-contain drop-shadow-2xl"
          whileHover={{ scale: 1.03, rotate: 2 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
