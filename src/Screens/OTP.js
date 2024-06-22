import React, { useState,useRef } from 'react';
import { StyleSheet, View, Text,Dimensions, SafeAreaView, StatusBar,Image ,TouchableOpacity, TextInput} from 'react-native';
// import PagerView from 'react-native-pager-view';
// import DrawerNavigator from "../navigation/DrawerNavigator";
import { useNavigation } from "@react-navigation/native";
import PhoneInput from "react-native-phone-number-input";
import Colors from '../Utilities/Colors';
import { useCart } from '../Provider/Provider';
// import { Commonheight, Commonsize, Commonwidth } from '../utils/CommonDimensions';

const OTP= ({route}) => {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const [location,selectedLocation] = useState('us')
    const[FormattedValue,setFormattedValue]=useState(false);
    const phoneInput = useRef(PhoneInput);
    const [value,setValue]=useState()
    const [otp, setOTP] = useState(['', '', '', '','','']);
    const inputRefs = useRef([]);
    const{confirm}=useCart();

    async function confirmCode() {
      console.log(otp)
      try {
        console.log(otp)
        const numberString = otp.join(''); 
        console.log(numberString)
        await confirm.confirm(numberString);
        console.log('Phone number verified!');
        navigation.navigate('Drawer')
      } catch (error) {
        console.log('Invalid code.');
      }
    }

    const handleOTPChange = (index, value) => {
        if (isNaN(value)) return; // Only allow numeric input
        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);
      
        if (index < otp.length - 1 && value) {
          inputRefs.current[index + 1].focus();
        }
      };
      const handleKeyPress = (index, event) => {
        if (event.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
          inputRefs.current[index - 1].focus();
        }
      };

    const onPageScroll = (event) => {
        const { position } = event.nativeEvent;
        console.log(position)
        if (position == 1) {
            navigation.navigate('Dashboard')
        }
    };

    

    return (
       
            <View style={{flex:1}}>
                <SafeAreaView style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    
                }}>
                    <StatusBar
                        translucent={true}
                    />
                 
                    <View style={{  justifyContent:'flex-end',alignItems:'center' }}>
                        {/* <Image style={{width: 150,height: 150}} /> */}
                        <Text style={{marginTop:0, fontWeight:'600',fontFamily: 'Lato-Semibold',fontSize: 24,color: 'black',fontWeight:'bold'}}>OTP Verification</Text>
                    <Text style={{fontWeight:'500',fontFamily: 'Lato-Regular',fontSize: 14,color: '#9E9E9E',marginTop:20}}>Enter the otp send to +919080314521</Text>
                    <View style={styles.inputContainer}>  
                    {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOTPChange(index, text)}
            onKeyPress={(event) => handleKeyPress(index, event)}
          />
                    ))}
                    </View>

            <TouchableOpacity onPress={confirmCode}>

                 <View style={{height:50,backgroundColor:Colors.orange,borderRadius:10,width:300,borderWidth:0,marginTop:30,alignItems:'center',justifyContent:'center'}}>

            <Text style={{fontSize:18,color:'white',fontWeight:'bold'}}>VERIFY OTP</Text>                    
                 </View>
                 </TouchableOpacity>
              
                    </View>
                 
                </SafeAreaView>
            </View>
         
              
       
    );
};
export default OTP
const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
    inputContainer: {
        marginTop:20,   
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        borderWidth:0
      },
      input: {
        width: '20%',
        height: 50,
        width:50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
       paddingHorizontal:10,
     //  margin:5,
        textAlign: 'center',
        fontSize: 18,
      },
});


