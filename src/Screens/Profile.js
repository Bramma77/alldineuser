import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Fonts from '../Utilities/Fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';

const Profile = ({navigation}) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>Sant</Text>
            <Text style={styles.emailText}>+912324242424</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.profile}>
        {/* <Text style={styles.header}>Profile</Text> */}
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <Feather name="user" size={25} color={'black'} />
            </View>
            <Text style={styles.text}>Your Profile</Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </View>

      <View style={styles.profile}>
        {/* <Text style={styles.header}>Orders</Text> */}
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <Feather name="user" size={25} color={'black'} />
            </View>
            <Text style={styles.text}>Order History</Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </View>

      <View style={styles.profile}>
        {/* <Text style={styles.header}>Pr</Text> */}
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <Feather name="user" size={25} color={'black'} />
            </View>
            <Text style={styles.text}>Privacy policy</Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </View>
      <View style={styles.profile}>
        {/* <Text style={styles.header}>Rating</Text> */}
        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.icon}>
              <Feather name="user" size={25} color={'black'} />
            </View>
            <Text style={[styles.text, {marginLeft: 20}]}>Rating</Text>
          </View>
          <MaterialIcons name="navigate-next" size={25} color={'black'} />
        </View>
      </View>
      <TouchableOpacity onPress={signout}>
        <View style={styles.profile}>
          {/* <Text style={styles.header}>Profile</Text> */}
          <View style={styles.body}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.icon}>
                <Feather name="user" size={25} color={'black'} />
              </View>
              <Text style={styles.text}>Logout</Text>
            </View>
            <MaterialIcons name="navigate-next" size={25} color={'black'} />
          </View>
        </View>
      </TouchableOpacity>
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
  },
  emailText: {
    color: 'black',
    fontSize: 12.5,
    fontFamily: Fonts.Regular,
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
});

export default Profile;
