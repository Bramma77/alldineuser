import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
  Modal,
  Button,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Colors from '../../Utilities/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Utilities/Fonts';

const SubAdminDashboard = ({navigation}) => {
  const handleOrderStatus = () => {
    // Add product functionality
    navigation.navigate('SubOrder');
  };

  const handleStockAvailability = () => {
    // Status functionality
    navigation.navigate('AvailabilityFood');
  };

  const handleDishes = () => {
    // Notification functionality
    navigation.navigate('DishesList');
  };

  const handleSubAdmin = () => {
    // Notification functionality
    navigation.navigate('SubAdmin');
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    // Add your logout logic here
    // navigation.navigate('AdminLogin');
    await AsyncStorage.removeItem('AdminUser');
    navigation.replace('AdminLogin');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.containers}>
        <Text style={styles.titles}>Sub Admin Dashboard</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.iconContainers}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
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
          <TouchableOpacity style={styles.button} onPress={handleDishes}>
            <Ionicons
              style={{marginTop: 35}}
              name="fast-food"
              size={50}
              color="black"
            />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubAdmin}>
            <MaterialIcons
              style={{marginTop: 35}}
              name="admin-panel-settings"
              size={50}
              color="black"
            />
            <Text style={styles.buttonText}>Restaurant Info</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.buttonContainer}>
              <Button title="Yes" onPress={handleLogout} />
              <Button title="No" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
  containers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titles: {
    fontSize: 18,
    fontFamily: Fonts.Medium,
    flex: 1,

    color: 'black',
  },
  iconContainers: {
    position: 'absolute',
    right: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    fontFamily: Fonts.Light,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
