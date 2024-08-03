/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { useStyle } from "./AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { StatusBar } from "react-native";
import OnBoardingScreen from "./components/OnBoardingScreen";
import { AuthProvider } from "./AuthProvider";
import MainApp from "./components/MainApp";

export default function AppContainer() {
  const { appStyles } = useStyle();
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const onboardingStatus = await AsyncStorage.getItem("onboarding");
        setShowOnboarding(onboardingStatus !== "completed"); // Show onboarding if not completed
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    }
    checkOnboarding();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("onboarding", "completed");
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error setting onboarding completion:", error);
    }
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem("onboarding");
      setShowOnboarding(true);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  return (
    <AuthProvider>
      <View style={[appStyles.background, appStyles.container]}>
        {showOnboarding ? (
          <OnBoardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <MainApp reset={handleReset} />
        )}
        <StatusBar barStyle={"default"} />
      </View>
    </AuthProvider>
  );
}
