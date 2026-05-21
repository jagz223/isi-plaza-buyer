import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IsiPlazaColors } from '@/constants/isi-plaza';

type Props = {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
};

export function ScreenHeader({ title, showBack = true, rightAction }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.back()}
            style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.right}>{rightAction ?? <View style={styles.backPlaceholder} />}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: IsiPlazaColors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 40,
  },
  backText: {
    fontSize: 24,
    color: IsiPlazaColors.red,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: IsiPlazaColors.black,
    textAlign: 'center',
  },
  right: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
