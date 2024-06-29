import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Orders} from '../../Component/Orders';
import {useCart} from '../../Provider/Provider';
import Fonts from '../../Utilities/Fonts';
import moment from 'moment';
import {firebase} from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../Utilities/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import IonIcons from 'react-native-vector-icons/Ionicons';

const SubOrder = () => {
  const {clearCart, Restaurantdata} = useCart();
  const [orderlist, setOrderlist] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentTab, setCurrentTab] = useState('new');

  useEffect(() => {
    getUser();
    orders();
  }, [selectedDate, currentTab]);

  const getUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
      console.log('userdsa', userData);
    } catch (error) {
      console.log(error);
    }
  };

  const orders = async () => {
    const ref = firebase.database().ref('FoodOrders');
    const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
    await ref.on('value', snapshot => {
      const formattedData = snapshot.val() || {};
      const filteredOrders = Object.keys(formattedData)
        .filter(
          key => formattedData[key].RestaurantId === `${userData.AccessToken}`,
        )
        .map(key => ({key, ...formattedData[key]}))
        .filter(order =>
          moment(order.OrderTime).isSame(moment(selectedDate), 'day'),
        )
        .filter(order =>
          currentTab === 'new'
            ? order.orderStatus !== 'Delivered'
            : order.orderStatus === 'Delivered',
        );
      setOrderlist(filteredOrders);
    });
  };

  const updateOrderStatus = async ({orderId, status}) => {
    try {
      await firebase
        .database()
        .ref(`/FoodOrders/${orderId}`)
        .update({orderStatus: status});
      console.log('Order status updated successfully.');
      Alert.alert('Success', 'Order status updated successfully.');
    } catch (error) {
      console.error('Error updating order status: ', error);
    } finally {
      setModalVisible(false);
    }
  };

  const confirmDelivery = order => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            currentTab === 'new' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setCurrentTab('new')}>
          <Text style={styles.tabText}>New Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            currentTab === 'delivered' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setCurrentTab('delivered')}>
          <Text style={styles.tabText}>Delivered Orders</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          backgroundColor: Colors.orange,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          marginLeft: 20,
          marginRight: 20,
          flexDirection: 'row',
        }}>
        <Text style={{fontSize: 16, color: 'white', fontFamily: Fonts.Medium}}>
          {moment(selectedDate).format('DD-MM-YYYY')}
        </Text>
        <Entypo
          name="calendar"
          color="white"
          size={22}
          style={{marginLeft: 20}}
        />
      </TouchableOpacity>
      {/* <Button title="Select Date" onPress={showDatePicker} /> */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <FlatList
        data={orderlist}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <View
            style={{
              borderWidth: 0,
              backgroundColor: 'white',
              elevation: 10,
              margin: 10,
              borderRadius: 10,
            }}>
            <FlatList
              data={item.Dishes.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View>
                  <View style={styles.dishContainer}>
                    <Image
                      source={{uri: item.DishesImage}}
                      style={styles.dishImage}
                    />
                    <View style={styles.dishInfo}>
                      <Text numberOfLines={1} style={styles.restaurantName}>
                        {item?.restaurantname}
                      </Text>
                      <Text style={styles.location}>{item?.Location}</Text>
                      <Text style={styles.preparationTime}>
                        {item?.DishPreparationType} mins
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderDetails}>
                    <View style={styles.orderItem}>
                      <Text style={styles.dishQuantity}>
                        {item.Quantity} x {item?.DishName}
                      </Text>
                      <Text style={styles.dishPrice}>₹ {item.DishPrice}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
            <Text style={styles.orderStatus}>
              {item?.orderStatus || 'Ordered'}
            </Text>
            <View style={styles.orderSummary}>
              <Text style={styles.orderTime}>
                {moment(item?.OrderTime).format(' DD MMM YYYY HH:mm a')}
              </Text>
              <Text style={styles.totalPrice}>₹ {item.TotalPrice}</Text>
            </View>
            <TouchableOpacity
              style={styles.deliverButton}
              onPress={() => confirmDelivery(item)}>
              <Text style={styles.deliverButtonText}>Delivered</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delivery</Text>
            <Text style={styles.modalText}>
              Are you sure you want to mark this order as delivered?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() =>
                  updateOrderStatus({
                    orderId: selectedOrder.key,
                    status: 'Delivered',
                  })
                }>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.orange,
  },
  inactiveTab: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  tabText: {
    fontSize: 16,
    fontFamily: Fonts.Bold,
  },
  dishContainer: {
    borderWidth: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 125, 0, 0.3)',
  },
  dishImage: {
    height: 70,
    width: 70,
    borderWidth: 1,
    margin: 10,
    borderRadius: 10,
  },
  dishInfo: {
    margin: 10,
    borderWidth: 0,
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    color: 'black',
    fontFamily: Fonts.Bold,
  },
  location: {
    color: 'gray',
    fontSize: 12,
    fontFamily: Fonts.Medium,
  },
  preparationTime: {
    color: 'gray',
    fontSize: 12,
    fontFamily: Fonts.Medium,
  },
  orderDetails: {
    marginLeft: 10,
    marginTop: 10,
    borderWidth: 0,
    marginRight: 10,
  },
  orderItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  dishQuantity: {
    color: 'black',
    fontSize: 16,
    fontFamily: Fonts.Bold,
  },
  dishPrice: {
    color: 'black',
    fontSize: 18,
    fontFamily: Fonts.Bold,
  },
  orderStatus: {
    padding: 10,
    backgroundColor: 'lightgray',
    color: 'black',
    height: 40,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 50,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  orderSummary: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderTime: {
    marginLeft: 0,
    fontSize: 14,
    color: 'black',
    fontFamily: Fonts.Medium,
  },
  totalPrice: {
    color: 'black',
    fontSize: 18,
    fontFamily: Fonts.Bold,
  },
  deliverButton: {
    height: 50,
    padding: 0,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange,
    borderRadius: 10,
  },
  deliverButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: Fonts.Bold,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: Fonts.Bold,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: Fonts.Medium,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontFamily: Fonts.Bold,
    margin: 10,
  },
  confirmButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontFamily: Fonts.Bold,
    margin: 10,
  },
});

export default SubOrder;
