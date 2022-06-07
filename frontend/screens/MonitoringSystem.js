import React, { useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import MapView, { Marker } from 'react-native-maps';

import back from '../assets/back.png'
  
  // Get phone language
  i18n.locale = Localization.locale;
  i18n.fallbacks = true;

const MonitoringSystem = ({navigation}) => {
    
    const [useMarkers, setMarkers] = useState([{"plantation":"", "trap":"", "coordinates": {"latitude":0, "longitude":0}}])

    const executeOnLoad = () => {
        axios
              .get("http://.../monitoring_system/markers")
              .then(markers_list => {
                //console.log(markers_list.data)
                const markers = markers_list.data
                setMarkers(markers)
            },
            )
            .catch(err => { console.log(err); });
            };

  return (
    <View style={styles.screen} onLayout={executeOnLoad}>
    
    <View style={styles.topContainer}>
    
        <Text style={{color: "black", fontSize: 25, top: "55%"}}>{i18n.t('monitoringSystem')}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Image source={back}  style={{width:"100%", height: "100%", resizeMode: 'stretch',}} /></TouchableOpacity>  

    </View>

    <View style={styles.middleContainer}>

    <MapView style={styles.map} initialRegion={{latitude: 39.5, longitude: -8.0, latitudeDelta: 6, longitudeDelta: 2, }}>
  
    { useMarkers.length !== 0 && useMarkers.map((item, index) => (<Marker key={index} title={item.plantation} description={item.trap} coordinate={item.coordinates} 
    onCalloutPress={() => navigation.navigate('MonitoringSystemTraps', {paramKey: item.trap}) } />
                                   )
                )
    }
 
    </MapView> 
    </View>

    <View style={styles.bottomContainer}>
    </View>

    </View>
  );
};



export default MonitoringSystem;

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



  topContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    top: "0%",
    height: "10%",
    width: "100%"
  },
  middleContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "75%",
    width: "100%",
    top: "10%",
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


  map: {
    width: "100%",
    height: "100%",
  },



});

