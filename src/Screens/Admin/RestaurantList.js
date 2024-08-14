import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import Fonts from '../../Utilities/Fonts';
import Colors from '../../Utilities/Colors';

const RestaurantList = ({navigation}) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const ref = database().ref('RestaurantsData');
      ref.on('value', snapshot => {
        const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
        const formattedData = items.map(([key, value]) => ({key, ...value}));
        setRestaurants(formattedData);
      });
      return () => ref.off('value');
    };

    fetchRestaurants();

    // Cleanup function to remove listener on unmount
    return () => {
      database().ref().off('value'); // Ensure correct reference here based on your Firebase setup
    };
  }, []);

  const navigateToRestaurantDetail = restaurant => {
    navigation.navigate('RestataurantDetail', {restaurant});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigateToRestaurantDetail(item)}
      style={styles.restaurantContainer}>
      <Image style={styles.image} source={{uri: item.DownloadUrl}} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.Restaurantname}</Text>
        <Text style={styles.location}>{item.RestaurantLocation}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Restaurants List</Text> */}
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

export default RestaurantList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    color: Colors.orange,
    fontSize: 25,
    textAlign: 'center',
    fontFamily: Fonts.Bold,
    marginTop: 20,
    marginBottom: 10,
  },
  restaurantContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#dcdcdc',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginHorizontal: 15,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontFamily: Fonts.Medium,
  },
  location: {
    color: 'black',
    fontSize: 15,
    fontFamily: Fonts.Regular,
    marginTop: 5,
  },
});
