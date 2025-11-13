import React from "react";
import { motion } from "framer-motion";
import feature1 from "../assets/image/feature1.png";
import feature2 from "../assets/image/feature2.png";
import feature3 from "../assets/image/feature3.png";

const Features = () => {
  const data = [
    {
      name: "Fast And Reliable",
      note: "Experience lightning-speed conversations powered by WebSockes for smooth, instant messaging",
      Image: feature1,
    },
    {
      name: "Unlimited Storage",
      note: "Never lose a message again your chats are safely stored and always available whenn you return",
      Image: feature2,
    },
    {
      name: "Seamless Sync",
      note: "Stay connected across all your devices instantly messages appear in real time everywhwere",
      Image: feature3,
    },
  ];

  // Animation variants for staggered fade-ins
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <>
      <section className="pt-10 pb-3 px-6 md:px-20 md:pt-0">
        <h1 className="text-center text-3xl font-bold underline mb-6 bg-gradient-to-r from-[#f37925] to-[#fbc02d] text-transparent bg-clip-text pt-6 md:pt-0 text-4xl">
          Features
        </h1>
        <p className="mx-auto mt-2 text-[18px] text-center font-light pb-6 md:pb-15 md:w-[450px] word-wrap">Lorem ipsitae voluptatum laborum porro optio alias delectus libero! Atque, excepturi debitis.</p>

        <motion.div
          className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {data.map((each, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-background/80 backdrop-blur-md w-[350px] h-[340px] px-2.5 my-2.5 shadow-md bg-white/20 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300"
            >
              <motion.img
                src={each.Image}
                alt={each.name}
                className="w-[200px] h-[200px] block mx-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              <h3 className="text-center text-2xl font-medium mt-1.5">
                {each.name}
              </h3>
              <p className="text-center mt-2.5">{each.note}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
};

export default Features;
