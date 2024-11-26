import React, { useState } from "react";
import { View } from "react-native";
import OTPInput from "@/components/inputs/OTPInput";
import { Button, lightColors, Text } from "@rneui/themed";
import { router } from "expo-router";

const OTPVerificationScreen = () => {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    // Add your OTP verification logic here
    console.log("OTP verified");
  };

  return (
    <View style={{ padding: 20 }}>
      <OTPInput
        code={code}
        setCode={setCode}
        onSendCode={() => handleVerify()}
      />
      <Button title="Verify OTP" onPress={handleVerify} />

      <View style={{ paddingVertical: 10, gap: 20, justifyContent: "center" }}>
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

export default OTPVerificationScreen;
