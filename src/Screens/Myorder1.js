import React, {useState, useEffect} from 'react';
import {View, FlatList, Text, Image} from 'react-native';
import {Orders} from '../Component/Orders';
import {useCart} from '../Provider/Provider';
import Fonts from '../Utilities/Fonts';
import moment from 'moment';

const Myorder = () => {
  const {clearCart, Restaurantdata, orderlist} = useCart();

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={orderlist}
        keyExtractor={item => item.key}
        renderItem={({item, index}) => (
          <View
            style={{
              borderWidth: 0,
              backgroundColor: 'white',
              elevation: 10,
              margin: 10,
              borderRadius: 10,
            }}>
            {/* <Text>{item?.CustomerId}</Text> */}

            <FlatList
              data={item.Dishes.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
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
                    <View
                      style={{
                        margin: 10,
                        borderWidth: 0,
                        flex: 1,
                      }}>
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
                        {item?.Location}Chennai
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
                      style={{borderBottomWidth: 1, borderBottomColor: 'gray'}}>
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
            <Text
              style={{
                padding: 10,
                backgroundColor: 'lightgray',
                color: 'black',
                height: 40,
                borderRadius: 5,
                marginRight: 10,
                marginTop: 50,
                alignSelf: 'flex-end',
                position: 'absolute',
              }}>
              Delivered
            </Text>
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                // borderBottomWidth: 1,
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
                style={{color: 'black', fontSize: 18, fontFamily: Fonts.Bold}}>
                ₹ {item.TotalPrice}
              </Text>
            </View>
            {/* <Text>Total Price {item.TotalPrice}</Text> */}
            {/* <View style={{padding: 10}}>
              <Text>Rate</Text>
            </View> */}
          </View>
        )}
      />
    </View>
  );
};
export default Myorder;
