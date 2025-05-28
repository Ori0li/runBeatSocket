import { getSchedule } from "@/libs/api/schedule";
import { getUserMainProfile } from "@/libs/api/user";
import EventListBox from "@/src/components/common/EventListBox";
import UseContainer from "@/src/components/common/UseContainer";
import UserProfile from "@/src/components/user/UserProfile";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScheduleData {
  reservationId: number;
  trainerName: string;
  date: string;
  time: string;
}

const UserHomeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const handlePTReservation = () => {
    router.push("/user/(tabs)/add");
  };
  const handleUserSchedule = () => {
    router.push("/user/(tabs)/schedule");
  };

  const [profile, setProfile] = useState({
    name: "",
    height: 0,
    weight: 0,
    ptCount: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState<ScheduleData[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<ScheduleData[]>([]);

  const fetchSchedule = async () => {
    try {
      const scheduleData = await getSchedule();
      setTodaySchedule(scheduleData.today);
      setUpcomingSchedule(scheduleData.upcoming);
    } catch (error) {
      console.error("스케줄 정보를 가져오는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserMainProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다.", error);
      }
    };
    fetchProfile();
    fetchSchedule();
  }, [params.refresh]);

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <>
      <UseContainer>
        <UserProfile
          name={profile.name}
          height={profile.height}
          weight={profile.weight}
          ptCount={profile.ptCount}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePTReservation} style={{ flex: 1 }}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>PT 예약</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUserSchedule} style={{ flex: 1 }}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>Today 기록</Text>
            </View>
          </TouchableOpacity>
        </View>
      </UseContainer>
      <View style={styles.eventListWrapper}>
        {todaySchedule?.length > 0 ? (
          todaySchedule.map((v) => (
            <EventListBox
              key={v.reservationId}
              reservationId={v.reservationId}
              date={today}
              type="today"
              name={v.trainerName}
              time={v.time}
              onDelete={fetchSchedule}
            />
          ))
        ) : (
          <Text>오늘 예약 없음</Text>
        )}

        {upcomingSchedule?.length > 0 ? (
          upcomingSchedule.map((v) => (
            <EventListBox
              key={v.reservationId}
              reservationId={v.reservationId}
              date={v.date}
              type="upcoming"
              name={v.trainerName}
              time={v.time}
              onDelete={fetchSchedule}
            />
          ))
        ) : (
          <Text>다가오는 예약 없음</Text>
        )}
      </View>
    </>
  );
};
export default UserHomeScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  buttonWrapper: {
    backgroundColor: "#000541",
    borderRadius: 5,
    padding: 15,
    flex: 1,
    width: "100%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  eventListWrapper: {
    width: "100%",
    height: "100%",
    // marginTop: 10,
    backgroundColor: "#D9E6FD",
    padding: 20,
    borderRadius: 10,
  },
});
