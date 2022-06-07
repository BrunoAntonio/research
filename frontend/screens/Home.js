import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import logo from '../assets/logo.png'; 
import pest_detection_icon from '../assets/pest_detection.jpg'; 
import monitoring_system_icon from '../assets/monitoring_system.jpg'; 
import about_the_app_icon from '../assets/about_the_app.jpg'; 
  
// Get phone language
i18n.locale = Localization.locale;
i18n.fallbacks = true;

const ProjectDescription = ({navigation}) => {

  return (
    <View style={styles.screen}>
            
    <View style={styles.topContainer}>
        
    </View>

    <View style={styles.imageContainer}>
        <Image source={logo} style={{top:"20%", width: "50%", height: "50%" }} /> 
        <Text style={{color: "black", top:"20%", left:"-1%", fontSize: 30}}>InfraPest</Text>
    </View>

    <View style={styles.pestDetectionButtonContainer}>
    <TouchableOpacity onPress={() => navigation.navigate('PestDetection')} style={styles.pestDetectionButton}>
    <Image source={pest_detection_icon}  style={{width:"85%", height: "85%", resizeMode: 'stretch',}} /></TouchableOpacity>
    <Text style={{color: "black", top:"-30%", fontSize: 15, left:"-17%"}}>{i18n.t('pestDetection')}</Text>
    </View>

    <View style={styles.projectDescriptionButtonContainer}>
    <TouchableOpacity onPress={() => navigation.navigate('ProjectDescription')} style={styles.projectDescriptionButton}>
    <Image source={about_the_app_icon}  style={{width:"85%", height: "85%", resizeMode: 'stretch',}} /></TouchableOpacity>
    <Text style={{color: "black", top:"-30%", fontSize: 15, left:"-17%"}}>{i18n.t('projectDescription')}</Text>
    </View>

    <View style={styles.monitoringSystemButtonContainer}>
    <TouchableOpacity onPress={() => { navigation.navigate('MonitoringSystem')}} style={styles.monitoringSystemButton}>
    <Image source={monitoring_system_icon}  style={{width:"85%", height: "85%", resizeMode: 'stretch',}} /></TouchableOpacity>
    <Text style={{color: "black", top:"-30%", fontSize: 15, left:"-12%"}}>{i18n.t('monitoringSystem')}</Text>
    </View>

    <View style={styles.bottomContainer}>
    </View>

    </View>
  );
};

export default ProjectDescription;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },



  pestDetectionButton: {
    borderWidth: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    top: "-60%",
    width: "40%",
    padding: "4%",
    height: "30%",
    left:"19%"
  },

  projectDescriptionButton: {
    borderWidth: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    top: "-60%",
    width: "40%",
    padding: "4%",
    height: "30%",
    left:"19%"
  },
  monitoringSystemButton: {
    borderWidth: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    top: "-60%",
    width: "40%",
    padding: "4%",
    height: "30%",
    left:"23%"
  },

  topContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    top: "0%",
    height: "10%",
    width: "100%"
  },

  imageContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    top: "10%",
    height: "50%",
    width: "100%"
  },



  projectDescriptionButtonContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "30%",
    width: "33.3333%",
    top: "60%",
    left: "0%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pestDetectionButtonContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "30%",
    width: "33.3333%",
    top: "60%",
    left: "33.3333%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  monitoringSystemButtonContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "30%",
    width: "33.3333%",
    top: "60%",
    left: "66.6666%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },



  bottomContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "10%",
    width: "100%",
    top: "90%",
  },

});