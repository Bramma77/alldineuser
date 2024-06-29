import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {RestaurantsData} from '../Component/Restaruntdata';
import {useCart} from '../Provider/Provider';
import Restaurants from '../Component/Restaurants';

const Favorite = ({navigation}) => {
  const {Restaurantdata, Wishlistdata} = useCart();
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
