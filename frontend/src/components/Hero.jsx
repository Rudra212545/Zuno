// components/Hero.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";




const Hero = () => (
  <section className="bg-gradient-to-rt from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] text-[#e4e4e7] py-40 px-6 text-center relative overflow-hidden min-h-1/2">




    <div className="max-w-4xl mx-auto z-10 relative ">
   {/* Animated Logo */}
   <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full p-6 shadow-3xl animate-bounce">
              <FontAwesomeIcon icon={faHeadset} className="text-9xl text-white" />
            </div>
          </div>
    <h1
  className="
    text-4xl md:text-5xl font-extrabold mb-4
    bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent
    transition duration-500 ease-in-out
    
    hover:bg-clip-text hover:text-transparent
  "
>
  Your Squad. Your Space. Your Vibe.
</h1>

<p
  className="
    text-lg md:text-xl mb-8 text-[#a1a1aa]
    transition duration-500 ease-in-out
    hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-500 hover:to-red-500
    hover:bg-clip-text hover:text-transparent
  "
>
  Jump into voice, video, and text with the people who matter. ZUNO makes every moment count.
</p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mt-6">
      <Link
      to={"/login"}
       className="w-full sm:w-auto bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-3 transition-all duration-300">
        TRY IT NOW
        <ArrowRight />
      </Link>
    </div>




    </div>


  </section>
);

export default Hero;
