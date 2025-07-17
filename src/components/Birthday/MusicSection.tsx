import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { Play, Pause, Heart, Music } from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  reason: string;
  isPlaying: boolean;
}

export function MusicSection() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);

  // Mock songs - in a real app, these would come from guest suggestions
  const songs: Song[] = [
    {
      id: 1,
      title: "Happy",
      artist: "Pharrell Williams",
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      reason: "Because your smile is as infectious as this song! 😊",
      isPlaying: false,
    },
    {
      id: 2,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      cover:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
      reason: "Your energy matches this song perfectly! 🎵",
      isPlaying: false,
    },
    {
      id: 3,
      title: "Levitating",
      artist: "Dua Lipa",
      cover:
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
      reason: "For all our dance parties together! 💃",
      isPlaying: false,
    },
    {
      id: 4,
      title: "Sunflower",
      artist: "Post Malone & Swae Lee",
      cover:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      reason: "You're like sunshine to all of us! 🌻",
      isPlaying: false,
    },
    {
      id: 5,
      title: "Can't Stop the Feeling!",
      artist: "Justin Timberlake",
      cover:
        "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=300&h=300&fit=crop",
      reason: "The way you make everyone feel! ✨",
      isPlaying: false,
    },
    {
      id: 6,
      title: "Count on Me",
      artist: "Bruno Mars",
      cover:
        "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=300&h=300&fit=crop",
      reason: "Because we can always count on you! 🤗",
      isPlaying: false,
    },
  ];

  const togglePlay = (songId: number) => {
    setCurrentlyPlaying(currentlyPlaying === songId ? null : songId);
  };

  // Animation variants
  const fadeInVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const slideInFromLeft = {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const slideInFromRight = {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  } as Variants;

  const staggerItemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        bounce: 0.2,
      },
    },
  } as Variants;

  const spotifyEmbedVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      rotateY: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        bounce: 0.1,
      },
    },
  } as Variants;

  const musicIconVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -90,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        bounce: 0.4,
      },
    },
  } as Variants;

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            variants={staggerContainerVariants}
          >
            <motion.div variants={musicIconVariants}>
              <Music className="text-pink-500 w-8 h-8" />
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
              variants={slideInFromLeft}
            >
              Songs That Remind Us of You
            </motion.h2>
            <motion.div
              variants={musicIconVariants}
              transition={{ delay: 0.2 }}
            >
              <Music className="text-purple-500 w-8 h-8" />
            </motion.div>
          </motion.div>
          <motion.p
            className="text-xl text-gray-600"
            variants={slideInFromRight}
            transition={{ delay: 0.3 }}
          >
            A playlist curated with love from all your friends
          </motion.p>
        </motion.div>

        {/* Spotify embed placeholder */}
        <motion.div
          className="mb-12"
          variants={spotifyEmbedVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-1 rounded-2xl">
            <div className="bg-white rounded-xl p-8 text-center">
              <motion.div
                className="bg-black text-white rounded-lg p-8 mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Music className="text-white w-8 h-8" />
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-xl font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      Sarah's Birthday Playlist
                    </motion.h3>
                    <motion.p
                      className="text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      Curated by your loving friends
                    </motion.p>
                  </div>
                </motion.div>
                <motion.p
                  className="text-green-400 mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  🎵 Available on Spotify
                </motion.p>
                <motion.button
                  className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Open in Spotify
                </motion.button>
              </motion.div>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                * In a real implementation, this would be a Spotify playlist
                embed
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Song cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
        >
          {songs.map((song) => (
            <motion.div
              key={song.id}
              variants={staggerItemVariants}
              className="relative group"
              whileHover={{
                scale: 1.03,
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-pink-200 overflow-hidden">
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />

                <div className="flex items-start gap-4 relative z-10">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.img
                      src={song.cover}
                      alt={`${song.title} cover`}
                      className="w-16 h-16 rounded-lg object-cover"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    />
                    <motion.button
                      onClick={() => togglePlay(song.id)}
                      className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {currentlyPlaying === song.id ? (
                        <Pause className="text-white w-6 h-6" />
                      ) : (
                        <Play className="text-white w-6 h-6 ml-1" />
                      )}
                    </motion.button>
                  </motion.div>

                  <div className="flex-1">
                    <motion.h4
                      className="font-semibold text-gray-800 mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      {song.title}
                    </motion.h4>
                    <motion.p
                      className="text-gray-600 text-sm mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      {song.artist}
                    </motion.p>
                    <motion.p
                      className="text-sm text-pink-600 italic"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      {song.reason}
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 0.6, scale: 1 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <Heart className="text-pink-500 w-5 h-5 transition-all" />
                  </motion.div>
                </div>

                {/* Playing indicator */}
                {currentlyPlaying === song.id && (
                  <motion.div
                    className="flex items-center gap-2 mt-4 text-pink-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-4 bg-pink-500 rounded-full"
                          animate={{
                            scaleY: [1, 2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    <motion.span
                      className="text-sm"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Now Playing
                    </motion.span>
                  </motion.div>
                )}

                {/* Floating musical notes */}
                {currentlyPlaying === song.id && (
                  <>
                    <motion.div
                      className="absolute -top-2 -right-2 text-pink-400 text-lg pointer-events-none"
                      animate={{
                        y: [-20, -40, -20],
                        x: [0, 10, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      🎵
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-2 -left-2 text-purple-400 text-sm pointer-events-none"
                      animate={{
                        y: [20, 0, 20],
                        x: [0, -10, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      🎶
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
