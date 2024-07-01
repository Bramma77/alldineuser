import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../Utilities/Colors';
import Fonts from '../Utilities/Fonts';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useCart} from '../Provider/Provider';
import database from '@react-native-firebase/database';
import Restaurants from '../Component/Restaurants';

const Orderscreen = ({navigation}) => {
  const {
    cart,
    setCart,
    ResId,
    increaseQuantity,
    // decreaseQuantity,
    clearCart,
    CurrentUser,
    getorderlist,
  } = useCart();

  const totalPrice = cart?.items?.reduce(
    (sum, item) => sum + item.DishPrice * item.Quantity,
    0,
  );

  const sendPushNotification = async data => {
    try {
      // const fcmToken = await messaging().getToken();

      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=AAAAkROBIMQ:APA91bEzpvVs4P-SBfbVFjhp7fHccHvFxSrj4IqzPQ1fGgTIOZaoyq_A4GukuFiCs_mgYuLbTIkE_lXnO01if4LUDu3gJrNA-fAuIQ9xT4lHjbmH3Ppij5xrvto-n69sAEhFMMUPEOku`,
        },
        body: JSON.stringify({
          to: data,
          notification: {
            title: 'New Order',
            body: 'New Food order',
          },
        }),
      });

      if (response.ok) {
        console.log('Push notification sent successfully');

        //Alert.alert('Notification Sent');
      } else {
        console.error('Failed to send push notification:', response.statusText);
        Alert.alert('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      Alert.alert('Failed to send notification');
    }
  };

  const Proceedtopay = async () => {
    try {
      const fcmref = database().ref(`Admindashboard/FcmToken/${ResId}`);
      const snapshot = await fcmref.once('value');
      const data = snapshot.val();
      const orderData = {
        CustomerId: CurrentUser,
        RestaurantId: ResId,
        Dishes: cart,
        TotalPrice: totalPrice,
        OrderTime: Date.now(),
      };
      const ref = database().ref(`FoodOrders`);
      await ref.push(orderData);
      sendPushNotification(data);
      clearCart();
      getorderlist();
      Alert.alert('Success', 'Order placed successfully', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while placing your order');
    }
  };

  const decreaseQuantity = async itemId => {
    const newCart = {
      items: cart.items.map(item => {
        if (item.key === itemId) {
          if (item.Quantity > 1) {
            return {...item, Quantity: item.Quantity - 1};
          } else {
            Alert.alert(
              'Minimum Quantity',
              'The minimum quantity is 1. You cannot reduce it further.',
            );
            return item; // Return the item without changing the quantity
          }
        }
        return item;
      }),
    };
    setCart(newCart);
    await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(newCart));
    getCartItemCount();
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.DishesImage}} style={styles.dishImage} />
      <Text style={styles.dishName}>{item.DishName}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.key)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.Quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.key)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.dishPrice}>₹ {item.Quantity * item.DishPrice}</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={{marginBottom: 50}}>
      {/* <View style={styles.addMoreContainer}>
        <Text style={styles.addMoreText}>Add more items</Text>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </View> */}
      <View style={styles.borderLine} />
      <Text style={styles.billDetailsText}>Bill Details</Text>
      <View style={styles.billContainer}>
        <View style={styles.billRow}>
          <Text style={styles.billText}>Item Total</Text>
          <Text style={styles.billText}>₹ {totalPrice}</Text>
        </View>
        <View style={styles.borderLine} />
        <View style={styles.billRow}>
          <Text style={styles.billText}>To Pay</Text>
          <Text style={styles.billText}>₹ {totalPrice}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <TouchableOpacity onPress={() => clearCart()}>
          <Text style={styles.clearCartText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cart.items}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹ {totalPrice}</Text>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={Proceedtopay}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Orderscreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.Bold,
    color: 'black',
  },
  clearCartText: {
    color: 'red',
    fontFamily: Fonts.SemiBold,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveHeight(2),
  },
  dishImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  dishName: {
    color: 'black',
    fontSize: 14,
    fontFamily: Fonts.SemiBold,
    width: responsiveWidth(35),
    marginHorizontal: responsiveWidth(1.5),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingHorizontal: 5,
    borderColor: Colors.orange,
    borderWidth: 1,
    marginHorizontal: responsiveWidth(1),
  },
  quantityButton: {
    fontFamily: Fonts.Bold,
    fontSize: 14,
    color: Colors.orange,
  },
  quantityText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: 'black',
    paddingHorizontal: 15,
  },
  dishPrice: {
    color: 'black',
    fontFamily: Fonts.Regular,
    fontSize: 14,
    marginHorizontal: responsiveWidth(1.5),
  },
  addMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveWidth(3),
  },
  addMoreText: {
    color: 'black',
    fontSize: 14,
    fontFamily: Fonts.Regular,
  },
  borderLine: {
    borderWidth: 0.2,
    borderStyle: 'dashed',
    borderColor: 'black',
  },
  billDetailsText: {
    color: 'gray',
    fontFamily: Fonts.Bold,
    marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveHeight(2),
  },
  billContainer: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: responsiveHeight(1.5),
    borderRadius: 10,
    elevation: 10,
    padding: responsiveHeight(2),
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(2),
  },
  billText: {
    color: 'black',
    marginHorizontal: responsiveWidth(3),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'grey',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  placeOrderButton: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 10,
  },
  placeOrderText: {
    fontSize: 18,
    color: 'white',
    fontFamily: Fonts.Bold,
  },
});
