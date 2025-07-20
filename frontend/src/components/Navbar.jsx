import React, { useState } from 'react';
import { Menu, X, LogIn, Sparkles, Users, MessageCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 md:px-15 py-4 bg-[#1c1c2e]/90 backdrop-blur-xl text-[#e4e4e7] sticky top-0 z-50 font-inter border-b border-white/10 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-36 bg-gradient-to-r from-cyan-500/8 to-purple-500/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-2 left-20 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-4 right-32 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-float delay-1000 opacity-40"></div>
        <div className="absolute bottom-2 left-16 w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-float delay-2000 opacity-50"></div>
        <div className="absolute top-3 left-1/3 w-1 h-1 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float delay-3000 opacity-70"></div>
        
        {/* Animated lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent animate-pulse delay-1500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="flex justify-between items-center relative z-10">
        {/* Enhanced Logo */}
        <div className="text-2xl font-extrabold tracking-tight hover:scale-110 transition-transform duration-300 flex items-center gap-3 text-[#b877f8] group">
          <div className="relative">
            {/* Multiple glow layers behind icon */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-150"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-125"></div>
            
            {/* Icon container with enhanced effects */}
            <div className="relative bg-gradient-to-r from-[#6366F1]/20 to-[#9333EA]/20 backdrop-blur-sm rounded-full p-3 border border-white/10 group-hover:border-purple-400/50 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
              <FontAwesomeIcon icon={faHeadset} className="text-2xl group-hover:animate-pulse transition-all duration-300" />
              
              {/* Floating mini icons around main icon */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-500">
                <MessageCircle className="text-pink-400" size={8} />
              </div>
              <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-1000">
                <Sparkles className="text-cyan-400" size={6} />
              </div>
            </div>
            
            {/* Rotating rings */}
            <div className="absolute inset-0 rounded-full border border-gradient-to-r from-purple-400/20 to-pink-400/20 animate-spin-slow"></div>
            <div className="absolute inset-0 rounded-full border border-gradient-to-r from-blue-400/15 to-purple-400/15 animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '30s'}}></div>
          </div>
          
          <div className="relative">
            <span className="font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x group-hover:scale-105 transition-transform duration-300">
              ZUNO
            </span>
            
            {/* Decorative elements around text */}
            <div className="absolute -top-1 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400/0 via-purple-400/60 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Floating dots */}
            <div className="absolute -top-2 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute -bottom-2 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-500 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className='flex gap-2 '>
          {/* Enhanced Login Button */}
          <Link
            to={"/login"}
            className="hidden md:flex relative group overflow-hidden"
          >
      
            {/* Main button */}
            <div className="relative bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] text-white px-8 py-3 rounded-full font-bold hover:scale-110 transition-all duration-300 shadow-2xl tracking-wide flex items-center gap-3 border border-white/20 group-hover:border-white/40 group-hover:shadow-purple-500/50">
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              
              {/* Floating particles inside button */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                      animationDelay: `${i * 200}ms`
                    }}
                  ></div>
                ))}
              </div>
              
              <span className="relative z-10 group-hover:animate-pulse">Login</span>
              <LogIn size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              
              {/* Mini sparkle effect */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </Link>
        </div>

        {/* Enhanced Mobile Menu Icon */}
        <div className="md:hidden relative group">
          <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 group-hover:border-purple-400/50 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
            {/* Glow effect behind mobile menu */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {isMobileMenuOpen ? (
              <X className="cursor-pointer group-hover:rotate-90 transition-transform duration-300 relative z-10" onClick={() => setIsMobileMenuOpen(false)} />
            ) : (
              <Menu className="cursor-pointer group-hover:scale-110 transition-transform duration-300 relative z-10" onClick={() => setIsMobileMenuOpen(true)} />
            )}
            
            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`fixed top-16 right-0 w-full bg-[#1c1c2e]/95 backdrop-blur-xl z-40 p-8 transition-all duration-500 ease-in-out transform ${
            isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } md:hidden flex flex-col gap-6 text-[#cbd5e1] items-center text-center border-b border-white/10 relative overflow-hidden`}
        >
          {/* Mobile menu background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Floating particles for mobile menu */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              ></div>
            ))}
            
            {/* Animated lines */}
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse"></div>
            <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent animate-pulse delay-1000"></div>
          </div>
          
          {/* Enhanced Mobile Login Button */}
          <Link 
            to={"/login"}
            className="relative group overflow-hidden z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Multiple glow layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300 scale-105"></div>
            
            {/* Main button */}
            <div className="relative bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] text-white px-10 py-4 rounded-full font-bold shadow-2xl tracking-wide flex items-center gap-3 justify-center hover:scale-110 transition-all duration-300 border border-white/20 group-hover:border-white/40 group-hover:shadow-purple-500/50">
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 rounded-full"></div>
              
              {/* Floating particles inside button */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
                    style={{
                      left: `${15 + i * 25}%`,
                      top: `${25 + i * 15}%`,
                      animationDelay: `${i * 150}ms`
                    }}
                  ></div>
                ))}
              </div>
              
              <span className="relative z-10 group-hover:animate-pulse">Login</span>
              <LogIn size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              
              {/* Mini sparkle effect */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </Link>
          
          {/* Enhanced decorative elements */}
          <div className="flex gap-3 opacity-60 z-10">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse delay-500"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse delay-1000"></div>
          </div>
          
          {/* Additional mobile menu content */}
          <div className="flex flex-col gap-2 opacity-70 text-sm z-10">
            <div className="flex items-center gap-2 justify-center">
              <Users className="w-4 h-4 text-purple-400" />
        
            </div>
            <div className="flex items-center gap-2 justify-center">
              <MessageCircle className="w-4 h-4 text-pink-400" />
              <span>Connect Instantly</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;