import { Text } from "@rneui/themed";
import { Image } from "expo-image";
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export default function CustomAvatar({
  size,
  rounded = false,
  source,
  color,
  containerStyle,
  title,
  titleStyle,
  focused,
  style,
  placeholder,
}: {
  size: number;
  rounded?: boolean;
  source: any;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  titleStyle?: TextStyle;
  focused?: boolean;
  style?: StyleProp<ImageStyle>;
  placeholder?: StyleProp<ImageStyle>;
}) {
  const reSized = focused ? size + 4 : size;
  return (
    <View
      style={[
        styles.container,
        color && { borderColor: color },
        { width: reSized, height: reSized },
        rounded && styles.rounded,
        focused && styles.focused,
        containerStyle,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            { width: size, height: size },
            rounded && { borderRadius: size },
            style,
          ]}
          contentFit="contain"
          placeholderContentFit="contain"
          cachePolicy={"disk"}
          placeholder={placeholder}
        />
      ) : (
        <Text style={[styles.text, { fontSize: 0.5 * size }, titleStyle]}>
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
