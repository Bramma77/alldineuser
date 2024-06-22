import React ,{useState} from 'react';
import { StyleSheet, View, Text ,SafeAreaView,Image, TouchableOpacity} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from "@react-navigation/native";
import Dots from 'react-native-dots-pagination';
import Icons from '../Utilities/Icons';
import babelConfig from '../../babel.config';
import Fonts from '../Utilities/Fonts';
import Colors from '../Utilities/Colors';

const MyPager = () => {
    const navigation = useNavigation();
    const [activePage, setActivePage] = useState(0);

    const onPageScroll = (event) => {
        const { position } = event.nativeEvent;
        console.log(position)
        if (position == 2) {
            navigation.navigate('Login')
        }
    };

  return (
    <View style={{flex:1,backgroundColor:'white'}}>
    <PagerView 
    orientation={"horizontal"}
    onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
    onPageScroll={onPageScroll}
    style={styles.pagerView} initialPage={0}>

        <View key={1} style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
           

    
     <Image source={Icons.pager1} style={{alignSelf:'center',height:300,width:300}}/>
      <Text style={{color:Colors.orange,
      fontFamily:Fonts.Bold,
      fontSize:32,
      marginTop:50,
      alignSelf:'center'}}>All Your Favorites !</Text>
<Text style={{fontSize:18,margin:20,marginTop:50,color:'brown',fontFamily:Fonts.Medium,textAlign:'center'}}>Get all your loved foods in one place,you just place the order we do the rest</Text>
            {/* </SafeAreaView> */}

        </View>
        <View key={2} style={{alignItems:'center',justifyContent:'center',flex:1}}>

        <Image source={Icons.pager2} style={{alignSelf:'center',height:300,width:300}}/>
      <Text style={{color:Colors.orange,
      fontFamily:Fonts.Bold,
      fontSize:32,
      marginTop:50,
      alignSelf:'center'}}>Access Everywhere !</Text>
      <View style={{alignItems:'center',justifyContent:'center'}}>
    <Text style={{fontSize:18,margin:20,marginTop:50,color:'brown',fontFamily:Fonts.Medium,textAlign:'center'}}>Locate your address,choose your favorite foods with our restaurants</Text>
</View>
{/* <View style={{flex:0.5,marginBottom:10,borderWidth:1,flexDirection:'row',alignSelf:'flex-end'}}> */}
   <TouchableOpacity onPress={()=>navigation.navigate('Login')} style={{marginRight:20,borderWidth:0 ,height:50,width:150,borderWidth:1,alignItems:'center',justifyContent:'center',borderRadius:10,backgroundColor:Colors.orange}}>
    <Text style={{color:'white',fontFamily:Fonts.Bold,paddingLeft:5,paddingRight:5,paddingTop:5,fontSize:18}}>Continue</Text>
   </TouchableOpacity>
   {/* </View> */}
        </View>
        
    
    </PagerView>
   

     <Dots
     length={2}
     
     active={activePage}
     activeColor="#ff5900"
     passiveColor="gray"
     activeDotWidth={15}
     passiveDotWidth={8}
     activeDotHeight={15}
     passiveDotHeight={8}
   />
   
   </View>
  
  
  );
};
export default MyPager;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});