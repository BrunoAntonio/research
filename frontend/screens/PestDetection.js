import React, { useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import back from '../assets/back.png'
import take_picture_icon from '../assets/take_picture.png'; 
import save_picture_icon from '../assets/save_picture.png'; 

// Get phone language
i18n.locale = Localization.locale;
i18n.fallbacks = true;

const PestDetection = ({navigation}) => { 

  // The path of the camera image and detections
  const [imageDetections, setImage] = useState('');
  const [numberDetections, setNumber] = useState('');
  const [savePicture, setSave] = useState('');
  const [active, setActive] = useState(false);
  const [picked, setPicked] = useState(1);
  //const [dimensions, setDimensions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isZoom, setZoom] = useState(0);

  // Reset zoom on release
  const zoomHandler = () => {
    setZoom(isZoom+1);
  };

  // Save image (Trigger for the "Save Image" button)
 

  const saveFile = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your folders!");
      return;
    }

    let fileUri = FileSystem.documentDirectory + "detections.jpg";
    await FileSystem.writeAsStringAsync(fileUri, savePicture, { encoding: FileSystem.EncodingType.Base64 });
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false)
    
  }


  // Trigger for the "Make Detections" button
  const openCamera = async () => {
    // Permission to access the camera
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }
  // POST image options
  const options = { quality: 1, base64: true, mirrorImage: false };
  const result = await ImagePicker.launchCameraAsync(options);


  if (!result.cancelled) {
  
        axios
        .post('http://.../app_mobile',result.base64) // POST base64 camera image
        .then(response => {  // Response from backend (base64 detections image)

        //console.log(response.data['a'])
        const contentType = 'image/jpg';
        const b64Image = response.data['detections_image'];
        const detections = response.data['number_detections'];
        const dataUrl = `data:${contentType};base64,${b64Image}`;
        //Image.getSize(`data:image/png;base64,${b64Image}`, (width, height) => {setDimensions([width, height])});
        setImage(dataUrl);
        setNumber(<Text>{i18n.t('numberOfDetections')}: {detections}</Text>);
        setSave(b64Image);
        setActive(true);
        setLoading(false);
        

        },
        )
        .catch(err => { console.log(err); })
    }

    setLoading(true);
    setZoom(1)
  }

  // Buttons 
  return (

    <View style={styles.screen}>

      <View style={styles.showImageContainer}>
      <View style={{top: "-5%", width: "100%", height:"110%"}}>
 
     <ReactNativeZoomableView key={isZoom}
        maxZoom={1.5}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1}
        zoomEnabled={true}
        bindToBorders={true}
        doubleTapZoomToCenter={true}
        zoomCenteringLevelDistance={1}
        onZoomEnd={()=>zoomHandler()}
        style={{padding: 10, backgroundColor: 'white'}}>

        { imageDetections !== '' && <Image source={{ uri: imageDetections}} style={{resizeMode: 'contain', flex: 1}} />}
      </ReactNativeZoomableView>

     </View>
     </View>

     <View style={styles.topContainer}>

        <Text style={{color: "black", fontSize: 25, top: "55%"}}>{i18n.t('pestDetection')}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Image source={back}  style={{width:"100%", height: "100%", resizeMode: 'stretch',}} /></TouchableOpacity>       

        {isLoading && (<Text style={{color: "black", fontSize: 20, position: "absolute", top: "90%" }}>{i18n.t('loading')}</Text>)}
      </View>

      <View style={styles.showDetectionsContainer}>
      
      <Text style={{color: "black", fontSize: 25}}>{numberDetections}</Text>

      </View>

    <View style={styles.pickerButtonContainer}>
    
    <Text style={{color: "black", fontSize: 15, alignItems: "center", top: "-10%", left: "40%"}}>{i18n.t('pestSelection')}</Text>
    <Picker selectedValue={picked} style={styles.pickerButton} onValueChange={(itemValue) => setPicked(itemValue)}>
      <Picker.Item label={i18n.t('whiteflies')} value={1} />
    </Picker>

  </View> 
  
  <View style={styles.cameraButtonContainer}>
    
    <TouchableOpacity onPress={openCamera} style={styles.cameraButton}>
    <Image source={take_picture_icon}  style={{width:"85%", height: "85%",resizeMode: 'stretch'}} /></TouchableOpacity>
    <Text style={{color: "black", fontSize: 15, alignItems: "center", left: "-32%", top: "10%"}}>{i18n.t('takePicture')}</Text>
  </View> 

  <View style={styles.saveButtonContainer}>

    {active && (<TouchableOpacity onPress={saveFile} style={styles.saveButton}>
      <Image source={save_picture_icon}  style={{width:"85%", height: "85%",resizeMode: 'stretch'}} />
      <Text style={{ color: "black", fontSize: 15, alignItems: "center", left: "-2%", top: "50%"}}>{i18n.t('save')}</Text>
      </TouchableOpacity>
      )} 
  
  </View> 

  </View>
  );
}


export default PestDetection; 


// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  backButton: {
    borderWidth: 2,
    borderRadius: 100,
    top:"10%",
    left: "-40%",
    alignItems: "center",
    backgroundColor: "white",
    width: "9%",
    height: "60%",
  },
  pickerButton: {
    width: "22%",
    color: "black",
    fontSize: 28,
    width: "70%",
    padding: "2%",
    height: "50%",
    top: "10%",
    left: "-30%"
  },
  cameraButton: {
    borderWidth: 2,
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: "white",
    width: "35%",
    padding: "4%",
    height: "50%",
    left: "40%",
    top: "-15%"
  },
  saveButton: {
    borderWidth: 2,
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: "white",
    width: "35%",
    padding: "4%",
    height: "50%",
    top: "-15%",
  },


  topContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    top: "0%",
    height: "10%",
    width: "100%"
  },

  showImageContainer: {
    position: 'absolute',
    backgroundColor:"white",
    padding: 50,
    top: "10%",
    width: "100%",
    height: "70%"
  },
  showDetectionsContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "5%",
    width: "100%",
    top: "80%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pickerButtonContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "15%",
    width: "33.33333%",
    top: "85%",
    left: "0%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cameraButtonContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "15%",
    width: "33.33%",
    top: "85%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButtonContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "15%",
    width: "33.33%",
    left:"66.6666%",
    top: "85%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

});

