import React from "react";
import { Text,View ,Image,TouchableOpacity} from "react-native";
;
import Entypo from 'react-native-vector-icons/Entypo';


const Restaurants=({item,onPress})=>{
    return(
        <TouchableOpacity onPress={onPress}>
        <View style={{height:150,width:150,borderWidth:0,margin:10}}>
        <View style={{flexDirection:'row',borderRadius:20,alignItems:'center'}}>
         
          
            <Image source={{uri:item.DownloadUrl}} style={{height:150,width:150,borderRadius:10}}/>
            <View style={{width:'100%',alignItems:'flex-end',position:'absolute',right:10,top:10,height:20,width:20,alignItems:'center',justifyContent:'center',backgroundColor:'white',borderRadius:10}}>
                <TouchableOpacity>
            <Entypo name='heart-outlined' size={18} color={'red'} style={{}} />
            </TouchableOpacity>
            </View>
           
            <View style={{marginLeft:10}}>
            <Text style={{fontSize:22,color:'black',fontFamily:Fonts.Bold,margin:2}}>{item.Restaurantname}</Text>
            <Text numberOfLines={1} style={{margin:2}}>Juices,Pastas,Beverages</Text>
            <Text numberOfLines={1} style={{margin:2}}>Kilpauk</Text>
            <View style={{flexDirection:'row',alignItems:'center',margin:2}}>
            <View style={{height:18,width:18,borderRadius:20,backgroundColor:Colors.orange,alignItems:'center',justifyContent:'center'}}>
            <Entypo name='star' color={'white'} size={17}/>
            </View>
            <Text style={{marginLeft:5}}>3.5</Text>
            </View>
            </View>
            </View>

        </View>
        </TouchableOpacity>
    )
}
export default Restaurants;
