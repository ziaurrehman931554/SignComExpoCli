import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useStyle } from "../AppContext";
import { useIsFocused } from "@react-navigation/native";

interface DrawerScreenProps {
  userToken: any;
  navigation: any;
  onLogout: () => void;
}

export default function DrawerScreen({
  navigation,
  userToken,
  onLogout,
}: DrawerScreenProps) {
  const { appStyles, theme, toggleTheme } = useStyle();
  const u = userToken ? userToken.name : "";
  const isFocused = useIsFocused();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(-270)).current;

  const fadeInAnimation = Animated.timing(fadeIn, {
    toValue: 1,
    duration: 500,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false,
  });

  const fadeOutAnimation = Animated.timing(fadeIn, {
    toValue: 0,
    duration: 500,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false,
  });

  const slideInAnimation = Animated.timing(slideIn, {
    toValue: 0,
    duration: 500,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false,
  });

  const slideOutAnimation = Animated.timing(slideIn, {
    toValue: -370,
    duration: 500,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false,
  });

  useEffect(() => {
    handleOpenDrawer();
  }, [isFocused]);

  const handleOpenDrawer = () => {
    Animated.parallel([fadeInAnimation, slideInAnimation]).start();
  };

  const handleCloseDrawer = () => {
    Animated.parallel([fadeOutAnimation, slideOutAnimation]).start();
    setTimeout(() => {
      navigation.navigate("Home");
    }, 500);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        appStyles.top,
        {
          backgroundColor: fadeIn.interpolate({
            inputRange: [0, 1],
            outputRange:
              theme === "light"
                ? ["rgba(200, 200, 230, 0)", "rgba(200, 200, 230, 0.6)"]
                : ["rgba(50, 50, 50, 0.2)", "rgba(30, 30, 30, 0.8)"],
          }),
        },
      ]}
    >
      <Animated.View
        style={[
          styles.containerS,
          theme === "dark" ? appStyles.background : appStyles.containerBack,
          { transform: [{ translateX: slideIn }] },
        ]}
      >
        <TouchableOpacity
          style={[styles.backContainer, appStyles.containerBack]}
          onPress={handleCloseDrawer}
        >
          <Image
            style={styles.back}
            source={require("../assets/cancel_r.png")}
          />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <View style={styles.profileImgContainer}>
            <Image
              style={styles.profileImg}
              source={require("../assets/Profile.png")}
            />
          </View>
          <View style={[styles.profileNameContainer, appStyles.containerBack]}>
            <Text style={[styles.profileName, appStyles.text]}>{u}</Text>
          </View>
        </View>
        <View style={styles.itemsContainer}>
          <TouchableOpacity
            style={[styles.itemContainer, appStyles.containerBack]}
            onPress={() => navigation.navigate("Account")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={
                  theme === "light"
                    ? require("../assets/user_b.png")
                    : require("../assets/user_w.png")
                }
                style={styles.itemImg}
              />
              <Text style={[styles.item, appStyles.text]}> Profile</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemContainer, appStyles.containerBack]}
            onPress={() => navigation.navigate("About")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={
                  theme === "light"
                    ? require("../assets/info_b.png")
                    : require("../assets/info_w.png")
                }
                style={styles.itemImg}
              />
              <Text style={[styles.item, appStyles.text]}> About</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemContainer, appStyles.containerBack]}
            onPress={() => navigation.navigate("Settings")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={
                  theme === "light"
                    ? require("../assets/setting_b.png")
                    : require("../assets/setting_w.png")
                }
                style={styles.itemImg}
              />
              <Text style={[styles.item, appStyles.text]}> Settings</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            toggleTheme();
          }}
          style={[
            appStyles.containerBack,
            styles.logoutContainer,
            { bottom: 100 },
          ]}
        >
          <Text style={appStyles.text}>
            Turn Dark Mode{" "}
            {theme === "dark" ? <Text>off</Text> : <Text>on</Text>}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogout}
          style={[styles.logoutContainer, appStyles.colorBackground]}
        >
          <Image
            style={styles.logoutImage}
            source={require("../assets/logout_b.png")}
          />
          <Text style={appStyles.text}>Log Out</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  containerS: {
    flex: 1,
    width: 270,
    marginVertical: 10,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  backContainer: {
    height: 30,
    width: 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  itemImg: {
    height: 25,
    width: 25,
  },
  back: {
    height: 30,
    width: 30,
  },
  profileContainer: {
    height: 250,
    alignItems: "flex-start",
    padding: 10,
  },
  profileImgContainer: {
    height: 150,
    width: 150,
    borderRadius: 80,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    backgroundColor: "#D5F2F9",
  },
  profileImg: {
    height: 140,
    width: 140,
    alignSelf: "center",
  },
  profileNameContainer: {
    height: 40,
    width: "auto",
    maxWidth: "90%",
    marginVertical: 5,
    padding: 2,
    borderRadius: 10,
  },
  profileName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  itemsContainer: {
    paddingLeft: 10,
    margin: 5,
    borderRadius: 20,
  },
  itemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginVertical: 3,
    borderBottomColor: "#D5F2F9",
    borderBottomWidth: 0.3,
  },
  item: {
    fontSize: 15,
    paddingLeft: 3,
  },
  logoutContainer: {
    position: "absolute",
    bottom: 40,
    left: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 50,
    width: 140,
    borderRadius: 30,
  },
  logoutImage: {
    marginHorizontal: 5,
    height: 20,
    width: 20,
  },
});
