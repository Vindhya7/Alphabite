import { createDrawerNavigator } from 'react-navigation-drawer';
import UserProfileScreen from '../screens/UserProfileScreen.js';
import InventoryStack from '../navigators/InventoryStack.js';
import NutritionScreen from '../screens/NutritionScreen.js';
import RecipeScreen from '../screens/RecipeScreen.js';
import { createAppContainer, DrawerNavigator} from 'react-navigation';


const HomeNavigator = createDrawerNavigator({
    UserProfile: { screen : UserProfileScreen },
    Inventory: { screen : InventoryStack },
    Nutrition: { screen : NutritionScreen },
    Recipe : { screen : RecipeScreen }
  },
  { 
    initialRouteName: 'UserProfile',
    drawerBackgroundColor: '#000a13',
    contentOptions: {
      inactiveTintColor: 'white',
      activeTintColor: '#000a13',
      activeBackgroundColor:'#71ceac',
        itemStyle: {


        },
    },
  }
);

export default createAppContainer(HomeNavigator);