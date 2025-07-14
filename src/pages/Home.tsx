import Countdown from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { loadFull } from "tsparticles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { useNavigate } from "react-router-dom";

function Home() {
  const BIRTHDAY_DATE = new Date("2025-07-15T00:00:00"); // Change as needed
  const [init, setInit] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = {
    fullScreen: false,
    background: {
      color: "pink",
    },
    emitters: {
      position: {
        x: 50,
        y: 100,
      },
      rate: {
        quantity: 5,
        delay: 0.15,
      },
    },
    particles: {
      color: {
        value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
      },
      move: {
        decay: 0.05,
        direction: "top",
        enable: true,
        gravity: {
          enable: true,
        },
        outModes: {
          top: "none",
          default: "destroy",
        },
        speed: {
          min: 50,
          max: 100,
        },
      },
      number: {
        value: 0,
      },
      opacity: {
        value: 1,
      },
      rotate: {
        value: {
          min: 0,
          max: 360,
        },
        direction: "random",
        animation: {
          enable: true,
          speed: 30,
        },
      },
      tilt: {
        direction: "random",
        enable: true,
        value: {
          min: 0,
          max: 360,
        },
        animation: {
          enable: true,
          speed: 30,
        },
      },
      size: {
        value: 10,
        animation: {
          enable: true,
          startValue: "min",
          count: 1,
          speed: 16,
          sync: true,
        },
      },

      shape: {
        type: ["circle", "square"],
        options: {},
      },
    },
  };
  const particlesLoaded = async (container?: Container) => {
    console.log(container);
  };

  return (
    <div className="min-h-screen max-w-screen w-full font-sans flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-300 via-pink-100 to-purple-300">
      {init && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Particles
            options={{ ...particlesOptions, fullScreen: false }}
            particlesLoaded={particlesLoaded}
          />
        </div>
      )}
      <main className="relative z-10 w-full h-full px-4 py-8 text-center">
        <span className="text-xl md:text-5xl font-extrabold mb-6 text-[#2d1a2d] tracking-wide drop-shadow-[0_2px_12px_rgba(255,246,255,0.4)]">
          Countdown to Preci's Day 🎊🎊
        </span>
        <Countdown targetDate={BIRTHDAY_DATE} />
        <div className="text-lg md:text-xl text-[#6e4a7e] my-6 font-medium">
          Something special is coming…
        </div>
        <Button
          size="lg"
          className="cursor-pointer text-center w-max bg-gradient-to-r from-pink-400 to-pink-300 text-white rounded-full font-bold text-sm md:text-lg shadow-lg px-8 py-4 mt-4 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300"
          onClick={() => navigate("/guest")}
        >
          Friends & family → Help me create the surprise!
        </Button>
      </main>
    </div>
  );
}

export default Home;
