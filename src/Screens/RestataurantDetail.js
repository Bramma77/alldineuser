import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Fonts from '../Utilities/Fonts';

const RestataurantDetail = ({route}) => {
  const {restaurant} = route.params;

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={{flex: 1}}>
          <Image
            source={{uri: restaurant.DownloadUrl}}
            resizeMode="contain"
            style={{height: 200, width: '100%', marginTop: 50}}
          />
          <View style={{margin: 20}}>
            <Text
              style={{
                fontFamily: 'Your-Bold-Font',
                color: 'black',
                fontSize: 22,
                textAlign: 'center',
                fontFamily: Fonts.Bold,
              }}>
              {restaurant.Restaurantname}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Your-Bold-Font',
                color: 'black',
                marginTop: 10,
                fontFamily: Fonts.Medium,
              }}>
              Address
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.Regular,
                marginTop: 10,
                color: 'gray',
              }}>
              {restaurant.RestaurantAddress}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Your-Bold-Font',
                color: 'black',
                marginTop: 10,
                fontFamily: Fonts.Medium,
              }}>
              Location
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Your-Medium-Font',
                marginTop: 10,
                color: 'gray',
                fontFamily: Fonts.Regular,
              }}>
              {restaurant.RestaurantLocation}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Your-Bold-Font',
                color: 'black',
                marginTop: 10,
                fontFamily: Fonts.Medium,
              }}>
              Contact Number
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Your-Medium-Font',
                marginTop: 10,
                color: 'gray',
                fontFamily: Fonts.Regular,
              }}>
              {restaurant.ContactNo}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Your-Bold-Font',
                color: 'black',
                marginTop: 10,
                fontFamily: Fonts.Medium,
              }}>
              Short Description
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'gray',
                fontFamily: 'Your-Medium-Font',
                marginTop: 10,
                fontFamily: Fonts.Regular,
              }}>
              {restaurant.ShortDes}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Your-Bold-Font',
                color: 'black',
                marginTop: 10,
                fontFamily: Fonts.Medium,
              }}>
              Long Description
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'gray',
                fontFamily: 'Your-Medium-Font',
                marginTop: 10,
                fontFamily: Fonts.Regular,
              }}>
              {restaurant.LongDes}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            style={{
              height: 50,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 20,
              borderRadius: 10,
              borderWidth: 0,
              alignItems: 'center',
              backgroundColor: Colors.orange,
              alignSelf: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Bold,
                color: 'white',
                fontSize: 14,
              }}>
              Order Count
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 20,
              borderRadius: 10,
              borderWidth: 0,
              alignItems: 'center',
              backgroundColor: Colors.orange,
              alignSelf: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Bold,
                color: 'white',
                fontSize: 14,
              }}>
              Order History
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RestataurantDetail;

const styles = StyleSheet.create({});
