import React, { useEffect } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { Button } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";

import TextInput from "@/components/inputs/TextInput";
import { useFetchAuth } from "@/hooks/store/useFetchAuth";
import { useAuth } from "@/lib/auth/AuthProvider";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import { router } from "expo-router";

// Validation schema using Yup
const UserSchema = Yup.object().shape({
  email: Yup.string()
    .nonNullable()
    .required("Email is required")
    .email("Invalid email address"),
});

const UserScreen = () => {
  const { isLoading, update, response, error } = useFetchAuth();
  const { user, updateUser } = useAuth();
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    isValid,
    values,
    errors,
    touched,
    validateForm,
  } = useFormik({
    initialValues: {},
    validationSchema: UserSchema,
    onSubmit: (values: any) => {
      if (user) update(user.id, { ...user, ...values });
    },
  });

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  useEffect(() => {
    if (error) Alert.alert("Update Failed!", error);
    else if (response && typeof response !== "boolean") {
      updateUser(response);
    }
    if (response) {
      Alert.alert(
        "Email Updated",
        "Email updated successfully. Please check your email box to verify!"
      );
      router.back();
    }
  }, [response, error]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="Email"
          inputMode="email"
          placeholder="Enter your new email"
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          errorMessage={
            touched.email && errors.email ? errors.email.toString() : ""
          }
        />

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
      </View>
      <LoadingBar
        style={{ position: "absolute", top: 0, zIndex: 100 }}
        loading={isLoading}
      />
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
