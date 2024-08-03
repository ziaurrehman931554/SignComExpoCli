/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {StatusBar} from 'react-native';
import {useStyle, useUser} from '../AppContext';

import {FIREBASE_AUTH, USES_REF} from '../FirebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {addDoc} from 'firebase/firestore';

interface LoginProps {
  onLogin: (email: string) => void;
  reset: () => void;
}

export default function Login({onLogin, reset}: LoginProps): JSX.Element {
  const {appStyles, theme} = useStyle();
  const {getUserData, addUserToData} = useUser();
  const users = getUserData();

  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    type: '',
    profile: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('login');
  const auth = FIREBASE_AUTH;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Update state when keyboard is shown
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Update state when keyboard is hidden
      },
    );

    // Cleanup listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleAuthentication = () => {
    setLoading(true);
    if (status === 'login') {
      handleLogin();
    } else {
      handleSignup();
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (user.email === '' || user.password === '') {
      showAlert('Error', 'Please fill all the fields');
      return;
    }
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password,
      );
    } catch (error: any) {
      showAlert('Error', displayErrorShort(error));
      return;
    }
    onLogin(user.email);
  };

  const displayErrorShort = (error: any) => {
    const errorMessage = error.message.match(/auth\/([^).]+)/);
    const rawMessage = errorMessage
      ? errorMessage[1]
      : 'Unknown error occurred';
    const displayMessage = rawMessage.replace(/[-_]/g, ' ');
    return displayMessage;
  };

  const handleSignup = () => {
    if (user.password !== user.confirmPassword) {
      showAlert('Error', 'Passwords do not match');
      return;
    }
    if (
      user.name === '' ||
      user.email === '' ||
      user.password === '' ||
      user.confirmPassword === '' ||
      user.type === ''
    ) {
      showAlert('Error', 'Please fill all the fields');
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
      setting: [], // Fix: Change 'setting' to an empty array
    };
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password,
      );
      const doc = await addDoc(USES_REF, {
        name: user.name,
        email: response.user.email,
        uid: response.user.uid,
        type: user.type,
      });
      showAlert('Signed up with ', response.user.email);
    } catch (error: any) {
      showAlert('error', displayErrorShort(error));
      return;
    }
    addUserToData(newUser);
    onLogin(user.email);
  };

  const showAlert = (title: string, message: any) => {
    Alert.alert(title, message, [{text: 'OK'}]);
  };

  return (
    <View style={[styles.container, appStyles.background]}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.bodyContainer}>
        <TouchableOpacity onPress={reset}>
          <Text style={[styles.title, appStyles.text]}>
            {status === 'login' ? 'Log in' : 'Sign up'}
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
            onChangeText={text => setUser({...user, email: text})}
            style={[styles.input, appStyles.text]}
            placeholderTextColor={appStyles.text}
          />
          <Text>✅</Text>
        </View>
        <View style={styles.line} />
        <Text style={[styles.textTitle, appStyles.colorText]}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={user.password}
            autoCapitalize="none"
            onChangeText={text => setUser({...user, password: text})}
            style={[styles.input, appStyles.text]}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? '🔴' : '🟢'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        {status === 'signup' && (
          <>
            <Text style={[styles.textTitle, appStyles.colorText]}>Name</Text>
            <View style={styles.nameContainer}>
              <TextInput
                style={[styles.input, appStyles.text]}
                placeholderTextColor={appStyles.text}
                placeholder="Name"
                value={user.name}
                onChangeText={text => setUser({...user, name: text})}
              />
              <Text>✅</Text>
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
                onChangeText={text => setUser({...user, confirmPassword: text})}
                style={[styles.input, appStyles.text]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text>{showPassword ? '🔴' : '🟢'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <Text style={[styles.textTitle, appStyles.colorText]}>
              Type{' '}
              <Text style={[styles.currentTypeContainer, appStyles.text]}>
                {' '}
                Currently: {user.type}
              </Text>
            </Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.type, appStyles.colorBackground]}
                onPress={() => setUser({...user, type: 'Normal'})}>
                <Text style={[styles.typeText, appStyles.text]}>Normal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.type, appStyles.colorBackground]}
                onPress={() => setUser({...user, type: 'Specially-abled'})}>
                <Text style={[styles.typeText, appStyles.text]}>
                  Specially-abled
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {!isKeyboardVisible && (
        <View style={styles.btnContainerC}>
          <TouchableOpacity
            onPress={handleAuthentication}
            style={[styles.btnContainer, appStyles.colorBackground]}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={[styles.btn, appStyles.text]}>
                {status === 'login' ? 'Login' : 'Signup'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      {!isKeyboardVisible && (
        <View style={styles.accountContainer}>
          <Text style={styles.accText}>
            {status === 'login' ? (
              <Text>
                Don't have an account?{' '}
                <TouchableOpacity
                  onPress={() => {
                    setStatus('signup');
                  }}>
                  <Text style={styles.accBtn}>Signup</Text>
                </TouchableOpacity>
              </Text>
            ) : (
              <Text>
                Already have an account?{' '}
                <TouchableOpacity onPress={() => setStatus('login')}>
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
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 70,
    width: 80,
  },
  bodyContainer: {
    height: '70%',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 15,
    maxHeight: '70%',
  },
  btnContainerC: {
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    width: 170,
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 45,
    paddingVertical: 15,
    color: 'white',
  },
  btn: {
    fontSize: 20,
  },
  accountContainer: {
    height: '10%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  currentTypeContainer: {
    fontSize: 10,
    opacity: 0.5,
    textAlign: 'right',
    width: '100%',
  },
  accText: {
    color: '#878787',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accBtn: {
    color: '#5063BF',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 42,
    paddingVertical: 15,
  },
  textTitle: {
    fontSize: 13,
    paddingVertical: 15,
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    width: '90%',
    padding: 5,
  },
  line: {
    width: '95%',
    alignSelf: 'center',
    margin: 5,
    height: 1,
    backgroundColor: '#878787',
  },
  typeContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  type: {
    alignItems: 'center',
    width: '50%',
    padding: 15,
    borderWidth: 2,
    borderColor: 'black',
  },
  typeText: {
    fontSize: 18,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
