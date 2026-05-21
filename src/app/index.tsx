import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { SPLASH_DURATION_MS } from '@/constants/isi-plaza';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(app)/buscar');
      } else {
        router.replace('/(auth)/acceso');
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/brand/splash.jpg')}
        style={styles.image}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
