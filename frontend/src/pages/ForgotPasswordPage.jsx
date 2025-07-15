// pages/ForgotPasswordPage.jsx
import React from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';


const ForgotPasswordPage = () => {
  return (
    <div>
      <Navbar2 />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] p-6">
        <div className="bg-[#1c1c2e] rounded-xl shadow-lg p-8 max-w-md w-full text-[#e4e4e7]">
            {/* Animated Logo */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full p-4 shadow-xl animate-bounce">
              <FontAwesomeIcon icon={faHeadset} className="text-4xl text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md bg-[#2e2e3e] border border-transparent focus:outline-none focus:border-purple-500"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Send Reset Link
            </button>
          </form>
          <div className="mt-6 text-sm text-center">
            Back to{" "}
            <Link to="/login" className="text-[#7c3aed] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
