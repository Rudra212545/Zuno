import React from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const FeatureSwiperSlider = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Your feature data
  const features = [
    {
      title: "Create an Invite-Only Place",
      description: "Zuno servers are organized into topic-based channels where you can collaborate, share, and connect with your community in a secure environment.",
      image: "/assets/invite-only.svg",
      reverse: false
    },
    {
      title: "Where hanging out is easy",
      description: "Voice channels make it easy to chat casually with friends, host events, or collaborate on projects with crystal-clear audio quality.",
      image: "/assets/hangout.svg",
      reverse: true
    },
    {
      title: "Customizable Profiles",
      description: "Express yourself with unique avatars, custom statuses, and personal bios to stand out in the community and showcase your personality.",
      image: "/assets/custom-profile.svg",
      reverse: false
    },
    {
      title: "Integrations & Bots",
      description: "Enhance your server with powerful bots and third-party integrations for music, games, moderation, and automation to create the perfect experience.",
      image: "/assets/integrations.svg",
      reverse: true
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % features.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Auto-play functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const FeatureSlide = ({ feature, isActive, slideIndex }) => (
    <div
      className={`absolute inset-0 transition-all duration-800 ease-out ${
        isActive 
          ? 'opacity-100 translate-x-0' 
          : slideIndex > currentSlide 
            ? 'opacity-0 translate-x-full' 
            : 'opacity-0 -translate-x-full'
      }`}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs - positioned based on reverse prop */}
        <div className={`absolute ${feature.reverse ? 'top-1/4 right-1/4' : 'top-1/4 left-1/4'} w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute ${feature.reverse ? 'bottom-1/4 left-1/4' : 'bottom-1/4 right-1/4'} w-72 h-72 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000`}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-1000 opacity-40"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce delay-2000 opacity-50"></div>
        
        {/* Animated lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10 px-4 sm:px-6 ${feature.reverse ? 'md:flex-row-reverse' : ''}`}>
  {/* Image Section */}
  <div className={`w-full md:w-1/2 flex justify-center items-center group transition-all duration-800 ${isActive ? 'translate-x-0 opacity-100' : feature.reverse ? 'translate-x-20 opacity-0' : '-translate-x-20 opacity-0'}`}>
    <div className="relative w-[180px] sm:w-[220px] md:w-[300px]">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl group-hover:shadow-purple-500/25 transition-all duration-500">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-auto object-contain rounded-xl shadow-xl group-hover:scale-105 transition-transform duration-500"
        />
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-80 group-hover:animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-500 opacity-60 group-hover:animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 rounded-xl"></div>
      </div>
    </div>
  </div>

  {/* Content Section */}
  <div className={`w-full md:w-1/2 p-4 sm:p-6 text-center md:text-left space-y-4 sm:space-y-6 transition-all duration-800 delay-200 ${isActive ? 'translate-x-0 opacity-100' : feature.reverse ? '-translate-x-20 opacity-0' : 'translate-x-20 opacity-0'}`}>
    <div className="relative">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-3 leading-snug sm:leading-tight">
        <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
          {feature.title}
        </span>
      </h2>
      <div className="absolute -top-2 -right-4 opacity-60">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 animate-pulse" />
      </div>
    </div>

    <p className="text-sm sm:text-base md:text-lg text-[#a1a1aa] leading-relaxed hover:text-white/90 transition-colors duration-300 break-words">
      {feature.description}
    </p>

    <div className="flex justify-center md:justify-start">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
        <button className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 sm:gap-3 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
          <span className="relative z-10 group-hover:animate-pulse">Learn More</span>
          <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={16} />
        </button>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start mt-5">
      <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
        ✨ Premium Feature
      </div>
    </div>
  </div>
</div>


    </div>
  );

  return (
    <section className="relative bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] text-[#e4e4e7] py-24 overflow-hidden min-h-screen">
      {/* Swiper Container */}
      <div className="relative h-full">
        {/* Slides */}
        {features.map((feature, index) => (
          <FeatureSlide
            key={index}
            feature={feature}
            isActive={index === currentSlide}
            slideIndex={index}
          />
        ))}

 

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 disabled:cursor-not-allowed ${
                index === currentSlide
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-linear"
            style={{ width: `${((currentSlide + 1) / features.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0f1c] to-transparent pointer-events-none"></div>
    </section>
  );
};

export default FeatureSwiperSlider;