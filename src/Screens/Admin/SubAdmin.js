import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Utilities/Colors';
import Fonts from '../../Utilities/Fonts';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubAdmin = ({navigation, route}) => {
  const [Restaurantname, setRestaurantname] = useState('');
  const [Address, setAddress] = useState('');
  const [Location, setLocation] = useState('');
  const [ContactNo, setcontactNo] = useState('');
  const [ShortDes, setShortDes] = useState('');
  const [LongDes, setLongDes] = useState('');
  const [ImageUri, setImageUri] = useState(false);
  const [DownloadUrl, setDownloadUrl] = useState('');
  const [Show, setShow] = useState(false);
  const [AccessToken, setAccessToken] = useState(false);
  const [ResData, setResData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const {Resname} = route.params || {};

  const uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const ref = storage().ref(`images/${filename}`);
      await ref.put(blob);

      // Get the download URL
      const url = await ref.getDownloadURL();
      setDownloadUrl(url);

      return url;
    } catch (error) {
      console.log('Upload error: ', error);
    }
  };

  const checkdatabase = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
    const ref = database().ref(`RestaurantsData/${userData.AccessToken}`);
    await ref.on('value', snapshot => {
      if (!snapshot.exists()) {
        setShow(false);
        setLoading(false);
      } else {
        setShow(true);
        const data = snapshot.val();
        setResData(data);
        setRestaurantname(data.Restaurantname);
        setAddress(data.RestaurantAddress);
        setLocation(data.RestaurantLocation);
        setcontactNo(data.ContactNo);
        setShortDes(data.ShortDes);
        setLongDes(data.LongDes);
        setDownloadUrl(data.DownloadUrl);
        setLoading(false);
      }
    });
    return () => {
      ref.off('value', da);
    };
  };

  useEffect(() => {
    checkdatabase();
  }, []);

  const getUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('AdminUser'));
      setAccessToken(userData.AccessToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const uploadimg = () => {
    uploadImage(ImageUri)
      .then(downloadUrls => {
        handlePostData(downloadUrls);
      })
      .catch(error => {
        console.error('Error uploading images:', error);
      });
  };

  const handlePostData = async downloadUrls => {
    try {
      const data = {
        Token: AccessToken,
        Restaurantname: Restaurantname,
        RestaurantAddress: Address,
        RestaurantLocation: Location,
        ContactNo: ContactNo,
        ShortDes: ShortDes,
        LongDes: LongDes,
        DownloadUrl: downloadUrls || DownloadUrl,
      };
      const ref = database().ref('RestaurantsData').child(AccessToken);
      await ref.update(data);
      setModalVisible(true);
      setIsEditing(false);
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
    };

    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const onChangevalue = (text, value) => {
    if (value === 'Restaurantname') setRestaurantname(text);
    if (value === 'Address') setAddress(text);
    if (value === 'Location') setLocation(text);
    if (value === 'ContactNo') setcontactNo(text);
    if (value === 'ShortDes') setShortDes(text);
    if (value === 'LongDes') setLongDes(text);
  };

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View style={Styles.loader}>
          <ActivityIndicator size="large" color={Colors.orange} />
        </View>
      ) : Show ? (
        isEditing ? (
          <ScrollView>
            <View style={{flex: 1}}>
              <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setModalVisible(false)}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      height: 200,
                      width: 300,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'green',
                        fontFamily: Fonts.SemiBold,
                        fontSize: 15,
                      }}>
                      Uploaded Success
                    </Text>
                  </View>
                </TouchableOpacity>
              </Modal>
              <View style={Styles.imagecontainer}>
                {ImageUri !== false ? (
                  <Image
                    source={{uri: ImageUri}}
                    style={{height: '100%', width: '100%'}}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{height: 100, width: 100, borderWidth: 1}}></View>
                )}
              </View>
              <TouchableOpacity style={Styles.Button} onPress={selectImage}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.Light,
                    color: 'white',
                  }}>
                  Choose Image
                </Text>
              </TouchableOpacity>
              <Text style={Styles.TextSubhead}>Restaurant name</Text>
              <TextInput
                onChangeText={text => onChangevalue(text, 'Restaurantname')}
                value={Restaurantname}
                style={Styles.TextInput}
              />
              <Text style={Styles.TextSubhead}>Restaurant Address</Text>
              <TextInput
                onChangeText={text => onChangevalue(text, 'Address')}
                value={Address}
                style={Styles.TextInput}
              />
              <Text style={Styles.TextSubhead}>Restaurant Location</Text>
              <TextInput
                onChangeText={text => onChangevalue(text, 'Location')}
                value={Location}
                style={Styles.TextInput}
              />
              <Text style={Styles.TextSubhead}>Restaurant Contact No</Text>
              <TextInput
                style={Styles.TextInput}
                onChangeText={text => onChangevalue(text, 'ContactNo')}
                value={ContactNo}
                keyboardType="numeric"
              />
              <Text style={Styles.TextSubhead}>
                Restaurant Short Description
              </Text>
              <TextInput
                style={Styles.TextInput}
                onChangeText={text => onChangevalue(text, 'ShortDes')}
                value={ShortDes}
              />
              <Text style={Styles.TextSubhead}>
                Restaurant Long Description
              </Text>
              <TextInput
                style={Styles.TextInput}
                onChangeText={text => onChangevalue(text, 'LongDes')}
                value={LongDes}
              />
              <TouchableOpacity style={Styles.Button} onPress={uploadimg}>
                <Text
                  style={[Styles.Text, {paddingLeft: 20, paddingRight: 20}]}>
                  Save
                </Text>
              </TouchableOpacity>
              <Text style={{marginBottom: 20}}></Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView>
            <View style={{flex: 1}}>
              <Image
                source={{uri: ResData?.DownloadUrl}}
                resizeMode="contain"
                style={{height: 200, width: '100%', marginTop: 50}}
              />
              <View style={{margin: 20}}>
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    color: 'black',
                    fontSize: 22,
                  }}>
                  {ResData?.Restaurantname}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.Medium,
                    marginTop: 10,
                    color: 'gray',
                  }}>
                  {ResData?.RestaurantAddress}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.Medium,
                    marginTop: 10,
                    color: 'gray',
                  }}>
                  {ResData?.RestaurantLocation}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.Medium,
                    marginTop: 10,
                    color: 'gray',
                  }}>
                  {ResData?.ContactNo}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                    marginTop: 10,
                  }}>
                  Short Description
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    fontFamily: Fonts.Medium,
                    marginTop: 10,
                  }}>
                  {ResData?.ShortDes}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.Bold,
                    color: 'black',
                    marginTop: 10,
                  }}>
                  Long Description
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    fontFamily: Fonts.Medium,
                    marginTop: 10,
                  }}>
                  {ResData?.LongDes}
                </Text>
                {/* <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DishesList', {AccessToken})
                    }
                    style={{
                      height: 50,
                      padding: 10,
                      marginTop: 20,
                      borderRadius: 10,
                      borderWidth: 0,
                      alignItems: 'center',
                      backgroundColor: Colors.orange,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        color: 'white',
                        fontSize: 14,
                      }}>
                      View Dishes
                    </Text>
                  </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={{
                    height: 50,
                    paddingLeft: 20,
                    paddingRight: 20,
                    marginTop: 20,
                    borderRadius: 10,
                    borderWidth: 0,
                    alignItems: 'center',
                    backgroundColor: Colors.orange,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      color: 'white',
                      fontSize: 14,
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )
      ) : (
        <ScrollView>
          <View style={{}}>
            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    height: 200,
                    width: 300,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>Uploaded Success</Text>
                </View>
              </TouchableOpacity>
            </Modal>
            <View style={Styles.imagecontainer}>
              {ImageUri != false && (
                <Image
                  source={{uri: ImageUri}}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="cover"
                />
              )}
            </View>
            <TouchableOpacity style={Styles.Button} onPress={selectImage}>
              <Text
                style={{fontSize: 16, fontFamily: Fonts.Light, color: 'white'}}>
                Choose Image
              </Text>
            </TouchableOpacity>
            <Text style={Styles.TextSubhead}>Restaurant name</Text>
            <TextInput
              onChangeText={text => onChangevalue(text, 'Restaurantname')}
              value={Restaurantname}
              style={Styles.TextInput}
            />
            <Text style={Styles.TextSubhead}>Restaurant Address</Text>
            <TextInput
              onChangeText={text => onChangevalue(text, 'Address')}
              value={Address}
              style={Styles.TextInput}
            />
            <Text style={Styles.TextSubhead}>Restaurant Location</Text>
            <TextInput
              onChangeText={text => onChangevalue(text, 'Location')}
              value={Location}
              style={Styles.TextInput}
            />
            <Text style={Styles.TextSubhead}>Restaurant Contact No</Text>
            <TextInput
              style={Styles.TextInput}
              onChangeText={text => onChangevalue(text, 'ContactNo')}
              value={ContactNo}
              keyboardType="numeric"
            />
            <Text style={Styles.TextSubhead}>Restaurant Short Description</Text>
            <TextInput
              style={Styles.TextInput}
              onChangeText={text => onChangevalue(text, 'ShortDes')}
              value={ShortDes}
            />
            <Text style={Styles.TextSubhead}>Restaurant Long Description</Text>
            <TextInput
              style={Styles.TextInput}
              onChangeText={text => onChangevalue(text, 'LongDes')}
              value={LongDes}
            />
            <TouchableOpacity style={Styles.Button} onPress={uploadimg}>
              <Text style={[Styles.Text, {paddingLeft: 20, paddingRight: 20}]}>
                Save
              </Text>
            </TouchableOpacity>
            <Text style={{marginBottom: 20}}></Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  imagecontainer: {
    height: 200,
    width: '90%',

    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  TextInput: {
    height: 50,
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
    color: 'black',
    fontFamily: Fonts.Light,
  },
  TextSubhead: {
    marginTop: 10,
    fontFamily: Fonts.Medium,
    fontSize: 16,
    color: 'gray',
    width: '90%',
    alignSelf: 'center',
  },
  Button: {
    height: 50,
    width: '90%',
    borderRadius: 10,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  Text: {
    fontSize: 18,
    fontFamily: Fonts.Bold,
    color: 'white',
  },
});

export default SubAdmin;
