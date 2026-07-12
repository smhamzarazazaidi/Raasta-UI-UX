import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert as NativeAlert, Platform } from 'react-native';
import { AlertModal, AlertButton } from '@/components/AlertModal';

// react-native-web's Alert.alert is a complete no-op (`static alert() {}`),
// so every confirm/cancel dialog in the app silently did nothing when run in
// the web preview. This provider gives web a real modal-based equivalent
// while native platforms keep using the OS-native Alert.
interface AlertState {
  title: string;
  message?: string;
  buttons: AlertButton[];
}

interface AlertContextValue {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState | null>(null);

  const alert = useCallback((title: string, message?: string, buttons?: AlertButton[]) => {
    const resolvedButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];
    if (Platform.OS !== 'web') {
      NativeAlert.alert(title, message, resolvedButtons);
      return;
    }
    setState({ title, message, buttons: resolvedButtons });
  }, []);

  const handlePress = (button: AlertButton) => {
    setState(null);
    button.onPress?.();
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <AlertModal
        visible={!!state}
        title={state?.title ?? ''}
        message={state?.message}
        buttons={state?.buttons ?? []}
        onPress={handlePress}
        onRequestClose={() => setState(null)}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return ctx.alert;
}
