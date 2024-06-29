import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const OrderStatus = () => {
  const [orderCounts, setOrderCounts] = useState({
    confirmed: 0,
    shipped: 0,
    outForDelivery: 0,
    delivered: 0,
  });

  return (
    <View style={styles.container}>
      <LottieView
        style={{width: 175, height: 175, alignSelf: 'center'}}
        source={require('../../Assets/Animations/status.json')}
        autoPlay
        loop
      />
      <View style={styles.topRow}>
        <View style={styles.box1}>
          <Text style={styles.label}>Confirmed Orders</Text>
          <Text style={styles.count}>{orderCounts.confirmed}</Text>
        </View>
        <View style={styles.box2}>
          <Text style={styles.label}>Shipped Orders</Text>
          <Text style={styles.count}>{orderCounts.shipped}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.box3}>
          <Text style={styles.label}>Out for Delivery</Text>
          <Text style={styles.count}>{orderCounts.outForDelivery}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Delivered Orders</Text>
          <Text style={styles.count}>{orderCounts.delivered}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    backgroundColor: '#32CD32', // Light grey background
  },
  box1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    backgroundColor: '#FFA07A', // Light grey background
  },
  box2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    backgroundColor: '#1E90FF', // Light grey background
  },
  box3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    backgroundColor: '#FFD700', // Light grey background
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default OrderStatus;
