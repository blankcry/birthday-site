import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

interface Photo {
  id: number;
  url: string;
  caption: string;
  contributor: string;
  date: string;
  location?: string;
  type: "photo" | "video";
  duration?: string;
  thumbnail?: string;
}

export function PhotoGallery() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock photos and videos - in a real app, these would come from guest uploads
  const photos: Photo[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1000&fit=crop",
      caption: "Golden Hour Magic",
      contributor: "Emma Rodriguez",
      date: "2024",
      location: "Santa Monica Beach",
      type: "photo",
    },
    {
      id: 2,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      caption: "Birthday Dance Party",
      contributor: "Marcus Chen",
      date: "2024",
      location: "Malibu Hills",
      type: "video",
      duration: "2:15",
      thumbnail:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=1000&fit=crop",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=800&h=1000&fit=crop",
      caption: "Contagious Laughter",
      contributor: "Sarah Williams",
      date: "2024",
      location: "Central Park",
      type: "photo",
    },
    {
      id: 4,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      caption: "Adventure Highlights",
      contributor: "Alex Thompson",
      date: "2024",
      location: "Downtown LA",
      type: "video",
      duration: "1:45",
      thumbnail:
        "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800&h=1000&fit=crop",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&h=1000&fit=crop",
      caption: "Dancing Queen",
      contributor: "Maya Patel",
      date: "2024",
      location: "Rooftop Party",
      type: "photo",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop",
      caption: "Coffee Chronicles",
      contributor: "James Lee",
      date: "2024",
      location: "Venice Beach Café",
      type: "photo",
    },
  ];

  const currentPhoto = photos[currentPhotoIndex];
  const isCurrentVideo = currentPhoto.type === "video";

  useEffect(() => {
    if (videoRef.current && isCurrentVideo) {
      const video = videoRef.current;
      video.muted = isVideoMuted;

      const updateProgress = () => {
        if (video.duration) {
          setVideoProgress((video.currentTime / video.duration) * 100);
        }
      };

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("ended", () => setIsVideoPlaying(false));

      return () => {
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("ended", () => setIsVideoPlaying(false));
      };
    }
  }, [currentPhotoIndex, isVideoMuted, isCurrentVideo]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    setIsVideoPlaying(false);
    setVideoProgress(0);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setIsVideoPlaying(false);
    setVideoProgress(0);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current && isCurrentVideo) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleVideoMute = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  // Animation variants for scroll-triggered animations
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

  const slideInVariants = {
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

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  } as Variants;

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
            variants={slideInVariants}
          >
            Beautiful Memories
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600"
            variants={slideInVariants}
            transition={{ delay: 0.2 }}
          >
            A curated collection of moments that make us smile
          </motion.p>
        </motion.div>

        {/* Magazine-style layout */}
        <motion.div
          className="relative bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Photo/Video Section - Left Side */}
            <motion.div
              className="lg:w-2/3 relative overflow-hidden"
              variants={slideInVariants}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto.id}
                  className="relative h-full"
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {isCurrentVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={currentPhoto.url}
                        poster={currentPhoto.thumbnail}
                        className="w-full h-full object-cover"
                        muted={isVideoMuted}
                        onLoadedData={() => setVideoProgress(0)}
                      />

                      {/* Video controls overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                        {/* Central play/pause button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={toggleVideoPlay}
                            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group border-2 border-white/30"
                          >
                            {isVideoPlaying ? (
                              <Pause className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                            ) : (
                              <Play className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform" />
                            )}
                          </button>
                        </div>

                        {/* Bottom controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          {/* Progress bar */}
                          <div className="w-full bg-white/20 rounded-full h-1 mb-4">
                            <div
                              className="bg-white rounded-full h-1 transition-all duration-300"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>

                          {/* Control buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={toggleVideoPlay}
                                className="text-white hover:scale-110 transition-transform"
                              >
                                {isVideoPlaying ? (
                                  <Pause className="w-6 h-6" />
                                ) : (
                                  <Play className="w-6 h-6 ml-0.5" />
                                )}
                              </button>

                              <button
                                onClick={toggleVideoMute}
                                className="text-white hover:scale-110 transition-transform"
                              >
                                {isVideoMuted ? (
                                  <VolumeX className="w-6 h-6" />
                                ) : (
                                  <Volume2 className="w-6 h-6" />
                                )}
                              </button>
                            </div>

                            <div className="text-white text-sm">
                              {currentPhoto.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ImageWithFallback
                      src={currentPhoto.url}
                      alt={currentPhoto.caption}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Photo overlay gradient (only for photos) */}
                  {!isCurrentVideo && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-400/20" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prevPhoto}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>

            {/* Content Section - Right Side */}
            <motion.div
              className="lg:w-1/3 p-8 lg:p-12 flex flex-col justify-center relative"
              variants={slideInVariants}
              transition={{ delay: 0.5 }}
            >
              {/* Media type indicator */}
              <motion.div
                className="absolute top-6 right-6 lg:top-8 lg:right-8 flex items-center gap-2"
                variants={childVariants}
              >
                {isCurrentVideo && (
                  <div className="text-white/70 text-sm flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    VIDEO
                  </div>
                )}
                {!isCurrentVideo && (
                  <span className="text-white/70 text-sm tracking-widest">
                    PHOTO
                  </span>
                )}
              </motion.div>

              {/* Navigation indicators */}
              <motion.div
                className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-4 text-white/70 text-sm"
                variants={childVariants}
              >
                <span>
                  [ {String(currentPhotoIndex + 1).padStart(2, "0")} ]
                </span>
                <button
                  onClick={prevPhoto}
                  className="hover:text-white transition-colors"
                >
                  prev
                </button>
                <span>|</span>
                <button
                  onClick={nextPhoto}
                  className="hover:text-white transition-colors"
                >
                  next
                </button>
              </motion.div>

              {/* Main content */}
              <div className="text-white mt-16 lg:mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhoto.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <motion.p
                      className="text-sm tracking-widest mb-2 opacity-80"
                      variants={childVariants}
                    >
                      {currentPhoto.contributor}
                    </motion.p>

                    <motion.h1
                      className="text-3xl lg:text-4xl xl:text-5xl font-light mb-4 leading-tight"
                      // variants={childVariants}
                    >
                      {currentPhoto.caption.toUpperCase()}
                    </motion.h1>

                    <motion.p
                      className="text-lg opacity-90 mb-6"
                      // variants={childVariants}
                    >
                      {currentPhoto.date}
                      {isCurrentVideo && currentPhoto.duration && (
                        <span className="ml-3 text-sm opacity-70">
                          • {currentPhoto.duration}
                        </span>
                      )}
                    </motion.p>

                    {currentPhoto.location && (
                      <motion.p
                        className="text-sm opacity-70 mb-8"
                        // variants={childVariants}
                      >
                        📍 {currentPhoto.location}
                      </motion.p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Photo dots indicator */}
                <motion.div
                  className="flex gap-2 mb-6"
                  // variants={staggerChildrenVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {photos.map((_, index) => (
                    <motion.button
                      key={index}
                      // variants={childVariants}
                      onClick={() => {
                        setCurrentPhotoIndex(index);
                        setIsVideoPlaying(false);
                        setVideoProgress(0);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPhotoIndex
                          ? "bg-white scale-125"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </motion.div>

                {/* Like button */}
                <motion.button
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                  // variants={childVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Show Love</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Photo/Video thumbnails */}
        <motion.div
          className="mt-8 flex gap-4 justify-center overflow-x-auto pb-4"
          variants={staggerChildrenVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {photos.map((photo, index) => (
            <motion.button
              key={photo.id}
              variants={childVariants}
              onClick={() => {
                setCurrentPhotoIndex(index);
                setIsVideoPlaying(false);
                setVideoProgress(0);
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentPhotoIndex
                  ? "ring-2 ring-pink-500 scale-110"
                  : "opacity-70 hover:opacity-100"
              }`}
              whileHover={{ scale: index === currentPhotoIndex ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ImageWithFallback
                src={photo.thumbnail || photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />

              {/* Video indicator overlay */}
              {photo.type === "video" && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Duration badge for videos */}
              {photo.type === "video" && photo.duration && (
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                  {photo.duration}
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
