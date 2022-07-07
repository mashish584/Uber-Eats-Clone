import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { User } from "../../models";

interface OrderItemI {
  order: any;
}

const OrderItem = ({ order }: OrderItemI) => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigation = useNavigation();

  const onNavigate = () => navigation.navigate("OrderDeliveryScreen", { id: order.id });

  React.useEffect(() => {
    DataStore.query(User, order.userID).then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  return (
    <Pressable
      onPress={onNavigate}
      style={{
        flexDirection: "row",
        borderColor: "#3FC060",
        margin: 10,
        borderWidth: 2,
        borderRadius: 10,
      }}
    >
      <Image
        source={{ uri: order.Restaurant.image }}
        style={{
          width: "25%",
          height: "100%",
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      />
      <View style={{ marginLeft: 10, flex: 1, paddingVertical: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>{order.Restaurant.name}</Text>
        <Text style={{ color: "grey" }}>{order.Restaurant.address}</Text>

        <Text style={{ marginTop: 10 }}>Delivery Details:</Text>
        <Text style={{ color: "grey" }}>{user?.name}</Text>
        <Text style={{ color: "grey" }}>{user?.address}</Text>
      </View>

      <View
        style={{
          padding: 5,
          backgroundColor: "#3FC060",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Entypo name="check" size={30} color="white" style={{ marginLeft: "auto" }} />
      </View>
    </Pressable>
  );
};

export default OrderItem;
