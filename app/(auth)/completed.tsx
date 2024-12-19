import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, lightColors, Text } from "@rneui/themed";
import { router } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";

const VerificationScreen = () => {
  const { params } = useRouteInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Email Verification</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{params.message}</Text>
        <Button
          onPress={() => router.replace("/(auth)/login")}
          type="outline"
          radius={10}
          buttonStyle={styles.button}
          title={"Go to Login"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  message: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  content: {
    rowGap: 16,
    marginTop: 16,
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    width: 300,
    borderRadius: 8,
  },
  toggleButton: {
    width: 300,
    borderRadius: 8,
  },
});

export default VerificationScreen;
