import { Image, StyleSheet, View } from 'react-native';

import { IsiPlazaColors } from '@/constants/isi-plaza';

type Props = {
  variant?: 'splash' | 'access';
  size?: 'large' | 'medium';
};

export function IsiLogo({ variant = 'access', size = 'medium' }: Props) {
  const source =
    variant === 'splash'
      ? require('@/assets/images/brand/splash.jpg')
      : require('@/assets/images/brand/logo.jpeg');

  const dimensions = size === 'large' ? { width: 220, height: 220 } : { width: 120, height: 120 };

  if (variant === 'splash') {
    return (
      <Image source={source} style={[styles.splashFull, styles.cover]} resizeMode="cover" />
    );
  }

  return (
    <View style={styles.logoWrap}>
      <Image source={source} style={[dimensions, styles.contain]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  splashFull: {
    ...StyleSheet.absoluteFillObject,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  contain: {
    backgroundColor: IsiPlazaColors.white,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
