import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMenu } from '@/components/isi/AppMenu';
import { BannerCarousel } from '@/components/isi/BannerCarousel';
import { CountryGrid } from '@/components/isi/CountryGrid';
import { ScreenHeader } from '@/components/isi/ScreenHeader';
import { SellerListGrouped } from '@/components/isi/SellerListGrouped';
import { IsiPlazaColors } from '@/constants/isi-plaza';
import { useAuth } from '@/context/AuthContext';
import { consumerApi } from '@/lib/api';
import { groupSellersByCountryAndState } from '@/lib/group-sellers';
import type { ConsumerBanner, CountryFilterOption, SellerListItem } from '@/types/api';

export default function ListaMayoristasScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams<{
    business_category_id?: string;
    category_name?: string;
    country?: string;
    state?: string;
  }>();

  const categoryId = params.business_category_id
    ? Number(params.business_category_id)
    : undefined;
  const categoryName = params.category_name;

  const [banners, setBanners] = useState<ConsumerBanner[]>([]);
  const [countries, setCountries] = useState<CountryFilterOption[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    params.country ?? null,
  );
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(params.state ?? null);
  const [sellers, setSellers] = useState<SellerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeta = useCallback(async () => {
    const [bannerData, countryData] = await Promise.all([
      consumerApi.getBanners(),
      consumerApi.getCountries(),
    ]);
    setBanners(bannerData);
    setCountries(countryData);
  }, []);

  const loadSellers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await consumerApi.getSellers(
        {
          business_category_id: categoryId,
          country: selectedCountry ?? undefined,
          state: selectedState ?? undefined,
          per_page: 50,
        },
        token,
      );
      setSellers(result.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar mayoristas');
    } finally {
      setLoading(false);
    }
  }, [categoryId, selectedCountry, selectedState, token]);

  useEffect(() => {
    loadMeta().catch(() => {
      /* banners/countries opcionales */
    });
  }, [loadMeta]);

  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setSelectedState(null);
      return;
    }
    consumerApi
      .getStates(selectedCountry)
      .then(setStates)
      .catch(() => setStates([]));
  }, [selectedCountry]);

  useEffect(() => {
    loadSellers();
  }, [loadSellers]);

  const grouped = useMemo(() => groupSellersByCountryAndState(sellers), [sellers]);

  const headerTitle = categoryName ? `Mayoristas — ${categoryName}` : 'Lista de Mayoristas';

  const listHeader = (
    <View>
      <BannerCarousel banners={banners} />
      <CountryGrid
        countries={countries}
        selected={selectedCountry}
        onSelect={(c) => {
          setSelectedCountry(c);
          setSelectedState(null);
        }}
      />
      {selectedCountry && states.length > 0 && (
        <View style={styles.statesWrap}>
          <Text style={styles.statesLabel}>Estado / Provincia</Text>
          <View style={styles.statesRow}>
            {states.map((st) => (
              <Pressable
                key={st}
                onPress={() => setSelectedState(selectedState === st ? null : st)}
                style={[styles.stateChip, selectedState === st && styles.stateChipActive]}>
                <Text
                  style={[
                    styles.stateChipText,
                    selectedState === st && styles.stateChipTextActive,
                  ]}>
                  {st}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {loading && <ActivityIndicator style={styles.loader} color={IsiPlazaColors.red} />}
      {error && (
        <View style={styles.errorWrap}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={loadSellers}>
            <Text style={styles.retry}>Reintentar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title={headerTitle} />
      <AppMenu />
      <SellerListGrouped
        grouped={grouped}
        ListHeaderComponent={listHeader}
        onSellerPress={(seller) =>
          router.push({
            pathname: '/(app)/mayoristas/[id]',
            params: { id: String(seller.id) },
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: IsiPlazaColors.white,
  },
  loader: {
    marginVertical: 16,
  },
  statesWrap: {
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  statesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  stateChipActive: {
    borderColor: IsiPlazaColors.red,
    backgroundColor: IsiPlazaColors.redLight,
  },
  stateChipText: {
    fontSize: 13,
    color: IsiPlazaColors.black,
  },
  stateChipTextActive: {
    fontWeight: '700',
    color: IsiPlazaColors.redDark,
  },
  errorWrap: {
    padding: 16,
    alignItems: 'center',
  },
  error: {
    color: IsiPlazaColors.redDark,
    marginBottom: 8,
  },
  retry: {
    color: IsiPlazaColors.red,
    fontWeight: '700',
  },
});
