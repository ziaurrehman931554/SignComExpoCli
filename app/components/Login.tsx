/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { StatusBar } from "react-native";
import { useStyle, useUser } from "../AppContext";

import { FIREBASE_AUTH, USES_REF } from "../FirebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { addDoc, doc, getDoc, setDoc } from "firebase/firestore";

interface LoginProps {
  onLogin: (email: string) => void;
  reset: () => void;
  onLogout: any;
}

export default function Login({
  onLogin,
  reset,
  onLogout,
}: LoginProps): JSX.Element {
  const { appStyles, theme } = useStyle();
  const {
    getUserData,
    addUserToData,
    removeUserFromData,
    setRootLoading,
    updateUserByEmail,
  } = useUser();
  const users = getUserData();

  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    type: "",
    profile: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("login");
  const auth = FIREBASE_AUTH;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Update state when keyboard is shown
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Update state when keyboard is hidden
      }
    );

    // Cleanup listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleAuthentication = () => {
    if (status === "login") {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    if (user.email === "" || user.password === "") {
      showAlert("Error", "Please fill all the fields");
      setLoading(false);
      return;
    }
    try {
      onLogin(user.email);
      let newUser = {
        email: user.email,
        name: "",
        type: "",
        uid: "",
        profile: "",
        favorites: [],
        recent: [],
        setting: [],
        password: user.password,
      };
      addUserToData(newUser); // Add the fetched data to your user context
      const response = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      setRootLoading(true);

      // Fetch the user document from Fire store using the uid
      const userDocRef = doc(USES_REF, response.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        newUser.name = userData.name;
        newUser.type = userData.type;
        newUser.profile = userData.profile || "";
        newUser.uid = userData.uid;
        updateUserByEmail(userData.email, newUser);
      }
    } catch (error: any) {
      onLogout();
      removeUserFromData(user.email);
      showAlert("Error", displayErrorShort(error));
    } finally {
      setRootLoading(false);
      setLoading(false);
    }
  };

  const displayErrorShort = (error: any) => {
    const errorMessage = error.message.match(/auth\/([^).]+)/);
    const rawMessage = errorMessage
      ? errorMessage[1]
      : "Unknown error occurred";
    const displayMessage = rawMessage.replace(/[-_]/g, " ");
    return displayMessage;
  };

  const handleSignup = () => {
    setLoading(true);
    if (user.password !== user.confirmPassword) {
      showAlert("Error", "Passwords do not match");
      setLoading(false);
      return;
    }
    if (
      user.name === "" ||
      user.email === "" ||
      user.password === "" ||
      user.confirmPassword === "" ||
      user.type === ""
    ) {
      showAlert("Error", "Please fill all the fields");
      setLoading(false);
      return;
    }
    handleAddUser();
  };

  const handleAddUser = async () => {
    const newUser = {
      email: user.email,
      password: user.password,
      name: user.name,
      confirmPassword: user.confirmPassword,
      type: user.type,
      profile: user.profile,
      favorites: [],
      recent: [],
      setting: [],
    };
    try {
      addUserToData(newUser);
      onLogin(user.email);
      const response = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      setRootLoading(true);
      await updateProfile(response.user, {
        displayName: user.name,
        photoURL: "",
      });
      await setDoc(doc(USES_REF, response.user.uid), {
        name: user.name,
        email: response.user.email,
        uid: response.user.uid,
        type: user.type,
      });
    } catch (error: any) {
      removeUserFromData(user.email);
      onLogout();
      showAlert("error", displayErrorShort(error));
      setLoading(false);
      return;
    } finally {
      setRootLoading(false);
      setLoading(false);
    }
  };

  const handlePressOutside = useCallback(() => {
    Keyboard.dismiss(); // Hide the keyboard
  }, []);

  const showAlert = (title: string, message: any) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  return (
    <View
      style={[styles.container, appStyles.background]}
      onTouchStart={handlePressOutside}
    >
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "height"}
        style={styles.bodyContainer}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContainer,
            { width: "100%" },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              height: "100%",
              width:
                Platform.OS === "web"
                  ? (Dimensions.get("window").width * 90) / 100
                  : "auto",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={reset}>
              <Text style={[styles.title, appStyles.text]}>
                {status === "login" ? "Log in" : "Sign up"}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.textTitle, appStyles.colorText]}>
              Email Address
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email ID"
                value={user.email}
                autoCapitalize="none"
                onChangeText={(text) => setUser({ ...user, email: text })}
                style={[styles.input, appStyles.text]}
                placeholderTextColor={appStyles.text}
              />
              {user.email.length > 0 &&
              user.email.includes("@") &&
              user.email.includes(".com") ? (
                <Text>✅</Text>
              ) : (
                <Text style={{ opacity: 0 }}>✅</Text>
              )}
            </View>
            <View style={styles.line} />
            <Text style={[styles.textTitle, appStyles.colorText]}>
              Password
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={user.password}
                autoCapitalize="none"
                onChangeText={(text) => setUser({ ...user, password: text })}
                style={[styles.input, appStyles.text]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={
                    !showPassword
                      ? require("../assets/pass_show_w.png")
                      : require("../assets/pass_hide_w.png")
                  }
                  style={styles.passImg}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            {status === "signup" && (
              <>
                <Text style={[styles.textTitle, appStyles.colorText]}>
                  Name
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, appStyles.text]}
                    placeholderTextColor={appStyles.text}
                    placeholder="Name"
                    value={user.name}
                    onChangeText={(text) => setUser({ ...user, name: text })}
                  />
                  {user.name.length > 0 ? (
                    <Text>✅</Text>
                  ) : (
                    <Text style={{ opacity: 0 }}>✅</Text>
                  )}
                </View>
                <View style={styles.line} />
                <Text style={[styles.textTitle, appStyles.colorText]}>
                  Confirm Password
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={!showPassword}
                    value={user.confirmPassword}
                    autoCapitalize="none"
                    placeholderTextColor={appStyles.text}
                    onChangeText={(text) =>
                      setUser({ ...user, confirmPassword: text })
                    }
                    style={[styles.input, appStyles.text]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      source={
                        !showPassword
                          ? require("../assets/pass_show_w.png")
                          : require("../assets/pass_hide_w.png")
                      }
                      style={styles.passImg}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.line} />
                <Text style={[styles.textTitle, appStyles.colorText]}>
                  Type{" "}
                  <Text style={[styles.currentTypeContainer, appStyles.text]}>
                    {" "}
                    Currently: {user.type}
                  </Text>
                </Text>
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.type,
                      { borderColor: theme === "light" ? "black" : "white" },
                      user.type === "Normal" && appStyles.colorBackground,
                    ]}
                    onPress={() => setUser({ ...user, type: "Normal" })}
                  >
                    <Text style={[styles.typeText, appStyles.text]}>
                      Normal
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.type,
                      { borderColor: theme === "light" ? "black" : "white" },
                      user.type === "Specially-abled" &&
                        appStyles.colorBackground,
                    ]}
                    onPress={() =>
                      setUser({ ...user, type: "Specially-abled" })
                    }
                  >
                    <Text style={[styles.typeText, appStyles.text]}>
                      Specially-abled
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {!isKeyboardVisible && (
        <View style={styles.btnContainerC}>
          <TouchableOpacity
            onPress={handleAuthentication}
            style={[styles.btnContainer, appStyles.colorBackground]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={[styles.btn, appStyles.text]}>
                {status === "login" ? "Login" : "Signup"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      {!isKeyboardVisible && (
        <View style={styles.accountContainer}>
          <Text style={styles.accText}>
            {status === "login" ? (
              <Text>
                Don't have an account?{" "}
                <TouchableOpacity
                  onPress={() => {
                    setStatus("signup");
                  }}
                >
                  <Text style={styles.accBtn}>Signup</Text>
                </TouchableOpacity>
              </Text>
            ) : (
              <Text>
                Already have an account?{" "}
                <TouchableOpacity onPress={() => setStatus("login")}>
                  <Text style={styles.accBtn}>Login</Text>
                </TouchableOpacity>
              </Text>
            )}
          </Text>
        </View>
      )}
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 70,
    width: 80,
  },
  bodyContainer: {
    height: "75%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 15,
    maxHeight: "75%",
  },
  btnContainerC: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    width: 170,
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 45,
    paddingVertical: 15,
    color: "white",
  },
  btn: {
    fontSize: 20,
  },
  accountContainer: {
    height: "5%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 13,
  },
  currentTypeContainer: {
    fontSize: 10,
    opacity: 0.5,
    textAlign: "right",
    width: "100%",
  },
  accText: {
    color: "#878787",
    justifyContent: "center",
    alignItems: "center",
  },
  accBtn: {
    color: "#5063BF",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 42,
    paddingVertical: 15,
  },
  textTitle: {
    fontSize: 13,
    paddingVertical: 15,
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  input: {
    width: "90%",
    padding: 5,
    borderWidth: 0,
    margin: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    alignSelf: "center",
  },
  line: {
    width: "95%",
    alignSelf: "center",
    margin: 5,
    height: 1,
    backgroundColor: "#878787",
  },
  typeContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  passImg: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
  type: {
    alignItems: "center",
    gap: 5,
    width: "45%",
    padding: 5,
    height: 50,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 50,
  },
  typeText: {
    fontSize: 18,
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    // borderWidth: 1,
  },
});
