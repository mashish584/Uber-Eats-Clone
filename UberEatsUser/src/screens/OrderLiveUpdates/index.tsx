import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { DataStore } from "aws-amplify";
import { FontAwesome5, Entypo } from "@expo/vector-icons";

import { Order, Courier } from "../../models";
import { useAuthContext } from "../../context/AuthContext";

import { ZenObservable } from "zen-observable-ts";

interface OrderLiveUpdatesI {
  id: string;
}

const OrderLiveUpdates = ({ id }: OrderLiveUpdatesI) => {
  const mapRef = React.useRef<MapView | null>(null);
  const { dbUser } = useAuthContext();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [driver, setDriver] = React.useState<Courier | null>(null);

  const fetchOrder = async () => {
    try {
      const order = await DataStore.query(Order, id);
      if (order) {
        setOrder(order);
      }
    } catch (err) {
      console.warn({ err });
    }
  };

  React.useEffect(() => {
    fetchOrder();
  }, []);

  React.useEffect(() => {
    if (order?.orderCourierId) {
      DataStore.query(Courier, order.orderCourierId).then((driver) => {
        if (driver) setDriver(driver);
      });
    }
  }, [order?.orderCourierId]);

  React.useEffect(() => {
    if (driver?.lat && driver?.lng) {
      mapRef.current?.animateToRegion({
        latitude: driver.lat,
        longitude: driver.lng,
        latitudeDelta: 0.07,
        longitudeDelta: 0.07,
      });
    }
  }, [driver?.lat, driver?.lng]);

  React.useEffect(() => {
    let subscription: ZenObservable.Subscription;
    if (driver?.id) {
      subscription = DataStore.observe(Courier, driver.id).subscribe((msg) => {
        if (msg.opType === "UPDATE") {
          setDriver(msg.element);
        }
      });
    }
    return () => subscription?.unsubscribe?.();
  }, [driver]);

  React.useEffect(() => {
    let subscription: ZenObservable.Subscription;
    if (order?.id) {
      subscription = DataStore.observe(Order, order.id).subscribe((msg) => {
        if (msg.opType === "UPDATE") {
          setOrder(msg.element);
        }
      });
    }
    return () => subscription?.unsubscribe?.();
  }, [order]);

  return (
    <View style={{ position: "relative" }}>
      <MapView ref={mapRef} style={styles.map}>
        {driver?.lat && driver?.lng ? (
          <Marker coordinate={{ latitude: driver.lat, longitude: driver.lng }}>
            <View style={{ backgroundColor: "green", borderRadius: 20, padding: 5 }}>
              <FontAwesome5 name="motorcycle" size={24} color="white" />
            </View>
          </Marker>
        ) : null}
        {dbUser?.lat && dbUser?.lng ? (
          <Marker coordinate={{ latitude: dbUser.lat, longitude: dbUser.lng }}>
            <View style={{ backgroundColor: "green", borderRadius: 20, padding: 5 }}>
              <FontAwesome5 name="home" size={24} color="white" />
            </View>
          </Marker>
        ) : null}
        {order?.Restaurant?.lat && order?.Restaurant?.lng ? (
          <Marker
            coordinate={{
              latitude: order?.Restaurant?.lat,
              longitude: order?.Restaurant?.lng,
            }}
          >
            <View style={{ backgroundColor: "green", borderRadius: 20, padding: 5 }}>
              <Entypo name="shop" size={30} color="white" />
            </View>
          </Marker>
        ) : null}
      </MapView>
      <View style={styles.status}>
        <Text style={styles.statusText}>Status: {order?.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: { width: "100%", height: "100%" },
  status: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "800",
  },
});

export default OrderLiveUpdates;
