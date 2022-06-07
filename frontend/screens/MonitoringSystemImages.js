import React, { useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import axios from 'axios';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import back from '../assets/back.png'
  
  // Get phone language
  i18n.locale = Localization.locale;
  i18n.fallbacks = true;


const MonitoringSystemImages = ({navigation, route}) => {

    const [imageDetections, setImage] = useState('');
    const [numberDetections, setNumber] = useState('');
    const [isZoom, setZoom] = useState(0);

    // Reset zoom on release
    const zoomHandler = () => {setZoom(isZoom+1);};

    const executeOnLoad = () => {
        axios
        .post('http://.../monitoring_system/trap_images', {name: route.params.paramKey, date: route.params.paramKey1}) // POST
        .then(response => {  // Response from backend 
        
            const contentType = 'image/jpg';
            const b64Image = response.data['detections_image'];
            const detections = response.data['number_detections'];
            const dataUrl = `data:${contentType};base64,${b64Image}`;
            //Image.getSize(`data:image/png;base64,${b64Image}`, (width, height) => {setDimensions([width, height])});
            setImage(dataUrl);
            setNumber(<Text>{i18n.t('numberOfDetections')}: {detections}</Text>);
          

        },
        )
        .catch(err => { console.log(err); })
    };

  return (
    <View style={styles.screen} onLayout={executeOnLoad}>
            

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
    
        <Text style={{color: "black", fontSize: 25, top: "55%"}}>{route.params.paramKey1}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('MonitoringSystemTraps', {paramKey: route.params.paramKey})} style={styles.backButton}>
        <Image source={back}  style={{width:"100%", height: "100%", resizeMode: 'stretch',}} /></TouchableOpacity>  

    </View>

     <View style={styles.showDetectionsContainer}>
      
      <Text style={{color: "black", fontSize: 25}}>{numberDetections}</Text>

    </View>

    <View style={styles.bottomContainer}>

    </View>


    </View>
  );
};

export default MonitoringSystemImages;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
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
  bottomContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "15%",
    width: "100%",
    top: "85%",
  },

});