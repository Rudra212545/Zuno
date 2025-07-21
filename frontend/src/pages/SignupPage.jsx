import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import ReCAPTCHA from "react-google-recaptcha";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase/firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Using react-icons for eye icons



const SignupPage = () => {
  const recaptchaRef = useRef(null);
  const [isHuman, setIsHuman] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  let navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const password = watch("password");

  const handleCaptchaChange = (value) => {
    if (value) setIsHuman(true);
  };

  const onSubmit = async (data) => {
    if (!isHuman) {
      alert("Please verify you are human.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/users/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // alert("Sign up successful!");
      navigate("/home");
      reset(); // Reset form on success
      recaptchaRef.current?.reset(); // Reset reCAPTCHA
      setIsHuman(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        "http://localhost:3000/api/v1/users/google-auth",
        { idToken },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Google signup/login successful:", response.data);
      navigate("/home");
      return response.data;
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert(error.response?.data?.message || error.message);
    }
  };

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
      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
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
                  Create Your 
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x ml-2">
                  ZUNO
                </span>
                <span className="hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent transition-all duration-500 ml-2">
                  Account
                </span>
              </h2>
              
              {/* Decorative sparkle */}
              <div className="absolute -top-2 right-1/4 opacity-60">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Google Sign-Up */}
            <div className="relative group/google mb-6">
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-200/20 rounded-full blur-lg opacity-0 group-hover/google:opacity-100 transition-opacity duration-500"></div>
              
              <button
                type="button"
                className="relative w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-full font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 group-hover/google:border-gray-300 overflow-hidden"
                onClick={handleGoogleSignUp}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover/google:translate-x-[-200%] transition-transform duration-1000"></div>
                
                <FcGoogle size={22} className="relative z-10" />
                <span className="relative z-10">Sign up with Google</span>
              </button>
            </div>

            {/* Enhanced divider */}
            <div className="flex items-center justify-between mb-6 relative">
              <div className="w-full border-t border-gradient-to-r from-transparent via-gray-600 to-gray-600"></div>
              <span className="px-3 text-sm text-gray-400 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full py-1 backdrop-blur-sm border border-white/10">or</span>
              <div className="w-full border-t border-gradient-to-r from-gray-600 to-transparent"></div>
            </div>

            {/* Manual Sign-Up Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Username Input */}
              <div className="flex flex-col gap-1 group/username">
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters long"
                    },
                    maxLength: {
                      value: 20,
                      message: "Username must not exceed 20 characters"
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Username can only contain letters, numbers, and underscores"
                    }
                  })}
                  className={`p-3 rounded-md bg-[#2e2e3e]/80 backdrop-blur-sm border transition-all duration-300 ${
                    errors.username 
                      ? "border-red-500 focus:border-red-500 focus:shadow-red-500/25" 
                      : "border-white/10 focus:border-purple-500 group-hover/username:border-purple-400/50 focus:shadow-purple-500/25"
                  } focus:outline-none focus:shadow-lg hover:bg-[#2e2e3e]/90 placeholder-gray-400`}
                />
                {errors.username && (
                  <span className="text-red-400 text-xs animate-fadeInDown">{errors.username.message}</span>
                )}
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1 group/email">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className={`p-3 rounded-md bg-[#2e2e3e]/80 backdrop-blur-sm border transition-all duration-300 ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500 focus:shadow-red-500/25" 
                      : "border-white/10 focus:border-purple-500 group-hover/email:border-purple-400/50 focus:shadow-purple-500/25"
                  } focus:outline-none focus:shadow-lg hover:bg-[#2e2e3e]/90 placeholder-gray-400`}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs animate-fadeInDown">{errors.email.message}</span>
                )}
              </div>

           {/* Password Input */}
      <div className="flex flex-col gap-1 group/password relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
          })}
          className={`p-3 rounded-md bg-[#2e2e3e]/80 backdrop-blur-sm border transition-all duration-300 ${
            errors.password
              ? "border-red-500 focus:border-red-500 focus:shadow-red-500/25"
              : "border-white/10 focus:border-purple-500 group-hover/password:border-purple-400/50 focus:shadow-purple-500/25"
          } focus:outline-none focus:shadow-lg hover:bg-[#2e2e3e]/90 placeholder-gray-400 pr-10`}
        />
        {/* Eye icon button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
          tabIndex={-1} // Prevent button from tab focusing if you want
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.password && (
          <span className="text-red-400 text-xs animate-fadeInDown">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="flex flex-col gap-1 group/confirm relative mt-4">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          className={`p-3 rounded-md bg-[#2e2e3e]/80 backdrop-blur-sm border transition-all duration-300 ${
            errors.confirmPassword
              ? "border-red-500 focus:border-red-500 focus:shadow-red-500/25"
              : "border-white/10 focus:border-purple-500 group-hover/confirm:border-purple-400/50 focus:shadow-purple-500/25"
          } focus:outline-none focus:shadow-lg hover:bg-[#2e2e3e]/90 placeholder-gray-400 pr-10`}
        />
        {/* Eye icon button */}
        <button
          type="button"
          onClick={() => setShowConfirm((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
          tabIndex={-1} // Prevent button from tab focusing if you want
        >
          {showConfirm ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.confirmPassword && (
          <span className="text-red-400 text-xs animate-fadeInDown">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

             {/* Google reCAPTCHA */}
            <div className="flex justify-center group/recaptcha z-10">
              <div className="relative z-10">
                {/* Decorative Glow (non-interactive) */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                                rounded-lg blur-lg opacity-0 group-hover/recaptcha:opacity-100 
                                transition-opacity duration-500 scale-110 pointer-events-none">
                </div>

                {/* Actual reCAPTCHA */}
                <ReCAPTCHA
                  sitekey="6Leko4MrAAAAAKY9UqRINDcmmhDj6oXd3TmxwEO0"
                  onChange={handleCaptchaChange}
                  ref={recaptchaRef}
                />
              </div>
            </div>


              {/* Enhanced submit button */}
              <div className="relative group/submit">
                {/* Button glow effect */}
                <div className={`absolute inset-0 rounded-full blur-lg transition-opacity duration-500 ${
                  isHuman && !isSubmitting
                    ? "bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] opacity-75 group-hover/submit:opacity-100 animate-pulse"
                    : "opacity-0"
                }`}></div>
                
                <button
                  type="submit"
                  disabled={!isHuman || isSubmitting}
                  className={`relative w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all duration-500 overflow-hidden ${
                    isHuman && !isSubmitting
                      ? "bg-gradient-to-r from-[#6366F1] via-[#9333EA] to-[#ec4899] hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 border border-white/20 group-hover/submit:border-white/40"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {/* Button shine effect */}
                  {isHuman && !isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/submit:translate-x-[-200%] transition-transform duration-1000"></div>
                  )}
                  
                  {isSubmitting ? (
                    <div className="relative z-10 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <span className="relative z-10">Sign Up</span>
                  )}
                </button>
              </div>
            </form>

            {/* Links */}
            <div className="mt-6 text-sm text-center text-gray-300 relative">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-purple-400 hover:text-pink-400 hover:underline transition-colors duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text hover:text-transparent">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;