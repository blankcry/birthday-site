import { useState, useContext } from "react";
import { GuestContext } from "@/pages/Guest";
import { supabase } from "@/api/supabaseClient";

function PhotoUploadSection() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const { name, refreshGallery } = useContext(GuestContext);
  const [uploading, setUploading] = useState(false); // for file upload
  const [inserting, setInserting] = useState(false); // for db insert
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null); // keep uploaded photo url

  // Utility to slugify contributor name
  function slugify(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Upload photo to Supabase Storage (only if not already uploaded)
  const uploadPhoto = async () => {
    if (!photo) return null;
    setUploading(true);
    setError(null);
    try {
      const fileExt = photo.name.split('.').pop();
      const generatedFileName = `${Date.now()}-${name.replace(/\s+/g, "-")}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("guestphotos")
        .upload(generatedFileName, photo, { upsert: false });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage
        .from("guestphotos")
        .getPublicUrl(generatedFileName);
      setPhotoUrl(publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (err: any) {
      setError(err.message || "Photo upload failed. Please try again.");
      setPhotoUrl(null);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Insert into DB (can retry if photoUrl is set)
  const insertToDb = async (url: string) => {
    setInserting(true);
    setError(null);
    try {
      const slug = slugify(name);
      const { error: insertError } = await supabase.from("guest_uploads").insert([
        { name: slug, caption: message, photo_url: url },
      ]);
      if (insertError) throw insertError;
      setSuccess(true);
      setPhoto(null);
      setMessage("");
      setPhotoUrl(null);
      refreshGallery(); // trigger gallery refresh
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setInserting(false);
    }
  };

  // Main submit handler
  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!photo && !photoUrl) {
      setError("Please select a photo to upload.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }
    // If photo not uploaded yet, upload it
    let url = photoUrl;
    if (!url) {
      url = await uploadPhoto();
      if (!url) return; // upload failed
    }
    // Insert to DB
    await insertToDb(url);
  };

  // Retry DB insert only
  const handleRetryDbInsert = async () => {
    if (photoUrl) {
      await insertToDb(photoUrl);
    }
  };

  return (
    <section className="bg-white/80 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 mb-6 md:mb-10 border border-pink-100 w-full">
      <div className="flex-1 flex flex-col items-center justify-center w-full md:max-w-[50%] mb-4 md:mb-0">
        <label
          htmlFor="photo-upload"
          className="w-[55%] cursor-pointer flex flex-col items-center justify-center bg-pink-100 rounded-xl h-40 md:h-48 mb-4 border-2 border-dashed border-pink-200 hover:bg-pink-50 transition relative"
        >
          {photo ? (
            <div className="relative w-full h-40 md:h-48 flex items-center justify-center">
              <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="object-cover h-40 md:h-48 w-full rounded-xl"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                  <svg className="animate-spin h-10 w-10 text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 md:w-12 md:h-12 text-pink-400 mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                />
              </svg>
              <span className="font-medium text-xs md:text-sm text-pink-400 tracking-wide">
                Upload Photo
              </span>
            </>
          )}
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setPhoto(e.target.files?.[0] || null);
              setPhotoUrl(null);
              setSuccess(false);
              setError(null);
            }}
            disabled={uploading || inserting}
          />
        </label>
      </div>
      <div className="flex-1 flex flex-col justify-between gap-3 w-full md:max-w-[50%]">
        <div>
          <div className="font-semibold text-lg mb-1">Share a Memory</div>
          <div className="text-sm text-[#6e4a7e] mb-2">
            Upload a photo and write a message for Preci.
          </div>
          <textarea
            className="w-full rounded-xl border border-pink-200 bg-pink-50 p-2 md:p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none min-h-[60px] md:min-h-[80px] text-sm md:text-base"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={uploading || inserting}
          />
          <div className="text-xs md:text-sm text-pink-700 mb-2">From: <span className="font-bold">{name}</span></div>
          {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
          {success && <div className="text-xs text-green-600 mb-2">Thank you for your contribution!</div>}
        </div>
        <div className="flex justify-end gap-2">
          {error && photoUrl && !success && !uploading && !inserting && (
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 md:px-6 py-2 rounded-full shadow transition text-xs md:text-base"
              onClick={handleRetryDbInsert}
              disabled={inserting}
            >
              Retry Save
            </button>
          )}
          <button
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-4 md:px-6 py-2 rounded-full shadow transition text-xs md:text-base disabled:opacity-60"
            onClick={handleSubmit}
            disabled={uploading || inserting}
          >
            {(uploading || inserting) ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhotoUploadSection;
