import SpotifySDK from "@/api/spotifyClient";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { ContributorContext } from "@/pages/Guest";
import { supabase } from "@/api/supabaseClient";

function PlaylistSection() {
  const playlistId = "16EaYXNEuGo5886td84PBJ";
  const { name } = useContext(ContributorContext);
  const [playlist, setPlaylist] = useState<{
    name: string;
    art: string;
    tracks: Array<{
      name: string;
      id: string;
      artist: string;
    }>;
  } | null>(null);
  const [error, setError] = useState("");
  const [songQuery, setSongQuery] = useState("");
  const [songs, setSongs] = useState<
    {
      id: string;
      name: string;
      album: string;
      artist: string;
      albumArt: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!songQuery) {
      setSongs([]);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await SpotifySDK.search(
          songQuery,
          ["track"],
          undefined,
          10
        );
        setSongs(
          res.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            album: track.album.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            albumArt: track.album.images[0].url,
          }))
        );
      } catch (e) {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    // eslint-disable-next-line
  }, [songQuery]);

  const fetchPlaylist = useCallback(async () => {
    setLoadingPlaylist(true);
    try {
      const playlist = await SpotifySDK.playlists.getPlaylist(playlistId);
      setPlaylist({
        name: playlist.name,
        art: playlist.images[0].url,
        tracks: playlist.tracks.items.map((track) => ({
          name: track.track.name,
          id: track.track.id,
          artist: track.track.artists.map((artist) => artist.name).join(", "),
        })),
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingPlaylist(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  const handleAddtoPlaylist = async (song: (typeof songs)[0]) => {
    if (!playlist) {
      return;
    }
    setError("");
    // Using supabase add the song to the "playlist_suggestions" table
    // The payload would include track_id, track_name, artist_name, album_art_url and contributor name
    const { error: supabaseError } = await supabase
      .from("playlist_suggestions")
      .insert([
        {
          track_id: song.id,
          track_name: song.name,
          artist_name: song.artist,
          album_art_url: song.albumArt,
          contributor_name: name
            .split(" ")
            .map((part) => part.toLocaleLowerCase())
            .join("-"),
        },
      ]);
    if (supabaseError) {
      setError("Failed to suggest song: " + supabaseError.message);
      return;
    }
    // Add to Spotify playlist
    try {
      await SpotifySDK.playlists.addItemsToPlaylist(playlistId, [
        `spotify:track:${song.id}`,
      ]);
      setError("Song suggestion submitted and added to playlist! 🎉");
    } catch (spotifyError: any) {
      setError(
        "Suggested, but failed to add to Spotify playlist: " +
          (spotifyError.message || spotifyError.toString())
      );
    } finally {
      fetchPlaylist();
    }
  };
  return (
    <section className="flex gap-2 justify-between w-full">
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-10 border border-purple-100 max-w-1/2 w-full">
        <div className="font-semibold text-lg mb-3">
          Contribute to her custom playlist
        </div>
        <input
          className="w-full rounded-xl border border-purple-200 bg-purple-50 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-200"
          placeholder="Search for a song or artist..."
          value={songQuery}
          onChange={(e) => setSongQuery(e.target.value)}
        />
        <div className="flex flex-col gap-2 min-h-[48px]">
          {loading && (
            <div className="text-purple-400 text-center py-2">Searching…</div>
          )}
          {!loading && songs.length === 0 && songQuery && (
            <div className="text-purple-400 text-center py-2">
              No results found.
            </div>
          )}
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center gap-3 bg-purple-50 rounded-xl px-3 py-2"
            >
              <img
                src={
                  song.albumArt ||
                  "https://via.placeholder.com/40x40.png?text=🎵"
                }
                alt="Album Art"
                className="w-10 h-10 rounded-lg object-cover border border-purple-200"
              />
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">{song.name}</div>
                <div className="text-xs text-purple-500">{song.artist}</div>
              </div>
              <button
                className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-white font-semibold px-4 py-1 rounded-full text-xs shadow transition"
                onClick={() => handleAddtoPlaylist(song)}
              >
                Add to playlist
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-10 border border-purple-100">
        {error && <span className="text-red-500 mt-2 ">{error}</span>}
        {loadingPlaylist && (
          <div className="text-purple-400 text-center py-4">
            Loading playlist…
          </div>
        )}
        {playlist && (
          <div className="flex flex-col items-center mt-4">
            <span className="font-semibold text-xs md:text-xl">
              {playlist.name}
            </span>
            <img
              src={playlist.art}
              alt="Playlist cover"
              className="w-32 h-32 rounded-xl mb-2 object-cover shadow"
            />
            <div className="w-full h-1/2 overflow-y-auto">
              <ul className="divide-y divide-purple-100">
                {playlist.tracks.map((track) => (
                  <li
                    key={track.id}
                    className="py-2 flex flex-col md:flex-row md:items-center md:gap-2"
                  >
                    <span className="font-medium text-sm text-purple-900">
                      {track.name}
                    </span>
                    <span className="text-xs text-purple-500 md:ml-2">
                      {track.artist}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PlaylistSection;
