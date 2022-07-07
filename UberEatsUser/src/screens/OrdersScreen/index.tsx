import React from "react";
import { FlatList, View, StyleSheet } from "react-native";

import OrderListItem from "../../components/OrderListItem";
import { useOrderContext } from "../../context/OrderContext";

const OrderScreen = () => {
  const { orders } = useOrderContext();

  return (
    <View style={styles.page}>
      <FlatList data={orders} renderItem={({ item }) => <OrderListItem order={item} />} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
});

export default OrderScreen;
