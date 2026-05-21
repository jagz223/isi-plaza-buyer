import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IsiPlazaColors } from '@/constants/isi-plaza';
import { useAuth } from '@/context/AuthContext';

export function AppMenu() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => router.push('/(app)/buscar')}>
        <Text style={styles.link}>Buscar</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(app)/mayoristas')}>
        <Text style={styles.link}>Lista</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(app)/guardados')}>
        <Text style={styles.link}>Guardados</Text>
      </Pressable>
      {isAuthenticated ? (
        <Pressable onPress={() => router.push('/(app)/cerrar-sesion')}>
          <Text style={styles.link}>Cuenta</Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => router.push('/(auth)/acceso')}>
          <Text style={styles.linkAccent}>Entrar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  link: {
    fontSize: 13,
    color: IsiPlazaColors.textSecondary,
    fontWeight: '500',
  },
  linkAccent: {
    fontSize: 13,
    color: IsiPlazaColors.red,
    fontWeight: '700',
  },
});
