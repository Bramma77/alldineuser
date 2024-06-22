import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,Modal, FlatList, ScrollView, Image } from 'react-native'
import Colors from '../../Utilities/Colors';
import Fonts from '../../Utilities/Fonts';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import auth, { firebase } from '@react-native-firebase/auth';
import storage from "@react-native-firebase/storage";
import database from '@react-native-firebase/database';

const SubAdmin = ({ navigation,route }) => {
    const [Restaurantname, setRestaurantname] = useState("")
    const [Address, setAddress] = useState("");
    const [ContactNo, setcontactNo] = useState("");
    const [ShortDes, setShortDes] = useState("");
    const [LongDes, setLongDes] = useState("");
    const [ImageUri, setImageUri] = useState(null);
    const [DownloadUrl,setDownloadUrl]= useState('');
    const[Show,setShow]=useState(false);
    const[ResData,setResData]=useState([]);

    const {Resname,AccessToken}=route.params||{};
    const uploadImage = async (uri) => {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const filename = uri.substring(uri.lastIndexOf('/') + 1);
          const ref = storage().ref(`images/${filename}`);
          await ref.put(blob);
    
          // Get the download URL
          const url = await ref.getDownloadURL();
          setDownloadUrl(url);

          return url

          console.log('Download URL: ', url);
        } catch (error) {
          console.log('Upload error: ', error);
        }
      }


      const checkdatabase=async()=>{
        const ref = database().ref(`RestaurantsData/${AccessToken}`);
         await ref.on('value',(snapshot)=>{

     
   
        if (!snapshot.exists()) {
          //  navigation.navigate('AddDishes')
          setShow(false)
         // console.log(snapshot.val())
         
         
        }
        else{
            setShow(true)
            console.log(snapshot.val())
            setResData(snapshot.val())
            

        }
    });
    return () => {
        ref.off('value', da);
      };
    }


useEffect(()=>{
    checkdatabase()
    console.log(ResData)
},[])

    const uploadimg = () => {
      
        // setLoader(true)
       uploadImage(ImageUri)
           .then(downloadUrls => {
               console.log('Images uploaded successfully. URLs:', downloadUrls);
             //  AddvehicleInfo(downloadUrls)
             handlePostData(downloadUrls)
               //setDownloadurllist(downloadUrls)
               
    // setLoader(false)
               // Now you can use downloadUrls array to access the URLs of the uploaded images
           })
           .catch(error => {
               console.error('Error uploading images:', error);
           });
       }

    const handlePostData=async(downloadUrls)=>{
        try{
            const data={
                Token:AccessToken,
                Restaurantname:Restaurantname,
                RestaurantAddress:Address,
                ContactNo:ContactNo,
                ShortDes:ShortDes,
                LongDes:LongDes,
                DownloadUrl:downloadUrls
            }
        const ref=database().ref("RestaurantsData").child(AccessToken)
       await ref.set(data)
       setModalVisible(true)
     
    }catch(error){
        console.log(error)
    }

    }

    useEffect(()=>{
        console.log(Resname)
        console.log(AccessToken)

    },[])

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

   

    const onChangevalue = (text, value) => {
        if (value === "Restaurantname") setRestaurantname(text)
        if (value === "Address") setAddress(text)
        if (value === "ContactNo") setcontactNo(text)
        if (value === "ShortDes") setShortDes(text)
        if (value === "LongDes") setLongDes(text)   
    }
