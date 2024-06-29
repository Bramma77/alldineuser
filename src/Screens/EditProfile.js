import React, {useState, useRef, useEffect} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import Fonts from '../Utilities/Fonts';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'; // Import Firebase Realtime Database

const AnimatedTextInput = ({label, value, editable, onChangeText, onPress}) => {
  if (editable === undefined) {
    editable = false;
  }

  if (onPress === undefined) {
    onPress = null;
  }

  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    if (value) {
      setIsFocused(true);
      Animated.timing(animatedIsFocused, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedIsFocused, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
      Animated.timing(animatedIsFocused, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute',
    left: 10,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: 'gray',
    backgroundColor: 'white',
    paddingHorizontal: 2,
  };

  return (
    <TouchableOpacity
      onPress={editable && onPress ? onPress : null}
      activeOpacity={editable ? 0.5 : 1}>
      <View style={styles.input}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={styles.text}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          value={value}
          editable={editable && !onPress}
        />
      </View>
    </TouchableOpacity>
  );
};

const EditProfile = () => {
  const [editable, setEditable] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    gender: '',
  });
  const [initialProfileData, setInitialProfileData] = useState(null);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const currentuser = auth().currentUser?.uid;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const userRef = database().ref(`usersList/${currentuser}`);
        userRef.on('value', snapshot => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setProfileData(userData);
            setInitialProfileData(userData);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadProfileData();
  }, []);

  const handleEdit = () => {
    setEditable(true);
  };

  const handleUpdate = async () => {
    try {
      await database().ref(`usersList/${currentuser}`).set(profileData);
      setInitialProfileData(profileData);
      setEditable(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (key, value) => {
    setProfileData({...profileData, [key]: value});
  };

  const hasChanges =
    JSON.stringify(profileData) !== JSON.stringify(initialProfileData);

  const handleGenderSelect = gender => {
    handleChange('gender', gender);
    setIsGenderModalVisible(false);
  };

  const handleDateConfirm = date => {
    const selectedDate = moment(date).format('DD/MM/YYYY');
    if (moment(date).isSameOrBefore(moment(), 'day')) {
      handleChange('dob', selectedDate);
    } else {
      alert('Please select a date on or before today.');
    }
    setDatePickerVisible(false);
  };

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const closeDatePicker = () => {
    setDatePickerVisible(false);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#f3f3f3',
      }}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profileData.name ? profileData.name.charAt(0) : ' '}
          </Text>
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
          <Feather name={'edit'} size={15} color={'black'} />
        </TouchableOpacity>
        <AnimatedTextInput
          label="Name"
          value={profileData.name}
          editable={editable}
          onChangeText={text => handleChange('name', text)}
        />
        <AnimatedTextInput
          label="Mobile"
          value={profileData.mobile}
          editable={editable}
          onChangeText={text => handleChange('mobile', text)}
        />
        <AnimatedTextInput
          label="Email"
          value={profileData.email}
          editable={editable}
          onChangeText={text => handleChange('email', text)}
        />
        <AnimatedTextInput
          label="D.O.B"
          value={profileData.dob}
          editable={editable}
          onPress={openDatePicker}
        />
        <AnimatedTextInput
          label="Gender"
          value={profileData.gender}
          editable={editable}
          onPress={() => setIsGenderModalVisible(true)}
        />
      </View>
      {editable && (
        <TouchableOpacity
          style={[
            styles.updateButton,
            hasChanges && {backgroundColor: 'skyblue'},
          ]}
          onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      )}
      <Modal
        transparent={true}
        visible={isGenderModalVisible}
        animationType="slide"
        onRequestClose={() => setIsGenderModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Male')}>
              <Text style={styles.modalOptionText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Female')}>
              <Text style={styles.modalOptionText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Others')}>
              <Text style={styles.modalOptionText}>Others</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setIsGenderModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={closeDatePicker}
      />
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: 'skyblue',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatarText: {
    color: 'blue',
    fontSize: 40,
    fontFamily: Fonts.SemiBold,
  },
  editIcon: {
    backgroundColor: 'white',
    width: 23,
    height: 23,
    borderRadius: 100,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(12),
    marginLeft: responsiveWidth(54),
    elevation: 10,
  },
  input: {
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 30,
    backgroundColor: 'white',
    paddingTop: 15,
  },
  text: {
    height: 40,
    color: 'black',
    fontSize: 14,
    marginHorizontal: 10,
    fontFamily: Fonts.Regular,
  },
  updateButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#dcdcdc',
    padding: 10,
    borderRadius: 10,
  },
  updateButtonText: {
    color: 'black',
    fontSize: 20,
    fontFamily: Fonts.SemiBold,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Fonts.SemiBold,
    marginBottom: 20,
    color: 'black',
  },
  modalOption: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: 'black',
  },
  modalClose: {
    marginTop: 20,
  },
  modalCloseText: {
    fontSize: 16,
    color: 'blue',
  },
});
