import React from "react";
import { View, StyleSheet } from "react-native";
import { RichEditor } from "@/components/pell-rich-editor";

export default function DescriptionCard({
  htmlContent,
}: {
  htmlContent?: string;
}) {
  return (
    <View style={styles.container}>
      <RichEditor
        initialContentHTML={htmlContent}
        placeholder="no description"
        style={styles.input}
        containerStyle={{ height: 200 }}
        disabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    width: "100%",
    height: "100%",
  },
});
