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
        console.log(recipe);
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
        <ImageBackground source={{ uri: this.state.recipe.image }} style={styles.image}>
        <View style={styles.detailsContainer}>
          <Text style={styles.contentTitle}>{this.state.recipe.title}</Text>
        </View>
        </ImageBackground>
        
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
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  detailsContainer:{
    backgroundColor:'rgba(240, 240, 240, 0.7)',
    height:"70%",
    marginTop:250,
    marginLeft:20,
    marginRight:20,
    borderRadius:  25,
  },
  contentTitle: {
    margin: 20,
    color:'#000a13',
    fontWeight:'bold',
    fontSize:20,

  }
});

export default RecipeScreen;
