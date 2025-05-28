import { logout } from "@/libs/api/auth";
import { router } from "expo-router";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TrainerProfileProps = {
  name: string;
  photoUrl: string;
  scheduleCount: number;
};
const handleLogout = () => {
  Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
    {
      text: "취소",
      style: "cancel",
    },
    {
      text: "확인",
      onPress: async () => {
        try {
          await logout();
          router.replace("/login");
        } catch (error) {
          console.error("로그아웃 오류:", error);
          Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
        }
      },
    },
  ]);
};
const TrainerProfile = ({
  name,
  photoUrl,
  scheduleCount,
}: TrainerProfileProps) => {
  return (
    <SafeAreaView style={styles.profileSection}>
      <View style={styles.profileWrapper}>
        <View style={styles.profileImageWrapper}>
          <Image style={styles.profileImage} src={photoUrl}></Image>
        </View>
        <View style={styles.profileInfoWrapper}>
          <View>
            <Text style={styles.profileText}>트레이너</Text>
            <Text style={styles.profileName}>{name}님 반가워요!</Text>
          </View>
          <View>
            <Text style={styles.profileText}>오늘의 일정: {scheduleCount}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#3C23D7",
    padding: 20,
    borderRadius: 5,
    elevation: 3,
    marginTop: 20,
  },
  profileWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    // justifyContent: "space-around",
  },
  profileInfoWrapper: {},
  profileImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    marginRight: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    objectFit: "cover",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  profileText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  logoutText: {
    textAlign: "right",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
