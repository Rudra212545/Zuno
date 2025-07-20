import React from 'react';
import { Sparkles, Heart, Users, MessageCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

const Footer = () => (
  <footer className="relative bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] text-[#E2E8F0] pt-20 pb-8 px-6 text-center overflow-hidden">
    
    {/* Enhanced animated background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-cyan-500/8 to-purple-500/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
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
      {[...Array(25)].map((_, i) => (
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

    <div className="max-w-7xl mx-auto relative z-10">
      
      {/* Enhanced Logo Section */}
      <div className="flex justify-center mb-12 group">
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] rounded-full p-6 blur-xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-500"></div>
          
          {/* Main icon container */}
          <div className="relative bg-gradient-to-r from-[#6366F1]/20 to-[#9333EA]/20 backdrop-blur-sm rounded-full p-6 shadow-2xl border border-white/10 group-hover:border-purple-400/50 transition-all duration-500 group-hover:scale-110">
            <div className="relative">
              {/* Icon */}
              <FontAwesomeIcon icon={faHeadset} className="text-4xl text-white drop-shadow-lg" />
              
              {/* Floating mini icons */}
              <div className="absolute -top-1 -right-1 animate-bounce delay-500">
                <MessageCircle className="text-pink-400" size={12} />
              </div>
              <div className="absolute -bottom-1 -left-1 animate-bounce delay-1000">
                <Sparkles className="text-cyan-400" size={10} />
              </div>
            </div>
          </div>
          
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border border-gradient-to-r from-purple-400/20 to-pink-400/20 animate-spin-slow"></div>
        </div>
      </div>

      {/* Enhanced Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm justify-items-center mb-12">
        
        {/* Company Section */}
        <div className="group">
          <div className="relative mb-4">
            <h4 className="text-white font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Company
            </h4>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400/0 via-purple-400/50 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <ul className="space-y-3">
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                About
              </span>
            </li>
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                Features
              </span>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="group">
          <div className="relative mb-4">
            <h4 className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Resources
            </h4>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <ul className="space-y-3">
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                Support
              </span>
            </li>
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                Safety
              </span>
            </li>
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                Community
              </span>
            </li>
          </ul>
        </div>

        {/* Policies Section */}
        <div className="group">
          <div className="relative mb-4">
            <h4 className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Policies
            </h4>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <ul className="space-y-3">
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                Terms
              </span>
            </li>
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                Privacy
              </span>
            </li>
            <li className="relative group/item">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <span className="relative block py-2 px-3 hover:text-[#5eead4] hover:scale-105 transition-all duration-300 cursor-pointer font-medium">
                Cookie Settings
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Enhanced Copyright Section */}
      <div className="relative mb-8">
        <div className="flex items-center justify-center gap-2 text-sm text-[#a1a1aa] hover:text-white/80 transition-colors duration-300">
          <span>&copy; 2025 Zuno Inc. All rights reserved.</span>
          <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="text-xs">Made with love for communities</span>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60"></div>
      </div>

      {/* Enhanced ZUNO Logo */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
        
        <h1 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-widest mt-5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x group-hover:scale-105 transition-all duration-500">
          ZUNO
        </h1>
        
        {/* Floating decorative elements around logo */}
        <div className="absolute top-1/4 -left-8 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/2 -right-8 w-2 h-2 bg-pink-400 rounded-full animate-float delay-1000 opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-float delay-2000 opacity-50"></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-0 right-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>
        <div className="absolute bottom-0 left-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Community Stats */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
        <div className="flex items-center gap-2 text-sm font-medium hover:opacity-100 transition-opacity duration-300">
          <Users className="w-4 h-4 text-purple-400" />
     
        </div>
        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: `${i * 200}ms`}}></div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium hover:opacity-100 transition-opacity duration-300">
          <MessageCircle className="w-4 h-4 text-pink-400" />
          
        </div>
      </div>
    </div>

    {/* Top gradient fade */}
    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#0f0f1c] to-transparent pointer-events-none"></div>
  </footer>
);

export default Footer;