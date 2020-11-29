import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';

class AppBar extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Appbar.Header style={{backgroundColor:'#95db93'}}>
                <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()}/>
                <Appbar.Content style={styles.title} title={this.props.title}/>
                <Appbar.Action icon="logout" onPress={() => {firebase.auth().signOut(); this.props.navigation.navigate('SignIn')}} />
            </Appbar.Header>
        );
    }
    
}

const styles = StyleSheet.create({
title:{
    color:'#000a13',
}
});

export default AppBar;