import { LabelList } from "@/components/ui/lists/LabelList";
import { Alert, StyleSheet, View } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function UserScreen() {
  const { user } = useAuth();
  const data = [
    {
      title: "Email",
      value: user?.email,
      rightIcon: { name: "chevron-right" },
      onPress: () => Alert.alert("Open Email"),
    },
    {
      title: "Phone",
      value: user?.phone,
      rightIcon: { name: "chevron-right" },
      onPress: () => Alert.alert("Open Phone"),
    },
  ];

  return (
    <View style={styles.container}>
      <LabelList heading="EMAIL & PHONE NUMBER" data={data} />
      <LabelList
        onPress={() => Alert.alert("Open Change Phone")}
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
