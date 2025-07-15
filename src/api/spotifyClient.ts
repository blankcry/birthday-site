import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const spotifyClientSecret = import.meta.env
  .VITE_SPOTIFY_CLIENT_SECRET as string;
// Choose one of the following:
const SpotifySDK = SpotifyApi.withClientCredentials(
  spotifyClientId,
  spotifyClientSecret,
  ['playlist-modify-public', 'playlist-modify-private'],
);

export default SpotifySDK;
