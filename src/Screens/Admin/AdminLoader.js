import React, {useRef, useEffect} from 'react';
import {
  Animated,
  Easing,
  View,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import {CommonActions} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Video, {VideoRef} from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminLoader = ({navigation}) => {
  const adminlogin = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
    console.log('userdsa', userData);
    setAccessToken(userData.AccessToken);

    if (userData) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'SubAdminDashboard'}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'AdminLogin'}],
        }),
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      adminlogin();
      // navigation.replace('Mypager');
    }, 5000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigation]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Video
        // style={{height:200,width:200}}
        source={{uri: require('../../Assets/Images/alldine.mp4')}}
        repeat={false}
        resizeMode="cover"
        paused={false}
        onError={e => console.log(e)}
        muted={true}
        style={styles.backgroundVideo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // or 'contain' for different aspect ratios
  },
  backgroundVideo: {
    position: 'absolute',

    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default AdminLoader;
