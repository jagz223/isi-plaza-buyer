import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IsiButton } from '@/components/isi/IsiButton';
import { IsiLogo } from '@/components/isi/IsiLogo';
import { IsiPlazaColors } from '@/constants/isi-plaza';
import { useAuth } from '@/context/AuthContext';
import { useSocialLogin } from '@/hooks/use-social-login';

export default function AccesoScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { loginWithProvider } = useSocialLogin();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const goToApp = () => router.replace('/(app)/buscar');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(app)/buscar');
    }
  }, [isAuthenticated, router]);

  const handleSocial = async (provider: 'google' | 'facebook' | 'twitter') => {
    setLoadingProvider(provider);
    try {
      const started = await loginWithProvider(provider);
      if (started && provider === 'google') {
        // Google completa en useEffect del hook; navegación tras signIn vía listener
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/brand/access.jpg')}
          style={styles.headerBg}
          contentFit="cover"
        />
        <SafeAreaView style={styles.headerContent}>
          <IsiLogo variant="access" size="large" />
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.body} bounces={false}>
        <IsiButton label="Acceso sin iniciar sesión" onPress={goToApp} style={styles.guestBtn} />

        <Text style={styles.divider}>o inicia sesión con</Text>

        <IsiButton
          label="Continuar con Google"
          variant="social"
          loading={loadingProvider === 'google'}
          onPress={() => handleSocial('google')}
          style={styles.socialBtn}
        />
        <IsiButton
          label="Continuar con Facebook"
          variant="social"
          loading={loadingProvider === 'facebook'}
          onPress={() => handleSocial('facebook')}
          style={styles.socialBtn}
        />
        <IsiButton
          label="Continuar con X"
          variant="social"
          loading={loadingProvider === 'twitter'}
          onPress={() => handleSocial('twitter')}
          style={styles.socialBtn}
        />

        <Text style={styles.hint}>
          Al iniciar sesión podrás guardar mayoristas favoritos y sincronizarlos con tu cuenta.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: IsiPlazaColors.white,
  },
  header: {
    height: '38%',
    minHeight: 260,
    backgroundColor: IsiPlazaColors.red,
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 24,
    gap: 12,
    flexGrow: 1,
  },
  guestBtn: {
    marginTop: 8,
  },
  divider: {
    textAlign: 'center',
    color: IsiPlazaColors.textSecondary,
    marginVertical: 8,
    fontSize: 14,
  },
  socialBtn: {
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: IsiPlazaColors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
