import React from 'react';
import {  StyleSheet, Text, View, SafeAreaView, Button, Image, 
  TouchableOpacity, TouchableHighlight, StatusBar, TextInput, 
  Picker, FlatList, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import firebase from 'firebase';
import 'react-native-gesture-handler';


class UserProfileScreen extends React.Component{

    constructor(props){
      super(props);
      this.state = { user: {}, 
            isModalVisible: false,
            inputText: '',
            editedItem: 0, 
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
              this.setState({user: user});
              
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
        this.setState({ data: newData })
    }

    renderItem = ({item}) => (
        <TouchableHighlight 
          onPress = {() => { this.setModalVisible(true); this.setInputText(item.v), this.setEditedItem(item.id) }}>
            <Text> {item.k} : {item.v}</Text>
        </TouchableHighlight>
    )

    render(){
        var img;
        if(this.state.user){
          img = this.state.user.gender == "Male" ? require('../avatars/Male.jpg') : require('../avatars/Female.jpg')
        }
        else{
          img = require("../avatars/defaultuser.jpg")
        }

        console.log(this.state)

        return(
            <SafeAreaView style = {styles.container}>

            <Modal animationType="fade" visible={this.state.isModalVisible} 
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

                <TouchableOpacity 
                    style = {styles.icon}
                    onPress={this.props.navigation.openDrawer}>

                    <FontAwesome5 name = "bars" size = {24} color = "#161924" />
                </TouchableOpacity>

              <View style={styles.innerContainer}>
                
                <View style={styles.topContainer}>
                    <Image style={styles.userImage} source = {img}/>
                    <Text>Hi, {this.state.user.displayName}</Text>
                </View>

                <View style={styles.bottomContainer}>

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
    backgroundColor: '#003f5c',
    marginTop: StatusBar.currentHeight
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
  bottomContainer: {
    alignItems: 'center',
    backgroundColor: '#465881',
    margin: 10
  },
  innerContainer:{
    alignItems:'center'
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
  modalView: {
        flex: 1, 
        backgroundColor: 'white',
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
  }
});

export default UserProfileScreen;
