import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

import type { SocialProvider } from '@/types/api';

export function useSocialLoginStub() {
  const loginWithProvider = useCallback(async (provider: SocialProvider) => {
    if (provider === 'google') {
      Alert.alert(
        'Configuración requerida',
        Platform.OS === 'web'
          ? 'Define EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en .env y reinicia Expo (npx expo start).'
          : 'Define EXPO_PUBLIC_GOOGLE_* en .env para habilitar Google Sign-In.',
      );
      return false;
    }
    Alert.alert(
      'Próximamente',
      `Configura OAuth de ${provider === 'facebook' ? 'Facebook' : 'X'} en el proyecto Expo.`,
    );
    return false;
  }, []);

  return {
    loginWithGoogle: () => loginWithProvider('google'),
    loginWithProvider,
    googleReady: false,
    isWeb: Platform.OS === 'web',
  };
}
