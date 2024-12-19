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
import {
  countryCodes,
  CountryItem,
  CountryPicker,
} from "react-native-country-codes-picker";
import { TouchableWithoutFeedback } from "react-native";

// Validation schema using Yup
const UserSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Password confirmation is required"),
});

const UserScreen = () => {
  const { isLoading, update, response, error } = useFetchAuth();
  const { user, updateUser } = useAuth();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryItem | undefined>(
    countryCodes.find((country: any) => country.code === "GH")
  );

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    isValid,
    values,
    errors,
    touched,
    validateForm,
  } = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
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
    if (response)
      Alert.alert("Phone Number Updated", "Phone number updated successfully.");
  }, [response, error]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.content}>
          {/* Password input field */}
          <TextInput
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={handleChange("password")}
            secureTextEntry
            errorMessage={
              (touched.password && errors.password?.toString()) || ""
            }
          />

          {/* Password confirmation field */}
          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={values.password_confirmation}
            onChangeText={handleChange("password_confirmation")}
            secureTextEntry
            errorMessage={
              (touched.password_confirmation &&
                errors.password_confirmation?.toString()) ||
              ""
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
