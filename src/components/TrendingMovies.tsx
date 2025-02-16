import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null); // ✅ Store YouTube video key

  // ✅ Fetch Trending Movies
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // ✅ Fetch Movie Trailer when Clicked
  const fetchTrailer = async (movieId: number) => {
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;
    try {
      const res = await fetch(trailerUrl);
      const data = await res.json();
      const trailer = data.results?.find(
        (video: any) => video.type === "Trailer"
      );

      if (trailer) {
        setVideoKey(trailer.key);
        setSelectedMovie(movieId);
      } else {
        alert("No trailer found for this movie!");
        setVideoKey(null);
        setSelectedMovie(null);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  return (
    <div className="w-full mt-12 px-4">
      {/* ✅ Section Title */}
      <h2 className="text-white text-3xl font-bold text-center mb-6">
        Trending Movies 🎬
      </h2>

      {/* ✅ Responsive Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie: any) => (
          <motion.div
            key={movie.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            onClick={() => fetchTrailer(movie.id)} // ✅ Fetch trailer on click
          >
            {/* ✅ Movie Image */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-64 object-cover rounded-lg transition duration-300 ease-in-out"
            />

            {/* ✅ Overlay for Movie Title */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white text-center font-semibold">
              {movie.title}
            </div>

            {/* ✅ Play Trailer when Clicked */}
            {selectedMovie === movie.id && videoKey && (
              <div className="absolute top-0 left-0 w-full h-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0`} // 🔊 Sound ON
                  allow="autoplay; encrypted-media"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
