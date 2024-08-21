/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable quotes */
import React, { useContext, useEffect, useState } from "react";
import { useStyle } from "../AppContext";
import { ActivityIndicator, Platform, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";

import Home from "./Home";
import Login from "./Login";
import { AuthContext } from "../AuthProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MainAppProps {
  reset: () => void;
}

export default function MainApp({ reset }: MainAppProps) {
  const { appStyles } = useStyle();
  const authContext = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  if (!authContext) {
    throw new Error("Auth Provides not initialized or used correctly");
  }

  const { user, isAuthenticated, handleLogin, handleLogout, checking }: any =
    authContext;

  return (
    <View style={[appStyles.container, appStyles.background]}>
      {checking ? (
        <View
          style={[
            appStyles.container,
            { display: "flex", alignItems: "center", justifyContent: "center" },
          ]}
        >
          <ActivityIndicator size={"large"} color={appStyles.text.color} />
        </View>
      ) : isAuthenticated && user ? (
        <Home onLogout={handleLogout} userToken={user.email} />
      ) : (
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? insets.top : 0,
          }}
        >
          <Login onLogin={handleLogin} reset={reset} onLogout={handleLogout} />
        </View>
      )}
    </View>
  );
}
