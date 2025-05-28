import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface GenderInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const GenderInput = ({ value, onChangeText }: GenderInputProps) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onChangeText(selectedValue);
    setVisible(false);
  };

  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>성별</Text>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={{ color: value ? "#000" : "#AAA" }}>
          {value || "성별을 선택하세요"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelect("남자")}
            >
              <Text style={styles.optionText}>남자</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelect("여자")}
            >
              <Text style={styles.optionText}>여자</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelect("")}
            >
              <Text style={styles.optionText}>선택안함</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modal: {
    marginHorizontal: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
  },
});

export default GenderInput;
