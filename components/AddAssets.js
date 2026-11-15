// components/AddAssets.js
// Formulario de ingresos/gastos + Capítulo 6 Parte 1: estado de la cámara (expo-camera)
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useExpenses } from '../context/ExpenseContext';
import { formatGs, today } from '../utils/format';

const CATEGORIES = ['Comida', 'Transporte', 'Servicios', 'Salud', 'Estudio', 'Sueldo', 'Otros'];

export default function AddAssets() {
  const { expenses, addExpense, deleteExpense } = useExpenses();

  // Estado del formulario
  const [type, setType] = useState('Expense'); // 'Expense' (gasto) o 'Income' (ingreso)
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(today());

  // Nuevo: estado de la cámara
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [receiptUri, setReceiptUri] = useState(null);
  const cameraRef = useRef(null);

  // Permiso contextual: se solicita solo cuando el usuario pulsa "Adjuntar comprobante"
  const handleAttachReceipt = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permiso requerido', 'Se necesita la cámara para adjuntar comprobantes.');
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setReceiptUri(photo.uri);
      setShowCamera(false);
    }
  };

  const handleAddExpense = () => {
    if (!name.trim() || !amount.trim() || !category || !date.trim()) {
      Alert.alert('Campos incompletos', 'Completá nombre, monto, categoría y fecha.');
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Monto inválido', 'Ingresá un monto mayor a cero.');
      return;
    }
    addExpense({ type, name: name.trim(), amount, category, date, receiptUri });
    setName('');
    setAmount('');
    setCategory('');
    setDate(today());
    setReceiptUri(null); // reset después de guardar
  };

  // Vista de cámara a pantalla completa
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.cameraView} ref={cameraRef} />
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
            <Text style={styles.captureBtnText}>Capturar comprobante</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCamera(false)}>
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const form = (
    <View>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'Expense' && styles.typeBtnActive]}
          onPress={() => setType('Expense')}
        >
          <Text style={[styles.typeBtnText, type === 'Expense' && styles.typeBtnTextActive]}>
            Gasto
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'Income' && styles.typeBtnActive]}
          onPress={() => setType('Income')}
        >
          <Text style={[styles.typeBtnText, type === 'Income' && styles.typeBtnTextActive]}>
            Ingreso
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Agregar {type === 'Expense' ? 'gasto' : 'ingreso'}</Text>

      <View style={styles.box}>
        <TextInput
          style={styles.input}
          placeholder='Descripción'
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder='Monto (₲)'
          keyboardType='numeric'
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder='Fecha (AAAA-MM-DD)'
          value={date}
          onChangeText={setDate}
        />

        {/* Botón para adjuntar comprobante + miniatura */}
        <TouchableOpacity style={styles.receiptBtn} onPress={handleAttachReceipt}>
          <Text style={styles.receiptBtnText}>
            {receiptUri ? '☑ Comprobante adjunto' : '📷 Adjuntar comprobante'}
          </Text>
        </TouchableOpacity>
        {receiptUri && (
          <Image source={{ uri: receiptUri }} style={styles.receiptThumbnail} resizeMode='cover' />
        )}

        <Button title='Guardar' onPress={handleAddExpense} />
      </View>

      <Text style={styles.title}>Movimientos</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={form}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseText}>
                {item.type === 'Income' ? 'Ingreso' : 'Gasto'} | {item.name} |{' '}
                {formatGs(item.amount)} | {item.category} - {item.date}
              </Text>
            </View>
            {item.receiptUri && (
              <Image
                source={{ uri: item.receiptUri }}
                style={styles.listThumbnail}
                resizeMode='cover'
              />
            )}
            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
              <Text style={styles.deleteBtn}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Todavía no hay movimientos.</Text>}
        keyboardShouldPersistTaps='handled'
      />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  expenseText: { flexShrink: 1 },
  deleteBtn: { color: 'red', marginLeft: 10 },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f6f6f6',
    marginHorizontal: 4,
  },
  typeBtnActive: { backgroundColor: '#964B00', borderColor: '#007AFF' },
  typeBtnText: { color: '#222', fontWeight: '500', fontSize: 15 },
  typeBtnTextActive: { color: '#fff' },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f6f6f6',
    marginHorizontal: 4,
    marginBottom: 6,
  },
  categoryBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  categoryBtnText: { color: '#222', fontWeight: '500', fontSize: 15 },
  categoryBtnTextActive: { color: '#fff' },

  // Cámara y comprobantes (Cap. 6, Paso 9)
  cameraContainer: { flex: 1 },
  cameraView: { flex: 1 },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  captureBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  captureBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  cancelBtnText: { color: '#fff', fontSize: 14 },
  receiptBtn: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  receiptBtnText: { color: '#007AFF', fontWeight: '500' },
  receiptThumbnail: { width: '100%', height: 120, borderRadius: 8, marginBottom: 10 },
  expenseInfo: { flex: 1 },
  listThumbnail: { width: 48, height: 48, borderRadius: 6, marginLeft: 8 },
});
