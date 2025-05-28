import { StyleSheet, View } from "react-native";
import RunBeatLogo from "./RunBeatLogo";

const UseContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <RunBeatLogo />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default UseContainer;
