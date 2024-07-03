import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {RestaurantsData} from '../Component/Restaruntdata';
import {Orders} from '../Component/Orders';
import {useNavigation} from '@react-navigation/native';
import {database} from '../Component/addtoWishlist';

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

  const cartKey = `cart-${CurrentUser}`;

  const saveCart = async cart => {
    try {
      await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart', error);
    }
  };

  const currentuser = auth().currentUser?.uid;

  const getResponseWishlist = async () => {
    try {
      const all = await database.getWishlist(currentuser);
      setWishlistdata(all);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const RestaurantsInfo = async () => {
    try {
      const all = await RestaurantsData.HotelList(currentuser);
      setRestaurantsdata(all);
    } catch (error) {
      console.error('Error fetching restaurants data:', error);
    }
  };

  const getorderlist = async () => {
    try {
      const data = await Orders.Orderlist(currentuser);
      setOrderlist(data);
    } catch (error) {
      console.error('Error fetching order list:', error);
    }
  };

  const list = async () => {
    if (currentuser) {
      const wishlistRef = firebase
        .database()
        .ref('wishlist')
        .child(`${currentuser}`);
      wishlistRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data !== null) {
          const finaldata = Object.keys(data);
          setWishlistdata(finaldata);
        } else {
          console.log('No wishlist data');
        }
      });

      // Cleanup listener
      return () => {
        wishlistRef.off();
      };
    }
  };

  useEffect(() => {
    getorderlist();
  }, [currentuser]);

  useEffect(() => {
    RestaurantsInfo();
    getorderlist(currentuser);
    list();
    updateOrderList();
    // getResponseWishlist(currentuser);
  }, [currentuser]);

  const updateOrderList = updatedOrderList => {
    setOrderlist(updatedOrderList);
  };

  const addToCart = async item => {
    try {
      let currentCart = await AsyncStorage.getItem(cartKey);
      currentCart = currentCart ? JSON.parse(currentCart) : null;

      if (currentCart) {
        const existingRestaurantIds = currentCart.items.map(
          c => c.restaurantId,
        );

        if (existingRestaurantIds.includes(item.restaurantId)) {
          const existingItemKeys = currentCart.items.map(c => c.key);

          if (!existingItemKeys.includes(item.key)) {
            currentCart?.items.push(item);
          }
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
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(newCart));
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await AsyncStorage.removeItem(`cart-${CurrentUser}`);
      navigation.navigate('Drawer');
    } catch (error) {
      console.error('Error clearing cart', error);
    }
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
    await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(newCart));
    getCartItemCount();
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
    await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(newCart));
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
      const jsonValue = await AsyncStorage.getItem(`cart-${CurrentUser}`);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  const getCartItemCount = async () => {
    const storedCart = await AsyncStorage.getItem(`cart-${CurrentUser}`);
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(cartItems);
    setCart(cartItems);
    if (cartItems?.items) {
      setResId(cartItems?.items[0]?.restaurantId);
    }
    setCartcount(cartItems?.items?.length);
    return cartItems;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        setCartcount,
        Cartcount,
        getCartItemCount,
        CartItems,
        increaseQuantity,
        decreaseQuantity,
        ResId,
        confirm,
        setConfirm,
        CurrentUser,
        Wishlistdata,
        setWishlistdata,
        getorderlist,
        getResponseWishlist,
        Restaurantdata,
        orderlist,
        updateOrderList, // Ensure updateOrderList is provided in context
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
