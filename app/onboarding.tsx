import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Music, Radio, Headphones, Heart, CheckCircle } from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";

type OnboardingStep = 'welcome' | 'genres' | 'artists' | 'complete';

const GENRES = [
  { id: 'pop', name: 'Pop', icon: '🎵' },
  { id: 'rock', name: 'Rock', icon: '🎸' },
  { id: 'hiphop', name: 'Hip Hop', icon: '🎤' },
  { id: 'electronic', name: 'Electronic', icon: '🎧' },
  { id: 'jazz', name: 'Jazz', icon: '🎺' },
  { id: 'classical', name: 'Classical', icon: '🎻' },
  { id: 'country', name: 'Country', icon: '🤠' },
  { id: 'rnb', name: 'R&B', icon: '💿' },
];

const ARTISTS = [
  { id: '1', name: 'The Weeknd', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
  { id: '2', name: 'Taylor Swift', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200' },
  { id: '3', name: 'Drake', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200' },
  { id: '4', name: 'Billie Eilish', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
  { id: '5', name: 'Ed Sheeran', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
  { id: '6', name: 'Ariana Grande', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200' },
];

export default function OnboardingScreen() {
  const { profile } = useUser();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const toggleGenre = useCallback((genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  }, []);

  const toggleArtist = useCallback((artistId: string) => {
    setSelectedArtists(prev => 
      prev.includes(artistId) 
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  }, []);

  const handleNext = useCallback(() => {
    if (step === 'welcome') {
      setStep('genres');
    } else if (step === 'genres') {
      setStep('artists');
    } else if (step === 'artists') {
      setStep('complete');
    } else {
      router.replace('/' as any);
    }
  }, [step]);

  const handleSkip = useCallback(() => {
    router.replace('/' as any);
  }, []);

  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Music size={80} color="#FF0080" strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Welcome to DiDit360</Text>
          <Text style={styles.subtitle}>
            {profile ? `Hi ${profile.displayName}! ` : ''}
            Let&apos;s personalize your music experience
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Radio size={24} color="#6EE7B7" />
              <Text style={styles.featureText}>Discover new music</Text>
            </View>
            <View style={styles.feature}>
              <Headphones size={24} color="#6EE7B7" />
              <Text style={styles.featureText}>Create playlists</Text>
            </View>
            <View style={styles.feature}>
              <Heart size={24} color="#6EE7B7" />
              <Text style={styles.featureText}>Follow your favorites</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
            <Text style={styles.secondaryButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'genres') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.stepTitle}>Choose Your Genres</Text>
          <Text style={styles.stepSubtitle}>Select at least 3 genres you enjoy</Text>

          <View style={styles.grid}>
            {GENRES.map(genre => (
              <TouchableOpacity
                key={genre.id}
                style={[
                  styles.genreCard,
                  selectedGenres.includes(genre.id) && styles.genreCardSelected
                ]}
                onPress={() => toggleGenre(genre.id)}
              >
                <Text style={styles.genreIcon}>{genre.icon}</Text>
                <Text style={[
                  styles.genreName,
                  selectedGenres.includes(genre.id) && styles.genreNameSelected
                ]}>
                  {genre.name}
                </Text>
                {selectedGenres.includes(genre.id) && (
                  <View style={styles.checkmark}>
                    <CheckCircle size={20} color="#FF0080" fill="#FF0080" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.primaryButton, selectedGenres.length < 3 && styles.primaryButtonDisabled]} 
            onPress={handleNext}
            disabled={selectedGenres.length < 3}
          >
            <Text style={styles.primaryButtonText}>
              Continue ({selectedGenres.length}/3)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
            <Text style={styles.secondaryButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'artists') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.stepTitle}>Follow Artists</Text>
          <Text style={styles.stepSubtitle}>Choose artists you&apos;d like to follow</Text>

          <View style={styles.artistGrid}>
            {ARTISTS.map(artist => (
              <TouchableOpacity
                key={artist.id}
                style={[
                  styles.artistCard,
                  selectedArtists.includes(artist.id) && styles.artistCardSelected
                ]}
                onPress={() => toggleArtist(artist.id)}
              >
                <Image source={{ uri: artist.image }} style={styles.artistImage} />
                <Text style={styles.artistName}>{artist.name}</Text>
                {selectedArtists.includes(artist.id) && (
                  <View style={styles.artistCheckmark}>
                    <CheckCircle size={24} color="#FF0080" fill="#FF0080" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
            <Text style={styles.secondaryButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#6EE7B7" fill="#6EE7B7" />
        </View>
        <Text style={styles.title}>You&apos;re All Set!</Text>
        <Text style={styles.subtitle}>
          Your personalized music experience is ready
        </Text>
        
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Your Preferences:</Text>
          <Text style={styles.summaryText}>
            {selectedGenres.length} genres selected
          </Text>
          <Text style={styles.summaryText}>
            {selectedArtists.length} artists followed
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Start Listening</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0C',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  features: {
    width: '100%',
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    width: '47%',
    aspectRatio: 1.5,
    backgroundColor: '#121214',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1F1F22',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  genreCardSelected: {
    borderColor: '#FF0080',
    backgroundColor: '#1A0A12',
  },
  genreIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  genreName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  genreNameSelected: {
    color: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  artistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  artistCard: {
    width: '47%',
    aspectRatio: 0.8,
    backgroundColor: '#121214',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1F1F22',
    overflow: 'hidden',
    position: 'relative',
  },
  artistCardSelected: {
    borderColor: '#FF0080',
  },
  artistImage: {
    width: '100%',
    height: '75%',
    backgroundColor: '#1F1F22',
  },
  artistName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E5E7EB',
    padding: 12,
    textAlign: 'center',
  },
  artistCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  summary: {
    width: '100%',
    backgroundColor: '#121214',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF0080',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
  },
});
