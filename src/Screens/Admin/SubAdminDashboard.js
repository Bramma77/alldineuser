import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Colors from '../../Utilities/Colors';

const SubAdminDashboard = ({navigation}) => {
  const handleLogout = async () => {
    // await AsyncStorage.removeItem('userToken');
    navigation.navigate('SubAdmin');
  };

  const handleOrderStatus = () => {
    // Add product functionality
    navigation.navigate('SubOrder');
  };

  const handleStockAvailability = () => {
    // Status functionality
    navigation.navigate('AvailabilityFood');
  };

  const handleToken = () => {
    // Notification functionality
    navigation.navigate('DishesList');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{height: 50, borderWidth: 0, backgroundColor: 'white'}}></View>
      <LottieView
        style={{width: 250, height: 250, alignSelf: 'center'}}
        source={require('../../Assets/Animations/Admin.json')}
        autoPlay
        loop
      />
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOrderStatus}>
            <FontAwesome5
              style={{marginTop: 35}}
              name="box-open"
              size={50}
              color="black"
            />
            <Text style={styles.buttonText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleStockAvailability}>
            <FontAwesome5
              style={{marginTop: 35}}
              name="chart-bar"
              size={50}
              color="black"
            />
            <Text style={styles.buttonText}>Availability</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleToken}>
            <FontAwesome5
              style={{marginTop: 35}}
              name="plus"
              size={50}
              color="black"
            />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <FontAwesome5
              style={{marginTop: 35}}
              name="sign-out-alt"
              size={50}
              color="black"
            />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SubAdminDashboard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    height: 150,
    width: 150,
    backgroundColor: Colors.orange,
    margin: 10,
    borderRadius: 100,
    elevation: 10,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  notificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 180,
    marginRight: 10,
  },
  notificationCount: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: -8,
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'white',
    elevation: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginLeft: 10,
  },
});
