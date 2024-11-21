// components/MainFilter.jsx
import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";

export default function Logo({ size = null }) {
  const image = Asset.fromModule(
    require("@/assets/images/willfind8-logo-full.png")
  ).uri;
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
    width:150
  },
});
