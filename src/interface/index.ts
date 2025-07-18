export interface GuestUploads {
  id: number;
  photo_url: string;
  caption: string;
  name: string;
}

export interface PlaylistContributorI {
  track_id: string;
  track_name: string;
  artist_name: string;
  album_art_url: string;
  contributor_name: string;
}

export interface PlaylistI {
  name: string;
  art: string;
  tracks: Array<{
    name: string;
    id: string;
    artist: string;
    art?: string;
  }>;
}
