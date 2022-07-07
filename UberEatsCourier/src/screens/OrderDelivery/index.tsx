import React from "react";
import { useWindowDimensions, View } from "react-native";
import MapView, { MapViewProps, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { DataStore } from "aws-amplify";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import styles from "./styles";

import { useOrderContext } from "../../context/OrderContext";
import { useAuthContext } from "../../context/AuthContext";
import OrderDetailSheet, { ORDER_STATUSES } from "./OrderDetailSheet";
import { Courier } from "../../models";

import { RootStackScreens, ScreenNavigationProp } from "../../navigation/types";

const OrderDelivery = () => {
  const [driverLocation, setDriverLocation] = React.useState<any>(null);
  const [totalMinutes, setTotalMinutes] = React.useState(0);
  const [totalDistance, setTotalDistance] = React.useState(0);

  const mapRef = React.useRef<MapView>(null);

  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<RouteProp<RootStackScreens, "OrderDeliveryScreen">>();

  const orderId = route.params.id;

  const { dbCourier } = useAuthContext();
  const { order, onAcceptOrder, fetchOrder, orderInfo, pickupOrder, completeOrder } =
    useOrderContext();

  const extraProps = {} as MapViewProps;

  const syncDriverLocation = async () => {
    const foregroundSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 100,
      },
      (updatedLocation) => {
        setDriverLocation({
          ...updatedLocation.coords,
        });
      }
    );

    return foregroundSubscription;
  };

  const onButtonPressed = async (bottomSheetRef: React.RefObject<BottomSheetMethods>) => {
    if (order?.status === ORDER_STATUSES.READY_FOR_PICK_UP && driverLocation) {
      bottomSheetRef.current?.collapse();
      mapRef.current?.animateToRegion({
        ...driverLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      onAcceptOrder?.();
    }

    if (order?.status === ORDER_STATUSES.ACCEPTED) {
      pickupOrder?.();
    }

    if (order?.status === ORDER_STATUSES.PICKED_UP) {
      await completeOrder?.();
      navigation.goBack();
      console.log(`Delivery finished`);
    }
  };

  React.useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log(`No location permission given.`);
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        ...location.coords,
      });

      locationSubscription = await syncDriverLocation();
    })();

    return () => locationSubscription?.remove();
  }, []);

  React.useEffect(() => {
    if (orderId) {
      fetchOrder?.(orderId);
    }
  }, [orderId]);

  React.useEffect(() => {
    if (driverLocation?.latitude && driverLocation?.longitude && dbCourier) {
      DataStore.save(
        Courier.copyOf(dbCourier, (updated) => {
          updated.lat = driverLocation.latitude;
          updated.lng = driverLocation.longitude;
        })
      ).then((courier) => console.log({ courier }));
    }
  }, [driverLocation?.latitude, driverLocation?.longitude]);

  if (driverLocation) {
    extraProps.initialRegion = {
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.07,
      longitudeDelta: 0.07,
    };
  }

  if (!order || !orderInfo?.user) return null;

  const restaurantLocation = order?.Restaurant?.lat
    ? {
        latitude: order?.Restaurant?.lat,
        longitude: order?.Restaurant?.lng,
      }
    : undefined;

  const deliveryLocation = { latitude: orderInfo.user.lat, longitude: orderInfo.user.lng };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ backgroundColor: "lightblue", width, height }}
        showsUserLocation
        followsUserLocation
        {...extraProps}
      >
        {restaurantLocation?.latitude && deliveryLocation.latitude && (
          <MapViewDirections
            origin={driverLocation}
            destination={
              order.status === ORDER_STATUSES.ACCEPTED ? restaurantLocation : deliveryLocation
            }
            strokeWidth={10}
            strokeColor="#3FC060"
            waypoints={
              order.status === ORDER_STATUSES.READY_FOR_PICK_UP ? [restaurantLocation] : []
            }
            onReady={(result) => {
              setTotalMinutes(result.duration);
              setTotalDistance(result.distance);
            }}
            apikey="AIzaSyDC_GDk0kuqTVcJlDhLlO5chzjVgR4GMZ8"
          />
        )}
        {order?.Restaurant?.lat && order.Restaurant.lng && (
          <Marker
            title={order?.Restaurant?.name}
            description={order?.Restaurant?.address}
            coordinate={{
              latitude: order?.Restaurant?.lat,
              longitude: order?.Restaurant?.lng,
            }}
          >
            <View style={{ backgroundColor: "green", borderRadius: 20, padding: 5 }}>
              <Entypo name="shop" size={30} color="white" />
            </View>
          </Marker>
        )}
        <Marker
          title={orderInfo.user.name}
          description={orderInfo.user.address}
          coordinate={{ latitude: orderInfo.user.lat, longitude: orderInfo.user.lng }}
        >
          <View style={{ backgroundColor: "green", borderRadius: 20, padding: 5 }}>
            <MaterialIcons name="restaurant" size={30} color="white" />
          </View>
        </Marker>
      </MapView>

      <OrderDetailSheet
        totalDistance={totalDistance}
        totalMinutes={totalMinutes}
        onButtonPressed={onButtonPressed}
        driverLocation={
          driverLocation
            ? {
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }
            : null
        }
      />

      {order.status === ORDER_STATUSES.READY_FOR_PICK_UP && (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle"
          size={45}
          color="black"
          style={{ position: "absolute", top: 45, left: 15 }}
        />
      )}
    </View>
  );
};

export default OrderDelivery;
