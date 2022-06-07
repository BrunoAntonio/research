import { useState } from 'react';
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';

import { LineChart } from 'react-native-chart-kit'
import { Dimensions } from "react-native";

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import back from '../assets/back.png'
  
 // {paramKey: data.labels[x.index]}
 // {(x) => navigation.navigate('MonitoringSystemImages', {paramKey: data.labels[x.index]})}

  // Get phone language
  i18n.locale = Localization.locale;
  i18n.fallbacks = true;

const MonitoringSystemTraps = ({navigation, route}) => {

  const [useDetectionsDetails, setDetectionsDetails] = useState({ labels: [" "], datasets: [{ data: [0]}]})
  const [usePlantationDetails, setPlantationDetails] = useState([" ", " ", " "])

  const url = 'http://.../monitoring_system/'+ encodeURIComponent(route.params.paramKey)

  const executeOnLoad = () => {
    axios
          .get(url)
          .then(trap_details => {
            const plantation_details = trap_details.data['description']
            const detections_details = { labels: trap_details.data['date'], datasets: [{ data: trap_details.data['detections']}]}
            setDetectionsDetails(detections_details)
            setPlantationDetails(plantation_details)
            
        },
        )
        .catch(err => { console.log(err); });
        };

  const screenWidth = Dimensions.get("window").width;
  const data = useDetectionsDetails;

  const chartConfig = {
    backgroundColor: "white",
    backgroundGradientTo: "white",
    backgroundGradientFromOpacity: 1,
    backgroundGradientFrom: "white",
    backgroundGradientToOpacity: 0,
    color: () => `black`,
    fillShadowGradient: 'green', 
    fillShadowGradientOpacity: 1, 
    strokeWidth: 0,
  
    propsForDots:{
      r: 7,
      strokeWidth: "2",
      stroke: "black"
  }
  };

  return (
    <View style={styles.screen} onLayout={executeOnLoad}>
            
    <View style={styles.topContainer}>
    
    <Text style={{color: "black", fontSize: 25, top: "40%"}}>{route.params.paramKey}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('MonitoringSystem')} style={styles.backButton}>
        <Image source={back}  style={{width:"100%", height: "100%", resizeMode: 'stretch',}} /></TouchableOpacity>   

    </View>

    <View style={styles.descriptionContainer}>
        <Text style={{top:"15%"}}>{i18n.t('plantationName')}: {usePlantationDetails[0]}</Text>
        <Text style={{top:"20%"}}>{i18n.t('plantationAddress')}: {usePlantationDetails[1]}</Text>
        <Text style={{top:"25%"}}>{i18n.t('trapID')}: {usePlantationDetails[2]}</Text>
        
    </View>

    <View style={styles.lineChartContainer}>
    
    <Text style={{ top: "2%", left:"75%"}}>{i18n.t('numberOfDetections')}</Text>
    
    <ScrollView horizontal={true} pagingEnabled={true} contentOffset={{ x: 0, y: 0 }} contentContainerStyle={{ flexGrow: 1, top:"10%" }} >
  
    <LineChart

style= {{
  marginVertical: 8,
}}

      data={data}
      width={(data.labels.length * screenWidth)/10}
      height={420}
      yAxisLabel=""
      chartConfig={chartConfig}
      verticalLabelRotation={90}
      flatColor={true}
      fromZero={true}
      withHorizontalLines={false}
      withVerticalLines={false}
      withInnerLines={false}
      withOuterLines={false}
      withHorizontalLabels={true}
      xLabelsOffset={-10}
      onDataPointClick={(x) => navigation.navigate('MonitoringSystemImages', {paramKey: route.params.paramKey, paramKey1: data.labels[x.index]})}
      renderDotContent={({ x, y, index }) => { 
        return (
          <View
            key = {index}
            style={{
              height: 24,
              width: 24,
              backgroundColor: "transparent",
              position: "absolute",
              top: y - 21, 
              left: x - 2 , 
            }}
          >
            <Text style={{ fontSize: 11 }}>{data.datasets[0].data[index]}</Text>
          </View>
        );
      }}

      />

    </ScrollView>

    </View>

    <View style={styles.bottomContainer}>

    </View>

    </View>
  );
};

export default MonitoringSystemTraps;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
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
  barContainer: {
    position: 'absolute',
    backgroundColor:"green",
    alignItems: 'center',
    height: "40%",
    width: "100%",
    top: "10%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  descriptionContainer: {
    position: 'absolute',
    backgroundColor:"white",
    height: "10%",
    width: "90%",
    top: "10%",
    flexDirection: 'column',
  },
  lineChartContainer: {
    position: 'absolute',
    backgroundColor:"white",
    height: "40%",
    width: "90%",
    top: "20%",
    left: "0%",
    flexDirection: 'row',
  },
  bottomContainer: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "10%",
    width: "100%",
    top: "90%",
  },

  barChart: {
    position: 'absolute',
    backgroundColor:"white",
    alignItems: 'center',
    height: "50%",
    width: "100%",
    top: "10%",
    left: "0%",
    overflow:"scroll"
  },

});

