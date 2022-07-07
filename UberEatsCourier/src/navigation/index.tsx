import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator } from "react-native";
import { useAuthContext } from "../context/AuthContext";
import OrderDelivery from "../screens/OrderDelivery";
import OrdersScreen from "../screens/OrdersScreen";
import Profile from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { dbCourier } = useAuthContext();

  if (dbCourier === null) return <ActivityIndicator size="large" color={"grey"} />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="OrderDeliveryScreen" component={OrderDelivery} />
        </>
      ) : (
        <Stack.Screen name="Profile" component={Profile} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
