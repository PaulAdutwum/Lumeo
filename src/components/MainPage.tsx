import React, { useState, useEffect } from "react";
import { auth } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaFilm } from "react-icons/fa";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faFacebook,
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
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
const MOVIE_BY_GENRE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=`;
const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  //const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  // ✅ Fetch All Movies (Trending)
  const handleAllMoviesClick = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching all movies:", error);
    }
  };

  // ✅ Fetch Movie Genres
  useEffect(() => {
    fetch(GENRE_URL)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  // ✅ Fetch Trending Movies (On Load)
  useEffect(() => {
    fetch(TRENDING_MOVIES_URL)
      .then((res) => res.json())
      .then((data) => setMovies(data.results))
      .catch((error) =>
        console.error("Error fetching trending movies:", error)
      );
  }, []);

  // ✅ Fetch Movies by Genre
  const handleGenreClick = async (genreId: number) => {
    setSelectedGenre(genreId);
    try {
      const res = await fetch(`${MOVIE_BY_GENRE_URL}${genreId}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
    }
  };

  // ✅ Fetch Movie Trailer
  const fetchTrailer = async (movieId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (video: any) => video.type === "Trailer"
      );

      if (trailer) {
        setTrailerKey(trailer.key);
        setIsPlayerOpen(true);
      } else {
        alert("No trailer available for this movie.");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  // ✅ Fetch Movies Based on Search Term (With Autocomplete)
  const handleSearch = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const res = await fetch(`${SEARCH_URL}${searchTerm}`);
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
  };
  {
    /* ✅ Movie Trailer Popup */
  }
  {
    isPlayerOpen && trailerKey && (
      <div
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-80 z-50"
        onClick={() => setIsPlayerOpen(false)} // ✅ Close on background click
      >
        <div
          className="relative w-[90%] md:w-[70%] lg:w-[50%]"
          onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking the player
        >
          <button
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            onClick={() => setIsPlayerOpen(false)}
          >
            <FaTimes size={20} />
          </button>
          <YouTube
            videoId={trailerKey}
            opts={{
              width: "100%",
              height: "400px",
              playerVars: { autoplay: 1 },
            }}
          />
        </div>
      </div>
    );
  }

  // ✅ Search Autocomplete (Fetch Suggestions)
  useEffect(() => {
    fetch(GENRE_URL)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || [])) // Ensure genres are set
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetch(`${SEARCH_URL}${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data.results || []))
        .catch((error) =>
          console.error("Error fetching search suggestions:", error)
        );
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // ✅ Logout & Redirect
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/", { replace: true }); // ✅ Prevents auto-redirect back
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* ✅ Movie Trailer Popup */}
      {isPlayerOpen && trailerKey && (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="relative w-[90%] md:w-[70%] lg:w-[50%]">
            <button
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              onClick={() => setIsPlayerOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <YouTube
              videoId={trailerKey}
              opts={{
                width: "100%",
                height: "400px",
                playerVars: { autoplay: 1 },
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ Sidebar */}
      {/* Sidebar */}
      <aside className="flex flex-col top-0 left-0 bg-black p-4 z-20 transition-transform duration-300 md:h-auto w-64 border-r-2 border-gray-600 shadow-lg">
        <div className="flex flex-col h-full">
          {/* ✅ Lumeo Logo */}
          <div className="flex items-center text-yellow-400 text-xl mb-4">
            <FaFilm className="mr-2" />
            <span className="font-bold">Lumeo</span>
          </div>

          {/* ✅ All Movies Button */}
          <button
            className="w-full text-left p-2 hover:text-yellow-400 transition-all"
            onClick={handleAllMoviesClick}
          >
            🎬 All Movies
          </button>

          {/* ✅ Genre List (Now in a div for spacing control) */}
          {/* ✅ Genre List (Now using selectedGenre for highlighting) */}
          <div className="flex flex-col space-y-2 mt-2 flex-grow overflow-y-auto">
            {genres.length > 0 ? (
              genres.map((genre) => (
                <button
                  key={genre.id}
                  className={`w-full text-left p-2 transition-all ${
                    selectedGenre === genre.id
                      ? "text-yellow-400 font-bold bg-gray-800 rounded-md"
                      : "hover:text-yellow-400"
                  }`}
                  onClick={() => handleGenreClick(genre.id)}
                >
                  {genre.name}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center">
                Loading genres...
              </p>
            )}
          </div>

          {/* ✅ Display Selected Genre Above Movies List */}
          {selectedGenre && (
            <h3 className="text-xl font-semibold text-yellow-400 text-center my-4">
              🎬 Showing Movies for:{" "}
              {genres.find((g) => g.id === selectedGenre)?.name ||
                "Unknown Genre"}
            </h3>
          )}

          {/* ✅ Add Extra Space Before "Generate Movie List" */}
          <div className="mt-8">
            <Link to="/generate-movies">
              <button className="w-full text-left p-3 font-bold bg-blue-500 text-white rounded-md hover:bg-orange-600 transition-all">
                🎥 Generate Movie List
              </button>
            </Link>
          </div>

          {/* ✅ Fun Movie Suggestion Feature (New Feature at the Bottom) */}
          <div className="mt-6 bg-gray-800 text-white p-3 rounded-lg text-center shadow-md">
            <h3 className="text-sm font-semibold">🎥 Movie Pick of the Day</h3>
            <p className="text-xs italic text-gray-300">
              "
              {movies.length > 0
                ? movies[Math.floor(Math.random() * movies.length)].title
                : "Loading..."}
              "
            </p>
          </div>

          {/* ✅ Add More Space Before Logout Button */}
          <div className="mt-8">
            <button
              className="text-red-500 hover:text-red-700 transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ✅ Main Content */}

      <div className="flex-1 p-6">
        {/* ✅ Search Bar with Autocomplete */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">🎬 Explore Movies</h2>
          <button
            onClick={() => navigate("/")}
            className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
          >
            🏠 Home
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex space-x-2 mb-6">
          <input
            type="text"
            className="w-full p-3 bg-gray-700 rounded-md text-white hover:"
            placeholder="Search Movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-blue-600 px-5 py-3 rounded-md hover:bg-blue-700 transition-all"
            onClick={handleSearch}
          >
            Search
          </button>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-gray-800 rounded-md mt-1 max-h-40 overflow-y-auto">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => fetchTrailer(movie.id)}
                >
                  {movie.title}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Display Movies */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="relative cursor-pointer group"
                onClick={() => fetchTrailer(movie.id)}
              >
                {/* Movie Poster */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="w-full h-64 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  alt={movie.title}
                />

                {/* Movie Title - Now always visible & changes color on hover */}
                <div className="bg-gray-800 p-2 rounded-b-lg text-center">
                  <span className="text-white font-semibold group-hover:text-yellow-400 transition duration-300">
                    {movie.title}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-2 md:col-span-4">
              No movies found. Try searching for something else!
            </p>
          )}
        </div>
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

        {/* ✅ Movies List */}
      </div>
    </div>
  );
};

export default MainPage;
