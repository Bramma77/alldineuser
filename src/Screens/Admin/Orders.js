import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import Fonts from '../../Utilities/Fonts';

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

const Orders = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={Data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity>
            <View
              style={{
                borderWidth: 1,
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../Assets/Images/Swipper1.jpg')}
                style={{height: 100, width: 100, borderRadius: 10, margin: 10}}
              />
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                  }}>
                  {' '}
                  Foodname (4)
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                  }}>
                  {' '}
                  ₹ 40
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                  }}>
                  {' '}
                  24/05/24 12:21 Am
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                  }}>
                  {' '}
                  Customer name
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
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default Orders;
