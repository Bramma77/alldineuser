import React from 'react';
import {View,Text,TextInput, StyleSheet,TouchableOpacity,FlatList} from 'react-native'
import Colors from '../Utilities/Colors';
import Fonts from '../Utilities/Fonts';


const AdminDashboard=({navigation,route})=>{
  
    

  

    return(
        <View style={{flex:1}}>
            <View style={{height:55,borderWidth:0,justifyContent:'center',backgroundColor:Colors.orange}}>
                
                <Text style={{fontSize:18,fontFamily:Colors.orange,marginLeft:20,color:'white',fontFamily:Fonts.Bold}}>Admin Dashboard</Text>
            </View>

            {/* <View style={{margin:20}}>
                <Text>Hotel name</Text>
                <TextInput
                style={{height:50,borderWidth:1,borderRadius:10}}
                />
                <Text>Hotel no</Text>
                 <TextInput
                style={{height:50,borderWidth:1,borderRadius:10}}
                />
                

            </View> */}
            <View style={{marginTop:20}}>
          <TouchableOpacity onPress={()=>navigation.navigate('Hotels')}>
            <View style={Styles.Container}>
                <Text style={Styles.Text}>Orders</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('AvailabilityList')}>
            <View style={Styles.Container}>
            <Text style={Styles.Text}>Availability</Text>

            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Token')}>
            <View style={Styles.Container}>
            <Text style={Styles.Text}>Token</Text>
            </View>
            </TouchableOpacity>
            <View style={Styles.Container}>
            <Text style={Styles.Text}>Logout</Text>
            </View>

            </View>

        </View>
    )

}
export default AdminDashboard;
const Styles=StyleSheet.create({
    Text:{
        fontSize:16,fontFamily:Fonts.Bold,color:'white'

    },
    Container:{
        height:80,borderWidth:1,
        margin:10,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        
        backgroundColor:Colors.orange

    }

})