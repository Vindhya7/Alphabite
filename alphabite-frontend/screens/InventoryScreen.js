import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import InventoryList from "../components/InventoryList";
import 'react-native-gesture-handler';


class InventoryScreen extends React.Component{
    render(){
        return(
            <SafeAreaView style = {styles.container}>
              <View style = {styles.headerContainer}>
                  
                <TouchableOpacity 
                    style = {styles.icon}
                    onPress={this.props.navigation.openDrawer}>

                    <FontAwesome5 name = "bars" size = {24} color = "#FFFFFF" />
                    
                </TouchableOpacity>
                <Text style = {{alignSelf: 'center', marginLeft: '7%', marginTop: '2%', fontWeight:"bold", fontSize:30, color:"white",}}>Alphabite</Text>
                
              </View>

              <View style={styles.innerContainer}>

                <View style={styles.topContainer}>
                  <Text style={{color:"#fb5b5a",fontWeight:"bold",fontSize:40}}>Inventory</Text>
                </View>

                <View style={styles.bottomContainer}>

                  <InventoryList/>

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
  headerContainer: {
    backgroundColor: '#465881',
    flexDirection: 'row'
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  bottomContainer: {
    flex: 8,
    alignItems: 'stretch',
    backgroundColor: '#465881',
    margin: 10,
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
