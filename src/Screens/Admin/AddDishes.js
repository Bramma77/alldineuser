import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import Colors from '../../Utilities/Colors';
import Fonts from '../../Utilities/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddDishes = ({route, navigation}) => {
  const {dishId} = route.params || {};
  const [Dishesname, setDishesname] = useState('');
  const [DishesPrice, setDishesPrice] = useState('');
  const [DishesType, setDishesType] = useState('');
  const [PreparationTime, setPreparationTime] = useState('');
  const [ImageUri, setImageUri] = useState(null);
  const [AccessToken, setAccessToken] = useState(false);
  const [isVeg, setIsVeg] = useState(false);

  useEffect(() => {
    getUser();
    if (dishId) {
      fetchDishData();
    }
  }, [dishId]);

  const fetchDishData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
    const ref = database().ref(
      `RestaurantsData/${userData.AccessToken}/Dishes/${dishId}`,
    );
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    if (data) {
      setDishesname(data.DishName);
      setDishesPrice(data.DishPrice);
      setDishesType(data.DishType);
      setPreparationTime(data.DishPreparationType);
      setImageUri(data.DishesImage);
      setIsVeg(data.isVeg);
    }
  };

  const onChangevalue = (text, value) => {
    if (value === 'Dishname') setDishesname(text);
    if (value === 'DishPrice') setDishesPrice(text);
    if (value === 'PreparationTime') setPreparationTime(text);
  };

  const selectDishType = type => {
    setDishesType(type);
    setIsVeg(type === 'Veg');
  };

  const chooseImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImageUri(imageUri);
    }
  };

  const uploadImage = async () => {
    if (!ImageUri) return null;

    const filename = ImageUri.substring(ImageUri.lastIndexOf('/') + 1);
    const reference = storage().ref(`dishes/${filename}`);
    await reference.putFile(ImageUri);
    return await reference.getDownloadURL();
  };

  const getUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
      setAccessToken(userData.AccessToken);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    const imageUrl = ImageUri != null ? imageUrl : await uploadImage();
    const dishData = {
      DishName: Dishesname,
      DishPrice: DishesPrice,
      DishType: DishesType,
      DishPreparationType: PreparationTime,
      DishesImage: imageUrl || ImageUri,
      isVeg: DishesType === 'Veg',
    };

    if (dishId) {
      // Update existing dish
      await database()
        .ref(`RestaurantsData/${AccessToken}/Dishes/${dishId}`)
        .update(dishData)
        .then(() => console.log('Dish updated successfully.'));
    } else {
      // Add new dish
      await database()
        .ref(`RestaurantsData/${AccessToken}/Dishes`)
        .push(dishData)
        .then(() => console.log('Dish added successfully.'));
    }
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{margin: 20}}>
        <View
          style={{
            height: 200,
            width: 200,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            alignSelf: 'center',
          }}>
          {ImageUri != null && (
            <Image
              source={{uri: ImageUri}}
              style={{height: '100%', width: '100%'}}
            />
          )}
        </View>
        <TouchableOpacity style={styles.Button} onPress={chooseImage}>
          <Text style={{fontSize: 16, fontFamily: Fonts.Light, color: 'white'}}>
            Choose Image
          </Text>
        </TouchableOpacity>
        <Text style={styles.Text}>Enter Dish name</Text>
        <TextInput
          style={styles.TextInput}
          onChangeText={text => onChangevalue(text, 'Dishname')}
          value={Dishesname}
        />
        <Text style={styles.Text}>Enter Dish Price</Text>
        <TextInput
          style={styles.TextInput}
          onChangeText={text => onChangevalue(text, 'DishPrice')}
          value={DishesPrice}
        />
        <Text style={styles.Text}>Choose Dish Type</Text>
        <View style={styles.dishTypeContainer}>
          <TouchableOpacity
            style={[
              styles.dishTypeButton,
              DishesType === 'Veg' && styles.selectedDishType,
            ]}
            onPress={() => selectDishType('Veg')}>
            <Text style={styles.dishTypeText}>Veg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dishTypeButton,
              DishesType === 'Non-Veg' && styles.selectedDishType,
            ]}
            onPress={() => selectDishType('Non-Veg')}>
            <Text style={styles.dishTypeText}>Non-Veg</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.Text}>Enter Dish Preparation Time</Text>
        <TextInput
          style={styles.TextInput}
          onChangeText={text => onChangevalue(text, 'PreparationTime')}
          value={PreparationTime}
        />
        <TouchableOpacity
          onPress={onSubmit}
          style={{
            height: 50,
            width: 100,
            marginTop: 20,
            borderRadius: 10,
            backgroundColor: Colors.orange,
            borderWidth: 1,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 16, color: 'white', fontFamily: Fonts.Bold}}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TextInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    color: 'black',
    paddingLeft: 10,
    fontFamily: Fonts.Medium,
  },
  Text: {
    marginTop: 10,
    fontFamily: Fonts.Medium,
    color: 'gray',
  },
  Button: {
    height: 50,
    alignSelf: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 0,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange,
  },
  dishTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dishTypeButton: {
    flex: 1,
    height: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  selectedDishType: {
    backgroundColor: Colors.orange,
  },
  dishTypeText: {
    color: 'black',
    fontSize: 16,
  },
});

export default AddDishes;
