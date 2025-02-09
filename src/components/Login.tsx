import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import TrendingMovies from "../components/TrendingMovies";
import { FaFilm } from "react-icons/fa";
import MissionStatement from "../components/MissionStatement";
import { auth, provider } from "../components/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { User } from "firebase/auth";

// Fetch API Key from .env
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;

console.log("API Key:", apiKey);
// console.log("Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);

const Login = () => {
  const [user, setUser] = useState<User | null>(null);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  // Handle Email/Password Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User logged in:", user);
      setUser(user);
    } catch (error: any) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6">
      {/* ✅ Movie Icon in Top-Left */}
      <div className="absolute top-5 left-5 flex items-center text-white text-2xl">
        <FaFilm className="text-yellow-400 mr-2" />{" "}
        <span className="font-bold">Lumeo</span>
      </div>

      {/* Animated Welcome Message */}
      <div className="text-center text-white mb-8">
        <motion.h1
          className="text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-cyan-300 drop-shadow-lg text-center"
          animate={{ scale: [1, 1.02, 1] }} // ✅ Smaller bounce effect
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} // ✅ Slower, smoother animation
        >
          Welcome to Lumeo
        </motion.h1>
        <p className="mt-2 text-lg text-gray-300 italic">
          Discover trending movies, TV shows, and entertainment at your
          fingertips.
        </p>
      </div>

      {/* ✅ Centered Login Card */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Login to Lumeo</h2>

        {user ? (
          <>
            <p className="text-white text-center">
              Welcome, {user.displayName}
            </p>
            <button
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 mb-3 bg-gray-700 text-white rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 mb-3 bg-gray-700 text-white rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
            </form>

            <button
              className="w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-4"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="mr-2 text-2xl" /> Sign in with Google
            </button>

            <p className="mt-4 text-center text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </>
        )}
      </div>

      {/* ✅ Trending Movies BELOW the login card */}
      <TrendingMovies />
    </div>
  );
};

export default Login;
