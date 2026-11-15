import React from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { formatGs } from '../utils/format';

export default function TransactionScreen({ navigation }) {
  const { expenses } = useExpenses();

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={[...expenses].reverse()}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={styles.empty}>Todavía no hay movimientos.</Text>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate('TransactionDetail', { id: item.id })}
        >
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.category} · {item.date}
            </Text>
          </View>
          {item.receiptUri && (
            <Image source={{ uri: item.receiptUri }} style={styles.thumb} />
          )}
          <Text style={item.type === 'Income' ? styles.income : styles.expense}>
            {item.type === 'Income' ? '+' : '-'}
            {formatGs(item.amount)}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  meta: { color: '#666', marginTop: 2 },
  thumb: { width: 40, height: 40, borderRadius: 6, marginHorizontal: 8 },
  income: { color: '#2e7d32', fontWeight: 'bold' },
  expense: { color: '#c62828', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40, color: '#555' },
});
