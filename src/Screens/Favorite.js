import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {RestaurantsData} from '../Component/Restaruntdata';
import {useCart} from '../Provider/Provider';
import Restaurants from '../Component/Restaurants';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const Favorite = ({navigation}) => {
  // const [Wishlistdata, setWishlistdata] = useState([]);
  const {Restaurantdata, Wishlistdata, setWishlistdata} = useCart();
  // const [Restaurantdata, setRestaurantsdata] = useState([]);
  const currentuser = auth().currentUser?.uid;

  useEffect(() => {
    list();
  }, []);

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
  const getWishlistProducts = () => {
    return Restaurantdata.filter(product => Wishlistdata.includes(product.key));
  };

  return (
    <View>
      <FlatList
        data={getWishlistProducts()}
        keyExtractor={item => item.key}
        renderItem={({item, index}) => (
          <Restaurants
            item={item}
            onPress={() => navigation.navigate('Detailview', {item})}
          />
        )}
      />
    </View>
  );
};
export default Favorite;
