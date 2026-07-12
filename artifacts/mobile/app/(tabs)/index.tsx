import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Redirect, router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { Button, Chip, SectionLabel } from '@/components/UI';
import { RouteVisual } from '@/components/RouteVisual';
import { EditableFieldModal } from '@/components/EditableFieldModal';

const TEASER_STOPS = ['You', 'Model Town Link', 'Mall Road', 'Destination'];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    onboarded,
    savedPlaces,
    recentSearches,
    addRecentSearch,
    setSavedPlace,
  } = useApp();

  const [from, setFrom] = useState('Your location');
  const [to, setTo] = useState('');
  const [locating, setLocating] = useState(true);
  const [teaserProgress, setTeaserProgress] = useState(0.25);
  const [editingPlace, setEditingPlace] = useState<'home' | 'work' | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'web') {
          setLocating(false);
          return;
        }
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocating(false);
          return;
        }
        const position = await Location.getCurrentPositionAsync({});
        const [place] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (place) {
          const label = [place.district || place.street, place.city].filter(Boolean).join(', ');
          if (label) setFrom(label);
        }
      } catch {
        // Keep the "Your location" fallback if geocoding is unavailable.
      } finally {
        setLocating(false);
      }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTeaserProgress((p) => (p >= 1 ? 0 : p + 0.08));
    }, 900);
    return () => clearInterval(id);
  }, []);

  if (!isLoading && !onboarded) {
    return <Redirect href="/onboarding" />;
  }

  const handleSearch = () => {
    if (!to.trim()) return;
    addRecentSearch(to);
    router.push({ pathname: '/results', params: { from, to } });
  };

  const handleQuickFill = (key: 'home' | 'work') => {
    const value = savedPlaces[key];
    if (!value) {
      setEditingPlace(key);
      return;
    }
    setTo(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good to see you</Text>
            <Text style={[styles.wordmark, { color: colors.foreground }]}>Raasta</Text>
          </View>
          <Pressable
            onPress={() => Alert.alert('No new alerts', 'Route and fare updates will appear here.')}
            style={[styles.bellButton, { backgroundColor: colors.secondary }]}
          >
            <Ionicons name="notifications-outline" size={19} color={colors.secondaryForeground} />
          </Pressable>
        </View>

        <View style={[styles.searchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.searchRow}>
            <View style={[styles.dotIcon, { backgroundColor: colors.primary }]} />
            <TextInput
              value={from}
              onChangeText={setFrom}
              placeholder="Your location"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {locating ? <Ionicons name="locate" size={16} color={colors.mutedForeground} /> : null}
          </View>
          <View style={[styles.searchDivider, { backgroundColor: colors.border }]} />
          <View style={styles.searchRow}>
            <Ionicons name="location" size={16} color={colors.destructive} style={styles.pinIcon} />
            <TextInput
              value={to}
              onChangeText={setTo}
              placeholder="Where are you going? e.g. Dolmen Mall"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
          <View style={styles.searchButton}>
            <Button label="Find routes" onPress={handleSearch} disabled={!to.trim()} icon="search" />
          </View>
        </View>

        <View style={styles.chipsRow}>
          <Chip icon="home-outline" label={savedPlaces.home ? 'Home' : 'Set home'} onPress={() => handleQuickFill('home')} />
          <Chip icon="briefcase-outline" label={savedPlaces.work ? 'Work' : 'Set work'} onPress={() => handleQuickFill('work')} />
        </View>

        {recentSearches.length > 0 ? (
          <View style={styles.section}>
            <SectionLabel>Recent searches</SectionLabel>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {recentSearches.map((query, index) => (
                <Pressable
                  key={query}
                  onPress={() => {
                    setTo(query);
                    router.push({ pathname: '/results', params: { from, to: query } });
                  }}
                  style={[
                    styles.recentRow,
                    index < recentSearches.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null,
                  ]}
                >
                  <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.recentText, { color: colors.foreground }]} numberOfLines={1}>
                    {query}
                  </Text>
                  <Ionicons name="chevron-forward" size={15} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionLabel>Powered by riders like you</SectionLabel>
          <View style={[styles.teaserCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <RouteVisual stops={TEASER_STOPS} progress={teaserProgress} accentColor={colors.primary} compact />
            <Text style={[styles.teaserText, { color: colors.mutedForeground }]}>
              Every trip reported on Raasta makes routes, fares and arrival times more accurate for the
              next rider.
            </Text>
          </View>
        </View>
      </ScrollView>

      <EditableFieldModal
        visible={editingPlace !== null}
        title={editingPlace === 'home' ? 'Set home address' : 'Set work address'}
        placeholder="e.g. Model Town, Lahore"
        initialValue=""
        onClose={() => setEditingPlace(null)}
        onSave={(value) => {
          if (editingPlace && value) {
            setSavedPlace(editingPlace, value);
            setTo(value);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  wordmark: { fontSize: 26, fontFamily: 'Inter_700Bold', marginTop: 2 },
  bellButton: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  searchCard: { borderRadius: 22, borderWidth: 1, padding: 16, gap: 4 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  dotIcon: { width: 10, height: 10, borderRadius: 5, marginLeft: 3, marginRight: 3 },
  pinIcon: { marginLeft: 1 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  searchDivider: { height: 1, marginLeft: 25 },
  searchButton: { marginTop: 10 },
  chipsRow: { flexDirection: 'row', gap: 10 },
  section: { gap: 4 },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, paddingHorizontal: 16 },
  recentText: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  teaserCard: { borderRadius: 20, borderWidth: 1, padding: 18, gap: 14 },
  teaserText: { fontSize: 12.5, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
