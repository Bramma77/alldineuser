import React ,{useEffect, useState}from "react";
import{View,Text,TextInput,TouchableOpacity} from 'react-native';
import Colors from "../../Utilities/Colors";
import Fonts from "../../Utilities/Fonts";
import database from '@react-native-firebase/database';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import auth, { firebase } from '@react-native-firebase/auth';
import storage from "@react-native-firebase/storage";
import { Screen } from "react-native-screens";



const AdminLogin=({navigation})=>{
    const [Restaurantname,setRestaurantName]=useState(false);
    const [AccessToken,setAccessToken]=useState(false);

    const checkdatabase=async()=>{
        const ref = database().ref(`RestaurantsData/${AccessToken}`);
        const snapshot = await ref.once('value');
        if (!snapshot.exists()) {
            navigation.navigate('AddDishes')
        }
    }

    const Adminlogin=async()=>{
        const ref=database().ref(`Admindashboard/AccessToken/${AccessToken}`)
        await ref.on('value',(snapshot)=>{
            const data=snapshot.val();
            console.log(data)
            console.log(Restaurantname)
            
            if(data!=null){
                //console.log('data')
                console.log('login successfull')
                navigation.navigate("MyAdminTabs",{Resname:Restaurantname,AccessToken})

                // navigation.navigate("MyAdminTabs",{
                //     screen:'SubAdmin',
                //    params:{ Resname:Restaurantname,AccessToken}})

            }
            else if (AccessToken==='000000'){   
                navigation.navigate("AdminDashboard",{Resname:Restaurantname,AccessToken})


            }  
        else{
                console.log("fail to login")
            }
        })
    }


   
    useEffect(()=>{
        Adminlogin()

    },[])

    return(
        <View style={{flex:1}}>
            <View style={{justifyContent:'center',margin:20,flex:1}}>
                {/* <Text style={{marginTop:0}}>Restaurant name</Text>
            <TextInput
              style={{height:50,borderWidth:1,padding:10,borderRadius:10,marginTop:10}}
              onChangeText={(text)=>setRestaurantName(text)}
              value={Restaurantname}
            /> */}
              <Text style={{marginTop:20}}>Access Token</Text>
             <TextInput
              style={{height:50,borderWidth:1,padding:10,borderRadius:10,marginTop:10}}
              maxLength={6}
              onChangeText={(text)=>setAccessToken(text)}
              value={AccessToken}
            />
               <TouchableOpacity 
               onPress={Adminlogin}
               style={{height:50,borderWidth:0,marginTop:40,borderRadius:10,backgroundColor:Colors.orange,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:15,color:'white',fontFamily:Fonts.Bold}}>Login</Text>

</TouchableOpacity>

            </View>
         
        </View>
    )
}
export default AdminLogin;