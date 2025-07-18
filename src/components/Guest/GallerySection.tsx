import { useEffect, useState, useContext } from "react";
import { supabase } from "@/api/supabaseClient";
import { GuestContext } from "@/pages/Guest";
import type { GuestUploads } from "@/interface";
import { isVideo, slugify } from "@/util";

// Utility to slugify contributor name (same as in PhotoUploadSection)


function GallerySection() {
  const { name, galleryRefresh } = useContext(GuestContext);
  const [photos, setPhotos] = useState<GuestUploads[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userSlug = slugify(name);

  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from("guest_uploads")
      .select("id, photo_url, caption,name")
      .eq("name", userSlug)
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPhotos(data || []);
        setLoading(false);
      });
  }, [galleryRefresh, userSlug]);

  return (
    <section className="bg-white/70 rounded-xl shadow px-1 py-2 sm:p-2 md:p-4 w-full mb-6 md:mb-10">
      <div className="font-semibold text-lg mb-3 text-peach-900">
        Guest Gallery
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10 text-peach-700">
          <svg
            className="animate-spin h-8 w-8 mr-2 text-peach-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading gallery…
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-1 sm:px-2 md:px-0">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`relative group aspect-[4/5] overflow-hidden rounded-lg bg-white/40 shadow-sm hover:shadow-md transition-shadow ${
                photo.name === userSlug ? "ring-2 ring-pink-400" : ""
              }`}
            >
              {isVideo(photo.photo_url) ? (
                <video
                  src={photo.photo_url}
                  autoPlay
                  muted
                  loop
                  controls
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <img
                  src={photo.photo_url}
                  alt={photo.caption || photo.name || "Guest"}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 border border-neutral-100"
                />
              )}
              {photo.caption && (
                <div
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent text-white text-xs md:text-sm px-2 py-1
                    opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                  {photo.caption}
                </div>
              )}
              {photo.name === userSlug && (
                <div className="absolute top-2 right-2 bg-pink-400 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full shadow">
                  You
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default GallerySection;
