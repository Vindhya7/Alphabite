import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from "react-native";
import * as Font from "expo-font";
import AppBar from "../components/AppBar.js";
import { IconButton, Button } from "react-native-paper";
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
      uid: "",
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

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({ uid: user.uid });
      }
    });

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
        let amount = Number(nutrientObj.amount).toFixed(0);
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

  handleSubmit = async () => {
    var nutrients = this.state.nutrients;

    firebase
      .database()
      .ref("users/" + this.state.uid)
      .update({
        nutritionCount: firebase.database.ServerValue.increment(1),
      });

    await nutrients.map((nutrientObj) => {
      const skip = [
        "Saturated Fat",
        "Net Carbohydrates",
        "Sugar",
        "Folate",
        "Trans Fat",
        "Mono Unsaturated Fat",
        "Poly Unsaturated Fat",
        "Alcohol",
        "Caffein",
        "Fluoride",
        "Choline",
        "Folic Acid",
      ];

      var title = nutrientObj.title;
      var amount = nutrientObj.amount;
      var unit = nutrientObj.unit;
      if (!skip.includes(title)) {
        firebase.database()
          .ref("users/" + this.state.uid + "/nutrition/" + title)
          .once("value")
          .then((snapshot) => {
            var quant = snapshot.val()[0];
            var numb = quant.match(/\d/g);
            numb = numb.join("");
            var total = (Number(numb) + Number(amount)).toFixed(0);
            var final = total + unit;
            firebase.database().ref("users/" + this.state.uid + "/nutrition/" + title).update({
              0: final,
            });
          });
      }
    });

    this.props.navigation.navigate("Nutrition");
  }

  render() {
    let icontag;
    if (this.state.recipe.vegetarian || this.state.recipe.vegan) {
      icontag = <IconButton color="white" icon="leaf" />;
    } else {
      if (this.state.recipe.glutenFree) {
        icontag = <Text style={styles.details}>GF</Text>;
      } else {
        icontag = <Text>-</Text>;
      }
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
              style={styles.gradient}
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
                  {icontag}
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <View style={styles.nutrientBlock}>
                    <Text style={styles.nutrientText}>Calories</Text>
                    <Text style={styles.nutrientText}>
                      {this.state.calories}
                    </Text>
                  </View>
                  <View style={styles.nutrientBlock}>
                    <Text style={styles.nutrientText}>Carbs</Text>
                    <Text style={styles.nutrientText}>{this.state.carbs}</Text>
                  </View>
                  <View style={styles.nutrientBlock}>
                    <Text style={styles.nutrientText}>Protein</Text>
                    <Text style={styles.nutrientText}>
                      {this.state.protein}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Button
                    dark="true"
                    color="rgba(0,0,0,0.6)"
                    mode="contained"
                    style={{ margin: 30 }}
                    onPress={() => this.handleSubmit()}
                  >
                    Add to Nutrients
                  </Button>
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
  nutrientBlock: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 80,
    height: 70,
    margin: 5,
    padding: 5,
    borderRadius: 4,
  },
  nutrientText: {
    color: "white",
    margin: 3,
    textAlign: "center",
    fontFamily: "Montserrat",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});

export default RecipeScreen;
