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
              placeholderTextColor="#000a13"
              returnKeyType="next"
              textContentType="name"
              value={this.state.displayName}
              onChangeText={displayName => this.setState({ displayName })}
            />
          </View>

          <View style={styles.inputView} >
            <Picker
                style={{ backgroundColor:"#95db93",textColor:"#000a13",fontWeight:'bold',height: 50, width: "70%" }}
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
              placeholderTextColor="#000a13"
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
              placeholderTextColor="#000a13"
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
              placeholderTextColor="#000a13"
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
    backgroundColor: '#000a13',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#ffffff",
    marginBottom:40
  },
  inputView:{
    width:"70%",
    backgroundColor:"#95db93",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    fontWeight:'bold',
    color:"#000a13",
    width:"70%",
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"30%",
    backgroundColor:"#71ceac",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    marginBottom:10
  },
  loginText:{
    color:"#000a13",
    fontWeight: 'bold',
  }
});

export default CreateUserProfileScreen;