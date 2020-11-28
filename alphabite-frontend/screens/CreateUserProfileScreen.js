import React from 'react';


import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Picker
} from 'react-native';
import firebase from 'firebase';

class CreateUserProfileScreen extends React.Component {
  state = { user: {}, displayName: '', height: '', weight: '', age: '', gender: 'Female', errorMessage: '', loading: false };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({user: user});
      }
    })
  }

  renderLoading() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
  }

  addUserInfo(){

    firebase
      .database()
      .ref('users/' + this.state.user.uid)
      .set({
        displayName: this.state.displayName,
        weight: this.state.weight,
        height: this.state.height,
        age: this.state.age,
        gender: this.state.gender,
        inventory: {}
      }).then((data) => {
        this.props.navigation.navigate('App');
      }).catch((error) => {
        this.setState({ error: errorMessage, loading: false });
      });

  }


  render(){

    return(
      <View style={styles.container}>
        <Text style={styles.logo}>AlphaBite</Text>
          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder="Name"
              placeholderTextColor="#B1B1B1"
              returnKeyType="next"
              textContentType="name"
              value={this.state.displayName}
              onChangeText={displayName => this.setState({ displayName })}
            />
          </View>

          <View style={styles.inputView} >
            <Picker
                style={{ backgroundColor:"#465881",textColor:"#B1B1B1",height: 50, width: "80%" }}
                onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}
            >
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Male" value="Male" />
            </Picker>
          </View>

          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder="Age"
              placeholderTextColor="#B1B1B1"
              returnKeyType="next"
              textContentType="number-pad"
              value={this.state.age}
              onChangeText={age => this.setState({ age })}
            />
          </View>

          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder="Height in cm"
              placeholderTextColor="#B1B1B1"
              returnKeyType="next"
              keyboardType="number-pad"
              value={this.state.height}
              onChangeText={height => this.setState({ height })}
            />
          </View>

          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder="Weight in lbs"
              placeholderTextColor="#B1B1B1"
              returnKeyType="done"
              keyboardType="number-pad"
              value={this.state.weight}
              onChangeText={weight => this.setState({ weight })}
            />
          </View>

          {this.renderLoading()}
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "red",
                width: "80%"
              }}
            >
              {this.state.error}
            </Text>

          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => this.addUserInfo()}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>

      </View>
    );
    
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
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

export default CreateUserProfileScreen;