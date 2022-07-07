import React from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import BasketDishItem from "../../components/BasketDishItem";

import { useOrderContext } from "../../context/OrderContext";
import { OrderInfoI } from "../../context/types";
import { Order } from "../../models";

import styles from "./styles";

interface OrderDetailHeaderI {
  order: Pick<Order, "Restaurant" | "status">;
}

const OrderDetailsHeader = ({ order }: OrderDetailHeaderI) => {
  return (
    <View>
      <View style={styles.page}>
        <Image source={{ uri: order?.Restaurant?.image }} style={styles.image} />

        <View style={styles.container}>
          <Text style={styles.title}>{order?.Restaurant?.name}</Text>
          <Text style={styles.subTitle}>{order.status} &#8226; 2 days ago</Text>
        </View>
      </View>
      <Text style={styles.menuTitle}>Your Orders</Text>
    </View>
  );
};

interface OrderDetailsI {
  id: string;
}

const OrderDetails = ({ id }: OrderDetailsI) => {
  const { getOrder } = useOrderContext();

  const [orderDetail, setOrderDetail] = React.useState<OrderInfoI | null>(null);

  const orderId = id;

  React.useEffect(() => {
    if (orderId) {
      (async () => {
        const order = await getOrder?.(orderId);
        if (order) {
          setOrderDetail(order);
        }
      })();
    }
  }, [orderId]);

  if (!orderDetail) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={orderDetail.dishes}
      ListHeaderComponent={() => <OrderDetailsHeader order={orderDetail} />}
      ListEmptyComponent={() => (
        <Text style={{ textAlign: "center" }}>No Dishes available.</Text>
      )}
      renderItem={({ item }) => {
        const dishItem = {
          quantity: item.quantity,
          name: item?.Dish?.name || "",
          price: item?.Dish?.price || 0,
        };
        return <BasketDishItem {...dishItem} containerStyle={{ marginHorizontal: 10 }} />;
      }}
    />
  );
};

export default OrderDetails;
