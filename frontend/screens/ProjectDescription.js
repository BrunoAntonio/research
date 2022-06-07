import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Linking} from 'react-native';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import back from '../assets/back.png'
  
  // Get phone language
  i18n.locale = Localization.locale;
  i18n.fallbacks = true;

const ProjectDescription = ({navigation}) => {
  return (
    <View style={styles.screen}>
            
    <View style={styles.topContainer}>
    
        <Text style={{color: "black", fontSize: 25, top: "55%"}}>{i18n.t('projectDescription')}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Image source={back}  style={{width:"100%", height: "100%", resizeMode: 'stretch',}} /></TouchableOpacity>  

    </View>

    <View style={styles.middleContainer}>
        <Text style={{color: "black", fontSize: 15, top: "-20%", left: "20%", width: "90%"}}>{i18n.t('textDescription')}</Text>
        
        <Text style={{color: 'blue', fontSize: 15, top: "-10%", left: "-20%", width: "90%"}}
        onPress={ ()=>{ Linking.openURL('https://...')}}>
        https://...</Text>
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
    height: "80%",
    width: "100%",
    top: "10%",
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



  cisucLogo: {
    width: "15%",
    height: "15%",
    resizeMode: 'stretch',
    top: "60%",
    left: "-50%"
  },
  ucLogo: {
    width: "30%",
    height: "150%",
    resizeMode: 'stretch',
    top: "-60%",
    left: "-40%"
  },
  iplLogo: {
    width: "20%",
    height: "40%",
    resizeMode: 'stretch',
    top: "20%",
    left: "-100%"
  },

});

