import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMenu } from '@/components/isi/AppMenu';
import { IsiButton } from '@/components/isi/IsiButton';
import { ScreenHeader } from '@/components/isi/ScreenHeader';
import { IsiPlazaColors } from '@/constants/isi-plaza';
import { useAuth } from '@/context/AuthContext';

export default function CerrarSesionScreen() {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      router.replace('/(auth)/acceso');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScreenHeader title="Cuenta" />
        <AppMenu />
        <View style={styles.center}>
          <Text style={styles.title}>No has iniciado sesión</Text>
          <IsiButton label="Ir a acceso" onPress={() => router.push('/(auth)/acceso')} />
          <IsiButton
            label="Volver al inicio"
            variant="outline"
            onPress={() => router.replace('/(app)/buscar')}
            style={styles.secondary}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Cerrar sesión" showBack={false} />
      <AppMenu />
      <View style={styles.center}>
        <Text style={styles.prompt}>Cierra sesión aquí</Text>
        {user ? <Text style={styles.user}>{user.name}</Text> : null}
        <IsiButton label="Cerrar sesión" loading={loading} onPress={handleLogout} style={styles.logout} />
        <IsiButton
          label="Volver al inicio"
          variant="outline"
          onPress={() => router.replace('/(app)/buscar')}
          style={styles.secondary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: IsiPlazaColors.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '700',
    color: IsiPlazaColors.black,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  user: {
    fontSize: 14,
    color: IsiPlazaColors.textSecondary,
  },
  logout: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  secondary: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
});
