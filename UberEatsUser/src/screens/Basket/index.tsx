import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useBasketContext } from "../../context/BasketContext";
import { useOrderContext } from "../../context/OrderContext";
import { ScreenNavigationProp } from "../../navigation/types";

import BasketDishItem from "../../components/BasketDishItem";

const Basket = () => {
  const { basketDishes, restaurant, totalPrice } = useBasketContext();
  const { createOrder } = useOrderContext();

  const navigation = useNavigation<ScreenNavigationProp>();

  const onCreateOrder = async () => {
    if (createOrder) {
      const newOrder = await createOrder();
      navigation.navigate("Orders", {
        screen: "Order",
        params: { id: newOrder.id },
      });
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>{restaurant?.name}</Text>
      <Text style={styles.heading}>Your Items</Text>

      <View style={styles.seperator} />

      <FlatList
        data={basketDishes}
        renderItem={({ item }) => {
          const dishItem = {
            quantity: item.quantity,
            name: item?.Dish?.name as string,
            price: item?.Dish?.price as number,
          };
          return <BasketDishItem {...dishItem} />;
        }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center" }}>No Basket Dishes.</Text>
        )}
        ListFooterComponent={() => (
          <>
            <View style={styles.seperator} />
            <View style={[styles.row, { marginVertical: 5 }]}>
              <Text style={{ fontSize: 14 }}>Subtotal</Text>
              <Text style={styles.price}>
                ${(totalPrice - (restaurant?.deliveryFee || 0)).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.row, { marginVertical: 5 }]}>
              <Text style={{ fontSize: 14 }}>Total</Text>
              <Text style={styles.price}>${totalPrice.toFixed(2)}</Text>
            </View>
          </>
        )}
      />

      <Pressable onPress={onCreateOrder} style={styles.button}>
        <Text style={styles.buttonText}>Create Order (${totalPrice.toFixed(2)})</Text>
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
    fontSize: 24,
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
    marginVertical: 15,
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
  quantityContainer: {
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
    borderRadius: 2,
  },
  heading: {
    fontWeight: "600",
    marginTop: 20,
    fontSize: 18,
  },
  price: {
    marginLeft: "auto",
    fontSize: 14,
  },
});

export default Basket;
