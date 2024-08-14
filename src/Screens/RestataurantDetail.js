import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import Fonts from '../Utilities/Fonts';
import {firebase} from '@react-native-firebase/auth';

const RestataurantDetail = ({route, navigation}) => {
  const {restaurant} = route.params;

  console.log('res', restaurant.key);

  const totalfoodamount = async () => {
    const ref = await firebase.database().ref('FoodOrders');
    ref.on('value', snapshot => {
      const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
      const formattedData = items.map(([key, value]) => ({key, ...value}));
      // console.log(formattedData);
      const newdata = formattedData.filter(
        item => item.RestaurantId === '666666',
      );
      // const newdata1=newdata.reduce((item)=>item.TotalPrice)
      // console.log('filtered data', newdata);
      const newone = newdata
        .reduce((total, item) => total + item.TotalPrice, 0)
        .toFixed(2);
      console.log('filtered data', newone);
    });
  };

  useEffect(() => {
    totalfoodamount();
  }, []);

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
        {/* <View
          style={{
            height: 100,
            width: 200,
            borderWidth: 1,
            marginLeft: 20,
          }}>
          <Text>Total Orders{}</Text>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AdminAvailabilityFood', {Id: restaurant.key})
            }
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
              Dishes List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Adminorders', {Id: restaurant.key})
            }
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
