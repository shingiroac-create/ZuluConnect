import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB1aRQfNLpoDnlO9EcmkGSbML4fkTEajQQ",
  authDomain: "zuluconnect-b3d81.firebaseapp.com",
  projectId: "zuluconnect-b3d81",
  storageBucket: "zuluconnect-b3d81.firebasestorage.app",
  messagingSenderId: "856898216488",
  appId: "1:856898216488:web:6e5623414b21e7175e0b1d"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
