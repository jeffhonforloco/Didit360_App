import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Image,
  useWindowDimensions,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Headphones,
  Sliders,
  Mic,
  Users,
  Play,
  Pause,
  Save,
  Share2,
  FileText,
  QrCode,
  Volume2,
  Radio,
  Zap,
  Activity,
  TrendingUp,
  Music,
  Disc3,
  Waves,
  BarChart3,
  Settings,
  Sparkles,
  Gauge,
  Clock,
  Heart,
  Star,
  Flame,
  Wind,
  Target,
  Shuffle,
  Cast,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Layers,
  Crosshair,
  Volume,
  Repeat,
} from "lucide-react-native";
import { router } from "expo-router";
import { features } from "@/constants/features";
import { useDJInstinct, type DJInstinctMode, type TransitionStyle } from "@/contexts/DJInstinctContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Track } from "@/types";

const TRANSITION_OPTIONS: { value: TransitionStyle; label: string; icon: any }[] = [
  { value: "fade", label: "Fade", icon: Wind },
  { value: "echo", label: "Echo", icon: Waves },
  { value: "cut", label: "Cut", icon: Zap },
  { value: "drop", label: "Drop", icon: TrendingUp },
];

const { width: screenWidth } = Dimensions.get('window');

interface BeatPulse {
  id: string;
  x: number;
  y: number;
  scale: Animated.Value;
  opacity: Animated.Value;
}

