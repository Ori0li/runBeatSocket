import { deleteSchedule } from "@/libs/api/schedule";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ToggleMenuProps {
  reservationId: number;
  onDelete: () => void;
}

const ToggleMenu = ({ reservationId, onDelete }: ToggleMenuProps) => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const toggleMenu = () => setMenuVisible((prev) => !prev);

  const handleDelete = async () => {
    try {
      setMenuVisible(false);
      await deleteSchedule(reservationId);
      alert("예약이 취소되었습니다.");
      onDelete();
    } catch (error) {
      console.error("예약 취소 실패:", error);
      alert("예약 취소에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu}>
        <MaterialIcons name="more-horiz" size={32} />
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
            <Text style={styles.menuText}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ToggleMenu;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  menu: {
    position: "absolute",
    top: 25,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    elevation: 3,
    zIndex: 10,
  },
  menuItem: {
    width: 30,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    padding: 2,
  },
});
