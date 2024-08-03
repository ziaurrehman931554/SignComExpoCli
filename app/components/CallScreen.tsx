import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { useStyle } from "../AppContext";

import { ParamListBase, RouteProp, useRoute } from "@react-navigation/native";

interface RouteParams extends RouteProp<ParamListBase, string> {
  user: any;
}

interface CallScreenProps {
  navigation: any;
}

export default function CallScreen({ navigation }: CallScreenProps) {
  const { appStyles } = useStyle();
  const route = useRoute<RouteParams>();
  const { user }: any = route?.params || "";
  const u = user ? user.Name : "";
  const [generateID, setGenerateId] = useState("");
  const [joinID, setJoinId] = useState("");

  const HandleJoin = () => {
    console.log(generateID, joinID);
    if (joinID === "") {
      navigation.navigate("MakeCall", { id: generateID });
    } else {
      navigation.navigate("MakeCall", { id: joinID });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={[appStyles.container, appStyles.top]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <View style={[styles.backContainer, appStyles.colorBackground]}>
              <Text style={[styles.back, appStyles.text]}>🔙</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerText}>Make a Call</Text>
        </View>
        <View style={styles.joinContainer}>
          <Text style={styles.title}>Join Existing Channel</Text>
          <View style={[styles.imgContainer, appStyles.containerBack]}>
            <Image source={require("../assets/join.png")} style={styles.img} />
          </View>
          <TextInput
            style={[styles.input, appStyles.containerBack, appStyles.text]}
            placeholderTextColor={appStyles.text.color}
            placeholder="Enter Channel Name"
            value={joinID}
            onChangeText={(Text) => {
              setJoinId(Text);
            }}
          />
          <TouchableOpacity
            style={[styles.btn, appStyles.colorBackground]}
            onPress={HandleJoin}
          >
            <Text style={[styles.btnText, appStyles.text]}>
              Join {u && <Text>{u}</Text>}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View style={styles.joinContainer}>
          <Text style={styles.title}>
            Generate New Channel {u && <Text>for {u}</Text>}
          </Text>
          <View style={[styles.imgContainer, appStyles.containerBack]}>
            <Image source={require("../assets/join.png")} style={styles.img} />
          </View>
          <TextInput
            style={[styles.input, appStyles.containerBack, appStyles.text]}
            placeholderTextColor={appStyles.text.color}
            placeholder="Enter New Channel Name"
            value={generateID}
            onChangeText={(Text) => {
              setGenerateId(Text);
            }}
          />
          <TouchableOpacity
            style={[styles.btn, appStyles.colorBackground]}
            onPress={HandleJoin}
          >
            <Text style={[styles.btnText, appStyles.text]}>
              Generate & Join
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addPad}></View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  addPad: {
    width: "100%",
    height: 100,
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
    padding: 0,
  },
  headerText: {
    position: "absolute",
    left: 0,
    width: "105%",
    textAlign: "center",
    fontSize: 20,
    alignSelf: "center",
    opacity: 0.5,
    zIndex: -1,
  },
  joinContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  imgContainer: {
    width: 140,
    height: 140,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  img: {
    width: "120%",
    height: "120%",
    alignSelf: "center",
  },
  input: {
    height: 33,
    width: "70%",
    borderRadius: 50,
    textAlign: "center",
    padding: 7,
    marginVertical: 10,
  },
  id: {
    textAlign: "center",
    height: 33,
    padding: 7,
    marginVertical: 10,
    width: "70%",
    borderRadius: 16,
    overflow: "hidden",
  },
  btn: {
    width: "40%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginVertical: 10,
  },
  btnText: {
    fontWeight: "bold",
  },
  callID: {
    width: "70%",
    backgroundColor: "#D9D9D9",
    borderRadius: 50,
    textAlign: "center",
    padding: 7,
  },
  line: {
    width: "90%",
    height: 3,
    margin: 5,
    alignSelf: "center",
    backgroundColor: "#517A90",
    opacity: 0.3,
  },
});
