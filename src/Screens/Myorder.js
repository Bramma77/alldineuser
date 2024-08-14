import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Fonts from '../Utilities/Fonts';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import {useCart} from '../Provider/Provider'; // Adjust the import path as necessary
import StarRating from 'react-native-star-rating-widget';
import database from '@react-native-firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../Utilities/Colors';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const Myorder = ({navigation}) => {
  const {
    orderlist,
    formattedOrders,
    setFormattedOrders,
    getorderlist,
    cartHasItems,
    Cartcount,
  } = useCart();
  // const [formattedOrders, setFormattedOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [review, setreview] = useState([]);

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

  useEffect(() => {
    reviewdata();
  }, []);
  const getRatingForHotel = dish_id => {
    //console.log('dish', dish_id);
    // Find all reviews for the specified hotel

    const hotelReviews = review.filter(
      review => review.dish_id === dish_id,

      //console.log('dis', dish_id),
    );

    if (hotelReviews.length === 0) {
      return '1.0';
    }
    console.log('hrr', hotelReviews);
    // Extract ratings from those reviews
    const ratings = hotelReviews.map(review => review.rating);

    // Calculate total sum of ratings
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);

    // Calculate average rating
    const averageRating = totalRating / ratings.length;

    return averageRating.toFixed(1); // Return average rating rounded to one decimal place
  };

  useEffect(() => {
    if (orderlist && orderlist.length > 0) {
      const fetchReviews = async () => {
        const reviewsSnapshot = await database().ref('reviews').once('value');
        const reviewsData = reviewsSnapshot.val();
        const reviews = reviewsData ? Object.values(reviewsData) : [];

        const formatted = orderlist.map(order => {
          const orderReviews = reviews.filter(review =>
            order.Dishes.items.some(item => item.key === review.dish_id),
          );
          return {
            key: order.key,
            Dishes: {
              items: order.Dishes?.items || [],
            },
            reviews: orderReviews,
            ...order,
          };
        });

        setFormattedOrders(formatted);
      };

      fetchReviews();
    }
  }, [orderlist]);

  const onRefresh = useCallback(() => {
    const currentuser = auth().currentUser?.uid;
    setRefreshing(true);

    getorderlist(currentuser);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleRatingChange = (
    itemKey,
    rating,
    CustomerId,
    RestaurantId,
    dishid,
  ) => {
    console.log('dishid', dishid);
    const existingReview = formattedOrders
      .find(order => order.key === itemKey)
      ?.reviews?.find(review => review.user_id === CustomerId);

    if (existingReview) {
      console.log('User has already reviewed this order.');
      return;
    }

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
                  review_text: 'great',
                  review_date: Date.now(),
                },
              ],
            }
          : order,
      ),
    );

    updateOrderRating(itemKey, rating, CustomerId, RestaurantId, dishid);
  };

  const updateOrderRating = async (
    itemKey,
    rating,
    CustomerId,
    RestaurantId,
    dishid,
  ) => {
    try {
      await database().ref('reviews').push({
        user_id: CustomerId,
        hotel_id: RestaurantId,
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

  const sortedOrders = formattedOrders.sort((a, b) => {
    return (
      moment(b.OrderTime, 'DD MMM YYYY,hh:mm a') -
      moment(a.OrderTime, 'DD MMM YYYY,hh:mm a')
    );
  });

  return (
    <View style={{flex: 1}}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={sortedOrders}
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
              data={item.Dishes.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item: dish}) => (
                <View>
                  <View
                    style={{
                      borderWidth: 0,
                      flexDirection: 'row',
                      backgroundColor: 'rgba(245, 125, 0, 0.3)',
                      borderRadius: 10,
                    }}>
                    <Image
                      source={{uri: dish.DishesImage}}
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
                        {dish?.restaurantname}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                          fontFamily: Fonts.Medium,
                        }}>
                        {dish?.RestaurantLocation}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                          fontFamily: Fonts.Medium,
                        }}>
                        {dish?.DishPreparationType} mins
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
                        {dish.Quantity} x {dish?.DishName}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 18,
                          fontFamily: Fonts.Bold,
                        }}>
                        ₹ {dish.DishPrice}
                      </Text>

                      {/* <Text
                        style={{fontSize: 14, color: 'black', marginLeft: 10}}>
                        Rate this Food
                      </Text> */}

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Ratereview', {
                            item,
                            dish,
                            formattedOrders,
                          })
                        }
                        style={{
                          height: 40,
                          width: 130,
                          borderWidth: 1,
                          backgroundColor: 'green',
                          alignItems: 'center',
                          borderRadius: 10,
                          alignSelf: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 16,

                            fontFamily: Fonts.Medium,
                          }}>
                          Rate & Review
                        </Text>
                      </TouchableOpacity>
                      {/* <StarRating
                        rating={
                          item.reviews && item.reviews.length > 0
                            ? item.reviews.find(
                                review =>
                                  review.user_id === auth().currentUser?.uid,
                              )?.rating || 0
                            : 0
                        }
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
                            review =>
                              review.user_id === auth().currentUser?.uid,
                          )
                        }
                      /> */}

                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>
                          {getRatingForHotel(dish.key)}
                        </Text>
                        <FontAwesome name={'star'} size={12} color={'white'} />
                      </View>
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
                {`${item?.OrderTime}`}
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
      {cartHasItems && (
        <View style={styles.cartContainer}>
          <Text style={styles.cartText}> {Cartcount} - Product Quantity</Text>
          <TouchableOpacity
            style={{
              marginRight: responsiveWidth(1),
              backgroundColor: Colors.white,
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate('Orderscreen')}>
            <Text style={styles.cartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
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
  cartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.orange,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cartText: {
    fontFamily: Fonts.Bold,
    fontSize: 16,
    color: 'white',
  },
});

export default Myorder;
