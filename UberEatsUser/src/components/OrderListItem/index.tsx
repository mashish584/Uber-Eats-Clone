import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Order } from "../../models";
import { ScreenNavigationProp } from "../../navigation/types";

interface OrderListItemI {
  order: Pick<Order, "Restaurant" | "total" | "status" | "id">;
}

const OrderListItem = ({ order }: OrderListItemI) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const onPress = () => navigation.navigate("Order", { id: order.id });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {order?.Restaurant?.image && (
        <Image source={{ uri: order.Restaurant.image }} style={styles.image} />
      )}
      <View>
        <Text style={styles.name}>{order?.Restaurant?.name}</Text>
        <Text style={{ marginVertical: 5 }}>3 items &#8226; ${order.total}</Text>
        <Text>2 days ago &#8226; {order.status}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  image: { width: 75, height: 75, marginRight: 10 },
  name: { fontWeight: "600", fontSize: 16 },
});

export default OrderListItem;
