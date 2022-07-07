import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import MapView, { MapViewProps, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Entypo } from "@expo/vector-icons";
import { DataStore } from "aws-amplify";

import OrderItem from "../../components/OrderItem";
import { Order } from "../../models";

const OrdersScreen = () => {
  const [driverLocation, setDriverLocation] =
    React.useState<Location.LocationObjectCoords | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const bottomSheetRef = React.useRef(null);

  const snapPoints = React.useMemo(() => ["14%", "95%"], []);

  const { width, height } = useWindowDimensions();
  const extraMapViewProps = {} as MapViewProps;

  const fetchOrders = () => {
    DataStore.query(Order, (order) => order.status("eq", "READY_FOR_PICKUP")).then(setOrders);
  };

  React.useEffect(() => {
    fetchOrders();

    const subscription = DataStore.observe(Order).subscribe((msg) => {
      if (msg.opType === "UPDATE") {
        fetchOrders();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log(`No location permission given.`);
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setDriverLocation(location.coords);
    })();

    return () => locationSubscription?.remove();
  }, []);

  if (driverLocation) {
    extraMapViewProps.initialRegion = {
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.07,
      longitudeDelta: 0.07,
    };
  }

  return (
    <View style={{ backgroundColor: "lightblue", flex: 1 }}>
      <MapView
        style={{
          width,
          height,
        }}
        showsUserLocation
        followsUserLocation
        {...extraMapViewProps}
      >
        {orders.map((order) => {
          if (order.Restaurant?.lat && order.Restaurant.lng) {
            return (
              <Marker
                key={order.id}
                title={order?.Restaurant?.name}
                description={order?.Restaurant?.address}
                coordinate={{
                  latitude: order?.Restaurant?.lat,
                  longitude: order?.Restaurant?.lng,
                }}
              >
                <View style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}>
                  <Entypo name="shop" size={24} color="white" />
                </View>
              </Marker>
            );
          }
        })}
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>You're Online</Text>
          <Text style={{ marginTop: 15, color: "grey", fontWeight: "500" }}>
            Available Nearby Orders: {orders.length}
          </Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

export default OrdersScreen;
