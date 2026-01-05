import React from "react";
import { motion } from "framer-motion";
import feature1 from "../assets/image/feature1.png";
import feature2 from "../assets/image/feature2.png";
import feature3 from "../assets/image/feature3.png";

const Features = () => {
  const data = [
    {
      name: "Fast & Reliable",
      note: "Lightning-speed conversations powered by WebSockets for smooth, instant messaging.",
      Image: feature1,
    },
    {
      name: "Unlimited Storage",
      note: "Never lose a message again. Your chats are safely stored and always available.",
      Image: feature2,
    },
    {
      name: "Seamless Sync",
      note: "Stay connected across all your devices. Messages appear in real-time everywhere.",
      Image: feature3,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f37925]">
            Features
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-md mx-auto">
            Everything you need for seamless communication with your friends and team.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {data.map((each, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
            >
              <motion.img
                src={each.Image}
                alt={each.name}
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              <h3 className="text-xl sm:text-2xl font-semibold mt-4 text-gray-800">
                {each.name}
              </h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                {each.note}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
