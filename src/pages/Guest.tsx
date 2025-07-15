/* eslint-disable react-refresh/only-export-components */
import { useState, createContext } from "react";
import PlaylistSection from "@/components/Guest/PlaylistSection";
import PhotoUploadSection from "@/components/Guest/PhotoUploadSection";
import GallerySection from "@/components/Guest/GallerySection";
import { AnimatePresence, motion } from "framer-motion";

// Combined context for contributor name and gallery refresh
export const GuestContext = createContext<{
  name: string;
  refreshGallery: () => void;
  galleryRefresh: number;
}>({ name: "", refreshGallery: () => {}, galleryRefresh: 0 });

function Guest() {
  const [contributorName, setContributorName] = useState("");
  const [input, setInput] = useState("");
  const [galleryRefresh, setGalleryRefresh] = useState(0);
  const refreshGallery = () => setGalleryRefresh((r) => r + 1);

  return (
    <AnimatePresence mode="wait">
      {!contributorName ? (
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen w-full bg-gradient-to-br from-pink-300 via-pink-50 to-pink-500 flex flex-col items-center justify-center"
        >
          <div className="bg-white/80 rounded-2xl shadow-lg p-8 border border-pink-100 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-pink-700">
              Enter your name to contribute
            </h2>
            <input
              className="w-64 rounded-xl border border-pink-200 bg-pink-50 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-200 text-center"
              placeholder="Your Name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim())
                  setContributorName(input.trim());
              }}
            />
            <button
              className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-6 py-2 rounded-full shadow transition"
              disabled={!input.trim()}
              onClick={() => setContributorName(input.trim())}
            >
              Continue
            </button>
          </div>
        </motion.div>
      ) : (
        <GuestContext.Provider value={{ name: contributorName, refreshGallery, galleryRefresh }}>
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-h-screen bg-gradient-to-br from-pink-300 via-pink-50 to-pink-500 flex flex-col items-center px-6 md:px-12 lg:px-36"
          >
            <span className="text-xl md:text-4xl font-extrabold text-center text-[#2d1a2d] mt-4 w-full">
              Help make Preci’s day special!
            </span>
            <p className="text-center text-base md:text-lg text-[#6e4a7e] mb-8">
              Share your favorite memories, photos, and songs to make Preci’s
              birthday unforgettable.
            </p>
            <PhotoUploadSection />
            <PlaylistSection />
            <GallerySection />
          </motion.div>
        </GuestContext.Provider>
      )}
    </AnimatePresence>
  );
}

export default Guest;
