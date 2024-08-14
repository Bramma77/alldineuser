import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {useCart} from '../Provider/Provider';
import Fonts from '../Utilities/Fonts';
import Colors from '../Utilities/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';

const DetailView = ({route, navigation}) => {
  const {item} = route.params;
  const {
    addToCart,
    Cartcount,
    setCart,
    CurrentUser,
    cart,
    getCartItemCount,
    cartHasItems,
    setCartHasItems,
    increaseQuantity,
    // decreaseQuantity,
  } = useCart();
  const [Dataview, setDataview] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    veg: false,
    nonVeg: false,
    price: '',
  });
  const [quantities, setQuantities] = useState({});
  // const [cartHasItems, setCartHasItems] = useState(false); // State to store quantities for each item
  const reskey = item.key;
  const resname = item.Restaurantname;
  const RestaurantLocation = item.RestaurantLocation;

  const [Quantitycount, setQuantitycount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    console.log(item);
    if (item && item.Dishes) {
      const formattedData = Object.keys(item.Dishes).map(dish => ({
        key: dish,
        ...item.Dishes[dish],
      }));
      setDataview(formattedData);
      setFilteredData2(formattedData);
    }
  }, [item]);

  useEffect(() => {
    checkCartItems();
  }, [quantities]);

  const applyClearAll = () => {
    navigation.navigate('Drawer');
  };

  // useEffect(()=>{
  //   navigation.goBack()

  // },[])

  const applyFilter = () => {
    let filteredData = [...Dataview];

    console.log(filteredData, 'sd: ', Dataview);

    // Apply veg or nonVeg filter
    if (selectedFilter.veg) {
      filteredData = Dataview.filter(dish => dish.isVeg);
      // setDataview(filteredData);
      setFilteredData2(filteredData);
      setModalVisible(false);
    } else if (selectedFilter.nonVeg) {
      filteredData = Dataview.filter(dish => !dish.isVeg);
      setFilteredData2(filteredData);
      setModalVisible(false);
    }

    // Sorting by price if selected
    if (selectedFilter.price === 'Price - Low to High') {
      filteredData.sort((a, b) => a.DishPrice - b.DishPrice);
      setFilteredData2(filteredData);
      setModalVisible(false);
    } else if (selectedFilter.price === 'Price - High to Low') {
      filteredData.sort((a, b) => b.DishPrice - a.DishPrice);
      setFilteredData2(filteredData);
      setModalVisible(false);
    }
  };

  const toggleFilter = filterType => {
    setSelectedFilter(prevFilters => {
      // Reset other filters when toggling between veg and nonVeg
      if (filterType === 'veg') {
        return {veg: !prevFilters.veg, nonVeg: false, price: prevFilters.price};
      }
      if (filterType === 'nonVeg') {
        return {
          nonVeg: !prevFilters.nonVeg,
          veg: false,
          price: prevFilters.price,
        };
      }
      if (
        filterType === 'Price - Low to High' ||
        filterType === 'Price - High to Low'
      ) {
        return {
          veg: prevFilters.veg,
          nonVeg: prevFilters.nonVeg,
          price: filterType,
        };
      }
      return prevFilters; // Return the previous filters if no condition matches
    });
  };

  const handleAddToCart = dish => {
    console.log('dish', dish);
    const updatedCart = {dish};
    if (updatedCart[item.key]) {
      updatedCart[item.key].Quantity += 1;
    } else {
      updatedCart[item.key] = {...dish, Quantity: 1};
    }
    addToCart(dish);
    setQuantities(prev => ({...prev, [dish.key]: 1}));
    setCartHasItems(true); // Set cartHasItems to true
  };

  const handleIncreaseQuantity = key => {
    setQuantities(prev => ({...prev, [key]: prev[key] + 1}));
  };

  const handleDecreaseQuantity = key => {
    setQuantities(prev => {
      const updatedQuantity = prev[key] - 1;
      if (updatedQuantity > 0) {
        return {...prev, [key]: updatedQuantity};
      } else {
        const {[key]: _, ...rest} = prev;
        return rest;
      }
    });
  };

  const checkCartItems = () => {
    const hasItems = Object.values(quantities).some(quantity => quantity > 0);
    setCartHasItems(hasItems);
  };

  const checkQuantitycount = id => {
    // cart.map(item=>{
    //   if(item.key===cart.key){

    //   }
    // })
    // setQuantitycount(currentCart)
    console.log('cart', cart);

    if (cart) {
      let currentCart;

      if (cart.items) currentCart = cart?.items.find(c => c.key === id);
      else currentCart = cart.find(c => c.key === id);
      if (currentCart) return currentCart.Quantity;
      else return 0;
    } else return 0;
  };
  const increaseCount = async itemId => {
    // const updatedCart = item;
    // updatedCart[item.key].Quantity += 1;
    // setCart(updatedCart);
    // await AsyncStorage.setItem(
    //   `cart-${CurrentUser}`,
    //   JSON.stringify(updatedCart),
    // );

    const newCart = cart?.items.map(item => {
      console.log('itemlist', item);
      if (item.key === itemId) {
        return {...item, Quantity: item.Quantity + 1};
      }
      console.log('cartitem', item);
      return item;
    });
    setCart(newCart);

    await AsyncStorage.setItem(`cart`, JSON.stringify(newCart));
  };
  const decreaseCount = async item => {
    const updatedCart = {...item};
    if (updatedCart[item.key].count > 1) {
      updatedCart[item.id].count -= 1;
    } else {
      delete updatedCart[item.id];
    }
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const decreaseQuantity = async itemId => {
    const newCart = {
      items: cart.items.map(item => {
        if (item.key === itemId) {
          if (item.Quantity > 1) {
            return {...item, Quantity: item.Quantity - 1};
          } else {
            Alert.alert(
              'Minimum Quantity',
              'The minimum quantity is 1. You cannot reduce it further.',
            );
            return item; // Return the item without changing the quantity
          }
        }
        return item;
      }),
    };
    setCart(newCart);
    await AsyncStorage.setItem(`cart`, JSON.stringify(newCart));
    //  getCartItemCount();
  };

  useEffect(() => {
    if (item && item.Dishes) {
      const formattedData = Object.keys(item.Dishes).map(dish => ({
        key: dish,
        ...item.Dishes[dish],
      }));
      setDataview(formattedData);
      setFilteredData1(formattedData);
    }
  }, [item]);

  const toggleSearch = () => {
    setShowSearchBar(!showSearchBar); // Open search modal
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredData1(Dataview); // If search query is empty, show all dishes
    } else {
      const lowercasedQuery = text.toLowerCase();
      const filtered = Dataview.filter(item =>
        item.DishName.toLowerCase().includes(lowercasedQuery),
      );
      setFilteredData1(filtered);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getCartItemCount();

      return () => {};
    }, []),
  );
  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        <Image
          source={{uri: item.DownloadUrl}}
          style={{width: '100%', height: 200}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={{marginLeft: 15}}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color={'white'} />
          </TouchableOpacity>
          {showSearchBar ? (
            <View
              style={{
                width: 270,
                marginHorizontal: responsiveWidth(3),
                borderRadius: 10,
                backgroundColor: '#fff',
                elevation: 10,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Feather
                style={{marginLeft: 10}}
                name={'search'}
                size={18}
                color={Colors.orange}
              />
              <TextInput
                style={{
                  fontSize: 16,
                  height: 45,
                  color: 'black',
                  flex: 1,
                }}
                placeholderTextColor={'gray'}
                placeholder="Search"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={toggleSearch} style={{marginLeft: 255}}>
              <Ionicons name="search" size={25} color={'white'} />
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={{marginLeft: 45}} onPress={toggleHeart}>
            <Entypo
              name={isHeartFilled ? 'heart' : 'heart-outlined'}
              size={28}
              color={'red'}
            />
          </TouchableOpacity> */}
        </View>

        <Text
          style={{
            fontFamily: Fonts.Bold,
            fontSize: 25,
            color: 'black',
            marginTop: responsiveHeight(1),
            textAlign: 'center',
          }}>
          {item.Restaurantname}
        </Text>
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
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>4.2</Text>
            <FontAwesome name={'star'} size={12} color={'white'} />
          </View>

          <View style={styles.infoContainer}>
            <Text
              style={{
                color: 'gray',
                fontSize: 20,
                marginLeft: 5,
                fontFamily: Fonts.LightP,
              }}>
              |
            </Text>
            <Entypo name={'location-pin'} size={16} color={'green'} />
            <Text style={styles.infoText}>{item.RestaurantLocation}</Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: 'lightgray',
            margin: responsiveWidth(2),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: responsiveWidth(2),
          }}>
          <Text
            style={{
              fontFamily: Fonts.Bold,
              fontSize: 20,
              color: 'black',
              marginTop: responsiveHeight(2),
              marginLeft: responsiveWidth(3),
            }}>
            Recommended for you
          </Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setModalVisible(true)}>
              <FontAwesome6 name={'sliders'} size={12} color={'black'} />
              <Text style={styles.filterButtonText}>Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={searchQuery ? filteredData1 : filteredData2}
          scrollEnabled={false}
          keyExtractor={(item, index) => item.key}
          renderItem={({item, index}) => (
            <View style={styles.foodItemContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: responsiveHeight(1),
                }}>
                <View>
                  <Text style={styles.foodItemTitle}>{item.DishName}</Text>

                  {/* <Text style={styles.foodItemTitle}>{item.Availability}</Text> */}

                  {/* <Text style={styles.foodItemTitle}>{item.DishType}</Text> */}
                  <View style={styles.foodItemRating}>
                    <Text style={styles.ratingText}>4.4</Text>
                    <FontAwesome name={'star'} size={12} color={'white'} />
                  </View>
                  <Text style={styles.foodItemPrice}>₹ {item.DishPrice}</Text>
                  <Text
                    style={styles.foodItemDescription}
                    numberOfLines={expanded ? null : 2}>
                    A restaurant is a business that prepares and serves food and
                    drinks to customers.
                  </Text>
                  <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.seeMore}>
                      {expanded ? 'See less' : '... See more'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={{uri: item.DishesImage}}
                    style={{width: 145, height: 145, borderRadius: 10}}
                  />
                  {quantities[item.key] &&
                  checkQuantitycount(item.key) !== 0 ? (
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(item.key)}>
                        <Text style={styles.quantityButton}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {/* {cart?.[item.key]} */}
                        {checkQuantitycount(item.key)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => increaseQuantity(item.key)}>
                        <Text style={styles.quantityButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      {item.Availability === 'NotAvailable' ? (
                        <TouchableOpacity style={styles.addButton}>
                          <Text style={styles.addButtonText}>
                            Not Available
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={
                            () =>
                              handleAddToCart({
                                ...item,
                                restaurantId: reskey,
                                restaurantname: resname,
                                RestaurantLocation: RestaurantLocation,
                                Quantity: 1,
                              })
                            // addToCart({...item, restaurantId: reskey, Quantity: 1})
                          }>
                          <Text style={styles.addButtonText}>ADD+</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              </View>
            </View>
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
      {modalVisible && (
        <View style={styles.overlay}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: responsiveHeight(40),
                marginBottom: responsiveHeight(1),
              }}>
              <AntDesign name={'closecircle'} size={50} color={'black'} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                elevation: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontFamily: Fonts.Bold,
                  margin: responsiveWidth(5),
                }}>
                Filters and Sorting
              </Text>
              <ScrollView style={{backgroundColor: '#f5f5f5'}}>
                <View
                  style={{
                    borderRadius: 10,
                    marginRight: responsiveWidth(3),
                    marginLeft: responsiveWidth(3),
                    backgroundColor: 'white',
                    elevation: 10,
                    paddingTop: responsiveHeight(1),
                    paddingBottom: responsiveHeight(2),
                    marginTop: responsiveHeight(1),
                    marginBottom: responsiveHeight(1),
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 16,
                      fontFamily: Fonts.SemiBold,
                      margin: responsiveHeight(1),
                    }}>
                    Sort by
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginHorizontal: responsiveHeight(3),
                      marginTop: responsiveHeight(1),
                    }}>
                    <TouchableOpacity
                      onPress={() => toggleFilter('Price - Low to High')}
                      style={{
                        width: responsiveWidth(40),
                        padding: responsiveHeight(0.5),
                        elevation: 10,
                        justifyContent: 'center',
                        backgroundColor:
                          selectedFilter.price === 'Price - Low to High'
                            ? 'lightgray'
                            : 'white',
                        borderRadius: 10,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          fontFamily: Fonts.Regular,
                        }}>
                        Price - low to high
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleFilter('Price - High to Low')}
                      style={{
                        width: responsiveWidth(40),
                        padding: responsiveHeight(0.5),
                        elevation: 10,
                        justifyContent: 'center',
                        backgroundColor:
                          selectedFilter.price === 'Price - High to Low'
                            ? 'lightgray'
                            : 'white',
                        borderRadius: 10,
                        alignItems: 'center',
                        marginHorizontal: responsiveWidth(5),
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          fontFamily: Fonts.Regular,
                        }}>
                        Price - high to low
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    borderRadius: 10,
                    marginRight: responsiveWidth(3),
                    marginLeft: responsiveWidth(3),
                    backgroundColor: 'white',
                    elevation: 10,
                    paddingTop: responsiveHeight(1),
                    paddingBottom: responsiveHeight(2),
                    marginTop: responsiveHeight(1),
                    marginBottom: responsiveHeight(1),
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 16,
                      fontFamily: Fonts.SemiBold,
                      margin: responsiveHeight(1),
                    }}>
                    Veg/Non-veg preference
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginHorizontal: responsiveHeight(3),
                      marginTop: responsiveHeight(1),
                    }}>
                    <TouchableOpacity
                      onPress={() => toggleFilter('veg')}
                      style={{
                        paddingHorizontal: responsiveWidth(3),
                        paddingVertical: responsiveHeight(0.5),
                        elevation: 10,
                        justifyContent: 'center',
                        backgroundColor: selectedFilter.veg
                          ? 'lightgray'
                          : 'white',
                        borderRadius: 10,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          fontFamily: Fonts.Regular,
                        }}>
                        Veg
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleFilter('nonVeg')}
                      style={{
                        paddingHorizontal: responsiveWidth(3),
                        paddingVertical: responsiveHeight(0.5),
                        elevation: 10,
                        justifyContent: 'center',
                        backgroundColor: selectedFilter.nonVeg
                          ? 'lightgray'
                          : 'white',
                        borderRadius: 10,
                        alignItems: 'center',
                        marginHorizontal: responsiveWidth(5),
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          fontFamily: Fonts.Regular,
                        }}>
                        Non-veg
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(1),
                }}>
                <TouchableOpacity
                  onPress={() => setSelectedFilter('')}
                  style={{
                    paddingHorizontal: responsiveWidth(5),
                    borderRadius: 5,
                  }}>
                  <Text
                    onPress={applyClearAll}
                    style={{
                      fontSize: 18,
                      margin: responsiveHeight(2),
                      fontFamily: Fonts.SemiBold,
                      color: Colors.orange,
                    }}>
                    Clear All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => applyFilter()}
                  style={{
                    paddingHorizontal: responsiveWidth(5),
                    backgroundColor: Colors.orange,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      margin: responsiveHeight(2),
                      fontFamily: Fonts.SemiBold,
                      color: Colors.white,
                    }}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: responsiveHeight(1),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    fontSize: 12,
    color: 'gray',
    fontFamily: Fonts.Regular,
  },
  icon: {
    marginHorizontal: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    width: 35,
    borderRadius: 5,
    height: 20,
    alignSelf: 'center',
    marginTop: responsiveHeight(1),
  },
  ratingText: {
    fontSize: 12,
    color: 'white',
    marginRight: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  infoText: {
    fontSize: 13,
    color: 'gray',
    marginTop: responsiveHeight(0.4),
    fontFamily: Fonts.Regular,
  },
  filterContainer: {
    alignItems: 'flex-end',
    marginRight: responsiveWidth(3),
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 5,
    marginTop: responsiveHeight(1),
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: 'black',
  },
  foodItemContainer: {
    padding: responsiveWidth(3),
    backgroundColor: Colors.white,
    elevation: 10,
  },
  foodItemTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: 16,
    color: 'black',
    width: responsiveWidth(45),
  },
  foodItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    width: 35,
    borderRadius: 5,
    height: 20,
    justifyContent: 'center',
    marginTop: responsiveHeight(0.5),
  },
  foodItemPrice: {
    fontFamily: Fonts.Regular,
    fontSize: 16,
    color: 'black',
    marginTop: responsiveHeight(0.5),
  },
  foodItemDescription: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    color: 'gray',
    marginTop: responsiveHeight(0.5),
    width: responsiveWidth(45),
  },
  seeMore: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    color: Colors.orange,
    marginTop: responsiveHeight(0.5),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.orange,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: responsiveHeight(-2.5),
  },
  quantityButton: {
    fontFamily: Fonts.Bold,
    fontSize: 16,
    color: Colors.white,
  },
  quantityText: {
    fontFamily: Fonts.Regular,
    fontSize: 16,
    color: Colors.white,
    paddingHorizontal: 25,
  },
  addButton: {
    borderWidth: 1,
    borderColor: Colors.orange,
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 37,
    marginTop: responsiveHeight(-2.5),
  },
  addButtonText: {
    fontFamily: Fonts.Bold,
    fontSize: 14,
    color: Colors.orange,
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
  cartButtonText: {
    fontFamily: Fonts.Bold,
    fontSize: 16,
    color: Colors.orange,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.Bold,
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.orange,
    borderRadius: 5,
  },
  modalButtonText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: 'black',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.orange,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    fontFamily: Fonts.Bold,
    fontSize: 14,
    color: 'white',
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
});

export default DetailView;
