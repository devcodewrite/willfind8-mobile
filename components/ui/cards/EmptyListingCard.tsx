import { Text } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { View } from "react-native";

export function EmptyListingCard() {
  return (
    <View style={styles.container}>
      <Text>No listings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
