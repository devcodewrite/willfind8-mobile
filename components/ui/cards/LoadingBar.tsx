import { lightColors, LinearProgress } from "@rneui/themed";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

export default function LoadingBar({
  loading,
  style,
}: {
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { width } = useWindowDimensions();
  return (
    loading && (
      <View style={[styles.container, style]}>
        <LinearProgress
          variant="indeterminate"
          color="primary"
          trackColor={lightColors.grey5}
          style={{ width: width }}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
  },
});
