/* eslint-disable prettier/prettier */
import React, {createContext, useContext, useState} from 'react';
import {Platform, StyleSheet} from 'react-native';

interface User {
  email: string;
  password: string;
  name: string;
  type: string;
  profile: string;
  favorites: {Name: string; profile: string}[];
  recent: {Name: string; last_call: string; profile: string}[];
  setting: any[];
}

interface UserContextData {
  usersData: User[];
  searchText: string;
  setSearchText: (newSearchText: string) => void;
  addUserToData: (userData: User) => void;
  findUserByEmail: (email: string) => User | undefined;
  updateUserByEmail: (email: string, updatedUserData: Partial<User>) => void;
  getUserData: () => User[];
}

const UserContext = createContext<UserContextData>({
  usersData: [],
  searchText: '',
  setSearchText: () => {},
  addUserToData: () => {},
  findUserByEmail: () => undefined,
  updateUserByEmail: () => {},
  getUserData: () => [],
});

interface StyleContextData {
  appStyles: any;
  theme: string;
  toggleTheme: () => void;
  toggleAppColor: () => void;
}

const StyleContext = createContext<StyleContextData>({
  appStyles: StyleSheet.create({}),
  theme: '',
  toggleTheme: () => {},
  toggleAppColor: () => {},
});

export function AppProvider({children}: {children: React.ReactNode}) {
  const [usersData, setUsersData] = useState<User[]>([
    {
      email: 'zr931554@gmail.com',
      password: '123',
      name: 'Zia ur Rehman',
      type: 'normal',
      profile: '../assets/profile.png',
      favorites: [
        {Name: 'Name A', profile: '../assets/profile.png'},
        {Name: 'Name B', profile: '../assets/profile.png'},
        {Name: 'Name C', profile: '../assets/profile.png'},
        {Name: 'Name D', profile: '../assets/profile.png'},
      ],
      recent: [
        {
          Name: 'Name',
          last_call: 'Today at 11:11',
          profile: '../assets/profile.png',
        },
        {
          Name: 'Name B',
          last_call: 'yesterday at 9:41',
          profile: '../assets/profile.png',
        },
        {Name: 'Name C', last_call: 'Sunday', profile: '../assets/profile.png'},
        {Name: 'Name D', last_call: '1M Ago', profile: '../assets/profile.png'},
      ],
      setting: [],
    },
    {
      email: 'zia@gmail.com',
      password: '456',
      name: 'Zia',
      type: 'normal',
      profile: '../assets/profile.png',
      favorites: [
        {Name: 'Name A', profile: '../assets/profile.png'},
        {Name: 'Name B', profile: '../assets/profile.png'},
        {Name: 'Name C', profile: '../assets/profile.png'},
      ],
      recent: [
        {
          Name: 'Name',
          last_call: 'Today at 11:11',
          profile: '../assets/profile.png',
        },
        {
          Name: 'Name B',
          last_call: 'yesterday at 9:41',
          profile: '../assets/profile.png',
        },
        {Name: 'Name C', last_call: 'Sunday', profile: '../assets/profile.png'},
      ],
      setting: [],
    },
    {
      email: 'abc@gmail.com',
      password: '123',
      name: 'abc',
      type: 'special',
      profile: '../assets/profile.png',
      favorites: [
        {Name: 'Name A', profile: '../assets/profile.png'},
        {Name: 'Name B', profile: '../assets/profile.png'},
        {Name: 'Name C', profile: '../assets/profile.png'},
      ],
      recent: [
        {
          Name: 'Name',
          last_call: 'Today at 11:11',
          profile: '../assets/profile.png',
        },
        {
          Name: 'Name B',
          last_call: 'yesterday at 9:41',
          profile: '../assets/profile.png',
        },
        {Name: 'Name C', last_call: 'Sunday', profile: '../assets/profile.png'},
      ],
      setting: [],
    },
    {
      email: 'a',
      password: '1',
      name: 'a',
      type: 'special',
      profile: '../assets/profile.png',
      favorites: [
        {Name: 'Name A', profile: '../assets/profile.png'},
        {Name: 'Name B', profile: '../assets/profile.png'},
        {Name: 'Name C', profile: '../assets/profile.png'},
      ],
      recent: [
        {
          Name: 'Name',
          last_call: 'Today at 11:11',
          profile: '../assets/profile.png',
        },
        {
          Name: 'Name B',
          last_call: 'yesterday at 9:41',
          profile: '../assets/profile.png',
        },
        {Name: 'Name C', last_call: 'Sunday', profile: '../assets/profile.png'},
      ],
      setting: [],
    },
    {
      email: 'ushnashiekh454@gmail.com',
      password: 'ushna123',
      name: 'Ushna Shehzad',
      type: 'normal',
      profile: '../assets/profile.png',
      favorites: [
        {Name: 'Name A', profile: '../assets/profile.png'},
        {Name: 'Name B', profile: '../assets/profile.png'},
        {Name: 'Name C', profile: '../assets/profile.png'},
      ],
      recent: [
        {
          Name: 'Name',
          last_call: 'Today at 11:11',
          profile: '../assets/profile.png',
        },
        {
          Name: 'Name B',
          last_call: 'yesterday at 9:41',
          profile: '../assets/profile.png',
        },
        {Name: 'Name C', last_call: 'Sunday', profile: '../assets/profile.png'},
      ],
      setting: [],
    },
    {
      email: 'manahil45@gmail.com',
      password: 'manahil123',
      name: 'Manahil Shahdab',
      type: 'normal',
      profile: '../assets/profile.png',
      favorites: [
        {Name: 'Name A', profile: '../assets/profile.png'},
        {Name: 'Name B', profile: '../assets/profile.png'},
        {Name: 'Name C', profile: '../assets/profile.png'},
      ],
      recent: [
        {
          Name: 'Name',
          last_call: 'Today at 11:11',
          profile: '../assets/profile.png',
        },
        {
          Name: 'Name B',
          last_call: 'yesterday at 9:41',
          profile: '../assets/profile.png',
        },
        {Name: 'Name C', last_call: 'Sunday', profile: '../assets/profile.png'},
      ],
      setting: [],
    },
  ]);
  const [searchText, setSearchText] = useState('');
  const [theme, setTheme] = useState('light');
  const [toAppColor, setToAppColor] = useState(false);
  const lightBackground = 'white';
  const darkBackground = '#121212';
  const lightColor = 'white';
  const darkColor = 'black';

  const getUserData = () => {
    return usersData;
  };

  const addUserToData = (userData: User) => {
    setUsersData([...usersData, userData]);
  };

  const findUserByEmail = (email: string) => {
    return usersData.find(user => user.email === email);
  };

  const updateUserByEmail = (email: string, updatedUserData: Partial<User>) => {
    setUsersData(prevUsersData => {
      return prevUsersData.map(user =>
        user.email === email ? {...user, ...updatedUserData} : user,
      );
    });
  };

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const toggleAppColor = () => {
    setToAppColor(prev => !prev);
  };

  const appStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerBack: {
      backgroundColor: theme === 'dark' ? '#1C1C1C' : '#D5F2F9',
    },
    background: {
      backgroundColor: toAppColor
        ? '#8EDFEB'
        : theme === 'dark'
        ? darkBackground
        : lightBackground,
    },
    inverseBackground: {
      backgroundColor: theme === 'light' ? darkBackground : lightBackground,
    },
    colorBackground: {
      backgroundColor: '#5063BF',
    },
    text: {
      color: theme === 'dark' ? lightColor : darkColor,
    },
    inverseText: {
      color: theme === 'light' ? lightColor : darkColor,
    },
    colorText: {
      color: '#5063BF',
    },
    top: {
      paddingTop: Platform.OS === 'ios' ? 35 : 25,
    },
  });

  return (
    <StyleContext.Provider
      value={{appStyles, theme, toggleTheme, toggleAppColor}}>
      <UserContext.Provider
        value={{
          usersData,
          searchText,
          setSearchText,
          addUserToData,
          findUserByEmail,
          updateUserByEmail,
          getUserData,
        }}>
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
