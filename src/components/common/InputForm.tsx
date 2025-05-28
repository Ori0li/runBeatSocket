import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
  title: string;
  placeholder: string;
  value: string;
  setValue: (e: string) => void;
};

const InputForm = ({ title, placeholder, value, setValue }: InputProps) => {
  // const [inputValue, setInputValue] = useState("");

  return (
    <>
      <View>
        <Text style={styles.loginText}>{title}</Text>
      </View>
      <TextInput
        style={styles.loginInput}
        onChangeText={(e) => setValue(e)}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#DDDDDD"
      />
    </>
  );
};

const styles = StyleSheet.create({
  loginText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 10,
  },
  loginInput: {
    fontSize: 16,
    padding: 15,
    height: 60,
    marginBottom: 20,
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: "#DDDDDD",
    borderWidth: 2,
  },
});
export default InputForm;
