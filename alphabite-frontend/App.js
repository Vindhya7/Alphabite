import 'react-native-gesture-handler';
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Provider } from 'react-native-paper';
import firebase from '@firebase/app';
import firebaseConfig from './config/firebase.js';
import AuthNavigator from './navigators/AuthNavigator';
import HomeNavigator from './navigators/HomeNavigator';



firebase.initializeApp(firebaseConfig);

const AppContainer = createAppContainer(
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


class App extends React.Component{

    render(){
        return(
            <Provider>
                <AppContainer />
            </Provider>
        );
    }
}

export default App;
