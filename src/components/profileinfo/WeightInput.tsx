import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";

interface WeightInputProps {
  value: number;
  onChangeText: (value: number) => void;
}

const WeightInput = ({ value, onChangeText }: WeightInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const weightOptions = Array.from({ length: 201 }, (_, i) => i.toString());

  return (
    <View style={styles.inputBox}>
      <Text style={styles.label}>몸무게</Text>

      <TouchableOpacity
        style={styles.inputWithUnit}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.whinput}>{value}</Text>
        <Text style={styles.unitLabel}>kg</Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>몸무게 선택</Text>

            <View style={styles.pickerRow}>
              <WheelPickerExpo
                height={150}
                width={100}
                initialSelectedIndex={value}
                items={weightOptions.map((w) => ({ label: w, value: w }))}
                onChange={({ item }) => onChangeText(parseInt(item.value))}
                renderItem={(item) => (
                  <Text style={styles.pickerItemText}>{item.label}</Text>
                )}
              />
            </View>

            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={styles.modalConfirm}
            >
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 15,
  },
  whinput: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  unitLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    paddingBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
  modalConfirm: {
    marginTop: 20,
    alignItems: "center",
  },
  confirmText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default WeightInput;
