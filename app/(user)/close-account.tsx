import { LabelList } from "@/components/ui/lists/LabelList";
import { Alert, StyleSheet, View } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function UserScreen() {
  const { user } = useAuth();

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    gap: 20,
  },
});
