import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { formatGs } from '../utils/format';

export default function StatsScreen() {
  const { expenses } = useExpenses();
  const gastos = expenses.filter((e) => e.type === 'Expense');
  const total = gastos.reduce((acc, e) => acc + Number(e.amount), 0);

  // Total de gastos por categoría
  const porCategoria = gastos.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});
  const categorias = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Gastos por categoría</Text>
        {categorias.length === 0 ? (
          <Text style={styles.empty}>Todavía no hay gastos.</Text>
        ) : (
          categorias.map(([cat, monto]) => {
            const pct = total ? Math.round((monto / total) * 100) : 0;
            return (
              <View key={cat} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.cat}>{cat}</Text>
                  <Text>
                    {formatGs(monto)} ({pct}%)
                  </Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.bar, { width: `${pct}%` }]} />
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 2 },
  label: { fontWeight: 'bold', marginBottom: 12 },
  empty: { color: '#666' },
  item: { marginBottom: 12 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cat: { fontWeight: '500' },
  barBg: { height: 8, backgroundColor: '#eee', borderRadius: 4 },
  bar: { height: 8, backgroundColor: '#1ABC9C', borderRadius: 4 },
});
