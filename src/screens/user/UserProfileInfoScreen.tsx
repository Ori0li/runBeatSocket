import { addUserInfo } from "@/libs/api/register";
import UseContainer from "@/src/components/common/UseContainer";
import AgeInput from "@/src/components/profileinfo/AgeInput";
import GenderInput from "@/src/components/profileinfo/GenderInput";
import HeightWeightRow from "@/src/components/profileinfo/HeightWeightRow";
import MemoInput from "@/src/components/profileinfo/MemoInput";
import NicknameInput from "@/src/components/profileinfo/NicknameInput";
import SubmitButton from "@/src/components/profileinfo/SubmitButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

const UserProfileInfoScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    height: 0,
    weight: 0,
    age: 0,
    gender: "",
    memo: "",
  });

  const handleProfile = async () => {
    try {
      // 필수 입력값 검증
      if (
        !formData.nickname ||
        !formData.height ||
        !formData.weight ||
        !formData.age ||
        !formData.gender
      ) {
        Alert.alert("알림", "모든 필수 정보를 입력해주세요.");
        return;
      }

      await addUserInfo({
        name: formData.nickname,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        memo: formData.memo,
      });
      Alert.alert("성공", "프로필 정보가 등록되었습니다.");
      router.replace({
        pathname: "/user/(tabs)",
        params: { refresh: Date.now() },
      });
    } catch (error) {
      console.error("프로필 정보 등록 실패:", error);
      Alert.alert(
        "오류",
        "프로필 정보 등록에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  return (
    <UseContainer>
      <View style={styles.section}>
        <NicknameInput
          value={formData.nickname}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, nickname: text }))
          }
        />
        <HeightWeightRow
          height={formData.height}
          weight={formData.weight}
          onHeightChange={(value) =>
            setFormData((prev) => ({ ...prev, height: value }))
          }
          onWeightChange={(value) =>
            setFormData((prev) => ({ ...prev, weight: value }))
          }
        />
        <AgeInput
          value={formData.age}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, age: value }))
          }
        />
        <GenderInput
          value={formData.gender}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, gender: text }))
          }
        />
        <MemoInput
          value={formData.memo}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, memo: text }))
          }
        />
        <SubmitButton onPress={handleProfile} />
      </View>
    </UseContainer>
  );
};

export default UserProfileInfoScreen;

const styles = StyleSheet.create({
  section: {
    paddingTop: 50,
  },
});
