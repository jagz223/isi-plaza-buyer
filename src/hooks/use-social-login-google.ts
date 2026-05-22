import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import type { SocialProvider } from '@/types/api';

WebBrowser.maybeCompleteAuthSession();

type GoogleClientIds = {
  expoClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
};

export function useSocialLoginGoogle(clientIds: GoogleClientIds) {
  const { signInSocial } = useAuth();
  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest(clientIds);

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
        `Configura OAuth de ${provider === 'facebook' ? 'Facebook' : 'X'} en el proyecto Expo.`,
      );
      return false;
    },
    [loginWithGoogle],
  );

  const configured = Boolean(
    clientIds.expoClientId ||
      clientIds.iosClientId ||
      clientIds.androidClientId ||
      clientIds.webClientId,
  );

  return {
    loginWithGoogle,
    loginWithProvider,
    googleReady: Boolean(googleRequest) && configured,
    isWeb: Platform.OS === 'web',
  };
}
