import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { supabase } from "@/api/supabaseClient";
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
import { isVideo, unslugify } from "@/util";

interface GalleryItem {
  id: number;
  photo_url: string;
  caption: string;
  name: string;
}


export function PhotoGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    supabase
      .from("guest_uploads")
      .select("id, photo_url, caption, name")
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setGallery(data);
      });
  }, []);

  const currentItem = gallery[currentIndex];
  const isCurrentVideo = currentItem && isVideo(currentItem.photo_url);

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
  }, [currentIndex, isVideoMuted, isCurrentVideo]);

  const next = () => {
    setCurrentIndex((prev) =>
      gallery.length ? (prev + 1) % gallery.length : 0
    );
    setIsVideoPlaying(false);
    setVideoProgress(0);
  };
  const prev = () => {
    setCurrentIndex((prev) =>
      gallery.length ? (prev - 1 + gallery.length) % gallery.length : 0
    );
    setIsVideoPlaying(false);
    setVideoProgress(0);
  };
  const toggleVideoPlay = () => {
    if (videoRef.current && isCurrentVideo) {
      if (isVideoPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  const toggleVideoMute = () => setIsVideoMuted((m) => !m);

  // Animation variants (unchanged)
  const fadeInVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as Variants;
  const slideInVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as Variants;
  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };
  const childVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as Variants;

  if (!gallery.length) {
    return (
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 py-32">
          Loading gallery…
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Section Header */}
        <motion.div
          className="text-center"
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
        {/* Main Gallery Layout */}
        <motion.div
          className="relative bg-gradient-to-r from-pink-500 via-pink-300 to-purple-300 rounded-3xl overflow-hidden shadow-2xl"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Media Section */}
            <motion.div
              className="lg:w-2/3 relative overflow-hidden flex items-center justify-center"
              variants={slideInVariants}
              transition={{ delay: 0.3 }}
            >
              <div
                className="w-full flex items-center justify-center"
                style={{
                  aspectRatio: "9/16",
                  maxHeight: "80vh",
                  minHeight: "400px",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItem.id}
                    className="relative w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {isCurrentVideo ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <video
                          ref={videoRef}
                          src={currentItem.photo_url}
                          className="w-full h-full object-contain bg-black rounded-2xl"
                          muted={isVideoMuted}
                          autoPlay
                          onLoadedData={() => setVideoProgress(0)}
                          style={{
                            aspectRatio: "9/16",
                            maxHeight: "100%",
                            maxWidth: "100%",
                          }}
                        />
                        {/* Video controls overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        {/* Controls (unchanged) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
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
                        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
                          <div className="w-full bg-white/20 rounded-full h-1 mb-4">
                            <div
                              className="bg-white rounded-full h-1 transition-all duration-300"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>
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
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={currentItem.photo_url}
                        alt={currentItem.caption}
                        className="w-full h-full object-contain bg-black rounded-2xl"
                        style={{
                          aspectRatio: "9/16",
                          maxHeight: "100%",
                          maxWidth: "100%",
                        }}
                      />
                    )}
                    {/* Photo overlay gradient (only for photos) */}
                    {!isCurrentVideo && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-purple-400/20 pointer-events-none" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Navigation arrows (unchanged) */}
              <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
            {/* Content Section */}
            <motion.div
              className="lg:w-1/3 p-8 relative flex flex-col gap-4 text-white"
              variants={slideInVariants}
              transition={{ delay: 0.5 }}
            >
              {/* Main content */}
              <motion.button
                className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg italic">
                  ~ {unslugify(currentItem.name)}
                </span>
              </motion.button>
              <AnimatePresence mode="wait">
                <div className="flex-1">
                  <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <motion.h1 className="text-2xl font-light leading-tight break-words w-full text-white">
                      {currentItem.caption}
                    </motion.h1>
                  </motion.div>
                </div>
              </AnimatePresence>
              {/* Photo dots indicator */}
              <motion.div
                className="flex gap-2 justify-center w-full flex-end"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {gallery.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsVideoPlaying(false);
                      setVideoProgress(0);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-white scale-125"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </motion.div>
              {/* Like button */}
            </motion.div>
          </div>
        </motion.div>
        {/* Thumbnails */}
        <motion.div
          className="flex gap-4 justify-center overflow-x-auto"
          variants={staggerChildrenVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {gallery.map((item, index) => (
            <motion.button
              key={item.id}
              variants={childVariants}
              onClick={() => {
                setCurrentIndex(index);
                setIsVideoPlaying(false);
                setVideoProgress(0);
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-2 ring-pink-500 scale-110"
                  : "opacity-70 hover:opacity-100"
              }`}
              whileHover={{ scale: index === currentIndex ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ImageWithFallback
                src={item.photo_url}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
              {isVideo(item.photo_url) && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
