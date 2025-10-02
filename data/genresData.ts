import type { Track } from "@/types";

export interface GenreData {
  name: string;
  color: string;
  description: string;
  subgenres: string[];
  topArtists: {
    id: string;
    name: string;
    image: string;
    followers: string;
  }[];
  tracks: Track[];
  playlists: {
    id: string;
    name: string;
    description: string;
    artwork: string;
    trackCount: number;
  }[];
  albums: {
    id: string;
    title: string;
    artist: string;
    artwork: string;
    year: string;
  }[];
}

export const genresData: Record<string, GenreData> = {
  "Pop": {
    name: "Pop",
    color: "#FF0080",
    description: "The most popular and mainstream music genre featuring catchy melodies, memorable hooks, and wide appeal.",
    subgenres: ["Dance Pop", "Electropop", "Indie Pop", "K-Pop", "Teen Pop", "Synth Pop"],
    topArtists: [
      {
        id: "pop-artist-1",
        name: "Ariana Grande",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "85.2M"
      },
      {
        id: "pop-artist-2",
        name: "Taylor Swift",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "92.5M"
      },
      {
        id: "pop-artist-3",
        name: "Dua Lipa",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "78.3M"
      },
      {
        id: "pop-artist-4",
        name: "Ed Sheeran",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "89.1M"
      }
    ],
    tracks: [
      {
        id: "pop-1",
        title: "7 rings",
        artist: "Ariana Grande",
        album: "Thank U, Next",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 178,
        type: "song"
      },
      {
        id: "pop-2",
        title: "Firework",
        artist: "Katy Perry",
        album: "Teenage Dream",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 228,
        type: "song"
      },
      {
        id: "pop-3",
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 203,
        type: "song"
      },
      {
        id: "pop-4",
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 233,
        type: "song"
      },
      {
        id: "pop-5",
        title: "Anti-Hero",
        artist: "Taylor Swift",
        album: "Midnights",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 201,
        type: "song"
      },
      {
        id: "pop-6",
        title: "Flowers",
        artist: "Miley Cyrus",
        album: "Endless Summer Vacation",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 200,
        type: "song"
      },
      {
        id: "pop-7",
        title: "As It Was",
        artist: "Harry Styles",
        album: "Harry's House",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 167,
        type: "song"
      },
      {
        id: "pop-8",
        title: "Good 4 U",
        artist: "Olivia Rodrigo",
        album: "SOUR",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 178,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "pop-pl-1",
        name: "Pop Hits 2024",
        description: "The biggest pop songs of the year",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 50
      },
      {
        id: "pop-pl-2",
        name: "Pop Classics",
        description: "Timeless pop anthems",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 75
      },
      {
        id: "pop-pl-3",
        name: "Dance Pop",
        description: "Upbeat pop tracks to get you moving",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        trackCount: 60
      }
    ],
    albums: [
      {
        id: "pop-album-1",
        title: "Thank U, Next",
        artist: "Ariana Grande",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2019"
      },
      {
        id: "pop-album-2",
        title: "Future Nostalgia",
        artist: "Dua Lipa",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        year: "2020"
      },
      {
        id: "pop-album-3",
        title: "Midnights",
        artist: "Taylor Swift",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        year: "2022"
      }
    ]
  },
  "Rock": {
    name: "Rock",
    color: "#8B5CF6",
    description: "Powerful guitar-driven music with strong rhythms and rebellious spirit.",
    subgenres: ["Classic Rock", "Alternative Rock", "Indie Rock", "Hard Rock", "Punk Rock", "Progressive Rock"],
    topArtists: [
      {
        id: "rock-artist-1",
        name: "Imagine Dragons",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "45.2M"
      },
      {
        id: "rock-artist-2",
        name: "Foo Fighters",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "38.7M"
      },
      {
        id: "rock-artist-3",
        name: "Arctic Monkeys",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "42.1M"
      },
      {
        id: "rock-artist-4",
        name: "Red Hot Chili Peppers",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "51.3M"
      }
    ],
    tracks: [
      {
        id: "rock-1",
        title: "Thunder",
        artist: "Imagine Dragons",
        album: "Evolve",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 187,
        type: "song"
      },
      {
        id: "rock-2",
        title: "Everlong",
        artist: "Foo Fighters",
        album: "The Colour and the Shape",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 250,
        type: "song"
      },
      {
        id: "rock-3",
        title: "Do I Wanna Know?",
        artist: "Arctic Monkeys",
        album: "AM",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 272,
        type: "song"
      },
      {
        id: "rock-4",
        title: "Under the Bridge",
        artist: "Red Hot Chili Peppers",
        album: "Blood Sugar Sex Magik",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 264,
        type: "song"
      },
      {
        id: "rock-5",
        title: "Radioactive",
        artist: "Imagine Dragons",
        album: "Night Visions",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 186,
        type: "song"
      },
      {
        id: "rock-6",
        title: "The Pretender",
        artist: "Foo Fighters",
        album: "Echoes, Silence, Patience & Grace",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 269,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "rock-pl-1",
        name: "Rock Anthems",
        description: "The greatest rock songs of all time",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 100
      },
      {
        id: "rock-pl-2",
        name: "Modern Rock",
        description: "Contemporary rock hits",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 65
      },
      {
        id: "rock-pl-3",
        name: "Classic Rock",
        description: "Legendary rock from the 60s-90s",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        trackCount: 80
      }
    ],
    albums: [
      {
        id: "rock-album-1",
        title: "AM",
        artist: "Arctic Monkeys",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2013"
      },
      {
        id: "rock-album-2",
        title: "Evolve",
        artist: "Imagine Dragons",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        year: "2017"
      }
    ]
  },
  "Hip-Hop": {
    name: "Hip-Hop",
    color: "#3B82F6",
    description: "Urban music featuring rap vocals, beats, and rhythmic poetry.",
    subgenres: ["Trap", "Conscious Hip-Hop", "Gangsta Rap", "Alternative Hip-Hop", "Mumble Rap", "Old School"],
    topArtists: [
      {
        id: "hiphop-artist-1",
        name: "Drake",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "78.5M"
      },
      {
        id: "hiphop-artist-2",
        name: "Kendrick Lamar",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "62.3M"
      },
      {
        id: "hiphop-artist-3",
        name: "Travis Scott",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "55.8M"
      },
      {
        id: "hiphop-artist-4",
        name: "J. Cole",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "48.2M"
      }
    ],
    tracks: [
      {
        id: "hiphop-1",
        title: "SICKO MODE",
        artist: "Travis Scott",
        album: "ASTROWORLD",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 312,
        type: "song"
      },
      {
        id: "hiphop-2",
        title: "HUMBLE.",
        artist: "Kendrick Lamar",
        album: "DAMN.",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 177,
        type: "song"
      },
      {
        id: "hiphop-3",
        title: "God's Plan",
        artist: "Drake",
        album: "Scorpion",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      },
      {
        id: "hiphop-4",
        title: "Middle Child",
        artist: "J. Cole",
        album: "Revenge of the Dreamers III",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 213,
        type: "song"
      },
      {
        id: "hiphop-5",
        title: "Starboy",
        artist: "The Weeknd ft. Daft Punk",
        album: "Starboy",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 230,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "hiphop-pl-1",
        name: "Hip-Hop Essentials",
        description: "The most influential hip-hop tracks",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 90
      },
      {
        id: "hiphop-pl-2",
        name: "Trap Nation",
        description: "Hard-hitting trap beats",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 70
      }
    ],
    albums: [
      {
        id: "hiphop-album-1",
        title: "DAMN.",
        artist: "Kendrick Lamar",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2017"
      }
    ]
  },
  "Electronic": {
    name: "Electronic",
    color: "#10B981",
    description: "Music produced using electronic instruments and digital technology.",
    subgenres: ["House", "Techno", "Dubstep", "Trance", "EDM", "Drum & Bass"],
    topArtists: [
      {
        id: "electronic-artist-1",
        name: "Calvin Harris",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "52.3M"
      },
      {
        id: "electronic-artist-2",
        name: "Marshmello",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "48.7M"
      },
      {
        id: "electronic-artist-3",
        name: "Daft Punk",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "45.1M"
      },
      {
        id: "electronic-artist-4",
        name: "Deadmau5",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "38.5M"
      }
    ],
    tracks: [
      {
        id: "electronic-1",
        title: "One More Time",
        artist: "Daft Punk",
        album: "Discovery",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 320,
        type: "song"
      },
      {
        id: "electronic-2",
        title: "Happier",
        artist: "Marshmello ft. Bastille",
        album: "Happier",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 214,
        type: "song"
      },
      {
        id: "electronic-3",
        title: "Summer",
        artist: "Calvin Harris",
        album: "Motion",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 223,
        type: "song"
      },
      {
        id: "electronic-4",
        title: "Strobe",
        artist: "Deadmau5",
        album: "For Lack of a Better Name",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 634,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "electronic-pl-1",
        name: "EDM Bangers",
        description: "High-energy electronic dance music",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 85
      },
      {
        id: "electronic-pl-2",
        name: "Chill Electronic",
        description: "Relaxing electronic vibes",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 60
      }
    ],
    albums: [
      {
        id: "electronic-album-1",
        title: "Discovery",
        artist: "Daft Punk",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2001"
      }
    ]
  },
  "Jazz": {
    name: "Jazz",
    color: "#F59E0B",
    description: "Sophisticated music characterized by improvisation, swing rhythms, and complex harmonies.",
    subgenres: ["Bebop", "Smooth Jazz", "Fusion", "Cool Jazz", "Free Jazz", "Latin Jazz"],
    topArtists: [
      {
        id: "jazz-artist-1",
        name: "Miles Davis",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "12.5M"
      },
      {
        id: "jazz-artist-2",
        name: "John Coltrane",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "8.7M"
      },
      {
        id: "jazz-artist-3",
        name: "Ella Fitzgerald",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "10.2M"
      },
      {
        id: "jazz-artist-4",
        name: "Louis Armstrong",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "11.8M"
      }
    ],
    tracks: [
      {
        id: "jazz-1",
        title: "So What",
        artist: "Miles Davis",
        album: "Kind of Blue",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 562,
        type: "song"
      },
      {
        id: "jazz-2",
        title: "A Love Supreme",
        artist: "John Coltrane",
        album: "A Love Supreme",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 1980,
        type: "song"
      },
      {
        id: "jazz-3",
        title: "Summertime",
        artist: "Ella Fitzgerald",
        album: "Porgy and Bess",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 255,
        type: "song"
      },
      {
        id: "jazz-4",
        title: "What a Wonderful World",
        artist: "Louis Armstrong",
        album: "What a Wonderful World",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 139,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "jazz-pl-1",
        name: "Jazz Classics",
        description: "Timeless jazz masterpieces",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 75
      },
      {
        id: "jazz-pl-2",
        name: "Smooth Jazz",
        description: "Relaxing contemporary jazz",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 50
      }
    ],
    albums: [
      {
        id: "jazz-album-1",
        title: "Kind of Blue",
        artist: "Miles Davis",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1959"
      }
    ]
  },
  "R&B": {
    name: "R&B",
    color: "#EC4899",
    description: "Rhythm and Blues featuring soulful vocals, smooth melodies, and groovy rhythms.",
    subgenres: ["Contemporary R&B", "Neo-Soul", "Alternative R&B", "Funk", "Soul"],
    topArtists: [
      {
        id: "rnb-artist-1",
        name: "The Weeknd",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "92.1M"
      },
      {
        id: "rnb-artist-2",
        name: "SZA",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "45.7M"
      },
      {
        id: "rnb-artist-3",
        name: "Frank Ocean",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "38.2M"
      },
      {
        id: "rnb-artist-4",
        name: "Beyoncé",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "68.5M"
      }
    ],
    tracks: [
      {
        id: "rnb-1",
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 200,
        type: "song"
      },
      {
        id: "rnb-2",
        title: "Kill Bill",
        artist: "SZA",
        album: "SOS",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 153,
        type: "song"
      },
      {
        id: "rnb-3",
        title: "Thinkin Bout You",
        artist: "Frank Ocean",
        album: "Channel Orange",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 200,
        type: "song"
      },
      {
        id: "rnb-4",
        title: "BREAK MY SOUL",
        artist: "Beyoncé",
        album: "RENAISSANCE",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "rnb-pl-1",
        name: "R&B Vibes",
        description: "Smooth R&B for any mood",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 80
      },
      {
        id: "rnb-pl-2",
        name: "Neo-Soul",
        description: "Modern soul music",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 55
      }
    ],
    albums: [
      {
        id: "rnb-album-1",
        title: "After Hours",
        artist: "The Weeknd",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2020"
      }
    ]
  },
  "Country": {
    name: "Country",
    color: "#6366F1",
    description: "American roots music featuring storytelling, acoustic instruments, and heartfelt lyrics.",
    subgenres: ["Country Pop", "Bluegrass", "Outlaw Country", "Contemporary Country", "Country Rock"],
    topArtists: [
      {
        id: "country-artist-1",
        name: "Luke Combs",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "28.5M"
      },
      {
        id: "country-artist-2",
        name: "Morgan Wallen",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "32.1M"
      },
      {
        id: "country-artist-3",
        name: "Carrie Underwood",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "25.7M"
      },
      {
        id: "country-artist-4",
        name: "Chris Stapleton",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "22.3M"
      }
    ],
    tracks: [
      {
        id: "country-1",
        title: "Fast Car",
        artist: "Luke Combs",
        album: "Gettin' Old",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 237,
        type: "song"
      },
      {
        id: "country-2",
        title: "Last Night",
        artist: "Morgan Wallen",
        album: "One Thing at a Time",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 172,
        type: "song"
      },
      {
        id: "country-3",
        title: "Before He Cheats",
        artist: "Carrie Underwood",
        album: "Some Hearts",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 199,
        type: "song"
      },
      {
        id: "country-4",
        title: "Tennessee Whiskey",
        artist: "Chris Stapleton",
        album: "Traveller",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 282,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "country-pl-1",
        name: "Country Hits",
        description: "Top country songs right now",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 70
      },
      {
        id: "country-pl-2",
        name: "Classic Country",
        description: "Legendary country music",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 90
      }
    ],
    albums: [
      {
        id: "country-album-1",
        title: "One Thing at a Time",
        artist: "Morgan Wallen",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2023"
      }
    ]
  },
  "Latin": {
    name: "Latin",
    color: "#F97316",
    description: "Vibrant music from Latin America featuring passionate rhythms and diverse cultural influences.",
    subgenres: ["Reggaeton", "Salsa", "Bachata", "Latin Pop", "Regional Mexican", "Cumbia"],
    topArtists: [
      {
        id: "latin-artist-1",
        name: "Bad Bunny",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "65.2M"
      },
      {
        id: "latin-artist-2",
        name: "J Balvin",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "58.7M"
      },
      {
        id: "latin-artist-3",
        name: "Shakira",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "52.3M"
      },
      {
        id: "latin-artist-4",
        name: "Daddy Yankee",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "48.1M"
      }
    ],
    tracks: [
      {
        id: "latin-1",
        title: "Tití Me Preguntó",
        artist: "Bad Bunny",
        album: "Un Verano Sin Ti",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 256,
        type: "song"
      },
      {
        id: "latin-2",
        title: "Mi Gente",
        artist: "J Balvin, Willy William",
        album: "Vibras",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 189,
        type: "song"
      },
      {
        id: "latin-3",
        title: "Hips Don't Lie",
        artist: "Shakira ft. Wyclef Jean",
        album: "Oral Fixation, Vol. 2",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 218,
        type: "song"
      },
      {
        id: "latin-4",
        title: "Gasolina",
        artist: "Daddy Yankee",
        album: "Barrio Fino",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 193,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "latin-pl-1",
        name: "Latin Hits",
        description: "The hottest Latin music",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 85
      },
      {
        id: "latin-pl-2",
        name: "Reggaeton Classics",
        description: "Essential reggaeton tracks",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 65
      }
    ],
    albums: [
      {
        id: "latin-album-1",
        title: "Un Verano Sin Ti",
        artist: "Bad Bunny",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2022"
      }
    ]
  },
  "Indie": {
    name: "Indie",
    color: "#06B6D4",
    description: "Independent music characterized by creative freedom and alternative sounds.",
    subgenres: ["Indie Rock", "Indie Pop", "Indie Folk", "Dream Pop", "Lo-Fi"],
    topArtists: [
      {
        id: "indie-artist-1",
        name: "Tame Impala",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "35.2M"
      },
      {
        id: "indie-artist-2",
        name: "The 1975",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "28.7M"
      },
      {
        id: "indie-artist-3",
        name: "Vampire Weekend",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "22.5M"
      },
      {
        id: "indie-artist-4",
        name: "Mac DeMarco",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "18.3M"
      }
    ],
    tracks: [
      {
        id: "indie-1",
        title: "The Less I Know The Better",
        artist: "Tame Impala",
        album: "Currents",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 216,
        type: "song"
      },
      {
        id: "indie-2",
        title: "Somebody Else",
        artist: "The 1975",
        album: "I Like It When You Sleep...",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 347,
        type: "song"
      },
      {
        id: "indie-3",
        title: "A-Punk",
        artist: "Vampire Weekend",
        album: "Vampire Weekend",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 137,
        type: "song"
      },
      {
        id: "indie-4",
        title: "Chamber of Reflection",
        artist: "Mac DeMarco",
        album: "Salad Days",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 233,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "indie-pl-1",
        name: "Indie Essentials",
        description: "Must-hear indie tracks",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 75
      },
      {
        id: "indie-pl-2",
        name: "Chill Indie",
        description: "Relaxing indie vibes",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 60
      }
    ],
    albums: [
      {
        id: "indie-album-1",
        title: "Currents",
        artist: "Tame Impala",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2015"
      }
    ]
  },
  "Metal": {
    name: "Metal",
    color: "#DC2626",
    description: "Heavy, aggressive music featuring distorted guitars, powerful drums, and intense vocals.",
    subgenres: ["Heavy Metal", "Thrash Metal", "Death Metal", "Black Metal", "Power Metal", "Metalcore"],
    topArtists: [
      {
        id: "metal-artist-1",
        name: "Metallica",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "42.5M"
      },
      {
        id: "metal-artist-2",
        name: "Iron Maiden",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "35.2M"
      },
      {
        id: "metal-artist-3",
        name: "Slipknot",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "28.7M"
      },
      {
        id: "metal-artist-4",
        name: "Black Sabbath",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "32.1M"
      }
    ],
    tracks: [
      {
        id: "metal-1",
        title: "Master of Puppets",
        artist: "Metallica",
        album: "Master of Puppets",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 515,
        type: "song"
      },
      {
        id: "metal-2",
        title: "The Trooper",
        artist: "Iron Maiden",
        album: "Piece of Mind",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 252,
        type: "song"
      },
      {
        id: "metal-3",
        title: "Psychosocial",
        artist: "Slipknot",
        album: "All Hope Is Gone",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 281,
        type: "song"
      },
      {
        id: "metal-4",
        title: "Paranoid",
        artist: "Black Sabbath",
        album: "Paranoid",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 170,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "metal-pl-1",
        name: "Metal Classics",
        description: "Legendary metal anthems",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 100
      },
      {
        id: "metal-pl-2",
        name: "Modern Metal",
        description: "Contemporary heavy music",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 70
      }
    ],
    albums: [
      {
        id: "metal-album-1",
        title: "Master of Puppets",
        artist: "Metallica",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1986"
      }
    ]
  },
  "Reggae": {
    name: "Reggae",
    color: "#16A34A",
    description: "Jamaican music featuring offbeat rhythms, bass-heavy grooves, and positive vibes.",
    subgenres: ["Roots Reggae", "Dancehall", "Dub", "Ska", "Reggae Fusion"],
    topArtists: [
      {
        id: "reggae-artist-1",
        name: "Bob Marley",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "28.5M"
      },
      {
        id: "reggae-artist-2",
        name: "Damian Marley",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "12.3M"
      },
      {
        id: "reggae-artist-3",
        name: "Chronixx",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "8.7M"
      },
      {
        id: "reggae-artist-4",
        name: "Protoje",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "6.5M"
      }
    ],
    tracks: [
      {
        id: "reggae-1",
        title: "One Love",
        artist: "Bob Marley & The Wailers",
        album: "Exodus",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 174,
        type: "song"
      },
      {
        id: "reggae-2",
        title: "Welcome to Jamrock",
        artist: "Damian Marley",
        album: "Welcome to Jamrock",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      },
      {
        id: "reggae-3",
        title: "Here Comes Trouble",
        artist: "Chronixx",
        album: "Chronology",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      },
      {
        id: "reggae-4",
        title: "Who Knows",
        artist: "Protoje ft. Chronixx",
        album: "Ancient Future",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 256,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "reggae-pl-1",
        name: "Reggae Classics",
        description: "Essential reggae tracks",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 80
      },
      {
        id: "reggae-pl-2",
        name: "Modern Reggae",
        description: "Contemporary reggae vibes",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 55
      }
    ],
    albums: [
      {
        id: "reggae-album-1",
        title: "Exodus",
        artist: "Bob Marley & The Wailers",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1977"
      }
    ]
  },
  "Afrobeat": {
    name: "Afrobeat",
    color: "#EA580C",
    description: "Classic West African genre pioneered by Fela Kuti, blending traditional Yoruba music, jazz, funk, and highlife with political consciousness.",
    subgenres: ["Traditional Afrobeat", "Afrobeat Jazz", "Afrobeat Funk"],
    topArtists: [
      {
        id: "afrobeat-artist-1",
        name: "Fela Kuti",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "8.5M"
      },
      {
        id: "afrobeat-artist-2",
        name: "Femi Kuti",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "3.2M"
      },
      {
        id: "afrobeat-artist-3",
        name: "Made Kuti",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "afrobeat-artist-4",
        name: "Tony Allen",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "2.5M"
      }
    ],
    tracks: [
      {
        id: "afrobeat-1",
        title: "Water No Get Enemy",
        artist: "Fela Kuti",
        album: "Expensive Shit",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 720,
        type: "song"
      },
      {
        id: "afrobeat-2",
        title: "Zombie",
        artist: "Fela Kuti",
        album: "Zombie",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 744,
        type: "song"
      },
      {
        id: "afrobeat-3",
        title: "Beng Beng Beng",
        artist: "Femi Kuti",
        album: "Day by Day",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 456,
        type: "song"
      },
      {
        id: "afrobeat-4",
        title: "Your Enemy",
        artist: "Made Kuti",
        album: "For(e)ward",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 398,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "afrobeat-pl-1",
        name: "Afrobeat Classics",
        description: "The revolutionary sound of Fela Kuti and the Afrobeat pioneers",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 60
      },
      {
        id: "afrobeat-pl-2",
        name: "Modern Afrobeat",
        description: "Contemporary artists keeping the Afrobeat tradition alive",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 45
      }
    ],
    albums: [
      {
        id: "afrobeat-album-1",
        title: "Zombie",
        artist: "Fela Kuti",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1976"
      }
    ]
  },
  "Afrobeats": {
    name: "Afrobeats",
    color: "#F97316",
    description: "Modern Nigerian and West African pop music blending African rhythms with hip-hop, R&B, dancehall, and electronic music.",
    subgenres: ["Afro-Fusion", "Afro-Pop", "Afro-Dancehall", "Afro-Highlife", "Afro-Reggae", "Afro-House"],
    topArtists: [
      {
        id: "afrobeats-artist-1",
        name: "Burna Boy",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "32.5M"
      },
      {
        id: "afrobeats-artist-2",
        name: "Wizkid",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "28.7M"
      },
      {
        id: "afrobeats-artist-3",
        name: "Davido",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "25.3M"
      },
      {
        id: "afrobeats-artist-4",
        name: "Tems",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "18.2M"
      }
    ],
    tracks: [
      {
        id: "afrobeats-1",
        title: "Last Last",
        artist: "Burna Boy",
        album: "Love, Damini",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 162,
        type: "song"
      },
      {
        id: "afrobeats-2",
        title: "Essence",
        artist: "Wizkid ft. Tems",
        album: "Made in Lagos",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 244,
        type: "song"
      },
      {
        id: "afrobeats-3",
        title: "Fall",
        artist: "Davido",
        album: "A Good Time",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 219,
        type: "song"
      },
      {
        id: "afrobeats-4",
        title: "Free Mind",
        artist: "Tems",
        album: "For Broken Ears",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 238,
        type: "song"
      },
      {
        id: "afrobeats-5",
        title: "Calm Down",
        artist: "Rema",
        album: "Rave & Roses",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 239,
        type: "song"
      },
      {
        id: "afrobeats-6",
        title: "Peru",
        artist: "Fireboy DML",
        album: "Playboy",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 194,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "afrobeats-pl-1",
        name: "Afrobeats Hits",
        description: "The hottest Afrobeats tracks from Nigeria and beyond",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 85
      },
      {
        id: "afrobeats-pl-2",
        name: "Afro-Fusion",
        description: "Blending Afrobeats with global sounds",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 70
      },
      {
        id: "afrobeats-pl-3",
        name: "Afro-Pop Essentials",
        description: "The best of modern African pop music",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        trackCount: 65
      }
    ],
    albums: [
      {
        id: "afrobeats-album-1",
        title: "Love, Damini",
        artist: "Burna Boy",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2022"
      },
      {
        id: "afrobeats-album-2",
        title: "Made in Lagos",
        artist: "Wizkid",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        year: "2020"
      }
    ]
  },
  "Classical": {
    name: "Classical",
    color: "#EF4444",
    description: "Timeless orchestral and chamber music from the great composers.",
    subgenres: ["Baroque", "Romantic", "Contemporary Classical", "Opera", "Chamber Music"],
    topArtists: [
      {
        id: "classical-artist-1",
        name: "Ludwig van Beethoven",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "15.2M"
      },
      {
        id: "classical-artist-2",
        name: "Wolfgang Amadeus Mozart",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "14.5M"
      },
      {
        id: "classical-artist-3",
        name: "Johann Sebastian Bach",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "13.8M"
      },
      {
        id: "classical-artist-4",
        name: "Frédéric Chopin",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "11.2M"
      }
    ],
    tracks: [
      {
        id: "classical-1",
        title: "Symphony No. 9",
        artist: "Ludwig van Beethoven",
        album: "Beethoven: Complete Symphonies",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 4200,
        type: "song"
      },
      {
        id: "classical-2",
        title: "Eine kleine Nachtmusik",
        artist: "Wolfgang Amadeus Mozart",
        album: "Mozart: Essential Works",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 1020,
        type: "song"
      },
      {
        id: "classical-3",
        title: "Cello Suite No. 1",
        artist: "Johann Sebastian Bach",
        album: "Bach: Cello Suites",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 1380,
        type: "song"
      },
      {
        id: "classical-4",
        title: "Nocturne Op. 9 No. 2",
        artist: "Frédéric Chopin",
        album: "Chopin: Nocturnes",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 270,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "classical-pl-1",
        name: "Classical Essentials",
        description: "Masterpieces from the great composers",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 100
      },
      {
        id: "classical-pl-2",
        name: "Peaceful Classical",
        description: "Relaxing classical music",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 75
      }
    ],
    albums: [
      {
        id: "classical-album-1",
        title: "Beethoven: Complete Symphonies",
        artist: "Ludwig van Beethoven",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1824"
      }
    ]
  },
  "Dancehall": {
    name: "Dancehall",
    color: "#FACC15",
    description: "Jamaican dance music with electronic beats, rapid-fire vocals, and infectious rhythms.",
    subgenres: ["Digital Dancehall", "Ragga", "Bashment", "Dancehall Pop"],
    topArtists: [
      {
        id: "dancehall-artist-1",
        name: "Sean Paul",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "15.8M"
      },
      {
        id: "dancehall-artist-2",
        name: "Shaggy",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "12.3M"
      },
      {
        id: "dancehall-artist-3",
        name: "Vybz Kartel",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "8.5M"
      },
      {
        id: "dancehall-artist-4",
        name: "Popcaan",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "6.2M"
      }
    ],
    tracks: [
      {
        id: "dancehall-1",
        title: "Temperature",
        artist: "Sean Paul",
        album: "The Trinity",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 215,
        type: "song"
      },
      {
        id: "dancehall-2",
        title: "It Wasn't Me",
        artist: "Shaggy ft. RikRok",
        album: "Hot Shot",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 227,
        type: "song"
      },
      {
        id: "dancehall-3",
        title: "Fever",
        artist: "Vybz Kartel",
        album: "King of the Dancehall",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      },
      {
        id: "dancehall-4",
        title: "Family",
        artist: "Popcaan",
        album: "Forever",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 203,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "dancehall-pl-1",
        name: "Dancehall Hits",
        description: "The biggest dancehall anthems",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 70
      },
      {
        id: "dancehall-pl-2",
        name: "Bashment Party",
        description: "High-energy dancehall for the dance floor",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 55
      }
    ],
    albums: [
      {
        id: "dancehall-album-1",
        title: "The Trinity",
        artist: "Sean Paul",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2005"
      }
    ]
  },
  "Highlife": {
    name: "Highlife",
    color: "#FB923C",
    description: "West African music genre blending traditional Akan melodies with Western instruments, jazz, and swing.",
    subgenres: ["Guitar Band Highlife", "Brass Band Highlife", "Burger Highlife", "Gospel Highlife"],
    topArtists: [
      {
        id: "highlife-artist-1",
        name: "E.T. Mensah",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.2M"
      },
      {
        id: "highlife-artist-2",
        name: "Osibisa",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "2.5M"
      },
      {
        id: "highlife-artist-3",
        name: "Ebo Taylor",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "highlife-artist-4",
        name: "Flavour",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "4.3M"
      }
    ],
    tracks: [
      {
        id: "highlife-1",
        title: "All For You",
        artist: "E.T. Mensah",
        album: "King of Highlife",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 245,
        type: "song"
      },
      {
        id: "highlife-2",
        title: "Sunshine Day",
        artist: "Osibisa",
        album: "Osibisa",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 312,
        type: "song"
      },
      {
        id: "highlife-3",
        title: "Love and Death",
        artist: "Ebo Taylor",
        album: "Love and Death",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 278,
        type: "song"
      },
      {
        id: "highlife-4",
        title: "Ada Ada",
        artist: "Flavour",
        album: "Blessed",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "highlife-pl-1",
        name: "Highlife Classics",
        description: "Golden era of West African highlife",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 60
      },
      {
        id: "highlife-pl-2",
        name: "Modern Highlife",
        description: "Contemporary highlife sounds",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 45
      }
    ],
    albums: [
      {
        id: "highlife-album-1",
        title: "Love and Death",
        artist: "Ebo Taylor",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2010"
      }
    ]
  },
  "Juju": {
    name: "Juju",
    color: "#A855F7",
    description: "Nigerian music style featuring talking drums, guitars, and Yoruba percussion with Islamic and Christian influences.",
    subgenres: ["Traditional Juju", "Gospel Juju", "Modern Juju"],
    topArtists: [
      {
        id: "juju-artist-1",
        name: "King Sunny Adé",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "2.8M"
      },
      {
        id: "juju-artist-2",
        name: "Ebenezer Obey",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "1.9M"
      },
      {
        id: "juju-artist-3",
        name: "Shina Peters",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.5M"
      },
      {
        id: "juju-artist-4",
        name: "I.K. Dairo",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.2M"
      }
    ],
    tracks: [
      {
        id: "juju-1",
        title: "Synchro System",
        artist: "King Sunny Adé",
        album: "Synchro System",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 456,
        type: "song"
      },
      {
        id: "juju-2",
        title: "Board Members",
        artist: "Ebenezer Obey",
        album: "Board Members",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 523,
        type: "song"
      },
      {
        id: "juju-3",
        title: "Ace",
        artist: "Shina Peters",
        album: "Ace (Afro-Juju Series 1)",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 398,
        type: "song"
      },
      {
        id: "juju-4",
        title: "Mo Ti Lo",
        artist: "I.K. Dairo",
        album: "Juju Master",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 312,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "juju-pl-1",
        name: "Juju Legends",
        description: "Classic juju music from Nigeria",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 50
      },
      {
        id: "juju-pl-2",
        name: "Afro-Juju",
        description: "Modern fusion of juju and contemporary sounds",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 40
      }
    ],
    albums: [
      {
        id: "juju-album-1",
        title: "Synchro System",
        artist: "King Sunny Adé",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1983"
      }
    ]
  },
  "Fuji": {
    name: "Fuji",
    color: "#14B8A6",
    description: "Nigerian percussion-based music derived from Islamic Ajisari tradition, featuring talking drums and call-and-response vocals.",
    subgenres: ["Traditional Fuji", "Modern Fuji", "Fuji Pop"],
    topArtists: [
      {
        id: "fuji-artist-1",
        name: "Wasiu Ayinde Marshall (K1)",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "2.5M"
      },
      {
        id: "fuji-artist-2",
        name: "Kollington Ayinla",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "fuji-artist-3",
        name: "Obesere",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.3M"
      },
      {
        id: "fuji-artist-4",
        name: "Saheed Osupa",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.6M"
      }
    ],
    tracks: [
      {
        id: "fuji-1",
        title: "Fuji Vibration",
        artist: "Wasiu Ayinde Marshall (K1)",
        album: "Fuji the Ultimate",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 612,
        type: "song"
      },
      {
        id: "fuji-2",
        title: "Ijo Fuji",
        artist: "Kollington Ayinla",
        album: "Fuji Garbage",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 534,
        type: "song"
      },
      {
        id: "fuji-3",
        title: "Asakasa",
        artist: "Obesere",
        album: "Asakasa",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 478,
        type: "song"
      },
      {
        id: "fuji-4",
        title: "Testimony",
        artist: "Saheed Osupa",
        album: "Testimony",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 445,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "fuji-pl-1",
        name: "Fuji Classics",
        description: "Traditional fuji music from Nigeria",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 45
      },
      {
        id: "fuji-pl-2",
        name: "Modern Fuji",
        description: "Contemporary fuji sounds",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 35
      }
    ],
    albums: [
      {
        id: "fuji-album-1",
        title: "Fuji the Ultimate",
        artist: "Wasiu Ayinde Marshall (K1)",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1998"
      }
    ]
  },
  "Apala": {
    name: "Apala",
    color: "#84CC16",
    description: "Yoruba percussion music from Nigeria featuring talking drums, with roots in Islamic wake-up music.",
    subgenres: ["Traditional Apala", "Modern Apala"],
    topArtists: [
      {
        id: "apala-artist-1",
        name: "Haruna Ishola",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.1M"
      },
      {
        id: "apala-artist-2",
        name: "Ayinla Omowura",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "1.5M"
      },
      {
        id: "apala-artist-3",
        name: "Ligali Mukaiba",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "0.8M"
      },
      {
        id: "apala-artist-4",
        name: "Kasumu Adio",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "0.6M"
      }
    ],
    tracks: [
      {
        id: "apala-1",
        title: "Oroki Social Club",
        artist: "Haruna Ishola",
        album: "Apala Master",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 423,
        type: "song"
      },
      {
        id: "apala-2",
        title: "Emi Mimo",
        artist: "Ayinla Omowura",
        album: "Late Ayinla Omowura",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 389,
        type: "song"
      },
      {
        id: "apala-3",
        title: "Apala Disco",
        artist: "Ligali Mukaiba",
        album: "Apala Disco",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 356,
        type: "song"
      },
      {
        id: "apala-4",
        title: "Ise Oluwa",
        artist: "Kasumu Adio",
        album: "Apala Tradition",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 412,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "apala-pl-1",
        name: "Apala Legends",
        description: "Classic apala music from Nigeria",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 40
      },
      {
        id: "apala-pl-2",
        name: "Apala Essentials",
        description: "Essential apala tracks",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 30
      }
    ],
    albums: [
      {
        id: "apala-album-1",
        title: "Apala Master",
        artist: "Haruna Ishola",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1970"
      }
    ]
  },
  "Fado": {
    name: "Fado",
    color: "#6366F1",
    description: "Portuguese melancholic music expressing longing, fate, and nostalgia, typically featuring acoustic guitar and vocals.",
    subgenres: ["Fado de Coimbra", "Fado de Lisboa", "Modern Fado"],
    topArtists: [
      {
        id: "fado-artist-1",
        name: "Amália Rodrigues",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "fado-artist-2",
        name: "Mariza",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "2.3M"
      },
      {
        id: "fado-artist-3",
        name: "Carlos do Carmo",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.2M"
      },
      {
        id: "fado-artist-4",
        name: "Carminho",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.5M"
      }
    ],
    tracks: [
      {
        id: "fado-1",
        title: "Estranha Forma de Vida",
        artist: "Amália Rodrigues",
        album: "Amália Rodrigues",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      },
      {
        id: "fado-2",
        title: "Ó Gente da Minha Terra",
        artist: "Mariza",
        album: "Fado em Mim",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      },
      {
        id: "fado-3",
        title: "Lisboa Menina e Moça",
        artist: "Carlos do Carmo",
        album: "Um Homem na Cidade",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      },
      {
        id: "fado-4",
        title: "Bom Dia Amor",
        artist: "Carminho",
        album: "Carminho",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 189,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "fado-pl-1",
        name: "Fado Classics",
        description: "Traditional Portuguese fado",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 50
      },
      {
        id: "fado-pl-2",
        name: "Modern Fado",
        description: "Contemporary fado artists",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 40
      }
    ],
    albums: [
      {
        id: "fado-album-1",
        title: "Fado em Mim",
        artist: "Mariza",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2001"
      }
    ]
  },
  "Flamenco": {
    name: "Flamenco",
    color: "#DC2626",
    description: "Passionate Spanish music and dance from Andalusia featuring intricate guitar work, hand clapping, and emotional vocals.",
    subgenres: ["Flamenco Puro", "Flamenco Fusion", "Nuevo Flamenco"],
    topArtists: [
      {
        id: "flamenco-artist-1",
        name: "Paco de Lucía",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "2.1M"
      },
      {
        id: "flamenco-artist-2",
        name: "Camarón de la Isla",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "1.9M"
      },
      {
        id: "flamenco-artist-3",
        name: "Rosalía",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "15.8M"
      },
      {
        id: "flamenco-artist-4",
        name: "Tomatito",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.3M"
      }
    ],
    tracks: [
      {
        id: "flamenco-1",
        title: "Entre Dos Aguas",
        artist: "Paco de Lucía",
        album: "Fuente y Caudal",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 345,
        type: "song"
      },
      {
        id: "flamenco-2",
        title: "La Leyenda del Tiempo",
        artist: "Camarón de la Isla",
        album: "La Leyenda del Tiempo",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 298,
        type: "song"
      },
      {
        id: "flamenco-3",
        title: "Malamente",
        artist: "Rosalía",
        album: "El Mal Querer",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 162,
        type: "song"
      },
      {
        id: "flamenco-4",
        title: "Aguadulce",
        artist: "Tomatito",
        album: "Rosas del Amor",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "flamenco-pl-1",
        name: "Flamenco Classics",
        description: "Traditional flamenco masters",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 55
      },
      {
        id: "flamenco-pl-2",
        name: "Nuevo Flamenco",
        description: "Modern flamenco fusion",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 45
      }
    ],
    albums: [
      {
        id: "flamenco-album-1",
        title: "El Mal Querer",
        artist: "Rosalía",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2018"
      }
    ]
  },
  "Bossa Nova": {
    name: "Bossa Nova",
    color: "#0EA5E9",
    description: "Brazilian music blending samba rhythms with jazz harmonies, featuring soft vocals and acoustic guitar.",
    subgenres: ["Traditional Bossa Nova", "Bossa Jazz", "Modern Bossa"],
    topArtists: [
      {
        id: "bossa-artist-1",
        name: "João Gilberto",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "2.5M"
      },
      {
        id: "bossa-artist-2",
        name: "Antônio Carlos Jobim",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "3.2M"
      },
      {
        id: "bossa-artist-3",
        name: "Astrud Gilberto",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "bossa-artist-4",
        name: "Stan Getz",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "2.1M"
      }
    ],
    tracks: [
      {
        id: "bossa-1",
        title: "The Girl from Ipanema",
        artist: "Stan Getz & Astrud Gilberto",
        album: "Getz/Gilberto",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 318,
        type: "song"
      },
      {
        id: "bossa-2",
        title: "Desafinado",
        artist: "João Gilberto",
        album: "Chega de Saudade",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 245,
        type: "song"
      },
      {
        id: "bossa-3",
        title: "Corcovado",
        artist: "Antônio Carlos Jobim",
        album: "The Composer of Desafinado",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      },
      {
        id: "bossa-4",
        title: "Chega de Saudade",
        artist: "João Gilberto",
        album: "Chega de Saudade",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "bossa-pl-1",
        name: "Bossa Nova Classics",
        description: "Essential bossa nova from Brazil",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 60
      },
      {
        id: "bossa-pl-2",
        name: "Bossa Jazz",
        description: "Bossa nova meets jazz",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 50
      }
    ],
    albums: [
      {
        id: "bossa-album-1",
        title: "Getz/Gilberto",
        artist: "Stan Getz & João Gilberto",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1964"
      }
    ]
  },
  "Soca": {
    name: "Soca",
    color: "#F59E0B",
    description: "High-energy Caribbean music from Trinidad and Tobago, blending calypso with Indian rhythms and modern dance beats.",
    subgenres: ["Power Soca", "Groovy Soca", "Ragga Soca", "Chutney Soca"],
    topArtists: [
      {
        id: "soca-artist-1",
        name: "Machel Montano",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "3.5M"
      },
      {
        id: "soca-artist-2",
        name: "Bunji Garlin",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "2.1M"
      },
      {
        id: "soca-artist-3",
        name: "Destra Garcia",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "soca-artist-4",
        name: "Kes the Band",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.5M"
      }
    ],
    tracks: [
      {
        id: "soca-1",
        title: "Like Ah Boss",
        artist: "Machel Montano",
        album: "Monk Monte",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      },
      {
        id: "soca-2",
        title: "Differentology",
        artist: "Bunji Garlin",
        album: "Differentology",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      },
      {
        id: "soca-3",
        title: "It's Carnival",
        artist: "Destra Garcia",
        album: "Soca Queen",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 212,
        type: "song"
      },
      {
        id: "soca-4",
        title: "Wotless",
        artist: "Kes the Band",
        album: "Kes the Band",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 189,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "soca-pl-1",
        name: "Soca Carnival",
        description: "High-energy soca for carnival season",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 75
      },
      {
        id: "soca-pl-2",
        name: "Groovy Soca",
        description: "Smooth and melodic soca vibes",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 60
      }
    ],
    albums: [
      {
        id: "soca-album-1",
        title: "Monk Monte",
        artist: "Machel Montano",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2016"
      }
    ]
  },
  "Tango": {
    name: "Tango",
    color: "#BE123C",
    description: "Passionate Argentine music and dance featuring bandoneón, violin, and dramatic rhythms.",
    subgenres: ["Traditional Tango", "Tango Nuevo", "Electrotango"],
    topArtists: [
      {
        id: "tango-artist-1",
        name: "Carlos Gardel",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.5M"
      },
      {
        id: "tango-artist-2",
        name: "Astor Piazzolla",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "2.8M"
      },
      {
        id: "tango-artist-3",
        name: "Gotan Project",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.2M"
      },
      {
        id: "tango-artist-4",
        name: "Aníbal Troilo",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "0.9M"
      }
    ],
    tracks: [
      {
        id: "tango-1",
        title: "Por Una Cabeza",
        artist: "Carlos Gardel",
        album: "Carlos Gardel",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 189,
        type: "song"
      },
      {
        id: "tango-2",
        title: "Libertango",
        artist: "Astor Piazzolla",
        album: "Libertango",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 298,
        type: "song"
      },
      {
        id: "tango-3",
        title: "Santa María (del Buen Ayre)",
        artist: "Gotan Project",
        album: "La Revancha del Tango",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 345,
        type: "song"
      },
      {
        id: "tango-4",
        title: "La Cumparsita",
        artist: "Aníbal Troilo",
        album: "Tango Argentino",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "tango-pl-1",
        name: "Tango Classics",
        description: "Traditional Argentine tango",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 50
      },
      {
        id: "tango-pl-2",
        name: "Electrotango",
        description: "Modern electronic tango fusion",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 40
      }
    ],
    albums: [
      {
        id: "tango-album-1",
        title: "La Revancha del Tango",
        artist: "Gotan Project",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2001"
      }
    ]
  },
  "Zouk": {
    name: "Zouk",
    color: "#EC4899",
    description: "Caribbean music from the French Antilles blending African rhythms with electronic instrumentation and romantic lyrics.",
    subgenres: ["Zouk Love", "Zouk Béton", "Kizomba"],
    topArtists: [
      {
        id: "zouk-artist-1",
        name: "Kassav'",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "zouk-artist-2",
        name: "Edith Lefel",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "0.9M"
      },
      {
        id: "zouk-artist-3",
        name: "Jocelyne Béroard",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.2M"
      },
      {
        id: "zouk-artist-4",
        name: "Franky Vincent",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "0.7M"
      }
    ],
    tracks: [
      {
        id: "zouk-1",
        title: "Zouk la sé sèl médikaman nou ni",
        artist: "Kassav'",
        album: "Love and Ka Dance",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      },
      {
        id: "zouk-2",
        title: "Mon Ange",
        artist: "Edith Lefel",
        album: "Si seulement",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      },
      {
        id: "zouk-3",
        title: "Kolé Séré",
        artist: "Kassav'",
        album: "Kassav' No. 5",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 298,
        type: "song"
      },
      {
        id: "zouk-4",
        title: "Alice ça Glisse",
        artist: "Franky Vincent",
        album: "Franky Vincent",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 212,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "zouk-pl-1",
        name: "Zouk Classics",
        description: "Essential zouk from the Caribbean",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 55
      },
      {
        id: "zouk-pl-2",
        name: "Zouk Love",
        description: "Romantic zouk ballads",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 45
      }
    ],
    albums: [
      {
        id: "zouk-album-1",
        title: "Love and Ka Dance",
        artist: "Kassav'",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1989"
      }
    ]
  },
  "Mbalax": {
    name: "Mbalax",
    color: "#F97316",
    description: "Senegalese music blending traditional Wolof percussion with Cuban, jazz, and soul influences.",
    subgenres: ["Traditional Mbalax", "Modern Mbalax"],
    topArtists: [
      {
        id: "mbalax-artist-1",
        name: "Youssou N'Dour",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "2.8M"
      },
      {
        id: "mbalax-artist-2",
        name: "Baaba Maal",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "1.5M"
      },
      {
        id: "mbalax-artist-3",
        name: "Orchestra Baobab",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.2M"
      },
      {
        id: "mbalax-artist-4",
        name: "Ismaël Lô",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "0.9M"
      }
    ],
    tracks: [
      {
        id: "mbalax-1",
        title: "7 Seconds",
        artist: "Youssou N'Dour ft. Neneh Cherry",
        album: "The Guide (Wommat)",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 245,
        type: "song"
      },
      {
        id: "mbalax-2",
        title: "Yela",
        artist: "Baaba Maal",
        album: "Firin' in Fouta",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 312,
        type: "song"
      },
      {
        id: "mbalax-3",
        title: "Utru Horas",
        artist: "Orchestra Baobab",
        album: "Specialist in All Styles",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 289,
        type: "song"
      },
      {
        id: "mbalax-4",
        title: "Tajabone",
        artist: "Ismaël Lô",
        album: "Iso",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "mbalax-pl-1",
        name: "Mbalax Masters",
        description: "Essential Senegalese mbalax",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 50
      },
      {
        id: "mbalax-pl-2",
        name: "Modern Mbalax",
        description: "Contemporary mbalax sounds",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 40
      }
    ],
    albums: [
      {
        id: "mbalax-album-1",
        title: "The Guide (Wommat)",
        artist: "Youssou N'Dour",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1994"
      }
    ]
  },
  "Soukous": {
    name: "Soukous",
    color: "#10B981",
    description: "Congolese dance music featuring intricate guitar work, rumba rhythms, and infectious grooves.",
    subgenres: ["Rumba Congolaise", "Ndombolo", "Soukous Modern"],
    topArtists: [
      {
        id: "soukous-artist-1",
        name: "Papa Wemba",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "soukous-artist-2",
        name: "Koffi Olomidé",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "2.5M"
      },
      {
        id: "soukous-artist-3",
        name: "Tabu Ley Rochereau",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.2M"
      },
      {
        id: "soukous-artist-4",
        name: "Awilo Longomba",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.5M"
      }
    ],
    tracks: [
      {
        id: "soukous-1",
        title: "Show Me the Way",
        artist: "Papa Wemba",
        album: "Emotion",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 298,
        type: "song"
      },
      {
        id: "soukous-2",
        title: "Loi",
        artist: "Koffi Olomidé",
        album: "Loi",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 345,
        type: "song"
      },
      {
        id: "soukous-3",
        title: "Kaful Mayay",
        artist: "Awilo Longomba",
        album: "Karolina",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      },
      {
        id: "soukous-4",
        title: "Hafi Deo",
        artist: "Tabu Ley Rochereau",
        album: "Tabu Ley Rochereau",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 312,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "soukous-pl-1",
        name: "Soukous Classics",
        description: "Essential Congolese soukous",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 60
      },
      {
        id: "soukous-pl-2",
        name: "Ndombolo Party",
        description: "High-energy ndombolo dance tracks",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 50
      }
    ],
    albums: [
      {
        id: "soukous-album-1",
        title: "Emotion",
        artist: "Papa Wemba",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "1995"
      }
    ]
  },
  "Kwaito": {
    name: "Kwaito",
    color: "#FACC15",
    description: "South African house music variant with slowed-down beats, African samples, and township culture influences.",
    subgenres: ["Classic Kwaito", "Kwaito House"],
    topArtists: [
      {
        id: "kwaito-artist-1",
        name: "Mandoza",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.2M"
      },
      {
        id: "kwaito-artist-2",
        name: "Mafikizolo",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "2.1M"
      },
      {
        id: "kwaito-artist-3",
        name: "Trompies",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "0.9M"
      },
      {
        id: "kwaito-artist-4",
        name: "Bongo Maffin",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.1M"
      }
    ],
    tracks: [
      {
        id: "kwaito-1",
        title: "Nkalakatha",
        artist: "Mandoza",
        album: "Nkalakatha",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      },
      {
        id: "kwaito-2",
        title: "Khona",
        artist: "Mafikizolo",
        album: "Reunited",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 267,
        type: "song"
      },
      {
        id: "kwaito-3",
        title: "Magasman",
        artist: "Trompies",
        album: "Trompies",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      },
      {
        id: "kwaito-4",
        title: "The Way Kungakhona",
        artist: "Bongo Maffin",
        album: "Bongo Maffin",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 245,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "kwaito-pl-1",
        name: "Kwaito Classics",
        description: "Essential South African kwaito",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 55
      },
      {
        id: "kwaito-pl-2",
        name: "Kwaito Party",
        description: "Township party vibes",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 45
      }
    ],
    albums: [
      {
        id: "kwaito-album-1",
        title: "Nkalakatha",
        artist: "Mandoza",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2000"
      }
    ]
  },
  "Gqom": {
    name: "Gqom",
    color: "#8B5CF6",
    description: "South African electronic dance music from Durban featuring dark, minimal beats and heavy bass.",
    subgenres: ["Durban Gqom", "Gqom Tech"],
    topArtists: [
      {
        id: "gqom-artist-1",
        name: "DJ Lag",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.5M"
      },
      {
        id: "gqom-artist-2",
        name: "Distruction Boyz",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "2.3M"
      },
      {
        id: "gqom-artist-3",
        name: "Babes Wodumo",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "1.8M"
      },
      {
        id: "gqom-artist-4",
        name: "Moonchild Sanelly",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "1.2M"
      }
    ],
    tracks: [
      {
        id: "gqom-1",
        title: "Ice Drop",
        artist: "DJ Lag",
        album: "Meeting with the King",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 189,
        type: "song"
      },
      {
        id: "gqom-2",
        title: "Omunye",
        artist: "Distruction Boyz ft. Benny Maverick",
        album: "Gqom Is The Future",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 234,
        type: "song"
      },
      {
        id: "gqom-3",
        title: "Wololo",
        artist: "Babes Wodumo",
        album: "Gqom Queen",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 198,
        type: "song"
      },
      {
        id: "gqom-4",
        title: "Bashiri",
        artist: "Moonchild Sanelly",
        album: "Nüdes",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 212,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "gqom-pl-1",
        name: "Gqom Bangers",
        description: "Hard-hitting gqom from Durban",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 50
      },
      {
        id: "gqom-pl-2",
        name: "Gqom Underground",
        description: "Dark and minimal gqom beats",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 40
      }
    ],
    albums: [
      {
        id: "gqom-album-1",
        title: "Gqom Is The Future",
        artist: "Distruction Boyz",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2018"
      }
    ]
  }
};

export const allGenres = Object.keys(genresData).sort();
