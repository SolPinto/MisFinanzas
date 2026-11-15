import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseContext = createContext();
const STORAGE_KEY = '@misfinanzas/movimientos';

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Al abrir la app lee los movimientos guardados
  useEffect(() => {
    async function loadExpenses() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setExpenses(JSON.parse(json));
      } catch (e) {
        console.log('Error al cargar movimientos:', e);
      } finally {
        setLoaded(true);
      }
    }
    loadExpenses();
  }, []);

  // Cada vez que cambia la lista se guardará
  // Se espera a "loaded" para no sobrescribir lo guardado con la lista vacía inicial
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)).catch((e) =>
      console.log('Error al guardar movimientos:', e)
    );
  }, [expenses, loaded]);

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, { ...expense, id: Date.now().toString() }]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, loaded }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}