import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Semana from '../../../components/Semana';
import Header from '../../../components/Header';

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await AsyncStorage.getItem('user');
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
    }
    fetchUser();
  }, []);

  if (!user) {
    return (
      <ScrollView>
        <Header />
        <View style={styles.container}>
          <Text>Carregando perfil...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <Header profilePic={user.profilePic} />
      <View style={styles.container}>

        <Semana />

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    width: '100%'
  },
  footer: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    paddingTop: 820,
  },
  borda: {
    marginLeft: '-20px',
    width: 130,
    height: 130
  },
  foto: {
    marginTop: 580
  },
  button: {
    margin: 15
  }
});
