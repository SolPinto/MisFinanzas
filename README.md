# Mis Finanzas

Proyecto integrador del curso **Desarrollo de Aplicaciones Móviles con React Native** (FPUNA).

App para controlar gastos e ingresos: registro de movimientos por categoría, balance, estadísticas y foto del comprobante con la cámara.

## Funcionalidades
- Formulario controlado de gastos/ingresos con validación
- Navegación con Bottom Tabs + Stack para el detalle
- Listas con FlatList 
- **Cámara:** adjuntar la foto del comprobante a cada movimiento con `expo-camera`, pidiendo el permiso solo al pulsar "Adjuntar comprobante"
- **Persistencia:** los movimientos se guardan en el dispositivo con AsyncStorage y se mantienen al cerrar la app

## Tecnologías
Expo · React Native · React Navigation · expo-camera · expo-linear-gradient · AsyncStorage

## Ejecutar
```bash
npm install
npx expo start
```