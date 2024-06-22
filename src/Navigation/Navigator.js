import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../Screens/Login';
import OTP from '../Screens/OTP';
import MyPager from '../Screens/Mypager';
import Dashboard from '../Screens/Dashboard';
import Splash from '../Screens/Splashscreen';
import Detailview from '../Screens/Detailview';

import { createDrawerNavigator } from '@react-navigation/drawer';
import Profile from '../Screens/Profile';
import CustomDrawer from "../Component/CustomDrawer";
import IonIcons from 'react-native-vector-icons/Ionicons';
import Colors from '../Utilities/Colors';
import Favorite from '../Screens/Favorite';
import Mycart from '../Screens/Mycart';
import About from '../Screens/About';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Icon from 'react-native-vector-icons/AntDesign'
import Orderscreen from '../Screens/Orderscreen';
import AdminDashboard from '../Screens/AdminDashboard';
import Orders from '../Screens/Admin/Orders';
import Hotels from '../Screens/Admin/Hotels';
import { tokens } from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';
import Token from '../Screens/Admin/Token';
import AvailabilityList from '../Screens/Admin/AvailabilityList';
import AvailabilityFood from '../Screens/Admin/AvailabilityFood';
import SubAdmin from '../Screens/Admin/SubAdmin';
import AdminLogin from '../Screens/Admin/AdminLogin';
import AddDishes from '../Screens/Admin/AddDishes';
import DishesList from '../Screens/Admin/DishesList';
import { CartProvider } from '../Provider/Provider';


const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();





function MyTabs({route,navigation}) {
  
    return (
      <Drawer.Navigator 
      initialRouteName='Dashboard'
      screenOptions={{
        drawerStyle: {
            width: '60%',
        },
        drawerActiveTintColor: "#BC4B52",
        
    }}
      drawerContent={props => <CustomDrawer {...props} 
         
         />}

      >
        <Drawer.Screen name="Dashboard" component={Dashboard} 
        options ={{drawerIcon:()=> <IonIcons name= 'home-outline'color={Colors.orange} size={22}/>,
      
      headerRightContainerStyle:{margin:0},
        headerRight:()=>(
          <Icon name='shoppingcart'color={Colors.orange} size={22} style={{ marginRight: 25 }}/>
        ),
       headerShown:true,
   
        
        }} />
        <Drawer.Screen name="Profile" component={Profile}  options ={{drawerIcon:()=> <IonIcons name= 'person'color={Colors.orange} size={22}/>}} />
        <Drawer.Screen name="Favorites" component={Favorite}  options ={{drawerIcon:()=> <Entypo name= 'heart'color={Colors.orange} size={22}/>}} />
        <Drawer.Screen name="Mycart" component={Mycart}  options ={{drawerIcon:()=> <AntDesign name= 'shoppingcart'color={Colors.orange} size={22}/>}} />
        <Drawer.Screen name="Myorders" component={About}  options ={{drawerIcon:()=> <Fontisto name= 'shopping-package'color={Colors.orange} size={22}/>}} />
        <Drawer.Screen name="About" component={About}  options ={{drawerIcon:()=> <AntDesign name= 'exclamationcircle'color={Colors.orange} size={22}/>}} />
       
      </Drawer.Navigator>
    );
  }
  function MyAdminTabs({route}) {
    const params = route.params;
    return (
      <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
            width: '60%',
        },
        drawerActiveTintColor: "#BC4B52",
        
    }}
      drawerContent={props => <CustomDrawer {...props} 
         
         />}
      >
        <Drawer.Screen name="SubAdmin" component={SubAdmin} 
         initialParams={params}
        options ={{drawerIcon:()=> <IonIcons name= 'home-outline'color={Colors.orange} size={22}/>,
      
      headerRightContainerStyle:{margin:0},
        headerRight:()=>(
          <Icon name='shoppingcart'color={Colors.orange} size={22} style={{ marginRight: 25 }}/>
        ),
       headerShown:true,
   
        
        }} />
         <Drawer.Screen name="Orders" component={Orders} 
          initialParams={params}
        options ={{drawerIcon:()=> <IonIcons name= 'home-outline'color={Colors.orange} size={22}/>,
      
      headerRightContainerStyle:{margin:0},
        headerRight:()=>(
          <Icon name='shoppingcart'color={Colors.orange} size={22} style={{ marginRight: 25 }}/>
        ),
       headerShown:true,
   
        
        }} />
        
       
        <Drawer.Screen name="Mycart" component={Mycart} 
         initialParams={params} 
        options ={{drawerIcon:()=> <AntDesign name= 'shoppingcart'color={Colors.orange} size={22}/>}} />
      
       
      </Drawer.Navigator>
    );
  }

const Navigator=()=>{
    return(
      <CartProvider>
        <NavigationContainer>
            <Stack.Navigator
          // initialRouteName='AdminDashboard'
            // initialRouteName='MyAdminTabs'
          // initialRouteName='AdminLogin'
            //initialRouteName='Drawer'
            initialRouteName='Splash'
            
            // screenOptions={{headerShown:false}}
            >
            <Stack.Screen name='Mypager'
            component={MyPager}
            options={{headerShown:false}}
           />
            <Stack.Screen name='AddDishes'
            component={AddDishes}
            options={{headerShown:false}}
           />
             <Stack.Screen name='DishesList'
            component={DishesList}
            options={{headerShown:false}}
           />
             <Stack.Screen name='AdminLogin'
            component={AdminLogin}
            options={{headerShown:false}}
           />
            <Stack.Screen name='Orders'
            component={Orders}
            options={{headerShown:false}}
           />
             <Stack.Screen name='AvailabilityList'
            component={AvailabilityList}
            options={{headerShown:false}}
           />
             <Stack.Screen name='MyAdminTabs'
            component={MyAdminTabs}
            options={{headerShown:false}}
           />
             <Stack.Screen name='AvailabilityFood'
            component={AvailabilityFood}
            options={{headerShown:false}}
           />
            <Stack.Screen name='Token'
            component={Token}
            options={{headerShown:false}}
           />
            <Stack.Screen name='Hotels'
            component={Hotels}
            options={{headerShown:false}}
           />
            <Stack.Screen name='AdminDashboard'
            component={AdminDashboard}
            options={{headerShown:false}}
           />
            <Stack.Screen name='Detailview'
            component={Detailview}
            options={{headerShown:false}}
           />
             <Stack.Screen name='Orderscreen'
            component={Orderscreen}
            options={{headerShown:false}}
           />
            <Stack.Screen name='Splash'
            component={Splash}
            options={{headerShown:false}}
           />
            <Stack.Screen name='Login'
            component={Login}
            options={{headerShown:false}}
           />
           
            <Stack.Screen name='OTP'
            component={OTP}
            options={{headerShown:false}}
           />
           <Stack.Screen name='Drawer'
            component={MyTabs} 
            options={{headerShown:false}}
           />
            </Stack.Navigator>
        </NavigationContainer>
        </CartProvider>
    )
}
export default Navigator;