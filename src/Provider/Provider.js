import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const [Cartcount, setCartcount] = useState(0);
  const [CartItems, setCartItems] = useState([]);
  const [ResId, setResId] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [CurrentUser, setCurrentUser] = useState(null);

  const cartKey = `cart-${CurrentUser}`;

  const saveCart = async cart => {
    try {
      await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart', error);
    }
  };

  const addToCart = async (item, restaurantId) => {
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
            currentCart.items.push(item);
          }
        } else {
          currentCart = {
            restaurantId: restaurantId,
            items: [item],
          };
        }
      } else {
        currentCart = {
          restaurantId: restaurantId,
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
    // setCart([]);
    try {
      await AsyncStorage.removeItem(`cart-${CurrentUser}`);
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  };

  const increaseQuantity = async itemId => {
    const newCart = cart.map(item => {
      if (item.key === itemId) {
        return {...item, Quantity: item.Quantity + 1};
      }
      console.log(item);
      return item;
    });
    setCart(newCart);

    await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(newCart));
    getCartItemCount();
  };

  const decreaseQuantity = async itemId => {
    const newCart = cart.map(item => {
      if (item.key === itemId && item.Quantity > 1) {
        //  const Dishnewp=`${item.DishPrice / item.Quantity}`

        return {...item, Quantity: item.Quantity - 1};
      }
      console.log(item);
      return item;
    });
    console.log(newCart);
    setCart(newCart);
    await AsyncStorage.setItem(`cart-${CurrentUser}`, JSON.stringify(newCart));
    // getCartItemCount()
  };

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('CartItem', jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  useEffect(() => {
    getData();
    getCartItemCount();
    console.log(CartItems);
    const currentUser = auth().currentUser;
    setCurrentUser(currentUser);
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('CartItem');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const getCartItemCount = async () => {
    const storedCart = await AsyncStorage.getItem(`cart-${CurrentUser}`);
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(cartItems);
    setCart(cartItems?.items);
    // setResId(cartItems[0].restaurantId)
    console.log('restaruantid', cartItems);
    setCartcount(cartItems?.items?.length);
    return cartItems.length;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
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
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
