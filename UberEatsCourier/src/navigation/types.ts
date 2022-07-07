import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface StackNavigationProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> {
  navigation: StackNavigationProps<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
}

export type RootStackScreens = {
  Orders: undefined;
  OrderDeliveryScreen: {
    id: string;
  };
  Profile: undefined;
};

export type ScreenNavigationProp = NativeStackNavigationProp<RootStackScreens>;
