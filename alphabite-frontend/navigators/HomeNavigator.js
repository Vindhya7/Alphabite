import { createDrawerNavigator } from "react-navigation-drawer";
import UserProfileScreen from "../screens/UserProfileScreen.js";
import InventoryStack from "../navigators/InventoryStack.js";
import NutritionStack from "../navigators/NutritionStack.js";
import RecipeStack from "../navigators/RecipeStack.js";
import RewardScreen from "../screens/RewardScreen.js";
import { createAppContainer } from "react-navigation";

const HomeNavigator = createDrawerNavigator(
  {
    UserProfile: { screen: UserProfileScreen },
    Inventory: { screen: InventoryStack },
    Nutrition: { screen: NutritionStack },
    Recipe: { screen: RecipeStack },
    Rewards: {screen: RewardScreen},
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
