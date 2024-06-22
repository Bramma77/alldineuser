import React from "react";
import {View,Text,SafeAreaView} from 'react-native';
import LoginScreen from "./src/Screens/Login";
import Navigator from "./src/Navigation/Navigator";


const App=()=>{
  return(
   
     <SafeAreaView style={{flex:1}} >
      <Navigator/>
     </SafeAreaView>

   
  )
}
export default App;
