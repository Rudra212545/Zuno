import React, { useState } from 'react';
import { Menu, X, House } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

import SnakeGlowTrail from './SnakeGlowTrail';

const Navbar2 = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 md:px-15 py-4 bg-[#1c1c2e] text-[#e4e4e7] sticky top-0 z-50 font-inter">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight hover:scale-110 transition-transform duration-200 flex items-center gap-3 text-[#b877f8]">
          <FontAwesomeIcon icon={faHeadset} className="text-2xl" />
          <span className="font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">ZUNO</span>
        </div>


        <div className='flex gap-2'>
        {/* Home Button */}
        <Link
          to={"/"}
        className="hidden md:flex bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-md tracking-wide items-center gap-2">
          Home
          <House size={18} />
        </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {isMobileMenuOpen ? (
            <X className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
          ) : (
            <Menu className="cursor-pointer" onClick={() => setIsMobileMenuOpen(true)} />
          )}
        </div>
      </div>

          {isMobileMenuOpen && (
     <div
     className={`fixed top-16 right-0 w-full bg-[#1c1c2e] z-40 p-6 transition-transform duration-500 ease-in-out transform ${
       isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
     } md:hidden flex flex-col gap-4 text-[#cbd5e1] items-center text-center`}
   >

     <Link
     to={"/"}
     className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white px-4 py-2 rounded-full font-semibold shadow-md tracking-wide flex items-center gap-2 justify-center hover:scale-105 transition-all duration-200">
        Home  
       <House  size={18} />
     </Link>
   </div>
   
    )}

    </nav>
  );
};

export default Navbar2;
