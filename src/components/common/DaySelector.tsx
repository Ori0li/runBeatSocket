import dayjs from "dayjs";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DaySelectorProps = {
  daysInMonth: dayjs.Dayjs[];
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
};

const DaySelector = ({
  daysInMonth,
  selectedDate,
  onSelectDate,
}: DaySelectorProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dayScroll}
    >
      <View style={styles.dayButtonWrapper}>
        {daysInMonth.map((day) => {
          const isSelected = day.isSame(selectedDate, "day");
          return (
            <TouchableOpacity
              key={day.date()}
              onPress={() => onSelectDate(day)}
              style={[styles.dayButton, isSelected && styles.dayButtonActive]}
            >
              <Text
                style={[styles.dayText, isSelected && styles.dayTextActive]}
              >
                {day.date()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DaySelector;

const styles = StyleSheet.create({
  dayScroll: {
    paddingVertical: 20,
    backgroundColor: "#3C23D7",
    borderRadius: 5,
  },
  dayButtonWrapper: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dayButtonActive: {
    backgroundColor: "#fff",
  },
  dayText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  dayTextActive: {
    color: "#3C23D7",
    fontWeight: "700",
  },
});
