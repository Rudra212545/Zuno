import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const FeatureSection = ({ title, description, image, reverse }) => (
  <section
    className={`relative bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] text-[#e4e4e7] py-24 px-6 overflow-hidden ${
      reverse ? 'md:flex-row-reverse' : ''
    }`}
  >
    {/* Enhanced animated background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className={`absolute ${reverse ? 'top-1/4 right-1/4' : 'top-1/4 left-1/4'} w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse`}></div>
      <div className={`absolute ${reverse ? 'bottom-1/4 left-1/4' : 'bottom-1/4 right-1/4'} w-72 h-72 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000`}></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-32 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-float delay-1000 opacity-40"></div>
      <div className="absolute bottom-32 left-16 w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-float delay-2000 opacity-50"></div>
      
      {/* Animated lines */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        ></div>
      ))}
    </div>

    <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      {/* Enhanced Image Section */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? 100 : -100, scale: 0.8 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:w-1/2 p-6 group"
      >
        <div className="relative">
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
          
          {/* Image container with enhanced effects */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 pl-30">
            <img
              src={image}
              alt={title}
              className="w-[300px] h-[300px]  object-contain rounded-xl shadow-xl group-hover:scale-105 transition-transform duration-500 "
            />
            
            {/* Floating decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-80 group-hover:animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-500 opacity-60 group-hover:animate-pulse"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 rounded-xl"></div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content Section */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? -100 : 100, y: 50 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="md:w-1/2 p-6 text-center md:text-left space-y-6"
      >
        {/* Enhanced Title */}
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x hover:scale-105 transition-transform duration-300">
              {title}
            </span>
          </h2>
          
          {/* Decorative sparkle */}
          <div className="absolute -top-2 -right-4 opacity-60">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
        </div>

        {/* Enhanced Description */}
        <p className="text-lg md:text-xl text-[#a1a1aa] leading-relaxed hover:text-white/90 transition-colors duration-300">
          {description}
        </p>

        {/* Enhanced CTA Button */}
        <div className="flex justify-center md:justify-start">
          <div className="relative group">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            
            {/* Main button */}
            <button className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 group overflow-hidden">
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              
              <span className="relative z-10 group-hover:animate-pulse">Learn More</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </button>
          </div>
        </div>

        {/* Additional feature highlights */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
            ✨ Premium Feature
          </div>

        </div>
      </motion.div>
    </div>

    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0f1c] to-transparent pointer-events-none"></div>
  </section>
);

export default FeatureSection;