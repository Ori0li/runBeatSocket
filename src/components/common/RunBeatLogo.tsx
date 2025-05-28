import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RunBeatLogo = () => {
  return (
    <SafeAreaView>
      <View style={styles.runBeatLogo}>
        <Image
          style={styles.img}
          source={require("@/assets/images/common/RunBeat.png")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  runBeatLogo: {
    width: 120,
    top: 0,
    left: 0,
    position: "fixed",
    // marginTop: 20,
  },
  img: {
    width: "100%",
    objectFit: "contain",
  },
});

export default RunBeatLogo;
