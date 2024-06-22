import { firebase } from "@react-native-firebase/database";
import React,{useState,useEffect} from "react";
import{Text,View,FlatList,TouchableOpacity, Image} from 'react-native';
import database from '@react-native-firebase/database';
import { responsiveWidth } from "react-native-responsive-dimensions";
import Fonts from "../../Utilities/Fonts";
import Entypo from 'react-native-vector-icons/Entypo'

const DishesList=({navigation,route})=>{
    const[AddedDish,setAddedDish]=useState([]);
    const{AccessToken}=route.params;
    const[Dishes,setDishes]=useState([]);


    const showdishes=async()=>{
        const ref=database().ref('RestaurantsData').child(AccessToken)
    
          await ref.child('Dishes').on('value',(snapshot)=>{
            const items=snapshot.val()?Object.entries(snapshot.val()):[];
            const formattedData=items.map(([key,value])=>({key,...value}));
           // const data=snapshot.val()?snapshot.val():[]
            setDishes(formattedData);
            console.log(formattedData)
          })
          return () => {
            ref.off('value', snapshot);
          };
    }

useEffect(()=>{
showdishes()

},[])
    return(
        <View style={{flex:1}}>
            {/* <Text>Dishes List</Text> */}
           {/* <TouchableOpacity onPress={()=>navigation.navigate('AddDishes',{AccessToken})} style={{height:50,width:100,borderWidth:1}}>
            <Text style={{fontSize:16}}>Add Dishes</Text>
            </TouchableOpacity> */}
            <Text style={{fontSize:22,fontFamily:Fonts.Bold,color:'black',position:'absolute',top:30,marginLeft:20}}>Add Dishes</Text>
            <TouchableOpacity  onPress={()=>navigation.navigate('AddDishes',{AccessToken})}
            style={{height:50,width:50,alignItems:'center',backgroundColor:'green',justifyContent:'center',borderWidth:1 ,alignSelf:'flex-end',marginRight:20,borderRadius:10,marginTop:20}}>
            <Entypo name='plus' size={42} color={'white'}/>
            </TouchableOpacity>
            <FlatList
            data={Dishes}
            numColumns={2}
            renderItem={({item,text})=>(
                <View style={{borderWidth:0.5,borderColor:'gray',backgroundColor:'white',elevation:1,borderRadius:20,margin:responsiveWidth(1.5),padding:10,width:responsiveWidth(47)}}>
                <View style={{height:140,}}>
        <Image source={{uri:item.DishesImage}} style={{flex:1,borderRadius:10}}></Image>
        
        </View>
        <Text style={{fontSize:16,fontFamily:Fonts.Medium,color:'black',marginTop:10}}>{item.DishName}</Text>
        <Text style={{marginTop:10,fontSize:16,color:'black'}}> ₹ {item.DishPrice}</Text>
        {/* <Text style={{marginTop:10,fontSize:16,color:'black'}}>{item.DishType}</Text> */}
        {/* <Text style={{marginTop:10,fontSize:12,color:'black'}}>{item.DishPreparationType}</Text> */}
        {/* <TouchableOpacity style={{height:45,borderRadius:10,borderWidth:0,marginTop:10,backgroundColor:Colors.orange,alignItems:'center',justifyContent:'center'}} onPress={()=>navigation.navigate('Orderscreen')}>
        <Text style={{color:'white',fontFamily:Fonts.Bold,fontSize:16}}>Order Now</Text>
        
        </TouchableOpacity>
         */}
            </View>

            )}
            
            />
            

        </View>
    )
}
export default DishesList;