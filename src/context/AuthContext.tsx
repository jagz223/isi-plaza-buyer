import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { consumerApi } from '@/lib/api';
import type { ConsumerUser, SocialLoginBody } from '@/types/api';

const TOKEN_KEY = 'isi_plaza_consumer_token';
const USER_KEY = 'isi_plaza_consumer_user';

type AuthContextValue = {
  token: string | null;
  user: ConsumerUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInSocial: (body: SocialLoginBody) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ConsumerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);
        if (!mounted) return;

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser) as ConsumerUser);
          }
          try {
            const me = await consumerApi.me(storedToken);
            if (mounted) {
              setUser(me);
              await SecureStore.setItemAsync(USER_KEY, JSON.stringify(me));
            }
          } catch {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
            if (mounted) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const signInSocial = useCallback(async (body: SocialLoginBody) => {
    const response = await consumerApi.socialLogin(body);
    await SecureStore.setItemAsync(TOKEN_KEY, response.token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  }, []);

  const signOut = useCallback(async () => {
    if (token) {
      try {
        await consumerApi.logout(token);
      } catch {
        // token may already be invalid
      }
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
  }, [token]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const me = await consumerApi.me(token);
    setUser(me);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(me));
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: Boolean(token),
      signInSocial,
      signOut,
      refreshUser,
    }),
    [token, user, isLoading, signInSocial, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
