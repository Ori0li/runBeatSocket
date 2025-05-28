import { getScheduleByDate, updateSchedule } from "@/libs/api/schedule";

import ButtonForm from "@/src/components/common/ButtonForm";
import UseContainer from "@/src/components/common/UseContainer";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
dayjs.extend(utc);
dayjs.extend(timezone);
LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

type availableTime = {
  time: string;
  available: boolean;
};

const PTRegister = () => {
  const router = useRouter();
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<availableTime[]>([]);

  const getKSTNow = () => {
    const nowUTC = new Date();
    const kstOffset = 9 * 60; // KST = UTC+9
    const localOffset = nowUTC.getTimezoneOffset();
    const kst = new Date(nowUTC.getTime() + (kstOffset + localOffset) * 60000);
    return dayjs(kst);
  };

  const getUpdatedPTData = (
    selectedDate: string,
    apiTimeSlots: availableTime[]
  ) => {
    const now = getKSTNow();
    const isToday = dayjs(selectedDate).isSame(now, "day");

    return apiTimeSlots.map((slot) => {
      const slotTime = dayjs(
        `${selectedDate} ${slot.time}`,
        "YYYY-MM-DD HH:mm"
      );
      const isPast = isToday && slotTime.isBefore(now);
      return {
        time: slot.time,
        available: slot.available && !isPast,
      };
    });
  };

  useEffect(() => {
    const fetchScheduleTimes = async () => {
      try {
        console.log("요청 시작", selectedDate);
        const times = await getScheduleByDate(selectedDate); // API에서 시간대 받아오기
        console.log("요청 완료", times);
        setTimeSlots(getUpdatedPTData(selectedDate, times));
        setSelectedTime(""); // 날짜 바뀌면 시간 초기화
      } catch (error) {
        console.error("예약 시간 조회 실패:", error);
      }
    };

    if (selectedDate) fetchScheduleTimes();
  }, [selectedDate]);

  const amSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0], 10);
    return hour < 12;
  });

  const pmSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0], 10);
    return hour >= 12;
  });

  const renderSlot = (slot: availableTime, index: number) => {
    const isSelected = selectedTime === slot.time;
    return (
      <TouchableOpacity
        key={index}
        disabled={!slot.available}
        onPress={() => setSelectedTime(slot.time)}
        style={[
          styles.timeButton,
          isSelected && styles.timeButtonActive,
          !slot.available && styles.timeButtonEmpty,
        ]}
      >
        <Text
          style={[
            styles.timeText,
            isSelected && styles.timeTextActive,
            !slot.available && styles.timeTextEmpty,
          ]}
        >
          {slot.time}
        </Text>
      </TouchableOpacity>
    );
  };

  const registerButton = async () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }

    try {
      const scheduleData = {
        date: selectedDate,
        time: selectedTime,
      };

      const response = await updateSchedule(scheduleData);
      console.log("예약 성공:", response);
      alert("예약이 완료되었습니다!");

      router.replace({
        pathname: "/user/(tabs)",
        params: { refresh: Date.now() },
      });

      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("예약 실패:", error);
      alert("예약에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <UseContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Calendar
          style={styles.calendar}
          minDate={today}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#3C23D7" },
          }}
          theme={{
            todayTextColor: "#3C23D7",
            selectedDayBackgroundColor: "#3C23D7",
            arrowColor: "#3C23D7",
          }}
        />
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.ampmText}>오전</Text>
          <View style={styles.timeWrapper}>{amSlots.map(renderSlot)}</View>
          <Text style={styles.ampmText}>오후</Text>
          <View style={styles.timeWrapper}>{pmSlots.map(renderSlot)}</View>
        </View>
        <ButtonForm name={"예약하기"} onPress={registerButton} />
      </ScrollView>
    </UseContainer>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  ampmText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333333",
    marginTop: 20,
    marginBottom: 10,
  },
  timeButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    borderColor: "#E6E6E6",
    borderWidth: 1,
    elevation: 3,
  },
  timeButtonActive: {
    backgroundColor: "#3C23D7",
  },
  timeText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333333",
  },
  timeTextActive: {
    color: "#ffffff",
  },
  timeButtonEmpty: {
    backgroundColor: "#e6e6e6",
  },
  timeTextEmpty: {
    color: "#B3B3B3",
  },
});

export default PTRegister;
