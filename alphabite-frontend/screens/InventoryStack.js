import 'react-native-gesture-handler';
import InventoryScreen from './InventoryScreen.js';
import InventoryScanScreen from './InventoryScanScreen.js';
import InventoryTypeScreen from './InventoryTypeScreen.js'
import InventoryScanConfirmScreen from './InventoryScanConfirmScreen.js'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';



const InventoryStack = createStackNavigator({
        Inventory: { screen: InventoryScreen },
        Scan: { screen: InventoryScanScreen },
        Type: { screen: InventoryTypeScreen },
        Confirm: { screen: InventoryScanConfirmScreen }
    },
    {
        initialRouteName: 'Inventory'
    }
);

export default createAppContainer(InventoryStack);
