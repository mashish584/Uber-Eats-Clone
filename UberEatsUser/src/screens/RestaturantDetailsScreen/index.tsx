import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DataStore } from "aws-amplify";

import RestaurantHeader from "./Header";
import DishItem from "../../components/DishListItem";

import { Restaurant, Dish, BasketDish } from "../../models";
import { useBasketContext } from "../../context/BasketContext";
import { HomeStackScreens, ScreenNavigationProp } from "../../navigation/types";
import styles from "./styles";

const RestaurantDetailsScreen = () => {
  const [restaturant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [dishes, setDishes] = React.useState<Dish[]>([]);

  const route = useRoute<RouteProp<HomeStackScreens, "Restaurant">>();
  const navigation = useNavigation<ScreenNavigationProp>();
  const { setRestaurant: setBasketRestaurant, basket, basketDishes } = useBasketContext();

  const id = route.params?.id;

  React.useEffect(() => {
    if (!id) return;
    setBasketRestaurant?.(null);
    DataStore.query(Restaurant, id).then((restaturant) => {
      if (restaturant) {
        setRestaurant(restaturant);
      }
    });
    DataStore.query(Dish, (dish) => {
      return dish.restaurantID("eq", id);
    }).then((dishes) => {
      if (dishes) {
        setDishes(dishes);
      }
    });
  }, []);

  React.useEffect(() => {
    if (restaturant) {
      setBasketRestaurant?.(restaturant);
    }
  }, [restaturant]);

  if (!restaturant) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <View style={styles.page}>
      <FlatList
        ListHeaderComponent={() => <RestaurantHeader {...restaturant} />}
        data={dishes}
        renderItem={({ item }) => <DishItem {...item} />}
        keyExtractor={(item) => item.name}
      />

      <Ionicons
        onPress={navigation.goBack}
        name="arrow-back-circle"
        size={45}
        color="white"
        style={styles.iconContainer}
      />
      {basket && basketDishes?.length > 0 && (
        <Pressable onPress={() => navigation.navigate("Basket")} style={styles.button}>
          <Text style={styles.buttonText}>View Basket ({basketDishes.length} items)</Text>
        </Pressable>
      )}
    </View>
  );
};

export default RestaurantDetailsScreen;
