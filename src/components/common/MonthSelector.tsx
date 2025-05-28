import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View } from "react-native";

type MonthSelectorProps = {
  selectedMonth: number;
  onMonthChange: (monthIndex: number) => void;
};

const MonthSelector = ({
  selectedMonth,
  onMonthChange,
}: MonthSelectorProps) => {
  return (
    <View style={styles.monthSelector}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={onMonthChange}
        style={styles.picker}
        dropdownIconColor="#dddddd"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={i} />
        ))}
      </Picker>
    </View>
  );
};
export default MonthSelector;

const styles = StyleSheet.create({
  monthSelector: {
    width: "30%",
    height: 40,
    borderColor: "#dddddd",
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: "100%",
    color: "#333333",
    fontSize: 13,
  },
});
