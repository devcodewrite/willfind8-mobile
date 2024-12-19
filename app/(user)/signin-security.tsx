import { LabelList } from "@/components/ui/lists/LabelList";
import { Alert, StyleSheet, View } from "react-native";
import { useAuth } from "@/lib/auth/AuthProvider";
import { router } from "expo-router";

export default function UserScreen() {
  const { user } = useAuth();
  const data = [
    {
      title: "Email",
      value: user?.email,
      rightIcon: { name: "chevron-right" },
      onPress: () => router.push("/(user)/email"),
    },
    {
      title: "Phone",
      value: user?.phone_intl,
      subtitle: user?.phone_hidden ? "Not visible to public" : "",
      rightIcon: { name: "chevron-right" },
      onPress: () => router.push("/(user)/phone"),
    },
  ];

  return (
    <View style={styles.container}>
      <LabelList heading="EMAIL & PHONE NUMBER" data={data} />
      <LabelList
        onPress={() => router.push("/(user)/change-password")}
        value={"Change Password"}
        rightIcon={{ name: "chevron-right" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    gap: 20,
  },
});
