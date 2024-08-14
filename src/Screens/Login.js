import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import Colors from '../Utilities/Colors';
import Fonts from '../Utilities/Fonts';
import auth from '@react-native-firebase/auth';
import {useCart} from '../Provider/Provider';
import messaging from '@react-native-firebase/messaging';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const Login = ({navigation}) => {
  const {width, height} = Dimensions.get('window');
  const [location, selectedLocation] = useState('us');
  const [FormattedValue, setFormattedValue] = useState(false);
  const phoneInput = useRef(PhoneInput);
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [value, setValue] = useState();
  const [Token, setToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const {confirm, setConfirm} = useCart();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const requestToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setToken(token);
      } catch (error) {
        console.error('Permission Error:', error);
        setErrorMessage('Permission Error: ' + error.message);
        Alert.alert('Error', 'Permission Error: ' + error.message);
      }
    };
    requestToken();
  }, []);

  useEffect(() => {
    if (isButtonDisabled && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsButtonDisabled(false);
    }
  }, [isButtonDisabled, timer]);

  const signInWithPhoneNumber = async () => {
    if (PhoneNumber) {
      console.log(PhoneNumber);
      try {
        setIsButtonDisabled(true);
        setTimer(15); // 15 seconds timer
        const confirmation = await auth().signInWithPhoneNumber(PhoneNumber);
        console.log(confirmation);

        setConfirm(confirmation);
        navigation.navigate('OTP');
      } catch (e) {
        console.log(e);
        setErrorMessage('Error signing in with phone number: ' + e.message);
        Alert.alert(
          'Error',
          'Error signing in with phone number: ' + e.message,
        );
      }
    } else {
      Alert.alert('Error', 'Please enter phone number');
    }
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <StatusBar translucent={true} />
        <Image
          source={require('../Assets/Images/login.jpg')}
          style={{height: 300, width: 300, alignSelf: 'center'}}
        />

        <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
          <Text
            style={{
              marginTop: 0,
              textAlignVertical: 'center',
              fontSize: 24,
              color: Colors.orange,
              fontFamily: Fonts.Bold,
            }}>
            LOGIN
          </Text>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontWeight: '500',
                fontFamily: Fonts.Medium,
                fontSize: 18,
                textAlign: 'center',
                margin: 20,
                color: 'brown',
              }}>
              Add your Phone Number, we'll send an OTP to see that you're real
            </Text>
          </View>

          <PhoneInput
            textStyle={{color: 'black'}}
            style={{
              height: 50,
              marginLeft: 50,
              marginRight: 50,
              borderWidth: 1,
              borderRadius: 10,
              color: 'black',
              padding: 10,
              backgroundColor: 'white',
            }}
            ref={phoneInput}
            onPressFlag={() => console.log('Flag')}
            initialCountry={'in'}
            onChangePhoneNumber={text => setPhoneNumber(text)}
            initialValue=""
            textProps={{
              placeholder: 'Enter a phone number...',
            }}
          />

          <TouchableOpacity
            onPress={signInWithPhoneNumber}
            disabled={isButtonDisabled}>
            <View
              style={{
                height: 50,
                backgroundColor: isButtonDisabled ? 'gray' : Colors.orange,
                borderRadius: 10,
                width: responsiveWidth(73),
                marginTop: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
                {isButtonDisabled ? `GET OTP (${timer}s)` : 'GET OTP'}
              </Text>
            </View>
          </TouchableOpacity>
          {errorMessage && (
            <Text
              style={{
                fontSize: 13,
                color: 'red',
                marginTop: 20,
                marginHorizontal: 20,
              }}>
              {errorMessage}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
