// components/MainFilter.jsx
import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";

export default function Logo({ size }: { size?: any }) {
  const image = require("@/assets/images/willfind8-logo-full.png");
  return (
    <View style={styles.container}>
      <Image
        style={[styles.image, size && { height: size }]}
        contentFit="contain"
        source={image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    margin: 5,
    height: 40,
    width: 150,
  },
});
