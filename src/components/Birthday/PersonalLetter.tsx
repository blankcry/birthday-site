import { config } from '@/data/birthday-user';
import { motion, type Variants } from 'framer-motion';
import { useState, useEffect } from 'react';

export function PersonalLetter({ id }: { id?: string } = {}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const letterText = config.birthdayWishes;

  useEffect(() => {
    if (isInView && !isTyping && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setCurrentIndex(0);
        setDisplayText('');
        setHasAnimated(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, isTyping, hasAnimated]);

  useEffect(() => {
    if (isTyping && currentIndex < letterText.length) {
      const timer = setTimeout(() => {
        setDisplayText(letterText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // Faster typing for better UX

      return () => clearTimeout(timer);
    } else if (isTyping && currentIndex >= letterText.length) {
      setIsTyping(false);
    }
  }, [isTyping, currentIndex, letterText]);

  // Animation variants
  const fadeInVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  } as Variants;

  const slideInFromLeft = {
    hidden: { 
      opacity: 0, 
      x: -100
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }as Variants;

  const letterCardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        bounce: 0.1
      }
    }
  } as Variants

  const decorativeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  } as Variants

  return (
    <section className="relative py-20 px-4" id={id}>
      <div className="max-w-4xl mx-auto">
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
            variants={slideInFromLeft}
          >
            A Letter From The Heart
          </motion.h2>
        </motion.div>

        {/* Letter Card */}
        <motion.div
          className="relative"
          variants={letterCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          onViewportEnter={() => {
            if (!hasAnimated) setIsInView(true);
          }}
        >
          {/* Letter card */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-200 overflow-hidden">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 to-purple-50/30 rounded-3xl" />
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-4 right-4 text-pink-300 opacity-50"
              variants={decorativeVariants}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🌸
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-4 left-4 text-purple-300 opacity-50"
              variants={decorativeVariants}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🌺
              </motion.div>
            </motion.div>

            {/* Additional floating decorations */}
            <motion.div
              className="absolute top-1/4 left-8 text-pink-400 opacity-30 text-2xl"
              variants={decorativeVariants}
              animate={{ y: [0, -10, 0] }}
              transition={{
                delay: 0.4, 
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                ...(decorativeVariants.visible as any).transition
              }}
            >
              💕
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 right-12 text-purple-400 opacity-30 text-xl"
              variants={decorativeVariants}
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                delay: 0.6,
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                ...(decorativeVariants.visible as any).transition
              }}
            >
              ✨
            </motion.div>

            {/* Letter content */}
            <motion.div 
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="handwritten text-lg md:text-2xl text-gray-700 leading-relaxed" >
                <motion.pre 
                  className="whitespace-pre-wrap font-inherit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: '"Dancing Script", cursive'
                  }}
                >
                  {displayText}
                  {isTyping && currentIndex < letterText.length && (
                    <motion.span 
                      className="inline-block w-0.5 h-6 bg-pink-500 ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.pre>
              </div>
            </motion.div>

            {/* Floating hearts around the letter */}
            <motion.div
              className="absolute -top-2 -left-2 text-pink-400 text-xl"
              variants={decorativeVariants}
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ 
                delay: 0.8 ,
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              💕
            </motion.div>
            
            <motion.div
              className="absolute -bottom-2 -right-2 text-purple-400 text-xl"
              variants={decorativeVariants}
              animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
              transition={{ 
                delay: 1,
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              💜
            </motion.div>

            {/* Sparkle effects */}
            <motion.div
              className="absolute top-1/2 -right-4 text-orange-400 text-lg"
              variants={decorativeVariants}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                delay: 1.2,
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              ⭐
            </motion.div>
          </div>
        </motion.div>

        {/* Additional message */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.p 
            className="text-gray-600 italic"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Written with love, sealed with a wish 💌
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}