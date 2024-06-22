import React ,{useState}from "react";
import {View,Text,FlatList,Image,TouchableOpacity} from 'react-native';
import Fonts from "../../Utilities/Fonts";
import Entypo from 'react-native-vector-icons/Entypo'

const AvailabilityFood=()=>{
    const[isCheck,setisCheck]=useState(false);

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

        <Image source={require("../../Assets/Images/Swipper1.jpg")} style={{height:"30%",width:"100%"}}/>
        <Text style={{fontFamily:Fonts.Bold,color:'black',fontSize:22,marginLeft:20,marginTop:20}}>Hotel Name</Text>
        <Text style={{fontFamily:Fonts.Bold,color:'black',fontSize:18,marginLeft:20,marginTop:20}}>Dishes in Restaurants</Text>
        <FlatList
        data={Data}
        keyExtractor={(item)=>item.id}
        renderItem={({item})=>(
            <TouchableOpacity onPress={()=>navigation.navigate('Orders')}>
               
                <View style={{borderWidth:1,marginTop:20,marginLeft:10,marginRight:10,borderRadius:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={require("../../Assets/Images/Swipper2.jpg")} style={{height:100,width:100,borderRadius:10,margin:10}}/>
             
                    <View>
                    <Text style={{fontSize:15,fontFamily:Fonts.Bold,color:'black'}}>  Food name</Text>
                    <Text style={{fontSize:15,fontFamily:Fonts.Bold,color:'black'}}>  Owner name</Text>
                    <Text style={{fontSize:15,fontFamily:Fonts.Bold,color:'black'}}>  +90242252</Text>
                    </View>
                    </View>
                   <TouchableOpacity onPress={()=>setisCheck(isCheck===item.id?!item.id:item.id)}>
                    <View style={{height:25,width:25,borderWidth:1,borderRadius:2,alignSelf:'flex-end',marginRight:20,marginBottom:20,alignItems:'center',justifyContent:'center'}}>
                        <Entypo name="check" size={22} color={isCheck===item.id?'green':'white'}/>
                    </View>
                    </TouchableOpacity>
               
                 </View>
                 </TouchableOpacity>
        )}
        
        />
        

        </View>
    )

}
export default AvailabilityFood;