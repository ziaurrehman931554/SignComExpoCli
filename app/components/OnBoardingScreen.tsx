/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from "react";
import { useStyle } from "../AppContext";
import {
  View,
  Image,
  Text,
  Button,
  Dimensions,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native";

interface OnBoardingData {
  key: string;
  imageSource: number;
  title: string;
  description: string;
}

const OnBoardingData: OnBoardingData[] = [
  {
    key: "1",
    imageSource: require("../assets/page1.png"),
    title: "Fast, Secure & Trusted",
    description: "Fast and safe Video calling Guaranteed",
  },
  {
    key: "2",
    imageSource: require("../assets/page2.png"),
    title: "AI Incorporated",
    description:
      "Makes Communication easy by Translating Sign language to speech and text. Vice-versa",
  },
  {
    key: "3",
    imageSource: require("../assets/page3.png"),
    title: "Bridging the Gap",
    description:
      "Helps people connect online irrespective of hearing & speaking Disabilities in virtual world",
  },
];

interface OnBoardingScreenProps {
  onComplete: () => void;
}

const OnBoardingScreen: React.FC<OnBoardingScreenProps> = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { appStyles, theme, toggleAppColor } = useStyle();

  useEffect(() => {
    Animated.spring(scrollX, {
      toValue: activeIndex * Dimensions.get("window").width,
      useNativeDriver: true,
    }).start();
    activeIndex === -1 || activeIndex === 0 ? toggleAppColor() : () => {};
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex(0);
  };

  const renderItem = ({ item }: { item: OnBoardingData }) => {
    return (
      <View
        style={{
          width: Platform.OS === "web" ? 375 : Dimensions.get("window").width,
        }}
      >
        <Image
          source={item.imageSource}
          style={{ width: 300, height: 300, alignSelf: "center" }}
        />
        <Text
          style={[
            {
              textAlign: "center",
              marginTop: 20,
              fontSize: 35,
              fontWeight: "bold",
            },
            appStyles.text,
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            {
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              paddingHorizontal: 20,
            },
            appStyles.text,
          ]}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  const renderDot = (index: number, active: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={[styles.dot, active === index && appStyles.inverseBackground]}
        onPress={() => {}}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {activeIndex === -1 ? (
        <ImageBackground
          source={require("../assets/background.png")}
          style={styles.container}
        >
          <View
            style={{
              height: "50%",
              alignItems: "center",
              justifyContent: "flex-end",
              marginBottom: 30,
            }}
          >
            <Image
              source={require("../assets/logo.png")}
              style={{ height: 180, width: 200 }}
            />
          </View>
          <View>
            <Text
              style={[
                { fontSize: 45, alignSelf: "center", fontWeight: "bold" },
                appStyles.inverseText,
              ]}
            >
              Welcome To
            </Text>
            <Text
              style={[
                { fontSize: 36, alignSelf: "center", fontWeight: "bold" },
                appStyles.colorText,
              ]}
            >
              SignCom.
            </Text>
            <Text
              style={[
                {
                  fontSize: 15,
                  alignSelf: "center",
                  letterSpacing: 2,
                  opacity: 0.8,
                  marginVertical: 20,
                },
                appStyles.inverseText,
              ]}
            >
              Bridging the Gap, Uniting the World
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleNext}>
              <View style={[styles.button, appStyles.colorBackground]}>
                <Text style={appStyles.text}>Get Started</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        <View style={[appStyles.background, appStyles.container]}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
          </View>
          <View style={styles.flatListContainer}>
            <Animated.FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: true,
                }
              )}
              onMomentumScrollEnd={({ nativeEvent }) => {
                const currentIndex = Math.round(
                  nativeEvent.contentOffset.x / Dimensions.get("window").width
                );
                setActiveIndex(currentIndex + 1);
              }}
              renderItem={renderItem}
              data={OnBoardingData}
              keyExtractor={(item) => item.key}
            />
          </View>

          <View style={styles.dotsContainer}>
            {OnBoardingData.map((item, index) =>
              renderDot(index + 1, activeIndex)
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onComplete}>
              <View
                style={[
                  styles.button,
                  Platform.OS === "web"
                    ? appStyles.colorBackground
                    : activeIndex !== OnBoardingData.length
                    ? styles.black
                    : appStyles.colorBackground,
                ]}
              >
                <Text
                  style={{
                    color:
                      activeIndex !== OnBoardingData.length ? "black" : "white",
                  }}
                >
                  Continue
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <StatusBar barStyle={"default"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  logo: {
    width: 90,
    height: 80,
    alignSelf: "center",
  },
  flatListContainer: {
    width: "100%",
    height: "60%",
    paddingTop: 10,
  },
  buttonContainer: {
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 201,
    height: 59,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  black: {
    backgroundColor: "grey",
    opacity: 0.5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: "black",
  },
});

export default OnBoardingScreen;
