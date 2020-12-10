import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Picker,
  ImageBackground,
  TouchableHighlight,
  Linking,
} from "react-native";
import * as Font from "expo-font";
import AppBar from "../components/AppBar.js";
import { IconButton, Portal, FAB, Dialog, Button } from "react-native-paper";
import firebase from "firebase";
import { NavigationEvents } from "react-navigation";
import getRecipeByID from "../api/spGetRecipeByID";
import { LinearGradient } from "expo-linear-gradient";
import { AppLoading } from "expo";

let customFonts = {
  Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
  "Montserrat-bold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
};

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
      nutrients: [],
      fontsLoaded: false,
      calories: "-",
      protein: "-",
      carbs: "-",
      dishTypes: [],
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidMount() {
    this._loadFontsAsync();
    const prom = Promise.resolve(
      this.fetchRecipe(this.props.navigation.state.params.id)
    );
    prom.then((recipe) => {
      this.setState({ recipe: recipe });
      this.setState({ nutrients: recipe.nutrition.nutrients });
      this.setState({ dishTypes: recipe.dishTypes });

      //process Protein, calories, carbs
      this.state.nutrients.map((nutrientObj) => {
        let title = nutrientObj.title;
        let amount = nutrientObj.amount;
        let unit = nutrientObj.unit;
        let val = amount + unit;
        if (title === "Calories") {
          this.setState({ calories: val });
        }
        if (title === "Protein") {
          this.setState({ protein: val });
        }
        if (title === "Carbohydrates") {
          this.setState({ carbs: val });
        }
      });
    });
  }

  fetchRecipe = async (id) => {
    const response = await getRecipeByID(id);
    return response;
  };

  addDishtypes() {
    return this.state.recipe.dishTypes.map((element, idx) => {
      return (
        <View
          key={idx}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            margin: 5,
            padding: 5,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "white", fontFamily: "Montserrat" }}>
            {element}
          </Text>
        </View>
      );
    });
  }

  render() {
    let icontag;
    if (this.state.recipe.vegetarian) {
      icontag = (
        <IconButton style={{ backgroundColor: "green" }} icon="square-circle" />
      );
    } else if (!this.state.recipe.vegetarian && !this.state.recipe.vegan) {
      icontag = (
        <IconButton style={{ backgroundColor: "red" }} icon="square-circle" />
      );
    } else if (this.state.recipe.glutenFree) {
      icontag = (
        <IconButton style={{ backgroundColor: "yellow" }} icon="barley" />
      );
    } else {
      icontag = (
        <IconButton style={{ backgroundColor: "yellow" }} icon="barley-off" />
      );
    }

    if (this.state.fontsLoaded) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <ImageBackground
            source={{ uri: this.state.recipe.image }}
            style={styles.image}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.8)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "100%",
              }}
            >
              <View style={styles.detailsContainer}>
                <Text
                  style={styles.contentTitle}
                  onPress={() => {
                    Linking.openURL(this.state.recipe.sourceUrl);
                  }}
                >
                  {this.state.recipe.title}
                </Text>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  {this.state.dishTypes.length === 0 ? (
                    <AppLoading />
                  ) : (
                    this.addDishtypes()
                  )}
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={styles.details}>
                    Servings: {this.state.recipe.servings}
                  </Text>
                  <Text style={styles.details}>
                    Cooking Time: {this.state.recipe.readyInMinutes}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      width: 80,
                      height: 70,
                      margin: 5,
                      padding: 5,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        margin: 3,
                        textAlign: "center",
                        fontFamily: "Montserrat",
                      }}
                    >
                      Calories
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        margin: 3,
                        textAlign: "center",
                        fontFamily: "Montserrat",
                      }}
                    >
                      {this.state.calories}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      width: 80,
                      height: 70,
                      margin: 5,
                      padding: 5,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        margin: 3,
                        textAlign: "center",
                        fontFamily: "Montserrat",
                      }}
                    >
                      Carbs
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        margin: 3,
                        textAlign: "center",
                        fontFamily: "Montserrat",
                      }}
                    >
                      {this.state.carbs}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      width: 80,
                      height: 70,
                      margin: 5,
                      padding: 5,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        margin: 3,
                        textAlign: "center",
                        fontFamily: "Montserrat",
                      }}
                    >
                      Protein
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        margin: 3,
                        textAlign: "center",
                        fontFamily: "Montserrat",
                      }}
                    >
                      {this.state.protein}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <IconButton
                    size={40}
                    color="white"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                      alignSelf: "flex-end",
                      margin: 30,
                    }}
                    icon="plus"
                  ></IconButton>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </SafeAreaView>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  detailsContainer: {
    backgroundColor: "rgba(240, 240, 240, 0.3)",
    height: "52%",
    marginTop: 250,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 25,
  },
  contentTitle: {
    margin: 20,
    color: "white",
    fontSize: 20,
    textDecorationLine: "underline",
    textAlign: "center",
    fontFamily: "Montserrat-bold",
  },
  details: {
    margin: 15,
    fontSize: 16,
    color: "white",
    fontFamily: "Montserrat",
  },
});

export default RecipeScreen;
