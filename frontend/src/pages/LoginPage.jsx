import React, { useState, useRef } from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { FcGoogle } from "react-icons/fc";
import ReCAPTCHA from "react-google-recaptcha";
import { auth, provider } from "../firebase/firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const recaptchaRef = useRef(null);
  const [isHuman, setIsHuman] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const handleCaptchaChange = (value) => {
    setIsHuman(!!value);
    if (value) {
      setError(''); // Clear error when reCAPTCHA is completed
    }
  };

  const onSubmit = async (data) => {
    // Clear any previous errors
    setError('');
    
    // Validate reCAPTCHA
    if (!isHuman) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the reCAPTCHA token
      const recaptchaToken = recaptchaRef.current.getValue();
      
      // Log the request data for debugging
      console.log('Attempting login with:', {
        email: data.email,
        hasPassword: !!data.password,
        hasRecaptchaToken: !!recaptchaToken
      });
      
      const response = await axios.post("http://localhost:3000/api/v1/users/login", {
        email: data.email,
        password: data.password,
        recaptchaToken: recaptchaToken
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      
      // Check if the request was successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Handle different possible response structures
        const responseData = response.data.data || {}; // 👈 because actual token is in response.data.data

        const token = responseData.token;
        const user = responseData.user;
        
        
        if (token) {
          // Store authentication data
          localStorage.setItem('token', token);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          // Reset form
          reset();
          
          // Reset reCAPTCHA
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
          setIsHuman(false);
          
          // Show success message
          // alert("Login successful!");
          console.log("Redirecting to /home with token:", localStorage.getItem('token'));
          navigate("/home");
          
          
          // Redirect to dashboard or home page
          // window.location.href = "/dashboard";
        } else {
          // Success response but no token found
          console.log('Success response but no token found. Response structure:', responseData);
          
          // Check if it's just a success message without token
          if (responseData.success || responseData.message === 'Login successful' || responseData.status === 'success') {
            alert("Login successful!");
            reset();
            if (recaptchaRef.current) {
              recaptchaRef.current.reset();
            }
            setIsHuman(false);
            // You might want to redirect even without a token, depending on your auth flow
            // window.location.href = "/dashboard";
          } else {
            setError("Login successful but no authentication token received. Please contact support.");
          }
        }
      } else {
        setError(`Login failed with status ${response.status}. Please try again.`);
      }
      
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      });
      
      // Handle different types of errors
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Please check if the backend is running on http://localhost:3000");
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid request. Please check your input.");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Login failed: ${err.message || 'Unknown error'}`);
      }
      
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setIsHuman(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
  
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const response = await axios.post("http://localhost:3000/api/v1/users/google-login", {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL
      });
  
      const accessToken = response.data?.data?.accessToken;
  
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(response.data?.data?.user));
  
        // alert("Signed in successfully!");
        navigate("/home");
        // window.location.href = "/dashboard";
      } else {
        setError("Google Sign-In failed. Please try again.");
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else if (error.response) {
        setError(error.response.data.message || "Google Sign-In failed. Please try again.");
      } else {
        setError("Google Sign-In failed. Please try again.");
      }
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
                  Login to 
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x ml-2">
                  ZUNO
                </span>
              </h2>
              
              {/* Decorative sparkle */}
              <div className="absolute -top-2 right-1/4 opacity-60">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm backdrop-blur-sm animate-fadeInDown">
                {error}
              </div>
            )}

            {/* Google Sign-In */}
            <div className="relative group/google mb-6">
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-200/20 rounded-full blur-lg opacity-0 group-hover/google:opacity-100 transition-opacity duration-500"></div>
              
              <button
                type="button"
                className="relative w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-full font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 group-hover/google:border-gray-300 overflow-hidden"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover/google:translate-x-[-200%] transition-transform duration-1000"></div>
                
                <FcGoogle size={22} className="relative z-10" />
                <span className="relative z-10">Sign in with Google</span>
              </button>
            </div>

            {/* Enhanced divider */}
            <div className="flex items-center justify-between mb-6 relative">
              <div className="w-full border-t border-gradient-to-r from-transparent via-gray-600 to-gray-600"></div>
              <span className="px-3 text-sm text-gray-400 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full py-1 backdrop-blur-sm border border-white/10">or</span>
              <div className="w-full border-t border-gradient-to-r from-gray-600 to-transparent"></div>
            </div>

            {/* Email/Password Login */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="flex flex-col gap-1 group/email">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  className={`p-3 rounded-md bg-[#2e2e3e]/80 backdrop-blur-sm border transition-all duration-300 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:shadow-red-500/25"
                      : "border-white/10 focus:border-purple-500 group-hover/email:border-purple-400/50 focus:shadow-purple-500/25"
                  } focus:outline-none focus:shadow-lg hover:bg-[#2e2e3e]/90 placeholder-gray-400`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs">{errors.email.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1 group/password">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long"
                    }
                  })}
                  className={`p-3 rounded-md bg-[#2e2e3e]/80 backdrop-blur-sm border transition-all duration-300 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:shadow-red-500/25"
                      : "border-white/10 focus:border-purple-500 group-hover/password:border-purple-400/50 focus:shadow-purple-500/25"
                  } focus:outline-none focus:shadow-lg hover:bg-[#2e2e3e]/90 placeholder-gray-400`}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <span className="text-red-400 text-xs">{errors.password.message}</span>
                )}
              </div>

              {/* reCAPTCHA Box */}
              <div className="flex justify-center group/recaptcha z-10">
                <div className="relative z-10">
                  {/* Glow effect behind reCAPTCHA */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur-lg opacity-0 group-hover/recaptcha:opacity-100 transition-opacity duration-500 scale-110 pointer-events-none"></div>
                  
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="relative z-10 flex items-center gap-2">
                      Login
                      <LogIn size={18} />
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Links */}
            <div className="mt-6 text-sm text-center space-y-2 text-gray-300 relative">
              <p>
                <Link to="/forgot-password" className="text-purple-400 hover:text-pink-400 hover:underline transition-colors duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text hover:text-transparent">
                  Forgot Password?
                </Link>
              </p>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-400 hover:text-pink-400 hover:underline transition-colors duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text hover:text-transparent">
                  Sign Up
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

export default LoginPage;