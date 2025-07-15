import SpotifySDK from "@/api/spotifyClient";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { GuestContext } from "@/pages/Guest";
import { supabase } from "@/api/supabaseClient";

interface PlaylistContributorI {
  track_id: string;
  track_name: string;
  artist_name: string;
  album_art_url: string;
  contributor_name: string;
}

function PlaylistSection() {
  const playlistId = "16EaYXNEuGo5886td84PBJ";
  const { name } = useContext(GuestContext);
  const [playlist, setPlaylist] = useState<{
    name: string;
    art: string;
    tracks: Array<{
      name: string;
      id: string;
      artist: string;
    }>;
  } | null>(null);
  const [contributors, setContributors] = useState<
    PlaylistContributorI[] | null
  >(null);
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
  const [addingPlaylist, setAddingPlaylist] = useState(false);
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
      console.error(error.message);
    } finally {
      setLoadingPlaylist(false);
    }
  }, []);
  const fetchPlaylistContributors = useCallback(async () => {
    try {
      const { data } = await supabase.from("playlist_suggestions").select("*");
      console.log(data);
      setContributors(data);
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPlaylist();
    fetchPlaylistContributors();
  }, [fetchPlaylist, fetchPlaylistContributors]);

  const handleAddtoPlaylist = async (song: (typeof songs)[0]) => {
    if (!playlist) {
      return;
    }
    setAddingPlaylist(true);
    try {
      await supabase.functions.invoke("spotify-api", {
        body: {
          track_id: song.id,
          track_name: song.name,
          artist_name: song.artist,
          album_art_url: song.albumArt,
          contributor_name: name
            .split(" ")
            .map((part) => part.toLocaleLowerCase())
            .join("-"),
        },
      });
    } catch (error: any) {
      console.error(
        "Suggested, but failed to add to Spotify playlist: " +
          (error.message || error.toString())
      );
    } finally {
      setAddingPlaylist(false);
      fetchPlaylist();
    }
  };

  return (
    <section className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between w-full">
      <div className="bg-white/80 rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-10 border border-purple-100 w-full md:max-w-[55%]">
        <div className="font-semibold text-lg mb-3">
          Contribute to her custom playlist
        </div>
        <input
          className="w-full rounded-xl border border-purple-200 bg-purple-50 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm md:text-base"
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
          {songs.map((song) => {
            const isAdded =
              contributors?.some((c) => c.track_id === song.id) ?? false;
            return (
              <div
                key={song.id}
                className="flex items-center gap-2 md:gap-3 bg-purple-50 rounded-xl px-2 md:px-3 py-2"
              >
                <img
                  src={
                    song.albumArt ||
                    "https://via.placeholder.com/40x40.png?text="
                  }
                  alt="Album Art"
                  className="w-10 h-10 rounded-lg object-cover border border-purple-200 flex-shrink-0"
                />
                <div className="flex flex-col text-left w-full">
                  <span className="font-semibold text-xs md:text-sm">
                    {song.name}
                  </span>
                  <span className="text-[10px] md:text-xs text-purple-500 truncate">
                    {song.artist}
                  </span>
                </div>
                <button
                  className={
                    isAdded
                      ? "cursor-not-allowed bg-gray-300 text-gray-500 font-semibold px-3 md:px-4 py-1 rounded-full text-xs shadow transition whitespace-nowrap border border-gray-300 opacity-70"
                      : "cursor-pointer bg-pink-300 hover:bg-pink-400 text-white font-semibold px-3 md:px-4 py-1 rounded-full text-xs shadow transition whitespace-nowrap"
                  }
                  onClick={() => !isAdded && handleAddtoPlaylist(song)}
                  disabled={addingPlaylist || isAdded}
                >
                  {isAdded ? "Added" : "Add to playlist"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white/80 rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-10 border border-purple-100 w-full md:max-w-[45%] flex flex-col items-center">
        {loadingPlaylist && (
          <div className="text-purple-400 text-center py-4">
            Loading playlist…
          </div>
        )}
        {playlist && (
          <div className="flex flex-col md:items-center mt-2 w-full">
            <span className="font-semibold text-xs md:text-xl text-center w-full">
              {playlist.name}
            </span>
            <img
              src={playlist.art}
              alt="Playlist cover"
              className="w-24 h-24 md:w-32 md:h-32 rounded-xl mb-2 object-cover shadow"
            />
            <div className="w-full max-h-40 md:max-h-60 overflow-y-auto">
              <ul className="divide-y divide-purple-100">
                {playlist.tracks.map((track) => {
                  const contributor = contributors?.find(
                    (c) => c.track_id === track.id
                  );
                  return (
                    <li key={track.id} className="p-1 flex flex-col md:gap-2 mb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-xs md:text-sm text-purple-900 truncate">
                          {track.name}
                        </span>
                        <span className="text-[10px] md:text-xs text-purple-500 md:ml-2 truncate">
                          {track.artist}
                        </span>
                      </div>
                      {contributor && (
                        <span className="text-[10px] md:text-xs text-pink-500 truncate font-semibold mt-0.5 capitalize">
                          Contributed by{" "}
                          {contributor.contributor_name.split("-").join(" ")}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PlaylistSection;
