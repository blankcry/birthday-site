import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "./ImageWithFallback";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
}

export function HeroSection({ id }: { id?: string } = {}) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [storyStep, setStoryStep] = useState(0);

  useEffect(() => {
    // Trigger confetti animation on mount
    const timer = setTimeout(() => {
      setShowConfetti(true);
      generateConfetti();
    }, 3000); // Delay to let story unfold first

    // Story progression
    const storyTimers = [
      setTimeout(() => setStoryStep(1), 800), // Photo appears
      setTimeout(() => setStoryStep(2), 1600), // Title appears
      setTimeout(() => setStoryStep(3), 2400), // Subtitle appears
      setTimeout(() => setStoryStep(4), 3200), // Quote appears
      setTimeout(() => setStoryStep(5), 4000), // Button appears
    ];

    return () => {
      clearTimeout(timer);
      storyTimers.forEach(clearTimeout);
    };
  }, []);

  const generateConfetti = () => {
    const colors = ["#f472b6", "#a855f7", "#fb923c", "#ec4899", "#8b5cf6"];
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      });
    }

    setConfetti(pieces);
  };

  // Story-like animation variants
  const storyVariants = {
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
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        bounce: 0.3,
      },
    },
  } as Variants;

  const textSlideVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      blur: 10,
    },
    visible: {
      opacity: 1,
      x: 0,
      blur: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const quoteVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotate: -2,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  } as Variants;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden"
      id={id}
    >
      {/* Confetti */}
      {showConfetti &&
        confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute pointer-events-none z-20 -top-28 -left-28"
            style={{
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              borderRadius: "2px",
            }}
            initial={{
              x: piece.x,
              y: piece.y,
              rotate: piece.rotation,
              animationDirection: "alternate",
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: piece.rotation + 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              ease: "easeOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

      {/* Animated Balloons */}
      <motion.div
        className="absolute top-20 left-10 text-[80px] z-10"
        initial={{ opacity: 0, y: 100 }}
        animate={
          storyStep >= 2
            ? { opacity: 1, y: [0, -10, 0] }
            : { opacity: 0, y: 100 }
        }
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        🎈
      </motion.div>

      <motion.div
        className="absolute top-32 right-16 text-[80px] z-10"
        initial={{ opacity: 0, y: 100 }}
        animate={
          storyStep >= 3
            ? { opacity: 1, y: [0, -15, 0] }
            : { opacity: 0, y: 100 }
        }
        transition={{
          opacity: { duration: 0.5, delay: 0.3 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
      >
        🎈
      </motion.div>

      <motion.div
        className="absolute top-16 right-1/3 text-[80px] z-10"
        initial={{ opacity: 0, y: 100 }}
        animate={
          storyStep >= 4
            ? { opacity: 1, y: [0, -8, 0] }
            : { opacity: 0, y: 100 }
        }
        transition={{
          opacity: { duration: 0.5, delay: 0.6 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2 },
        }}
      >
        🎈
      </motion.div>

      {/* Main Story Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Circular Profile Picture - Chapter 1 */}
        <motion.div
          className="relative mb-8"
          variants={storyVariants}
          initial="hidden"
          animate={storyStep >= 1 ? "visible" : "hidden"}
        >
          <div className="relative mx-auto w-40 h-40 md:w-68 md:h-68">
            {/* Gradient border ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-100 via-pink-300 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm p-2">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <ImageWithFallback
                    src="/cover-photo.jpg"
                    alt="Sarah"
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10" />
                </div>
              </div>
            </div>

            {/* Floating sparkles around the image */}
            <motion.div
              className="absolute -top-2 -right-2 text-pink-400 text-4xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                storyStep >= 1
                  ? {
                      opacity: 1,
                      scale: 1,
                      rotate: [0, 360],
                    }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                opacity: { duration: 0.5, delay: 0.5 },
                scale: { duration: 0.5, delay: 0.5 },
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                },
              }}
            >
              ✨
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-2 text-purple-400 text-4xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                storyStep >= 1
                  ? {
                      opacity: 1,
                      scale: 1,
                      rotate: [0, -360],
                    }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                opacity: { duration: 0.5, delay: 0.7 },
                scale: { duration: 0.5, delay: 0.7 },
                rotate: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.5,
                },
              }}
            >
              🌟
            </motion.div>

            <motion.div
              className="absolute top-1/2 -left-4 text-orange-400 text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={
                storyStep >= 1
                  ? {
                      opacity: 1,
                      y: [0, -10, 0],
                    }
                  : { opacity: 0, y: 20 }
              }
              transition={{
                opacity: { duration: 0.5, delay: 0.9 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                },
              }}
            >
              💫
            </motion.div>
          </div>
        </motion.div>

        {/* Main Title - Chapter 2 */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-pink-300 to-purple-500 bg-clip-text text-transparent"
          variants={titleVariants}
          initial="hidden"
          animate={storyStep >= 2 ? "visible" : "hidden"}
        >
          Happy Half Birthday, Preci!
        </motion.h1>

        {/* Subtitle - Chapter 3 */}
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-600"
          variants={textSlideVariants}
          initial="hidden"
          animate={storyStep >= 3 ? "visible" : "hidden"}
        >
          Wishing you the happiest of days from everyone who loves you.
        </motion.p>

        {/* Quote - Chapter 4 */}
        <motion.div
          className="handwritten text-2xl md:text-3xl text-purple-600 italic mb-12"
          variants={quoteVariants}
          initial="hidden"
          animate={storyStep >= 4 ? "visible" : "hidden"}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={storyStep >= 4 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            "Life is what happens when you're busy making other plans."
          </motion.span>
        </motion.div>

        {/* Button - Chapter 5 */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0, rotate: 10 }}
          animate={
            storyStep >= 5
              ? {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }
              : {
                  opacity: 0,
                  scale: 0,
                  rotate: 10,
                }
          }
          transition={{
            duration: 0.8,
            ease: "backOut",
            scale: { type: "spring", bounce: 0.4 },
          }}
        >
          <motion.button
            onClick={() => {
              setShowConfetti(false);
              setStoryStep(0);
              setTimeout(() => {
                setStoryStep(1);
                setTimeout(() => setStoryStep(2), 800);
                setTimeout(() => setStoryStep(3), 1600);
                setTimeout(() => setStoryStep(4), 2400);
                setTimeout(() => setStoryStep(5), 3200);
                setTimeout(() => {
                  setShowConfetti(true);
                  generateConfetti();
                }, 3000);
              }, 100);
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎉 Tell the Story Again!
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
