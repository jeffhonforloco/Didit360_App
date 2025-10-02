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
  "Afro Beat": {
    name: "Afro Beat",
    color: "#EA580C",
    description: "West African music blending traditional rhythms with jazz, funk, and highlife.",
    subgenres: ["Afrobeats", "Afro-Fusion", "Afro-Pop", "Afro-House"],
    topArtists: [
      {
        id: "afrobeat-artist-1",
        name: "Burna Boy",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "32.5M"
      },
      {
        id: "afrobeat-artist-2",
        name: "Wizkid",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        followers: "28.7M"
      },
      {
        id: "afrobeat-artist-3",
        name: "Davido",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        followers: "25.3M"
      },
      {
        id: "afrobeat-artist-4",
        name: "Tems",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        followers: "18.2M"
      }
    ],
    tracks: [
      {
        id: "afrobeat-1",
        title: "Last Last",
        artist: "Burna Boy",
        album: "Love, Damini",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 162,
        type: "song"
      },
      {
        id: "afrobeat-2",
        title: "Essence",
        artist: "Wizkid ft. Tems",
        album: "Made in Lagos",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 244,
        type: "song"
      },
      {
        id: "afrobeat-3",
        title: "Fall",
        artist: "Davido",
        album: "A Good Time",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
        duration: 219,
        type: "song"
      },
      {
        id: "afrobeat-4",
        title: "Free Mind",
        artist: "Tems",
        album: "For Broken Ears",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 238,
        type: "song"
      }
    ],
    playlists: [
      {
        id: "afrobeat-pl-1",
        name: "Afrobeats Hits",
        description: "The hottest Afrobeats tracks",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        trackCount: 75
      },
      {
        id: "afrobeat-pl-2",
        name: "Afro Vibes",
        description: "Feel-good African rhythms",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        trackCount: 60
      }
    ],
    albums: [
      {
        id: "afrobeat-album-1",
        title: "Love, Damini",
        artist: "Burna Boy",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        year: "2022"
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
  }
};

export const allGenres = Object.keys(genresData);
