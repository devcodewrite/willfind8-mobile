import { lightColors, LinearProgress } from "@rneui/themed";
import { Image } from "expo-image";
import { View } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{ height: "100%", width: "100%" }}
        source={require("@/assets/images/willfind8-splash.png")}
      />
      <View
        style={{
          position: "absolute",
          top: "80%",
          height: 200,
          alignItems: "center",
          width: "100%",
        }}
      >
        <LinearProgress
          variant="indeterminate"
          color="primary"
          trackColor={lightColors.grey5}
          style={{ width: 200 }}
        />
      </View>
    </View>
  );
}
