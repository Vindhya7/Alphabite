import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";

import AppBar from "../components/AppBar.js";
import firebase from "firebase";
import Autocomplete from "react-native-autocomplete-input";
import RecipeCard from "../components/RecipeCard.js";
import calculateRecs from "../api/calculateRecs.js";
import getRecipes from "../api/spGetRecipes.js";
import { IconButton, TextInput } from "react-native-paper";
import { FlatGrid } from "react-native-super-grid";
import debounce from "../api/debounce";
import getRecipeSuggestions from "../api/spGetRecipeSuggestions";
import { AppLoading } from "expo";

class AllRecipesScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      uid: "",
      userNutrients: [],
      userInventory: [],
      recipes: [],
      searchResults: [],
      isLoading: false,
    };
    this.getRecipeSearchResults = debounce(this.getRecipeSearchResults, 500);
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

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  fetchRecipes = async (keyWords) => {
    const response = await getRecipes(keyWords);
    return response;
  };

  getRecipeSearchResults(searchTerm) {
    if (searchTerm === "") {
      this.setState({ searchResults: [] });
      this.setState({ isLoading: false });
      return;
    }

    //TODO get recipe suggestions from spoonacular
    const prom = Promise.resolve(getRecipeSuggestions(searchTerm));

    prom.then(({ results }) => {
      this.setState({ searchResults: results });
      this.setState({ isLoading: false });
    });
  }

  handleInputChange(text) {
    this.setState({ searchTerm: text }, () => {
      this.setState({ isLoading: true });
      this.getRecipeSearchResults(this.state.searchTerm);
    });
  }

  render() {
    const recipeSearchResults = this.state.searchResults;

    return (
      <SafeAreaView style={styles.container}>
        <AppBar navigation={this.props.navigation} title="Recipes" />

        <View
          style={{
            backgroundColor: "#95db93",
            height: 80,
            paddingTop: 15,
            flexDirection: "row",
          }}
        >
          <IconButton style={{marginTop:20}} icon="magnify" />
          <TextInput
            style={styles.inputContainer}
            value={this.state.searchTerm}
            onChangeText={(text) => this.handleInputChange(text)}
          />
        </View>

        <ScrollView>
          <Button
            onPress={() => this.props.navigation.navigate("Recipe")}
            title="Click me Vindy"
          ></Button>

          {this.state.isLoading ? (
            <Portal>
              <Dialog visible="true">
                <Dialog.Title>Loading</Dialog.Title>
                <ActivityIndicator animating={true} />
              </Dialog>
            </Portal>
          ) : recipeSearchResults && recipeSearchResults.length > 0 ? (
              <FlatGrid
                itemDimension={130}
                data={this.state.searchResults}
                style={styles.gridView}
                spacing={10}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <RecipeCard
                    nav={this.props.navigation}
                    title={item.title}
                    image={item.image}
                    id={item.id}
                  />
                )}
              />
           
          ) : (
            <FlatGrid
              itemDimension={130}
              data={this.state.recipes}
              style={styles.gridView}
              spacing={10}
              keyExtractor={(item, idx) => item.id}
              renderItem={({ item }) => (
                <RecipeCard
                  nav={this.props.navigation}
                  title={item.title}
                  image={item.image}
                  id={item.id}
                />
              )}
            />
          )}
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
  inputContainer: {
    marginRight: 40,
    marginBottom:30,
    width:"80%",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "#000a13",
    borderBottomWidth:1,
    backgroundColor:"#95db93",
    paddingBottom:45
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
});

export default AllRecipesScreen;
