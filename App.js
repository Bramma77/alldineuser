import React, {useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import LoginScreen from './src/Screens/Login';
import Navigator from './src/Navigation/Navigator';
import PushNotification from 'react-native-push-notification';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  FirebaseMessagingTypes,
  firebase,
} from '@react-native-firebase/messaging';

const App = () => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  useEffect(() => {
    requestUserPermission();
    requestPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, // or POST_NOTIFICATIONS
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granded');
      } else {
        console.log('not granded');
      }
    } catch (err) {}
  };
  // const req=async()=>{
  //   if (Platform.OS == 'android' && DeviceInfo.getApiLevelSync() >= 33) {
  //     await requestPermission();
  //  }
  // }

  //  useEffect(()=>{
  //   req()

  // },[])

  useEffect(() => {
    // Request permissions for receiving notifications
    const requestPermission = async () => {
      try {
        await messaging().requestPermission();
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      } catch (error) {
        console.error('Permission Error:', error);
      }
    };
    requestPermission();

    // Listen for background messages (when app is in background or terminated)
    const unsubscribeBackground = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);

      //Alert.alert('Background Message', JSON.stringify(remoteMessage));
    });

    // Listen for foreground messages (when app is in foreground)
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      // Alert.alert('Foreground Message', JSON.stringify(remoteMessage));
    });

    return () => {
      unsubscribeBackground();
      unsubscribeForeground();
    };
  }, []);

  useEffect(() => {
    firebase.messaging().onMessage(response => {
      //console.log(JSON.stringify(response));
      if (Platform.OS != 'ios') {
        //  PushNotification.requestPermissions();
        console.log('notification', response);
        showNotification(response);

        // console.log('notification android',response)

        return;
      }
      //  PushNotificationIOS.requestPermissions().then(() =>
      //      showNotification(response.notification),

      //  );
    });
  }, []);

  PushNotification.createChannel(
    {
      channelId: 'channel-id-1', // (required)
      channelName: 'My channel',
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
  const showNotification = notification => {
    console.log('responsed notification', notification.notification.body);

    PushNotification.localNotification({
      channelId: 'channel-id-1',
      title: notification.notification.title,
      message: notification.notification.body,
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <Navigator />
    </SafeAreaView>
  );
};
export default App;
