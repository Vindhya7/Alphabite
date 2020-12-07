import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AppBar from '../components/AppBar.js';
import 'react-native-gesture-handler';


class RecipeScreen extends React.Component{
    render(){
        return(
            <SafeAreaView style = {styles.container}>
                <AppBar navigation = {this.props.navigation} title="Recipes"/>
                <Text>Hi, Vindhya</Text>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000a13",
  },
  innerContainer: {
    flex: 1,
    alignItems: "stretch",
  },
  bottomContainer: {
    flex: 8,
    alignItems: "stretch",
  },
  dataTable: {},
  dataHeader: {
    height: 70,
    paddingTop: 20,
    backgroundColor: "#95db93",
    fontWeight: "bold",
  },
  dataItem: {
    backgroundColor: "#F7F7F7",
  },
  dataCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  noSet: {
    color: "#000a13",
  },
  set: {
    color: "#ff0000",
    fontWeight: "bold",
  },
});

export default RecipeScreen;
