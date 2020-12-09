import NutritionSelectionScreen from "../screens/NutritionSelectionScreen";
import NutritionScreen from "../screens/NutritionScreen";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

const NutritionStack = createStackNavigator(
  {
    Nutrition: { screen: NutritionScreen },
    Selection: { screen: NutritionSelectionScreen },
  },
  {
    initialRouteName: "Nutrition",
  }
);

export default createAppContainer(NutritionStack);
