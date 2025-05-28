import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TrainerEventList = ({
  name,
  time,
  reservationId,
  onDelete,
}: {
  name: string;
  time: string;
  reservationId: number;
  onDelete: (reservationId: number) => void;
}) => {
  return (
    <View style={styles.card}>
      <Image style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => onDelete(reservationId)}
      >
        <Text style={styles.cancelText}>일정 취소</Text>
      </TouchableOpacity>
    </View>
  );
};
export default TrainerEventList;
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 20,
    borderRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
    marginRight: 20,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    color: "#666",
    fontSize: 14,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: "#FF4D4D",
    backgroundColor: "#FFE5E5",
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 12,
  },
  cancelText: {
    color: "#FF4D4D",
    fontWeight: "600",
    fontSize: 12,
  },
});
