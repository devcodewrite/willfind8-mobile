// components/inputs/TextInput.js
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input } from "@rneui/themed";

// Validate input on change
export const validateInput = (text, regex, required, label, errorMessage) => {
  let validationError = "";
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
}) {
  return (
    <Input
      inputMode={inputMode}
      label={label}
      labelStyle={styles.label}
      value={value}
      onChangeText={onChangeText}
      errorMessage={errorMessage}
      placeholder={placeholder}
      containerStyle={[styles.container, style]}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      disabled={disabled}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    paddingHorizontal: 0,
    margin: 0,
    marginVertical: 0,
  },
  inputContainer: {
    borderBottomWidth: 0,
    height: 50,
    backgroundColor: "#fff",
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
