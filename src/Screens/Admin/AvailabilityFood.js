import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Fonts from '../../Utilities/Fonts';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';

const AvailabilityFood = () => {
  const [isCheck, setisCheck] = useState(false);
  const [Dishes, setDishes] = useState([]);
  const [AccessToken, setAccessToken] = useState(false);

  const Data = [
    {
      id: 1,
      msg: 'msg',
    },
    {
      id: 2,
      msg: 'msg',
    },
  ];

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
      console.log('userdsa', userData);
      setAccessToken(userData.AccessToken);
    } catch (error) {
      console.log(error);
    }
  };
  const updateFoodStatus = async ({key, status}) => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
      await firebase
        .database()
        .ref('RestaurantsData')
        .child(userData.AccessToken)
        .child(`Dishes/${key}`)
        .update({Availability: status});
      console.log('Order status updated successfully.');
      Alert.alert('Success', 'Order status updated successfully.');
    } catch (error) {
      console.error('Error updating order status: ', error);
    } finally {
      //  setModalVisible(false);
    }
  };
  const showdishes = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
    const ref = database().ref('RestaurantsData').child(userData.AccessToken);

    await ref.child('Dishes').on('value', snapshot => {
      const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
      const formattedData = items.map(([key, value]) => ({key, ...value}));
      // const data=snapshot.val()?snapshot.val():[]
      setDishes(formattedData);
      console.log(formattedData);
    });
    return () => {
      ref.off('value', snapshot);
    };
  };

  useEffect(() => {
    showdishes();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Image
        source={require('../../Assets/Images/Swipper1.jpg')}
        style={{height: '30%', width: '100%'}}
      />
      <Text
        style={{
          fontFamily: Fonts.Bold,
          color: 'black',
          fontSize: 22,
          marginLeft: 20,
          marginTop: 20,
        }}>
        Hotel Name
      </Text>
      <Text
        style={{
          fontFamily: Fonts.Bold,
          color: 'black',
          fontSize: 18,
          marginLeft: 20,
          marginTop: 20,
        }}>
        Dishes in Restaurants
      </Text>
      <FlatList
        data={Dishes}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <View
              style={{
                borderWidth: 1,
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.DishesImage}}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 10,
                    margin: 10,
                  }}
                />

                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.Bold,
                      color: 'black',
                    }}>
                    {item.DishName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.Bold,
                      color: 'black',
                    }}>
                    {' '}
                    Owner name
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.Bold,
                      color: 'black',
                    }}>
                    {' '}
                    +90242252
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={
                  () =>
                    updateFoodStatus({
                      key: item.key,
                      status: isCheck ? 'Available' : 'NotAvailable',
                    })
                  //setisCheck(isCheck === item.id ? !item.id : item.id)
                }>
                <View
                  style={{
                    height: 25,
                    width: 25,
                    borderWidth: 1,
                    borderRadius: 2,
                    alignSelf: 'flex-end',
                    marginRight: 20,
                    marginBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Entypo
                    name="check"
                    size={22}
                    color={
                      item?.Availability === ('NotAvailable' || null)
                        ? 'transparent'
                        : 'green'
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default AvailabilityFood;
