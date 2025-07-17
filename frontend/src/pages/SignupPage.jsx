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


const SignupPage = () => {
  const recaptchaRef = useRef(null);
  const [isHuman, setIsHuman] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">
            Create Your <span className="text-[#7c3aed]">ZUNO</span> Account
          </h2>

          {/* Google Sign-Up */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-full font-medium hover:scale-105 transition-transform mb-6 shadow-sm"
            onClick={handleGoogleSignUp}
          >
            <FcGoogle size={22} />
            Sign up with Google
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="w-full border-t border-gray-600"></div>
            <span className="px-3 text-sm text-gray-400">or</span>
            <div className="w-full border-t border-gray-600"></div>
          </div>

          {/* Manual Sign-Up Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Username Input */}
            <div className="flex flex-col gap-1">
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
                className={`p-3 rounded-md bg-[#2e2e3e] border transition-colors ${
                  errors.username 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-transparent focus:border-purple-500"
                } focus:outline-none`}
              />
              {errors.username && (
                <span className="text-red-400 text-sm">{errors.username.message}</span>
              )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1">
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
                className={`p-3 rounded-md bg-[#2e2e3e] border transition-colors ${
                  errors.email 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-transparent focus:border-purple-500"
                } focus:outline-none`}
              />
              {errors.email && (
                <span className="text-red-400 text-sm">{errors.email.message}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                  }
                })}
                className={`p-3 rounded-md bg-[#2e2e3e] border transition-colors ${
                  errors.password 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-transparent focus:border-purple-500"
                } focus:outline-none`}
              />
              {errors.password && (
                <span className="text-red-400 text-sm">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => 
                    value === password || "Passwords do not match"
                })}
                className={`p-3 rounded-md bg-[#2e2e3e] border transition-colors ${
                  errors.confirmPassword 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-transparent focus:border-purple-500"
                } focus:outline-none`}
              />
              {errors.confirmPassword && (
                <span className="text-red-400 text-sm">{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Google reCAPTCHA */}
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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-300">
            Already have an account?{" "}
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

export default SignupPage;