import {firebase} from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
const OrderDetailView = ({navigation, route}) => {
  const [userInfo, setuserInfo] = useState('');

  const {Id} = route.params;

  const orders = async () => {
    const ref = firebase.database().ref('usersList').child(Id);
    // const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
    await ref.on('value', snapshot => {
      const formattedData = snapshot.val() || {};
      //  const filteredOrders = Object.keys(formattedData);
      // setOrderlist(filteredOrders);
      console.log(formattedData);
      setuserInfo(formattedData);
    });
  };
  useEffect(() => {
    orders();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Text
        style={{fontSize: 18, color: 'black', marginLeft: 20, marginTop: 20}}>
        User Information
      </Text>
      <Text
        style={{fontSize: 18, color: 'black', marginLeft: 20, marginTop: 10}}>
        {userInfo.name}
      </Text>
      <Text style={{fontSize: 18, color: 'black', marginLeft: 20}}>
        {userInfo.email}
      </Text>
      <Text style={{fontSize: 18, color: 'black', marginLeft: 20}}>
        {userInfo.mobile}
      </Text>
    </View>
  );
};
export default OrderDetailView;
