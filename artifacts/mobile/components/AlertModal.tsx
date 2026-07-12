import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  onPress: (button: AlertButton) => void;
  onRequestClose: () => void;
}

export function AlertModal({ visible, title, message, buttons, onPress, onRequestClose }: AlertModalProps) {
  const colors = useColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.patternBar, { backgroundColor: colors.primary }]} />
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
          {message ? <Text style={[styles.message, { color: colors.mutedForeground }]}>{message}</Text> : null}
          <View style={styles.buttonList}>
            {buttons.map((button, index) => {
              const isDestructive = button.style === 'destructive';
              const isCancel = button.style === 'cancel';
              return (
                <Pressable
                  key={`${button.text}-${index}`}
                  onPress={() => onPress(button)}
                  style={[
                    styles.buttonRow,
                    index < buttons.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: isDestructive ? colors.destructive : isCancel ? colors.mutedForeground : colors.primary,
                        fontFamily: isCancel ? 'Inter_500Medium' : 'Inter_700Bold',
                      },
                    ]}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 14, 8, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 4,
  },
  patternBar: { height: 5, width: '100%' },
  title: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 13.5,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 19,
  },
  buttonList: { marginTop: 20 },
  buttonRow: { paddingVertical: 14, alignItems: 'center' },
  buttonText: { fontSize: 15.5 },
});
