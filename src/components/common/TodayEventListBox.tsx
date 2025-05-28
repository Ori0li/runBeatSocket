import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import ToggleMenu from "./ToggleMenu";

interface EventListBoxProps {
  date: string;
  type: "today";
  name: string;
  time: string;
  reservationId: number;
  onDelete: () => void;
}

const TodayEventListBox = ({
  date,
  name,
  time,
  reservationId,
  onDelete,
}: EventListBoxProps) => {
  return (
    <View style={{ ...styles.container }}>
      <View style={styles.headerWrapper}>
        <Text style={styles.dateText}>{date} 오늘의 일정</Text>
        <ToggleMenu reservationId={reservationId} onDelete={onDelete} />
      </View>
      <View style={styles.contentWrapper}>
        <Image style={styles.profileImage} />
        <View style={styles.infoWrapper}>
          <Text style={styles.userName}>{name} 회원</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default TodayEventListBox;

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
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  time: {
    fontSize: 14,
    color: "#888",
  },
});
