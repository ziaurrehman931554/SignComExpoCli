import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  Button,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} from "react-native";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  parseISO,
  isValid,
  parse,
} from "date-fns";
import { useUser, useStyle } from "../AppContext";

interface HomeScreenProps {
  userToken: any;
  navigation: any;
}

export default function HomeScreen({ userToken, navigation }: HomeScreenProps) {
  const { appStyles, theme } = useStyle();
  const { searchText, setSearchText, updateUserByEmail } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  // Define known date formats
  const knownFormats = ["M/d/yyyy, h:mm:ss a", "yyyy-MM-ddTHH:mm:ssZ"];

  const formatDate = (dateString: string) => {
    let date;

    for (const formatString of knownFormats) {
      try {
        date = parse(dateString, formatString, new Date());
        if (isValid(date)) {
          break;
        }
      } catch (e) {
        date = null;
      }
    }

    if (date && isValid(date)) {
      if (isToday(date)) {
        return `Today at ${format(date, "h:mm a")}`;
      }

      if (isYesterday(date)) {
        return `Yesterday at ${format(date, "h:mm a")}`;
      }

      if (isThisWeek(date)) {
        return format(date, "EEEE");
      }

      return format(date, "M/d/yyyy, h:mm a");
    }

    return dateString;
  };

  const renderFavorites = () => {
    const deleteFavorite = (name: string) => {
      const updatedFavorites = userToken.favorites.filter(
        (item: any) => item.Name !== name
      );
      updateUserByEmail(userToken.email, { favorites: updatedFavorites });
    };
    return (
      <ScrollView
        horizontal
        contentContainerStyle={styles.fav_wrapper}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {userToken.favorites.map((item: any) => (
          <TouchableOpacity
            style={[
              styles.fav_container,
              appStyles.containerBack,
              {
                borderColor: theme === "dark" ? "#979797" : "black",
                shadowColor: theme === "dark" ? "white" : "black",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5,
              },
            ]}
            key={item.Name}
            onPress={() =>
              !isEditing && navigation.navigate("Call", { user: item })
            }
          >
            {isEditing && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteFavorite(item.Name)}
              >
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            )}
            <View style={styles.fav_img}>
              <Image
                source={require("../assets/Profile.png")}
                style={styles.fav_profileImage}
              />
            </View>
            <Text style={[styles.fav_name, appStyles.text]}>{item.Name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderRecent = () => {
    const addToFavorites = (name: string) => {
      const updatedFavorites = {
        Name: name,
        profile: "../assets/profile.png",
      };
      updateUserByEmail(userToken.email, {
        favorites: [...userToken.favorites, updatedFavorites],
      });
    };
    return (
      <>
        {userToken.recent.map((item: any) => (
          <TouchableOpacity
            style={[
              styles.recent_container,
              appStyles.containerBack,
              { borderColor: theme === "dark" ? "#979797" : "black" },
            ]}
            key={item.Name}
            onPress={() =>
              !isEditing && navigation.navigate("Call", { user: item })
            }
          >
            {isEditing && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToFavorites(item.Name)}
              >
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>
            )}
            <View style={styles.recent_img}>
              <Image
                source={require("../assets/Profile.png")}
                style={styles.recent_profileImage}
              />
            </View>
            <View style={styles.recent_data}>
              <Text style={[styles.recent_data_name, appStyles.text]}>
                {item.Name}
              </Text>
              <Text style={[styles.recent_data_time, appStyles.text]}>
                {formatDate(item.last_call)}
              </Text>
            </View>
            {/* <View style={styles.recent_info}>
              <Text style={styles.recent_info_text}>❗</Text>
            </View> */}
          </TouchableOpacity>
        ))}
      </>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
    >
      <View style={[styles.headerContainer, appStyles.top]}>
        <TouchableOpacity
          style={styles.menuContainer}
          onPress={() => navigation.navigate("Drawer")}
        >
          <Image source={require("../assets/menu_b.png")} style={styles.menu} />
        </TouchableOpacity>
        <Text style={[styles.hi, appStyles.inverseText]}>Hi,</Text>
        <Text style={[styles.name, appStyles.colorText]}>{userToken.name}</Text>
        <View style={[styles.searchContainer, appStyles.containerBack]}>
          <Image
            source={require("../assets/search.png")}
            style={styles.search}
          />
          <TextInput
            placeholderTextColor={appStyles.text.color}
            placeholder="Search"
            style={[styles.input, appStyles.text]}
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
          />
        </View>
      </View>
      {!userToken.favorites &&
        !userToken.recent(
          <View
            style={[
              appStyles.container,
              {
                alignItems: "center",
                justifyContent: "center",
                marginTop: -90,
              },
            ]}
          >
            <Text style={[appStyles.text, { fontSize: 17, letterSpacing: 3 }]}>
              No Recent Calls
            </Text>
          </View>
        )}
      <ScrollView style={styles.bodyContainer}>
        {userToken.favorites.length > 0 && !searchText && (
          <View style={styles.favoritesContainer}>
            <View style={styles.heading}>
              <Text style={[styles.headingText, appStyles.text]}>
                Favorites
              </Text>
              <TouchableOpacity onPress={() => setIsEditing((prev) => !prev)}>
                {isEditing ? (
                  <Text style={[styles.headingEdit, appStyles.text]}>Done</Text>
                ) : (
                  <View>
                    <Image
                      source={require("../assets/edit_box.png")}
                      style={styles.editImg}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={[styles.renderFavContainer, appStyles.background]}>
              {renderFavorites()}
            </View>
          </View>
        )}
        {userToken.recent.length > 0 && !searchText && (
          <View style={styles.recentContainer}>
            <View style={styles.heading}>
              <Text style={[styles.headingText, appStyles.text]}>Recent</Text>
              <View style={{ flexDirection: "row", gap: 9 }}>
                {!isEditing && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("History")}
                  >
                    <View>
                      <Image
                        source={require("../assets/history_b.png")}
                        style={styles.editImg}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setIsEditing((prev) => !prev)}>
                  {isEditing ? (
                    <Text style={[styles.headingEdit, appStyles.text]}>
                      Done
                    </Text>
                  ) : (
                    <View>
                      <Image
                        source={require("../assets/edit_box.png")}
                        style={styles.editImg}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View>{renderRecent()}</View>
          </View>
        )}
        <View style={styles.addPad}></View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 250,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
  },
  menuContainer: {
    width: 30,
    height: 30,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  menu: {
    height: 40,
    width: 40,
    resizeMode: "cover",
  },
  hi: {
    fontSize: 30,
    marginTop: 10,
    paddingTop: 10,
  },
  name: {
    fontSize: 40,
    color: "#5163BF",
    marginBottom: 15,
    marginTop: Platform.OS === "ios" ? -7 : -20,
    fontWeight: "bold",
  },
  editImg: {
    height: 18,
    width: 18,
  },
  searchContainer: {
    width: "100%",
    paddingHorizontal: 15,
    borderColor: "#5163BF",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 50,
  },
  search: {
    width: "7%",
    height: "50%",
    padding: 10,
  },
  input: {
    width: "90%",
  },
  bodyContainer: {
    width: "100%",
    padding: 15,
    display: "flex",
    // alignItems: "center",
    paddingRight: -25,
  },
  favoritesContainer: {
    width: "95%",
    height: 180,
  },
  heading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 5,
  },
  headingText: {
    fontSize: 15,
  },
  headingEdit: {
    color: "white",
    textDecorationLine: "underline",
  },
  recentContainer: {
    width: "95%",
  },
  renderFavContainer: {
    flex: 1,
    borderRadius: 20,
    padding: 5,
    overflow: "hidden",
  },
  addPad: {
    width: "100%",
    height: Platform.OS === "ios" ? 120 : 107,
  },
  fav_wrapper: {
    margin: 0,
  },
  fav_container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 15,
    margin: 5,
  },
  fav_img: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 90,
    padding: 5,
    margin: 2,
    borderRadius: 150,
    overflow: "hidden",
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#D9D9D9",
  },
  fav_name: {
    padding: 0,
  },
  fav_profileImage: {
    height: "100%",
    width: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  deleteText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  addText: {
    position: "relative",
    textAlign: "center",
    alignSelf: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  recent_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    margin: 5,
    marginRight: 0,
  },
  recent_img: {
    width: 60,
    height: 60,
    overflow: "hidden",
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#D9D9D9",
  },
  recent_profileImage: {
    height: "100%",
    width: "100%",
  },
  recent_data: {
    width: 220,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  recent_data_name: {
    width: "100%",
    fontWeight: "bold",
    overflow: "hidden",
  },
  recent_data_time: {
    width: "100%",
    overflow: "hidden",
  },
  recent_info: {
    width: 30,
    height: 30,
    overflow: "hidden",
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#D9D9D9",
  },
  recent_info_text: {
    color: "black",
  },
});
