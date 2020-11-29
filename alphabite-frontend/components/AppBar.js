import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';

const AppBar = ({navigation}) => {
    console.log(navigation);
    return(
        <Appbar.Header style={{backgroundColor:'#95db93'}}>
            <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()}/>
            <Appbar.Content style={styles.title} title="Alphabite"/>
            <Appbar.Action icon="logout" onPress={() => {firebase.auth().signOut(); navigation.navigate('SignIn')}} />
        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
title:{
    color:'#000a13',
    fontWeight:600
}
});

export default AppBar;