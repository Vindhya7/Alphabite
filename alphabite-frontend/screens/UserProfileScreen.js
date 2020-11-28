import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, StatusBar, TextInput, Picker } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import firebase from 'firebase';
import 'react-native-gesture-handler';


class UserProfileScreen extends React.Component{

    state = { user: {} };

    componentDidMount() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          firebase.database().ref('users/' + user.uid).once("value")
            .then((snapshot) => {
              this.setState({user: snapshot.val()});
              console.log(snapshot.val().gender)
          });
          
        }
      })
    }

    render(){
        var img;
        if(this.state.user){
          img = this.state.user.gender == "Male" ? require('../avatars/Male.jpg') : require('../avatars/Female.jpg')
        }
        else{
          img = require("../avatars/defaultuser.jpg")
        }

        return(
            <SafeAreaView style = {styles.container}>
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

                      <TextInput
                          style={styles.inputText}
                          placeholder="Age"
                          placeholderTextColor="#B1B1B1"
                          returnKeyType="next"
                          textContentType="number-pad"
                          value={this.state.age}
                          onChangeText={age => this.setState({ age })}
                      />
                      <TextInput
                          style={styles.inputText}
                          placeholder="Height in cm"
                          placeholderTextColor="#B1B1B1"
                          returnKeyType="next"
                          keyboardType="number-pad"
                          value={this.state.height}
                          onChangeText={height => this.setState({ height })}
                      />
                      <TextInput
                          style={styles.inputText}
                          placeholder="Weight in lbs"
                          placeholderTextColor="#B1B1B1"
                          returnKeyType="done"
                          keyboardType="number-pad"
                          value={this.state.weight}
                          onChangeText={weight => this.setState({ weight })}
                      />

                      <Picker
                          style={{ backgroundColor:"#465881",textColor:"#B1B1B1",height: 50, width: "80%" }}
                          onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}
                      >
                          <Picker.Item label="Female" value="Female" />
                          <Picker.Item label="Male" value="Male" />
                      </Picker>

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
    width:"40%",
    alignItems: 'center',
    margin: 10,
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
