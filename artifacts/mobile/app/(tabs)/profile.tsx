import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { SectionLabel } from '@/components/UI';
import { EditableFieldModal } from '@/components/EditableFieldModal';

type EditingField = 'home' | 'work' | null;

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { savedPlaces, setSavedPlace, settings, toggleSetting, points, tripHistory } = useApp();
  const [editing, setEditing] = useState<EditingField>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Ionicons name="person" size={28} color={colors.secondaryForeground} />
          </View>
          <View>
            <Text style={[styles.name, { color: colors.foreground }]}>Rider</Text>
            <Text style={[styles.statLine, { color: colors.mutedForeground }]}>
              {tripHistory.length} trips · {points} points
            </Text>
          </View>
        </View>

        <SectionLabel>Saved places</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable style={styles.row} onPress={() => setEditing('home')}>
            <Ionicons name="home-outline" size={18} color={colors.mutedForeground} />
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Home</Text>
              <Text style={[styles.rowValue, { color: colors.mutedForeground }]} numberOfLines={1}>
                {savedPlaces.home || 'Not set'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable style={styles.row} onPress={() => setEditing('work')}>
            <Ionicons name="briefcase-outline" size={18} color={colors.mutedForeground} />
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Work</Text>
              <Text style={[styles.rowValue, { color: colors.mutedForeground }]} numberOfLines={1}>
                {savedPlaces.work || 'Not set'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <SectionLabel>Preferences</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToggleRow
            icon="download-outline"
            label="Offline maps"
            value={settings.offlineMaps}
            onToggle={() => toggleSetting('offlineMaps')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <ToggleRow
            icon="notifications-outline"
            label="Notifications"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
        </View>

        <SectionLabel>Safety &amp; help</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable style={styles.row} onPress={() => router.push('/safety')}>
            <Ionicons name="shield-outline" size={18} color={colors.mutedForeground} />
            <Text style={[styles.rowLabel, styles.flex, { color: colors.foreground }]}>Safety center</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            style={styles.row}
            onPress={() =>
              Alert.alert(
                'How Raasta works',
                "Raasta has no GPS trackers on buses. Riders who open the app during a trip help build the map — routes, fares and arrival times all come from real trips like yours.",
              )
            }
          >
            <Ionicons name="help-circle-outline" size={18} color={colors.mutedForeground} />
            <Text style={[styles.rowLabel, styles.flex, { color: colors.foreground }]}>How Raasta works</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            style={styles.row}
            onPress={() => Alert.alert('Contact support', 'support@raasta.app')}
          >
            <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
            <Text style={[styles.rowLabel, styles.flex, { color: colors.foreground }]}>Contact support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          We don't track the buses. We track the people.{'\n'}Raasta MVP v1.0
        </Text>
      </ScrollView>

      <EditableFieldModal
        visible={editing !== null}
        title={editing === 'home' ? 'Set home address' : 'Set work address'}
        placeholder="e.g. Model Town, Lahore"
        initialValue={editing ? savedPlaces[editing] : ''}
        onClose={() => setEditing(null)}
        onSave={(value) => {
          if (editing) setSavedPlace(editing, value);
        }}
      />
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.mutedForeground} />
      <Text style={[styles.rowLabel, styles.flex, { color: colors.foreground }]}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ true: colors.primary, false: colors.border }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  avatar: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  statLine: { fontSize: 12.5, fontFamily: 'Inter_400Regular', marginTop: 2 },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 14.5, fontFamily: 'Inter_600SemiBold' },
  rowValue: { fontSize: 12.5, fontFamily: 'Inter_400Regular' },
  divider: { height: 1, marginLeft: 16 },
  flex: { flex: 1 },
  footer: { fontSize: 11.5, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 17, marginTop: 8 },
});
