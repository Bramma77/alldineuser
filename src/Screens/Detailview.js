import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {useCart} from '../Provider/Provider';
import Fonts from '../Utilities/Fonts';
import Colors from '../Utilities/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DetailView = ({route, navigation}) => {
  const {item} = route.params;
  const {addToCart, Cartcount} = useCart();
  const [Dataview, setDataview] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    veg: false,
    nonVeg: false,
    price: '',
  });
  const [quantities, setQuantities] = useState({});
  const [cartHasItems, setCartHasItems] = useState(false); // State to store quantities for each item
  const reskey = item.key;

  useEffect(() => {
    if (item && item.Dishes) {
      const formattedData = Object.keys(item.Dishes).map(dish => ({
        key: dish,
        ...item.Dishes[dish],
      }));
      setDataview(formattedData);
    }
  }, [item]);

  useEffect(() => {
    checkCartItems();
  }, [quantities]);

  // const applyFilter = (filter) => {
  //   setSelectedFilter(filter);
  //   let sortedData = [...Dataview];
  //   if (filter === 'Price - Low to High') {
  //     sortedData.sort((a, b) => a.DishPrice - b.DishPrice);
  //   } else if (filter === 'Price - High to Low') {
  //     sortedData.sort((a, b) => b.DishPrice - a.DishPrice);
  //   } else if (filter === 'Veg') {
  //     sortedData = sortedData.filter(dish => dish.isVeg); // Display only Veg dishes
  //   } else if (filter === 'Non-Veg') {
  //     sortedData = sortedData.filter(dish => !dish.isVeg); // Display only Non-Veg dishes
  //   }
  //   setDataview(sortedData);
  //   setModalVisible(false);
  // };

  const applyFilter = () => {
    let filteredData = [...Dataview];

    if (selectedFilter.veg) {
      filteredData = filteredData.filter(dish => dish.isVeg);
    }

    if (selectedFilter.nonVeg) {
      filteredData = filteredData.filter(dish => !dish.isVeg);
    }

    if (selectedFilter.price === 'Price - Low to High') {
      filteredData.sort((a, b) => a.DishPrice - b.DishPrice);
    } else if (selectedFilter.price === 'Price - High to Low') {
      filteredData.sort((a, b) => b.DishPrice - a.DishPrice);
    }

    setDataview(filteredData);
    setModalVisible(false);
  };

  const toggleFilter = filterType => {
    setSelectedFilter(prevFilters => {
      if (filterType === 'veg') {
        return {...prevFilters, veg: !prevFilters.veg};
      }
      if (filterType === 'nonVeg') {
        return {...prevFilters, nonVeg: !prevFilters.nonVeg};
      }
      if (
        filterType === 'Price - Low to High' ||
        filterType === 'Price - High to Low'
      ) {
        return {...prevFilters, price: filterType};
      }
      return prevFilters; // Return the previous filters if no condition matches
    });
  };

  const handleAddToCart = dish => {
    addToCart({...dish, restaurantId: reskey, Quantity: 1}, reskey);
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

  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        <Image
          source={{uri: item.DownloadUrl}}
          style={{width: '100%', height: 200}}
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={'white'}
            style={{marginLeft: 20, position: 'absolute', marginTop: 10}}
          />
        </TouchableOpacity>
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
        <View style={styles.wrapContainer}>
          <Text style={styles.text}>North Indian</Text>
          <Octicons
            name={'dot-fill'}
            size={12}
            color={'gray'}
            style={styles.icon}
          />
          <Text style={styles.text}>South Indian</Text>
          <Octicons
            name={'dot-fill'}
            size={12}
            color={'gray'}
            style={styles.icon}
          />
          <Text style={styles.text}>Chinese</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>4.2</Text>
          <FontAwesome name={'star'} size={12} color={'white'} />
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons name={'timer'} size={16} color={'green'} />
          <Text style={styles.infoText}>27 mins | </Text>
          <Text style={styles.infoText}>Tambaram</Text>
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
          data={Dataview}
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
                  {quantities[item.key] ? (
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => handleDecreaseQuantity(item.key)}>
                        <Text style={styles.quantityButton}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {quantities[item.key]}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleIncreaseQuantity(item.key)}>
                        <Text style={styles.quantityButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddToCart(item)}>
                      <Text style={styles.addButtonText}>ADD+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
      {cartHasItems && (
        <View style={styles.cartContainer}>
          <Text style={styles.cartText}>{Cartcount} - Product Quantity</Text>
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
    marginTop: responsiveHeight(1),
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
});

export default DetailView;
