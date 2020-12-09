import InventoryScreen from "../screens/InventoryScreen.js";
import InventoryScanScreen from "../screens/InventoryScanScreen.js";
import InventoryTypeScreen from "../screens/InventoryTypeScreen.js";
import InventoryScanConfirmScreen from "../screens/InventoryScanConfirmScreen.js";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

const InventoryStack = createStackNavigator(
  {
    Inventory: { screen: InventoryScreen },
    Scan: { screen: InventoryScanScreen },
    Type: { screen: InventoryTypeScreen },
    Confirm: { screen: InventoryScanConfirmScreen },
  },
  {
    initialRouteName: "Inventory",
  }
);

export default createAppContainer(InventoryStack);
