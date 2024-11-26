import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import TextInput from "@/components/inputs/TextInput";
import { Button, CheckBox, lightColors, Text } from "@rneui/themed";
import { useFormik } from "formik";
import * as Yup from "yup";
import { router } from "expo-router";
import { useFetchAuth } from "@/hooks/store/useFetchAuth";
import {
  countryCodes,
  CountryItem,
  CountryPicker,
} from "react-native-country-codes-picker";

// Validation schema using Yup
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  auth_field: Yup.string().required("Auth method is required"),
  email: Yup.string()
    .email("Invalid email address")
    .when("auth_field", {
      is: "email",
      then: (schema: any) => schema.required("Email is required"),
    }),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .when("auth_field", {
      is: "phone",
      then: (schema: any) => schema.required("Phone number is required"),
    }),
  phone_country: Yup.string().when("auth_field", {
    is: "phone",
    then: (schema: any) => schema.required("Country is required"),
  }),
  phone_hidden: Yup.boolean(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Password confirmation is required"),
  accept_terms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

const SignupScreen = () => {
  const { height } = useWindowDimensions();
  const [auth_field, setAuthField] = useState("email"); // email or phone
  const { isLoading } = useFetchAuth();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryItem | undefined>(
    countryCodes.find((country) => country.code === "GH")
  );

  const { handleChange, handleSubmit, values, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        phone: "",
        phone_country: "233",
        phone_hidden: false,
        password: "",
        password_confirmation: "",
        accept_terms: false,
        auth_field: "email",
      },
      validationSchema: SignupSchema,
      onSubmit: (values) => {
        console.log("Signup values:", values);
        // Add your signup logic here
      },
    });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sign Up</Text>
        </View>
        <View style={styles.content}>
          {/* Toggle between email and phone */}
          <Button
            title={`Use ${
              auth_field === "email" ? "Only Phone Number" : "Email"
            }`}
            onPress={() => {
              const newAuthField = auth_field === "email" ? "phone" : "email";
              setAuthField(newAuthField);
              setFieldValue("auth_field", newAuthField); // Update form value
            }}
            titleStyle={{ color: lightColors.grey2 }}
            type="clear"
            icon={{ name: "swap-horiz", color: lightColors.grey2 }}
            iconRight
            containerStyle={styles.switchButton}
          />

          {/* Name input field */}
          <TextInput
            label="Name"
            placeholder="Enter your name"
            value={values.name}
            onChangeText={handleChange("name")}
            errorMessage={(touched.name && errors.name) || ""}
          />

          {/* Email input field */}
          {auth_field === "email" && (
            <TextInput
              label="Email"
              inputMode="email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange("email")}
              errorMessage={(touched.email && errors.email) || ""}
            />
          )}

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
                    handleChange("phone_country")(item.code.toLowerCase());
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
            errorMessage={(touched.phone && errors.phone) || ""}
          />

          <CheckBox
            title="Hide my phone number from public"
            checked={values.phone_hidden}
            onPress={() => setFieldValue("phone_hidden", !values.phone_hidden)}
            containerStyle={styles.checkbox}
          />

          {/* Password input field */}
          <TextInput
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={handleChange("password")}
            secureTextEntry
            errorMessage={(touched.password && errors.password) || ""}
          />

          {/* Password confirmation field */}
          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={values.password_confirmation}
            onChangeText={handleChange("password_confirmation")}
            secureTextEntry
            errorMessage={
              (touched.password_confirmation && errors.password_confirmation) ||
              ""
            }
          />

          {/* Accept terms checkbox */}
          <CheckBox
            title={
              <Text>
                I accept the{" "}
                <Text
                  style={{ color: lightColors.primary }}
                  onPress={() => router.push("/pages/terms")}
                >
                  terms and conditions
                </Text>
              </Text>
            }
            checked={values.accept_terms}
            onPress={() => setFieldValue("accept_terms", !values.accept_terms)}
            containerStyle={styles.checkbox}
          />
          {touched.accept_terms && errors.accept_terms && (
            <Text style={styles.errorText}>{errors.accept_terms}</Text>
          )}
        </View>

        <View style={styles.footer}>
          {/* Submit Button */}
          <Button
            radius={10}
            buttonStyle={styles.button}
            title={isLoading ? "Signing Up..." : "Sign Up"}
            onPress={() => handleSubmit()}
            loading={isLoading}
            disabled={isLoading}
          />

          <Text style={styles.textCenter}>
            Already have an account?{" "}
            <Text
              style={{ color: lightColors.primary }}
              onPress={() => router.push("../login")}
            >
              Login
            </Text>
          </Text>

          <Text style={styles.textCenter}>
            By continuing you agree to the{" "}
            <Text
              style={{ color: lightColors.primary }}
              onPress={() => router.push("/pages/terms")}
            >
              Policy and Rules
            </Text>
          </Text>

          <Button
            onPress={() => router.replace("../(tabs)")}
            type="outline"
            radius={10}
            icon={{ name: "home", color: lightColors.primary }}
            title={"Go Home"}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

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
    rowGap: 16,
    marginTop: 16,
  },
  footer: {
    width: "100%",
    gap: 20,
    marginTop: 24,
    alignItems: "center",
  },
  button: {
    height: 45,
    width: 300,
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
  switchButton: {},
  checkbox: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 0,
    marginVertical: 0,
    paddingVertical: 0,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});
