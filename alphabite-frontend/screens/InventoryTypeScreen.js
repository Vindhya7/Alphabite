import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import firebase from "firebase";

class InventoryTypeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uid: "", itemName: "", expiryDate: "", quantity: "" };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({ uid: user.uid });
      }
    });
  }

  static navigationOptions = {
    title: "Enter the Item details",
    headerStyle: { backgroundColor: "#95db93" },
    headerTitleStyle: { color: "#000a13" },
  };

  addItemInfo() {
    firebase
      .database()
      .ref("users/" + this.state.uid + "/inventory/")
      .once("value")
      .then((snapshot) => {
        var vals = snapshot.val();
        var updateKey = this.state.itemName.toLowerCase();
        var updateQuantity = this.state.quantity;
        var reminder = "set";
        if (vals) {
          if (updateKey in vals) {
            var q = vals[this.state.itemName.toLowerCase()];
            updateQuantity = Number(q.quantity) + Number(this.state.quantity);
            reminder = q.reminder;
          }
        }

        var obj = { quantity: updateQuantity, reminder: reminder };

        firebase
          .database()
          .ref("users/" + this.state.uid + "/inventory/")
          .update({
            [updateKey]: obj,
          });

        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inputView}>
          <Text>Item Name</Text>
          <TextInput
            style={styles.inputText}
            placeholder=""
            placeholderTextColor="#000a13"
            returnKeyType="next"
            textContentType="name"
            value={this.state.itemName}
            onChangeText={(itemName) => this.setState({ itemName })}
          />
        </View>

        <View style={styles.inputView}>
          <Text>Quantity</Text>
          <TextInput
            style={styles.inputText}
            placeholder=""
            placeholderTextColor="#000a13"
            returnKeyType="next"
            textContentType="name"
            value={this.quantity}
            onChangeText={(quantity) => this.setState({ quantity })}
          />
        </View>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => this.addItemInfo()}
        >
          <Text style={styles.loginText}>Confirm</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000a13",
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#F7F7F7",
    borderRadius: 25,
    height: 65,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    fontWeight: "bold",
    color: "#000a13",
    width: "100%",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#71ceac",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: {
    color: "#000a13",
    fontWeight: "bold",
  },
});
export default InventoryTypeScreen;
