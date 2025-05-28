import { StyleSheet, Text, TextInput, View } from "react-native";

interface MemoInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const MemoInput = ({ value, onChangeText }: MemoInputProps) => {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>상태 메시지</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="자기소개나 상태를 입력하세요."
        placeholderTextColor="#AAA"
        multiline
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputBlock: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DDDDDD",
  },
});

export default MemoInput;
