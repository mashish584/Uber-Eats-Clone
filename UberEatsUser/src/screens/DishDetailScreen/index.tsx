import React from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { DataStore } from "aws-amplify";

import { Dish } from "../../models";

import { useBasketContext } from "../../context/BasketContext";
import { HomeStackScreens, ScreenNavigationProp } from "../../navigation/types";

const DishDetailsScreen = () => {
  const [dish, setDish] = React.useState<Dish | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const { addDishToBasket, basketDishes } = useBasketContext();

  const route = useRoute<RouteProp<HomeStackScreens, "DishDetailScreen">>();
  const navigation = useNavigation<ScreenNavigationProp>();
  const id = route.params?.id;

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  };

  const getTotal = () => {
    return dish ? (dish.price * quantity).toFixed(2) : 0;
  };

  const onAddToBasket = async () => {
    if (dish) {
      await addDishToBasket?.(dish, quantity);
      navigation.goBack();
    }
  };

  React.useEffect(() => {
    if (id) {
      DataStore.query(Dish, id).then((dish) => {
        if (dish) {
          setDish(dish);
        }
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (basketDishes.length && id) {
      const currentDish = basketDishes.filter((dish) => dish?.Dish?.id === id)[0];
      setQuantity(currentDish?.quantity || 1);
    }
  }, [basketDishes, id]);

  if (!dish) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>{dish.name}</Text>
      <Text style={styles.description}>{dish.description}</Text>
      <View style={styles.seperator} />
      <View style={styles.row}>
        <AntDesign name="minuscircleo" size={60} color="black" onPress={decrementQuantity} />
        <Text style={styles.quantity}>{quantity}</Text>
        <AntDesign name="pluscircleo" size={60} color="black" onPress={incrementQuantity} />
      </View>
      <Pressable onPress={onAddToBasket} style={styles.button}>
        <Text style={styles.buttonText}>
          Add {quantity} quantity to basket (${getTotal()})
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    paddingVertical: 40,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginVertical: 10,
  },
  description: {},
  seperator: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  quantity: {
    fontSize: 25,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "black",
    marginTop: "auto",
    padding: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});

export default DishDetailsScreen;
