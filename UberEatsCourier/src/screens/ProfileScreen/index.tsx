import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAuthContext } from "../../context/AuthContext";

import { Courier } from "../../models";

const Profile = () => {
  const { authUser, setDbCourier, dbCourier } = useAuthContext();

  const [name, setName] = useState(dbCourier?.name || "");
  const [transportationMode, setTransportationMode] = useState<"DRIVING" | "BICYCLING">(
    "DRIVING"
  );

  const navigation = useNavigation();

  const createCourier = async () => {
    try {
      const courier = await DataStore.save(
        new Courier({
          name,
          sub: authUser || "",
          transportationMode,
        })
      );
      console.log(`Creating user ✅`);
      setDbCourier?.(courier);
    } catch (err: any) {
      console.warn("Error", err.message);
    }
  };

  const updateCourier = async () => {
    try {
      if (dbCourier) {
        const courier = await DataStore.save(
          Courier.copyOf(dbCourier, (updated) => {
            updated.name = name;
          })
        );
        console.log(`Updating user ✅`);
        setDbCourier?.(courier);
      }
    } catch (err: any) {
      console.warn(err.message);
    }
  };

  const onSave = async () => {
    if (dbCourier) {
      await updateCourier();
      navigation.goBack();
    } else {
      await createCourier();
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => setTransportationMode("BICYCLING")}
          style={[styles.iconStyle, transportationMode === "BICYCLING" && styles.selectedMode]}
        >
          <MaterialIcons name="pedal-bike" size={24} color="black" />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode("DRIVING")}
          style={[styles.iconStyle, transportationMode === "DRIVING" && styles.selectedMode]}
        >
          <FontAwesome5 name="car" size={24} color="black" />
        </Pressable>
      </View>
      <Button onPress={onSave} title="Save" />
      <Button onPress={() => Auth.signOut()} title="Sign Out" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
  iconStyle: {
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  selectedMode: {
    backgroundColor: "#3FC060",
  },
});

export default Profile;