const [modalVisible,setModalVisible]=useState(false);

    return (
        <View style={{ flex: 1 }}>
            {/* <View style={{height:55,borderWidth:0,justifyContent:'center',backgroundColor:Colors.orange}}>
                
                <Text style={{fontSize:18,fontFamily:Colors.orange,marginLeft:20,color:'white',fontFamily:Fonts.Bold}}>Add Restaurant Details    </Text>
            </View> */}
          {Show ?(
            <ScrollView>
            <View style={{flex:1}}>
           <Image source={{uri:ResData.DownloadUrl}} resizeMode='contain' style={{height:200,width:"100%"}}/>
      <View style={{margin:20}}>
         <Text style={{fontFamily:Fonts.Bold,color:'black',fontSize:22}}>{ResData?.Restaurantname}</Text>
         <Text style={{fontSize:16,fontFamily:Fonts.Medium,marginTop:10,color:'gray'}}>{ResData?.RestaurantAddress}</Text>
         <Text style={{fontSize:16,fontFamily:Fonts.Medium,marginTop:10,color:'gray'}}>{ResData?.ContactNo}</Text>
         <Text style={{fontSize:18,fontFamily:Fonts.Bold,color:'black',marginTop:10}}>Short Description</Text>
        <Text style={{fontSize:16,color:'gray',fontFamily:Fonts.Medium,marginTop:10}}>Welcome to [Restaurant Name], where culinary artistry meets exceptional service. Nestled in the heart of [City/Town], our restaurant offers a diverse menu featuring the finest ingredients,
             expertly crafted into mouth-watering dishes by our talented chefs.</Text>
             <Text style={{fontSize:18,fontFamily:Fonts.Bold,color:'black',marginTop:10}}>Long Description</Text>
        <Text style={{fontSize:16,color:'gray',fontFamily:Fonts.Medium,marginTop:10}}>Welcome to [Restaurant Name], where culinary artistry meets exceptional service. Nestled in the heart of [City/Town], our restaurant offers a diverse menu featuring the finest ingredients,
             expertly crafted into mouth-watering dishes by our talented chefs.</Text>
       
         <TouchableOpacity
         onPress={()=>navigation.navigate('DishesList',{AccessToken})}
         style={{height:50,width:100,marginTop:20,borderRadius:10,borderWidth:1,alignItems:'center',alignSelf:'center',justifyContent:'center'}}>
       <Text>View Dishes</Text>
         </TouchableOpacity>

            </View>
            </View>
            </ScrollView>
           ):(          
              <ScrollView>
                <View style={{}}>
                <Modal
                        animationType="none"
                        transparent={true}
                        
                        visible={modalVisible}
                        
                        // onRequestClose={() => {
                        //     Alert.alert('Modal has been closed.');
                        //     setModalVisible(!modalVisible);
                        // }}
                        >
                            <TouchableOpacity activeOpacity={1} 
                            onPress={()=>setModalVisible(false)}
                            style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}>
                            <View style={{backgroundColor:'white',height:200,width:300,borderRadius:20,alignItems:'center',justifyContent:'center'}}>

                            <Text>Uploaded Success</Text>
                            </View>
                            </TouchableOpacity>
                            </Modal>


                    <View style={Styles.imagecontainer}>
                        {ImageUri != null && (
                            <Image source={{ uri: ImageUri }} style={{ height: '100%', width: '100%' }} resizeMode='cover' />
                        )}

                    </View>
                    <TouchableOpacity style={Styles.Button} onPress={selectImage}>
                        <Text style={{ fontSize: 16, fontFamily: Fonts.Light, color: 'white' }}>Choose Image</Text>
                    </TouchableOpacity>
                    <Text style={Styles.TextSubhead}>Restaurant name</Text>
                    <TextInput
                        onChangeText={(text) => onChangevalue(text, "Restaurantname")}
                        value={Restaurantname}
                        style={Styles.TextInput}
                    />
                    <Text style={Styles.TextSubhead}>Restaurant Address</Text>
                    <TextInput
                        onChangeText={(text) => onChangevalue(text, "Address")}
                        value={Address}
                        style={Styles.TextInput}
                    />
                    <Text style={Styles.TextSubhead}>Restaurant Contact No</Text>

                    <TextInput
                        style={Styles.TextInput}
                        onChangeText={(text) => onChangevalue(text, "ContactNo")}
                        value={ContactNo}
                    />
                    <Text style={Styles.TextSubhead}>Restaurant Short Description</Text>
                    <TextInput
                        style={Styles.TextInput}
                        onChangeText={(text) => onChangevalue(text, "ShortDes")}
                        value={ShortDes}
                    />
                    <Text style={Styles.TextSubhead}>Restaurant Long Description</Text>
                    <TextInput
                        style={Styles.TextInput}
                        onChangeText={(text) => onChangevalue(text, "LongDes")}
                        value={LongDes}
                    />
                    <TouchableOpacity style={Styles.Button} onPress={uploadimg}>
                        <Text style={[Styles.Text, { paddingLeft: 20, paddingRight: 20 }]}>Save</Text>
                    </TouchableOpacity>
                    <Text style={{ marginBottom: 20 }}></Text>
                </View>

            </ScrollView>
           )}

        </View>
    )

}
export default SubAdmin;
const Styles = StyleSheet.create({
    Text: {
        fontSize: 16, fontFamily: Fonts.Bold, color: 'white'

    },
    TextSubhead: {
        marginLeft: 20, marginTop: 10,fontSize:15, fontFamily: Fonts.Medium, color: 'gray'
    },
    Container: {
        height: 80, borderWidth: 1,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: Colors.orange

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
    imagecontainer: { height: 150, width: 150, marginTop: 20, borderWidth: 1, borderRadius: 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 },
    TextInput: {
        height: 50, borderWidth: 1, margin: 20, borderRadius: 10, marginTop: 10,paddingLeft:20,fontFamily:Fonts.Medium,fontSize:18

    }
})