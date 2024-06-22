import React from "react";
import {View,Text,FlatList,Image,TouchableOpacity} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

const AvailabilityList=({navigation})=>{
    const Data=[{
        id:1,
        msg:'msg'
    },{
    id:2,
    msg:'msg'
    }
    
    
    ]
    
   
    return(
        <View style={{flex:1}}>
            <View style={{height:50,justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                <IonIcons name="arrow-back" color="black" size={22} style={{marginLeft:20}}/>
                </TouchableOpacity>
            </View>

        <FlatList
        data={Data}
        keyExtractor={(item)=>item.id}
        renderItem={({item})=>(
            <TouchableOpacity onPress={()=>navigation.navigate('AvailabilityFood')}>
                <View style={{borderWidth:1,marginTop:20,marginLeft:10,marginRight:10,borderRadius:10,flexDirection:'row',alignItems:'center'}}>
                    <Image source={require("../../Assets/Images/Swipper2.jpg")} style={{height:100,width:100,borderRadius:10,margin:10}}/>
                    <View>
                    <Text style={{fontSize:15,fontFamily:Fonts.Bold,color:'black'}}>  Restaurants name</Text>
                    <Text style={{fontSize:15,fontFamily:Fonts.Bold,color:'black'}}>  Owner name</Text>
                    <Text style={{fontSize:15,fontFamily:Fonts.Bold,color:'black'}}>  +90242252</Text>
                    </View>
                    
                 </View>
                 </TouchableOpacity>
        )}
        
        />
        

        </View>
    )

}
export default AvailabilityList;