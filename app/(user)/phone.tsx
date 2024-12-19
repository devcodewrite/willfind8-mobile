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
import { router } from "expo-router";

// Validation schema using Yup
const UserSchema = Yup.object().shape({
  phone: Yup.string().nonNullable().required("Phone number is required"),
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
      phone: "",
      phone_country: "gh",
      country_code: undefined,
      phone_hidden: false,
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
    if (response) {
      Alert.alert("Phone Number Updated", "Phone number updated successfully.");
    }
  }, [response, error]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.content}>
          {/* Phone input field */}
          <TextInput
            left={
              <TouchableOpacity
                style={styles.countryCodeBtn}
                onPress={() => setShowCountryPicker(true)}
              >
                {countryCode ? (
                  <Text style={styles.code}>
                    {countryCode.flag} {countryCode.dial_code}
                  </Text>
                ) : null}

                <CountryPicker
                  show={showCountryPicker}
                  // when picker button press you will get the country object with dial code
                  pickerButtonOnPress={(item) => {
                    setCountryCode(item);
                    handleChange("phone_country")(item.code);
                    setShowCountryPicker(false);
                  }}
                  lang={"en"}
                  style={{
                    modal: {
                      marginTop: 100,
                    },
                  }}
                  onRequestClose={() => setShowCountryPicker(false)}
                />
              </TouchableOpacity>
            }
            label="Phone"
            placeholder="Enter your phone number"
            value={values.phone}
            inputMode="numeric"
            onChangeText={handleChange("phone")}
            onBlur={handleBlur("phone")}
            errorMessage={(touched.phone && errors.phone?.toString()) || ""}
          />
          <CheckBox
            title="Hide my phone number from public"
            checked={values.phone_hidden}
            onPress={() => setFieldValue("phone_hidden", !values.phone_hidden)}
            containerStyle={styles.checkbox}
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
