import 'react-native-gesture-handler';
import InventoryScreen from './InventoryScreen.js';
import InventoryScanScreen from './InventoryScanScreen.js';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';


const InventoryStack = createStackNavigator({
        Inventory: { screen: InventoryScreen },
        Scan: { screen: InventoryScanScreen }
    },
    {
        initialRouteName: 'Inventory'
    }
);

export default createAppContainer(InventoryStack);
