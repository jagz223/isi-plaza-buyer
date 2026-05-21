import { FlatList, StyleSheet, Text, View } from 'react-native';

import { IsiPlazaColors } from '@/constants/isi-plaza';
import type { SellersByCountry } from '@/lib/group-sellers';
import type { SellerListItem } from '@/types/api';

import { SellerCard } from './SellerCard';

type Props = {
  grouped: SellersByCountry[];
  onSellerPress: (seller: SellerListItem) => void;
  ListHeaderComponent?: React.ReactElement | null;
};

function chunkPairs<T>(items: T[]): T[][] {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

export function SellerListGrouped({ grouped, onSellerPress, ListHeaderComponent }: Props) {
  if (grouped.length === 0) {
    return (
      <View style={styles.empty}>
        {ListHeaderComponent}
        <Text style={styles.emptyText}>No hay mayoristas con los filtros seleccionados.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={grouped}
      keyExtractor={(item) => item.country}
      ListHeaderComponent={ListHeaderComponent ?? undefined}
      contentContainerStyle={styles.list}
      renderItem={({ item: countryGroup }) => (
        <View style={styles.countryBlock}>
          <Text style={styles.countryTitle}>{countryGroup.country}</Text>
          {countryGroup.states.map((stateGroup) => (
            <View key={`${countryGroup.country}-${stateGroup.state}`} style={styles.stateBlock}>
              <Text style={styles.stateTitle}>{stateGroup.state}</Text>
              {chunkPairs(stateGroup.sellers).map((pair, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {pair.map((seller) => (
                    <View key={seller.id} style={styles.col}>
                      <SellerCard seller={seller} onPress={() => onSellerPress(seller)} />
                    </View>
                  ))}
                  {pair.length === 1 && <View style={styles.col} />}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 24,
  },
  countryBlock: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  countryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: IsiPlazaColors.redDark,
    marginBottom: 8,
    marginTop: 8,
  },
  stateBlock: {
    marginBottom: 12,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: IsiPlazaColors.black,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    color: IsiPlazaColors.textSecondary,
    textAlign: 'center',
  },
});
