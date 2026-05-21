import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMenu } from '@/components/isi/AppMenu';
import { IsiButton } from '@/components/isi/IsiButton';
import { ScreenHeader } from '@/components/isi/ScreenHeader';
import { SellerCard } from '@/components/isi/SellerCard';
import { IsiPlazaColors } from '@/constants/isi-plaza';
import { useAuth } from '@/context/AuthContext';
import { consumerApi } from '@/lib/api';
import type { SellerListItem } from '@/types/api';

export default function GuardadosScreen() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<SellerListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await consumerApi.getFavorites(token);
      setFavorites(data);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      load();
    }
  }, [isAuthenticated, token, load]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScreenHeader title="Mayoristas Guardados" />
        <AppMenu />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Inicia sesión para ver tus guardados</Text>
          <Text style={styles.emptyHint}>
            Los favoritos se sincronizan con tu cuenta al iniciar sesión con Google, Facebook o X.
          </Text>
          <IsiButton
            label="Ir a acceso"
            onPress={() => router.push('/(auth)/acceso')}
            style={styles.cta}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Mayoristas Guardados" />
      <AppMenu />
      {loading ? (
        <ActivityIndicator style={styles.loader} color={IsiPlazaColors.red} />
      ) : favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aún no tienes mayoristas guardados</Text>
          <Pressable onPress={() => router.push('/(app)/buscar')}>
            <Text style={styles.link}>Buscar mayoristas</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <SellerCard
                seller={item}
                onPress={() =>
                  router.push({
                    pathname: '/(app)/mayoristas/[id]',
                    params: { id: String(item.id) },
                  })
                }
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: IsiPlazaColors.white,
  },
  loader: {
    marginTop: 32,
  },
  list: {
    padding: 12,
    gap: 12,
  },
  listItem: {
    marginBottom: 8,
  },
  empty: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: IsiPlazaColors.black,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    color: IsiPlazaColors.textSecondary,
    lineHeight: 20,
  },
  cta: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  link: {
    color: IsiPlazaColors.red,
    fontWeight: '700',
    fontSize: 16,
  },
});
