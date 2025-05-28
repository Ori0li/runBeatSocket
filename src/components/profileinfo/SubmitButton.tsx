import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//회원가입 완료 버튼
const SubmitButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3C23D7",
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default SubmitButton;
