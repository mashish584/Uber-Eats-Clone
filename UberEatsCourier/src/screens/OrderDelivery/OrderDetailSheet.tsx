import React from "react";
import { Pressable, Text, View } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import * as Location from "expo-location";

import styles from "./styles";

import { useOrderContext } from "../../context/OrderContext";

type Location = {
  latitude: number;
  longitude: number;
};

interface OrderDetailSheetI {
  totalDistance: number;
  totalMinutes: number;
  driverLocation: Location | null;
  onButtonPressed: (ref: any) => void;
}

export const ORDER_STATUSES = {
  READY_FOR_PICK_UP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
};

const BUTTON_TITLES = {
  [ORDER_STATUSES.READY_FOR_PICK_UP]: "Accept Order",
  [ORDER_STATUSES.ACCEPTED]: "Pick-Up Order",
  [ORDER_STATUSES.PICKED_UP]: "Complete Delivery",
};

const OrderDetailSheet = ({
  totalDistance,
  totalMinutes,
  onButtonPressed,
}: OrderDetailSheetI) => {
  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ["14%", "95%"], []);

  const { order, orderInfo } = useOrderContext();

  const isButtonDisabled = () => {
    const isDriverClose = totalDistance <= 0.1;

    if (order?.status === ORDER_STATUSES.READY_FOR_PICK_UP) {
      return false;
    }
    if (
      (order?.status === ORDER_STATUSES.ACCEPTED ||
        order?.status === ORDER_STATUSES.PICKED_UP) &&
      isDriverClose
    ) {
      return false;
    }

    return true;
  };

  const onAction = () => {
    onButtonPressed(bottomSheetRef);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={styles.indicatorStyle}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{totalMinutes.toFixed(0)} min</Text>
        <FontAwesome5
          name="shopping-bag"
          size={30}
          color="#3FC060"
          style={{ marginHorizontal: 10 }}
        />
        <Text style={styles.headerText}>{totalDistance.toFixed(2)} Km</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.restaurantNameText}>{order?.Restaurant?.name}</Text>

        <View style={styles.iconContainer}>
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text style={styles.restaurantAddressText}>{order?.Restaurant?.address}</Text>
        </View>
        <View style={[styles.iconContainer, { marginTop: 15 }]}>
          <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
          <Text style={styles.userAddressText}>{orderInfo?.user?.address}</Text>
        </View>
        <View style={[styles.orderItemsContainer]}>
          <BottomSheetFlatList
            data={orderInfo?.dishes}
            renderItem={({ item }) => {
              return (
                <Text style={styles.orderItemText}>
                  {item?.Dish?.name} x {item.quantity}
                </Text>
              );
            }}
          />
        </View>
      </View>
      <Pressable
        onPress={onAction}
        style={[styles.cta, { backgroundColor: isButtonDisabled() ? "grey" : "#3FC060" }]}
        disabled={isButtonDisabled()}
      >
        <Text style={styles.ctaText}>{BUTTON_TITLES[order?.status]}</Text>
      </Pressable>
    </BottomSheet>
  );
};

export default OrderDetailSheet;
