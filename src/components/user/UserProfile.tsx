import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type UserProfileProps = {
  name: string;
  height: number;
  weight: number;
  ptCount: number;
};

const UserProfile = ({ name, height, weight, ptCount }: UserProfileProps) => {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push("/profile/(tabs)/profile");
  };
  return (
    <SafeAreaView style={styles.profileSection}>
      <View style={styles.profileWrapper}>
        <View style={styles.profileImage}></View>
        <View style={styles.profileInfoWrapper}>
          <View>
            <Text style={styles.profileName}>{name} 님</Text>
          </View>
          <View style={styles.profileInfo}>
            <View>
              <Text style={styles.infoTitle}>신장</Text>
              <Text style={styles.infoContent}>{height}cm</Text>
            </View>
            <View>
              <Text style={styles.infoTitle}>몸무게</Text>
              <Text style={styles.infoContent}>{weight}kg</Text>
            </View>
            <View>
              <Text style={styles.infoTitle}>PT권</Text>
              <Text style={styles.infoContent}>{ptCount}회</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleEditProfile}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>더보기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  profileSection: {
    marginVertical: 20,
    backgroundColor: "#3C23D7",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  profileWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
  },
  profileInfoWrapper: {},
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  profileInfo: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoContent: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonWrapper: {
    width: 300,
    padding: 15,
    backgroundColor: "#000541",
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
