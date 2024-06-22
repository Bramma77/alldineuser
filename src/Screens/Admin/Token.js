import React,{useState}from "react";
import {Text,View,TextInput,TouchableOpacity, ToastAndroid} from 'react-native';
import Colors from "../../Utilities/Colors";
import Fonts from "../../Utilities/Fonts";
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import Storage from '@react-native-firebase/storage';
import Auth from '@react-native-firebase/auth'


const Token=({navigation})=>{
    const[AccessToken,setAccessToken]=useState("");
    const[Restaurantname,setRestaurantName]=useState("");



    const AdminResname=()=>{
        const ref=database().ref(`Admindashboard/AccessToken/${AccessToken}`)
        ref.set(
             Restaurantname,
           )
        ToastAndroid.show('Added Success',ToastAndroid.SHORT);
      }

      const storeUserToken = async () => {
        const ref = database().ref(`Admindashboard/AccessToken/${AccessToken}`);
      
        // Check if data already exists
        const snapshot = await ref.once('value');
        if (!snapshot.exists()) {
          // Data does not exist, so set it
          ref.set(Restaurantname);
          ToastAndroid.show('Added Success',ToastAndroid.SHORT);
        } else {
          // Data already exists
          console.log(`Data already exists for userid: ${AccessToken}`);
          ToastAndroid.show('token existed',ToastAndroid.SHORT);
        }
      };


    return(
        <View style={{flex:1,justifyContent:'center'}}>
            <Text style={{marginLeft:20,fontFamily:Fonts.SemiBold}}>Enter the Restaurant Name</Text>
            <TextInput
            style={{height:50,borderWidth:1,borderRadius:10,margin:20,paddingLeft:20,color:'black',fontFamily:Fonts.SemiBold}}
            onChangeText={(text)=>setRestaurantName(text)}
            value={Restaurantname}
            
            />
             <Text style={{marginLeft:20,fontFamily:Fonts.SemiBold}}>Enter the Access Token</Text>
            <TextInput  
            keyboardType="numeric"
            maxLength={6}
            onChangeText={(text)=>setAccessToken(text)}
           
            value={AccessToken}
            style={{height:50,borderWidth:1,borderRadius:10,margin:20,paddingLeft:20,color:'black',fontFamily:Fonts.SemiBold


            }}
            
            />

            <TouchableOpacity onPress={storeUserToken} style={{height:50,width:120,borderWidth:0,alignSelf:'center',alignItems:'center',justifyContent:'center',borderRadius:10,backgroundColor:Colors.orange}}>  
                <Text style={{fontFamily:Fonts.Bold,color:'white',fontSize:20}}>Submit</Text>
            </TouchableOpacity>
            

        </View>
    )
}
export default Token;