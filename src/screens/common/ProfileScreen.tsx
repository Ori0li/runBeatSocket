import { getUserDetailProfile } from "@/libs/api/user";
import UseContainer from "@/src/components/common/UseContainer";
import EditProfile from "@/src/components/user/EditProfile";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const ProfileScreen = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [profile, setProfile] = useState({
    name: "",
    trainer: "",
    height: 0,
    weight: 0,
    gender: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserDetailProfile();
        console.log(userData);
        setProfile({
          name: userData.name,
          trainer: userData.trainerName,
          height: userData.height,
          weight: userData.weight,
          gender: userData.gender,
        });
      } catch (error) {
        // Alert.alert("오류", "프로필 정보를 가져오는데 실패했습니다.", [
        //   {
        //     text: "확인",
        //     // onPress: () => router.back()
        //   },
        // ]);
      }
    };

    fetchProfile();
  }, [accessToken]);

  return (
    <UseContainer>
      <View style={styles.editContainer}>
        <EditProfile {...profile} />
      </View>
    </UseContainer>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  editContainer: {
    // paddingHorizontal: 20,
    paddingTop: 20,
  },
});
