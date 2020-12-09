import AllRecipesScreen from "../screens/AllRecipesScreen";
import RecipeScreen from "../screens/RecipeScreen";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

const RecipeStack = createStackNavigator(
  {
    Recipes: { screen: AllRecipesScreen },
    Recipe: { screen: RecipeScreen },
  },
  {
    initialRouteName: "Recipes",
  }
);

export default createAppContainer(RecipeStack);
