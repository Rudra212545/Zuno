import React from 'react';
import { motion } from 'framer-motion';

const FeatureSection = ({ title, description, image, reverse }) => (
  <section
    className={`bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] text-[#e4e4e7] py-20 px-6 flex flex-col md:flex-row items-center gap-8 ${
      reverse ? 'md:flex-row-reverse' : ''
    }`}
  >
    <motion.div
      initial={{ opacity: 0, x: reverse ? 100 : -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="md:w-1/2 p-6"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-[230px] rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: reverse ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="md:w-1/2 p-6 text-center md:text-left"
    >
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-gray-400 leading-relaxed">{description}</p>
      <button className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:scale-105 transition">
        Learn More
      </button>
    </motion.div>
  </section>
);

export default FeatureSection;
