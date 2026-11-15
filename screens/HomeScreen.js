import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { formatGs } from '../utils/format';

export default function HomeScreen() {
  const { expenses } = useExpenses();

  const ingresos = expenses
    .filter((e) => e.type === 'Income')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const gastos = expenses
    .filter((e) => e.type === 'Expense')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const balance = ingresos - gastos;

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Mis Finanzas</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Balance actual</Text>
        <Text style={[styles.balance, balance < 0 && styles.negative]}>
          {formatGs(balance)}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.label}>Ingresos</Text>
          <Text style={styles.income}>{formatGs(ingresos)}</Text>
        </View>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.label}>Gastos</Text>
          <Text style={styles.expense}>{formatGs(gastos)}</Text>
        </View>
      </View>

      <Text style={styles.hint}>
        {expenses.length} movimiento(s) registrado(s)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: { color: '#666', marginBottom: 6 },
  balance: { fontSize: 30, fontWeight: 'bold', color: '#111' },
  negative: { color: '#c62828' },
  income: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  expense: { fontSize: 18, fontWeight: 'bold', color: '#c62828' },
  hint: { textAlign: 'center', color: '#555', marginTop: 10 },
});
