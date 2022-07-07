import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { BasketDish, Dish } from "../../models";

interface BasketDishItemI extends Pick<Dish, "name" | "price">, Pick<BasketDish, "quantity"> {
  containerStyle?: ViewStyle;
}

const BasketDishItem = ({ name, price, quantity, containerStyle }: BasketDishItemI) => {
  return (
    <View style={[styles.row, containerStyle]}>
      <View style={styles.quantityContainer}>
        <Text>{quantity}</Text>
      </View>
      <Text style={{ fontWeight: "bold" }}>{name}</Text>
      <Text style={{ marginLeft: "auto" }}>${price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  quantityContainer: {
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
    borderRadius: 2,
  },
});

export default BasketDishItem;
