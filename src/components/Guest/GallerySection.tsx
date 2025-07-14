import React from "react";
const mockGallery = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&w=400&h=400&fit=crop",
    caption: "Caption for the photo",
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/3771068/pexels-photo-3771068.jpeg?auto=compress&w=400&h=400&fit=crop",
    caption: "",
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/3771067/pexels-photo-3771067.jpeg?auto=compress&w=400&h=400&fit=crop",
    caption: "",
  },
];

function GallerySection() {
  return (
    <section className="bg-white/80 rounded-2xl shadow-lg p-6 border border-peach-100">
      <div className="font-semibold text-lg mb-3">Guest Gallery</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockGallery.map((photo) => (
          <div
            key={photo.id}
            className="flex flex-col items-center bg-peach-50 rounded-xl p-3 shadow border border-peach-100"
          >
            <img
              src={photo.url}
              alt="Guest"
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <div className="text-xs text-gray-600 text-center">
              {photo.caption || ""}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GallerySection;
