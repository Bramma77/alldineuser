import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import Colors from '../../Utilities/Colors';
import Fonts from '../../Utilities/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvailabilityFood from './AvailabilityFood';

const AddDishes = ({route, navigation}) => {
  // const {AccessToken} = route.params;
  const {dishId} = route.params || {};
  const [Dishesname, setDishesname] = useState('');
  const [DishesPrice, setDishesPrice] = useState('');
  const [DishesType, setDishesType] = useState('');
  const [PreparationTime, setPreparationTime] = useState('');
  const [ImageUri, setImageUri] = useState(null);
  const [AccessToken, setAccessToken] = useState(false);
  const [isVeg, setIsVeg] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangevalue = (text, value) => {
    if (value === 'Dishname') setDishesname(text);
    if (value === 'DishPrice') setDishesPrice(text);
    if (value === 'PreparationTime') setPreparationTime(text);
  };

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

  const selectDishType = type => {
    setDishesType(type);
    setIsVeg(type === 'Veg');
  };

  const getUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
      console.log('userdsa', userData);
      setAccessToken(userData.AccessToken);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const ref = storage().ref(`Foodimages / ${filename}`);
      await ref.put(blob);

      // Get the download URL
      const url = await ref.getDownloadURL();
      //setDownloadUrl(url);

      return url;

      console.log('Download URL: ', url);
    } catch (error) {
      console.log('Upload error: ', error);
    }
  };

  const uploadimg = () => {
    setLoading(true);
    // setLoader(true)
    uploadImage(ImageUri)
      .then(downloadUrls => {
        console.log('Images uploaded successfully. URLs:', downloadUrls);

        handlePostData(downloadUrls);
      })
      .catch(error => {
        console.error('Error uploading images:', error);
        Alert.alert(`Error ${error}`);
      });
  };

  const handlePostData = async downloadUrls => {
    try {
      const data = {
        DishName: Dishesname,
        DishPrice: DishesPrice,
        DishType: DishesType,
        DishPreparationType: PreparationTime,
        Availability: 'Available',
        DishesImage: downloadUrls || ImageUri,
        isVeg: isVeg, // Add isVeg property
      };
      const ref = database()
        .ref('RestaurantsData')
        .child(AccessToken)
        .child('Dishes');

      if (dishId) {
        await ref.child(dishId).update(data);
        console.log('Update successfully');
        Alert.alert('Added Success');
        setLoading(false);
      } else {
        await ref.push(data);
        console.log('Added successfully');
        Alert.alert('Added Success');
        setLoading(false);
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const selectImage = async () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeExtra: true,
      mediaType: 'photo', // Specify only photos
      quality: 0.8, // Image quality
      multiple: true,
    };

    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const selectedImages = response.assets.map(asset => ({
          uri: asset.uri,
        }));
        console.log(response);
        // console.log(selectedImages)
        setImageUri(response.assets[0].uri);
        //  setImageUris((prevImageUris) => [...prevImageUris, ...selectedImages]);

        console.log(ImageUri);
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View style={{}}>
          <ActivityIndicator size="large" color={Colors.orange} />
        </View>
      ) : (
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
          <TouchableOpacity style={styles.Button} onPress={selectImage}>
            <Text
              style={{fontSize: 16, fontFamily: Fonts.Light, color: 'white'}}>
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
            keyboardType="numeric"
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
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={uploadimg}
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
            <Text
              style={{fontSize: 16, color: 'white', fontFamily: Fonts.Bold}}>
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};
export default AddDishes;
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
