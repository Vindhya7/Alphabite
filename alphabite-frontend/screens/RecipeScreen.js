import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import AppBar from "../components/AppBar.js";
import firebase from "firebase";
import Autocomplete from "react-native-autocomplete-input";
import RecipeCard from "./RecipeCard.js";

class RecipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      uid: "",
      userNutrients: [],
      userInventory: [],
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ uid: user.uid });
      firebase
        .database()
        .ref("users/" + user.uid + "/nutrition")
        .once("value")
        .then((snapshot) => {
          const nutrients = Object.keys(snapshot.val()).reduce(
            (arr, item) => [
              ...arr,
              {
                nutrient: item,
                consumed: snapshot.val()[item][0],
                required: snapshot.val()[item][1],
              },
            ],
            []
          );

          this.setState({ userNutrients: nutrients });
        });

      firebase
        .database()
        .ref("users/" + user.uid + "/inventory")
        .once("value")
        .then((snapshot) => {
          const newData = Object.keys(snapshot.val()).reduce(
            (arr, item) => [
              ...arr,
              {
                key: item,
                quantity: snapshot.val()[item].quantity,
                reminder: snapshot.val()[item].reminder,
              },
            ],
            []
          );

          this.setState({ userInventory: newData });
        });
    });
  }

  findNutrients(searchTerm) {
    if (searchTerm === "") {
      return [];
    }

    const { userNutrients } = this.state;
    const keys = userNutrients.map((obj) => {
      return obj.nutrient;
    });
    const regex = new RegExp(`${searchTerm.trim()}`, "i");
    return keys.filter((key) => key.search(regex) >= 0);
  }

  filter() {}

  render() {
    const { searchTerm } = this.state;
    const nutrients = this.findNutrients(searchTerm);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <SafeAreaView style={styles.container}>
        <AppBar navigation={this.props.navigation} title="Recipes" />
        <Autocomplete
          onChangeText={(text) => this.setState({ searchTerm: text })}
          renderItem={({ item, i }) => (
            <TouchableOpacity
              onPress={() => this.setState({ searchTerm: item })}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          data={
            nutrients.length === 1 && comp(searchTerm, nutrients[0])
              ? []
              : nutrients
          }
        />

        <View>
          {nutrients.length > 0 ? (
            nutrients.map((item, idx) => {
              return (
                <Text key={idx} style={styles.loginText}>
                  {item}
                </Text>
              );
            })
          ) : (
            <Text style={styles.loginText}>Nothing found</Text>
          )}
        </View>
        <View>
          <RecipeCard/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000a13",
  },
  loginBtn: {
    width: 70,
    borderColor: "#000a13",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
  },
  loginText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  searchInput: {
    padding: 10,
    borderColor: "#CCC",
    borderWidth: 1,
  },
});

export default RecipeScreen;
