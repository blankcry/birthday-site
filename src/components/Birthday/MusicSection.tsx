import { motion, type Variants } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Play, Pause, Heart, Music } from "lucide-react";
import SpotifySDK from "@/api/spotifyClient";
import { supabase } from "@/api/supabaseClient";
import type { PlaylistI, PlaylistContributorI, TracksI } from "@/interface";
import { unslugify } from "@/util";
import { useRef } from "react";

export function MusicSection({ id }: { id?: string } = {}) {
  const limit = 9;
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistI | null>(null);
  const [tracks, setTracks] = useState<TracksI[]>([]);
  const [displayTracks, setDisplayTracks] = useState<TracksI[]>([]);
  const [contributors, setContributors] = useState<
    PlaylistContributorI[] | null
  >(null);
  const [spotifyController, setSpotifyController] = useState<any>(null);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  const playlistId = "16EaYXNEuGo5886td84PBJ";

  // Helper to fetch all tracks from a playlist (paginated)
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
          art: track.track.album.images[0].url,
        })),
      });
    } catch (error: any) {
      setError(error.message);
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

  // Helper to get Spotify URI for a track
  const getTrackUri = (id: string) => `spotify:track:${id}`;

  // Add Spotify iFrame API script if not present
  useEffect(() => {
    if (!document.getElementById("spotify-iframe-api")) {
      const script = document.createElement("script");
      script.id = "spotify-iframe-api";
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Initialize the Spotify Embed when playlist is loaded
  useEffect(() => {
    if (!playlist || embedLoaded) return;
    // Wait for the API to be ready
    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const element = embedRef.current;
      if (!element) return;
      const options = {
        uri: playlist.tracks[0]
          ? getTrackUri(playlist.tracks[0].id)
          : `spotify:playlist:${playlistId}`,
        width: "100%",
        height: 80,
        theme: "black",
      };
      IFrameAPI.createController(element, options, (controller: any) => {
        setSpotifyController(controller);
        setEmbedLoaded(true);
        // Try to autoplay the first track if possible (requires user interaction)
        if (typeof controller.play === "function") {
          controller.play();
        }
      });
    };
  }, [playlist, embedLoaded]);

  useEffect(() => {
    if (playlist) {
      const { tracks: playlistTracks } = playlist;
      setTracks(playlistTracks);
    }
  }, [playlist]);

  useEffect(() => {
    if (tracks.length === 0) return;
    // Initialize display tracks with the first set of tracks
    const initialTracks = tracks.slice(0, limit);
    setDisplayTracks(initialTracks);
  }, [tracks]);

  const handleLoadMore = () => {
    const start = displayTracks.length;
    const end = start + limit;
    const newTracks = tracks.slice(start, end);
    setDisplayTracks((prev) => [...prev, ...newTracks]);
  };

  // When a song is clicked, switch the embed to that song and try to autoplay
  const handleSongClick = (songId: string) => {
    setCurrentlyPlaying(songId);
    if (spotifyController) {
      spotifyController.loadUri(getTrackUri(songId));
      // Attempt to autoplay (will only work if user has interacted with the page)
      if (typeof spotifyController.play === "function") {
        spotifyController.play();
      }
    }
  };

  useEffect(() => {
    fetchPlaylist();
    fetchPlaylistContributors();
  }, [fetchPlaylist, fetchPlaylistContributors]);

  useEffect(() => {
    fetchPlaylist();
    fetchPlaylistContributors();
  }, [fetchPlaylist, fetchPlaylistContributors]);

  // Animation variants
  const fadeInVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const slideInFromLeft = {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const slideInFromRight = {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants;

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  } as Variants;

  const staggerItemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        bounce: 0.2,
      },
    },
  } as Variants;

  const spotifyEmbedVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      rotateY: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        bounce: 0.1,
      },
    },
  } as Variants;

  const musicIconVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -90,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        bounce: 0.4,
      },
    },
  } as Variants;

  return (
    <section className="relative py-20 px-4" id={id}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            variants={staggerContainerVariants}
          >
            <motion.div variants={musicIconVariants}>
              <Music className="text-pink-500 w-8 h-8" />
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-pink-300 to-purple-500 bg-clip-text text-transparent"
              variants={slideInFromLeft}
            >
              Songs That Remind Us of You
            </motion.h2>
            <motion.div
              variants={musicIconVariants}
              transition={{ delay: 0.2 }}
            >
              <Music className="text-purple-500 w-8 h-8" />
            </motion.div>
          </motion.div>
          <motion.p
            className="text-xl text-gray-600"
            variants={slideInFromRight}
            transition={{ delay: 0.3 }}
          >
            A playlist curated with love from all your friends
          </motion.p>
        </motion.div>

        {/* Spotify embed player */}
        <motion.div
          className="mb-12"
          variants={spotifyEmbedVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-1 rounded-2xl">
            <div className="bg-white rounded-xl p-8 text-center">
              <motion.div
                className="bg-black text-white rounded-lg p-8 mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Music className="text-white w-8 h-8" />
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-xl font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      {playlist?.name}
                    </motion.h3>
                    <motion.p
                      className="text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      Curated by your loving friends
                    </motion.p>
                  </div>
                </motion.div>
                <motion.p
                  className="text-green-400 mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  🎵 Available on Spotify
                </motion.p>
                {/* Embed container */}
                <div ref={embedRef} style={{ width: "100%", minHeight: 80 }} />
              </motion.div>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                * Click a song below to play it in the Spotify player above
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Song cards */}
        {loadingPlaylist ? (
          <div className="text-center text-pink-500 py-10 text-lg">
            Loading playlist…
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 text-lg">{error}</div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              // viewport={{ once: true, margin: "-150px" }}
            >
              {displayTracks.map((track) => {
                const contributor = contributors?.find(
                  (c) => c.track_id === track.id
                );
                return (
                  <motion.div
                    key={track.id}
                    onClick={() => handleSongClick(track.id)}
                    variants={staggerItemVariants}
                    className="relative group cursor-pointer"
                    whileHover={{
                      scale: 1.03,
                      y: -5,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      },
                    }}
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-pink-200 overflow-hidden">
                      {/* Animated background gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />

                      <div className="flex items-start gap-4 relative z-10">
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <motion.img
                            src={track.art}
                            alt={`${track.name} cover`}
                            className="w-16 h-16 rounded-lg object-cover"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                          />
                          <motion.button
                            onClick={() => handleSongClick(track.id)}
                            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {currentlyPlaying === track.id ? (
                              <Pause className="text-white w-6 h-6" />
                            ) : (
                              <Play className="text-white w-6 h-6 ml-1" />
                            )}
                          </motion.button>
                        </motion.div>

                        <div className="flex-1">
                          <motion.h4
                            className="font-semibold text-gray-800 mb-1 whitespace-nowrap truncate"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                          >
                            {track.name}
                          </motion.h4>
                          <motion.p
                            className="text-gray-600 text-sm mb-2 whitespace-nowrap"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                          >
                            {track.artist}
                          </motion.p>
                          {contributor && (
                            <motion.p
                              className="text-sm text-pink-600 italic whitespace-nowrap"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.4 }}
                            >
                              Contributed by{" "}
                              {unslugify(contributor.contributor_name)}
                            </motion.p>
                          )}
                        </div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 0.6, scale: 1 }}
                          whileHover={{ opacity: 1, scale: 1.1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                        >
                          <Heart className="text-pink-500 w-5 h-5 transition-all" />
                        </motion.div>
                      </div>

                      {/* Playing indicator */}
                      {currentlyPlaying === track.id && (
                        <motion.div
                          className="flex items-center gap-2 mt-4 text-pink-500"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1 h-4 bg-pink-500 rounded-full"
                                animate={{
                                  scaleY: [1, 2, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                  ease: "easeInOut",
                                }}
                              />
                            ))}
                          </div>
                          <motion.span
                            className="text-sm"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Now Playing
                          </motion.span>
                        </motion.div>
                      )}

                      {/* Floating musical notes */}
                      {currentlyPlaying === track.id && (
                        <>
                          <motion.div
                            className="absolute -top-2 -right-2 text-pink-400 text-lg pointer-events-none"
                            animate={{
                              y: [-20, -40, -20],
                              x: [0, 10, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            🎵
                          </motion.div>
                          <motion.div
                            className="absolute -bottom-2 -left-2 text-purple-400 text-sm pointer-events-none"
                            animate={{
                              y: [20, 0, 20],
                              x: [0, -10, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                          >
                            🎶
                          </motion.div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <button
              className="px-6 py-2 bg-pink-500 text-white hover:bg-pink-600 transition-colors rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleLoadMore()}
              disabled={displayTracks.length === tracks.length}
            >
              See More Songs
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
