import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IsiButton } from '@/components/isi/IsiButton';
import { ScreenHeader } from '@/components/isi/ScreenHeader';
import { VerifiedBadge } from '@/components/isi/VerifiedBadge';
import { IsiPlazaColors } from '@/constants/isi-plaza';
import { useAuth } from '@/context/AuthContext';
import { consumerApi } from '@/lib/api';
import { openExternalUrl, openWhatsapp } from '@/lib/whatsapp';
import type { CatalogImage, SellerDetail } from '@/types/api';

export default function PerfilMayoristaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sellerId = Number(id);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { token, isAuthenticated } = useAuth();

  const [seller, setSeller] = useState<SellerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const profileViewSent = useRef(false);

  const load = useCallback(async () => {
    if (!sellerId || Number.isNaN(sellerId)) return;
    setLoading(true);
    try {
      const data = await consumerApi.getSeller(sellerId, token);
      setSeller(data);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo cargar el perfil');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [sellerId, token, router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!seller || profileViewSent.current) return;
    profileViewSent.current = true;
    consumerApi.recordInteraction(seller.id, 'profile_view', token).catch(() => {});
  }, [seller, token]);

  const carouselImages = seller
    ? [
        ...(seller.avatar_url ? [seller.avatar_url] : []),
        ...seller.catalog_images
          .sort((a, b) => a.display_order - b.display_order)
          .map((c) => c.image_url),
      ].filter((url, index, arr) => arr.indexOf(url) === index)
    : [];

  const toggleFavorite = async () => {
    if (!seller) return;
    if (!isAuthenticated || !token) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para guardar mayoristas.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir a acceso', onPress: () => router.push('/(auth)/acceso') },
      ]);
      return;
    }

    setFavLoading(true);
    try {
      if (seller.is_favorited) {
        await consumerApi.removeFavorite(seller.id, token);
        setSeller({ ...seller, is_favorited: false });
      } else {
        await consumerApi.addFavorite(seller.id, token);
        setSeller({ ...seller, is_favorited: true });
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo actualizar favorito');
    } finally {
      setFavLoading(false);
    }
  };

  const onWhatsapp = async () => {
    if (!seller) return;
    const opened = await openWhatsapp(seller.whatsapp);
    if (!opened) {
      Alert.alert('WhatsApp', 'No hay número de WhatsApp disponible.');
      return;
    }
    consumerApi.recordInteraction(seller.id, 'whatsapp_click', token).catch(() => {});
  };

  if (loading || !seller) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Perfil" />
        <ActivityIndicator style={styles.loader} color={IsiPlazaColors.red} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title={seller.name} />
      <ScrollView contentContainerStyle={styles.content}>
        {carouselImages.length > 0 ? (
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={carouselImages}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={{ width }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={[styles.carouselImage, { width: width - 32 }]}
                contentFit="cover"
              />
            )}
          />
        ) : (
          <View style={[styles.carouselPlaceholder, { width: width - 32 }]}>
            <Text style={styles.placeholderLetter}>{seller.name.charAt(0)}</Text>
          </View>
        )}

        <View style={styles.nameRow}>
          <Pressable
            onPress={toggleFavorite}
            disabled={favLoading}
            style={styles.heartBtn}
            accessibilityLabel={seller.is_favorited ? 'Quitar de favoritos' : 'Guardar'}>
            <Text style={styles.heart}>{seller.is_favorited ? '♥' : '♡'}</Text>
          </Pressable>
          <VerifiedBadge verified={seller.is_verified} />
          <Text style={styles.name}>{seller.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>
          {seller.description ?? 'Sin descripción disponible.'}
        </Text>

        <View style={styles.contactRow}>
          <IsiButton label="Enviar mensaje" onPress={onWhatsapp} style={styles.contactBtn} />
        </View>
        <View style={styles.socialRow}>
          {seller.instagram ? (
            <IsiButton
              label="Instagram"
              variant="outline"
              onPress={() => openExternalUrl(seller.instagram)}
              style={styles.socialBtn}
            />
          ) : null}
          {seller.facebook ? (
            <IsiButton
              label="Facebook"
              variant="outline"
              onPress={() => openExternalUrl(seller.facebook)}
              style={styles.socialBtn}
            />
          ) : null}
          {seller.website ? (
            <IsiButton
              label="Página web"
              variant="outline"
              onPress={() => openExternalUrl(seller.website)}
              style={styles.socialBtn}
            />
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Catálogo</Text>
        {seller.catalog_images.length === 0 ? (
          <Text style={styles.emptyCatalog}>Sin imágenes de catálogo.</Text>
        ) : (
          seller.catalog_images
            .sort((a, b) => a.display_order - b.display_order)
            .map((img: CatalogImage) => (
              <View key={img.id} style={styles.catalogBlock}>
                <FlatList
                  horizontal
                  data={[img]}
                  renderItem={() => (
                    <Image
                      source={{ uri: img.image_url }}
                      style={[styles.catalogImage, { width: width - 32 }]}
                      contentFit="contain"
                    />
                  )}
                />
              </View>
            ))
        )}
      </ScrollView>
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
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  carouselImage: {
    height: 220,
    borderRadius: 12,
    marginRight: 8,
  },
  carouselPlaceholder: {
    height: 220,
    borderRadius: 12,
    backgroundColor: IsiPlazaColors.redLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLetter: {
    fontSize: 48,
    fontWeight: '700',
    color: IsiPlazaColors.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  heartBtn: {
    padding: 4,
  },
  heart: {
    fontSize: 28,
    color: IsiPlazaColors.red,
  },
  name: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: IsiPlazaColors.black,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: IsiPlazaColors.black,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: IsiPlazaColors.textSecondary,
  },
  contactRow: {
    marginTop: 8,
  },
  contactBtn: {
    alignSelf: 'stretch',
  },
  socialRow: {
    gap: 8,
  },
  socialBtn: {
    alignSelf: 'stretch',
  },
  emptyCatalog: {
    color: IsiPlazaColors.textSecondary,
    fontStyle: 'italic',
  },
  catalogBlock: {
    marginBottom: 12,
  },
  catalogImage: {
    height: 180,
    borderRadius: 8,
    backgroundColor: IsiPlazaColors.backgroundMuted,
  },
});
