import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
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
import { useStyle, useUser } from "../AppContext";

interface HistoryScreenProps {
  userToken: any;
  navigation: any;
}

export default function HistoryScreen({
  userToken,
  navigation,
}: HistoryScreenProps) {
  const { appStyles } = useStyle();
  const { updateUserByEmail } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const knownFormats = [
    "M/d/yyyy, h:mm:ss a", // Example format for "8/3/2024, 11:52:17 AM"
    "yyyy-MM-ddTHH:mm:ssZ", // ISO format
  ];

  const formatDate = (dateString: string) => {
    console.log("-------------------called for: ", dateString);
    let date;

    // Try to parse the dateString with known formats
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

    if (isValid(date)) console.log("---------------format valid");
    else console.log("------------------------format invalid");

    // Check if date is valid
    if (date && isValid(date)) {
      if (isToday(date)) {
        console.log("------------------returning today");
        return `Today at ${format(date, "h:mm a")}`;
      }

      if (isYesterday(date)) {
        console.log("------------------returning yesterday");
        return `Yesterday at ${format(date, "h:mm a")}`;
      }

      if (isThisWeek(date)) {
        console.log("------------------returning this week");
        return format(date, "EEEE"); // Weekday name
      }

      console.log("------------------returning default");
      return format(date, "M/d/yyyy, h:mm a"); // Default format
    }

    // Return the original string if it's not a valid date
    console.log("------------------returning original");
    return dateString;
  };

  const renderRecent = () => {
    const deleteRecent = (name: string) => {
      const updatedRecent = userToken.recent.filter(
        (item: any) => item.Name !== name
      );
      updateUserByEmail(userToken.email, { recent: updatedRecent });
    };
    return (
      <>
        <TouchableOpacity
          onPress={() => setIsEditing((prev) => !prev)}
          style={{
            width: "100%",
            alignItems: "flex-end",
            paddingHorizontal: 15,
          }}
        >
          {isEditing ? <Text>Done</Text> : <Text>Edit</Text>}
        </TouchableOpacity>
        {userToken.recent.map((item: any) => (
          <TouchableOpacity
            style={[styles.recentContainer, appStyles.containerBack]}
            key={item.Name}
            onPress={() => {
              !isEditing && navigation.navigate("Call", { user: item });
            }}
          >
            {isEditing && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRecent(item.Name)}
              >
                <Text style={styles.deleteText}>X</Text>
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
      style={[appStyles.container, appStyles.top]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <View style={[styles.backContainer, appStyles.colorBackground]}>
            <Text>🔙</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerText, appStyles.text]}>History</Text>
      </View>
      {userToken.recent.length > 0 ? (
        <ScrollView style={styles.bodyContainer}>{renderRecent()}</ScrollView>
      ) : (
        <View style={styles.noRecent}>
          <Text style={[appStyles.text]}>No Recent Calls</Text>
          <TouchableOpacity
            style={styles.guide}
            onPress={() => navigation.navigate("Call")}
          >
            <Text style={[appStyles.text, { alignSelf: "center" }]}>
              Click here to make a new call
            </Text>
            <Text style={[appStyles.text, styles.rotate]}>^</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
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
    color: "white",
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
  bodyContainer: {
    margin: 10,
    height: "100%",
  },
  recentContainer: {
    flexDirection: "row",
    margin: 10,
    padding: 5,
    borderRadius: 20,
    shadowColor: "black",
    alignItems: "center",
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
  recent_profileImage: {
    width: "100%",
    height: "100%",
  },
  recent_data: {
    flex: 4,
    padding: 5,
  },
  recent_data_name: {
    fontSize: 18,
  },
  recent_data_time: {
    fontSize: 10,
    color: "#1E1E1E",
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
    borderWidth: 0.5,
    backgroundColor: "#D9D9D9",
    marginRight: 3,
  },
  recent_info_text: {
    fontSize: 15,
  },
  noRecent: {
    width: "100%",
    height: "82%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  guide: {
    position: "absolute",
    bottom: 3,
    fontSize: 14,
    color: "#1E1E1E",
    opacity: 0.7,
    width: "100%",
    alignItems: "flex-start",
    gap: -10,
  },
  rotate: {
    bottom: 0,
    fontSize: 35,
    left: "35%",
    transform: [{ rotate: "180deg" }],
  },
});
