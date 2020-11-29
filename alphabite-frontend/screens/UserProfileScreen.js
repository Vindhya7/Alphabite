import React from 'react';
import {  StyleSheet, Text, View, SafeAreaView, Image, 
  TouchableOpacity, TouchableHighlight, StatusBar, 
  Picker, FlatList, ScrollView } from 'react-native';
import { FontAwesome5, AntDesign, MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import 'react-native-gesture-handler';
import AppBar from '../components/AppBar.js';
import { Portal, Modal, Provider, Dialog, TextInput, Button, List, IconButton } from 'react-native-paper';


class UserProfileScreen extends React.Component{

    constructor(props){
      super(props);
      this.state = { user: {}, 
            isDialogVisible: false,
            inputText: '',
            editedItem: 0, 
            fields: ["Age", "Name", "Gender", "Height", "Weight"],
            editedWord: '',
            gender: '',
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

    setDialogVisible = (bool) => {
        this.setState({ isDialogVisible: bool })
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

    handleDialog = (id) => {
      var item = this.state.user[id];
      this.setDialogVisible(true);
      this.setInputText(item.v);
      this.setEditedItem(item.id);
      this.setState({editedWord: this.state.fields[item.id]});
    }

    render(){
        console.log(this.state.user);
        var img;
        if(this.state.user[4]){
          img = this.state.user[4].v == "Male" ? require('../avatars/Male.jpg') : require('../avatars/Female.jpg')
        }
        else{
          img = require("../avatars/defaultuser.jpg")
        }
        var name = "";
        var age = "";
        var weight = "";
        var height = "";
        var gender = "";
        if(this.state.user[0]){ 
          name = this.state.user[0].v;
          age = this.state.user[1].v;
          height = this.state.user[2].v;
          weight = this.state.user[3].v;
          gender = this.state.user[4].v;
        }

        var heightInches = height/2.54
        var h2 = heightInches*heightInches;
        var bmi = ((weight / h2) * 703).toFixed(2)
        var bmitext;

        if(bmi <= 18.5){
            bmitext="Underweight";
        }else if(18.5<bmi && bmi < 25){
            bmitext="Normal";
        }else if(25 < bmi && bmi < 30){
            bmitext="Overweight";
        }else{
            bmitext="Obesity";
        }

        var dialogInput = <TextInput
                          onChangeText={(text) => {this.setState({inputText: text}); }}
                          defaultValue={this.state.inputText}
                          editable = {true}
                          multiline = {false}
                          maxLength = {200}
                          keyboardType="number-pad"
                      /> ;
        if(this.state.editedWord == this.state.fields[1]){
          dialogInput = <TextInput
                          onChangeText={(text) => {this.setState({inputText: text}); }}
                          defaultValue={this.state.inputText}
                          editable = {true}
                          multiline = {false}
                          maxLength = {200}
                          keyboardType="number-pad"
                      /> ;
        }
        else if(this.state.editedWord == this.state.fields[2]){
          dialogInput = <Picker
                selectedValue={this.state.gender}
                onValueChange={(itemValue, itemIndex) => {this.setState({ inputText: itemValue }); this.setState({gender: itemValue})}}
            >
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Male" value="Male" />
            </Picker>
        }

        var editButton = <TouchableOpacity><AntDesign name="edit" size={20} color="black" /></TouchableOpacity>;

        return(
            <SafeAreaView style = {styles.container}>
              <Portal>
                <Dialog visible={this.state.isDialogVisible} 
                  onDismiss={() => this.setDialogVisible(false)}>
                  <View >
                    <Dialog.Title style={{color: 'black'}}>Enter your {this.state.editedWord}</Dialog.Title>
                    <Dialog.Content>
                      { dialogInput }
                    </Dialog.Content>
                    <Dialog.Actions style={{}}>
                      <Button onPress={() => this.setDialogVisible(false)}>Cancel</Button>
                      <Button onPress={() => {this.handleEditItem(this.state.editedItem); this.setDialogVisible(false)}}>Ok</Button>
                    </Dialog.Actions>
                  </View>           
                </Dialog> 
              </Portal>


              <AppBar navigation = {this.props.navigation}/>
              <ScrollView>

              <View style={styles.innerContainer}>
                
                <View style={styles.topContainer}>
                    <Text style = {{fontSize: 35, fontWeight:'bold', color: "#000a13", marginBottom: 15}}>Hi, {name}</Text>
                    <Image style={styles.userImage} source = {img}/>
                </View>

                <View>

                  <View>

                      <List.Item
                        title="Name"
                        titleStyle={styles.listItemTitle}
                        description={name}
                        descriptionStyle={{fontSize: 20}}
                        left={props => <List.Icon {...props} icon="account-circle"/>}
                        right={props => <TouchableOpacity onPress={() => this.handleDialog(0)}><List.Icon {...props} icon="pencil"/></TouchableOpacity>}
                        style={styles.listItems}
                      />

                      <View style = {styles.separator} />


                      <List.Item
                      title="Age"
                      titleStyle={styles.listItemTitle}
                      description={age}
                      descriptionStyle={{fontSize: 20}}
                      left={props => <List.Icon {...props} icon="account-circle"/>}
                      right={props => <TouchableOpacity onPress={() => this.handleDialog(1)}><List.Icon {...props} icon="pencil"/></TouchableOpacity>}
                      style={styles.listItems}
                    />

                      <View style = {styles.separator} />

                    <List.Item
                      title="Gender"
                      titleStyle={styles.listItemTitle}
                      description={gender}
                      descriptionStyle={{fontSize: 20}}
                      left={props => <List.Icon {...props} icon="gender-male-female"/>}
                      right={props => <TouchableOpacity onPress={() => this.handleDialog(4)}><List.Icon {...props} icon="pencil"/></TouchableOpacity>}
                      style={styles.listItems}
                    />

                      <View style = {styles.separator} />

                    <List.Item
                      title="Height"
                      titleStyle={styles.listItemTitle}
                      description={height}
                      descriptionStyle={{fontSize: 20}}
                      left={props => <List.Icon {...props} icon="human-male-height"/>}
                      right={props => <TouchableOpacity onPress={() => this.handleDialog(2)}><List.Icon {...props} icon="pencil"/></TouchableOpacity>}
                      style={styles.listItems}
                    />


                      <View style = {styles.separator} />

                    <List.Item
                      title="Weight"
                      titleStyle={styles.listItemTitle}
                      description={weight}
                      descriptionStyle={{fontSize: 20}}
                      left={props => <List.Icon {...props} icon="weight-pound"/>}
                      right={props => <TouchableOpacity onPress={() => this.handleDialog(3)}><List.Icon {...props} icon="pencil"/></TouchableOpacity>}
                      style={styles.listItems}
                    />
                      <View style = {styles.separator} />

                    <List.Item
                      title="BMI"
                      titleStyle={styles.listItemTitle}
                      description={bmitext}
                      descriptionStyle={{fontSize: 20}}
                      left={props => <List.Icon {...props} icon="weight-pound"/>}
                      style={styles.listItems}
                    />

                    

                  </View>
               </View>   

              </View>
              </ScrollView>
                
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000a13'
  },
  innerContainer: {
    flex: 1
  },
  topContainer: {
    flex:1,
    alignItems: 'center',
    backgroundColor:"#95db93",
    marginBottom: 10,
  },
  dialogView: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent:'space-around',
        alignSelf: 'center',
        height: 300,
  },
  userImage: {
        borderColor: '#000a13',
        borderRadius: 85,
        borderWidth: 5,
        height: 170,
        marginBottom: 15,
        width: 170,
    },
  listItems: {
      alignItems: 'center'
  },
  listItemTitle: {
      color:"#ffffff",
      fontSize: 10
  },
  separator: {
    borderBottomColor: '#71ceac',
    borderBottomWidth: 1,
    width:"40%",
    alignSelf:'center'
  }
});

export default UserProfileScreen;
