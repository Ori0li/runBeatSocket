import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  name: string;
  onPress: () => void;
};

const ButtonForm = ({ name, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={style.BlueButton}>
      <Text style={style.ButtonText}>{name}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  BlueButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#3C23D7",
    borderRadius: 5,
    elevation: 3,
    marginTop: 20,
  },
  ButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
});

export default ButtonForm;
