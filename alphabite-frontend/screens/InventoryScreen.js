import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import InventoryList from "../components/InventoryList";
import 'react-native-gesture-handler';


class InventoryScreen extends React.Component{
    render(){
        return(
            <SafeAreaView style = {styles.container}>
              <TouchableOpacity
                  style = {styles.icon}
                  onPress={this.props.navigation.openDrawer}>
                  <FontAwesome5 name = "bars" size = {24} color = "#161924" />
              </TouchableOpacity>

              <View style={styles.innerContainer}>

                <View style={styles.topContainer}>
                  <Text style={{color:"#fb5b5a",fontWeight:"bold",fontSize:'xxx-large'}}>Inventory</Text>
                </View>

                <View style={styles.bottomContainer}>

                  <InventoryList>

                  </InventoryList>

                </View>

              </View>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    marginTop: StatusBar.currentHeight
  },
  topContainer: {
    alignItems: 'center',
    padding:"3%",
  },
  bottomContainer: {
    width:"40%",
    alignItems: 'center',
    backgroundColor: '#465881',
    margin: 10
  },
  innerContainer:{
    alignItems:'center'
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

export default InventoryScreen;
