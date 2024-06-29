import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Colors from '../../Utilities/Colors';
import Fonts from '../../Utilities/Fonts';
import database from '@react-native-firebase/database';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import messaging from '@react-native-firebase/messaging';

import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {Screen} from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminLogin = ({navigation}) => {
  const [Restaurantname, setRestaurantName] = useState(false);
  const [AccessToken, setAccessToken] = useState('');
  const [Token, setToken] = useState(false);

  const checkdatabase = async () => {
    const ref = database().ref(`RestaurantsData/${AccessToken}`);
    const snapshot = await ref.once('value');
    if (!snapshot.exists()) {
      navigation.navigate('AddDishes');
    }
  };

  useEffect(() => {
    const requestToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setToken(token);
      } catch (error) {
        console.error('Permission Error:', error);
      }
    };
    requestToken();
  }, []);

  const AdminFcmToken = async token => {
    // const ref = database().ref(`Admindashboard/FcmToken/`);
    // const snapshot = await ref.once('value');
    // const data = snapshot.val();
    try {
      const ref = firebase
        .database()
        .ref(`Admindashboard/FcmToken/${AccessToken}`);
      console.log(ref);

      // Check if data already exists
      ref.on('value', async snapshot => {
        console.log(snapshot);
        if (!snapshot.exists()) {
          // Data does not exist, so set it
          await ref.set(token);
          //  ToastAndroid.show('Added Success', ToastAndroid.SHORT);
        } else {
          // Data already exists
          console.log(`Data already exists for userid: ${AccessToken}`);
          // ToastAndroid.show('Token existed', ToastAndroid.SHORT);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const Adminlogin = async () => {
    try {
      if (AccessToken != '000000') {
        const ref = database().ref(`Admindashboard/AccessToken/${AccessToken}`);
        console.log(ref);
        const snapshot = await ref.once('value');
        const data = snapshot.val();

        if (data) {
          const token = await messaging().getToken();
          AdminFcmToken(token);

          await AsyncStorage.setItem(
            'AdminUser',
            JSON.stringify({AccessToken}),
          );
          console.log('success');
          const destination = 'SubAdminDashboard';
          navigation.navigate(destination, {
            Resname: Restaurantname,
            AccessToken,
          });
          console.log('login successful');
        }
      }
      if (AccessToken === '000000') {
        navigation.navigate('AdminDashboard');
        console.log('fail to login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    //Adminlogin();
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={{justifyContent: 'center', margin: 20, flex: 1}}>
        {/* <Text style={{marginTop:0}}>Restaurant name</Text>
            <TextInput
              style={{height:50,borderWidth:1,padding:10,borderRadius:10,marginTop:10}}
              onChangeText={(text)=>setRestaurantName(text)}
              value={Restaurantname}
            /> */}
        <Text style={{marginTop: 20}}>Access Token</Text>
        <TextInput
          style={{
            height: 50,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
          }}
          maxLength={6}
          onChangeText={text => setAccessToken(text)}
          value={AccessToken}
        />
        <TouchableOpacity
          onPress={Adminlogin}
          style={{
            height: 50,
            borderWidth: 0,
            marginTop: 40,
            borderRadius: 10,
            backgroundColor: Colors.orange,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 15, color: 'white', fontFamily: Fonts.Bold}}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default AdminLogin;
