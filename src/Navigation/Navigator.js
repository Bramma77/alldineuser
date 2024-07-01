import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../Screens/Login';
import OTP from '../Screens/OTP';
import MyPager from '../Screens/Mypager';
import Dashboard from '../Screens/Dashboard';
import Splash from '../Screens/Splashscreen';
import Detailview from '../Screens/Detailview';

import {createDrawerNavigator} from '@react-navigation/drawer';
import Profile from '../Screens/Profile';
import CustomDrawer from '../Component/CustomDrawer';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Colors from '../Utilities/Colors';
import Favorite from '../Screens/Favorite';
import Mycart from '../Screens/Mycart';
import About from '../Screens/About';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/AntDesign';
import Orderscreen from '../Screens/Orderscreen';
import AdminDashboard from '../Screens/AdminDashboard';
import Orders from '../Screens/Admin/Orders';
import Hotels from '../Screens/Admin/Hotels';
import {tokens} from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';
import Token from '../Screens/Admin/Token';
import AvailabilityList from '../Screens/Admin/AvailabilityList';
import AvailabilityFood from '../Screens/Admin/AvailabilityFood';
import SubAdmin from '../Screens/Admin/SubAdmin';
import AdminLogin from '../Screens/Admin/AdminLogin';
import AddDishes from '../Screens/Admin/AddDishes';
import DishesList from '../Screens/Admin/DishesList';
import {CartProvider} from '../Provider/Provider';
import Myorder from '../Screens/Myorder';
import SubOrders from '../Screens/Admin/SubOrders';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import EditProfile from '../Screens/EditProfile';
import OrderStatus from '../Screens/Admin/OrderStatus';
import SubAdminDashboard from '../Screens/Admin/SubAdminDashboard';
import SubOrder from '../Screens/Admin/SubOrders';
import AdminLoader from '../Screens/Admin/AdminLoader';
import PrivacyPolicy from '../Screens/PrivacyPolicy';
import RestaurantList from '../Screens/Admin/RestaurantList';
import RestataurantDetail from '../Screens/RestataurantDetail';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function MyTabs({route, navigation}) {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        drawerStyle: {
          width: '60%',
        },
        drawerActiveTintColor: '#BC4B52',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={BottomTab}
        options={{
          drawerIcon: () => (
            <IonIcons name="home-outline" color={Colors.orange} size={22} />
          ),

          headerRightContainerStyle: {margin: 0},
          headerRight: () => (
            <Icon
              name="shoppingcart"
              color={Colors.orange}
              size={22}
              style={{marginRight: 25}}
              onPress={() => navigation.navigate('Orderscreen')}
            />
          ),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => (
            <IonIcons name="person" color={Colors.orange} size={22} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={Favorite}
        options={{
          drawerIcon: () => (
            <Entypo name="heart" color={Colors.orange} size={22} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Orderscreen"
        component={Orderscreen}
        options={{
          drawerIcon: () => (
            <AntDesign name="shoppingcart" color={Colors.orange} size={22} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Myorders"
        component={Myorder}
        options={{
          drawerIcon: () => (
            <Fontisto name="shopping-package" color={Colors.orange} size={22} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{
          drawerIcon: () => (
            <AntDesign
              name="exclamationcircle"
              color={Colors.orange}
              size={22}
            />
          ),
        }}
      />
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
        drawerActiveTintColor: '#BC4B52',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="SubAdmin"
        component={SubAdmin}
        initialParams={params}
        options={{
          drawerIcon: () => (
            <IonIcons name="home-outline" color={Colors.orange} size={22} />
          ),

          headerRightContainerStyle: {margin: 0},
          headerRight: () => (
            <Icon
              name="shoppingcart"
              color={Colors.orange}
              size={22}
              style={{marginRight: 25}}
            />
          ),

          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="SubOrders"
        component={SubOrders}
        initialParams={params}
        options={{
          drawerIcon: () => (
            <IonIcons name="home-outline" color={Colors.orange} size={22} />
          ),

          headerRightContainerStyle: {margin: 0},
          headerRight: () => (
            <Icon
              name="shoppingcart"
              color={Colors.orange}
              size={22}
              style={{marginRight: 25}}
            />
          ),
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="Mycart"
        component={Mycart}
        initialParams={params}
        options={{
          drawerIcon: () => (
            <AntDesign name="shoppingcart" color={Colors.orange} size={22} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const BottomTab = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Favourites') {
            iconName = 'heart-outline';
          } else if (route.name === 'Re-Order') {
            iconName = 'cookie-refresh-outline';
          } else if (route.name === 'Profile') {
            iconName = 'account-edit';
          }
          return <Icon1 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          title: 'Home',
          headerRight: () => (
            <Icon
              name="shoppingcart"
              color={Colors.orange}
              size={22}
              style={{marginRight: 25}}
              onPress={() => navigation.navigate('Orderscreen')}
            />
          ),
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}

        // options={{
        //   tabBarIcon: ({ color, size }) => (
        //     <Icon name="ios-home" color={color} size={size} />
        //   ),
        // }}

        // options={{headerShown: true}}
      />
      <Tab.Screen
        name="Favourites"
        component={Favorite}
        options={{
          title: 'Favorite',

          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name="Re-Order"
        component={Myorder}
        options={{
          title: 'Orders',

          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',

          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <CartProvider>
        <Stack.Navigator
          // initialRouteName="AdminDashboard"
          //initialRouteName="MyAdminTabs"
          initialRouteName="AdminLogin"
          //initialRouteName='Drawer'
          // initialRouteName="Splash"

          // screenOptions={{headerShown:false}}
        >
          <Stack.Screen
            name="Mypager"
            component={MyPager}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SubAdminDashboard"
            component={SubAdminDashboard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OrderStatus"
            component={OrderStatus}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RestaurantList"
            component={RestaurantList}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddDishes"
            component={AddDishes}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AdminLoader"
            component={AdminLoader}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DishesList"
            component={DishesList}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{headerShown: true, title: 'Edit Profile'}}
          />
          <Stack.Screen
            name="AdminLogin"
            component={AdminLogin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Orders"
            component={Orders}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Myorder"
            component={Myorder}
            options={{headerShown: true, title: 'Order History'}}
          />
          <Stack.Screen
            name="RestataurantDetail"
            component={RestataurantDetail}
            options={{headerShown: true, title: 'Order History'}}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{headerShown: true, title: 'Privacy Policy'}}
          />
          <Stack.Screen
            name="AvailabilityList"
            component={AvailabilityList}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyAdminTabs"
            component={MyAdminTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SubAdmin"
            component={SubAdmin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SubOrder"
            component={SubOrder}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AvailabilityFood"
            component={AvailabilityFood}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Token"
            component={Token}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Hotels"
            component={Hotels}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Detailview"
            component={Detailview}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Orderscreen"
            component={Orderscreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="OTP"
            component={OTP}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Drawer"
            component={BottomTab}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </CartProvider>
    </NavigationContainer>
  );
};
export default Navigator;
