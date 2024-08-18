import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { useStyle } from "../AppContext";

interface AccountScreenProps {
  userToken: any;
  onLogout: () => void;
  navigation: any;
}

export default function AccountScreen({
  userToken,
  navigation,
  onLogout,
}: AccountScreenProps) {
  const { theme, appStyles } = useStyle();
  return (
    <View
      style={[
        styles.container,
        appStyles.container,
        appStyles.background,
        appStyles.top,
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          onLongPress={onLogout}
        >
          <View style={[styles.backContainer, appStyles.colorBackground]}>
            <Image
              source={
                theme === "light"
                  ? require("../assets/back_w.png")
                  : require("../assets/back_b.png")
              }
              style={styles.back}
            />
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerText, appStyles.text]}>Account</Text>
      </View>
      <View style={styles.body}>
        <View
          style={[
            styles.body,
            theme === "dark" && appStyles.containerBack,
            { borderColor: "#0166FF", borderRadius: 20, borderWidth: 1 },
          ]}
        >
          <View style={styles.profileContainer}>
            <View style={styles.imgContainer}>
              <Image
                source={require("../assets/Profile.png")}
                style={styles.img}
              />
            </View>
          </View>
          <View style={[styles.dataContainer, appStyles.background]}>
            <View style={styles.entryContainer}>
              <Text
                style={[
                  styles.entryLabel,
                  theme === "dark" && appStyles.containerBack,
                  appStyles.colorText,
                ]}
              >
                Name
              </Text>
              <Text
                style={[
                  styles.entryText,
                  theme === "dark" && appStyles.containerBack,
                  appStyles.text,
                ]}
              >
                {userToken.name}
              </Text>
            </View>
            <View style={styles.entryContainer}>
              <Text
                style={[
                  styles.entryLabel,
                  theme === "dark" && appStyles.containerBack,
                  appStyles.colorText,
                ]}
              >
                Email
              </Text>
              <Text
                style={[
                  styles.entryText,
                  theme === "dark" && appStyles.containerBack,
                  appStyles.text,
                ]}
              >
                {userToken.email}
              </Text>
            </View>
            <View style={styles.entryContainer}>
              <Text
                style={[
                  styles.entryLabel,
                  theme === "dark" && appStyles.containerBack,
                  appStyles.colorText,
                ]}
              >
                Type
              </Text>
              <Text
                style={[
                  styles.entryText,
                  theme === "dark" && appStyles.containerBack,
                  appStyles.text,
                ]}
              >
                {userToken.type}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  backContainer: {
    width: 70,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginLeft: 10,
  },
  back: {
    height: 27,
    width: 27,
    padding: 0,
  },
  headerText: {
    position: "absolute",
    left: 0,
    width: "105%",
    textAlign: "center",
    fontSize: 20,
    alignSelf: "center",
    opacity: 0.4,
    zIndex: -1,
  },
  body: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    height: "80%",
    padding: 5,
    alignSelf: "center",
  },
  profileContainer: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  imgContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    padding: 3,
    backgroundColor: "#D9D9D9",
  },
  img: {
    width: 140,
    height: 140,
  },
  dataContainer: {
    width: "97%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  entryContainer: {
    width: "100%",
    height: "33%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    gap: 10,
  },
  entryLabel: {
    fontSize: 17,
    width: 90,
    padding: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  entryText: {
    fontSize: 17,
    width: "auto",
    minWidth: 200,
    padding: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
});
