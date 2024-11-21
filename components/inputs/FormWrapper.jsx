// components/FormWrapper.js
import React from "react";
import { StyleSheet, View } from "react-native";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import ButtonGroupInput from "./ButtonGroupInput";
import ImagePickerInput from "./ImagePickerInput";
import SingleDatePicker from "./SingleDatePicker";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

const FormWrapper = ({
  formValues,
  handleChange = (name, value) => {},
  fieldConfig,
  containerStyle,
}) => {
  // Render the right input type based on the field config
  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={field.name}
            label={field.label}
            initialValue={formValues[field.name] ?? ""}
            onChangeText={(value) => handleChange(field.name, value)}
            required={field?.required}
            placeholder={field.placeholder}
          />
        );
      case "email":
        return (
          <TextInput
            key={field.name}
            inputMode={"email"}
            label={field.label}
            placeholder={field.placeholder}
            value={formValues[field.name] ?? ""}
            onChangeText={(value) => handleChange(field.name, value)}
          />
        );

      case "tel":
        return (
          <TextInput
            key={field.name}
            inputMode={"tel"}
            label={field.label}
            placeholder={field.placeholder}
            value={formValues[field.name] ?? ""}
            onChangeText={(value) => handleChange(field.name, value)}
          />
        );
      case "select":
        return (
          <SelectInput
            key={field.name}
            label={field.label}
            value={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            options={field.options}
            required={field?.required}
            placeholder={field.placeholder}
          />
        );
        case "select2":
          return (
            <SelectInput
              key={field.name}
              label={field.label}
              value={formValues[field.name] ?? ""}
              onChange={(value) => handleChange(field.name, value)}
              options={field.options}
              required={field?.required}
              placeholder={field.placeholder}
            />
          );
          
      case "buttonGroup":
        return (
          <ButtonGroupInput
            key={field.name}
            label={field.label}
            value={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            options={field.options}
            placeholder={field.placeholder}
          />
        );

      case "imagePicker":
        return (
          <ImagePickerInput
            key={field.name}
            label={field.label}
            value={formValues[field.name] ?? ""}
            onImageSelected={(value) => {
              handleChange(field.name, value);
            }}
            options={field.options}
            placeholder={field.placeholder}
          />
        );

      case "date":
        return (
          <SingleDatePicker
            key={field.name}
            label={field.label}
            value={
              formValues[field.name]
                ? moment(formValues[field.name]).format("DD/MM/YYYY")
                : null
            }
            onDateSelected={(value) => handleChange(field.name, value)}
            required={field?.required}
            placeholder={field.placeholder}
            icon={<Ionicons name="calendar" size={24} />}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {fieldConfig.map((field) => renderField(field))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    gap: 8,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default FormWrapper;
