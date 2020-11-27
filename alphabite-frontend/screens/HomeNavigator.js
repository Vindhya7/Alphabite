import { createDrawerNavigator } from 'react-navigation-drawer';
import UserProfileScreen from './UserProfileScreen.js';
import InventoryScreen from './InventoryScreen.js';
import NutritionScreen from './NutritionScreen.js';
import RecipeScreen from './RecipeScreen.js';
import { createAppContainer, DrawerNavigator} from 'react-navigation';


const HomeNavigator = createDrawerNavigator({
    UserProfile: { screen : UserProfileScreen },
    Inventory: { screen : InventoryScreen },
    Nutrition: { screen : NutritionScreen },
    Recipe : { screen : RecipeScreen }
  },
  { initialRouteName: 'UserProfile' },
  {
    drawerWidth:250,
    drawerType:'slide'
  }
);

export default createAppContainer(HomeNavigator);