export default function DJInstinctScreen() {
  const { width } = useWindowDimensions();
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const {
    mode,
    energy,
    transition,
    prompt,
    nowPlaying,
    queuePreview,
    party,
    mixHistory,
    loading,
    setMode,
    setEnergy,
    setTransition,
    setPrompt,
    startAutoMix,
    startLivePrompt,
    startPartySession,
    saveMix,
    updateParams,
  } = useDJInstinct();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showRecapModal, setShowRecapModal] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [bpm, setBpm] = useState(128);
  const [crowdEnergy, setCrowdEnergy] = useState(75);
  const [beatPulses, setBeatPulses] = useState<BeatPulse[]>([]);
  const [showStats, setShowStats] = useState(true);
  const [crossfadeTime, setCrossfadeTime] = useState(8);
  const [eqLow, setEqLow] = useState(50);
  const [eqMid, setEqMid] = useState(50);
  const [eqHigh, setEqHigh] = useState(50);
  const [masterVolume, setMasterVolume] = useState(80);
  const [showEQ, setShowEQ] = useState(true);
  const [showMixer, setShowMixer] = useState(true);
  const [autoGain, setAutoGain] = useState(true);
  const [beatSync, setBeatSync] = useState(true);
  const [harmonic, setHarmonic] = useState(true);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const energyAnim = useRef(new Animated.Value(energy)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [pulseAnim, waveAnim, glowAnim]);
  
  useEffect(() => {
    Animated.spring(energyAnim, {
      toValue: energy,
      useNativeDriver: false,
    }).start();
  }, [energy, energyAnim]);
  
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newPulse: BeatPulse = {
          id: Date.now().toString(),
          x: Math.random() * screenWidth,
          y: Math.random() * 200,
          scale: new Animated.Value(0),
          opacity: new Animated.Value(1),
        };
        
        setBeatPulses(prev => [...prev.slice(-5), newPulse]);
        
        Animated.parallel([
          Animated.timing(newPulse.scale, {
            toValue: 2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(newPulse.opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();
      }, 468);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleModeChange = (newMode: DJInstinctMode) => {
    console.log('[DJInstinct] Mode changed to:', newMode);
    setMode(newMode);
  };

  const handleEnergyChange = (value: number) => {
    setEnergy(value);
    updateParams();
  };

  const handleTransitionChange = (value: TransitionStyle) => {
    setTransition(value);
    updateParams();
  };

  const handleStartSet = async () => {
    switch (mode) {
      case "automix":
        await startAutoMix();
        break;
      case "livePrompt":
        await startLivePrompt();
        break;
      case "party":
        await startPartySession();
        break;
    }
  };

  const renderTrackItem = ({ item, index }: { item: Track; index: number }) => (
    <View style={[styles.trackItem, index === 0 && styles.trackItemFirst]}>
      <View style={styles.trackNumber}>
        <Text style={styles.trackNumberText}>{index + 1}</Text>
      </View>
      <Image source={{ uri: item.artwork }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <View style={styles.trackMeta}>
        <Text style={styles.trackBPM}>{Math.floor(120 + Math.random() * 20)} BPM</Text>
        <Text style={styles.trackKey}>C♯</Text>
      </View>
    </View>
  );

  const renderVoteItem = ({ item }: { item: any }) => (
    <View style={styles.voteItem}>
      <Text style={styles.voteLabel}>{item.label}</Text>
      <View style={styles.voteBar}>
        <View style={[styles.voteBarFill, { width: `${(item.count / 10) * 100}%` }]} />
      </View>
      <Text style={styles.voteCount}>{item.count}</Text>
    </View>
  );

  const renderMixHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyTime}>
        <Text style={styles.historyTimeText}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.historyTrack}>
        <Text style={styles.historyTitle}>{item.track.title}</Text>
        <Text style={styles.historyArtist}>{item.track.artist}</Text>
        <Text style={styles.historyTransition}>
          {item.transition} • Energy: {item.energy}%
        </Text>
      </View>
    </View>
  );

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 0, 128, 0.2)', 'rgba(255, 0, 128, 0.6)'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A0A0A", "#1A0A1A", "#0A0A0A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
              <ArrowLeft size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Headphones size={24} color="#FF0080" />
              </Animated.View>
              <Text style={styles.title}>DJ Instinct</Text>
            </View>
            <TouchableOpacity onPress={() => setShowStats(!showStats)}>
              <Activity size={24} color={showStats ? "#FF0080" : "#666"} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>AI-Powered Professional DJ Experience</Text>

            {showStats && (
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <View style={styles.statItem}>
                    <Gauge size={20} color="#FF0080" />
                    <Text style={styles.statLabel}>BPM</Text>
                    <Text style={styles.statValue}>{bpm}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Activity size={20} color="#00FF88" />
                    <Text style={styles.statLabel}>Energy</Text>
                    <Text style={styles.statValue}>{energy}%</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users size={20} color="#FFD700" />
                    <Text style={styles.statLabel}>Crowd</Text>
                    <Text style={styles.statValue}>{crowdEnergy}%</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Clock size={20} color="#00D4FF" />
                    <Text style={styles.statLabel}>Tracks</Text>
                    <Text style={styles.statValue}>{queuePreview.length}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modeTabs}>
              {[
                { key: "automix", label: "AutoMix", icon: Sliders, desc: "AI-powered seamless mixing" },
                { key: "livePrompt", label: "Live Prompt", icon: Mic, desc: "Voice-guided DJ sets" },
                { key: "party", label: "Party Mode", icon: Users, desc: "Crowd-sourced vibes" },
              ].map(({ key, label, icon: Icon, desc }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.modeTab,
                    mode === key && styles.modeTabActive,
                  ]}
                  onPress={() => handleModeChange(key as DJInstinctMode)}
                >
                  <Icon
                    size={24}
                    color={mode === key ? "#FFF" : "#666"}
                  />
                  <View style={styles.modeTabContent}>
                    <Text
                      style={[
                        styles.modeTabText,
                        mode === key && styles.modeTabTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                    <Text style={styles.modeTabDesc}>{desc}</Text>
                  </View>
                  {mode === key && (
                    <View style={styles.modeTabIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.controlPanel}>
              <View style={styles.controlHeader}>
                <Sparkles size={20} color="#FF0080" />
                <Text style={styles.controlTitle}>DJ Controls</Text>
              </View>

              <View style={styles.energyControl}>
                <View style={styles.energyHeader}>
                  <Text style={styles.controlLabel}>Energy Level</Text>
                  <Animated.View style={[styles.energyBadge, { backgroundColor: glowColor }]}>
                    <Flame size={16} color="#FFF" />
                    <Text style={styles.energyValue}>{energy}%</Text>
                  </Animated.View>
                </View>
                <TouchableOpacity
                  style={styles.slider}
                  onPress={(e) => {
                    const { locationX } = e.nativeEvent;
                    const containerWidth = width - 80;
                    const newEnergy = Math.round((locationX / containerWidth) * 100);
                    handleEnergyChange(Math.max(0, Math.min(100, newEnergy)));
                  }}
                >
                  <View style={styles.sliderTrack}>
                    <Animated.View
                      style={[
                        styles.sliderProgress,
                        { 
                          width: energyAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.sliderThumb,
                        { 
                          left: energyAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    >
                      <View style={styles.sliderThumbInner} />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
                <View style={styles.energyLabels}>
                  <Text style={styles.energyLabelText}>Chill</Text>
                  <Text style={styles.energyLabelText}>Groove</Text>
                  <Text style={styles.energyLabelText}>Hype</Text>
                  <Text style={styles.energyLabelText}>Ecstatic</Text>
                </View>
              </View>

              <View style={styles.transitionControl}>
                <Text style={styles.controlLabel}>Transition Style</Text>
                <View style={styles.transitionGrid}>
                  {TRANSITION_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.transitionOption,
                        transition === option.value && styles.transitionOptionActive,
                      ]}
                      onPress={() => handleTransitionChange(option.value)}
                    >
                      <option.icon
                        size={20}
                        color={transition === option.value ? "#FFF" : "#666"}
                      />
                      <Text
                        style={[
                          styles.transitionText,
                          transition === option.value && styles.transitionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.advancedButton}
                onPress={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                <Settings size={18} color="#FF0080" />
                <Text style={styles.advancedButtonText}>Advanced Settings</Text>
              </TouchableOpacity>
            </View>

            {showAdvancedSettings && (
              <View style={styles.advancedPanel}>
                <View style={styles.advancedRow}>
                  <View style={styles.advancedItem}>
                    <Text style={styles.advancedLabel}>BPM Range</Text>
                    <View style={styles.bpmRange}>
                      <TextInput
                        style={styles.bpmInput}
                        value="100"
                        keyboardType="numeric"
                        placeholderTextColor="#666"
                      />
                      <Text style={styles.bpmSeparator}>-</Text>
                      <TextInput
                        style={styles.bpmInput}
                        value="140"
                        keyboardType="numeric"
                        placeholderTextColor="#666"
                      />
                    </View>
                  </View>
                  <View style={styles.advancedItem}>
                    <Text style={styles.advancedLabel}>Key Lock</Text>
                    <TouchableOpacity style={styles.toggleButton}>
                      <View style={styles.toggleActive} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {mode === "livePrompt" && (
              <View style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <Mic size={20} color="#FF0080" />
                  <Text style={styles.promptTitle}>Voice Command</Text>
                </View>
                <View style={styles.promptContainer}>
                  <TextInput
                    style={styles.promptInput}
                    placeholder="e.g. 'Play Afrobeats energy', 'Sunset chill vibes', '90s throwback'"
                    placeholderTextColor="#666"
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                  />
                  <TouchableOpacity style={styles.micButton}>
                    <Mic size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.promptSuggestions}>
                  {['Afrobeats Energy', 'Sunset Chill', '90s Throwback', 'Latin Vibes'].map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionChip}
                      onPress={() => setPrompt(suggestion)}
                    >
                      <Sparkles size={12} color="#FF0080" />
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {mode === "party" && party.sessionId && (
              <View style={styles.partyCard}>
                <View style={styles.partyHeader}>
                  <Users size={20} color="#FF0080" />
                  <Text style={styles.partyTitle}>Party Session Active</Text>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
                <View style={styles.partyInfo}>
                  <View style={styles.qrSection}>
                    <QrCode size={100} color="#FF0080" />
                    <Text style={styles.qrText}>Scan to join</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionLabel}>Session ID</Text>
                    <Text style={styles.sessionId}>
                      {party.sessionId.slice(-8).toUpperCase()}
                    </Text>
                    <Text style={styles.sessionUrl}>
                      {Platform.OS === 'web' ? window.location.origin : 'didit360.com'}/join/{party.sessionId}
                    </Text>
                  </View>
                </View>
                
                {party.votes.length > 0 && (
                  <View style={styles.votingBoard}>
                    <Text style={styles.votingTitle}>Live Crowd Votes</Text>
                    <FlatList
                      data={party.votes}
                      renderItem={renderVoteItem}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                    />
                  </View>
                )}
              </View>
            )}

            {(nowPlaying || currentTrack) && (
              <View style={styles.nowPlayingCard}>
                <View style={styles.nowPlayingHeader}>
                  <Disc3 size={20} color="#FF0080" />
                  <Text style={styles.nowPlayingTitle}>Now Playing</Text>
                  {isPlaying && (
                    <View style={styles.playingIndicator}>
                      <View style={[styles.playingBar, { height: 12 }]} />
                      <View style={[styles.playingBar, { height: 18 }]} />
                      <View style={[styles.playingBar, { height: 8 }]} />
                      <View style={[styles.playingBar, { height: 15 }]} />
                    </View>
                  )}
                </View>
                <View style={styles.nowPlayingContent}>
                  <Image
                    source={{ uri: (nowPlaying || currentTrack)?.artwork }}
                    style={styles.nowPlayingImage}
                  />
                  <View style={styles.nowPlayingInfo}>
                    <Text style={styles.nowPlayingTrack}>
                      {(nowPlaying || currentTrack)?.title}
                    </Text>
                    <Text style={styles.nowPlayingArtist}>
                      {(nowPlaying || currentTrack)?.artist}
                    </Text>
                    <View style={styles.nowPlayingMeta}>
                      <View style={styles.metaChip}>
                        <Gauge size={12} color="#FF0080" />
                        <Text style={styles.metaText}>{bpm} BPM</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Music size={12} color="#00FF88" />
                        <Text style={styles.metaText}>C♯ Major</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause size={28} color="#FFF" fill="#FFF" />
                    ) : (
                      <Play size={28} color="#FFF" fill="#FFF" />
                    )}
                  </TouchableOpacity>
                </View>
                
                <View style={styles.waveform}>
                  {Array.from({ length: 50 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.waveformBar,
                        { 
                          height: Math.random() * 40 + 10,
                          opacity: isPlaying ? 0.8 : 0.3,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            {queuePreview.length > 0 && (
              <View style={styles.queueCard}>
                <View style={styles.queueHeader}>
                  <Target size={20} color="#FF0080" />
                  <Text style={styles.queueTitle}>AI-Curated Queue</Text>
                  <View style={styles.queueBadge}>
                    <Sparkles size={12} color="#FFF" />
                    <Text style={styles.queueBadgeText}>{queuePreview.length}</Text>
                  </View>
                </View>
                <FlatList
                  data={queuePreview}
                  renderItem={renderTrackItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}

            <View style={styles.professionalSection}>
              <View style={styles.sectionHeader}>
                <Radio size={24} color="#FF6B35" />
                <Text style={styles.sectionTitle}>Live Mixing Console</Text>
                <View style={styles.liveBadge}>
                  <View style={styles.livePulse} />
                  <Text style={styles.liveTextSmall}>LIVE</Text>
                </View>
              </View>

              <View style={styles.mixerPanel}>
                <View style={styles.mixerHeader}>
                  <Sliders size={20} color="#FF0080" />
                  <Text style={styles.mixerTitle}>Crossfade & Volume Control</Text>
                </View>

                <View style={styles.mixerContent}>
                  <View style={styles.mixerContent}>
                    <View style={styles.crossfadeSection}>
                      <Text style={styles.mixerLabel}>Crossfade Time</Text>
                      <View style={styles.crossfadeDisplay}>
                        <Text style={styles.crossfadeValue}>{crossfadeTime}s</Text>
                      </View>
                      <View style={styles.crossfadeButtons}>
                        {[4, 8, 12, 16].map((time) => (
                          <TouchableOpacity
                            key={time}
                            style={[
                              styles.crossfadeButton,
                              crossfadeTime === time && styles.crossfadeButtonActive,
                            ]}
                            onPress={() => setCrossfadeTime(time)}
                          >
                            <Text
                              style={[
                                styles.crossfadeButtonText,
                                crossfadeTime === time && styles.crossfadeButtonTextActive,
                              ]}
                            >
                              {time}s
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.masterVolumeSection}>
                      <View style={styles.volumeHeader}>
                        <Volume2 size={18} color="#FF0080" />
                        <Text style={styles.mixerLabel}>Master Volume</Text>
                        <Text style={styles.volumeValue}>{masterVolume}%</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.volumeSlider}
                        onPress={(e) => {
                          const { locationX } = e.nativeEvent;
                          const containerWidth = width - 120;
                          const newVolume = Math.round((locationX / containerWidth) * 100);
                          setMasterVolume(Math.max(0, Math.min(100, newVolume)));
                        }}
                      >
                        <View style={styles.volumeTrack}>
                          <View
                            style={[
                              styles.volumeProgress,
                              { width: `${masterVolume}%` },
                            ]}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.togglesSection}>
                      <TouchableOpacity
                        style={styles.toggleItem}
                        onPress={() => setAutoGain(!autoGain)}
                      >
                        <Gauge size={18} color={autoGain ? "#00FF88" : "#666"} />
                        <Text style={[styles.toggleLabel, autoGain && styles.toggleLabelActive]}>
                          Auto Gain
                        </Text>
                        <View style={[styles.toggleSwitch, autoGain && styles.toggleSwitchActive]}>
                          <View style={[styles.toggleKnob, autoGain && styles.toggleKnobActive]} />
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.toggleItem}
                        onPress={() => setBeatSync(!beatSync)}
                      >
                        <Crosshair size={18} color={beatSync ? "#00FF88" : "#666"} />
                        <Text style={[styles.toggleLabel, beatSync && styles.toggleLabelActive]}>
                          Beat Sync
                        </Text>
                        <View style={[styles.toggleSwitch, beatSync && styles.toggleSwitchActive]}>
                          <View style={[styles.toggleKnob, beatSync && styles.toggleKnobActive]} />
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.toggleItem}
                        onPress={() => setHarmonic(!harmonic)}
                      >
                        <Music size={18} color={harmonic ? "#00FF88" : "#666"} />
                        <Text style={[styles.toggleLabel, harmonic && styles.toggleLabelActive]}>
                          Harmonic Mix
                        </Text>
                        <View style={[styles.toggleSwitch, harmonic && styles.toggleSwitchActive]}>
                          <View style={[styles.toggleKnob, harmonic && styles.toggleKnobActive]} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.eqPanel}>
                <View style={styles.eqHeader}>
                  <BarChart3 size={20} color="#FF0080" />
                  <Text style={styles.eqTitle}>3-Band Equalizer</Text>
                </View>

                <View style={styles.eqContent}>
                  <View style={styles.eqContent}>
                    <View style={styles.eqBand}>
                      <Text style={styles.eqLabel}>LOW</Text>
                      <View style={styles.eqSliderContainer}>
                        <View style={styles.eqSlider}>
                          <View
                            style={[
                              styles.eqFill,
                              { height: `${eqLow}%`, backgroundColor: '#FF0080' },
                            ]}
                          />
                        </View>
                      </View>
                      <Text style={styles.eqValue}>{eqLow}%</Text>
                    </View>

                    <View style={styles.eqBand}>
                      <Text style={styles.eqLabel}>MID</Text>
                      <View style={styles.eqSliderContainer}>
                        <View style={styles.eqSlider}>
                          <View
                            style={[
                              styles.eqFill,
                              { height: `${eqMid}%`, backgroundColor: '#00FF88' },
                            ]}
                          />
                        </View>
                      </View>
                      <Text style={styles.eqValue}>{eqMid}%</Text>
                    </View>

                    <View style={styles.eqBand}>
                      <Text style={styles.eqLabel}>HIGH</Text>
                      <View style={styles.eqSliderContainer}>
                        <View style={styles.eqSlider}>
                          <View
                            style={[
                              styles.eqFill,
                              { height: `${eqHigh}%`, backgroundColor: '#FFD700' },
                            ]}
                          />
                        </View>
                      </View>
                      <Text style={styles.eqValue}>{eqHigh}%</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.beatMatchPanel}>
                <View style={styles.beatMatchHeader}>
                  <Crosshair size={20} color="#00FF88" />
                  <Text style={styles.beatMatchTitle}>Beat Matching & Sync</Text>
                </View>
                <View style={styles.beatMatchContent}>
                  <View style={styles.bpmDisplay}>
                    <Text style={styles.bpmLabel}>Current BPM</Text>
                    <Text style={styles.bpmValue}>{bpm}</Text>
                    <View style={styles.bpmControls}>
                      <TouchableOpacity 
                        style={styles.bpmButton}
                        onPress={() => setBpm(prev => Math.max(60, prev - 1))}
                      >
                        <Text style={styles.bpmButtonText}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.bpmButton}
                        onPress={() => setBpm(prev => Math.min(200, prev + 1))}
                      >
                        <Text style={styles.bpmButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.syncControls}>
                    <TouchableOpacity 
                      style={[styles.syncButton, beatSync && styles.syncButtonActive]}
                      onPress={() => setBeatSync(!beatSync)}
                    >
                      <Crosshair size={18} color={beatSync ? "#FFF" : "#666"} />
                      <Text style={[styles.syncButtonText, beatSync && styles.syncButtonTextActive]}>
                        Auto Sync
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.syncButton, harmonic && styles.syncButtonActive]}
                      onPress={() => setHarmonic(!harmonic)}
                    >
                      <Music size={18} color={harmonic ? "#FFF" : "#666"} />
                      <Text style={[styles.syncButtonText, harmonic && styles.syncButtonTextActive]}>
                        Harmonic Mix
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {features.liveDJ.enabled && (
                <TouchableOpacity 
                  style={styles.liveDJCard}
                  onPress={() => router.push('/dj-instinct/live')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FF6B35', '#FF0080', '#8B00FF']}
                    style={styles.liveDJGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.liveDJOverlay}>
                      <View style={styles.liveDJTop}>
                        <View style={styles.liveDJIconLarge}>
                          <Radio size={40} color="#FFF" />
                        </View>
                        <View style={styles.liveDJBadges}>
                          <View style={styles.liveBadge}>
                            <View style={styles.livePulse} />
                            <Text style={styles.liveTextSmall}>LIVE</Text>
                          </View>
                          <View style={styles.castBadge}>
                            <Cast size={14} color="#FFF" />
                            <Text style={styles.castText}>Cast Ready</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.liveDJContent}>
                        <Text style={styles.liveDJTitleLarge}>Start Live DJ Session</Text>
                        <Text style={styles.liveDJDescription}>
                          Professional real-time mixing for parties, events & shows. Multi-device casting, crowd sync, beat matching, and emergency controls.
                        </Text>
                      </View>
                      
                      <View style={styles.liveDJFeatureGrid}>
                        <View style={styles.featureItem}>
                          <Crosshair size={18} color="#00FF88" />
                          <Text style={styles.featureLabel}>Beat Match</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <Layers size={18} color="#FFD700" />
                          <Text style={styles.featureLabel}>Multi-Deck</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <Users size={18} color="#00D4FF" />
                          <Text style={styles.featureLabel}>Crowd Sync</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <AlertTriangle size={18} color="#FF6B35" />
                          <Text style={styles.featureLabel}>Emergency</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <Cast size={18} color="#8B00FF" />
                          <Text style={styles.featureLabel}>Multi-Cast</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <Wifi size={18} color="#00D4FF" />
                          <Text style={styles.featureLabel}>Device Pair</Text>
                        </View>
                      </View>
                      
                      <View style={styles.liveDJAction}>
                        <Text style={styles.liveDJActionText}>Launch Live Mode</Text>
                        <Zap size={20} color="#FFF" fill="#FFF" />
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <View style={styles.quickFeatures}>
                <TouchableOpacity style={styles.quickFeature}>
                  <View style={styles.quickFeatureIcon}>
                    <Wifi size={20} color="#00FF88" />
                  </View>
                  <Text style={styles.quickFeatureText}>Device Pairing</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.quickFeature}>
                  <View style={styles.quickFeatureIcon}>
                    <AlertTriangle size={20} color="#FFD700" />
                  </View>
                  <Text style={styles.quickFeatureText}>Safety Mode</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.quickFeature}>
                  <View style={styles.quickFeatureIcon}>
                    <Repeat size={20} color="#00D4FF" />
                  </View>
                  <Text style={styles.quickFeatureText}>Auto-Transition</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionBar}>
              <TouchableOpacity
                style={[styles.primaryAction, loading && styles.actionDisabled]}
                onPress={handleStartSet}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#333', '#333'] : ['#FF0080', '#FF6B35']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <Volume2 size={24} color="#999" />
                  ) : (
                    <Zap size={24} color="#FFF" />
                  )}
                  <Text style={[styles.primaryActionText, loading && styles.actionTextDisabled]}>
                    {loading ? "Starting..." : "Start DJ Set"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.secondaryAction} onPress={saveMix}>
                  <Save size={20} color="#FF0080" />
                  <Text style={styles.secondaryActionText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryAction}
                  onPress={() => setShowShareModal(true)}
                >
                  <Share2 size={20} color="#FF0080" />
                  <Text style={styles.secondaryActionText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryAction}
                  onPress={() => setShowRecapModal(true)}
                >
                  <FileText size={20} color="#FF0080" />
                  <Text style={styles.secondaryActionText}>Recap</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryAction}>
                  <Shuffle size={20} color="#FF0080" />
                  <Text style={styles.secondaryActionText}>Shuffle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Share Your Mix</Text>
            <View style={styles.shareOptions}>
              {[
                { icon: Share2, label: 'Didit360 Link', color: '#FF0080' },
                { icon: Star, label: 'Instagram Story', color: '#E1306C' },
                { icon: Music, label: 'TikTok Clip', color: '#00F2EA' },
                { icon: Heart, label: 'Twitter Post', color: '#1DA1F2' },
              ].map((option, index) => (
                <TouchableOpacity key={index} style={styles.shareOption}>
                  <View style={[styles.shareIcon, { backgroundColor: `${option.color}20` }]}>
                    <option.icon size={24} color={option.color} />
                  </View>
                  <Text style={styles.shareOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRecapModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRecapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recapModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Mix Recap</Text>
            {mixHistory.length > 0 ? (
              <FlatList
                data={mixHistory}
                renderItem={renderMixHistoryItem}
                keyExtractor={(item) => item.id}
                style={styles.historyList}
              />
            ) : (
              <View style={styles.emptyState}>
                <BarChart3 size={48} color="#333" />
                <Text style={styles.emptyText}>No mix history yet</Text>
                <Text style={styles.emptySubtext}>Start a DJ set to see your mix history</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowRecapModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  statsCard: {
    backgroundColor: "rgba(255, 0, 128, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.1)",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  modeTabs: {
    gap: 12,
    marginBottom: 24,
  },
  modeTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  modeTabActive: {
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    borderColor: "#FF0080",
  },
  modeTabContent: {
    flex: 1,
  },
  modeTabText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
    marginBottom: 4,
  },
  modeTabTextActive: {
    color: "#FFF",
  },
  modeTabDesc: {
    fontSize: 12,
    color: "#666",
  },
  modeTabIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#FF0080",
    borderRadius: 4,
  },
  controlPanel: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.1)",
  },
  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  energyControl: {
    marginBottom: 24,
  },
  energyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  energyValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  slider: {
    height: 50,
    justifyContent: "center",
    marginBottom: 8,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    position: "relative",
  },
  sliderProgress: {
    height: "100%",
    backgroundColor: "#FF0080",
    borderRadius: 4,
  },
  sliderThumb: {
    position: "absolute",
    top: -8,
    width: 24,
    height: 24,
    marginLeft: -12,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderThumbInner: {
    width: 24,
    height: 24,
    backgroundColor: "#FF0080",
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "#FFF",
    shadowColor: "#FF0080",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  energyLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  energyLabelText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  transitionControl: {
    marginBottom: 20,
  },
  transitionGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  transitionOption: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: "#333",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  transitionOptionActive: {
    backgroundColor: "rgba(255, 0, 128, 0.2)",
    borderColor: "#FF0080",
  },
  transitionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  transitionTextActive: {
    color: "#FFF",
  },
  advancedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.2)",
  },
  advancedButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF0080",
  },
  advancedPanel: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  advancedRow: {
    flexDirection: "row",
    gap: 16,
  },
  advancedItem: {
    flex: 1,
  },
  advancedLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
  },
  bpmRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bpmInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
  },
  bpmSeparator: {
    color: "#666",
    fontSize: 16,
  },
  toggleButton: {
    width: 50,
    height: 28,
    backgroundColor: "#FF0080",
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  toggleActive: {
    width: 24,
    height: 24,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  promptCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.2)",
  },
  promptHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  promptContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 16,
  },
  promptInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#FFF",
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: "top",
  },
  micButton: {
    width: 60,
    height: 60,
    backgroundColor: "#FF0080",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF0080",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  promptSuggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.2)",
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF0080",
  },
  partyCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.2)",
  },
  partyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  partyTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#FF0080",
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    backgroundColor: "#FFF",
    borderRadius: 3,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  partyInfo: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 24,
  },
  qrSection: {
    alignItems: "center",
    gap: 12,
  },
  qrText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  sessionInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  sessionLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  sessionId: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF0080",
    letterSpacing: 2,
  },
  sessionUrl: {
    fontSize: 11,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  votingBoard: {
    gap: 12,
  },
  votingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  voteItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  voteLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  voteBar: {
    width: 60,
    height: 6,
    backgroundColor: "#222",
    borderRadius: 3,
    overflow: "hidden",
  },
  voteBarFill: {
    height: "100%",
    backgroundColor: "#FF0080",
  },
  voteCount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF0080",
    minWidth: 30,
    textAlign: "right",
  },
  nowPlayingCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.2)",
  },
  nowPlayingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  nowPlayingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  playingIndicator: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  playingBar: {
    width: 3,
    backgroundColor: "#FF0080",
    borderRadius: 1.5,
  },
  nowPlayingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  nowPlayingImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTrack: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6,
  },
  nowPlayingArtist: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  nowPlayingMeta: {
    flexDirection: "row",
    gap: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
  },
  playButton: {
    width: 56,
    height: 56,
    backgroundColor: "#FF0080",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF0080",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
    gap: 1,
  },
  waveformBar: {
    flex: 1,
    backgroundColor: "#FF0080",
    borderRadius: 2,
  },
  queueCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.1)",
  },
  queueHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  queueTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  queueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 0, 128, 0.2)",
    borderRadius: 12,
  },
  queueBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF0080",
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  trackItemFirst: {
    backgroundColor: "rgba(255, 0, 128, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderBottomWidth: 0,
  },
  trackNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  trackNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 12,
    color: "#999",
  },
  trackMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  trackBPM: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FF0080",
  },
  trackKey: {
    fontSize: 11,
    fontWeight: "600",
    color: "#00FF88",
  },
  professionalSection: {
    marginBottom: 24,
  },
  mixerPanel: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 128, 0.2)',
  },
  mixerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mixerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF0080',
  },
  mixerContent: {
    gap: 20,
  },
  crossfadeSection: {
    gap: 12,
  },
  mixerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
  },
  crossfadeDisplay: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  crossfadeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF0080',
  },
  crossfadeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  crossfadeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  crossfadeButtonActive: {
    backgroundColor: 'rgba(255, 0, 128, 0.2)',
    borderColor: '#FF0080',
  },
  crossfadeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  crossfadeButtonTextActive: {
    color: '#FFF',
  },
  masterVolumeSection: {
    gap: 12,
  },
  volumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volumeValue: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '700',
    color: '#FF0080',
  },
  volumeSlider: {
    height: 40,
    justifyContent: 'center',
  },
  volumeTrack: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  volumeProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
    borderRadius: 4,
  },
  togglesSection: {
    gap: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 12,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleLabelActive: {
    color: '#FFF',
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#00FF88',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    backgroundColor: '#666',
    borderRadius: 10,
  },
  toggleKnobActive: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-end',
  },
  eqPanel: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 128, 0.2)',
  },
  eqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  eqTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  eqContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  eqBand: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  eqLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
  },
  eqSliderContainer: {
    height: 120,
    justifyContent: 'flex-end',
  },
  eqSlider: {
    width: 40,
    height: 120,
    backgroundColor: '#333',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  eqFill: {
    width: '100%',
    borderRadius: 20,
  },
  eqValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  proText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFD700",
  },
  beatMatchPanel: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  beatMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  beatMatchTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  beatMatchContent: {
    gap: 16,
  },
  bpmDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  bpmLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
  },
  bpmValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00FF88',
  },
  bpmControls: {
    flexDirection: 'row',
    gap: 12,
  },
  bpmButton: {
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00FF88',
  },
  bpmButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00FF88',
  },
  syncControls: {
    flexDirection: 'row',
    gap: 12,
  },
  syncButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  syncButtonActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderColor: '#00FF88',
  },
  syncButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
  syncButtonTextActive: {
    color: '#FFF',
  },
  liveDJCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  liveDJGradient: {
    padding: 2,
  },
  liveDJOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 22,
    padding: 24,
  },
  liveDJTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  liveDJIconLarge: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  liveDJBadges: {
    gap: 8,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 0, 0, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.5)",
  },
  livePulse: {
    width: 8,
    height: 8,
    backgroundColor: "#FF0000",
    borderRadius: 4,
  },
  liveTextSmall: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFF",
  },
  castBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
  },
  castText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  liveDJContent: {
    marginBottom: 24,
  },
  liveDJTitleLarge: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  liveDJDescription: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
  },
  liveDJFeatureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
  },
  liveDJAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  liveDJActionText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  quickFeatures: {
    flexDirection: "row",
    gap: 12,
  },
  quickFeature: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
  },
  quickFeatureIcon: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  quickFeatureText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    textAlign: "center",
  },
  actionBar: {
    gap: 16,
    paddingBottom: 40,
  },
  primaryAction: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FF0080",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  actionDisabled: {
    shadowOpacity: 0,
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  actionTextDisabled: {
    color: "#666",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.1)",
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF0080",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "flex-end",
  },
  shareModal: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  recapModal: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 24,
  },
  shareOptions: {
    gap: 12,
    marginBottom: 20,
  },
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 16,
  },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  shareOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  modalClose: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 16,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  historyList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  historyTime: {
    width: 70,
  },
  historyTimeText: {
    fontSize: 11,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  historyTrack: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  historyArtist: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  historyTransition: {
    fontSize: 11,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },
});
