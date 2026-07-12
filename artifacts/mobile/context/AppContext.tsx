import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RouteOption } from '@/lib/routes';

export interface TripRecord {
  id: string;
  from: string;
  to: string;
  routeType: string;
  busNumber: string;
  distanceKm: number;
  fare: number;
  issues: string[];
  pointsEarned: number;
  completedAt: number;
}

export interface ActiveTrip {
  id: string;
  from: string;
  to: string;
  route: RouteOption;
  startedAt: number;
}

interface SavedPlaces {
  home: string;
  work: string;
}

interface Settings {
  offlineMaps: boolean;
  notifications: boolean;
  shareLocation: boolean;
}

interface PersistedState {
  onboarded: boolean;
  points: number;
  recentSearches: string[];
  savedPlaces: SavedPlaces;
  settings: Settings;
  tripHistory: TripRecord[];
  emergencyContact: string;
}

const STORAGE_KEY = 'raasta_state_v1';

const DEFAULT_STATE: PersistedState = {
  onboarded: false,
  points: 0,
  recentSearches: [],
  savedPlaces: { home: '', work: '' },
  settings: { offlineMaps: false, notifications: true, shareLocation: false },
  tripHistory: [],
  emergencyContact: '',
};

function makeId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9);
}

interface AppContextValue extends PersistedState {
  isLoading: boolean;
  activeTrip: ActiveTrip | null;
  completeOnboarding: () => void;
  addRecentSearch: (query: string) => void;
  setSavedPlace: (key: keyof SavedPlaces, value: string) => void;
  toggleSetting: (key: keyof Settings) => void;
  setEmergencyContact: (value: string) => void;
  startTrip: (from: string, to: string, route: RouteOption) => void;
  cancelTrip: () => void;
  endTrip: (fare: number, issues: string[]) => TripRecord | null;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            savedPlaces: { ...DEFAULT_STATE.savedPlaces, ...parsed.savedPlaces },
            settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
          });
        }
      } catch {
        // Corrupt or missing storage — fall back to defaults silently.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback((next: PersistedState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
      // Best-effort persistence for this MVP; ignore write failures.
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    persist({ ...state, onboarded: true });
  }, [state, persist]);

  const addRecentSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      const next = [trimmed, ...state.recentSearches.filter((q) => q !== trimmed)].slice(0, 5);
      persist({ ...state, recentSearches: next });
    },
    [state, persist],
  );

  const setSavedPlace = useCallback(
    (key: keyof SavedPlaces, value: string) => {
      persist({ ...state, savedPlaces: { ...state.savedPlaces, [key]: value } });
    },
    [state, persist],
  );

  const toggleSetting = useCallback(
    (key: keyof Settings) => {
      persist({ ...state, settings: { ...state.settings, [key]: !state.settings[key] } });
    },
    [state, persist],
  );

  const setEmergencyContact = useCallback(
    (value: string) => {
      persist({ ...state, emergencyContact: value });
    },
    [state, persist],
  );

  const startTrip = useCallback((from: string, to: string, route: RouteOption) => {
    setActiveTrip({ id: makeId(), from, to, route, startedAt: Date.now() });
  }, []);

  const cancelTrip = useCallback(() => {
    setActiveTrip(null);
  }, []);

  const endTrip = useCallback(
    (fare: number, issues: string[]): TripRecord | null => {
      if (!activeTrip) return null;
      const basePoints = 10;
      const farePoints = fare > 0 ? 5 : 0;
      const issuePoints = issues.length > 0 ? 3 : 0;
      const pointsEarned = basePoints + farePoints + issuePoints;

      const record: TripRecord = {
        id: activeTrip.id,
        from: activeTrip.from,
        to: activeTrip.to,
        routeType: activeTrip.route.label,
        busNumber: activeTrip.route.busNumber,
        distanceKm: activeTrip.route.distanceKm,
        fare,
        issues,
        pointsEarned,
        completedAt: Date.now(),
      };

      persist({
        ...state,
        points: state.points + pointsEarned,
        tripHistory: [record, ...state.tripHistory].slice(0, 50),
      });
      setActiveTrip(null);
      return record;
    },
    [activeTrip, state, persist],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      isLoading,
      activeTrip,
      completeOnboarding,
      addRecentSearch,
      setSavedPlace,
      toggleSetting,
      setEmergencyContact,
      startTrip,
      cancelTrip,
      endTrip,
    }),
    [
      state,
      isLoading,
      activeTrip,
      completeOnboarding,
      addRecentSearch,
      setSavedPlace,
      toggleSetting,
      setEmergencyContact,
      startTrip,
      cancelTrip,
      endTrip,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
