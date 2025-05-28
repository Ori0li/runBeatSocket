import { deleteUser, logout } from "@/libs/api/auth";
import { updateUserProfile, uploadProfileImage } from "@/libs/api/user";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ButtonForm from "../common/ButtonForm";

export const options = {
  headerShown: false,
};

type EditProfileProps = {
  name: string;
  trainer: string;
  height: number;
  weight: number;
  gender: string;
};

type ProfileFieldProps = {
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
};

const ProfileField = ({
  label,
  value,
  editable = true,
  onChangeText,
}: ProfileFieldProps) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, !editable && styles.fieldInputDisabled]}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor="#888"
      keyboardType={
        label === "키" || label === "몸무게" ? "numeric" : "default"
      }
    />
  </View>
);

const EditProfile = ({
  name,
  trainer,
  height,
  weight,
  gender,
}: EditProfileProps) => {
  const router = useRouter();
  const [profileName, setProfileName] = useState("");
  const [profileTrainer, setProfileTrainer] = useState("");
  const [profileHeight, setProfileHeight] = useState("");
  const [profileWeight, setProfileWeight] = useState("");
  const [profileGender, setProfileGender] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [alarmEnabled, setAlarmEnabled] = useState(true);

  useEffect(() => {
    setProfileName(name);
    setProfileTrainer(trainer);
    setProfileHeight(height.toString());
    setProfileWeight(weight.toString());
    setProfileGender(gender);
    console.log(gender);
  }, [name, trainer, height, weight, gender]);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("이미지를 선택하려면 갤러리 접근 권한이 필요합니다.");
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        try {
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          console.log("Image blob size:", blob.size);
          console.log("Image blob type:", blob.type);

          const uploadedImageUrl = await uploadProfileImage(blob);
          console.log("Uploaded image URL:", uploadedImageUrl);
          setProfileImage(uploadedImageUrl);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          Alert.alert(
            "이미지 업로드 실패",
            uploadError instanceof Error
              ? uploadError.message
              : "이미지 업로드 중 오류가 발생했습니다."
          );
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert(
        "이미지 선택 오류",
        "이미지를 선택하는 중 오류가 발생했습니다."
      );
    }
  };

  const handleSave = async () => {
    if (!profileName.trim()) {
      Alert.alert("알림", "이름을 입력해주세요.");
      return;
    }
    if (isNaN(Number(profileHeight)) || Number(profileHeight) <= 0) {
      Alert.alert("알림", "키를 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(Number(profileWeight)) || Number(profileWeight) <= 0) {
      Alert.alert("알림", "몸무게를 올바르게 입력해주세요.");
      return;
    }
    try {
      await updateUserProfile({
        name: profileName,
        trainer: profileTrainer,
        height: Number(profileHeight),
        weight: Number(profileWeight),
        gender: profileGender,
      });
      Alert.alert("성공", "프로필이 수정 되었습니다.", [
        {
          text: "확인",
          onPress: () => router.replace("/user/(tabs)"),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "오류",
        error instanceof Error ? error.message : "프로필 수정에 실패했습니다."
      );
    }
  };
  const handleEditPwd = () => {
    Alert.alert("비밀번호 변경", "비밀번호를 변경하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "확인",
        onPress: () => {
          router.push("/editPwd/(tabs)/editPwd");
        },
      },
    ]);
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
            router.replace("/login/(tabs)");
          } catch (error) {
            console.error("로그아웃 오류:", error);
            Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원탈퇴",
      "정말 회원탈퇴 하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser();
              router.replace("/login");
            } catch (error) {
              console.error("회원탈퇴 중 오류 발생:", error);
              Alert.alert("오류", "회원탈퇴 중 오류가 발생했습니다.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileColumn}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImage}>
                <Text style={styles.profileImageText}>
                  {profileName.charAt(0)}
                </Text>
                <MaterialIcons
                  name="photo-camera"
                  size={20}
                  color="#bbb"
                  style={styles.cameraIcon}
                />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <ProfileField
              label="이름"
              value={profileName}
              onChangeText={setProfileName}
            />
            <ProfileField
              label="담당강사"
              value={profileTrainer}
              onChangeText={setProfileTrainer}
              editable={false}
            />
            <ProfileField
              label="키"
              value={profileHeight}
              onChangeText={setProfileHeight}
            />

            <ProfileField
              label="몸무게"
              value={profileWeight}
              onChangeText={setProfileWeight}
            />
            <ProfileField
              label="성별"
              value={profileGender}
              onChangeText={setProfileGender}
            />
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.alramSwitch}>알림 기능</Text>
          <Switch
            value={alarmEnabled}
            onValueChange={setAlarmEnabled}
            trackColor={{ false: "#ddd", true: "#3C23D7" }}
            thumbColor={alarmEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>
        <TouchableOpacity style={styles.menuBtn} onPress={handleEditPwd}>
          <Text style={styles.menuText}>비밀번호 변경</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={handleLogout}>
          <Text style={styles.menuText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={handleDeleteAccount}>
          <Text style={styles.menuTextStrong}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>
      <ButtonForm name={"수정"} onPress={handleSave} />
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    flex: 1,
    // borderRadius: 10,
    // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  },
  profileSection: {
    // padding: 20,
    // marginBottom: 20,
  },
  profileColumn: {
    alignItems: "center",
  },
  profileImageContainer: {
    // marginRight: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 9999,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 30,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
  },
  profileImageText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#555",
  },
  profileInfo: {
    flex: 1,
    width: "100%",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fieldLabel: {
    width: 80,
    fontWeight: "bold",
    color: "#333",
  },
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  fieldInputDisabled: {
    backgroundColor: "#e9e9e9",
    color: "#888",
  },
  section: {
    marginVertical: 24,
    // paddingHorizontal: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  alramSwitch: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  menuBtn: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  menuTextStrong: {
    fontSize: 16,
    color: "#ccc",
    fontWeight: "bold",
  },
  editBtn: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#3C23D7",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  editBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
