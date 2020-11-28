import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import "firebase/firestore";
import firebase from "firebase";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

class SignInScreen extends React.Component {
  state = { email: '', password: '', errorMessage: '', loading: false };

  onLoginSuccess() {
    this.props.navigation.navigate('App');
  }

  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false });
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

  async signInWithEmail() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(this.onLoginSuccess.bind(this))
      .catch(error => {
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak Password!');
          } else {
              this.onLoginFailure.bind(this)(errorMessage);
          }
      });
  }

  
  render() {
    return (
        <View style={styles.container}>

          <Text style={styles.logo}>AlphaBite</Text>

            <View style={styles.inputView} >
              <MaterialIcons name="email" size={24} color="black" />
              <TextInput  
                style={styles.inputText}
                placeholder=""
                placeholderTextColor="#000a13"
                returnKeyType="next"
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </View>


            <View style={styles.inputView} >
              <Entypo name="lock-open" size={24} color="black" />
              <TextInput  
                style={styles.inputText}
                placeholder=""
                placeholderTextColor="#000a13"
                returnKeyType="done"
                textContentType="newPassword"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
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
              onPress={() => this.signInWithEmail()}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
                  this.props.navigation.navigate("SignUp");
                }}>
              <Text style={styles.loginText}>Signup</Text>
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
    flexDirection: 'row',
    backgroundColor:"#95db93",
    borderRadius:25,
    height:65,
    marginBottom:20,
    padding:20

  },
  inputText:{
    color:"#000a13",
    fontWeight:'bold',
    marginLeft:5,
    width:"100%",
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

export default SignInScreen;