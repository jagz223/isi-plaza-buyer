import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IsiPlazaColors } from '@/constants/isi-plaza';
import type { SellerListItem } from '@/types/api';

import { VerifiedBadge } from './VerifiedBadge';

type Props = {
  seller: SellerListItem;
  onPress: () => void;
};

export function SellerCard({ seller, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}>
      <View style={styles.imageWrap}>
        {seller.avatar_url ? (
          <Image source={{ uri: seller.avatar_url }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{seller.name.charAt(0)}</Text>
          </View>
        )}
        {seller.has_active_promotion && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>Promo</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {seller.name}
          </Text>
          <VerifiedBadge verified={seller.is_verified} size="small" />
        </View>
        {seller.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {seller.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: IsiPlazaColors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    margin: 4,
  },
  pressed: {
    opacity: 0.9,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: IsiPlazaColors.backgroundMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IsiPlazaColors.redLight,
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: '700',
    color: IsiPlazaColors.white,
  },
  promoBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: IsiPlazaColors.redDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoText: {
    color: IsiPlazaColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    padding: 8,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: IsiPlazaColors.black,
  },
  description: {
    fontSize: 12,
    color: IsiPlazaColors.textSecondary,
  },
});
