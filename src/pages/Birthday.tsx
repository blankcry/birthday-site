import { LavaLampBackground } from '../components/Birthday/LavaLampBackground';
import { HeroSection } from '../components/Birthday/HeroSection';
import { PhotoGallery } from '../components/Birthday/PhotoGallery';
import { PersonalLetter } from '../components/Birthday/PersonalLetter';
import { MusicSection } from '../components/Birthday/MusicSection';
import { config } from '@/data/birthday-user';

export default function Birthday() {
  return (
    <div className="relative min-h-screen bg-pink-500">
      <LavaLampBackground />
      
      <div className="relative z-10">
        <HeroSection />
        <PhotoGallery />
        <PersonalLetter />
        <MusicSection />
        
        {/* Footer */}
        <footer className="text-center py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              Made with 💕 by your loving friends
            </p>
            <p className="text-sm text-gray-500">
              Happy Birthday, {config.name}! Here's to another year of amazing memories! 🎉
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}