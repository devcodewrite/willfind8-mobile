import { Text } from "@rneui/themed";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export default function CustomAvatar({
  size,
  rounded = false,
  source,
  style,
  color = null,
  containerStyle = null,
  title = null,
  titleStyle = null,
  focused = false,
  ...rest
}) {
  const reSized = focused ? size + 4 : size;
  return (
    <View
      style={[
        styles.container,
        color && { borderColor: color },
        size && { width: reSized, height: reSized },
        rounded && styles.rounded,
        focused && styles.focused,
        containerStyle,
      ]}
    >
      {source?.uri ? (
        <Image
          source={source}
          style={[
            styles.image,
            size && { width: size, height: size },
            rounded && { borderRadius: size },
            style,
          ]}
          contentFit="contain"
          placeholderContentFit="contain"
          cachePolicy={"disk"}
          {...rest}
        />
      ) : (
        <Text
          style={[styles.text, size && { fontSize: 0.5 * size }, titleStyle]}
        >
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rounded: {
    borderRadius: "50%",
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: 40,
    height: 40,
  },
  text: {
    color: "#444",
    fontSize: 0.5 * 40,
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    backgroundColor: "#efefef",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  focused: {
    borderWidth: 2,
  },
});
