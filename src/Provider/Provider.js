import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {RestaurantsData} from '../Component/Restaruntdata';
import {Orders} from '../Component/Orders';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

const CartContext = createContext();

export const CartProvider = ({children}) => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [Cartcount, setCartcount] = useState(0);
  const [CartItems, setCartItems] = useState([]);
  const [ResId, setResId] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [CurrentUser, setCurrentUser] = useState('');
  const [Wishlistdata, setWishlistdata] = useState([]);
  const [Restaurantdata, setRestaurantsdata] = useState([]);
  const [orderlist, setOrderlist] = useState([]);
  const [ResLocation, setResLocation] = useState('');
  const [cartHasItems, setCartHasItems] = useState(false);

  const cartKey = `cart-${CurrentUser}`;

  const saveCart = async cart => {
    try {
      await AsyncStorage.setItem(`cart`, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart', error);
    }
  };

  const currentuser = auth().currentUser?.uid;

  // const getResponseWishlist = async () => {
  //   try {
  //     const all = await database.getWishlist(currentuser);
  //     setWishlistdata(all);
  //   } catch (error) {
  //     console.error('Error fetching wishlist:', error);
  //   }
  // };

  const RestaurantsInfo = async () => {
    try {
      const all = await RestaurantsData.HotelList(currentuser);
      setRestaurantsdata(all);
    } catch (error) {
      console.error('Error fetching restaurants data:', error);
    }
  };
  const [formattedOrders, setFormattedOrders] = useState([]);
  useEffect(() => {
    if (orderlist && orderlist.length > 0) {
      const fetchReviews = async () => {
        const reviewsSnapshot = await firebase
          .database()
          .ref('reviews')
          .once('value');
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

  const getorderlist = async currentuser => {
    try {
      if (currentuser) {
        const data = await Orders.Orderlist(currentuser);
        setOrderlist(data);
      }
    } catch (error) {
      console.error('Error fetching order list:', error);
    }
  };

  useEffect(() => {
    getorderlist(currentuser);
  }, []);
  const getWishlist = async currentuser => {
    const wishlistRef = firebase
      .database()
      .ref('wishlist')
      .child(`${currentuser}`);
    wishlistRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data !== null) {
        const finaldata = Object.keys(data);
        setWishlistdata(finaldata);
        console.log('fina', finaldata);
      } else {
        setWishlistdata([]);
        console.log('No wishlist data');
      }
    });

    // Cleanup listener
    return () => {
      wishlistRef.off();
    };
  };

  useEffect(() => {
    RestaurantsInfo();

    getWishlist(currentuser);
  }, []);

  const updateOrderList = updatedOrderList => {
    setOrderlist(updatedOrderList);
  };

  const addToCart = async item => {
    try {
      let currentCart = await AsyncStorage.getItem('cart');
      currentCart = currentCart ? JSON.parse(currentCart) : null;
      console.log('currentcart', currentCart);

      if (currentCart) {
        const existingRestaurantIds = currentCart.items.map(
          c => c.restaurantId,
        );
        console.log('existingresids', existingRestaurantIds);

        if (existingRestaurantIds.includes(item.restaurantId)) {
          const existingItemKeys = currentCart.items.map(c => c.key);

          if (!existingItemKeys.includes(item.key)) {
            currentCart?.items.push(item);
          }
          console.log('existingresids', existingRestaurantIds);
        } else {
          currentCart = {
            items: [item],
          };
        }
      } else {
        currentCart = {
          items: [item],
        };
      }

      await saveCart(currentCart);
      setCart(currentCart);
      console.log('Cart updated:', currentCart);
      getCartItemCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async itemId => {
    console.log('cart', cart);
    const newCart = cart?.items.filter(item => item.key !== itemId);
    setCart({items: [...newCart]});
    await AsyncStorage.setItem(
      `cart`,
      JSON.stringify({
        items: [...newCart],
      }),
    );
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await AsyncStorage.removeItem(`cart`);
      navigation.navigate('Drawer');
    } catch (error) {
      console.error('Error clearing cart', error);
    }
    getCartItemCount();
  };

  const increaseQuantity = async itemId => {
    const newCart = {
      items: cart.items.map(item => {
        if (item.key === itemId) {
          return {...item, Quantity: item.Quantity + 1};
        }
        return item;
      }),
    };
    setCart(newCart);
    await AsyncStorage.setItem(`cart`, JSON.stringify(newCart));
    // getCartItemCount();
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
    getCartItemCount();
  };

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('CartItem', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
    getCartItemCount();
    const currentUser1 = auth().currentUser?.uid;
    setCurrentUser(currentUser1);
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`cart`);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  const getCartItemCount = async () => {
    const storedCart = await AsyncStorage.getItem(`cart`);
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(cartItems);
    setCart(cartItems);
    if (cartItems?.items) {
      setResId(cartItems?.items[0]?.restaurantId);
      setResLocation(cartItems?.items[0]?.RestaurantLocation);
    }
    setCartcount(cartItems?.items?.length || 0);
    if (cartItems?.items?.length > 0) {
      setCartHasItems(true);
    } else {
      setCartHasItems(false);
    }
    return cartItems;
  };

  const removeFromWishlist = async key => {
    const currentuser = auth().currentUser.uid;
    firebase
      .database()
      .ref(`wishlist/${currentuser}/${key}`)
      .remove()
      .then(() => {
        console.log('Removed from wishlist successfully!');
        // getWishlist(currentuser);
      })
      .catch(error => {
        console.error('Error removing from wishlist: ', error);
      });
  };
  const addtowish = async key => {
    const currentuser = auth().currentUser.uid;
    console.log('key', key);
    firebase
      .database()
      .ref(`wishlist/${currentuser}/${key}`)
      .set(true)
      .then(() => {
        console.log('Added to wishlist successfully!');
        // getWishlist(currentuser);
      })
      .catch(error => {
        console.error('Error adding to wishlist: ', error);
      });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        getWishlist,
        clearCart,
        addtowish,
        removeFromWishlist,
        setCartcount,
        Cartcount,
        getCartItemCount,
        CartItems,
        increaseQuantity,
        decreaseQuantity,
        ResId,
        ResLocation,
        confirm,
        setConfirm,
        CurrentUser,
        Wishlistdata,
        getorderlist,
        Restaurantdata,
        orderlist,
        formattedOrders,
        cartHasItems,
        setCartHasItems,
        setFormattedOrders,
        updateOrderList, // Ensure updateOrderList is provided in context
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
