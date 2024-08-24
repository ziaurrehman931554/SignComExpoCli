/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface User {
  email: string;
  password: string;
  name: string;
  type: string;
  profile: string;
  favorites: { Name: string; profile: string }[];
  recent: { Name: string; last_call: string; profile: string }[];
  setting: any[];
}

interface UserContextData {
  usersData: User[];
  searchText: string;
  setSearchText: (newSearchText: string) => void;
  addUserToData: (userData: User) => void;
  removeUserFromData: (email: string) => void;
  findUserByEmail: (email: string) => User | undefined;
  updateUserByEmail: (email: string, updatedUserData: Partial<User>) => void;
  getUserData: () => User[];
  setRootLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextData>({
  usersData: [],
  searchText: "",
  setSearchText: () => {},
  addUserToData: () => {},
  removeUserFromData: () => {},
  findUserByEmail: () => undefined,
  updateUserByEmail: () => {},
  getUserData: () => [],
  setRootLoading: () => {},
});

interface StyleContextData {
  appStyles: any;
  theme: string;
  toggleTheme: () => void;
  toggleAppColor: () => void;
}

const StyleContext = createContext<StyleContextData>({
  appStyles: StyleSheet.create({}),
  theme: "",
  toggleTheme: () => {},
  toggleAppColor: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usersData, setUsersData] = useState<User[]>([
    {
      email: "zr931554@gmail.com",
      password: "123",
      name: "Zia ur Rehman",
      type: "normal",
      profile: "../assets/profile.png",
      favorites: [
        { Name: "Name A", profile: "../assets/profile.png" },
        { Name: "Name B", profile: "../assets/profile.png" },
        { Name: "Name C", profile: "../assets/profile.png" },
        { Name: "Name D", profile: "../assets/profile.png" },
      ],
      recent: [
        {
          Name: "Name",
          last_call: "Today at 11:11",
          profile: "../assets/profile.png",
        },
        {
          Name: "Name B",
          last_call: "yesterday at 9:41",
          profile: "../assets/profile.png",
        },
        {
          Name: "Name C",
          last_call: "Sunday",
          profile: "../assets/profile.png",
        },
        {
          Name: "Name D",
          last_call: "1M Ago",
          profile: "../assets/profile.png",
        },
      ],
      setting: [],
    },
    {
      email: "special@gmail.com",
      password: "Asdfghjkl",
      name: "Special user",
      type: "Specially-abled",
      profile: "../assets/profile.png",
      favorites: [],
      recent: [],
      setting: [],
    },
  ]);
  const [searchText, setSearchText] = useState("");
  const [rootLoading, setRootLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [toAppColor, setToAppColor] = useState(false);
  const lightBackground = "white";
  const darkBackground = "#121212";
  const lightColor = "white";
  const darkColor = "black";

  const getUserData = () => {
    return usersData;
  };

  const addUserToData = (userData: User) => {
    setUsersData([...usersData, userData]);
  };

  const removeUserFromData = (email: string) => {
    setUsersData((prevUsersData) =>
      prevUsersData.filter((user) => user.email !== email)
    );
  };

  const findUserByEmail = (email: string) => {
    return usersData.find((user) => user.email === email);
  };

  const updateUserByEmail = (email: string, updatedUserData: Partial<User>) => {
    setUsersData((prevUsersData) => {
      return prevUsersData.map((user) =>
        user.email === email ? { ...user, ...updatedUserData } : user
      );
    });
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const toggleAppColor = () => {
    setToAppColor((prev) => !prev);
  };

  const appStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerBack: {
      backgroundColor: theme === "dark" ? "#1C1C1C" : "#D5F2F9",
    },
    background: {
      backgroundColor: toAppColor
        ? "#8EDFEB"
        : theme === "dark"
        ? darkBackground
        : lightBackground,
    },
    inverseBackground: {
      backgroundColor: theme === "light" ? darkBackground : lightBackground,
    },
    colorBackground: {
      backgroundColor: "#5063BF",
    },
    text: {
      color: theme === "dark" ? lightColor : darkColor,
    },
    inverseText: {
      color: theme === "light" ? lightColor : darkColor,
    },
    colorText: {
      color: "#5063BF",
    },
    top: {
      paddingTop: Platform.OS === "ios" ? 35 : 25,
    },
  });
  const [conn, setConn] = useState("");

  useState(() => {
    if (rootLoading) {
      setTimeout(() => {
        setConn("Connection Unstable. Please be Patient!");
      }, 3000);
    }
  });

  return (
    <StyleContext.Provider
      value={{ appStyles, theme, toggleTheme, toggleAppColor }}
    >
      <UserContext.Provider
        value={{
          usersData,
          searchText,
          setSearchText,
          addUserToData,
          removeUserFromData,
          findUserByEmail,
          updateUserByEmail,
          getUserData,
          setRootLoading,
        }}
      >
        {rootLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backgroundColor: "rgba(200, 200, 200, 0.3)",
            }}
          >
            <View
              style={{
                backgroundColor: darkColor,
                padding: 15,
                borderRadius: 15,
              }}
            >
              <ActivityIndicator size="large" color={lightColor} />
              <Text style={{ color: lightColor, textAlign: "center" }}>
                Loading Data..
              </Text>
              {conn && (
                <Text
                  style={{
                    color: lightColor,
                    textAlign: "center",
                    maxWidth: 150,
                    fontSize: 12,
                    opacity: 0.8,
                  }}
                >
                  {conn}
                </Text>
              )}
            </View>
          </View>
        )}
        {children}
      </UserContext.Provider>
    </StyleContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useStyle() {
  return useContext(StyleContext);
}
