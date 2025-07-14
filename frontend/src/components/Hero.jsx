// components/Hero.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';



const Hero = () => (
  <section className="bg-gradient-to-rt from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] text-[#e4e4e7] py-40 px-6 text-center relative overflow-hidden h-[500px]">



    <div className="max-w-4xl mx-auto z-10 relative ">
    <div className="flex justify-center mb-5">
    <p className='text-9xl  animate-bounce-rotate'><FontAwesomeIcon icon={faHeadset} /></p>
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

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white hover:scale-105  px-6 py-3 rounded-full font-bold hover:bg-gray-200 flex items-center al gap-3">
          TRY IT NOW 
          <p> <ArrowRight /> </p>
        </button>
      </div>
    </div>


  </section>
);

export default Hero;
