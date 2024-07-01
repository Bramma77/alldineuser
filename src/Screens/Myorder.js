import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, Image, StyleSheet} from 'react-native';
import Fonts from '../Utilities/Fonts';
import moment from 'moment';
import {useCart} from '../Provider/Provider'; // Adjust the import path as necessary

const Myorder = () => {
  const {orderlist} = useCart();
  const [formattedOrders, setFormattedOrders] = useState([]);

  useEffect(() => {
    // Ensure orderlist is not undefined or null
    if (orderlist && orderlist.length > 0) {
      const formatted = orderlist.map(item => ({
        key: item.key,
        Dishes: {
          items: item.Dishes?.items || [], // Ensure Dishes.items is defined
        },
        ...item,
      }));
      setFormattedOrders(formatted);
    }
  }, [orderlist]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={formattedOrders}
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
              data={item.Dishes.items} // Ensure item.Dishes.items is defined
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View>
                  <View
                    style={{
                      borderWidth: 0,
                      flexDirection: 'row',
                      backgroundColor: 'rgba(245, 125, 0, 0.3)',
                      borderRadius: 10,
                    }}>
                    <Image
                      source={{uri: item.DishesImage}}
                      style={{
                        height: 70,
                        width: 70,
                        borderWidth: 1,
                        margin: 10,
                        borderRadius: 10,
                      }}
                    />
                    <View style={{margin: 10, borderWidth: 0, flex: 1}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 18,
                          color: 'black',
                          fontFamily: Fonts.Bold,
                        }}>
                        {item?.restaurantname}
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: 12,
                          fontFamily: Fonts.Medium,
                        }}>
                        {item?.Location} Chennai
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: 12,
                          fontFamily: Fonts.Medium,
                        }}>
                        {item?.DishPreparationType} mins
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      marginTop: 10,
                      borderWidth: 0,
                      marginRight: 10,
                    }}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 16,
                          fontFamily: Fonts.Bold,
                        }}>
                        {item.Quantity} x {item?.DishName}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 18,
                          fontFamily: Fonts.Bold,
                        }}>
                        ₹ {item.DishPrice}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
            <Text style={styles.orderStatus}>
              {item?.orderStatus || 'Ordered'}
            </Text>
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                borderColor: 'gray',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  marginLeft: 0,
                  fontSize: 14,
                  color: 'black',
                  fontFamily: Fonts.Medium,
                }}>
                {moment(item?.OrderTime).format(` DD MMM YYYY HH:mm a`)}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: Fonts.Bold,
                }}>
                ₹ {item.TotalPrice}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Myorder;
