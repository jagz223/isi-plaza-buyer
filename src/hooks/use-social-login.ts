import { useSocialLoginGoogle } from '@/hooks/use-social-login-google';
import { useSocialLoginStub } from '@/hooks/use-social-login-stub';

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

function useSocialLoginNative() {
  return useSocialLoginGoogle(getGoogleClientIds());
}

export const useSocialLogin = isGoogleConfigured() ? useSocialLoginNative : useSocialLoginStub;
