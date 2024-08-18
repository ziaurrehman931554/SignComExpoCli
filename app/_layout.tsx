// Prevent the splash screen from auto-hiding before asset loading is complete.
import React from "react";
import { AppProvider } from "./AppContext";
import AppContainer from "./AppContainer";
import { NavigationContainer } from "@react-navigation/native";
import { SplashScreen } from "expo-router";
import { View } from "react-native";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <NavigationContainer independent={true}>
      <AppProvider>
        <View style={{ flex: 1, maxWidth: 390 }}>
          <AppContainer />
        </View>
      </AppProvider>
    </NavigationContainer>
  );
}
