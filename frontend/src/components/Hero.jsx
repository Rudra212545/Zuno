import React from 'react';
import { ArrowRight, Sparkles, Users, MessageCircle } from 'lucide-react';
import { Link } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

const Hero = () => (
  <section className="bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] text-[#e4e4e7] py-32 px-6 text-center relative overflow-hidden min-h-screen flex items-center">
    
    {/* Enhanced animated background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-float delay-1000 opacity-40"></div>
      <div className="absolute bottom-32 left-16 w-5 h-5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-float delay-2000 opacity-50"></div>
      <div className="absolute top-60 left-1/3 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float delay-3000 opacity-70"></div>
      
      {/* Animated lines */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse delay-1500"></div>
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        ></div>
      ))}
    </div>

    <div className="max-w-6xl mx-auto z-10 relative">
      {/* Animated Logo with enhanced effects */}
      <div className="flex justify-center mb-8 group">
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] rounded-full p-8 blur-xl opacity-50 animate-pulse group-hover:opacity-75 transition-opacity duration-500 w-2"></div>
          
          {/* Main icon container */}
          <div className="relative bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full p-8 shadow-2xl animate-bounce hover:animate-none transition-all duration-500 group-hover:scale-110 group-hover:shadow-purple-500/50">
            <div className="relative">
              {/* Icon */}
              <FontAwesomeIcon icon={faHeadset} className="text-6xl text-white drop-shadow-lg" />
              
              {/* Floating mini icons */}
              <div className="absolute -top-2 -right-2 animate-bounce delay-500">
                <MessageCircle className="text-pink-400" size={16} />
              </div>
              <div className="absolute -bottom-1 -left-2 animate-bounce delay-1000">
                <Sparkles className="text-cyan-400" size={14} />
              </div>
            </div>
          </div>
          

        </div>
      </div>

      {/* Enhanced main heading */}
      <div className="relative">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x hover:scale-105 transition-transform duration-300">
            Your Squad.
          </span>
          <br />
          <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x delay-500 hover:scale-105 transition-transform duration-300">
            Your Space.
          </span>
          <br />
          <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x delay-1000 hover:scale-105 transition-transform duration-300">
            Your Vibe.
          </span>
        </h1>
        
        {/* Decorative elements around heading */}
        <div className="absolute -top-4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 -right-8 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute -bottom-4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-2000"></div>
      </div>

      {/* Enhanced subtitle */}
      <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-[#a1a1aa] max-w-4xl mx-auto leading-relaxed">
        <span className="inline-block hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent transition-all duration-500 transform hover:scale-105">
          Jump into voice, video, and text with the people who matter.
        </span>
        <br />
        <span className="inline-block font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mt-2">
          ZUNO makes every moment count.
        </span>
      </p>

      {/* Enhanced CTA section */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full mt-8">
        {/* Main CTA button */}
        <div className="relative group">
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          
          {/* Main button */}
          <Link
          to = {"/login"}
          className="relative w-full sm:w-auto bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] text-white px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 group overflow-hidden">
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            
            <span className="relative z-10 group-hover:animate-pulse">TRY IT NOW</span>
            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Secondary info badges */}
        <div className="flex gap-4 opacity-75">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
            🎮 Free Forever
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: `${i * 200}ms`}}></div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f1c] to-transparent pointer-events-none"></div>
  </section>
);

export default Hero;