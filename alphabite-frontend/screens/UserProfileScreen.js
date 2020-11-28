import React from 'react';
import {  StyleSheet, Text, View, SafeAreaView, Button, Image, 
  TouchableOpacity, TouchableHighlight, StatusBar, TextInput, 
  Picker, FlatList, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import firebase from 'firebase';
import 'react-native-gesture-handler';
import AppBar from '../components/AppBar.js';


class UserProfileScreen extends React.Component{

    constructor(props){
      super(props);
      this.state = { user: {}, 
            isModalVisible: false,
            inputText: '',
            editedItem: 0, 
            fields: ["Age", "Name", "Gender", "Height", "Weight"]
          };
    }

    

    componentDidMount() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          firebase.database().ref('users/' + user.uid).once("value")
            .then((snapshot) => {
              const user = Object.keys(snapshot.val()).map( (item, index) => {
                return {id: index, k: item, v: snapshot.val()[item]} ;
              });

              var fin = [user[1], user[0], user[3], user[4], user[2]];
              // console.log(fin)
              this.setState({user: fin});
              
          });
          
        }
      })
    }

    setModalVisible = (bool) => {
        this.setState({ isModalVisible: bool })
    }

    setInputText = (text) => {
        this.setState({ inputText: text })
    }

    setEditedItem = (id) => {
        this.setState({ editedItem: id })
    }

    handleEditItem = (editedItem) => {
        const newData = this.state.user.map( item => {
            if (item.id === editedItem ) {
                item.v = this.state.inputText
                return item
            }
            return item
        })
        this.setState({ user: newData })
    }

    renderItem = ({item}) => {

      return(
        <TouchableHighlight 
          style = {styles.loginBtn}
          onPress = {() => { this.setModalVisible(true); this.setInputText(item.v), this.setEditedItem(item.id) }}>
            <Text style = {{fontSize: 25, color: "white"}}> {this.state.fields[item.id]} {'\t\t:\t\t'} {item.v}</Text>
        </TouchableHighlight>
        );
    }

    render(){
        var img;
        if(this.state.user[4]){
          img = this.state.user[4].v == "Male" ? require('../avatars/Male.jpg') : require('../avatars/Female.jpg')
        }
        else{
          img = require("../avatars/defaultuser.jpg")
        }
        var name = ""
        if(this.state.user[0]){ name = this.state.user[0].v}

        return(
            <SafeAreaView style = {styles.container}>

            <Modal visible={this.state.isModalVisible} 
              onRequestClose={() => this.setModalVisible(false)}>
              <View style={styles.modalView}>
                <Text style={styles.inputText}>Change text:</Text>
                <TextInput
                    style={styles.inputText}
                    onChangeText={(text) => {this.setState({inputText: text}); }}
                    defaultValue={this.state.inputText}
                    editable = {true}
                    multiline = {false}
                    maxLength = {200}
                /> 
                <TouchableHighlight onPress={() => {this.handleEditItem(this.state.editedItem); this.setModalVisible(false)}} 
                    style={[styles.inputText, {backgroundColor: 'orange'}]} underlayColor={'#f1f1f1'}>
                    <Text style={styles.inputText}>Save</Text>
                </TouchableHighlight>  
              </View>           
            </Modal> 


              <AppBar navigation = {this.props.navigation}/>


              <View style={styles.innerContainer}>
                
                <View style={styles.topContainer}>
                    <Text style = {{fontSize: 35, color: "#fb5b5a", marginBottom: 15}}>Hi, {name}</Text>
                    <Image style={styles.userImage} source = {img}/>
                </View>

                <View>

                  <View>

                    <FlatList 
                      data={this.state.user}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={this.renderItem}
                    />

                  </View>
               </View>   

              </View>
                
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
  innerContainer: {
    flex: 2
  },
  icon: {
    marginLeft: 16,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  topContainer: {
    alignItems: 'center',
    margin: 10,
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
    flex: 1,
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    margin: 10,
    fontSize: 50
  },
  modalView: {
        flex: 1, 
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
  },
  userImage: {
        borderColor: '#FFF',
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
    },
  loginText:{
    color:"white"
  }, 
});

export default UserProfileScreen;
