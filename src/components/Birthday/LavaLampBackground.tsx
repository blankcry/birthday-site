import { motion } from 'framer-motion';

export function LavaLampBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-peach-50" />
      
      {/* Lava blobs */}
      <div className="lava-blob lava-blob-1" />
      <div className="lava-blob lava-blob-2" />
      <div className="lava-blob lava-blob-3" />
      <div className="lava-blob lava-blob-4" />
      <div className="lava-blob lava-blob-5" />
      
      {/* Floating hearts */}
      <motion.div
        className="floating-heart"
        style={{ top: '20%', left: '15%' }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        💖
      </motion.div>
      
      <motion.div
        className="floating-heart"
        style={{ top: '70%', right: '25%' }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        💕
      </motion.div>
      
      <motion.div
        className="floating-heart"
        style={{ top: '45%', left: '70%' }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        💗
      </motion.div>
      
      {/* Floating sparkles */}
      <motion.div
        className="floating-sparkle"
        style={{ top: '30%', left: '80%' }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ✨
      </motion.div>
      
      <motion.div
        className="floating-sparkle"
        style={{ top: '60%', left: '20%' }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        ⭐
      </motion.div>
      
      <motion.div
        className="floating-sparkle"
        style={{ top: '80%', right: '40%' }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        ✨
      </motion.div>
    </div>
  );
}