import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { OrderDetails, OrderLiveUpdates } from "../screens";

const Tab = createMaterialTopTabNavigator();

interface OrderDetailsNavigatorI {
  route: any;
}

const OrderDetailsNavigator = ({ route }: OrderDetailsNavigatorI) => {
  const id = route.params.id;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Details">{() => <OrderDetails id={id} />}</Tab.Screen>
      <Tab.Screen name="OrderLiveUpdates">{() => <OrderLiveUpdates id={id} />}</Tab.Screen>
    </Tab.Navigator>
  );
};

export default OrderDetailsNavigator;
