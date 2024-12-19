// components/inputs/ImagePickerInput.js
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Button, lightColors } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const ImagePickerInput2 = ({
  value,
  rounded = false,
  onImageSelected,
}) => {
  const showImagePickerOptions = () => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Camera",
        onPress: () => handleImagePicker(true),
      },
      {
        text: "Gallery",
        onPress: () => handleImagePicker(false),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleImagePicker = async (isCamera) => {
    // Request permission to access the camera and media library
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      permissionResult.granted === false ||
      libraryPermissionResult.granted === false
    ) {
      alert("Permission to access camera and media library is required!");
      return;
    }

    let result;

    // Launch camera or image library based on user's choice
    if (isCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
    }

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Avatar
          source={value && { uri: value }}
          size={150}
          rounded={rounded}
          icon={{ name: "user", type: "font-awesome", size: 140 }}
          titleStyle={{ height: 150 }}
          containerStyle={{ backgroundColor: "#f1f1f1" }}
          onPress={showImagePickerOptions}
        />
        {value ? (
          <TouchableOpacity
            onPress={() => onImageSelected("")}
            style={styles.addImage}
          >
            <Ionicons color={"red"} name="close" size={24} />
          </TouchableOpacity>
        ) : null}
      </View>

      {!value ? (
        <Button
          title={"Add Photo"}
          style={{
            width: 100,
            marginTop: 8,
          }}
          titleStyle={{ fontSize: 16, color: "black", fontWeight: "400" }}
          buttonStyle={{
            backgroundColor: "#d8d8d8",
            borderRadius: 16,
            paddingVertical: 4,
          }}
          onPress={showImagePickerOptions}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: "center",
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: lightColors.grey5,
    borderRadius: 8,
  },
  rounded: {
    borderRadius: "50%",
    overflow: "hidden",
  },
  addImage: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
});

export default ImagePickerInput2;
