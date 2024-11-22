import { lightColors, Text } from "@rneui/themed";
import { StyleSheet, ViewStyle } from "react-native";
import { View } from "react-native";

export function EmptyListingCard({
  placeholder = "No listings",
  style,
}: {
  placeholder?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.placeholder}>{placeholder}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: "center",
  },
  placeholder: {
    color: lightColors.grey3,
  },
});
