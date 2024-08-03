import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCwzSJbx0_KOSonLuL8jWigJyQ0EnopkHQ",
  authDomain: "signcom-7b12b.firebaseapp.com",
  projectId: "signcom-7b12b",
  storageBucket: "signcom-7b12b.appspot.com",
  messagingSenderId: "336555633546",
  appId: "1:336555633546:web:ecb735dcb3ca1044eab673",
  measurementId: "G-ZG6KXNDXSD",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_ST = getStorage(FIREBASE_APP);

export const USES_REF = collection(FIREBASE_DB, "users");
