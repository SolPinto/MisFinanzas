import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { formatGs } from '../utils/format';

export default function TransactionDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { expenses, deleteExpense } = useExpenses();
  const item = expenses.find((e) => e.id === id);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>El movimiento ya no existe.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteExpense(item.id);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.type}>
          {item.type === 'Income' ? 'Ingreso' : 'Gasto'}
        </Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={item.type === 'Income' ? styles.income : styles.expense}>
          {formatGs(item.amount)}
        </Text>
        <Text style={styles.info}>Categoría: {item.category}</Text>
        <Text style={styles.info}>Fecha: {item.date}</Text>

        <Text style={styles.section}>Comprobante</Text>
        {item.receiptUri ? (
          <Image
            source={{ uri: item.receiptUri }}
            style={styles.receipt}
            resizeMode='contain'
          />
        ) : (
          <Text style={styles.noReceipt}>Sin comprobante adjunto.</Text>
        )}

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 2 },
  type: { color: '#666' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111', marginVertical: 4 },
  income: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10 },
  expense: { fontSize: 22, fontWeight: 'bold', color: '#c62828', marginBottom: 10 },
  info: { fontSize: 16, color: '#111', marginBottom: 4 },
  section: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  receipt: { width: '100%', height: 300, borderRadius: 8, backgroundColor: '#eee' },
  noReceipt: { color: '#666' },
  deleteBtn: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});
