import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type GoogleClientIds = {
  expoClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
};

function readEnvIds(): GoogleClientIds {
  return {
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  };
}

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

/** IDs válidos para la plataforma actual (APK ≠ Expo Go). */
export function getGoogleClientIdsForPlatform(): GoogleClientIds {
  const all = readEnvIds();

  if (Platform.OS === 'web') {
    return all.webClientId ? { webClientId: all.webClientId } : {};
  }

  if (Platform.OS === 'android') {
    if (all.androidClientId) {
      return {
        androidClientId: all.androidClientId,
        webClientId: all.webClientId,
      };
    }
    if (isExpoGo() && all.expoClientId) {
      return { expoClientId: all.expoClientId };
    }
    return {};
  }

  if (Platform.OS === 'ios') {
    if (all.iosClientId) {
      return { iosClientId: all.iosClientId };
    }
    if (isExpoGo() && all.expoClientId) {
      return { expoClientId: all.expoClientId };
    }
    return {};
  }

  return {};
}

export function isGoogleConfiguredForPlatform(): boolean {
  const ids = getGoogleClientIdsForPlatform();
  return Boolean(ids.expoClientId || ids.iosClientId || ids.androidClientId || ids.webClientId);
}
