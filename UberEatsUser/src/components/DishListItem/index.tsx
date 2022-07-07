import React from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Dish } from "../../models";
import { ScreenNavigationProp } from "../../navigation/types";

export interface DishItemI
  extends Pick<Dish, "id" | "name" | "description" | "price" | "image"> {}

const DishItem = ({ id, name, description, price, image }: DishItemI) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const onPress = () => navigation.navigate("DishDetailScreen", { id: id });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ flex: image ? 0.9 : 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  name: {
    fontWeight: "600",
    fontSize: 17,
  },
  description: {
    color: "grey",
    marginVertical: 5,
  },
  price: {
    fontWeight: "600",
    fontSize: 16,
  },
  image: {
    height: 100,
    aspectRatio: 1,
    marginLeft: "auto",
  },
});

export default DishItem;
