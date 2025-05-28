import { refreshToken } from "@/libs/api/auth";
import { getUserMainProfile } from "@/libs/api/user";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { deleteRefreshToken, getRefreshToken } from "@/src/utils/secureToken";
import { useRouter } from "expo-router";
import * as jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const IndexScreen = () => {
  const router = useRouter();
  const [isTryingAutoLogin, setIsTryingAutoLogin] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const token = await getRefreshToken();
        console.log("token test : ", token);
        if (!token) {
          setIsTryingAutoLogin(false);
          return;
        }

        const userAccessToken = await refreshToken();

        // 토큰 저장
        const decoded = (jwtDecode.jwtDecode as any)(
          userAccessToken.accessToken
        ) as {
          role: string;
        };

        // Zustand store에 토큰 저장
        setAuth(
          userAccessToken.accessToken,
          userAccessToken.accountId,
          decoded.role as "user" | "trainer"
        );

        if (decoded.role === "user") {
          try {
            // 토큰이 저장된 후 프로필 정보 요청
            const userProfile = await getUserMainProfile();
            console.log("프로필 정보:", userProfile); // 디버깅용 로그

            if (userProfile.height === null || userProfile.weight === null) {
              router.replace("/profile/(tabs)/profileinfo");
            } else {
              router.replace("/user/(tabs)");
            }
          } catch (error) {
            console.error("프로필 정보 조회 실패:", error);
            // 프로필 정보 조회 실패 시에도 메인 화면으로 이동
            router.replace("/user/(tabs)");
          }
        } else if (decoded.role === "trainer") {
          router.replace("/trainer/(tabs)");
        } else {
          throw new Error("유효하지 않은 역할입니다.");
        }
      } catch (err) {
        console.error("자동 로그인 실패:", err);
        await deleteRefreshToken();
        setIsTryingAutoLogin(false);
      }
    };

    tryAutoLogin();
  }, []);

  if (isTryingAutoLogin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3C23D7" />
          <Text style={styles.loadingText}>자동 로그인 시도중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.Wrapper}>
          <Image
            style={styles.img}
            source={require("@/assets/images/common/SymbolLogo.png")}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.userLoginButton}
            onPress={() => router.push("/login/(tabs)/login?role=user")}
          >
            <Text style={styles.userLoginText}>회원 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.trainerLoginButton}
            onPress={() => router.push("/login/(tabs)/login?role=trainer")}
          >
            <Text style={styles.trainerLoginText}>트레이너 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push("/login/(tabs)/register")}
          >
            <Text style={styles.signupText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    // position: "relative",
  },
  Wrapper: {
    width: "70%",
    margin: "auto",
    top: "50%",
    // marginTop: 150,
  },
  img: {
    width: "100%",
    objectFit: "contain",
    marginBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  userLoginButton: {
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#3C23D7",
    padding: 15,
    marginBottom: 20,
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  },
  userLoginText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  trainerLoginButton: {
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#3C23D7",
    padding: 15,
    marginBottom: 20,
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  },
  trainerLoginText: {
    color: "#3C23D7",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  signupText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#c5c5c5",
    textAlign: "center",
    width: "100%",
    // marginTop: 250,
    top: 300,
  },
  signupButton: {
    padding: 10,
  },
});
