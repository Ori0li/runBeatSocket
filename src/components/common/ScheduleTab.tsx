import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ScheduleTabProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const ScheduleTab = ({ selectedTab, setSelectedTab }: ScheduleTabProps) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === "식단" && styles.activeTab]}
        onPress={() => setSelectedTab("식단")}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "식단" && styles.activeTabText,
          ]}
        >
          식단
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === "운동" && styles.activeTab]}
        onPress={() => setSelectedTab("운동")}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "운동" && styles.activeTabText,
          ]}
        >
          운동
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScheduleTab;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    backgroundColor: "#cccccc",
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#cccccc",
  },
  tab: {
    width: "50%",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666666",
  },
  activeTab: {
    backgroundColor: "#ffffff",
  },
  activeTabText: {
    color: "#3C23D7",
  },
});
