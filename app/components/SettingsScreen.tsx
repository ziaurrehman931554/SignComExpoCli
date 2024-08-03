import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigationState} from '@react-navigation/native';
import {useStyle, useUser} from '../AppContext';

interface SettingsScreenProps {
  userToken: any;
  navigation: any;
}

export default function SettingsScreen({
  userToken,
  navigation,
}: SettingsScreenProps) {
  const {updateUserByEmail} = useUser();
  const {appStyles, theme} = useStyle();
  const navigationState = useNavigationState(state => state);
  const [isKBActive, setIsKBActive] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [selectType, setSelectType] = useState(false);
  const [selectedType, setSelectedType] = useState(userToken.type);

  const [user, setUser] = useState({
    Name: userToken.name,
    email: userToken.email,
    password: userToken.password,
    type: userToken.type,
  });

  const showAlert = (title: string, message: any) => {
    Alert.alert(title, message, [{text: 'OK'}]);
  };

  const togglePasswordVisibility = () => {
    setHidePass(prev => !prev);
  };

  const handleInputChange = (fieldName: any, value: any) => {
    setUser(prevUser => ({
      ...prevUser,
      [fieldName]: value,
    }));
  };

  const handleSave = () => {
    updateUserByEmail(userToken.email, user);
    showAlert('Important', 'Changed Saved');
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 12,
      paddingVertical: 12,
      paddingHorizontal: 10,
      color: '#909BB1',
      alignItems: 'center',
      borderRadius: 4,
      textAlign: 'right',
    },
    inputAndroid: {
      fontSize: 12,
      paddingVertical: 12,
      paddingHorizontal: 10,
      color: '#909BB1',
      alignItems: 'center',
      borderRadius: 4,
      textAlign: 'right',
    },
  };

  return (
    <View style={[styles.container, appStyles.background, appStyles.top]}>
      {selectType && (
        <View style={[styles.selectContainer]}>
          <Text
            style={[appStyles.text, styles.item, {backgroundColor: 'grey'}]}>
            Current: <Text style={appStyles.colorText}>{user.type}</Text>
          </Text>
          <TouchableOpacity
            style={[appStyles.containerBack, styles.item]}
            onPress={() => {
              handleInputChange('type', 'Normal');
              setSelectType(false);
            }}>
            <Text style={[appStyles.text]}>Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[appStyles.containerBack, styles.item]}
            onPress={() => {
              handleInputChange('type', 'Special');
              setSelectType(false);
            }}>
            <Text style={[appStyles.text]}>Specially-abled</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={[styles.backBTNContainer, appStyles.colorBackground]}>
            <Text>🔙</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerText, appStyles.text]}>Settings</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.infoContainer}>
          <Text style={[styles.YPI, appStyles.colorText]}>
            Your Profile Information
          </Text>
          <View style={styles.profileImageContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/Profile.png')}
                style={styles.image}
              />
            </View>
            <View
              style={[
                styles.editContainer,
                theme === 'dark'
                  ? {backgroundColor: '#D9D9D9'}
                  : appStyles.colorBackground,
              ]}>
              <Image
                source={require('../assets/edit.png')}
                style={styles.edit}
              />
            </View>
          </View>
          <Text style={[styles.PI, appStyles.colorText]}>
            Personal Information
          </Text>
          <View style={[styles.entityContainer, appStyles.containerBack]}>
            <Text style={[styles.entityName, appStyles.colorText]}>Name</Text>
            <TextInput
              style={[styles.entityValue, appStyles.text]}
              placeholderTextColor={appStyles.text}
              placeholder="Enter Your name"
              value={user.Name}
              onChangeText={text =>
                handleInputChange('Name', text)
              }></TextInput>
          </View>
          <View style={[styles.entityContainer, appStyles.containerBack]}>
            <Text style={[styles.entityName, appStyles.colorText]}>Email</Text>
            <TextInput
              style={styles.entityValue}
              placeholderTextColor={appStyles.text.color}
              placeholder="Enter Your email"
              value={user.email}
              onChangeText={text =>
                handleInputChange('email', text)
              }></TextInput>
          </View>
          <View style={[styles.entityContainer, appStyles.containerBack]}>
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Text style={[styles.entityName, appStyles.colorText]}>
                Password
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.entityValue, appStyles.text]}
              placeholderTextColor={appStyles.text}
              placeholder="Enter Your password"
              secureTextEntry={hidePass}
              value={user.password}
              onChangeText={text =>
                handleInputChange('password', text)
              }></TextInput>
          </View>
          <View style={[styles.entityContainer, appStyles.containerBack]}>
            <Text style={[styles.entityName, appStyles.colorText]}>Type</Text>
            <TouchableOpacity onPress={() => setSelectType(true)}>
              <Text style={[styles.entityValue, appStyles.text]}>
                {user.type}
              </Text>
            </TouchableOpacity>
            {/* {Platform.OS === 'ios' && ( */}
            {/* <RNPickerSelect
              value={user.type}
              items={[
                {label: 'Normal', value: 'normal'},
                {label: 'Special', value: 'special'},
              ]}
              onValueChange={value => handleInputChange('type', value)}
              style={pickerSelectStyles}
            /> */}
            {/* )} */}
          </View>
        </View>
        {!isKBActive && (
          <TouchableOpacity
            style={[styles.saveContainer, appStyles.colorBackground]}
            onPress={handleSave}>
            <Text style={[styles.save, appStyles.text]}>Save</Text>
          </TouchableOpacity>
        )}
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
  backBTNContainer: {
    width: 70,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginLeft: 10,
  },
  headerText: {
    position: 'absolute',
    left: 0,
    width: '105%',
    textAlign: 'center',
    fontSize: 20,
    alignSelf: 'center',
    opacity: 0.4,
    zIndex: -1,
  },
  bodyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  YPI: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginVertical: 15,
    opacity: 0.7,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 170,
    height: 170,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    padding: 5,
    backgroundColor: '#D9D9D9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  edit: {
    width: 20,
    height: 20,
  },
  PI: {
    fontSize: 17,
    marginBottom: 10,
    lineHeight: 22,
    textAlign: 'left',
    width: '95%',
    padding: 10,
    marginTop: 30,
    opacity: 0.7,
  },
  entityContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    margin: 5,
    backgroundColor: '#F4F4F4',
    padding: 15,
    borderRadius: 10,
    height: 50,
  },
  entityName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  entityValue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    fontSize: 12,
    textAlign: 'right',
    width: 200,
    opacity: 0.7,
  },
  saveContainer: {
    height: 60,
    width: 175,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  save: {
    fontSize: 17,
  },
  selectContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
