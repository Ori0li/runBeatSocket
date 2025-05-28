import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import ToggleMenu from "./ToggleMenu";

interface EventListBoxProps {
  date: string;
  type: "today" | "upcoming";
  name: string;
  time: string;
  reservationId: number;
  onDelete: () => void;
}

const EventListBox = ({
  date,
  type,
  name,
  time,
  reservationId,
  onDelete,
}: EventListBoxProps) => {
  const dateText =
    type === "today" ? `${date} 오늘의 일정` : `${date} 다가오는 일정`;

  return (
    <View
      style={{ ...styles.container, opacity: type === "upcoming" ? 0.7 : 1 }}
    >
      <View style={styles.headerWrapper}>
        <Text style={styles.dateText}>{dateText}</Text>
        <ToggleMenu reservationId={reservationId} onDelete={onDelete} />
      </View>
      <View style={styles.contentWrapper}>
        <Image style={styles.profileImage} />
        <View style={styles.infoWrapper}>
          <Text style={styles.trainerName}>{name} 트레이너</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default EventListBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  headerWrapper: {
    flexDirection: "row", // 좌우로 배치
    justifyContent: "space-between", // 양쪽 끝으로 배치
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    marginRight: 15,
  },
  infoWrapper: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  time: {
    fontSize: 14,
    color: "#888",
  },
});
