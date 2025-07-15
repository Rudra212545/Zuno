<<<<<<< HEAD
import React from 'react';
import { Menu, LogIn } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import SnakeGlowTrail from './SnakeGlowTrail';

const Navbar = () => (
  <nav className="w-full px-6 md:px-15 py-4 flex justify-between items-center  bg-[#1c1c2e] text-[#e4e4e7]   sticky top-0 z-50 font-inter">
    <SnakeGlowTrail />
    
    <div className="text-2xl font-extrabold tracking-tight hover:scale-110 transition-transform duration-200 flex items-center gap-3 text-[#b877f8] ">
      <p className='text-2xl'><FontAwesomeIcon icon={faHeadset} /></p>
      <span className="font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent ">ZUNO</span>
    </div>
    
    <div className="hidden md:flex gap-8 font-medium tracking-wide text-[#a1a1aa] hover:text-[#5eead4]">
      <a className='hover:scale-110 transition-transform duration-200 cursor-pointer font-medium hover:text-gray-200' href="#">Features</a>
      <a className='hover:scale-110 transition-transform duration-200 cursor-pointer font-medium hover:text-gray-200' href="#">Community</a>
      <a className='hover:scale-110 transition-transform duration-200 cursor-pointer font-medium hover:text-gray-200' href="#">Safety</a>
      <a className='hover:scale-110 transition-transform duration-200 cursor-pointer font-medium hover:text-gray-200' href="#">Support</a>
    </div>
    
    <button className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-md tracking-wide flex items-center gap-1 align-middle" >
      Login
      <LogIn />
    </button>
    
    <div className="md:hidden">
      <Menu className="cursor-pointer hover:scale-110 transition-transform duration-200" />
    </div>
  </nav>
);

export default Navbar;
=======
import React, { useState } from 'react';
import { Menu, X, LogIn, User } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const Navbar = () => {
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
        {/* Login Button */}
        <Link
          to={"/login"}
        className="hidden md:flex bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-md tracking-wide items-center gap-2">
          Login
          <LogIn size={18} />
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
     to={"/login"}
     className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white px-4 py-2 rounded-full font-semibold shadow-md tracking-wide flex items-center gap-2 justify-center hover:scale-105 transition-all duration-200">
       Login
       <LogIn size={18} />
     </Link>
   </div>
   
    )}

    </nav>
  );
};

export default Navbar;
>>>>>>> b321080 (pushed)
