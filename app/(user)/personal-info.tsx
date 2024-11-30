import { LabelInputList } from "@/components/inputs/LabelInputList";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Alert, StyleSheet, View } from "react-native";

export default function UserScreen() {
  const { user } = useAuth();
  const data = [
    {
      title: "Username",
      type: "text",
      value: user?.username,
    },
    {
      title: "Name",
      type: "text",
      value: user?.name,
    },
    {
      title: "About",
      type: "text",
      placeholder:"Bio",
      value: user?.about,
    },
    {
      title: "Gender",
      type: "select",
      value: user?.gender_id,
      placeholder: "Select Gender",
      options: [
        { id: 0, label: "Select a Gender", value: "0" },
        { id: 1, label: "Male", value: "1" },
        { id: 2, label: "Female", value: "2" },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <LabelInputList heading="Personal Details" data={data} />
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
