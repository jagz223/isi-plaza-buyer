import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMenu } from '@/components/isi/AppMenu';
import { ScreenHeader } from '@/components/isi/ScreenHeader';
import { IsiPlazaColors } from '@/constants/isi-plaza';
import { consumerApi } from '@/lib/api';
import type { BusinessCategory } from '@/types/api';

export default function BuscarMayoristasScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consumerApi.getBusinessCategories();
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pairs: BusinessCategory[][] = [];
  for (let i = 0; i < categories.length; i += 2) {
    pairs.push(categories.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Buscar Mayoristas" showBack={false} />
      <AppMenu />

      {loading ? (
        <ActivityIndicator style={styles.loader} color={IsiPlazaColors.red} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={load}>
            <Text style={styles.retry}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {pairs.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.card}
                  onPress={() =>
                    router.push({
                      pathname: '/(app)/mayoristas',
                      params: { business_category_id: String(cat.id), category_name: cat.name },
                    })
                  }>
                  <Text style={styles.cardText}>{cat.name}</Text>
                </Pressable>
              ))}
              {row.length === 1 && <View style={styles.cardPlaceholder} />}
            </View>
          ))}
        </ScrollView>
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
    marginTop: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: {
    color: IsiPlazaColors.redDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  retry: {
    color: IsiPlazaColors.red,
    fontWeight: '700',
  },
  grid: {
    padding: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    minHeight: 72,
    backgroundColor: IsiPlazaColors.backgroundMuted,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cardPlaceholder: {
    flex: 1,
  },
  cardText: {
    fontSize: 13,
    fontWeight: '600',
    color: IsiPlazaColors.black,
    textAlign: 'center',
  },
});
