import { authAccount } from "@/libs/api/auth";
import { getUserMainProfile } from "@/libs/api/user";
import ButtonForm from "@/src/components/common/ButtonForm";
import InputForm from "@/src/components/common/InputForm";
import UseContainer from "@/src/components/common/UseContainer";
import { saveRefreshToken } from "@/src/utils/secureToken";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

const LoginScreen = () => {
  const { role } = useLocalSearchParams();
  const router = useRouter();
  const [IdValue, setIdValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isChecked, setChecked] = useState(false);

  const loginHandler = async () => {
    try {
      const data = await authAccount(
        IdValue,
        passwordValue,
        role as "trainer" | "user"
      );
      Alert.alert("로그인 성공");

      if (isChecked && data.refreshToken) {
        await saveRefreshToken(data.refreshToken);
        console.log("자동로그인 체크됨 (refreshToken은 SecureStore에 저장됨)");
      }

      if (role === "user") {
        const userProfile = await getUserMainProfile();

        if (userProfile.height === null || userProfile.weight === null) {
          router.push("/profile/(tabs)/profileinfo");
        } else {
          router.push("/user/(tabs)");
        }
      } else if (role === "trainer") {
        router.push("/trainer/(tabs)");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류 발생";
      Alert.alert("로그인 실패", message);
    }
  };

  return (
    <UseContainer>
      <View style={styles.section}>
        <View>
          <InputForm
            value={IdValue}
            setValue={setIdValue}
            title="아이디"
            placeholder="아이디를 입력하세요"
          />
          <InputForm
            value={passwordValue}
            setValue={setPasswordValue}
            title="비밀번호"
            placeholder="비밀번호를 입력하세요"
          />
          <View style={styles.autoLogin}>
            <Checkbox
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#3C23D7" : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.label}>자동로그인</Text>
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <ButtonForm name="로그인" onPress={loginHandler} />
        </View>
      </View>
    </UseContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
    paddingTop: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  autoLogin: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    borderColor: "#aaaaaa",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#aaaaaa",
    marginLeft: 10,
  },
});

export default LoginScreen;
