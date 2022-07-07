import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface StackNavigationProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> {
  navigation: StackNavigationProps<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
}

export type IdParams = {
  id: string;
};

export type RootStackScreens = {
  HomeTabs: undefined;
  Profile: undefined;
};

export type HomeTabSceens = {
  Home: undefined;
  Orders: {
    screen: string;
    params: IdParams;
  };
  Profile: undefined;
};

export type HomeStackScreens = {
  Restaurants: undefined;
  Restaurant: IdParams;
  DishDetailScreen: IdParams;
  Basket: undefined;
};

export type OrderStackScreens = {
  OrderList: undefined;
  Order: IdParams;
};

export type AllScreens = RootStackScreens &
  HomeStackScreens &
  HomeTabSceens &
  OrderStackScreens;

export type ScreenNavigationProp = NativeStackNavigationProp<AllScreens>;
