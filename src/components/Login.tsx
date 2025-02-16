import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFilm } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import TrendingMovies from "../components/TrendingMovies";
import { auth, provider } from "../components/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

const Login = () => {
  const [user, setUser] = useState<User | null>(null);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [background, setBackground] = useState<string | null>(null);
  const navigate = useNavigate();
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
      setUser(userCredential.user);
      setWelcomePopup(true);
      setTimeout(() => navigate("/main"), 3000);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password. Try again!");
    }
  };

  //  Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setWelcomePopup(true);
      setTimeout(() => navigate("/main"), 2500);
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  // ✅ Fetch Movie Background (Runs Once on Page Load)
  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          let randomMovie;
          do {
            randomMovie =
              data.results[Math.floor(Math.random() * data.results.length)];
          } while (!randomMovie.backdrop_path); // ✅ Ensure it has a backdrop

          setBackground(BACKDROP_URL + randomMovie.backdrop_path);
        } else {
          setBackground("/default-background.jpg"); // ✅ Set a fallback image
        }
      } catch (error) {
        console.error("Error fetching background:", error);
        setBackground("/default-background.jpg"); // ✅ Use fallback if fetch fails
      }
    };

    fetchBackground();
  }, []);

  // ✅ Handle Authentication State

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser && window.location.pathname === "/") {
        if (!welcomePopup) {
          setWelcomePopup(true);

          // ✅ Ensure the popup stays for 8 seconds before navigating
          setTimeout(() => {
            setWelcomePopup(false); // Hide popup after duration
            if (window.location.pathname === "/main") {
              navigate("/main");
            }
          }, 15000);
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigate, welcomePopup]);
  // ✅ Pop-up Message

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-gray-900"
      style={{
        backgroundImage: background ? `url(${background})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background 1s ease-in-out",
      }}
    >
      {welcomePopup && (
        <motion.div
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-4 rounded-lg shadow-lg text-center w-fit mx-auto mt-6"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3 }}
        >
          🎉 Hi {user?.displayName || "User"}, Thanks for joining Lumeo!
        </motion.div>
      )}
      {/* ✅ Dark Overlay for Better Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* ✅ Lumeo Logo (Positioned at the Top Left) */}
      <div className="absolute top-5 left-5 flex items-center text-white text-2xl z-10">
        <FaFilm className="text-yellow-400 mr-2 hover:bg-gray-700 transition" />{" "}
        <span className="font-bold">Lumeo</span>
      </div>

      {/* ✅ Welcome Popup - Only Shows If welcomePopup is true */}
      {welcomePopup && (
        <motion.div
          className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-4 rounded-lg shadow-lg text-center w-fit mx-auto mt-6 z-50"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 8 }}
        >
          🎉 Hi {user?.displayName || "User"}, Thanks for joining Lumeo!
        </motion.div>
      )}

      {/* ✅ Welcome to Lumeo - Styled Header */}
      <div className="text-center text-white mb-8">
        {/* ✅ Welcome Title - Subtle Scaling Effect */}
        <motion.h1
          className="mt-16 md:mt-20 text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl font-extrabold text-white drop-shadow-lg text-center"
          animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ repeat: 1, duration: 3, ease: "easeInOut" }}
        >
          Welcome to Lumeo 🎬
        </motion.h1>

        {/* ✅ Mission Statement - Responsive Sliding Text Box */}

        <div className="relative w-full max-w-2xl px-4 sm:px-6 md:px-8 p-6 rounded-lg shadow-lg mx-auto mb-10 bg-gray-900 overflow-hidden h-auto sm:h-56 md:h-64 lg:h-72 border border-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95 cursor-pointer ">
          <motion.div
            className="h-full flex flex-col space-y-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.p
              className="text-white text-lg font-bold italic text-center"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
              whileHover={{ scale: 1.06, color: "#00bfff" }}
            >
              🎥 Experience the magic of cinema from your home.
            </motion.p>

            <motion.p
              className="text-blue-400 text-lg font-bold italic text-center"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeOut", delay: 1 }}
              whileHover={{ scale: 1.06, color: "#ffcc00" }}
            >
              🍿 Discover, Watch, and Enjoy top trending movies.
            </motion.p>

            <motion.p
              className="text-white text-lg font-bold italic text-center"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
              whileHover={{ scale: 1.06, color: "#ff4500" }}
            >
              📺 Your personal movie hub, tailored to your preferences.
            </motion.p>

            <motion.p
              className="text-blue-400 text-lg font-bold italic text-center"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeOut", delay: 2 }}
              whileHover={{ scale: 1.06, color: "#32cd32" }}
            >
              🌟 Exclusive content and personalized recommendations await!
            </motion.p>
          </motion.div>
        </div>
      </div>
      {/* ✅ Login Card (Centered on Screen) */}
      <motion.div
        className="relative bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300 hover:border-yellow-500 transition-all duration-300 z-10"
        whileHover={{ scale: 1.04 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login to Lumeo
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* ✅ Google Login */}
        <button
          className="w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-4"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="mr-2 text-2xl" /> Sign in with Google
        </button>

        {/* ✅ Google Sign-Up (Same as Google Login) */}
        <p className="mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>

      {/* ✅ Trending Movies BELOW the login card */}
      <TrendingMovies />

      {/* ✅ Footer Section */}
      <footer className="w-full bg-white-80 text-white py-6 mt-24 relative z-10">
        <div className="container mx-auto flex flex-col items-center">
          {/* ✅ Lumeo Logo & Name */}
          <div className="flex items-center text-gray-400 text-2xl font-bold mb-4">
            <FaFilm className="mr-2" />
            <span>Lumeo</span>
          </div>

          {/* ✅ "All Rights Reserved" Text */}
          <p className="text-gray-400 text-sm text-center mb-4">
            © {new Date().getFullYear()} Lumeo. All rights reserved.
          </p>

          {/* ✅ Social Media Icons (Fixed Color) */}
          <div className="flex space-x-6 text-white">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition text-xl"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition text-xl"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>

            {/* ✅ Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition text-xl"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
