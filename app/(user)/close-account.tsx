import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, CheckBox, lightColors, Text } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";

import TextInput from "@/components/inputs/TextInput";
import { useFetchAuth } from "@/hooks/store/useFetchAuth";
import { useAuth } from "@/lib/auth/AuthProvider";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import { TouchableWithoutFeedback } from "react-native";

// Validation schema using Yup
const UserSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
});

const UserScreen = () => {
  const { isLoading, closeAccount, response, error } = useFetchAuth();
  const { user, logout } = useAuth();

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
    initialValues: {
      password: "",
    },
    validationSchema: UserSchema,
    onSubmit: (values: any) => {
      if (user) closeAccount(user.id);
    },
  });

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  useEffect(() => {
    if (error) Alert.alert("Update Failed!", error);
    if (response) logout();
  }, [response, error]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.content}>
          <Text
            style={{
              color: lightColors.error,
              textAlign: "center",
            }}
          >
            This action will remove your account completely form our system and you will
            not be able recover any of your related data including your ads.
          </Text>
          {/* Password input field */}
          <TextInput
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            secureTextEntry
            errorMessage={
              (touched.password && errors.password?.toString()) || ""
            }
          />
          <Button
            size="lg"
            buttonStyle={styles.button}
            color={"primary"}
            title="Delete Account"
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
      </TouchableWithoutFeedback>
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
    flex: 1,
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
  countryCodeBtn: {
    backgroundColor: lightColors.white,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  textCenter: {
    textAlign: "center",
    width: "100%",
  },
  code: {
    fontSize: 16,
    flexDirection: "row",
  },
  checkbox: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 0,
    marginVertical: 0,
    paddingVertical: 0,
  },
});
