import React, {useState, useRef, useEffect} from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
// import styles from './styles'; // Assuming you have a separate styles file

const AnimatedTextInput = ({
  label,
  value,
  editable = false,
  onChangeText = () => {},
  keyboardType = 'default',
  onPress = null,
  maxLength = null,
}) => {
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
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AnimatedTextInput;
const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 0,
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
    fontFamily: Fonts.Regular,
  },
  modalClose: {
    marginTop: 20,
  },
  modalCloseText: {
    fontSize: 16,
    color: 'blue',
    fontFamily: Fonts.SemiBold,
  },
});
