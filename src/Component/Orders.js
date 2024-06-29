import {firebase} from '@react-native-firebase/storage';

const Orderlist = async currentuser => {
  return new Promise((resolve, reject) => {
    //   const ref = firebase.database().child('FoodOrders').child(currentuser);
    const ref = firebase.database().ref('FoodOrders');
    console.log('ref', ref);

    ref.on(
      'value',
      snapshot => {
        const item = snapshot.val() ? Object.entries(snapshot.val()) : [];
        // const formattedData = item.map(([key, value]) => ({key, ...value}));
        const formattedData = snapshot.val() || {};
        const filteredOrders = Object.keys(formattedData)
          .filter(key => formattedData[key].CustomerId === currentuser)
          .map(key => ({key, ...formattedData[key]}));
        // setOrders(filteredOrders);
        console.log(formattedData);
        resolve(filteredOrders);
      },
      error => {
        reject(error);
      },
    );
  });
};
export const Orders = {Orderlist};
