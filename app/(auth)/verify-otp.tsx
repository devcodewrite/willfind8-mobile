import React, { useState } from "react";
import { View } from "react-native";
import OTPInput from "@/components/inputs/OTPInput";
import { Button, lightColors, Text } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { useRouteInfo } from "expo-router/build/hooks";

const OTPVerificationScreen = () => {
  const [code, setCode] = useState("");
  const { params } = useRouteInfo();

  const handleVerify = () => {
    // Add your OTP verification logic here
    console.log("OTP verified");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OTP Verification</Text>
        <Text>{params.message}</Text>
        <OTPInput
          code={code}
          setCode={setCode}
          onSendCode={() => handleVerify()}
        />
      </View>
      <View style={styles.content}>
        <Button
          style={styles.button}
          title="Verify OTP"
          onPress={handleVerify}
        />

        <Text
          style={{ color: lightColors.primary }}
          onPress={() => {
            router.back();
          }}
        >
          Go Back
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: "50%",
  },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
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

export default OTPVerificationScreen;
