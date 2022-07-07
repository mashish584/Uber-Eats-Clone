import { NavigationContainer } from "@react-navigation/native";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
// import { StyleSheet } from "react-native";
import RootNavigator from "./src/navigation";
import config from "./src/aws-exports";
import { StatusBar } from "expo-status-bar";
import AuthContextProvider from "./src/context/AuthContext";
import BasketProvider from "./src/context/BasketContext";
import OrderProvider from "./src/context/OrderContext";

Amplify.configure({ ...config, Analytics: { disabled: true } });

function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <BasketProvider>
          <OrderProvider>
            <RootNavigator />
          </OrderProvider>
        </BasketProvider>
      </AuthContextProvider>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
