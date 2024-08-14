import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  RefreshControl,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import Colors from '../Utilities/Colors';
import Fonts from '../Utilities/Fonts';
import Carousel from 'react-native-reanimated-carousel';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Icon from 'react-native-vector-icons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Extrapolation,
  useSharedValue,
  useAnimatedScrollHandler,
  interpolate,
} from 'react-native-reanimated';
import Restaurants from '../Component/Restaurants';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCart} from '../Provider/Provider';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

const Dashboard = () => {
  const width = Dimensions.get('window').width;
  const {width: screenWidth} = Dimensions.get('window');
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const [Restaruants, setRestarunts] = useState([]);
  const {
    clearCart,
    Restaurantdata,
    getWishlist,
    getorderlist,
    cartHasItems,
    setCartHasItems,
    Cartcount,
  } = useCart();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const Images = [
    {
      id: 1,
      image: require('../Assets/Images/Swipper1.jpg'),
    },
    {
      id: 2,
      image: require('../Assets/Images/Swipper2.jpg'),
    },
    {
      id: 3,
      image: require('../Assets/Images/Swipper3.jpg'),
    },
    {
      id: 4,
      image: require('../Assets/Images/Swipper4.jpg'),
    },
  ];

  const Data = [
    {
      id: 1,
      image:
        'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg',
    },
    {
      id: 2,
      image:
        'https://www.foodiesfeed.com/wp-content/uploads/2023/08/crispy-spicy-chicken-wings.jpg',
    },
    {
      id: 3,
      image:
        'https://www.foodiesfeed.com/wp-content/uploads/2023/08/crispy-spicy-chicken-wings.jpg',
    },
    {
      id: 4,
      image:
        'https://www.foodiesfeed.com/wp-content/uploads/2023/08/crispy-spicy-chicken-wings.jpg',
    },
  ];

  const backPressCount = useRef(0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    if (navigation.isFocused()) {
      backPressCount.current += 1;

      if (backPressCount.current === 1) {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {text: 'Cancel', onPress: resetBackPressCount, style: 'cancel'},
            {text: 'OK', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert('Hold on!', 'Press back again to exit.');
        setTimeout(resetBackPressCount, 1000); // Reset back press count after 2 seconds
      }

      return true;
    }

    return false;
  };

  const resetBackPressCount = () => {
    backPressCount.current = 0;
  };

  useEffect(() => {
    // clearCart();
    // const fetchCart = async () => {
    //   const storedCart = await AsyncStorage.getItem('cart');
    //   console.log("Assytored",JSON.parse(storedCart))
    //   if (storedCart) {
    //    // setCart(JSON.parse(storedCart));
    //   }
    // };
    // fetchCart();
  }, []);
  useEffect(() => {
    setFilteredRestaurants(Restaurantdata);
    filterRestaurants(searchText);
  }, [searchText, Restaurantdata]);
  // const HotelList = async () => {
  //   const ref = database().ref('RestaurantsData');
  //   await ref.on('value', snapshot => {
  //     const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
  //     const formattedData = items.map(([key, value]) => ({key, ...value}));
  //     setRestaurants(formattedData);
  //     setFilteredRestaurants(formattedData);
  //   });
  // };

  const filterRestaurants = text => {
    const filteredData = Restaurantdata.filter(item => {
      // Check if the restaurant name includes the search text
      const isRestaurantMatch = item.Restaurantname.toLowerCase().includes(
        text.toLowerCase(),
      );

      // Check if any dish name includes the search text
      const isDishMatch = Object.values(item.Dishes).some(dish =>
        dish.DishName.toLowerCase().includes(text.toLowerCase()),
      );

      // Return true if either the restaurant name or any dish name matches the search text
      return isRestaurantMatch || isDishMatch;
    });

    setFilteredRestaurants(filteredData);
  };

  // const HotelList = async () => {
  //   const ref = database().ref('RestaurantsData');

  //   await ref.on('value', snapshot => {
  //     const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
  //     const formattedData = items.map(([key, value]) => ({key, ...value}));
  //     // const data=snapshot.val()?snapshot.val():[]
  //     setRestarunts(formattedData);

  //     //  console.log(formattedData);
  //   });
  // };
  const onRefresh = useCallback(() => {
    const currentuser = auth().currentUser?.uid;
    setRefreshing(true);
    getWishlist(currentuser);
    getorderlist(currentuser);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const currentuser = auth().currentUser?.uid;
    getWishlist(currentuser);
    getorderlist(currentuser);
  }, []);

  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor: '#fff',
        }}>
        <StatusBar translucent={false} />
        {/* <View style={{ height: 50, backgroundColor: Colors.orange, justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontFamily: Fonts.Bold, fontSize: 22, alignSelf: 'center' }}>Good Afternoon</Text>

                </View> */}

        <View
          style={{
            marginHorizontal: responsiveWidth(5),
            marginVertical: responsiveHeight(1),
            borderRadius: 5,
            backgroundColor: '#fff',
            elevation: 0,
            // height: 45,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            flexDirection: 'row',

            alignItems: 'center',
          }}>
          <Feather
            style={{marginLeft: 10}}
            name={'search'}
            size={18}
            color={Colors.orange}
          />
          <TextInput
            numberOfLines={1}
            scrollEnabled={false}
            style={{
              fontSize: 16,
              // height: 40,
              borderWidth: 0,

              color: 'black',
              fontFamily: Fonts.Medium,
              marginRight: 30,
            }}
            placeholderTextColor={'gray'}
            placeholder="  Search   "
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEnabled={scrollEnabled}
          disableScrollViewPanResponder={true}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}>
          <View style={{borderWidth: 0, alignItems: 'center', height: 220}}>
            <Carousel
              loop
              width={width}
              height={200}
              autoPlay={true}
              withAnimation={{type: 'timing', config: {duration: 500}}}
              data={Images}
              layout={'tinder'}
              scrollAnimationDuration={2000}
              // panGestureHandlerProps={{
              //   activeOffsetX: [-10, 10],
              // }}
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
                onStartShouldSetPanResponder: () => {
                  setScrollEnabled(false);
                  return true;
                },
                onPanResponderRelease: () => {
                  setScrollEnabled(true);
                },
              }}
              onSnapToItem={index => {
                setIndex(Math.round(index));
              }}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    margin: 20,
                    borderRadius: 20,
                  }}>
                  <Image
                    source={item.image}
                    style={{
                      height: 250,
                      width: width,
                      borderRadius: 20,
                      overflow: 'visible',
                      borderWidth: 1,
                    }}
                  />
                </View>
              )}
            />

            <View
              style={{
                alignItems: 'center',
                height: 40,
                bottom: 0,
                backgroundColor: 'transparent',
              }}>
              <AnimatedDotsCarousel
                length={10}
                currentIndex={index}
                maxIndicators={4}
                interpolateOpacityAndColor={false}
                activeIndicatorConfig={{
                  color: Colors.orange,
                  margin: 3,
                  opacity: 1,
                  size: 8,
                }}
                inactiveIndicatorConfig={{
                  color: 'black',
                  margin: 3,
                  opacity: 0.5,
                  size: 8,
                }}
                decreasingDots={[
                  {
                    config: {color: 'white', margin: 3, opacity: 0.5, size: 6},
                    quantity: 1,
                  },
                  {
                    config: {color: 'white', margin: 3, opacity: 0.5, size: 4},
                    quantity: 1,
                  },
                ]}
              />
            </View>
          </View>
          <Text style={styles.subheading}>Restaurants to explore</Text>
          <FlatList
            data={filteredRestaurants}
            scrollEnabled={false}
            keyExtractor={item => item.key}
            renderItem={({item, index}) => (
              <Restaurants
                item={item}
                onPress={() => navigation.navigate('Detailview', {item})}
              />
            )}
          />
        </ScrollView>
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
      </SafeAreaView>
    </View>
  );
};
export default Dashboard;
const styles = StyleSheet.create({
  subheading: {
    fontSize: 22,
    fontFamily: Fonts.Bold,
    color: 'black',
    marginLeft: 10,
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
