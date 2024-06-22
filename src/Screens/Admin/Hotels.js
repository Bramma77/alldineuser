import React from "react";
import {View,Text,FlatList,Image,TouchableOpacity} from 'react-native';
import Fonts from "../../Utilities/Fonts";



const Data=[{
    id:1,
    msg:'msg'
},{
id:2,
msg:'msg'
}


]

const Hotels=({navigation})=>{
    return(
        <View style={{flex:1}}>

        <FlatList
        data={Data}
        keyExtractor={(item)=>item.id}
        renderItem={({item})=>(
            <TouchableOpacity onPress={()=>navigation.navigate('Orders')}>
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
export default Hotels