import { Image, StyleSheet, View } from "react-native";

type ProfileProps = {
  width?: number;
  height?: number;
  uri?: string | null;
};

const Profile: React.FC<ProfileProps> = ({ width = 50, height = 50, uri }) => {
  if (!uri) return null;
  return (
    <View style={{ ...styles.profile, width, height }}>
      <Image
        style={styles.profileImage}
        source={{
          uri: uri,
        }}
        width={width}
        height={height}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    borderRadius: 999,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderColor: "#efefef",
    borderWidth: 1,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export default Profile;
