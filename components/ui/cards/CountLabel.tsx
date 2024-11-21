import { Ionicons } from "@expo/vector-icons";
import { Text } from "@rneui/themed";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { View } from "react-native";

export function CountLabel({
  style,
  num,
  total = 0,
  variant = "dark",
}: {
  num?: number;
  total?: number;
  variant?: "dark" | "light";
  style?: StyleProp<ViewStyle>;
}) {
  return total < 1 ? (
    <></>
  ) : (
    <View style={[styles.container, variant === "dark" && styles.dark, style]}>
      <Text style={[styles.text, variant === "dark" && styles.dark]}>
        {num ? `${num}/` : null}
        {total}
      </Text>
      <Ionicons
        name="camera"
        color={variant === "light" ? "white" : "#444"}
        size={14}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#444",
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  dark: {
    backgroundColor: "#ccc",
    color: "444",
  },
  text: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
