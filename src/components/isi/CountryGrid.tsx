import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IsiPlazaColors } from '@/constants/isi-plaza';
import type { CountryFilterOption } from '@/types/api';

type Props = {
  countries: CountryFilterOption[];
  selected: string | null;
  onSelect: (country: string) => void;
};

export function CountryGrid({ countries, selected, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Filtrar Mayoristas Por País</Text>
      <View style={styles.grid}>
        {countries.map((country) => {
          const isSelected = selected === country.name;
          const disabled = !country.has_sellers;
          return (
            <Pressable
              key={country.name}
              disabled={disabled}
              onPress={() => onSelect(country.name)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                disabled && styles.chipDisabled,
              ]}>
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                  disabled && styles.chipTextDisabled,
                ]}
                numberOfLines={2}>
                {country.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: IsiPlazaColors.black,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chip: {
    width: '18%',
    minWidth: 56,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: IsiPlazaColors.white,
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: IsiPlazaColors.red,
    backgroundColor: IsiPlazaColors.redLight,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 10,
    textAlign: 'center',
    color: IsiPlazaColors.black,
  },
  chipTextSelected: {
    fontWeight: '700',
    color: IsiPlazaColors.redDark,
  },
  chipTextDisabled: {
    color: '#999',
  },
});
