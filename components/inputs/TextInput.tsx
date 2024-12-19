// components/inputs/TextInput.js
import React, { Component, ReactNode, useState } from "react";
import {
  InputModeOptions,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputFocusEventData,
  View,
  ViewStyle,
} from "react-native";
import { Input, lightColors, Text } from "@rneui/themed";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { IconNode } from "@rneui/base";

// Validate input on change
export const validateInput = (
  text: string,
  regex?: string,
  required?: boolean,
  label?: string,
  errorMessage?: string
): string | undefined => {
  let validationError: string | undefined = "";
  // Required validation
  if (required && !text) {
    validationError = `${label} is required`;
  } else if (required && text.trim() === "") {
    validationError = `${label} is required`;
  }
  // Regex validation (if regex pattern is provided)
  else if (text && regex && !new RegExp(regex).test(text)) {
    validationError = errorMessage;
  }

  return validationError;
};

export const EmailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
export const passwordRegex = "^.{6,}$";

export default function TextInput({
  value,
  label,
  placeholder,
  onChangeText,
  inputMode,
  errorMessage,
  disabled = false,
  secureTextEntry = false,
  style,
  onBlur,
  left,
  leftContianer,
  inputContainer,
  containerStyle,
  rightIcon,
  multiline,
}: {
  value?: string | number;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  onChangeText?: (text: string) => void;
  inputMode?: InputModeOptions;
  errorMessage?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainer?: StyleProp<ViewStyle>;
  onBlur?: (e?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  left?: ReactNode;
  rightIcon?: IconNode;
  leftContianer?: StyleProp<ViewStyle>;
}) {
  const [secured, setSecured] = useState(secureTextEntry);

  return (
    <View style={[{ width: "100%" }, containerStyle && containerStyle]}>
      {left && (
        <Text style={[styles.label, { color: lightColors.grey3 }]}>
          {label}
        </Text>
      )}
      <View style={{ flexDirection: "row", gap: 4, justifyContent: "center" }}>
        {left && <View style={[{ width: 80 }, leftContianer]}>{left}</View>}
        <Input
          inputMode={inputMode}
          label={!left && label}
          labelStyle={[label && styles.label]}
          value={value?.toString()}
          onChangeText={onChangeText}
          errorMessage={errorMessage}
          placeholder={placeholder}
          containerStyle={[
            styles.container,
            style,
            left ? { height: 50 } : null,
          ]}
          inputContainerStyle={[styles.inputContainer, inputContainer]}
          inputStyle={styles.input}
          disabled={disabled}
          secureTextEntry={secured}
          multiline={multiline}
          onBlur={onBlur}
          rightIcon={
            rightIcon
              ? rightIcon
              : secureTextEntry && {
                  name: secured ? "eye-slash" : "eye",
                  type: "font-awesome",
                  onPress: () => setSecured(!secured),
                }
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 70,
    paddingHorizontal: 0,
    margin: 0,
    marginVertical: 0,
  },
  inputContainer: {
    borderBottomWidth: 0,
    height: 50,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "200",
    marginBottom: 4,
    marginHorizontal: 8,
  },
  input: {
    margin: 0,
    marginVertical: 0,
  },
});
