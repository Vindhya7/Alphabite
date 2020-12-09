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
    let icontag;
    if(this.state.recipe.vegetarian){
      icontag=<IconButton style={{backgroundColor:'green'}} icon="square-circle"/>
    }else if(!this.state.recipe.vegetarian && !this.state.recipe.vegan){
      icontag=<IconButton style={{backgroundColor:'red'}} icon="square-circle"/>
    }else if(this.state.recipe.glutenFree){
      icontag=<IconButton style={{backgroundColor:'yellow'}} icon="barley"/>
    }else{
      icontag=<IconButton style={{backgroundColor:'yellow'}} icon="barley-off"/>
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={{ uri: this.state.recipe.image }} style={styles.image}>
        <View>
          <View style={styles.detailsContainer}>
            <Text style={styles.contentTitle}>{this.state.recipe.title}</Text>
            {icontag}
            <Text style={styles.details}>Link: {this.state.recipe.sourceUrl}</Text>
            <Text style={styles.details}>Servings: {this.state.recipe.servings}</Text>
            <Text style={styles.details}>Cooking Time: {this.state.recipe.readyInMinutes}</Text>
            <Text style={styles.details}>Health Score: {this.state.recipe.healthScore}</Text>
          </View>
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
    backgroundColor:'rgba(240, 240, 240, 0.4)',
    height:"60%",
    marginTop:50,
    marginLeft:20,
    marginRight:20,
    borderRadius:  25,
  },
  contentTitle: {
    margin: 20,
    color:'white',
    fontWeight:'bold',
    fontSize:20,
  },
  details:{
    margin:20,
    fontSize: 18,
    color: 'white'

  }
});

export default RecipeScreen;
