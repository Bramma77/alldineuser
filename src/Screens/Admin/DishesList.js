import {firebase} from '@react-native-firebase/database';
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from 'react-native';
import database from '@react-native-firebase/database';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Fonts from '../../Utilities/Fonts';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../Utilities/Colors';

const DishesList = ({navigation, route}) => {
  const [AddedDish, setAddedDish] = useState([]);
  const [Dishes, setDishes] = useState([]);
  const [AccessToken, setAccessToken] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState(null);

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

  const showdishes = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
    const ref = database().ref('RestaurantsData').child(userData.AccessToken);

    await ref.child('Dishes').on('value', snapshot => {
      const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
      const formattedData = items.map(([key, value]) => ({key, ...value}));
      setDishes(formattedData);
      console.log(formattedData);
    });
    return () => {
      ref.off('value', snapshot);
    };
  };

  const removeDish = async () => {
    console.log(selectedDishId);
    console.log(AccessToken);
    if (selectedDishId) {
      await database()
        .ref(`RestaurantsData/${AccessToken}/Dishes/${selectedDishId}`)
        .remove()
        .then(() => console.log('Dish removed successfully.'));
      setSelectedDishId(null);
      setModalVisible(false);
    }
  };

  useEffect(() => {
    showdishes();
  }, []);

  const openModal = dishId => {
    setSelectedDishId(dishId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedDishId(null);
    setModalVisible(false);
  };

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          fontSize: 22,
          fontFamily: Fonts.Bold,
          color: 'black',
          position: 'absolute',
          top: 30,
          marginLeft: 20,
        }}>
        Add Dishes
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddDishes', {AccessToken})}
        style={{
          height: 50,
          width: 50,
          alignItems: 'center',
          backgroundColor: 'green',
          justifyContent: 'center',
          borderWidth: 1,
          alignSelf: 'flex-end',
          marginRight: 20,
          borderRadius: 10,
          marginTop: 20,
        }}>
        <Entypo name="plus" size={42} color={'white'} />
      </TouchableOpacity>
      <FlatList
        data={Dishes}
        numColumns={1}
        renderItem={({item}) => (
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
                    width: 170,
                    // borderWidth: 1,
                  }}>
                  {item.DishName}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.Medium,
                    color: 'black',
                  }}>
                  {item.DishType}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                  }}>
                  ₹{item.DishPrice}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                  }}>
                  Time {item.DishPreparationType}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 10,
                borderWidth: 0,
              }}>
              <TouchableOpacity
                onPress={() => openModal(item.key)}
                style={{paddingBottom: 60}}>
                <Entypo
                  name="trash"
                  size={20}
                  color={Colors.orange}
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddDishes', {dishId: item.key})
                }>
                <Entypo name="edit" size={20} color={Colors.orange} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={{marginBottom: 20}} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: 300,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: 'black',
                marginBottom: 20,
                fontFamily: Fonts.Regular,
              }}>
              Are you sure you want to delete this dish?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
              <Button
                title="Cancel"
                color={Colors.orange}
                onPress={closeModal}
              />
              <Button title="OK" color={Colors.orange} onPress={removeDish} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default DishesList;
