import React, { useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import WebView from "react-native-webview";

interface CallingScreenProps {
  userToken: any;
  navigation: any;
  route: any;
  handleTime: (startTime: number, duration: number, id: string) => void;
}

export default function CallingScreen({
  userToken,
  navigation,
  route,
  handleTime,
}: CallingScreenProps) {
  const { id } = route.params || {};
  const [channelName, setChannelName] = useState("");
  const [url, setUrl] = useState("https://192.168.100.26");
  const [handleSwitch, setHandleSwitch] = useState(false);
  const platform = Platform.OS;
  let startTime: number | null = null;

  useEffect(() => {
    console.log(id);
    setUrl(`${url}/via/${id}`);
    setChannelName(id);
    setHandleSwitch(true);
  }, [id]);

  const handleNavigationStateChange = (navState: any) => {
    if (handleSwitch) {
      const currentUrl = navState.url;

      if (currentUrl.startsWith("https://192.168.100.26/via/")) {
        if (startTime == null) startTime = new Date().getTime();
        console.log(startTime);
        console.log(currentUrl);
      } else {
        if (startTime !== null) {
          const endTime = new Date().getTime();
          const duration = endTime - startTime;
          handleTime(startTime, duration, id);
          startTime = null;
        }
        navigation.goBack();
      }
    }
  };

  const injectedJavaScript = `
    (function() {
      const originalLog = console.log;
      console.log = function(...messages) {
        const fullMessage = messages.map(msg => (typeof msg === 'object' ? JSON.stringify(msg) : msg)).join(' ');
        window.ReactNativeWebView.postMessage(fullMessage);
        originalLog(...messages);
      };
    })();
  `;

  const handleMessage = (event: any) => {
    const logMessage = event.nativeEvent.data;
    console.log("WebView console log:", logMessage);
  };

  const handleIframeMessage = (event: any) => {
    console.log("Message received:", event); // Add console log to debug

    if (event.origin !== "https://192.168.100.26") {
      return;
    }

    const { url: currentUrl } = event.data;

    console.log("Current URL:", currentUrl); // Add console log to debug

    if (currentUrl.startsWith("https://192.168.100.26/via/")) {
      if (startTime == null) startTime = new Date().getTime();
      console.log(startTime);
      console.log(currentUrl);
    } else if (currentUrl === "https://192.168.100.26/") {
      if (startTime !== null) {
        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        handleTime(startTime, duration, id);
        startTime = null;
      }
      navigation.navigate("Home"); // Adjust this to navigate to your home screen
    }
  };

  useEffect(() => {
    if (platform === "web") {
      window.addEventListener("message", handleIframeMessage);
      return () => {
        window.removeEventListener("message", handleIframeMessage);
      };
    }
  }, []);

  return (
    <View style={styles.container}>
      {handleSwitch && platform !== "web" && (
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          javaScriptEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          injectedJavaScript={injectedJavaScript}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          javaScriptCanOpenWindowsAutomatically={true}
          onReceivedSslError={(event: any) => {
            console.warn("SSL Error: ", event.nativeEvent);
            event.preventDefault();
            event.nativeEvent.handler.proceed();
          }}
        />
      )}
      {handleSwitch && platform === "web" && (
        <iframe
          src={url}
          style={{ flex: 1, width: "100%", height: "100%", border: "none" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  webview: {
    flex: 1,
  },
});

// import React, { useEffect, useState } from "react";
// import { StyleSheet, View, Platform } from "react-native";
// import WebView from "react-native-webview";

// interface CallingScreenProps {
//   userToken: any;
//   navigation: any;
//   route: any;
//   handleTime: (startTime: number, duration: number) => void;
// }

// export default function CallingScreen({
//   userToken,
//   navigation,
//   route,
//   handleTime,
// }: CallingScreenProps) {
//   const { id } = route.params || {};
//   const [channelName, setChannelName] = useState("");
//   const [url, setUrl] = useState("https://192.168.100.26");
//   const [handleSwitch, setHandleSwitch] = useState(false);
//   const platform = Platform.OS;
//   let startTime: number | null = null;

//   useEffect(() => {
//     console.log(id);
//     setUrl(`${url}/via/${id}`);
//     setChannelName(id);
//     setHandleSwitch(true);
//   }, [id]);

//   const handleNavigationStateChange = (navState: any) => {
//     if (handleSwitch) {
//       const currentUrl = navState.url;

//       if (currentUrl.startsWith("https://192.168.100.26/via/")) {
//         if (startTime == null) startTime = new Date().getTime();
//         console.log(startTime);
//         console.log(currentUrl);
//       } else {
//         if (startTime !== null) {
//           const endTime = new Date().getTime();
//           const duration = endTime - startTime;
//           handleTime(startTime, duration);
//           startTime = null;
//         }
//         navigation.goBack();
//       }
//     }
//   };

//   const injectedJavaScript = `
//     (function() {
//       const originalLog = console.log;
//       console.log = function(...messages) {
//         const fullMessage = messages.map(msg => (typeof msg === 'object' ? JSON.stringify(msg) : msg)).join(' ');
//         window.ReactNativeWebView.postMessage(fullMessage);
//         originalLog(...messages);
//       };
//     })();
//   `;

//   const handleMessage = (event: any) => {
//     const logMessage = event.nativeEvent.data;
//     console.log("WebView console log:", logMessage);
//   };

//   return (
//     <View style={styles.container}>
//       {handleSwitch && platform !== "web" && (
//         <WebView
//           source={{ uri: url }}
//           style={styles.webview}
//           javaScriptEnabled={true}
//           mediaPlaybackRequiresUserAction={false}
//           allowsInlineMediaPlayback={true}
//           injectedJavaScript={injectedJavaScript}
//           onNavigationStateChange={handleNavigationStateChange}
//           onMessage={handleMessage}
//           javaScriptCanOpenWindowsAutomatically={true}
//           onReceivedSslError={(event: any) => {
//             console.warn("SSL Error: ", event.nativeEvent);
//             event.preventDefault();
//             event.nativeEvent.handler.proceed();
//           }}
//         />
//       )}
//       {handleSwitch && platform === "web" && (
//         <iframe
//           src={url}
//           style={{ flex: 1, width: "100%", height: "100%", border: "none" }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webview: {
//     flex: 1,
//   },
// });
