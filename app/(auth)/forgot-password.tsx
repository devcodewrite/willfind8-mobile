import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import TextInput from "@/components/inputs/TextInput";
import { Button, lightColors, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useFetchAuth } from "@/hooks/store/useFetchAuth";

//Validation schema using Yup
const ForgotPasswordSchema = Yup.object().shape({
  auth_field: Yup.string().required("Auth method is required"),
  email: Yup.string()
    .email("Invalid email address")
    .when("auth_field", {
      is: "email",
      then: (schema) => schema.required("Email is required"),
    }),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .when("auth_field", {
      is: "phone",
      then: (schema) => schema.required("Phone number is required"),
    }),
});

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [auth_field, setAuthField] = useState<"email" | "phone">("email");
  const { isLoading, response, error, forgotPassword } = useFetchAuth();
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isValid,
    setFieldValue,
  } = useFormik({
    validationSchema: ForgotPasswordSchema,
    initialValues: { email: "", phone: "", auth_field: "email" },
    onSubmit: async (values) => {
      await forgotPassword(values);

      if (response) {
        Alert.alert(
          "Email Sent!",
          "We have e-mailed your password reset link!",
          [
            { style: "cancel", text: "Didn't Received" },
            {
              style: "default",
              text: "OK, Received!",
              onPress: () => router.back(),
            },
          ]
        );
      } else if (error) {
        Alert.alert("Request Failed", error);
      } else {
        Alert.alert("Request Failed", "No responses! Please try again!");
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forgot Password ?</Text>
      </View>

      <View style={styles.content}>
        <Button
          title={`Switch to ${auth_field === "email" ? "Phone" : "Email"}`}
          buttonStyle={styles.toggleButton}
          onPress={() => {
            const newAuthField = auth_field === "email" ? "phone" : "email";
            setAuthField(newAuthField);
            setFieldValue("auth_field", newAuthField); // Update form value
          }}
          titleStyle={{ color: lightColors.grey2 }}
          type="clear"
          icon={{ name: "swap-horiz", color: lightColors.grey2 }}
        />
        {auth_field === "email" && (
          <TextInput
            label="Email"
            inputMode="email"
            placeholder="Enter your email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            errorMessage={touched.email && errors.email ? errors.email : ""}
          />
        )}
        {auth_field === "phone" && (
          <TextInput
            label="Phone"
            placeholder="Enter your phone number"
            value={values.phone}
            onChangeText={handleChange("phone")}
            onBlur={handleBlur("phone")}
            inputMode="numeric"
            errorMessage={touched.phone && errors.phone ? errors.phone : ""}
          />
        )}

        <Button
          size="lg"
          buttonStyle={styles.button}
          color={"primary"}
          title="Submit"
          icon={
            isLoading ? (
              <ActivityIndicator color="white" animating />
            ) : undefined
          }
          disabled={isLoading || !isValid}
          iconRight
          onPress={() => handleSubmit()}
        />
        <View style={{ paddingVertical: 10, gap: 20 }}>
          <Text
            style={{ color: lightColors.primary }}
            onPress={() => {
              router.back();
            }}
          >
            Login instead
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  content: {
    rowGap: 20,
    marginTop: 16,
    alignItems: "center",
  },
  icon: {
    height: 150,
    width: 150,
  },
  footer: {
    flex: 1,
    rowGap: 16,
    marginTop: 24,
    alignItems: "center",
  },
  button: {
    height: 45,
    width: 300,
    borderRadius: 8,
    marginTop: 20,
  },

  toggleButton: {
    width: 300,
    borderRadius: 8,
  },
});
