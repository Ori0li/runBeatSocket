import { getScheduleToday, getTrainerProfile } from "@/libs/api/trainer";
import TodayEventListBox from "@/src/components/common/TodayEventListBox";
import UseContainer from "@/src/components/common/UseContainer";
import TrainerProfile from "@/src/components/trainer/TrainerProfile";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type TrainerProfile = {
  name: string;
  photoUrl: string;
};
type ScheduleToday = {
  reservationId: number;
  userName: string;
  date: string;
  time: string;
};

const TrainerHomeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [trainerName, setTrainerName] = useState<TrainerProfile>({
    name: "",
    photoUrl: "",
  });
  const [scheduleToday, setScheduleToday] = useState<ScheduleToday[]>([]);
  const fetchScheduleToday = async () => {
    try {
      const scheduleToday = await getScheduleToday();
      console.log("받아온 스케줄 데이터:", scheduleToday);
      setScheduleToday(scheduleToday);
      console.log(scheduleToday);
    } catch (error) {
      console.error("트레이너 오늘 예약 목록 조회에 실패하였습니다.", error);
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getTrainerProfile();
        setTrainerName(profileData);
        // console.log(profileData);
      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다.", error);
      }
    };

    fetchProfile();
    fetchScheduleToday();
  }, [params.refresh]);

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <UseContainer>
      <View style={{ flex: 1, marginTop: 10 }}>
        <View>
          <TrainerProfile
            name={`${trainerName.name}`}
            photoUrl={trainerName.photoUrl}
            scheduleCount={scheduleToday.length || 0}
          />
        </View>
        <View>
          <Text style={styles.dateTitle}>{today} 오늘의 일정</Text>
        </View>

        <View style={styles.eventListWrapper}>
          {scheduleToday?.length > 0 ? (
            scheduleToday.map((v) => (
              <TodayEventListBox
                key={v.reservationId}
                reservationId={v.reservationId}
                date={today}
                type="today"
                name={v.userName}
                time={v.time}
                onDelete={fetchScheduleToday}
              />
            ))
          ) : (
            <Text>오늘 예약 없음</Text>
          )}
        </View>
      </View>
    </UseContainer>
  );
};
export default TrainerHomeScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  dateTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#bbb",
    fontSize: 15,
  },
  eventListWrapper: {
    width: "100%",
    backgroundColor: "#D9E6FD",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
});
