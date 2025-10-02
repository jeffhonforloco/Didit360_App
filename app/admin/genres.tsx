import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PencilLine, Plus, Check, X, AlertCircle } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import type { Genre } from '@/types/catalog';

export default function AdminGenres() {
  const [newGenreName, setNewGenreName] = useState<string>('');
  const [newGenreDesc, setNewGenreDesc] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPending, setShowPending] = useState<boolean>(false);

  const genresQuery = trpc.genres.getGenres.useQuery({
    approved_only: !showPending,
    search: searchQuery,
  });

  const pendingQuery = trpc.genres.getPendingGenres.useQuery({}, {
    enabled: showPending,
  });

  const submitMutation = trpc.genres.submitGenre.useMutation({
    onSuccess: () => {
      setNewGenreName('');
      setNewGenreDesc('');
      genresQuery.refetch();
      pendingQuery.refetch();
    },
  });

  const approveMutation = trpc.genres.approveGenre.useMutation({
    onSuccess: () => {
      genresQuery.refetch();
      pendingQuery.refetch();
    },
  });

  const handleAddGenre = () => {
    const name = newGenreName.trim();
    if (!name) return;
    if (name.length > 100) return;

    submitMutation.mutate({
      name,
      description: newGenreDesc.trim() || undefined,
      submitted_by: 'admin',
    });
  };

  const handleApprove = (genreId: string, approved: boolean) => {
    approveMutation.mutate({
      genre_id: genreId,
      approved,
      approved_by: 'admin',
    });
  };

  const displayGenres = showPending 
    ? pendingQuery.data?.genres || []
    : genresQuery.data?.genres || [];

  const isLoading = showPending ? pendingQuery.isLoading : genresQuery.isLoading;

  return (
    <AdminLayout title="Genre Management">
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Genre</Text>
          <View style={styles.addCard}>
            <TextInput
              placeholder="Genre Name (e.g., Afro-Soul, Neo-Fuji)"
              placeholderTextColor="#94a3b8"
              value={newGenreName}
              onChangeText={setNewGenreName}
              style={styles.input}
            />
            <TextInput
              placeholder="Description (optional)"
              placeholderTextColor="#94a3b8"
              value={newGenreDesc}
              onChangeText={setNewGenreDesc}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
            />
            <Pressable 
              onPress={handleAddGenre} 
              style={[styles.addBtn, submitMutation.isPending && styles.btnDisabled]} 
              disabled={submitMutation.isPending}
              testID="add-genre"
            >
              {submitMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Plus color="#fff" size={16} />
                  <Text style={styles.btnText}>Add Genre</Text>
                </>
              )}
            </Pressable>
            {submitMutation.isSuccess && (
              <View style={styles.successMsg}>
                <Check color="#22c55e" size={16} />
                <Text style={styles.successText}>Genre submitted for approval</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.tabs}>
              <Pressable 
                onPress={() => setShowPending(false)} 
                style={[styles.tab, !showPending && styles.tabActive]}
              >
                <Text style={[styles.tabText, !showPending && styles.tabTextActive]}>Approved</Text>
              </Pressable>
              <Pressable 
                onPress={() => setShowPending(true)} 
                style={[styles.tab, showPending && styles.tabActive]}
              >
                <Text style={[styles.tabText, showPending && styles.tabTextActive]}>Pending</Text>
              </Pressable>
            </View>
          </View>

          <TextInput
            placeholder="Search genres..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.input, styles.searchInput]}
          />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#3b82f6" size="large" />
            </View>
          ) : displayGenres.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AlertCircle color="#64748b" size={32} />
              <Text style={styles.emptyText}>
                {showPending ? 'No pending genres' : 'No genres found'}
              </Text>
            </View>
          ) : (
            <View style={styles.genreList}>
              {displayGenres.map((genre: Genre) => (
                <View key={genre.id} style={styles.genreCard}>
                  <View style={styles.genreHeader}>
                    <View style={styles.genreInfo}>
                      <View style={styles.genreNameRow}>
                        <View style={[styles.colorDot, { backgroundColor: genre.color }]} />
                        <Text style={styles.genreName}>{genre.name}</Text>
                        {genre.is_system && (
                          <View style={styles.systemBadge}>
                            <Text style={styles.systemBadgeText}>System</Text>
                          </View>
                        )}
                        {!genre.is_approved && (
                          <View style={styles.pendingBadge}>
                            <Text style={styles.pendingBadgeText}>Pending</Text>
                          </View>
                        )}
                      </View>
                      {genre.description && (
                        <Text style={styles.genreDesc} numberOfLines={2}>{genre.description}</Text>
                      )}
                      <View style={styles.genreStats}>
                        <Text style={styles.genreStat}>{genre.track_count} tracks</Text>
                        <Text style={styles.genreStat}>•</Text>
                        <Text style={styles.genreStat}>{genre.artist_count} artists</Text>
                        {genre.submitted_by && (
                          <>
                            <Text style={styles.genreStat}>•</Text>
                            <Text style={styles.genreStat}>by {genre.submitted_by}</Text>
                          </>
                        )}
                      </View>
                      {genre.subgenres && genre.subgenres.length > 0 && (
                        <View style={styles.subgenres}>
                          {genre.subgenres.slice(0, 3).map((sub, idx) => (
                            <View key={idx} style={styles.subgenreTag}>
                              <Text style={styles.subgenreText}>{sub}</Text>
                            </View>
                          ))}
                          {genre.subgenres.length > 3 && (
                            <Text style={styles.moreSubgenres}>+{genre.subgenres.length - 3} more</Text>
                          )}
                        </View>
                      )}
                    </View>
                    <View style={styles.genreActions}>
                      {!genre.is_approved && (
                        <>
                          <Pressable 
                            style={[styles.actionBtn, styles.approveBtn]} 
                            onPress={() => handleApprove(genre.id, true)}
                            disabled={approveMutation.isPending}
                          >
                            <Check color="#fff" size={16} />
                          </Pressable>
                          <Pressable 
                            style={[styles.actionBtn, styles.rejectBtn]} 
                            onPress={() => handleApprove(genre.id, false)}
                            disabled={approveMutation.isPending}
                          >
                            <X color="#fff" size={16} />
                          </Pressable>
                        </>
                      )}
                      <Pressable style={[styles.actionBtn, styles.editBtn]}>
                        <PencilLine color="#cbd5e1" size={16} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Dynamic Genres</Text>
          <Text style={styles.infoText}>
            Artists can submit custom genres when uploading music. Submitted genres appear in the &quot;Pending&quot; tab for admin approval. Once approved, they become available for all artists to use and will appear in genre browsing.
          </Text>
          <Text style={styles.infoText}>
            This creates a comprehensive, worldwide database of music genres that grows organically with your platform.
          </Text>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  addCard: { backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 16 },
  input: { backgroundColor: '#111827', color: '#e5e7eb', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  textArea: { height: 80, textAlignVertical: 'top' },
  searchInput: { marginBottom: 16 },
  addBtn: { backgroundColor: '#22c55e', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  successMsg: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 12, backgroundColor: '#064e3b', borderRadius: 8 },
  successText: { color: '#22c55e', fontSize: 14 },
  tabs: { flexDirection: 'row', backgroundColor: '#0b0f12', borderRadius: 8, padding: 2 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  tabActive: { backgroundColor: '#1f2937' },
  tabText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  loadingContainer: { padding: 40, alignItems: 'center' },
  emptyContainer: { padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { color: '#64748b', fontSize: 14 },
  genreList: { gap: 12 },
  genreCard: { backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 16 },
  genreHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  genreInfo: { flex: 1 },
  genreNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  genreName: { color: '#fff', fontSize: 16, fontWeight: '700', flex: 1 },
  systemBadge: { backgroundColor: '#1e40af', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  systemBadgeText: { color: '#93c5fd', fontSize: 10, fontWeight: '600' },
  pendingBadge: { backgroundColor: '#854d0e', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  pendingBadgeText: { color: '#fbbf24', fontSize: 10, fontWeight: '600' },
  genreDesc: { color: '#94a3b8', fontSize: 13, marginBottom: 8, lineHeight: 18 },
  genreStats: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  genreStat: { color: '#64748b', fontSize: 12 },
  subgenres: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  subgenreTag: { backgroundColor: '#1f2937', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  subgenreText: { color: '#94a3b8', fontSize: 11 },
  moreSubgenres: { color: '#64748b', fontSize: 11, paddingVertical: 4 },
  genreActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 10, borderRadius: 8 },
  approveBtn: { backgroundColor: '#22c55e' },
  rejectBtn: { backgroundColor: '#ef4444' },
  editBtn: { backgroundColor: '#111827' },
  infoSection: { backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 16, marginTop: 8 },
  infoTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  infoText: { color: '#94a3b8', fontSize: 13, lineHeight: 20, marginBottom: 8 },
});
