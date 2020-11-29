import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import 'react-native-gesture-handler';


class InventoryTypeScreen extends React.Component{

    constructor(props){
        super(props);
    }


    componentWillUnmount(){
        console.log(this.props.navigation.state);
        this.props.navigation.state.params.refresh();
    }

    render(){
        return(
            <SafeAreaView style = {styles.container}>
                <Text>Hi, Vindhya</Text>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003f5c'
    },
    headerContainer: {
        backgroundColor: '#465881',
        flexDirection: 'row'
    },
    icon: {
        marginLeft: 16,
        marginTop: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:40
    },
    inputView:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        height:50,
        color:"white"
    },
    forgot:{
        color:"white",
        fontSize:11
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:"white"
    }
});

export default InventoryTypeScreen;