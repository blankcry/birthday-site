import { LavaLampBackground } from "../components/Birthday/LavaLampBackground";
import { HeroSection } from "../components/Birthday/HeroSection";
import { PhotoGallery } from "../components/Birthday/PhotoGallery";
import { PersonalLetter } from "../components/Birthday/PersonalLetter";
import { MusicSection } from "../components/Birthday/MusicSection";
import { config } from "@/data/birthday-user";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Birthday() {
  return (
    <div className="relative min-h-screen bg-pink-500">
      <LavaLampBackground />

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-pink-200">
        <nav className="max-w-6xl mx-auto flex items-center justify-center gap-8 py-6">
          <button
            className="text-pink-500 font-bold hover:text-purple-500 transition-colors cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            Home
          </button>
          <button
            className="text-pink-500 font-bold hover:text-purple-500 transition-colors cursor-pointer"
            onClick={() => scrollToSection("gallery")}
          >
            Gallery
          </button>
          <button
            className="text-pink-500 font-bold hover:text-purple-500 transition-colors cursor-pointer"
            onClick={() => scrollToSection("letter")}
          >
            Letter
          </button>
          <button
            className="text-pink-500 font-bold hover:text-purple-500 transition-colors cursor-pointer"
            onClick={() => scrollToSection("music")}
          >
            Music
          </button>
        </nav>
      </header>

      <div className="relative z-10 pt-28">
        {/* Add id to each section for anchor navigation */}
        <section id="hero">
          <HeroSection />
        </section>
        <section id="gallery">
          <PhotoGallery />
        </section>
        <section id="letter">
          <PersonalLetter />
        </section>
        <section id="music">
          <MusicSection />
        </section>

        {/* Footer */}
        <footer className="text-center py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              Made with 💕 by your loving friends
            </p>
            <p className="text-sm text-gray-500">
              Happy Birthday, {config.name}! Here's to another year of amazing
              memories! 🎉
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
