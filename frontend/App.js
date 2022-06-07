import React from "react";

// import things related to React Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import screens
import Home from "./screens/Home";
import PestDetection from "./screens/PestDetection";
import ProjectDescription from "./screens/ProjectDescription";
import MonitoringSystem from "./screens/MonitoringSystem";
import MonitoringSystemTraps from "./screens/MonitoringSystemTraps";
import MonitoringSystemImages from "./screens/MonitoringSystemImages";

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Get phone language
i18n.locale = Localization.locale;
i18n.fallbacks = true;

i18n.translations = {
  pt: {projectDescription: 'Descrição do projeto', pestDetection: 'Deteção de pragas', 
      loading: 'A fazer as deteções. Por favor aguarde.', numberOfDetections: 'Deteções', save: 'Guardar imagem', takePicture: 'Capturar imagem', 
      whiteflies: 'Mosca branca', 
      textDescription: '... para utilização de Inteligência Artificial na Agricultura.\n\nPode saber mais em:',
      pestSelection:'Escolha a praga a detetar', monitoringSystem:'Sistema de monitorização',
      plantationName: 'Nome da plantação', plantationAddress: 'Morada da plantação', trapID: 'Identificador da armadilha'},
  en: {projectDescription: 'Project description', pestDetection: 'Pest detection', 
      loading: 'Making Detections. Please Wait.', numberOfDetections: 'Number of detections', save: 'Save picture', takePicture: 'Take a picture', 
      whiteflies: 'Whiteflies',  
      textDescription: '... for the use of Artificial Intelligence in Agriculture.\n\nFind out more on:',
      pestSelection:'Select the pest to detect', monitoringSystem:'Monitoring System',
      plantationName: 'Plantation name', plantationAddress: 'Plantation address', trapID: 'Trap ID'},
};

// create a "stack"
const MyStack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MyStack.Navigator  screenOptions={{headerShown: false}}>
      <MyStack.Screen name="Home" component={Home} />
        <MyStack.Screen name="PestDetection" component={PestDetection} />
        <MyStack.Screen name="ProjectDescription" component={ProjectDescription} />
        <MyStack.Screen name="MonitoringSystem" component={MonitoringSystem} />
        <MyStack.Screen name="MonitoringSystemTraps" component={MonitoringSystemTraps} />
        <MyStack.Screen name="MonitoringSystemImages" component={MonitoringSystemImages} />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
