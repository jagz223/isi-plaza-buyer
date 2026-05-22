import { useSocialLoginGoogle } from '@/hooks/use-social-login-google';
import { useSocialLoginStub } from '@/hooks/use-social-login-stub';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

function useSocialLoginWebGoogle() {
  return useSocialLoginGoogle({ webClientId });
}

export const useSocialLogin = webClientId ? useSocialLoginWebGoogle : useSocialLoginStub;
