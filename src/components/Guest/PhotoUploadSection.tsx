import { useState, useContext } from "react";
import { ContributorContext } from "@/pages/Guest";

function PhotoUploadSection() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const { name } = useContext(ContributorContext);
  return (
    <section className="bg-white/80 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 p-6 mb-10 border border-pink-100 w-full">
      <div className="flex-1 flex flex-col items-center justify-center max-w-1/2 w-full">
        <label
          htmlFor="photo-upload"
          className="w-full cursor-pointer flex flex-col items-center justify-center bg-teal-200 rounded-xl h-48 mb-4 border-2 border-dashed border-pink-200 hover:bg-teal-100 transition"
        >
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="object-cover h-48 w-full rounded-xl"
            />
          ) : (
            <>
              <span className="text-6xl mb-2">⬆️</span>
              <span className="font-semibold text-lg text-teal-900">
                UPLOAD
              </span>
            </>
          )}
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="font-semibold text-lg mb-1">Share a Memory</div>
          <div className="text-sm text-[#6e4a7e] mb-2">
            Upload a photo and write a message for Preci.
          </div>
          <textarea
            className="w-full rounded-xl border border-pink-200 bg-pink-50 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none min-h-[80px]"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="text-xs text-pink-700 mb-2">From: <span className="font-bold">{name}</span></div>
        </div>
        <div className="flex justify-end">
          <button className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-6 py-2 rounded-full shadow transition">
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhotoUploadSection;
