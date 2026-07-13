import React, { useEffect, useState, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Redirect, router } from 'expo-router';
import { FullMap } from '@/components/FullMap';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useAlert } from '@/context/AlertContext';
import { Button } from '@/components/UI';

const { width, height } = Dimensions.get('window');
const LAHORE_CENTER = { latitude: 31.5204, longitude: 74.3587 };

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const alert = useAlert();
  const { isLoading, onboarded } = useApp();

  const [from, setFrom] = useState('Your location');
  const [to, setTo] = useState('');
  const [locating, setLocating] = useState(true);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Animated values for smooth sheet expansion (to be fully implemented later)
  const sheetAnim = useRef(new Animated.Value(0)).current;

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
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const [place] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (place) {
          const label = [place.district || place.street, place.city].filter(Boolean).join(', ');
          if (label) setFrom(label);
        }
      } catch {
        // Keep fallback
      } finally {
        setLocating(false);
      }
    })();
  }, []);

  if (!isLoading && !onboarded) {
    return <Redirect href="/onboarding" />;
  }

  const handleSearch = () => {
    if (!to.trim()) return;
    router.push({ pathname: '/results', params: { from, to } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* FULL SCREEN MAP (inDrive style) */}
      <FullMap userCoords={userCoords} />

      {/* FLOATING TOP NAVIGATION */}
      <View style={[styles.topNav, { paddingTop: insets.top + 16 }]}>
        <Pressable
          style={[styles.menuButton, { backgroundColor: colors.card, shadowColor: '#000' }]}
          onPress={() => alert('Menu', 'Drawer menu coming soon!')}
        >
          <Ionicons name="menu" size={24} color={colors.foreground} />
        </Pressable>

        <Pressable
          style={[styles.notificationBadge, { backgroundColor: colors.accent }]}
          onPress={() => alert('Notifications', 'No new community updates.')}
        >
          <Text style={{ color: colors.accentForeground, fontSize: 10, fontWeight: 'bold' }}>2</Text>
        </Pressable>
      </View>

      {/* FLOATING ACTION BUTTONS (Right Side) */}
      <View style={styles.fabContainer}>
        <Pressable
          style={[styles.fab, { backgroundColor: colors.card, shadowColor: '#000' }]}
          onPress={() => alert('Layers', 'Transit Map Layers coming soon.')}
        >
          <Ionicons name="layers" size={20} color={colors.foreground} />
        </Pressable>
        
        <Pressable
          style={[styles.fab, { backgroundColor: colors.card, shadowColor: '#000', marginTop: 12 }]}
          onPress={() => {
            // Locate user logic
          }}
        >
          <Ionicons name="locate" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      {/* BOTTOM SHEET SEARCH CARD */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 100, backgroundColor: colors.background }]}>
        {/* Subtle floral border hint (5% Pakistani Identity) */}
        <View style={[styles.traditionalBorder, { backgroundColor: colors.secondary }]} />
        
        <View style={styles.sheetHandle} />

        <View style={styles.sheetContent}>
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Community Mode Active</Text>
          <Text style={[styles.sheetSubtitle, { color: colors.mutedForeground }]}>We track people, not buses.</Text>

          <View style={[styles.searchBox, { backgroundColor: colors.muted }]}>
            <Ionicons name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
            <TextInput
              value={to}
              onChangeText={setTo}
              placeholder="Search destination..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <Pressable onPress={() => alert('Voice Search', 'Speak destination')}>
              <Ionicons name="mic" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable style={styles.quickActionItem}>
              <View style={[styles.quickIconBox, { backgroundColor: colors.card, shadowColor: '#000' }]}>
                <Ionicons name="bus" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.foreground }]}>Nearby Stops</Text>
            </Pressable>

            <Pressable style={styles.quickActionItem}>
              <View style={[styles.quickIconBox, { backgroundColor: colors.card, shadowColor: '#000' }]}>
                <Ionicons name="people" size={24} color={colors.secondary} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.foreground }]}>Live Routes</Text>
            </Pressable>

            <Pressable style={styles.quickActionItem}>
              <View style={[styles.quickIconBox, { backgroundColor: colors.card, shadowColor: '#000' }]}>
                <Ionicons name="bookmark" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.foreground }]}>Saved</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 20,
    flexDirection: 'row',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 14,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 300,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  traditionalBorder: {
    width: '100%',
    height: 4,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  sheetSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 8,
  },
  quickIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
