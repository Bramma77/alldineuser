import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Colors from '../../Utilities/Colors';
import Fonts from '../../Utilities/Fonts';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import Storage from '@react-native-firebase/storage';
import Auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const Token = ({navigation}) => {
  const [AccessToken, setAccessToken] = useState('');
  const [Restaurantname, setRestaurantName] = useState('');

  const AdminResname = () => {
    const ref = database().ref(`Admindashboard/AccessToken/${AccessToken}`);
    ref.set(Restaurantname);
    ToastAndroid.show('Added Success', ToastAndroid.SHORT);
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Added Success', 'Restaurant created success', [
      {
        text: 'OK',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);

  const storeUserToken = async () => {
    try {
      const ref = firebase
        .database()
        .ref(`Admindashboard/AccessToken/${AccessToken}`);
      console.log(ref);

      // Check if data already exists
      ref.on('value', async snapshot => {
        console.log(snapshot);
        if (snapshot.exists()) {
          // Data does not exist, so set it
          console.log(`Data already exists for userid: ${AccessToken}`);
          ToastAndroid.show('Token existed', ToastAndroid.SHORT);
        } else {
          // Data already exists
          await ref.set(Restaurantname);
          // Alert.alert('Added Success');
          createTwoButtonAlert();
          ToastAndroid.show('Added Success', ToastAndroid.SHORT);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <LottieView
          style={{
            width: responsiveWidth(100),
            height: 370,
            alignSelf: 'center',
          }}
          source={require('../../Assets/Animations/res.json')}
          autoPlay
          loop
        />
        <Text
          style={{
            marginLeft: 20,
            fontFamily: Fonts.SemiBold,
            color: 'black',
            marginTop: 20,
          }}>
          Enter the Restaurant Name
        </Text>
        <TextInput
          style={{
            height: 50,
            borderWidth: 1,
            borderRadius: 10,
            marginHorizontal: 20,
            marginBottom: 20,
            paddingLeft: 20,
            color: 'black',
            fontFamily: Fonts.SemiBold,
          }}
          onChangeText={text => setRestaurantName(text)}
          value={Restaurantname}
        />
        <Text
          style={{marginLeft: 20, fontFamily: Fonts.SemiBold, color: 'black'}}>
          Enter the Access Token
        </Text>
        <TextInput
          keyboardType="numeric"
          maxLength={6}
          onChangeText={text => setAccessToken(text)}
          value={AccessToken}
          style={{
            height: 50,
            borderWidth: 1,
            borderRadius: 10,
            marginHorizontal: 20,
            marginBottom: 20,
            paddingLeft: 20,
            color: 'black',
            fontFamily: Fonts.SemiBold,
          }}
        />

        <TouchableOpacity
          onPress={storeUserToken}
          style={{
            height: 50,
            width: 120,
            borderWidth: 0,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: Colors.orange,
          }}>
          <Text style={{fontFamily: Fonts.Bold, color: 'white', fontSize: 20}}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
export default Token;
