import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const AppBar = ({navigation}) => {
    console.log(navigation);
    return(
        <Appbar.Header>
            <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()}/>
            <Appbar.Content title="Alphabite"/>
        </Appbar.Header>
    );
}

export default AppBar;