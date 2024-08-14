import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Button,
  Linking,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Fonts from '../Utilities/Fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Colors from '../Utilities/Colors';

const Profile = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    gender: '',
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const currentuser = auth().currentUser?.uid;
        const userRef = database().ref(`usersList/${currentuser}`);
        userRef.on('value', snapshot => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setProfileData(userData);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadProfileData();
  }, []);

  const ToProfile = () => {
    navigation.navigate('EditProfile');
  };

  const ToOrders = () => {
    navigation.navigate('Myorder');
  };
  const ToPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const signout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Login',
              },
            ],
          }),
        );
      });
  };
  const handlePress = async () => {
    // Check if the URL is supported
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // If the URL is supported, open it
      await Linking.openURL(url);
    } else {
      // If the URL is not supported, show an alert
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profileData.name ? profileData.name.charAt(0) : ''}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>
              {profileData.name ? profileData.name : 'Name'}
            </Text>
            <Text style={styles.emailText}>
              {profileData.email ? profileData.email : 'Email'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={ToProfile}
        style={styles.profile}>
        {/* <Text style={styles.header}>Profile</Text> */}
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <Feather name="user" size={20} color={'black'} />
            </View>
            <Text style={styles.text}>Your Profile</Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={ToOrders}
        style={styles.profile}>
        {/* <Text style={styles.header}>Orders</Text> */}
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <Octicons name="history" size={20} color={'black'} />
            </View>
            <Text style={styles.text}>Order History</Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={ToPolicy}
        style={styles.profile}>
        {/* <Text style={styles.header}>Pr</Text> */}
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <MaterialIcons name="privacy-tip" size={20} color={'black'} />
            </View>
            <Text style={styles.text}>Privacy policy</Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        activeOpacity={1}
        onPress={() => setModalVisible(true)}
        style={styles.profile}>
      
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <MaterialIcons name="rate-review" size={20} color={'black'} />
            </View>
            <Text style={[styles.text, {marginLeft: 20}]}>
              Feedback & Rating
            </Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </TouchableOpacity> 
      */}

      <TouchableOpacity activeOpacity={1} onPress={signout}>
        <View style={styles.profile}>
          {/* <Text style={styles.header}>Profile</Text> */}
          <View style={styles.body}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.icon}>
                <Feather name="log-out" size={20} color={'black'} />
              </View>
              <Text style={styles.text}>Logout</Text>
            </View>
            <MaterialIcons name="navigate-next" size={25} color={'black'} />
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Feedback & Ratings feature will be coming soon!
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 10,
    marginVertical: 5,
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    backgroundColor: '#dcdcdc',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    backgroundColor: 'skyblue',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'blue',
    fontSize: 30,
    fontFamily: Fonts.SemiBold,
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 10,
  },
  nameText: {
    color: 'black',
    fontSize: 25,
    fontFamily: Fonts.SemiBold,
    width: 245,
  },
  emailText: {
    color: 'black',
    fontSize: 12.5,
    fontFamily: Fonts.Regular,
    width: 245,
  },
  profile: {
    marginHorizontal: 10,
    marginVertical: 5,
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    padding: 10,
  },
  header: {
    color: 'black',
    fontSize: 16,
    fontFamily: Fonts.SemiBold,
  },
  text: {
    color: 'black',
    fontSize: 16,
    marginLeft: 20,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Fonts.Regular,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: Colors.orange,
    fontFamily: Fonts.Regular,
  },
});

export default Profile;
