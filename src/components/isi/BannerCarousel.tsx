import { Image } from 'expo-image';
import { useWindowDimensions } from 'react-native';
import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { consumerApi } from '@/lib/api';
import { openExternalUrl } from '@/lib/whatsapp';
import type { ConsumerBanner } from '@/types/api';

type Props = {
  banners: ConsumerBanner[];
};

export function BannerCarousel({ banners }: Props) {
  const { width } = useWindowDimensions();
  const bannerWidth = width * 0.7;
  const bannerHeight = width * 0.15;
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<ConsumerBanner>>(null);

  if (banners.length === 0) return null;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (bannerWidth + 12));
    setIndex(i);
  };

  const onBannerPress = async (banner: ConsumerBanner) => {
    try {
      await consumerApi.clickBanner(banner.id);
    } catch {
      // métrica no bloquea navegación
    }
    if (banner.link_url) {
      await openExternalUrl(banner.link_url);
    }
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        snapToInterval={bannerWidth + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Pressable onPress={() => onBannerPress(item)}>
            <View style={[styles.banner, { width: bannerWidth, height: bannerHeight }]}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} contentFit="cover" />
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>
          </Pressable>
        )}
      />
      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((b, i) => (
            <View key={b.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 12,
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  banner: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#EEE',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#DDD',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCC',
  },
  dotActive: {
    backgroundColor: '#FF0000',
  },
});
