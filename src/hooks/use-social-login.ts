import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import type { SocialProvider } from '@/types/api';

WebBrowser.maybeCompleteAuthSession();

function getGoogleClientIds() {
  return {
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  };
}

function isGoogleConfigured(): boolean {
  const ids = getGoogleClientIds();
  return Boolean(ids.expoClientId || ids.iosClientId || ids.androidClientId || ids.webClientId);
}

export function useSocialLogin() {
  const { signInSocial } = useAuth();
  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest(getGoogleClientIds());

  useEffect(() => {
    if (googleResponse?.type !== 'success') return;

    const accessToken = googleResponse.authentication?.accessToken;
    if (!accessToken) return;

    (async () => {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userInfoRes.ok) throw new Error('No se pudo obtener el perfil de Google');
        const profile = (await userInfoRes.json()) as {
          sub: string;
          name?: string;
          email?: string;
        };
        await signInSocial({
          provider: 'google',
          provider_id: profile.sub,
          name: profile.name ?? 'Usuario',
          email: profile.email ?? `${profile.sub}@google.local`,
        });
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Error al iniciar sesión con Google');
      }
    })();
  }, [googleResponse, signInSocial]);

  const loginWithGoogle = useCallback(async () => {
    if (!isGoogleConfigured()) {
      Alert.alert(
        'Configuración requerida',
        'Define EXPO_PUBLIC_GOOGLE_* en .env para habilitar Google Sign-In.',
      );
      return false;
    }
    await promptGoogle();
    return true;
  }, [promptGoogle]);

  const loginWithProvider = useCallback(
    async (provider: SocialProvider) => {
      if (provider === 'google') {
        return loginWithGoogle();
      }
      Alert.alert(
        'Próximamente',
        `Configura OAuth de ${provider === 'facebook' ? 'Facebook' : 'X'} en el proyecto Expo y completa el flujo en use-social-login.ts`,
      );
      return false;
    },
    [loginWithGoogle],
  );

  return {
    loginWithGoogle,
    loginWithProvider,
    googleReady: Boolean(googleRequest) && isGoogleConfigured(),
    isWeb: Platform.OS === 'web',
  };
}
