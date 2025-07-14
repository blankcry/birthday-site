import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLEINT_ID as string;
const spotifyClientSecret = import.meta.env
  .VITE_SPOTIFY_CLEINT_SECRET as string;
// Choose one of the following:
const SpotifySDK = SpotifyApi.withClientCredentials(
  spotifyClientId,
  spotifyClientSecret
);

export default SpotifySDK;
