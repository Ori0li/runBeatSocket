import React from "react";
import { StyleSheet, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

const InsertInput = ({ value, onChangeText }: Props) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="메시지를 입력하세요"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
});

export default InsertInput;
