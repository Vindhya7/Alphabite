import { createDrawerNavigator } from "react-navigation-drawer";
import UserProfileScreen from "../screens/UserProfileScreen.js";
import InventoryStack from "../navigators/InventoryStack.js";
import NutritionScreen from "../screens/NutritionScreen.js";
import RecipeStack from "../navigators/RecipeStack.js";
import { createAppContainer } from "react-navigation";

const HomeNavigator = createDrawerNavigator(
  {
    UserProfile: { screen: UserProfileScreen },
    Inventory: { screen: InventoryStack },
    Nutrition: { screen: NutritionScreen },
    Recipe: { screen: RecipeStack },
  },
  {
    initialRouteName: "UserProfile",
    drawerBackgroundColor: "#000a13",
    contentOptions: {
      inactiveTintColor: "white",
      activeTintColor: "#000a13",
      activeBackgroundColor: "#71ceac",
      itemStyle: {},
    },
  }
);

export default createAppContainer(HomeNavigator);
