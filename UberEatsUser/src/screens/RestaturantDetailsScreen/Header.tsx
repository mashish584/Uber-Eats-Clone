import React from "react";
import { Image, Text, View } from "react-native";
import styles from "./styles";

interface RestaurantHeaderI {
  image: string;
  name: string;
  deliveryFee: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
}

const RestaurantHeader = ({
  image,
  name,
  deliveryFee,
  minDeliveryTime,
  maxDeliveryTime,
}: RestaurantHeaderI) => {
  return (
    <>
      <View style={styles.main}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.container}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subTitle}>
            $ {deliveryFee.toFixed(2)} &#8226; {minDeliveryTime} - {maxDeliveryTime} mins
          </Text>
        </View>
      </View>
      <Text style={styles.menuTitle}>Menu</Text>
    </>
  );
};

export default RestaurantHeader;
