import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Users,
  Send,
  Mic,
  MicOff,
  Radio,
  Heart,
  Play,
  Pause,
  SkipForward,
  Volume2,
  MessageCircle,
  ThumbsUp,
  Share2,
  Settings,
  Crown,
  UserPlus,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMixMind, type ChatMessage } from '@/contexts/MixMindContext';
import { usePlayer } from '@/contexts/PlayerContext';

export default function MixMindLiveScreen() {
  const [chatMessage, setChatMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  const { 
    collaborationSession,
    isLive,
    liveListeners,
    chatMessages,
    currentSet,
    sendChatMessage,
    startCollaboration,
    joinCollaboration,
  } = useMixMind();
  
  const { isPlaying, currentTrack, playTrack, togglePlayPause, skipNext } = usePlayer();

  const handleSendMessage = useCallback(async () => {
    const message = chatMessage.trim();
    if (!message || message.length > 200) return;
    
    await sendChatMessage(message, 'user-123', 'You');
    setChatMessage('');
  }, [chatMessage, sendChatMessage]);

  const handleStartLive = useCallback(async () => {
    if (!isLive) {
      await startCollaboration('user-123');
    }
  }, [isLive, startCollaboration]);

  const formatTime = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, []);

  const renderChatMessage = useCallback(({ item: message }: { item: ChatMessage }) => (
    <View style={styles.chatMessage}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageUsername}>{message.username}</Text>
        <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
      </View>
      <Text style={styles.messageText}>{message.message}</Text>
    </View>
  ), [formatTime]);

  const liveStats = useMemo(() => [
    { label: 'Listeners', value: liveListeners, icon: Users, color: '#667eea' },
    { label: 'Duration', value: collaborationSession ? `${Math.floor((Date.now() - collaborationSession.startTime.getTime()) / 60000)}m` : '0m', icon: Radio, color: '#FF0080' },
    { label: 'Messages', value: chatMessages.length, icon: MessageCircle, color: '#00D4AA' },
    { label: 'Tracks', value: currentSet?.tracks.length || 0, icon: Play, color: '#8B5CF6' },
  ], [liveListeners, collaborationSession, chatMessages.length, currentSet]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Live Session</Text>
          {isLive && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => setShowChat(!showChat)}>
          <MessageCircle size={24} color={showChat ? '#FF0080' : '#666'} />
        </TouchableOpacity>
      </View>

      {!isLive ? (
        <View style={styles.startLiveSection}>
          <LinearGradient
            colors={['#FF0080', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startLiveCard}
          >
            <Radio size={48} color="#FFF" />
            <Text style={styles.startLiveTitle}>Start Live Session</Text>
            <Text style={styles.startLiveDescription}>
              Share your music taste with others in real-time. 
              Collaborate on mixes and get instant feedback.
            </Text>
            <TouchableOpacity
              style={styles.startLiveButton}
              onPress={handleStartLive}
            >
              <Text style={styles.startLiveButtonText}>Go Live</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.liveContent}>
          <View style={styles.liveStatsSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {liveStats.map((stat) => (
                <View key={stat.label} style={[styles.statCard, { borderColor: stat.color }]}>
                  <stat.icon size={20} color={stat.color} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {currentTrack && (
            <View style={styles.currentTrackSection}>
              <LinearGradient
                colors={['#1A1A1A', '#2A2A2A']}
                style={styles.currentTrackCard}
              >
                <View style={styles.trackInfo}>
                  <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
                  <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>{currentTrack.artist}</Text>
                </View>
                <View style={styles.trackControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff size={20} color="#FF6B6B" /> : <Mic size={20} color="#00D4AA" />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={togglePlayPause}
                  >
                    {isPlaying ? <Pause size={20} color="#FFF" /> : <Play size={20} color="#FFF" />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={skipNext}
                  >
                    <SkipForward size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {showChat && (
            <KeyboardAvoidingView 
              style={styles.chatSection}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.chatHeader}>
                <MessageCircle size={20} color="#FF0080" />
                <Text style={styles.chatTitle}>Live Chat</Text>
                <Text style={styles.chatCount}>{chatMessages.length} messages</Text>
              </View>
              
              <FlatList
                data={chatMessages}
                renderItem={renderChatMessage}
                keyExtractor={(item) => item.id}
                style={styles.chatList}
                showsVerticalScrollIndicator={false}
                inverted
              />
              
              <View style={styles.chatInput}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Send a message..."
                  placeholderTextColor="#666"
                  value={chatMessage}
                  onChangeText={setChatMessage}
                  multiline
                  maxLength={200}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !chatMessage.trim() && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={!chatMessage.trim()}
                >
                  <Send size={18} color={chatMessage.trim() ? '#FFF' : '#666'} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}

          <View style={styles.participantsSection}>
            <View style={styles.participantsHeader}>
              <Users size={20} color="#667eea" />
              <Text style={styles.participantsTitle}>Participants ({liveListeners})</Text>
              <TouchableOpacity style={styles.inviteButton}>
                <UserPlus size={16} color="#667eea" />
                <Text style={styles.inviteText}>Invite</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {collaborationSession?.participants.map((participantId, index) => (
                <View key={participantId} style={styles.participantCard}>
                  <View style={styles.participantAvatar}>
                    {index === 0 && <Crown size={12} color="#F59E0B" />}
                    <Text style={styles.participantInitial}>
                      {participantId.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.participantName}>
                    {index === 0 ? 'Host' : `User ${index + 1}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0080',
  },
  liveText: {
    fontSize: 12,
    color: '#FF0080',
    fontWeight: 'bold',
  },
  startLiveSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  startLiveCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  startLiveTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 12,
  },
  startLiveDescription: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 24,
  },
  startLiveButton: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  startLiveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0080',
  },
  liveContent: {
    flex: 1,
  },
  liveStatsSection: {
    paddingVertical: 16,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginLeft: 20,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  currentTrackSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  currentTrackCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  nowPlayingLabel: {
    fontSize: 10,
    color: '#FF0080',
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#999',
  },
  trackControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSection: {
    flex: 1,
    backgroundColor: '#151515',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    gap: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
  },
  chatCount: {
    fontSize: 12,
    color: '#666',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatMessage: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF0080',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#DDD',
    lineHeight: 18,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFF',
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF0080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
  participantsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  participantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  participantsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  inviteText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  participantCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  participantAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  participantInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  participantName: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});