import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Amplify } from "aws-amplify";
import { NavigationContainer } from "@react-navigation/native";
import { withAuthenticator } from "aws-amplify-react-native";

import Navigation from "./src/navigation";
import awsConfig from "./src/aws-exports";
import AuthContextProvider from "./src/context/AuthContext";
import OrderContextProvider from "./src/context/OrderContext";

Amplify.configure({
  ...awsConfig,
  Analytics: {
    disabled: true,
  },
});

function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AuthContextProvider>
          <OrderContextProvider>
            <Navigation />
          </OrderContextProvider>
        </AuthContextProvider>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    justifyContent: "center",
    // paddingTop: 50,
  },
});

export default withAuthenticator(App);
