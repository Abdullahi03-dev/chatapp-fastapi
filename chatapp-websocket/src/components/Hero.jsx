// import React from 'react'
// import heroImage from '../assets/image/hero.png'
// const Hero = () => {
//   return (
//     <>
//     <section className='flex items-center flex-col-reverse justify-center w-full h-[100vh]'>
//     <div className='px-4'>
        
//         <h1 className='text-[40px] font-bold'><span className='bg-gradient-to-r from-[#f37925] to-[#fbc02d] text-transparent bg-clip-text'>Connect</span> with your circle in a fun way!</h1>
//         <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. eprehenderit culpa hic. Commodi, quos! Neque obcaecati rem consequuntur?</p>
//         <button className="hover:opacity-90 transition-opacity bg-gradient-to-r from-[#f37925] to-[#fbc02d] py-2 px-3 text-white font-semibold rounded-2xl mt-6">
//                 Join Now
//               </button>
//     </div>


// <div className='mb-15'>
// <img src={heroImage} className='object-cover w-[320px] h-[320px]'/>
// </div>
//     </section>
//     </>
//   )
// }

// export default Hero


import React from "react";
import { motion } from "framer-motion";
import heroImage from "../assets/image/hero.png";

const Hero = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-center w-full min-h-screen px-6 md:px-20 overflow-hidden">
      {/* Left Content */}
      <motion.div
        className="text-left md:text-left md:w-1/2 mt-14 md:mt-0"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h1 className="md:text-[48px] font-bold leading-tight text-[40px] ">
          <span className="bg-gradient-to-r from-[#f37925] to-[#fbc02d] text-transparent bg-clip-text">
            Connect
          </span>{" "}
          with your circle in a fun way!
        </h1>

        <p className="mt-4 text-gray-700 md:text-lg">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eprehenderit
          culpa hic. Commodi, quos! Neque obcaecati rem consequuntur?
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="hover:opacity-90 transition-opacity bg-gradient-to-r from-[#f37925] to-[#fbc02d] py-2 px-5 text-white font-semibold rounded-2xl mt-6 shadow-md"
        >
          Join Now
        </motion.button>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="flex justify-center md:justify-end md:w-1/2 my-5 mt-18 md:mt-0 md:mb-2"
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.img
          src={heroImage}
          alt="Hero"
          className="object-cover w-[280px] h-[280px] md:w-[420px] md:h-[420px]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
