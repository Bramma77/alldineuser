import {Text,View,Image,TouchableOpacity,ScrollView, StyleSheet} from 'react-native'
import { DrawerContentScrollView, DrawerItemList , DrawerItem } from '@react-navigation/drawer';
import Colors from '../Utilities/Colors';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Fonts from '../Utilities/Fonts';


const CustomDrawer = props => {
    return (
      <View style={{flex: 1}}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{backgroundColor: "white"}}>
          <View
            style={{
              // flexDirection: "row",
              padding: 30,
              backgroundColor: Colors.orange,
              alignItems: "center",
            }}>
            {/* <Image source={require("../Assets/Images/.png")} style={{height:20,width:20}} /> */}
      <Text style={{fontFamily:Fonts.Bold,color:'white',fontSize:22}}>Alldine</Text>
  
      <Text style={{fontFamily:Fonts.Bold,color:'white',fontSize:22}}>Welcomes you</Text>
    
          </View>
          <View style={{padding: 0}}>
            {/* <DrawerItemList {...props} /> */}
            {/* {props.state.routes.map((route, index) => ( */}
            {props.state.routes.map((route, index) => {
               const focused = props.state.index === index;
          const { options } = props.descriptors[route.key];
          const label = options.drawerLabel !== undefined
            ? options.drawerLabel
            : route.name;
          const icon = options.drawerIcon !== undefined
            ? options.drawerIcon
            : null;
            return(
          <DrawerItem
            key={index}
           
            label={() => (
              <>
             <View style={{flexDirection:'row',}}>
            
              {icon && icon({ color: focused ? 'blue' : 'black', size: 24 })}
            <Text style={{fontFamily:Fonts.Medium,marginLeft:10,fontSize:16,color:focused ? Colors.orange : 'black',}}>{route.name}</Text>
            </View>
            </>
            )}
            onPress={() => props.navigation.navigate(route.name)}
          />
            );
        })}
            {/* <DrawerItem  
                   //activeBackgroundColor='blue'
                  // activeTintColor='blue'
                  pressColor="#e6c402"
                  // focused={true}
                  
                   label="Appointment" onPress={()=>navigation.navigate('Appointment')}
                  labelStyle={{fontFamily:'SpaceGrotesk-SemiBold',fontSize:16,color:'black',marginLeft:-20}}
                  icon={({

                   })=>(
                    <IonIcons name= 'home-outline'color={"#e6c402"} size={22}/>
                   )}
                   /> */}
          </View>
        
        </DrawerContentScrollView>
        <View style={{padding:20,}}>
            <TouchableOpacity>
              <Text style={{fontSize:22,fontFamily:Fonts.Bold}}>Logout</Text>
            </TouchableOpacity>
          </View>   
      </View>
    );
  };
  export default CustomDrawer
  const styles=StyleSheet.create({})