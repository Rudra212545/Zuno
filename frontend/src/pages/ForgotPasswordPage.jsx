import React from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { Sparkles, MessageCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] relative overflow-hidden">
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

      <Navbar2 />
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="relative group">
          {/* Enhanced glow effect behind form */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
          
          {/* Main form container with enhanced effects */}
          <div className="relative bg-gradient-to-br from-[#1c1c2e]/90 to-[#2e2e3e]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full text-[#e4e4e7] transition-all duration-300 border border-white/10 group-hover:border-purple-400/30 group-hover:shadow-purple-500/25">
            {/* Floating decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-80 group-hover:animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-500 opacity-60 group-hover:animate-pulse"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 rounded-3xl"></div>

            {/* Animated Logo */}
            <div className="flex justify-center mb-4 group/logo">
              <div className="relative">
                {/* Multiple glow layers behind logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] rounded-full p-8 blur-xl opacity-50 animate-pulse group-hover/logo:opacity-75 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full p-6 blur-lg opacity-30 group-hover/logo:opacity-50 transition-opacity duration-300"></div>
                
                {/* Main logo container */}
                <div className="relative bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full p-4 shadow-xl animate-bounce hover:animate-none transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:shadow-purple-500/50 border border-white/20">
                  <FontAwesomeIcon icon={faHeadset} className="text-4xl text-white drop-shadow-lg" />
                  
                  {/* Floating mini sparkles */}
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 animate-bounce delay-500">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute -bottom-1 -left-1 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 animate-bounce delay-1000">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Rotating ring */}
                <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-purple-400/30 to-pink-400/30 animate-spin-slow"></div>
              </div>
            </div>

            {/* Enhanced heading */}
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-center tracking-tight">
                <span className="hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent transition-all duration-500">
                  Reset Your 
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x ml-2">
                  Password
                </span>
              </h2>
              
              {/* Decorative sparkle */}
              <div className="absolute -top-2 right-1/4 opacity-60">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Enhanced form */}
            <form className="flex flex-col gap-6 group/form" onSubmit={(e) => e.preventDefault()}>
              {/* Enhanced email input */}
              <div className="relative group/email">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-md bg-[#2e2e3e]/80 backdrop-blur-sm border border-white/10 focus:border-purple-500 group-hover/email:border-purple-400/50 focus:shadow-purple-500/25 focus:outline-none focus:shadow-lg hover:bg-[#2e2e3e]/90 placeholder-gray-400 transition-all duration-300"
                  required
                />
                
                {/* Input glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md blur-lg opacity-0 group-hover/email:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Enhanced submit button */}
              <div className="relative group/submit">
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] rounded-full blur-lg opacity-75 group-hover/submit:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                
                <button
                  type="submit"
                  className="relative w-full bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] py-3 rounded-full font-bold hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-purple-500/50 border border-white/20 group-hover/submit:border-white/40 overflow-hidden"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/submit:translate-x-[-200%] transition-transform duration-1000"></div>
                  
                  {/* Floating particles inside button */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover/submit:opacity-100 transition-opacity duration-300"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`,
                          animationDelay: `${i * 200}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  <span className="relative z-10 group-hover/submit:animate-pulse">Send Reset Link</span>
                  
                  {/* Mini sparkle effect */}
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover/submit:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                  </div>
                </button>
              </div>
            </form>

            {/* Enhanced link */}
            <div className="mt-6 text-sm text-center text-gray-300 relative">
              <p>
                Back to{" "}
                <Link to="/login" className="text-purple-400 hover:text-pink-400 hover:underline transition-colors duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text hover:text-transparent">
                  Login
                </Link>
              </p>
            </div>

            {/* Additional decorative elements */}
            <div className="flex justify-center mt-6 opacity-60">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse delay-500"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;