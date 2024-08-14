import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Fonts from '../Utilities/Fonts';
import {useCart} from '../Provider/Provider';

const Ratereview = ({route}) => {
  const {item, dish} = route.params;
  const [user_id, setuser_id] = useState('');
  const [hotel_id, sethotel_id] = useState('');
  const [rating, setrating] = useState('');
  const [dishid, setdishid] = useState('');
  const [review, setreview] = useState('');
  const {orderlist, getorderlist, formattedOrders, setFormattedOrders} =
    useCart();

  const handleRatingChange = (
    itemKey,
    rating,
    CustomerId,
    RestaurantId,
    dishid,
  ) => {
    // console.log('dishid', dishid);
    // // const existingReview = formattedOrders
    // //   .find(order => order.key === itemKey)
    // //   ?.reviews?.find(review => review.user_id === CustomerId);

    // // if (existingReview) {
    // //   console.log('User has already reviewed this order.');
    //   return;
    // }

    setFormattedOrders(prevOrders =>
      prevOrders.map(order =>
        order.key === itemKey
          ? {
              ...order,
              reviews: [
                ...(order.reviews || []),
                {
                  user_id: CustomerId,
                  hotel_id: RestaurantId,
                  rating,
                  dishid: dishid,
                  review_text: review,
                  review_date: Date.now(),
                },
              ],
            }
          : order,
      ),
    );
    setrating(rating);
    setuser_id(CustomerId);
    sethotel_id(RestaurantId);
    setdishid(dishid);

    //  updateOrderRating(itemKey, rating, CustomerId, RestaurantId, dishid);
  };

  const updateOrderRating = async (
    itemKey,

    CustomerId,
    RestaurantId,
  ) => {
    try {
      await database().ref('reviews').push({
        user_id: user_id,
        hotel_id: hotel_id,
        rating: rating,
        dish_id: dishid,
        review_text: 'great',
        review_date: Date.now(),
      });

      console.log(`Order rating updated to ${rating}`);
    } catch (error) {
      console.error('Error updating order rating: ', error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View style={{margin: 20}}>
        <Text style={{fontSize: 16, color: 'black', fontFamily: Fonts.Medium}}>
          Give rating
        </Text>
        <StarRating
          rating={rating || 0}
          onChange={rating =>
            handleRatingChange(
              item.key,
              rating,
              auth().currentUser?.uid,
              item.RestaurantId,
              dish.key,
            )
          }
          starSize={30}
          color="#f1c40f"
          disabled={
            item.reviews &&
            item.reviews.some(
              review => review.user_id === auth().currentUser?.uid,
            )
          }
        />
        <Text
          style={{
            fontSize: 16,
            color: 'black',
            fontFamily: Fonts.Medium,
            marginTop: 20,
          }}>
          Give review
        </Text>
        <View
          style={{margin: 20, borderWidth: 1, borderRadius: 20, height: 200}}>
          <TextInput
            multiline
            onChangeText={text => setreview(text)}
            value={review}
            style={{
              fontSize: 16,
              fontFamily: Fonts.Medium,
              color: 'black',
              padding: 5,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={updateOrderRating}
          style={{
            height: 50,
            borderWidth: 1,
            backgroundColor: 'green',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 16, color: 'white'}}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Ratereview;
