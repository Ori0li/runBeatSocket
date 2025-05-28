import { StyleSheet, View } from "react-native";
import { HeightInput } from "./HeightInput";
import WeightInput from "./WeightInput";

interface HeightWeightRowProps {
  height: number;
  weight: number;
  onHeightChange: (value: number) => void;
  onWeightChange: (value: number) => void;
}

const HeightWeightRow = ({
  height,
  weight,
  onHeightChange,
  onWeightChange,
}: HeightWeightRowProps) => {
  return (
    <View style={styles.rowContainer}>
      <HeightInput value={height} onChangeText={onHeightChange} />
      <WeightInput value={weight} onChangeText={onWeightChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10, // or use margin on children
  },
});

export default HeightWeightRow;
