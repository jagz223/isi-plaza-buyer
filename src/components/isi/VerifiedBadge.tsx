import { StyleSheet, Text, View } from 'react-native';

import { IsiPlazaColors } from '@/constants/isi-plaza';

type Props = {
  verified: boolean;
  size?: 'small' | 'medium';
};

export function VerifiedBadge({ verified, size = 'medium' }: Props) {
  const dim = size === 'small' ? 18 : 24;
  const fontSize = size === 'small' ? 11 : 14;

  return (
    <View
      style={[
        styles.badge,
        { width: dim, height: dim, borderRadius: dim / 2 },
        verified ? styles.verified : styles.unverified,
      ]}>
      <Text style={[styles.check, { fontSize }, !verified && styles.checkMuted]}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  verified: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  unverified: {
    backgroundColor: IsiPlazaColors.white,
    borderColor: '#CCC',
  },
  check: {
    color: IsiPlazaColors.white,
    fontWeight: '700',
  },
  checkMuted: {
    color: '#BBBBBB',
  },
});
