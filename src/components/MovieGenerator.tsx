import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilm } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Genre {
  id: number;
  name: string;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
const MOVIE_BY_GENRE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=`;

const MovieGenerator: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  // ✅ Fetch Movie Genres (On Load)
  useEffect(() => {
    fetch(GENRE_URL)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  // Handle Genre Selection (Max 5)
  const toggleGenreSelection = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else if (selectedGenres.length < 5) {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  // Fetch Movies Based on Selected Genres
  const fetchMoviesByGenres = async () => {
    if (selectedGenres.length !== 5) {
      alert("Please select exactly 5 genres to generate your movie list!");
      return;
    }

    try {
      const genreIds = selectedGenres.join(",");
      const res = await fetch(`${MOVIE_BY_GENRE_URL}${genreIds}`);
      const data = await res.json();

      if (data.results) {
        setMovies(data.results.slice(0, 10)); // ✅ Get top 10 movies
      } else {
        alert("No movies found. Try again later.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Handle Email Submission
  const sendEmail = async () => {
    if (!email) {
      alert("Please enter your email to receive the list.");
      return;
    }

    try {
      const response = await fetch("/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, movies }),
      });

      if (response.ok) {
        alert("✅ Your movie list has been emailed to you!");
      } else {
        alert(" Failed to send email. Try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-center">
        🎬 Select Your Top 5 Favorite Genres
      </h2>
      <p className="text-gray-600 text-center mt-2">
        Pick 5 genres and we'll generate 10 trending movies just for you!
      </p>

      {/* ✅ Genre Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`p-3 rounded-md font-semibold ${
              selectedGenres.includes(genre.id)
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-black"
            } transition-all duration-300`}
            onClick={() => toggleGenreSelection(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* ✅ Generate Button */}
      <button
        onClick={fetchMoviesByGenres}
        disabled={selectedGenres.length < 5}
        className={`mt-6 py-2 px-4 rounded-md font-bold text-white ${
          selectedGenres.length === 5
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-gray-400 cursor-not-allowed"
        } transition-all duration-300`}
      >
        🎥 Generate My Movies
      </button>

      {/* ✅ Display Movies After Selection */}
      {movies.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-orange-500 text-center">
            🎬 Your Top 10 Movie Picks
          </h2>
          <ul className="list-decimal list-inside text-center mt-4">
            {movies.map((movie) => (
              <li key={movie.id} className="mt-2 font-semibold">
                {movie.title}
              </li>
            ))}
          </ul>

          {/* ✅ Email Input */}
          <div className="mt-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-md text-black"
            />
            <button
              onClick={sendEmail}
              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              📩 Email Me the List
            </button>
          </div>
        </div>
      )}

      {/* ✅ Back to Main Page Button */}
      <button
        onClick={() => navigate("/main")}
        className="mt-8 text-blue-500 hover:underline"
      >
        ← Back to Main Page
      </button>
      <footer className="w-full bg-white-80 text-white py-6 mt-24 relative z-10">
        <div className="container mx-auto flex flex-col items-center">
          {/* ✅ Lumeo Logo & Name */}
          <div className="flex items-center text-gray-400 text-2xl font-bold mb-4">
            <FaFilm className="mr-2" />
            <span>Lumeo</span>
          </div>

          <p className="text-gray-400 text-sm text-center mb-4">
            © {new Date().getFullYear()} Lumeo. All rights reserved.
          </p>

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

export default MovieGenerator;
