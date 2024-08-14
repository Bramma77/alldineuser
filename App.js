import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, Platform, Alert} from 'react-native';
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

  async function requestExactAlarmPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SCHEDULE_EXACT_ALARM,
      );
      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SCHEDULE_EXACT_ALARM,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Exact Alarm Permission Granted');
        } else {
          console.log('Exact Alarm Permission Denied');
        }
      }
    }
  }

  useEffect(() => {
    requestUserPermission();
    requestPermission();
    // requestExactAlarmPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification Permission Granted');
      } else {
        console.log('Notification Permission Denied');
      }
    } catch (err) {
      console.error('Permission Error:', err);
    }
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

    const unsubscribeBackground = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });

    return () => {
      unsubscribeBackground();
      unsubscribeForeground();
    };
  }, []);

  useEffect(() => {
    firebase.messaging().onMessage(response => {
      if (Platform.OS !== 'ios') {
        console.log('notification', response);
        showNotification(response);
        return;
      }
    });
  }, []);

  PushNotification.createChannel(
    {
      channelId: 'channel-id-1',
      channelName: 'My channel',
      playSound: true,
      soundName: 'default',
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`),
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
