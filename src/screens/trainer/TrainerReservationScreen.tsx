import { deleteSchedule } from "@/libs/api/schedule";
import { getTrainerReservations } from "@/libs/api/trainer";
import CustomCalendar from "@/src/components/common/CustomCalendar";
import UseContainer from "@/src/components/common/UseContainer";
import TrainerEventList from "@/src/components/trainer/TrainerEventList";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

const TrainerReservationScreen = () => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef(null);

  const fetchReservations = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrainerReservations(date);
      setReservations(data);
    } catch (err: any) {
      setError(err.message || "예약을 불러오지 못했습니다.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(selectedDate.format("YYYY-MM-DD"));
  }, [selectedDate]);

  const handleDelete = async (reservationId: number) => {
    try {
      await deleteSchedule(reservationId);
      Alert.alert("성공", "예약이 취소되었습니다.");
      fetchReservations(selectedDate.format("YYYY-MM-DD"));
    } catch (err: any) {
      Alert.alert("오류", err.message || "스케쥴 취소에 실패했습니다.");
    }
  };

  return (
    <UseContainer>
      <View>
        <CustomCalendar
          ref={calendarRef}
          selectedDate={selectedDate}
          onDateSelected={setSelectedDate}
          markedDates={reservations.map((reservation) => ({
            date: reservation.date,
          }))}
        />
      </View>
      {loading ? (
        <Text>로딩 중...</Text>
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          style={{ flex: 2 }}
          data={reservations}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item.reservationId)}
          renderItem={({ item }) => (
            <TrainerEventList
              name={item.userName}
              time={item.time}
              reservationId={item.reservationId}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text>예약 없음</Text>}
        />
      )}
    </UseContainer>
  );
};
export default TrainerReservationScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    marginVertical: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  time: { fontSize: 14, color: "#666" },
  date: { fontSize: 12, color: "#aaa", alignSelf: "center" },
});
