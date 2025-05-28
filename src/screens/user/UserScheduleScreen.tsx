import { createRecord, deleteRecord, getRecords } from "@/libs/api/records";
import CustomCalendar from "@/src/components/common/CustomCalendar";
import RunBeatLogo from "@/src/components/common/RunBeatLogo";
import ScheduleTab from "@/src/components/common/ScheduleTab";
import AddScheduleModal from "@/src/components/user/AddScheduleModal";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ScheduleData {
  id: number;
  tag: "식단" | "운동";
  date: string;
  content: string;
  image?: string;
}

export default function UserScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTab, setSelectedTab] = useState<"식단" | "운동">("식단");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordedDates, setRecordedDates] = useState<string[]>([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 오늘 날짜를 선택
    setSelectedDate(dayjs());
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const date = selectedDate.format("YYYY-MM-DD");
      const data = await getRecords(date);
      setSchedules(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "기록을 불러오는데 실패했습니다."
      );
      Alert.alert(
        "오류",
        err instanceof Error ? err.message : "기록을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthSchedules = async () => {
    const startDate = selectedDate.subtract(30, "day");
    const endDate = selectedDate.add(30, "day");

    const daysInRange = endDate.diff(startDate, "day") + 1;
    const requests = Array.from({ length: daysInRange }, (_, i) => {
      const date = startDate.add(i, "day").format("YYYY-MM-DD");
      return getRecords(date)
        .then((records) => ({
          date,
          hasData: records.some((r) => r.tag === selectedTab),
        }))
        .catch(() => ({
          date,
          hasData: false,
        }));
    });

    const results = await Promise.all(requests);

    const recorded = results
      .filter((r) => r.hasData)
      .map((r) => dayjs(r.date).format("YYYY-MM-DD"));

    setRecordedDates(recorded);
  };

  useEffect(() => {
    fetchSchedules();
    fetchMonthSchedules();
  }, [selectedDate, selectedTab]);

  const handleAddSchedule = async (data: {
    content: string;
    tag: "식단" | "운동";
    image?: string;
  }) => {
    try {
      const date = selectedDate.format("YYYY-MM-DD");
      await createRecord({
        date,
        content: data.content,
        tag: data.tag,
        image: data.image,
      });
      Alert.alert("성공", "기록이 추가되었습니다.");
      setIsModalVisible(false);
      fetchSchedules();
    } catch (err) {
      Alert.alert(
        "오류",
        err instanceof Error ? err.message : "기록 추가에 실패했습니다."
      );
    }
  };

  const markedDates = recordedDates.map((date) => ({
    date,
    dots: [
      {
        color: "#ffffff",
        selectedColor:
          selectedDate.format("YYYY-MM-DD") === date ? "#3C23D7" : "#ffffff",
      },
    ],
  }));

  const handleDeleteSchedule = async (id: number, tag: "식단" | "운동") => {
    try {
      await deleteRecord(id, tag);
      Alert.alert("성공", "기록이 삭제되었습니다.");
      fetchSchedules();
    } catch (err) {
      Alert.alert(
        "오류",
        err instanceof Error ? err.message : "기록 삭제에 실패했습니다."
      );
    }
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.tag === selectedTab &&
      schedule.date === selectedDate.format("YYYY-MM-DD")
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <RunBeatLogo />
      </View>
      <View style={{ flex: 1, marginTop: 10 }}>
        <View style={{ flex: 1 }}>
          <CustomCalendar
            ref={calendarRef}
            selectedDate={selectedDate}
            onDateSelected={setSelectedDate}
            markedDates={markedDates}
          />
          <View style={{ flex: 1, padding: 20 }}>
            <View>
              <ScheduleTab
                selectedTab={selectedTab}
                setSelectedTab={(tab) => setSelectedTab(tab as "식단" | "운동")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <Text style={styles.loadingText}>로딩 중...</Text>
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : filteredSchedules.length === 0 ? (
                <Text style={styles.emptyText}>등록된 기록이 없습니다.</Text>
              ) : (
                filteredSchedules.map((schedule) => (
                  <View key={schedule.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardText}>{schedule.content}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleDeleteSchedule(schedule.id, schedule.tag)
                        }
                        style={styles.deleteButton}
                      >
                        <MaterialIcons name="close" size={20} color="gray" />
                      </TouchableOpacity>
                    </View>
                    {schedule.image && (
                      <Image
                        source={{ uri: schedule.image }}
                        style={styles.image}
                      />
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
          <View style={styles.fixedButtonWrapper}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={1}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AddScheduleModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddSchedule}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  fixedButtonWrapper: {
    width: "100%",
    padding: 20,
  },
  addButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#C0C0C0",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#C0C0C0",
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  deleteButton: {
    padding: 6,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
