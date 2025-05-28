import { StyleSheet, Text, TextInput, View } from "react-native";

interface NicknameInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const NicknameInput = ({ value, onChangeText }: NicknameInputProps) => {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        placeholder="2~6자리의 닉네임을 입력해주세요."
        placeholderTextColor="#AAA"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DDDDDD",
  },
});

export default NicknameInput;
