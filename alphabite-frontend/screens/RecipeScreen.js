import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Picker,
  TouchableHighlight,
} from "react-native";
import AppBar from "../components/AppBar.js";
import { IconButton, Portal, FAB, Dialog, Button } from "react-native-paper";
import firebase from "firebase";
import { NavigationEvents } from "react-navigation";
import getRecipeByID from "../api/spGetRecipeByID";

class RecipeScreen extends React.Component {
  static navigationOptions = {
    title: "Recipe details",
    headerStyle: { backgroundColor: "#95db93" },
    headerTitleStyle: { color: "#000a13" },
  };

  constructor(props) {
    super(props);
    this.state = {
      recipe: {},
    };
  }

  componentDidMount() {
    const prom = Promise.resolve(
      this.fetchRecipe(this.props.navigation.state.params.id)
    );
    prom.then((recipe) => {
        console.log(recipe.nutrition);
      this.setState({ recipe: recipe });
    });
  }

  fetchRecipe = async (id) => {
    const response = await getRecipeByID(id);
    return response;
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>{this.state.recipe.title}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RecipeScreen;
