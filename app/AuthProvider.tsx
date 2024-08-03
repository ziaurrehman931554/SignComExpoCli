import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {onAuthStateChanged, signOut, User} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FIREBASE_AUTH} from './FirebaseConfig';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  handleLogin: (email: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  checking: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
      setUser(user);
      if (user) {
        AsyncStorage.setItem('userToken', user.email || '');
        setIsAuthenticated(true);
      } else {
        AsyncStorage.removeItem('userToken');
        setIsAuthenticated(false);
      }
    });
    setChecking(false);

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string) => {
    await AsyncStorage.setItem('userToken', email);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsAuthenticated(false);
    await signOut(FIREBASE_AUTH);
  };

  return (
    <AuthContext.Provider
      value={{user, isAuthenticated, handleLogin, handleLogout, checking}}>
      {children}
    </AuthContext.Provider>
  );
};
