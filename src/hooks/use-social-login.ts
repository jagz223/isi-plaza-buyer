import { useSocialLoginGoogle } from '@/hooks/use-social-login-google';
import { useSocialLoginStub } from '@/hooks/use-social-login-stub';
import {
  getGoogleClientIdsForPlatform,
  isGoogleConfiguredForPlatform,
} from '@/lib/google-client-ids';

function useSocialLoginNative() {
  return useSocialLoginGoogle(getGoogleClientIdsForPlatform());
}

export const useSocialLogin = isGoogleConfiguredForPlatform()
  ? useSocialLoginNative
  : useSocialLoginStub;
