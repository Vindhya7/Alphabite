import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import firebase from '@firebase/app';
import firebaseConfig from './config/firebase.js';
import AuthNavigator from './screens/AuthNavigator';
import HomeNavigator from './screens/HomeNavigator';



firebase.initializeApp(firebaseConfig);


export default createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthNavigator,
      App: HomeNavigator,
    },
    {
      initialRouteName: 'Auth'
    }
  )
);