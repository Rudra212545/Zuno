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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e]">
      <Navbar2 />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-[#1c1c2e] rounded-3xl shadow-2xl p-10 max-w-md w-full text-[#e4e4e7] transition-all duration-300">
          {/* Animated Logo */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] rounded-full p-4 shadow-xl animate-bounce">
              <FontAwesomeIcon icon={faHeadset} className="text-4xl text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Login to <span className="text-[#7c3aed]">ZUNO</span></h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-full font-medium hover:scale-105 transition-transform mb-6 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <FcGoogle size={22} />
            Sign in with Google
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="w-full border-t border-gray-600"></div>
            <span className="px-3 text-sm text-gray-400">or</span>
            <div className="w-full border-t border-gray-600"></div>
          </div>

          {/* Email/Password Login */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="flex flex-col gap-1">
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
                className={`p-3 rounded-md bg-[#2e2e3e] border transition-colors ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent focus:border-purple-500"
                } focus:outline-none`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="text-red-400 text-sm">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
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
                className={`p-3 rounded-md bg-[#2e2e3e] border transition-colors ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent focus:border-purple-500"
                } focus:outline-none`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="text-red-400 text-sm">{errors.password.message}</span>
              )}
            </div>

            {/* reCAPTCHA Box */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6Leko4MrAAAAAKY9UqRINDcmmhDj6oXd3TmxwEO0"
                onChange={handleCaptchaChange}
                ref={recaptchaRef}
              />
            </div>

            <button
              type="submit"
              disabled={!isHuman || isSubmitting}
              className={`flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-transform ${
                isHuman && !isSubmitting
                  ? "bg-gradient-to-r from-[#6366F1] to-[#9333EA] hover:scale-105"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-sm text-center space-y-2 text-gray-300">
            <p>
              <Link to="/forgot-password" className="text-[#7c3aed] hover:underline">
                Forgot Password?
              </Link>
            </p>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#7c3aed] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;