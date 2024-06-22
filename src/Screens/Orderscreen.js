import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Colors from '../Utilities/Colors';
import Fonts from '../Utilities/Fonts';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useCart} from '../Provider/Provider';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const Orderscreen = ({navigation}) => {
  const {
    cart,
    ResId,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    Cartcount,
    CurrentUser,
  } = useCart();

  const totalPrice = cart?.reduce(
    (sum, item) => sum + item.DishPrice * item.Quantity,
    0,
  );

  //   const Proceedtopay = async () => {
  //     try {
  //       const data = {
  //         CustomerId: 1,
  //         RestaurantId: ResId,
  //         Dishes: cart,
  //         TotalPrice: totalPrice,
  //         OrderTime: Date.now()
  //       }
  //       const ref = await database().ref(FoodOrders/${CurrentUser});
  //       ref.push(data);
  //       clearCart();
  //       alert('Order placed successfully');
  //     }
  //     catch (e) {
  //       console.log(e);
  //     }
  //   }
  console.log(ResId);
  const Proceedtopay = async () => {
    try {
      const orderData = {
        CustomerId: CurrentUser,
        RestaurantId: ResId,
        Dishes: cart,
        TotalPrice: totalPrice,
        OrderTime: Date.now(),
      };
      const ref = database().ref(`FoodOrders/${CurrentUser}/${ResId}`);
      await ref.push(orderData);
      clearCart();
      Alert.alert('Success', 'Order placed successfully', [
        {text: 'OK', onPress: () => navigation.navigate('Myorders')},
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while placing your order');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          elevation: 1,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{fontSize: 18, fontFamily: Fonts.Bold, color: 'black'}}>
          Order Summary
        </Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={{color: 'red', fontFamily: Fonts.SemiBold}}>
            Clear Cart
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cart}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'grey',
            }}>
            <Image
              source={{uri: item.DishesImage}}
              style={{width: 60, height: 60, borderRadius: 10}}
            />
            <View style={{flex: 1, marginLeft: 10}}>
              <Text
                style={{fontSize: 16, fontWeight: Fonts.Bold, color: 'red'}}>
                {item.DishName}
              </Text>
              <Text style={{fontSize: 14, color: 'grey'}}>
                ₹ {item.DishPrice}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => decreaseQuantity(item.key)}>
                <Ionicons name="remove-circle-outline" size={24} color="grey" />
              </TouchableOpacity>
              <Text style={{marginHorizontal: 10, color: 'black'}}>
                {item.Quantity}
              </Text>
              <TouchableOpacity onPress={() => increaseQuantity(item.key)}>
                <Ionicons name="add-circle-outline" size={24} color="grey" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFromCart(item.key)}>
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="red"
                  style={{marginLeft: 10}}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: 'grey',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'red'}}>
          Total: ₹ {totalPrice}
        </Text>
        <TouchableOpacity
          style={{padding: 10, backgroundColor: 'orange', borderRadius: 10}}
          onPress={Proceedtopay}>
          <Text style={{fontSize: 18, color: 'white', fontFamily: Fonts.Bold}}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Orderscreen;
