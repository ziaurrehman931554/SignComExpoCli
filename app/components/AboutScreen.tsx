import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { useStyle } from '../AppContext';

interface AboutScreenProps {
  navigation: any;
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
    const aboutDescription = "SIGNCOM is a real-time vision-based application that enables seamless video communication between individuals who use sign language and those who communicate through spoken language, by leveraging advanced hand sign recognition and translation technologies in real-time. This will enable everyone to interact with each other over the internet and to converse with each other through video calling, regardless of their disabilities.";
    const { appStyles, theme } = useStyle();

  return (
    <View style={[styles.container, appStyles.background, appStyles.top]}>
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={[styles.backContainer, appStyles.colorBackground]}>
                    <Text>🔙</Text>
                </View>
            </TouchableOpacity>
            <Text style={[styles.headerText, appStyles.text]}>About</Text>
        </View>
        <View style={styles.aboutContainer}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
            </View>
            <ScrollView style={styles.textContainer}>
                <Text style={styles.text}>{aboutDescription}</Text>
            </ScrollView>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    backContainer: {
        width: 70,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginLeft: 10,
    },
    header: {
        paddingLeft: 30,
    },
    headerText: {
        position: 'absolute',
        left: 0,
        width: '105%',
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center',
        zIndex: -1
    },
    aboutContainer: {
        borderWidth: 1,
        margin: 25,
        marginTop: 40,
        borderRadius: 20,
        borderColor: '#0166FF',
        padding: 15,
        height: '75%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column"
    },
    logoContainer: {
        height: '45%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: 150,
        width: 170,
        alignSelf: 'center'
    },
    textContainer: {
        flex: 1,
        height: '55%',
        borderRadius: 20,
        borderColor: '#0166FF',
        padding: 15,
        margin: 10,
        backgroundColor: '#8EDFEB',
        shadowColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    text: {
        fontSize: 15,
        textAlign: 'justify',
    },
});
