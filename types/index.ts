export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork: string;
  duration: number;
  type: "song" | "podcast" | "audiobook" | "video";
  description?: string;
  videoUrl?: string;
  isVideo?: boolean;
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