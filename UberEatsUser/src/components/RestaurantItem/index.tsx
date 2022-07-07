import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Restaurant } from "../../models";
import { ScreenNavigationProp } from "../../navigation/types";

interface IRestaurantItem extends Omit<Restaurant, "Dishes" | "address" | "lat" | "lng"> {}

const RestaurantItem = (props: IRestaurantItem) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const onPress = () => {
    navigation.navigate("Restaurant", {
      id: props.id,
    });
  };

  return (
    <Pressable onPress={onPress} style={styles.restaurantContainer}>
      <Image
        source={{
          uri: props.image,
        }}
        style={styles.image}
      />
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{props.name}</Text>
          <Text style={styles.subtitle}>
            $ {props.deliveryFee.toFixed(2)} {props.minDeliveryTime}-{props.maxDeliveryTime}{" "}
            minutes
          </Text>
        </View>
        <View style={styles.rating}>
          <Text>4</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  restaurantContainer: {
    width: "100%",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 5 / 3,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 5,
  },
  subtitle: {
    color: "grey",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: "auto",
    width: 25,
    height: 25,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RestaurantItem;
