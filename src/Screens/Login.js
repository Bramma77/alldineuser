import React, { useState,useRef } from 'react';
import { StyleSheet, View, Text,Dimensions,SafeAreaView, StatusBar,Image ,TouchableOpacity, TextInput} from 'react-native';
// import PagerView from 'react-native-pager-view';
// import DrawerNavigator from "../navigation/DrawerNavigator";
// import { useNavigation } from "@react-navigation/native";


// import { Commonheight, Commonsize, Commonwidth } from '../utils/CommonDimensions';
import PhoneInput from 'react-native-phone-input'
import Colors from '../Utilities/Colors';
import Fonts from '../Utilities/Fonts';
import auth, { firebase } from '@react-native-firebase/auth';
import { useCart } from '../Provider/Provider';

const Login = ({navigation}) => {
    // const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const [location,selectedLocation] = useState('us')
    const[FormattedValue,setFormattedValue]=useState(false);
    const phoneInput = useRef(PhoneInput);
    const[PhoneNumber,setPhoneNumber]=useState('');
    const [value,setValue]=useState()
    //const [confirm, setConfirm] = useState(null);
    const{confirm,setConfirm}=useCart()

    const onPageScroll = (event) => {
        const { position } = event.nativeEvent;
        console.log(position)
        if (position == 1) {
            navigation.navigate('DrawerNavigation')
        }
    };
    const signInWithPhoneNumber=async()=> {
    console.log(PhoneNumber)
    try{
        const confirmation = await auth().signInWithPhoneNumber(PhoneNumber);
        console.log(confirmation)
       
       setConfirm(confirmation);
        navigation.navigate('OTP')
      }
    
    catch(e){
        console.log(e)
    }
}
      
      async function confirmCode() {
        try {
          await confirm.confirm(code);
        } catch (error) {
          console.log('Invalid code.');
        }
    }

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
                      <Image source={require("../Assets/Images/login.jpg")} style={{height:300,width:300,alignSelf:'center'}}/>
                 
                    <View style={{  justifyContent:'flex-end',alignItems:'center' }}>
                        {/* <Image style={{width: 150,height: 150}} /> */}
                        <Text style={{marginTop:0,textAlignVertical:'center',fontSize: 24,color:Colors.orange,fontFamily:Fonts.Bold}}>LOGIN</Text>
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontWeight:'500',fontFamily: Fonts.Medium,fontSize: 18,textAlign:'center',margin:20,color: 'brown',}}>Add your Phone Number, we'll send an OTP to see that you're real</Text>
                    </View>
           

          

                 <PhoneInput
                 style={{height:50,marginLeft:50,marginRight:50,borderWidth:1,borderRadius:10,padding:10}}
                ref={phoneInput}
               onPressFlag={()=>console.log('Flag')}
               initialCountry={'in'}
               
               onChangePhoneNumber={(text)=>setPhoneNumber(text)}
                initialValue=""
                textProps={{
                    placeholder: 'Enter a phone number...'
                }}
            />

            <TouchableOpacity onPress={()=>
                
               // navigation.navigate('OTP')
               signInWithPhoneNumber()
                
                }>

                <View style={{height:50,backgroundColor:Colors.orange,borderRadius:10,width:300,marginTop:30,alignItems:'center',justifyContent:'center'}}>

                <Text style={{fontSize:18,color:'white',fontWeight:'bold'}}>GET OTP</Text>                    
                 </View>
                 </TouchableOpacity>
              
                    </View>
                 
                </SafeAreaView>
            </View>
         
              
       
    );
};
export default Login
const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
});


