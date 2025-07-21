import React from 'react';
import Navbar from "../components/Navbar"
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1c] via-[#1a1a2e] to-[#16213e] text-[#e4e4e7] font-[Outfit] overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      {/* Main content */}
      <div className="relative z-10">
        <div className="animate-fadeInDown">
          <Navbar />
        </div>
        
        <div className="animate-fadeInUp">
          <Hero />
        </div>
        
        <div className="space-y-8 animate-fadeInUp delay-300">
          <div className="transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
            <FeatureSection
              title="Create an Invite-Only Place"
              description="Zuno servers are organized into topic-based channels where you can collaborate, share, and connect with your community in a secure environment."
              image="/assets/invite-only.svg"
            />
          </div>

        </div>

        <div className="animate-fadeInUp delay-500">
          <Footer />
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1c]/50 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
}

export default LandingPage;