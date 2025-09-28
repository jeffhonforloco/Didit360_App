import type { Track, Playlist } from "@/types";

export const featuredContent: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Echo",
    album: "Celestial Vibes",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 225,
    type: "song",
  },
  {
    id: "test-audio-1",
    title: "Test Audio Track 1",
    artist: "Test Artist",
    album: "Test Album",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 180,
    type: "song",
  },
  {
    id: "test-audio-2",
    title: "Test Audio Track 2",
    artist: "Test Artist 2",
    album: "Test Album 2",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: 195,
    type: "song",
  },
  {
    id: "without-you-1",
    title: "Without You",
    artist: "The Kid LAROI",
    album: "F*CK LOVE 3: OVER YOU",
    artwork: "https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Without+You",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 210,
    type: "song",
  },
  {
    id: "2",
    title: "Electric Pulse",
    artist: "Neon Waves",
    album: "Digital Horizon",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 198,
    type: "song",
  },
  {
    id: "3",
    title: "Golden Hour",
    artist: "Sunset Boulevard",
    album: "California Dreams",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 242,
    type: "song",
  },
  // Add a video track to featured content
  {
    id: "v1",
    title: "Blinding Lights (Official Music Video)",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];

export const recentlyPlayed: Track[] = [
  {
    id: "4",
    title: "Lost in Tokyo",
    artist: "Urban Nights",
    album: "City Lights",
    artwork: "https://via.placeholder.com/400x400/f7dc6f/ffffff?text=🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: 186,
    type: "song",
  },
  {
    id: "5",
    title: "Ocean Waves",
    artist: "Coastal Breeze",
    album: "Seaside Sessions",
    artwork: "https://via.placeholder.com/400x400/bb8fce/ffffff?text=🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: 210,
    type: "song",
  },
  {
    id: "6",
    title: "Mountain High",
    artist: "Alpine Echo",
    album: "Peak Performance",
    artwork: "https://via.placeholder.com/400x400/85c1e9/ffffff?text=🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: 195,
    type: "song",
  },
  // Add music video to recently played
  {
    id: "v4",
    title: "Firework (Official Music Video)",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 228,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];

// Recently Added Content - Mixed content types (audio, video, audiobook, podcast)
export const recentlyAddedContent: Track[] = [
  // Recently added music
  {
    id: "ra1",
    title: "Midnight Dreams",
    artist: "Luna Echo",
    album: "Celestial Vibes",
    artwork: "https://via.placeholder.com/400x400/ff6b6b/ffffff?text=🎵",
    duration: 225,
    type: "song",
  },
  {
    id: "ra2",
    title: "Electric Pulse",
    artist: "Neon Waves",
    album: "Digital Horizon",
    artwork: "https://via.placeholder.com/400x400/4ecdc4/ffffff?text=🎵",
    duration: 198,
    type: "song",
  },
  // Recently added video
  {
    id: "rav1",
    title: "Blinding Lights (Official Music Video)",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "rav2",
    title: "7 rings (Official Video)",
    artist: "Ariana Grande",
    album: "Thank U, Next",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 178,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  // Recently added live performance video
  {
    id: "ralp1",
    title: "Live at Madison Square Garden",
    artist: "Luna Echo",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 300,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Live Performance",
  },
  // Recently added podcast
  {
    id: "rap1",
    title: "The Future of AI Technology",
    artist: "Tech Insights Daily",
    artwork: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    duration: 2850,
    type: "podcast",
    description: "Deep dive into artificial intelligence trends",
  },
  {
    id: "rap2",
    title: "Mind & Body Wellness",
    artist: "Wellness Warriors",
    artwork: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    duration: 1800,
    type: "podcast",
    description: "Health and wellness tips for daily life",
  },
  // Recently added audiobook
  {
    id: "raa1",
    title: "The Psychology of Success",
    artist: "Dr. Sarah Johnson",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 21600,
    type: "audiobook",
    description: "Understanding the mindset of high achievers",
  },
  {
    id: "raa2",
    title: "Digital Minimalism",
    artist: "Cal Newport",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 19800,
    type: "audiobook",
    description: "A philosophy for technology in a cluttered world",
  },
  // More recently added music
  {
    id: "ra3",
    title: "Golden Hour",
    artist: "Sunset Boulevard",
    album: "California Dreams",
    artwork: "https://via.placeholder.com/400x400/45b7d1/ffffff?text=🎵",
    duration: 242,
    type: "song",
  },
  {
    id: "ra4",
    title: "Future Bass",
    artist: "Tomorrow Sound",
    album: "Next Generation",
    artwork: "https://via.placeholder.com/400x400/7fb3d3/ffffff?text=🎵",
    duration: 178,
    type: "song",
  },
  // Recently added podcast episode
  {
    id: "rap3",
    title: "True Crime: The Missing Hour",
    artist: "Mystery Files Podcast",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3240,
    type: "podcast",
    description: "Investigating unsolved mysteries from around the world",
  },
  // Recently added music video
  {
    id: "rav3",
    title: "Starboy (Official Video)",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 230,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  // Recently added audiobook
  {
    id: "raa3",
    title: "Atomic Habits",
    artist: "James Clear",
    artwork: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: 19800,
    type: "audiobook",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
  },
];

export const topCharts: Track[] = [
  {
    id: "7",
    title: "Starlight",
    artist: "Cosmic Dreams",
    album: "Galaxy Express",
    artwork: "https://via.placeholder.com/400x400/f8c471/ffffff?text=🎵",
    duration: 234,
    type: "song",
  },
  {
    id: "8",
    title: "Thunder Road",
    artist: "Lightning Strike",
    album: "Storm Chaser",
    artwork: "https://via.placeholder.com/400x400/82e0aa/ffffff?text=🎵",
    duration: 267,
    type: "song",
  },
  {
    id: "9",
    title: "Crystal Clear",
    artist: "Diamond Sky",
    album: "Precious Moments",
    artwork: "https://via.placeholder.com/400x400/f1948a/ffffff?text=🎵",
    duration: 189,
    type: "song",
  },
  {
    id: "10",
    title: "Velvet Dreams",
    artist: "Silk Road",
    album: "Smooth Journey",
    artwork: "https://via.placeholder.com/400x400/c39bd3/ffffff?text=🎵",
    duration: 212,
    type: "song",
  },
];

// Most Viewed Video Content - All videos, no audio
export const mostViewedVideos: Track[] = [
  {
    id: "mv1",
    title: "Blinding Lights (Official Music Video)",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv2",
    title: "7 rings (Official Video)",
    artist: "Ariana Grande",
    album: "Thank U, Next",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 178,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv3",
    title: "Firework (Official Music Video)",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 228,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv4",
    title: "Starboy (Official Video)",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 230,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv5",
    title: "Bad Guy (Official Video)",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 194,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv6",
    title: "Shape of You (Official Video)",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 233,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv7",
    title: "Uptown Funk (Official Video)",
    artist: "Mark Ronson ft. Bruno Mars",
    album: "Uptown Special",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 270,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv8",
    title: "Despacito (Official Video)",
    artist: "Luis Fonsi ft. Daddy Yankee",
    album: "Vida",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 229,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv9",
    title: "Gangnam Style (Official Video)",
    artist: "PSY",
    album: "Psy 6 (Six Rules), Part 1",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 252,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Most Viewed",
  },
  {
    id: "mv10",
    title: "See You Again (Official Video)",
    artist: "Wiz Khalifa ft. Charlie Puth",
    album: "Furious 7 Soundtrack",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 229,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Most Viewed",
  },
];

// Live Performance Video Content - All video, no audio
export const livePerformanceVideos: Track[] = [
  {
    id: "lp1",
    title: "Live at Madison Square Garden",
    artist: "Luna Echo",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 300,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Live Performance",
  },
  {
    id: "lp2",
    title: "Electric Pulse - Live Concert",
    artist: "Neon Waves",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 420,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "Live Performance",
  },
  {
    id: "lp3",
    title: "Golden Hour - Acoustic Live",
    artist: "Sunset Boulevard",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 280,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Live Performance",
  },
  {
    id: "lp4",
    title: "Thunder Road - Live at Wembley",
    artist: "Lightning Strike",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 350,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Live Performance",
  },
  {
    id: "lp5",
    title: "Crystal Clear - Unplugged Session",
    artist: "Diamond Sky",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 240,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Live Performance",
  },
  {
    id: "lp6",
    title: "Velvet Dreams - Live Orchestra",
    artist: "Silk Road",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 320,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Live Performance",
  },
  {
    id: "lp7",
    title: "Starlight - Festival Performance",
    artist: "Cosmic Dreams",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 380,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "Live Performance",
  },
  {
    id: "lp8",
    title: "Ocean Waves - Beach Concert",
    artist: "Coastal Breeze",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 290,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "Live Performance",
  },
];

export const newReleases: Track[] = [
  {
    id: "11",
    title: "Future Bass",
    artist: "Tomorrow Sound",
    album: "Next Generation",
    artwork: "https://via.placeholder.com/400x400/7fb3d3/ffffff?text=🎵",
    duration: 178,
    type: "song",
  },
  {
    id: "12",
    title: "Retro Wave",
    artist: "Vintage Vibes",
    album: "Back to 80s",
    artwork: "https://via.placeholder.com/400x400/f4d03f/ffffff?text=🎵",
    duration: 203,
    type: "song",
  },
  {
    id: "13",
    title: "Jazz Fusion",
    artist: "Blue Note",
    album: "Modern Classic",
    artwork: "https://via.placeholder.com/400x400/58d68d/ffffff?text=🎵",
    duration: 256,
    type: "song",
  },
  {
    id: "14",
    title: "Latin Heat",
    artist: "Salsa Kings",
    album: "Tropical Nights",
    artwork: "https://via.placeholder.com/400x400/ec7063/ffffff?text=🎵",
    duration: 194,
    type: "song",
  },
  // Add music video to new releases
  {
    id: "v3",
    title: "7 rings (Official Video)",
    artist: "Ariana Grande",
    album: "Thank U, Next",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 178,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

export const podcasts: Track[] = [
  {
    id: "p1",
    title: "Tech Talk Daily",
    artist: "Silicon Valley Insider",
    artwork: "https://via.placeholder.com/400x400/af7ac5/ffffff?text=🎙️",
    duration: 2400,
    type: "podcast",
    description: "Latest tech news and insights",
  },
  {
    id: "p2",
    title: "Mind & Body",
    artist: "Wellness Warriors",
    artwork: "https://via.placeholder.com/400x400/5dade2/ffffff?text=🎙️",
    duration: 1800,
    type: "podcast",
    description: "Health and wellness tips",
  },
  {
    id: "p3",
    title: "True Crime Files",
    artist: "Mystery Hunters",
    artwork: "https://via.placeholder.com/400x400/f39c12/ffffff?text=🎙️",
    duration: 3600,
    type: "podcast",
    description: "Unsolved mysteries explored",
  },
  {
    id: "p4",
    title: "Comedy Central",
    artist: "Laugh Factory",
    artwork: "https://via.placeholder.com/400x400/2ecc71/ffffff?text=🎙️",
    duration: 2700,
    type: "podcast",
    description: "Daily dose of humor",
  },
  {
    id: "p5",
    title: "Miss You",
    artist: "Oliver Tree, Robin Schulz",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 185,
    type: "podcast",
    description: "A deep dive into modern relationships and emotional connections",
  },
];

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  transcript?: string;
  hostInfo?: {
    name: string;
    bio: string;
    image: string;
    followers: string;
  };
  liveEvents?: {
    title: string;
    date: string;
    image: string;
  }[];
}

export const podcastEpisodes: Record<string, PodcastEpisode> = {
  p5: {
    id: "p5",
    title: "Miss You",
    description: "A deep dive into modern relationships and emotional connections",
    transcript: "Don't remind me\nI'm minding my own damn business\nDon't try to find me\nI'm better left alone than in this\nIt doesn't surprise me\nDo you really think that I could care",
    hostInfo: {
      name: "Oliver Tree",
      bio: "An internet-based vocalist, producer, writer, director and performance artist, oliver tree...",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      followers: "24,419,528 monthly listeners"
    },
    liveEvents: [
      {
        title: "Jun 9 - Aug 25",
        date: "4 events on tour",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=200&fit=crop"
      }
    ]
  }
};

export interface AudiobookDetails {
  id: string;
  title: string;
  author: string;
  artwork: string;
  duration: number;
  rating: number;
  genres: string[];
  summary: string;
  chapters: {
    id: string;
    title: string;
    duration: number;
    startTime: number;
  }[];
  content?: string;
}

export const audiobooks: Track[] = [
  {
    id: "a1",
    title: "Harry Potter and the Sorcerer's Stone",
    artist: "J.K. Rowling",
    artwork: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: 28620, // 477 minutes
    type: "audiobook",
    description: "The first book in the beloved Harry Potter series",
  },
  {
    id: "a2",
    title: "The Silence",
    artist: "Mark Alpert",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 21600,
    type: "audiobook",
    description: "A thrilling science fiction novel",
  },
  {
    id: "a3",
    title: "The Speaker",
    artist: "Traci Chee",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    duration: 19800,
    type: "audiobook",
    description: "Book two of Sea of Ink and Gold",
  },
  {
    id: "a4",
    title: "Light Mage",
    artist: "Laurie Forest",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 25200,
    type: "audiobook",
    description: "A fantasy adventure",
  },
  {
    id: "a5",
    title: "Atomic Habits",
    artist: "James Clear",
    artwork: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    duration: 19800, // 330 minutes
    type: "audiobook",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
  },
  {
    id: "a6",
    title: "The Psychology of Money",
    artist: "Morgan Housel",
    artwork: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=600&fit=crop",
    duration: 16200, // 270 minutes
    type: "audiobook",
    description: "Timeless lessons on wealth, greed, and happiness",
  },
  {
    id: "a7",
    title: "Educated",
    artist: "Tara Westover",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    duration: 22800, // 380 minutes
    type: "audiobook",
    description: "A Memoir - A powerful story of education and transformation",
  },
  {
    id: "a8",
    title: "The Seven Husbands of Evelyn Hugo",
    artist: "Taylor Jenkins Reid",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 20400, // 340 minutes
    type: "audiobook",
    description: "A captivating novel about Hollywood's golden age",
  },
  {
    id: "a9",
    title: "Sapiens",
    artist: "Yuval Noah Harari",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 27000, // 450 minutes
    type: "audiobook",
    description: "A Brief History of Humankind",
  },
  {
    id: "a10",
    title: "The Midnight Library",
    artist: "Matt Haig",
    artwork: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: 18000, // 300 minutes
    type: "audiobook",
    description: "A novel about all the choices that go into a life well lived",
  },
  {
    id: "a11",
    title: "Becoming",
    artist: "Michelle Obama",
    artwork: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    duration: 25200, // 420 minutes
    type: "audiobook",
    description: "An intimate, powerful, and inspiring memoir",
  },
  {
    id: "a12",
    title: "The Alchemist",
    artist: "Paulo Coelho",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    duration: 14400, // 240 minutes
    type: "audiobook",
    description: "A magical story about following your dreams",
  },
  {
    id: "a13",
    title: "Where the Crawdads Sing",
    artist: "Delia Owens",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 21600, // 360 minutes
    type: "audiobook",
    description: "A coming-of-age mystery set in the marshlands of North Carolina",
  },
  {
    id: "a14",
    title: "The Power of Now",
    artist: "Eckhart Tolle",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 16800, // 280 minutes
    type: "audiobook",
    description: "A Guide to Spiritual Enlightenment",
  },
  {
    id: "a15",
    title: "The Subtle Art of Not Giving a F*ck",
    artist: "Mark Manson",
    artwork: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: 18000, // 300 minutes
    type: "audiobook",
    description: "A Counterintuitive Approach to Living a Good Life",
  },
];

export const audiobookDetails: Record<string, AudiobookDetails> = {
  a1: {
    id: "a1",
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    artwork: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: 28620,
    rating: 4.8,
    genres: ["Fantasy", "Young Adult", "Adventure"],
    summary: "Harry Potter's third year at Hogwarts is full of new dangers. A convicted murderer, Sirius Black, has broken out of Azkaban prison, and it seems he's after Harry. In the meantime, the school is being guarded by the terrifying Dementors, and Harry's feeling the effects of their presence more than his classmates. What's an aspiring wizard to do?",
    chapters: [
      { id: "ch1", title: "Chapter 1: Owl Post", duration: 1260, startTime: 0 },
      { id: "ch2", title: "Chapter 2: Aunt Marge's Big Mistake", duration: 1380, startTime: 1260 },
      { id: "ch3", title: "Chapter 3: The Knight Bus", duration: 1200, startTime: 2640 },
      { id: "ch4", title: "Chapter 4: The Leaky Cauldron", duration: 1440, startTime: 3840 },
      { id: "ch5", title: "Chapter 5: The Dementor", duration: 1320, startTime: 5280 },
    ],
    content: `Harry Potter was spending another miserable summer with the Dursleys, when the matter was taken out of his hands. After an incident with Aunt Marge, Harry ran away from Privet Drive and was picked up by the Knight Bus, which took him to the Leaky Cauldron.

At the Leaky Cauldron, Harry learned that Sirius Black, a convicted murderer and Voldemort supporter, had escaped from Azkaban prison and was believed to be after Harry. The Ministry of Magic was taking no chances - Dementors were stationed around Hogwarts to protect the school.

Back at Hogwarts for his third year, Harry found the atmosphere changed. The Dementors affected him more than other students, causing him to hear his mother's last moments. Professor Lupin, the new Defense Against the Dark Arts teacher, taught Harry to cast a Patronus charm to repel the Dementors.

As the year progressed, Harry learned shocking truths about his past, including the real story behind his parents' death and the identity of their betrayer. The climax came when Harry discovered that Sirius Black was not the villain he had been led to believe, but rather his godfather who had been wrongly imprisoned.`
  },
  a2: {
    id: "a2",
    title: "The Silence",
    author: "Mark Alpert",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 21600,
    rating: 4.2,
    genres: ["Science Fiction", "Thriller", "Mystery"],
    summary: "In this gripping science fiction thriller, a mysterious signal from space threatens to silence all electronic communication on Earth. As governments scramble to understand the phenomenon, a small team of scientists races against time to prevent a global catastrophe that could end civilization as we know it.",
    chapters: [
      { id: "ch1", title: "Chapter 1: The Signal", duration: 1080, startTime: 0 },
      { id: "ch2", title: "Chapter 2: First Contact", duration: 1200, startTime: 1080 },
      { id: "ch3", title: "Chapter 3: The Blackout", duration: 1320, startTime: 2280 },
      { id: "ch4", title: "Chapter 4: Underground", duration: 1140, startTime: 3600 },
      { id: "ch5", title: "Chapter 5: The Truth", duration: 1260, startTime: 4740 },
    ],
    content: `Dr. Sarah Chen stared at the data streaming across her monitor, her coffee growing cold as the implications became clear. The signal wasn't random noise from deep space—it was structured, purposeful, and getting stronger by the hour.

"This can't be right," she whispered, running the analysis for the third time. The pattern was unmistakable: a complex mathematical sequence that seemed to be learning, adapting, evolving with each transmission.

Across the lab, her colleague Dr. Marcus Webb looked up from his own workstation. "Sarah, you need to see this. Every satellite in the northern hemisphere just went dark."

The silence that followed wasn't just the absence of sound—it was the absence of everything electronic. No cell phones, no internet, no GPS. In a matter of hours, the modern world had been thrust back into the dark ages, and the signal from space was just getting started.`
  },
  a3: {
    id: "a3",
    title: "The Speaker",
    author: "Traci Chee",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    duration: 19800,
    rating: 4.5,
    genres: ["Fantasy", "Young Adult", "Adventure"],
    summary: "In the second book of the Sea of Ink and Gold trilogy, Sefia continues her quest to understand the power of the Book while navigating a world where reading is forbidden. As she searches for the boy who was taken from her, she discovers that some stories have the power to change the world.",
    chapters: [
      { id: "ch1", title: "Chapter 1: The Hunt", duration: 990, startTime: 0 },
      { id: "ch2", title: "Chapter 2: Memories in Ink", duration: 1080, startTime: 990 },
      { id: "ch3", title: "Chapter 3: The Speaker's Tale", duration: 1200, startTime: 2070 },
      { id: "ch4", title: "Chapter 4: Words of Power", duration: 1140, startTime: 3270 },
      { id: "ch5", title: "Chapter 5: The Final Chapter", duration: 1020, startTime: 4410 },
    ],
    content: `Sefia traced the symbols on the page with her finger, feeling the familiar tingle of magic that came with reading. In a world where books were burned and literacy was punishable by death, she possessed the most dangerous skill of all.

The Book had shown her visions of the future—glimpses of what could be if she made the right choices. But with each page she turned, she realized that the power to read came with a terrible price. The stories weren't just words on a page; they were prophecies, and she was both their reader and their subject.

"Every story needs a speaker," the old woman had told her. "Someone to give voice to the words that would otherwise remain silent." Now Sefia understood what that meant. She wasn't just reading the story—she was living it, and the fate of everyone she loved hung in the balance.`
  },
  a4: {
    id: "a4",
    title: "Light Mage",
    author: "Laurie Forest",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 25200,
    rating: 4.3,
    genres: ["Fantasy", "Romance", "Magic"],
    summary: "In a world where magical power determines social status, Elloren Gardner discovers she possesses a rare and dangerous gift. As she navigates the treacherous politics of the magical academy, she must choose between the safety of conformity and the courage to fight for what's right.",
    chapters: [
      { id: "ch1", title: "Chapter 1: The Awakening", duration: 1260, startTime: 0 },
      { id: "ch2", title: "Chapter 2: Academy of Shadows", duration: 1380, startTime: 1260 },
      { id: "ch3", title: "Chapter 3: Light and Dark", duration: 1200, startTime: 2640 },
      { id: "ch4", title: "Chapter 4: The Resistance", duration: 1320, startTime: 3840 },
      { id: "ch5", title: "Chapter 5: The Light Within", duration: 1440, startTime: 5160 },
    ],
    content: `Elloren had always believed she was powerless, just another Gardnerian girl destined for a quiet life of domestic service. But when the testing revealed her true nature, everything changed.

"Light Mage," the examiner had whispered, his face pale with shock. "We haven't seen one in over a century."

Now, standing in the grand hall of the Verpax University, surrounded by students who wielded fire and shadow with casual ease, Elloren felt the weight of her newfound power pressing down on her shoulders. The light that flowed through her veins was both a gift and a curse, marking her as either a savior or a target.

As she watched her classmates practice their dark arts, she realized that in a world built on the oppression of the powerless, being different wasn't just dangerous—it was revolutionary.`
  },
  r1: {
    id: "r1",
    title: "The Silence",
    author: "Mark Alpert",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 21600,
    rating: 4.2,
    genres: ["Science Fiction", "Thriller", "Mystery"],
    summary: "In this gripping science fiction thriller, a mysterious signal from space threatens to silence all electronic communication on Earth. As governments scramble to understand the phenomenon, a small team of scientists races against time to prevent a global catastrophe that could end civilization as we know it.",
    chapters: [
      { id: "ch1", title: "Chapter 1: The Signal", duration: 1080, startTime: 0 },
      { id: "ch2", title: "Chapter 2: First Contact", duration: 1200, startTime: 1080 },
      { id: "ch3", title: "Chapter 3: The Blackout", duration: 1320, startTime: 2280 },
      { id: "ch4", title: "Chapter 4: Underground", duration: 1140, startTime: 3600 },
      { id: "ch5", title: "Chapter 5: The Truth", duration: 1260, startTime: 4740 },
    ],
    content: `Dr. Sarah Chen stared at the data streaming across her monitor, her coffee growing cold as the implications became clear. The signal wasn't random noise from deep space—it was structured, purposeful, and getting stronger by the hour.

"This can't be right," she whispered, running the analysis for the third time. The pattern was unmistakable: a complex mathematical sequence that seemed to be learning, adapting, evolving with each transmission.

Across the lab, her colleague Dr. Marcus Webb looked up from his own workstation. "Sarah, you need to see this. Every satellite in the northern hemisphere just went dark."

The silence that followed wasn't just the absence of sound—it was the absence of everything electronic. No cell phones, no internet, no GPS. In a matter of hours, the modern world had been thrust back into the dark ages, and the signal from space was just getting started.`
  },
  r2: {
    id: "r2",
    title: "The Speaker",
    author: "Traci Chee",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    duration: 19800,
    rating: 4.5,
    genres: ["Fantasy", "Young Adult", "Adventure"],
    summary: "In the second book of the Sea of Ink and Gold trilogy, Sefia continues her quest to understand the power of the Book while navigating a world where reading is forbidden. As she searches for the boy who was taken from her, she discovers that some stories have the power to change the world.",
    chapters: [
      { id: "ch1", title: "Chapter 1: The Hunt", duration: 990, startTime: 0 },
      { id: "ch2", title: "Chapter 2: Memories in Ink", duration: 1080, startTime: 990 },
      { id: "ch3", title: "Chapter 3: The Speaker's Tale", duration: 1200, startTime: 2070 },
      { id: "ch4", title: "Chapter 4: Words of Power", duration: 1140, startTime: 3270 },
      { id: "ch5", title: "Chapter 5: The Final Chapter", duration: 1020, startTime: 4410 },
    ],
    content: `Sefia traced the symbols on the page with her finger, feeling the familiar tingle of magic that came with reading. In a world where books were burned and literacy was punishable by death, she possessed the most dangerous skill of all.

The Book had shown her visions of the future—glimpses of what could be if she made the right choices. But with each page she turned, she realized that the power to read came with a terrible price. The stories weren't just words on a page; they were prophecies, and she was both their reader and their subject.

"Every story needs a speaker," the old woman had told her. "Someone to give voice to the words that would otherwise remain silent." Now Sefia understood what that meant. She wasn't just reading the story—she was living it, and the fate of everyone she loved hung in the balance.`
  },
  bs1: {
    id: "bs1",
    title: "Light Mage",
    author: "Laurie Forest",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 25200,
    rating: 4.3,
    genres: ["Fantasy", "Romance", "Magic"],
    summary: "In a world where magical power determines social status, Elloren Gardner discovers she possesses a rare and dangerous gift. As she navigates the treacherous politics of the magical academy, she must choose between the safety of conformity and the courage to fight for what's right.",
    chapters: [
      { id: "ch1", title: "Chapter 1: The Awakening", duration: 1260, startTime: 0 },
      { id: "ch2", title: "Chapter 2: Academy of Shadows", duration: 1380, startTime: 1260 },
      { id: "ch3", title: "Chapter 3: Light and Dark", duration: 1200, startTime: 2640 },
      { id: "ch4", title: "Chapter 4: The Resistance", duration: 1320, startTime: 3840 },
      { id: "ch5", title: "Chapter 5: The Light Within", duration: 1440, startTime: 5160 },
    ],
    content: `Elloren had always believed she was powerless, just another Gardnerian girl destined for a quiet life of domestic service. But when the testing revealed her true nature, everything changed.

"Light Mage," the examiner had whispered, his face pale with shock. "We haven't seen one in over a century."

Now, standing in the grand hall of the Verpax University, surrounded by students who wielded fire and shadow with casual ease, Elloren felt the weight of her newfound power pressing down on her shoulders. The light that flowed through her veins was both a gift and a curse, marking her as either a savior or a target.

As she watched her classmates practice their dark arts, she realized that in a world built on the oppression of the powerless, being different wasn't just dangerous—it was revolutionary.`
  },
  nr1: {
    id: "nr1",
    title: "The Prisoner",
    author: "Laurie Forest",
    artwork: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: 22800,
    rating: 4.1,
    genres: ["Fantasy", "Adventure", "Magic"],
    summary: "A captivating fantasy adventure that follows a young prisoner who discovers they hold the key to an ancient prophecy. As dark forces gather, they must escape their bonds and embrace their destiny to save their world from eternal darkness.",
    chapters: [
      { id: "ch1", title: "Chapter 1: The Cell", duration: 1140, startTime: 0 },
      { id: "ch2", title: "Chapter 2: Whispers in the Dark", duration: 1200, startTime: 1140 },
      { id: "ch3", title: "Chapter 3: The Escape", duration: 1320, startTime: 2340 },
      { id: "ch4", title: "Chapter 4: Ancient Secrets", duration: 1260, startTime: 3660 },
      { id: "ch5", title: "Chapter 5: The Prophecy", duration: 1380, startTime: 4920 },
    ],
    content: `The stone walls of the prison cell had become as familiar as breathing to Kael. Three years he had spent in this darkness, three years since the night his village burned and he was accused of crimes he didn't commit.

But tonight was different. Tonight, the whispers in the walls spoke louder than ever, and the strange mark on his palm—the one that had appeared the day of his arrest—began to glow with an otherworldly light.

"The time has come," a voice echoed in his mind, ancient and powerful. "The chains that bind you are nothing compared to the chains that bind this world. Break free, young one, and fulfill your destiny."

As the cell door creaked open on its own, Kael realized that his imprisonment had not been a punishment—it had been preparation.`
  },
  nr2: {
    id: "nr2",
    title: "The Prisoner",
    author: "B.A. Paris",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 18000,
    rating: 4.4,
    genres: ["Thriller", "Psychological", "Mystery"],
    summary: "A psychological thriller that will keep you on the edge of your seat. When Amelie wakes up in a locked room with no memory of how she got there, she must piece together the truth before it's too late. But some secrets are better left buried.",
    chapters: [
      { id: "ch1", title: "Chapter 1: Awakening", duration: 900, startTime: 0 },
      { id: "ch2", title: "Chapter 2: The Room", duration: 1080, startTime: 900 },
      { id: "ch3", title: "Chapter 3: Fragments", duration: 1200, startTime: 1980 },
      { id: "ch4", title: "Chapter 4: The Truth", duration: 1140, startTime: 3180 },
      { id: "ch5", title: "Chapter 5: Escape", duration: 1020, startTime: 4320 },
    ],
    content: `Amelie's eyes fluttered open to unfamiliar surroundings. The room was small, windowless, with walls painted a sterile white that hurt to look at. A single bulb hung from the ceiling, casting harsh shadows in every corner.

She tried to remember how she'd gotten here, but her mind was a blank slate. The last thing she could recall was leaving work on Friday evening, walking to her car in the parking garage. Everything after that was darkness.

A tray of food sat on a small table beside the bed—fresh bread, water, and what looked like soup. Someone had been taking care of her, but who? And why couldn't she remember?

As she stood on shaky legs, she noticed something that made her blood run cold. The door had no handle on the inside.`
  },
};

export const audiobookCategories = [
  {
    id: "fiction",
    title: "Fiction",
    color: "#C53030",
  },
  {
    id: "non-fiction",
    title: "Non-Fiction",
    color: "#2D3748",
  },
  {
    id: "self-help",
    title: "Self-Help",
    color: "#38A169",
  },
  {
    id: "business",
    title: "Business",
    color: "#3182CE",
  },
  {
    id: "biography",
    title: "Biography",
    color: "#805AD5",
  },
  {
    id: "fantasy",
    title: "Fantasy",
    color: "#E53E3E",
  },
  {
    id: "mystery",
    title: "Mystery",
    color: "#D69E2E",
  },
  {
    id: "romance",
    title: "Romance",
    color: "#ED64A6",
  },
  {
    id: "science",
    title: "Science",
    color: "#319795",
  },
  {
    id: "history",
    title: "History",
    color: "#DD6B20",
  },
];

export const recommendedAudiobooks: Track[] = [
  {
    id: "r1",
    title: "The Silence",
    artist: "Mark Alpert",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 21600,
    type: "audiobook",
    description: "A thrilling science fiction novel",
  },
  {
    id: "r2",
    title: "The Speaker",
    artist: "Traci Chee",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    duration: 19800,
    type: "audiobook",
    description: "Book two of Sea of Ink and Gold",
  },
];

export const bestSellerAudiobooks: Track[] = [
  {
    id: "bs1",
    title: "Light Mage",
    artist: "Laurie Forest",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 25200,
    type: "audiobook",
    description: "1000+ Listeners",
  },
];

export const newReleaseAudiobooks: Track[] = [
  {
    id: "nr1",
    title: "The Prisoner",
    artist: "Laurie Forest",
    artwork: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: 22800,
    type: "audiobook",
    description: "New release fantasy novel",
  },
  {
    id: "nr2",
    title: "The Prisoner",
    artist: "B.A. Paris",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 18000,
    type: "audiobook",
    description: "Psychological thriller",
  },
];

// Add more realistic search data
export const searchAlbums = [
  {
    id: 'sweetener',
    title: 'Sweetener',
    artist: 'Ariana Grande',
    year: '2018',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'dangerous-woman',
    title: 'Dangerous Woman',
    artist: 'Ariana Grande',
    year: '2016',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'yours-truly',
    title: 'Yours Truly',
    artist: 'Ariana Grande',
    year: '2013',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'my-everything',
    title: 'My Everything',
    artist: 'Ariana Grande',
    year: '2014',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    year: '2016',
    artwork: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'after-hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    year: '2020',
    artwork: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
];

export const searchTracks: Track[] = [
  {
    id: "s1",
    title: "Firework",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 228,
    type: "song",
  },
  {
    id: "s2",
    title: "Firework - Acoustic",
    artist: "The Mayries",
    album: "Acoustic Sessions",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 195,
    type: "song",
  },
  {
    id: "s3",
    title: "Last Friday Night",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 231,
    type: "song",
  },
  {
    id: "s4",
    title: "Firework Cover",
    artist: "The Sapphear",
    album: "Cover Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 210,
    type: "song",
  },
  {
    id: "s5",
    title: "Teenage Dream",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 225,
    type: "song",
  },
  {
    id: "s6",
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 230,
    type: "song",
  },
  {
    id: "s7",
    title: "Starboy Speed Up",
    artist: "Just Lowkey",
    album: "Speed Up Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 180,
    type: "song",
  },
  {
    id: "s8",
    title: "Die For You",
    artist: "The Weeknd",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 260,
    type: "song",
  },
  {
    id: "s9",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "song",
  },
  {
    id: "s10",
    title: "The Hills",
    artist: "The Weeknd",
    album: "Beauty Behind the Madness",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 242,
    type: "song",
  },
  {
    id: "s11",
    title: "I Feel It Coming",
    artist: "The Weeknd, Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 269,
    type: "song",
  },
  {
    id: "s12",
    title: "Call Out My Name",
    artist: "The Weeknd",
    album: "My Dear Melancholy,",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 228,
    type: "song",
  },
  {
    id: "s13",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 215,
    type: "song",
  },
  {
    id: "s14",
    title: "Roar",
    artist: "Katy Perry",
    album: "Prism",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 223,
    type: "song",
  },
  {
    id: "s15",
    title: "Side to Side",
    artist: "Ariana Grande",
    album: "Dangerous Woman",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 226,
    type: "song",
  },
  {
    id: "s16",
    title: "7 Rings",
    artist: "Ariana Grande",
    album: "Thank U, Next",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 178,
    type: "song",
  },
  {
    id: "s17",
    title: "Stuck With U",
    artist: "Ariana Grande",
    album: "Stuck With U",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 228,
    type: "song",
  },
];

export const searchArtists = [
  {
    id: "sa1",
    name: "Ariana Grande",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "55,278,829",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa2",
    name: "Katy Perry",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "45.2M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa3",
    name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "92.1M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa4",
    name: "Acidrap",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "45.8M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa5",
    name: "Ryan Jones",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "12.3M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa6",
    name: "Troye Sivan",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "34.5M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa7",
    name: "James Gray",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "28.7M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa8",
    name: "Clean Bandit",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    followers: "12.8M",
    verified: true,
    type: "artist" as const,
  },
];

// Jordan Harbinger Show Episodes
export const jordanHarbingerEpisodes: Track[] = [
  {
    id: "jh1",
    title: "691: Shaquille O'Neal | Circling Back on Flat Earth Theory",
    artist: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 2906, // 48:26 mins
    type: "podcast",
    description: "The Jordan Harbinger Show",
  },
  {
    id: "jh2",
    title: "692: Jane McGonigal | How to See the Future Coming and Feel Ready for Anything",
    artist: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3240, // 54 mins
    type: "podcast",
    description: "The Jordan Harbinger Show",
  },
];

// Twenty Thousand Hertz Episodes
export const twentyThousandHertzEpisodes: Track[] = [
  {
    id: "tth1",
    title: "688: A-Rod | Still Having a Ball After All",
    artist: "Twenty Thousand Hertz",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2956, // 49:26 mins
    type: "podcast",
    description: "Twenty Thousand Hertz",
  },
];

// Hidden Brain Episodes
export const hiddenBrainEpisodes: Track[] = [
  {
    id: "hb1",
    title: "837: Amy Webb | Changing Lives with Synthetic Biology",
    artist: "Hidden Brain",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 3288, // 54:48 mins
    type: "podcast",
    description: "Hidden Brain",
  },
];

// SaaS & Scotch Episodes
export const saasScotchEpisodes: Track[] = [
  {
    id: "ss1",
    title: "593: Chris Voss | Hostage Negotiation Tactics for Everyday Life",
    artist: "SaaS & Scotch",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 2617, // 43:37 mins
    type: "podcast",
    description: "SaaS & Scotch",
  },
];

// More podcast shows with episodes
export const appleTalkEpisodes: Track[] = [
  {
    id: "at1",
    title: "968: The Future of Apple Intelligence",
    artist: "Apple Talk",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2400,
    type: "podcast",
    description: "Apple Talk",
  },
  {
    id: "at2",
    title: "967: iOS 18 Deep Dive Review",
    artist: "Apple Talk",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2700,
    type: "podcast",
    description: "Apple Talk",
  },
];

export const drDeathEpisodes: Track[] = [
  {
    id: "dd1",
    title: "837: The Surgeon's Secret",
    artist: "Dr. Death",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3200,
    type: "podcast",
    description: "Dr. Death",
  },
  {
    id: "dd2",
    title: "836: Medical Malpractice Exposed",
    artist: "Dr. Death",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 2900,
    type: "podcast",
    description: "Dr. Death",
  },
];

export const investLikeTheBestEpisodes: Track[] = [
  {
    id: "iltb1",
    title: "493: Warren Buffett's Investment Philosophy",
    artist: "Invest Like The Best",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 3600,
    type: "podcast",
    description: "Invest Like The Best",
  },
  {
    id: "iltb2",
    title: "492: The Future of Venture Capital",
    artist: "Invest Like The Best",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 2800,
    type: "podcast",
    description: "Invest Like The Best",
  },
];

export const breakfastClubEpisodes: Track[] = [
  {
    id: "bc1",
    title: "682: Celebrity Interview Special",
    artist: "The Breakfast Club",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 4200,
    type: "podcast",
    description: "The Breakfast Club",
  },
  {
    id: "bc2",
    title: "681: Hip-Hop Culture Discussion",
    artist: "The Breakfast Club",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 3900,
    type: "podcast",
    description: "The Breakfast Club",
  },
];

export const whatADayEpisodes: Track[] = [
  {
    id: "wad1",
    title: "934: Today's Political Landscape",
    artist: "What a Day",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 1800,
    type: "podcast",
    description: "What a Day",
  },
  {
    id: "wad2",
    title: "933: Breaking News Analysis",
    artist: "What a Day",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 1650,
    type: "podcast",
    description: "What a Day",
  },
];

// All podcast episodes combined
export const allPodcastEpisodes: Track[] = [
  ...jordanHarbingerEpisodes,
  ...twentyThousandHertzEpisodes,
  ...hiddenBrainEpisodes,
  ...saasScotchEpisodes,
  ...appleTalkEpisodes,
  ...drDeathEpisodes,
  ...investLikeTheBestEpisodes,
  ...breakfastClubEpisodes,
  ...whatADayEpisodes,
];

// Trending Videos - Only video content, no audio
export const trendingVideos: Track[] = [
  {
    id: "tv1",
    title: "Blinding Lights (Official Music Video)",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Trending Video",
  },
  {
    id: "tv2",
    title: "Anti-Hero (Music Video)",
    artist: "Taylor Swift",
    album: "Midnights",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 201,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Trending Video",
  },
  {
    id: "tv3",
    title: "As It Was (Official Video)",
    artist: "Harry Styles",
    album: "Harry's House",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 167,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Trending Video",
  },
  {
    id: "tv4",
    title: "Bad Habit (Official Video)",
    artist: "Steve Lacy",
    album: "Gemini Rights",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 221,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Trending Video",
  },
  {
    id: "tv5",
    title: "Unholy (Official Video)",
    artist: "Sam Smith ft. Kim Petras",
    album: "Gloria",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 156,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Trending Video",
  },
  {
    id: "tv6",
    title: "Flowers (Official Video)",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Trending Video",
  },
  {
    id: "tv7",
    title: "Watermelon Sugar (Official Video)",
    artist: "Harry Styles",
    album: "Fine Line",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 174,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "Trending Video",
  },
  {
    id: "tv8",
    title: "Good 4 U (Official Video)",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 178,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "Trending Video",
  },
  {
    id: "tv9",
    title: "Heat Waves (Official Video)",
    artist: "Glass Animals",
    album: "Dreamland",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 238,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "Trending Video",
  },
  {
    id: "tv10",
    title: "Industry Baby (Official Video)",
    artist: "Lil Nas X ft. Jack Harlow",
    album: "MONTERO",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 212,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Trending Video",
  },
  {
    id: "tv11",
    title: "Levitating (Official Video)",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 203,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Trending Video",
  },
  {
    id: "tv12",
    title: "Stay (Official Video)",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 141,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Trending Video",
  },
  {
    id: "tv13",
    title: "Peaches (Official Video)",
    artist: "Justin Bieber ft. Daniel Caesar & Giveon",
    album: "Justice",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 198,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Trending Video",
  },
  {
    id: "tv14",
    title: "Montero (Call Me By Your Name) (Official Video)",
    artist: "Lil Nas X",
    album: "MONTERO",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 137,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Trending Video",
  },
  {
    id: "tv15",
    title: "Positions (Official Video)",
    artist: "Ariana Grande",
    album: "Positions",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 172,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "Trending Video",
  },
];

// Video content
export const videoTracks: Track[] = [
  {
    id: "v1",
    title: "Blinding Lights (Official Music Video)",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "v2",
    title: "Starboy (Official Video)",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 230,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "v3",
    title: "7 rings (Official Video)",
    artist: "Ariana Grande",
    album: "Thank U, Next",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 178,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "v4",
    title: "Firework (Official Music Video)",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 228,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "v5",
    title: "Live Concert: Midnight Dreams",
    artist: "Luna Echo",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 300,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Live Performance",
  },
  {
    id: "v6",
    title: "Live at Madison Square Garden",
    artist: "Electric Pulse",
    album: "Live Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 420,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "Live Performance",
  },
];

export const allTracks: Track[] = [
  ...featuredContent,
  ...recentlyPlayed,
  ...topCharts,
  ...newReleases,
  ...podcasts,
  ...audiobooks,
  ...searchTracks,
  ...allPodcastEpisodes,
  ...videoTracks,
  ...trendingVideos,
  ...livePerformanceVideos,
  ...mostViewedVideos,
];

export const trendingNow: Track[] = [
  // Trending Music
  {
    id: "t1",
    title: "Shades of Love",
    artist: "Ania Szarmach",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 195,
    type: "song",
  },
  {
    id: "t2",
    title: "Without You",
    artist: "The Kid LAROI",
    artwork: "https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Without+You",
    duration: 210,
    type: "song",
  },
  // Trending Video
  {
    id: "tv1",
    title: "Starboy (Official Video)",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 230,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "tv2",
    title: "Anti-Hero (Music Video)",
    artist: "Taylor Swift",
    album: "Midnights",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 201,
    type: "video",
    isVideo: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  // Trending Podcast
  {
    id: "tp1",
    title: "The Future of AI",
    artist: "Tech Insights Daily",
    artwork: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    duration: 2850,
    type: "podcast",
    description: "Deep dive into artificial intelligence trends and implications",
  },
  {
    id: "tp2",
    title: "True Crime: The Missing Hour",
    artist: "Mystery Files Podcast",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3240,
    type: "podcast",
    description: "Investigating unsolved mysteries from around the world",
  },
  // Trending Music
  {
    id: "t3",
    title: "Save Your Tears",
    artist: "The Weeknd & Ariana Grande",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 225,
    type: "song",
  },
  // Trending Audiobook
  {
    id: "ta1",
    title: "Atomic Habits",
    artist: "James Clear",
    artwork: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    duration: 19800,
    type: "audiobook",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
  },
  {
    id: "ta2",
    title: "The Psychology of Money",
    artist: "Morgan Housel",
    artwork: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    duration: 21600,
    type: "audiobook",
    description: "Timeless lessons on wealth, greed, and happiness",
  },
  // More trending music
  {
    id: "t4",
    title: "Kiss Me More",
    artist: "Doja Cat Featuring SZA",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 198,
    type: "song",
  },
  {
    id: "t5",
    title: "Drivers License",
    artist: "Olivia Rodrigo",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 242,
    type: "song",
  },
  // Trending Podcast
  {
    id: "tp3",
    title: "Mindfulness & Meditation",
    artist: "Wellness Journey",
    artwork: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    duration: 1980,
    type: "podcast",
    description: "Daily practices for mental health and well-being",
  },
];

// Trending Videos - Only video content, no audio
export const trendingNowVideos: Track[] = trendingVideos;

export const popularArtists = [
  {
    id: "a1",
    name: "Ariana Grande",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "85.2M",
    verified: true,
  },
  {
    id: "a2",
    name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "92.1M",
    verified: true,
  },
  {
    id: "a3",
    name: "Acidrap",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "45.8M",
    verified: true,
  },
  {
    id: "a4",
    name: "Ryan Jones",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "12.3M",
    verified: false,
  },
  {
    id: "a5",
    name: "Jamie Gray",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "28.7M",
    verified: true,
  },
  {
    id: "a6",
    name: "Troye Sivan",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "34.5M",
    verified: true,
  },
];

export const podcastCategories = [
  {
    id: "pc1",
    title: "Business",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: "pc2",
    title: "Politics",
    color: "#F59E0B",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200&h=200&fit=crop",
  },
  {
    id: "pc3",
    title: "Music",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    id: "pc4",
    title: "Comedy",
    color: "#F97316",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
  },
];

export const popularPodcasts: Track[] = [
  {
    id: "pp1",
    title: "610: Bill Sullivan | Pleased to Meet Me",
    artist: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3600,
    type: "podcast",
    description: "The Jordan Harbinger Show",
  },
  {
    id: "pp2",
    title: "487: Mike Rowe | Dirty Jobs and Personal Responsibility",
    artist: "Mike Rowe",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2700,
    type: "podcast",
    description: "SaaS & Scotch",
  },
  {
    id: "pp3",
    title: "938: Tom Bilyeu | Billion Dollar Advice",
    artist: "Tom Bilyeu",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 4200,
    type: "podcast",
    description: "Impact Theory",
  },
];

// Liked Podcasts
export const likedPodcasts: Track[] = [
  {
    id: "lp1",
    title: "837: Tristan Harris | Reclaiming Our Future with ...",
    artist: "Apple Talk",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 2906, // 48:26 mins
    type: "podcast",
    description: "Apple Talk",
  },
  {
    id: "lp2",
    title: "593: Dallas Taylor | The Psychology of Sound Design",
    artist: "What a Day",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 3362, // 56:42 mins
    type: "podcast",
    description: "What a Day",
  },
  {
    id: "lp3",
    title: "621: Reid Hoffman | Surprising Entrepreneurial Truths",
    artist: "Invest Like The Best",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 3140, // 52:20 mins
    type: "podcast",
    description: "Invest Like The Best",
  },
  {
    id: "lp4",
    title: "831: Desmond Shum | Wealth, Power, Corruption, and Ven...",
    artist: "Les Braqueurs",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 2986, // 49:46 mins
    type: "podcast",
    description: "Les Braqueurs",
  },
  {
    id: "lp5",
    title: "396: Chris Voss | Hostage Negotiation Tactics for Ever...",
    artist: "Jerome Garcin",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 3439, // 57:19 mins
    type: "podcast",
    description: "Jerome Garcin",
  },
  {
    id: "lp6",
    title: "458: Sam Cooper | How the West Was Infiltrated by Its ...",
    artist: "Les Pieds Sur Terre",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 2315, // 38:35 mins
    type: "podcast",
    description: "Les Pieds Sur Terre",
  },
  {
    id: "lp7",
    title: "772: Vanessa Van Edwards | The Science of Succeeding ...",
    artist: "Emotions",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 2749, // 45:49 mins
    type: "podcast",
    description: "Emotions",
  },
];

// Queue Podcasts
export const queuePodcasts: Track[] = [
  {
    id: "qp1",
    title: "938: Steve Rambam | The Real Life of a Private Investi...",
    artist: "Geraldine Mosna",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 2664, // 44:24 mins
    type: "podcast",
    description: "Geraldine Mosna",
  },
  {
    id: "qp2",
    title: "831: Desmond Shum | Wealth, Power, Corruption, and Ven...",
    artist: "Les Braqueurs",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2986, // 49:46 mins
    type: "podcast",
    description: "Les Braqueurs",
  },
  {
    id: "qp3",
    title: "396: Chris Voss | Hostage Negotiation Tactics for Ever...",
    artist: "Jerome Garcin",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 3439, // 57:19 mins
    type: "podcast",
    description: "Jerome Garcin",
  },
  {
    id: "qp4",
    title: "458: Sam Cooper | How the West Was Infiltrated by Its ...",
    artist: "Les Pieds Sur Terre",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 2315, // 38:35 mins
    type: "podcast",
    description: "Les Pieds Sur Terre",
  },
  {
    id: "qp5",
    title: "772: Vanessa Van Edwards | The Science of Succeeding ...",
    artist: "Emotions",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 2749, // 45:49 mins
    type: "podcast",
    description: "Emotions",
  },
];

// Podcast Shows
export const podcastShows = [
  {
    id: "show1",
    title: "The Jordan Harbinger Show",
    host: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Deep-dive conversations with fascinating people from all walks of life. Jordan Harbinger explores the psychology and strategies behind the world's most successful individuals, offering practical insights you can apply to your own life.",
    episodes: jordanHarbingerEpisodes,
  },
  {
    id: "show2",
    title: "Apple Talk",
    host: "Apple Talk",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    description: "Technology discussions and insights from the world of Apple.",
    episodes: [],
  },
  {
    id: "show3",
    title: "Dr. Death",
    host: "Dr. Death",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    description: "True crime podcast exploring medical malpractice cases.",
    episodes: [],
  },
];

export const popularPodcastArtists = [
  {
    id: "ppa1",
    name: "Dr. Death",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    category: "True Crime",
  },
  {
    id: "ppa2",
    name: "Apple Talk",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    category: "Technology",
  },
  {
    id: "ppa3",
    name: "Wondery",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    category: "Entertainment",
  },
];

export const genres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "R&B",
  "Country",
  "Latin",
  "Indie",
  "Metal",
  "Reggae",
  "Afro Beat",
  "Afro Beats",
  "High Life",
];

// Enhanced categories for Browse Categories
export interface CategoryItem {
  id: string;
  title: string;
  colors: readonly [string, string];
  image?: string;
  description?: string;
  route?: string;
}

export const browseCategories: CategoryItem[] = [
  {
    id: "music",
    title: "Music",
    colors: ["#FF6B6B", "#F7CE68"] as const,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    description: "Discover the latest hits and timeless classics",
    route: "/categories/music",
  },
  {
    id: "audiobook",
    title: "Auralora",
    colors: ["#6A85F1", "#B892FF"] as const,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    description: "Immerse yourself in captivating stories",
    route: "/categories/audiobooks",
  },
  {
    id: "podcast",
    title: "VoxSaga (Podcasts)",
    colors: ["#00C6FF", "#0072FF"] as const,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Stay informed and entertained",
    route: "/categories/podcasts",
  },
  {
    id: "trending",
    title: "Trending",
    colors: ["#F7971E", "#FFD200"] as const,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    description: "What's hot right now",
    route: "/trending-now",
  },
  {
    id: "live",
    title: "Live Performance",
    colors: ["#8A2387", "#E94057"] as const,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    description: "Experience live music and shows",
    route: "/categories/live-performance",
  },
  {
    id: "news",
    title: "News & Talk",
    colors: ["#11998E", "#38EF7D"] as const,
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
    description: "Stay updated with current events",
    route: "/categories/news",
  },
  {
    id: "genres",
    title: "Genres",
    colors: ["#667eea", "#764ba2"] as const,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    description: "Explore music by genre",
    route: "/categories/genres",
  },
  {
    id: "artists",
    title: "Artists",
    colors: ["#f093fb", "#f5576c"] as const,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    description: "Discover your favorite artists",
    route: "/categories/artists",
  },
  {
    id: "playlists",
    title: "Playlists",
    colors: ["#4facfe", "#00f2fe"] as const,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    description: "Curated collections for every mood",
    route: "/playlists",
  },
];

// History data
export const historyTracks: Track[] = [
  {
    id: "h1",
    title: "Somebody's Nobody",
    artist: "Alexander 23",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 195,
    type: "song",
  },
  {
    id: "h2",
    title: "Sharks",
    artist: "Imagine Dragons",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 210,
    type: "song",
  },
  {
    id: "h3",
    title: "Disaster",
    artist: "Conan Gray",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 225,
    type: "song",
  },
  {
    id: "h4",
    title: "HANDSOME",
    artist: "Warren Hue",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 180,
    type: "song",
  },
  {
    id: "h5",
    title: "God Is a Woman",
    artist: "Ariana Grande",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 198,
    type: "song",
  },
  {
    id: "h6",
    title: "BREAK MY SOUL",
    artist: "Beyonce",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 267,
    type: "song",
  },
  {
    id: "h7",
    title: "The Bended Man",
    artist: "Sunwich",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 234,
    type: "song",
  },
];

// Downloads data
export const downloadedTracks: Track[] = [
  {
    id: "d1",
    title: "Sharks",
    artist: "Imagine Dragons",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 210,
    type: "song",
  },
  {
    id: "d2",
    title: "Somebody's Nobody",
    artist: "Alexander 23",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 195,
    type: "song",
  },
  {
    id: "d3",
    title: "Fly Me To The Sun",
    artist: "Romantic Echoes",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 225,
    type: "song",
  },
  {
    id: "d4",
    title: "God Is a Woman",
    artist: "Ariana Grande",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 198,
    type: "song",
  },
  {
    id: "d5",
    title: "HANDSOME",
    artist: "Warren Hue",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 180,
    type: "song",
  },
  {
    id: "d6",
    title: "The Bended Man",
    artist: "Sunwich",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 234,
    type: "song",
  },
  {
    id: "d7",
    title: "BREAK MY SOUL",
    artist: "Beyonce",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 267,
    type: "song",
  },
];

export const downloadedPodcasts: Track[] = [
  {
    id: "dp1",
    title: "785: Luis Navia | 25 Years Inside the Narco Cartels",
    artist: "The Breakfast Club",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 2782, // 46:42 mins
    type: "podcast",
    description: "The Breakfast Club",
  },
  {
    id: "dp2",
    title: "459: Dallas Taylor | The Psychology of Sound Design",
    artist: "Dateline",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2531, // 42:51 mins
    type: "podcast",
    description: "Dateline",
  },
  {
    id: "dp3",
    title: "513: Daniel J. Levitin | How to Think Critically in the Post-T...",
    artist: "The Joe Budden",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 2385, // 39:45 mins
    type: "podcast",
    description: "The Joe Budden",
  },
  {
    id: "dp4",
    title: "379: David Eagleman | How Our Brains Construct Reality",
    artist: "Planet Money",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 3226, // 53:46 mins
    type: "podcast",
    description: "Planet Money",
  },
  {
    id: "dp5",
    title: "563: Susan Cain | Introverts Unite for a Quiet Revolution",
    artist: "Be Antiracist",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2687, // 44:47 mins
    type: "podcast",
    description: "Be Antiracist",
  },
];

export const historyPodcasts: Track[] = [
  {
    id: "hp1",
    title: "593: Dallas Taylor | The Psychology of Sound Design",
    artist: "What a Day",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3362, // 56:42 mins
    type: "podcast",
    description: "What a Day",
  },
  {
    id: "hp2",
    title: "621: Reid Hoffman | Surprising Entrepreneurial Truths",
    artist: "Invest Like The Best",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 3140, // 52:20 mins
    type: "podcast",
    description: "Invest Like The Best",
  },
  {
    id: "hp3",
    title: "688: A-Rod | Still Having a Ball After All",
    artist: "Twenty Thousand Hertz",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 2956, // 49:26 mins
    type: "podcast",
    description: "Twenty Thousand Hertz",
  },
  {
    id: "hp4",
    title: "837: Tristan Harris | Reclaiming Our Future with ...",
    artist: "Apple Talk",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 2906, // 48:26 mins
    type: "podcast",
    description: "Apple Talk",
  },
  {
    id: "hp5",
    title: "690: Jane McGonigal | How to See the Future and Be Ready..",
    artist: "The Jordan Harbinger ...",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2749, // 45:49 mins
    type: "podcast",
    description: "The Jordan Harbinger Show",
  },
  {
    id: "hp6",
    title: "837: Amy Webb | Changing",
    artist: "Hidden Brain",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 3288, // 54:48 mins
    type: "podcast",
    description: "Hidden Brain",
  },
];

// Playlists data
export const userPlaylists: Playlist[] = [
  {
    id: "pl1",
    name: "Your Likes",
    tracks: [...historyTracks.slice(0, 5)],
    createdAt: "2024-01-15",
  },
  {
    id: "pl2",
    name: "My Favorite Pop Songs",
    tracks: [...topCharts.slice(0, 6)],
    createdAt: "2024-01-10",
  },
  {
    id: "pl3",
    name: "90s Old Song",
    tracks: [...recentlyPlayed.slice(0, 4)],
    createdAt: "2024-01-05",
  },
  {
    id: "pl4",
    name: "Legend Rock Song",
    tracks: [...newReleases.slice(0, 3)],
    createdAt: "2024-01-01",
  },
  {
    id: "pl5",
    name: "My Favorite Acoustic Song",
    tracks: [...featuredContent],
    createdAt: "2023-12-20",
  },
  {
    id: "pl6",
    name: "Memories of Love",
    tracks: [...trendingNow.slice(0, 4)],
    createdAt: "2023-12-15",
  },
];

export const playlistSongCounts: Record<string, number> = {
  pl1: 270,
  pl2: 345,
  pl3: 127,
  pl4: 98,
  pl5: 163,
  pl6: 149,
};