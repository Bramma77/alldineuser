
import React,{useState,useEffect} from "react";
import { Text,View ,TextInput, StyleSheet,Image, Touchable, TouchableOpacity} from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from "@react-native-firebase/storage";
import database from '@react-native-firebase/database'; 
import Colors from "../../Utilities/Colors";
import Fonts from "../../Utilities/Fonts";


const AddDishes=({route})=>{

    const{AccessToken}=route.params;

    const[Dishesname,setDishesname]=useState("");
    const[DishesPrice,setDishesPrice]=useState("");
    const[DishesType,setDishesType]=useState("");
    const[PreparationTime,setPreparationTime]=useState("");
    const[ImageUri,setImageUri]=useState(null);


    const onChangevalue = (text, value) => {
        if (value === "Dishname") setDishesname(text)
        if (value === "DishPrice") setDishesPrice(text)
        if (value === "DishType") setDishesType(text)
        if (value === "PreparationTime") setPreparationTime(text)
     
    }

    const uploadImage = async (uri) => {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const filename = uri.substring(uri.lastIndexOf('/') + 1);
          const ref = storage().ref(`Foodimages/${filename}`);
          await ref.put(blob);
    
          // Get the download URL
          const url = await ref.getDownloadURL();
          //setDownloadUrl(url);

          return url

          console.log('Download URL: ', url);
        } catch (error) {
          console.log('Upload error: ', error);
        }
      }

    const uploadimg = () => {
      
        // setLoader(true)
       uploadImage(ImageUri)
           .then(downloadUrls => {
               console.log('Images uploaded successfully. URLs:', downloadUrls);
            
             handlePostData(downloadUrls)
             
           })
           .catch(error => {
               console.error('Error uploading images:', error);
           });
       }

    const handlePostData=async(downloadUrls)=>{
        try{
            const data={
              DishName:Dishesname,
              DishPrice:DishesPrice,
              DishType:DishesType,
              DishPreparationType:PreparationTime,
              DishesImage:downloadUrls
            }
        const ref=database().ref("RestaurantsData").child(AccessToken).child('Dishes')
       await ref.push(data)
      // setModalVisible(true)
     
    }catch(error){
        console.log(error)
    }

    }

    const selectImage = async () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
            includeExtra: true,
            mediaType: 'photo', // Specify only photos
            quality: 0.8, // Image quality
            multiple: true,
        };

        await launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const selectedImages = response.assets.map((asset) => ({
                    uri: asset.uri,
                }));
                console.log(response)
                // console.log(selectedImages)
                setImageUri(response.assets[0].uri)
                //  setImageUris((prevImageUris) => [...prevImageUris, ...selectedImages]);


                console.log(ImageUri)

            }
        });
    };


    return(
        <View style={{flex:1}}>
            <View style={{margin:20}}>

                <View style={{height:200,width:200,borderWidth:1,borderRadius:10,padding:10,alignSelf:'center'}}>
                  {ImageUri!=null&&(
                    <Image source={{uri:ImageUri}} style={{height:"100%",width:"100%"}}/>
                )}
                </View>
                <TouchableOpacity style={styles.Button} onPress={selectImage}>
                        <Text style={{  fontSize: 16, fontFamily: Fonts.Light, color: 'white' }}>Choose Image</Text>
                    </TouchableOpacity>
            <Text style={styles.Text}>Enter Dish name</Text>
            <TextInput
            style={styles.TextInput}
            onChangeText={(text)=>onChangevalue(text,'Dishname')}
            value={Dishesname}
            
            />
             <Text style={styles.Text}>Enter Dish Price</Text>
            <TextInput
            style={styles.TextInput}
            onChangeText={(text)=>onChangevalue(text,'DishPrice')}
            value={DishesPrice}
            />
             <Text style={styles.Text}>Enter Dish Type</Text>
            <TextInput
            style={styles.TextInput}
            onChangeText={(text)=>onChangevalue(text,'DishType')}
            value={DishesType}
            />
             <Text style={styles.Text}>Enter Dish Preparation Time</Text>
            <TextInput
            style={styles.TextInput}
            onChangeText={(text)=>onChangevalue(text,'PreparationTime')}
            value={PreparationTime}
            />

<TouchableOpacity
         onPress={uploadimg}
         style={{height:50,width:100,marginTop:20,borderRadius:10,borderWidth:1,alignItems:'center',alignSelf:'center',justifyContent:'center'}}>
       <Text>Submit</Text>
         </TouchableOpacity>

        </View>
        </View>
    )
}
export default AddDishes;
const styles=StyleSheet.create({
    TextInput:{
        height:50,borderWidth:1,borderRadius:10,marginTop:10
    },
    Text:{
        marginTop:10

    },
    Button: {
        height: 50,
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 0,
        marginTop: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.orange
    },

})