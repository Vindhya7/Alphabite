import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';

const AppBar = ({navigation}) => {
    console.log(navigation);
    return(
        <Appbar.Header>
            <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()}/>
            <Appbar.Content title="Alphabite"/>
            <Appbar.Action icon="logout" onPress={() => {firebase.auth().signOut(); navigation.navigate('SignIn')}} />
        </Appbar.Header>
    );
}

export default AppBar;