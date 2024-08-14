import React, {useState, useEffect} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import auth from '@react-native-firebase/auth';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useCart} from '../Provider/Provider';
import database from '@react-native-firebase/database';

const Restaurants = ({item, onPress}) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [Dataview, setDataview] = useState([]);
  const [review, setreview] = useState([]);

  const {Wishlistdata, getResponseWishlist, addtowish, removeFromWishlist} =
    useCart();

  useEffect(() => {
    // if (item && item.Dishes) {

    //  setDataview(formattedData);
    reviewdata();
    finaldata();
  }, []);

  const reviewdata = async () => {
    await database()
      .ref('reviews')
      .on('value', snapshot => {
        const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
        const formattedData = items.map(([key, value]) => ({key, ...value}));

        setreview(formattedData);
        console.log('formatdata', formattedData);
      });
  };

  const finaldata = () => {
    // console.log('fianldata', item);
    if (item && item.Dishes) {
      const formattedData = Object.keys(item.Dishes).map(dish => ({
        key: dish,
        ...item.Dishes[dish],
      }));
      // console.log('forma', formattedData);
      setDataview(formattedData);
    }
  };
  // const getRatingForHotel = hotel_id => {
  //   const review1 = review.find(review => review.hotel_id === hotel_id);
  //   // console.log('review1', review1);
  //   //  console.log(review1);
  //   return review1 ? review1.rating : '1.0';
  // };
  const getRatingForHotel = hotel_id => {
    // Find all reviews for the specified hotel
    const hotelReviews = review.filter(review => review.hotel_id === hotel_id);

    if (hotelReviews.length === 0) {
      return '1.0';
    }

    // Extract ratings from those reviews
    const ratings = hotelReviews.map(review => review.rating);

    // Calculate total sum of ratings
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);

    // Calculate average rating
    const averageRating = totalRating / ratings.length;

    return averageRating.toFixed(1); // Return average rating rounded to one decimal place
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={7}>
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: item.DownloadUrl}} />
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={async () => {
            if (Wishlistdata?.includes(item.key)) {
              await removeFromWishlist(item.key);
              // database.removeFromWishlist(item.key);
              // getResponseWishlist();
            } else {
              await addtowish(item.key);
              // await database.addtowish(item.key);
              // getResponseWishlist();
            }
          }}>
          <Entypo
            name={Wishlistdata?.includes(item.key) ? 'heart' : 'heart-outlined'}
            size={30}
            color={'red'}
          />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <View style={styles.timerContent}>
            <Entypo name={'location-pin'} size={18} color={'green'} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.timerText}>
              {item.RestaurantLocation}
            </Text>
          </View>
        </View>
        <View style={styles.headerContainer}>
          <Text numberOfLines={2} style={styles.headerText}>
            {item.Restaurantname}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              {getRatingForHotel(item.Token)}
            </Text>
            <FontAwesome name={'star'} size={12} color={'white'} />
          </View>
        </View>
        <View style={styles.cuisineContainer}>
          {Dataview?.slice(0, 2).map((item, index) => (
            <View
              key={item.key}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Octicons
                name={'dot-fill'}
                size={12}
                color={'gray'}
                style={styles.cuisineIcon}
              />
              <Text numberOfLines={1} style={styles.cuisineText}>
                {item.DishName}
              </Text>
            </View>
          ))}
          <Text>.....</Text>
          {/* 
          <Text style={styles.cuisineText}>Pastas</Text>
          <Octicons
            name={'dot-fill'}
            size={12}
            color={'gray'}
            style={styles.cuisineIcon}
          />
          <Text style={styles.cuisineText}>Beverages</Text> */}
        </View>
        <View style={styles.locationContainer}>
          {/* <Text style={styles.locationLabel}>Location: </Text>
          <Text style={styles.locationText}>Kilpauk</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Restaurants;

const styles = StyleSheet.create({
  container: {
    // height: 330,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  heartIcon: {
    marginLeft: responsiveWidth(84),
    marginTop: responsiveHeight(1),
    position: 'absolute',
  },
  timerContainer: {
    height: 20,
    width: 100,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    marginTop: -20,
  },
  timerContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 5,
  },
  timerText: {
    color: 'green',
    fontSize: 13,
    fontWeight: 'bold',
    width: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  headerText: {
    color: 'black',
    fontSize: 25,
    width: responsiveWidth(65),
    // fontWeight: 'bold',
    fontFamily: Fonts.Bold,
  },
  ratingContainer: {
    width: 43,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  ratingText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: responsiveHeight(-1),
    // justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  cuisineText: {
    color: 'gray',
    fontSize: 15,
    margin: 5,
  },
  cuisineIcon: {
    margin: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(2),
    marginLeft: responsiveWidth(5),
  },
  locationLabel: {
    color: 'gray',
    fontSize: 13,
    fontWeight: 'bold',
  },
  locationText: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
