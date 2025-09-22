export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork: string;
  duration: number;
  type: "song" | "podcast" | "audiobook";
  description?: string;
  videoUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription?: "free" | "premium";
}