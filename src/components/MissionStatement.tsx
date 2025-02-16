import { motion } from "framer-motion";

// Mission Statement Sentences (Splitting into Parts)
const missionStatements = [
  "Discover trending movies, TV shows, and entertainment at your fingertips.",
  "Enjoy high-quality previews, explore upcoming releases, and dive into the world of cinema like never before!",
  "Stay updated with the latest in the world of entertainment, all in one place!",
];

const MissionStatement = () => {
  return (
    <div className="overflow-hidden w-full text-center">
      {missionStatements.map((sentence, index) => (
        <motion.p
          key={index}
          className="text-lg italic text-yellow-400 w-full"
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 6 + index * 2,
            ease: "linear",
          }}
        >
          {sentence}
        </motion.p>
      ))}
    </div>
  );
};

export default MissionStatement;
