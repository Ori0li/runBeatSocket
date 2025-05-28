import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
};

const InsertButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name={"send"} color={"#ffffff"} size={22} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    height: 44,
    backgroundColor: "#3C23D7",
    borderRadius: 5,
    alignSelf: "flex-start",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InsertButton;
