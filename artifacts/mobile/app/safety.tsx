import React, { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useAlert } from '@/context/AlertContext';
import { Button, SectionLabel } from '@/components/UI';
import { EditableFieldModal } from '@/components/EditableFieldModal';
import { TruckArtBand } from '@/components/TruckArtBand';

export default function SafetyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const alert = useAlert();
  const { settings, toggleSetting, emergencyContact, setEmergencyContact } = useApp();
  const [editingContact, setEditingContact] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSOS = async () => {
    if (!emergencyContact) {
      setEditingContact(true);
      return;
    }
    alert('Alert emergency contact?', 'This opens a text message with your live location.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send location',
        style: 'destructive',
        onPress: async () => {
          setSending(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          try {
            if (Platform.OS === 'web') {
              alert('Not supported', 'Sending SMS is not available in the web preview. Try this on your phone via Expo Go.');
              return;
            }
            const { status } = await Location.requestForegroundPermissionsAsync();
            let locationText = 'my current location';
            if (status === 'granted') {
              const position = await Location.getCurrentPositionAsync({});
              locationText = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
            }
            const body = encodeURIComponent(`I may need help on my Raasta trip. Here is my location: ${locationText}`);
            const url = `sms:${emergencyContact}${Platform.OS === 'ios' ? '&' : '?'}body=${body}`;
            await Linking.openURL(url);
          } catch {
            alert('Could not open messages', 'Please try again or call your contact directly.');
          } finally {
            setSending(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TruckArtBand height={8} />
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 24 : 16) }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Safety center</Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.closeButton}>
          <Ionicons name="close" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={handleSOS}
          style={[styles.sosButton, { backgroundColor: colors.destructive, opacity: sending ? 0.7 : 1 }]}
        >
          <Ionicons name="shield" size={28} color={colors.destructiveForeground} />
          <Text style={[styles.sosLabel, { color: colors.destructiveForeground }]}>
            Alert emergency contact
          </Text>
        </Pressable>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable style={styles.row} onPress={() => setEditingContact(true)}>
            <Ionicons name="call-outline" size={18} color={colors.mutedForeground} />
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Emergency contact</Text>
              <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>
                {emergencyContact || 'Not set'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color={colors.mutedForeground} />
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Share live location on rides</Text>
              <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>
                {settings.shareLocation ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={settings.shareLocation}
              onValueChange={() => toggleSetting('shareLocation')}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        </View>

        <SectionLabel>How Raasta keeps you safe</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.faqText, { color: colors.mutedForeground }]}>
            Raasta doesn't run its own GPS trackers — it relies on riders like you. If something feels
            wrong on a trip, use "Report a problem" during your ride, or send your live location to your
            emergency contact any time with the button above.
          </Text>
        </View>
      </ScrollView>

      <EditableFieldModal
        visible={editingContact}
        title="Emergency contact"
        placeholder="e.g. 03001234567"
        initialValue={emergencyContact}
        keyboardType="phone-pad"
        onClose={() => setEditingContact(false)}
        onSave={setEmergencyContact}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  closeButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  sosButton: {
    borderRadius: 22,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sosLabel: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 14.5, fontFamily: 'Inter_600SemiBold' },
  rowValue: { fontSize: 12.5, fontFamily: 'Inter_400Regular' },
  divider: { height: 1, marginLeft: 16 },
  faqText: { fontSize: 13.5, lineHeight: 20, fontFamily: 'Inter_400Regular', padding: 16 },
});
