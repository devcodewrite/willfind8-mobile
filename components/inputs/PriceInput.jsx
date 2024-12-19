import React from "react";
import { StyleSheet } from "react-native";
import { Input, CheckBox, Text, lightColors } from "@rneui/themed";

export default function PriceInput({
  value,
  onChangePrice,
  negotiable,
  onToggleNegotiable,
  errorMessage,
  containerStyle
}) {
  return (
    <Input
      label={"Price"}
      labelStyle={styles.label}
      placeholder="Enter price"
      value={value}
      onChangeText={onChangePrice}
      inputMode="decimal"
      returnKeyLabel="Done"
      errorMessage={errorMessage}
      inputContainerStyle={styles.inputContainer}
      containerStyle={[styles.input,containerStyle]}
      leftIcon={() => (
        <Text style={{ fontWeight: "600", fontSize: 16 }}>GHC</Text>
      )}
      rightIcon={
        <CheckBox
          title="Negotiable"
          checked={negotiable}
          onPress={onToggleNegotiable}
          containerStyle={styles.checkboxContainer}
          style={{ padding: 0, margin: 0 }}
          textStyle={styles.checkboxText}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    borderBottomWidth: 0,
    height: 50,
    backgroundColor: lightColors.white,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  input: {
    height: 70,
    paddingHorizontal: 0,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
    alignSelf: "center",
  },
  checkboxText: {
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: "200",
    marginBottom: 4,
    marginHorizontal: 8,
  },
});
