import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { IsiPlazaColors } from '@/constants/isi-plaza';

type Variant = 'primary' | 'outline' | 'social';

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IsiButton({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'social' && styles.social,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? IsiPlazaColors.red : IsiPlazaColors.white} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'outline' && styles.labelOutline,
            variant === 'social' && styles.labelSocial,
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primary: {
    backgroundColor: IsiPlazaColors.red,
  },
  outline: {
    backgroundColor: IsiPlazaColors.white,
    borderWidth: 2,
    borderColor: IsiPlazaColors.red,
  },
  social: {
    backgroundColor: IsiPlazaColors.black,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: IsiPlazaColors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelOutline: {
    color: IsiPlazaColors.red,
  },
  labelSocial: {
    color: IsiPlazaColors.white,
    fontSize: 15,
  },
});
