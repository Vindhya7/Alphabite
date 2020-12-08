import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppBar from "../components/AppBar.js";
import firebase from "firebase";
import Autocomplete from "react-native-autocomplete-input";
import RecipeCard from "../components/RecipeCard.js";
import calculateRecs from "../components/calculateRecs.js";
import getRecipes from "../api/spoonacular.js";

class RecipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      uid: "",
      userNutrients: [],
      userInventory: [],
      recipes: [],
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ uid: user.uid });
      firebase
        .database()
        .ref("users/" + user.uid)
        .once("value")
        .then((snapshot) => {
          const nutrients = Object.keys(snapshot.val()["nutrition"]).reduce(
            (arr, item) => [
              ...arr,
              {
                nutrient: item,
                consumed: snapshot.val()["nutrition"][item][0],
                required: snapshot.val()["nutrition"][item][1],
              },
            ],
            []
          );

          const inventory = Object.keys(snapshot.val()["inventory"]).reduce(
            (arr, item) => [
              ...arr,
              {
                key: item,
                quantity: snapshot.val()["inventory"][item].quantity,
                reminder: snapshot.val()["inventory"][item].reminder,
              },
            ],
            []
          );

          this.setState({ userInventory: inventory });

          this.setState({ userNutrients: nutrients });

          const keyWords = calculateRecs(
            this.state.userInventory,
            this.state.userNutrients
          );

          const prom = Promise.resolve(this.fetchRecipes(keyWords));

          prom.then((response) => {
            response.map(({ id, image, title }) => {
              this.setState({
                recipes: [
                  ...this.state.recipes,
                  { id: id, image: image, title: title },
                ],
              });
            });
          });
        });
    });
  }

  fetchRecipes = async (keyWords) => {
    const response = await getRecipes(keyWords);
    return response;
  };

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
          keyExtractor={(item, i) => (
            item
          )}
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

        <ScrollView>
          {nutrients.length > 0
            ? nutrients.map((item, idx) => {
                return (
                  <Text key={idx} style={styles.loginText}>
                    {item}
                  </Text>
                );
              })
            : this.state.recipes.map((recipe) => {
                return (<RecipeCard
                  id={recipe.id}
                  key={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                />);
              })}
        </ScrollView>
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
