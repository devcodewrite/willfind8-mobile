import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import { Avatar, Button, Text } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const appName = Constants?.expoConfig?.name || "";

export default function ImagePickerInput({
  value = [],
  mainImageValue,
  onImagesSelected,
  maxImages = 5,
  onMainImageSelected,
  errorMessage,
  imagePlaceHolder,
}: {
  value: Array<string>;
  mainImageValue?: string;
  onImagesSelected: (imgs: Array<string | undefined>) => void;
  maxImages?: number;
  onMainImageSelected?: (img?: string | null) => void;
  errorMessage?: string;
  imagePlaceHolder?: Array<string>;
}) {
  const [imageUris, setImageUris] = useState<Array<string | undefined>>(value);
  const [mainImageUri, setMainImageUri] = useState<string | null>(
    mainImageValue || null
  );

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

  const handleImagePicker = async (isCamera: boolean) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted || !libraryPermissionResult.granted) {
      alert("Permission to access camera and media library is required!");
      return;
    }

    let result;

    if (isCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        quality: 0.5,
        selectionLimit: maxImages,
      });
    }

    if (!result.canceled) {
      const newUris = await Promise.all(
        result.assets.map(
          async (asset) => await storeImageInAppFolder(asset.uri)
        )
      );
      const updatedUris = [...imageUris, ...newUris].slice(0, maxImages);
      setImageUris(updatedUris);
      setMainImageUri(updatedUris[0] || null);
      onImagesSelected(updatedUris);
      onMainImageSelected(updatedUris[0] || null);
    }
  };

  const storeImageInAppFolder = async (imageUri: string) => {
    try {
      const folderUri = `${FileSystem.documentDirectory}${appName}/`;
      const folderInfo = await FileSystem.getInfoAsync(folderUri);

      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
      }

      const imageName = imageUri.split("/").pop();
      const newPath = `${folderUri}${imageName}`;

      await FileSystem.moveAsync({
        from: imageUri,
        to: newPath,
      });

      return newPath;
    } catch (error) {
      console.error("Error storing image:", error);
    }
  };

  const removeImage = (uri: string) => {
    const updatedUris = imageUris.filter((imageUri) => imageUri !== uri);
    setImageUris(updatedUris);
    if (uri === mainImageUri) selectMainImage(updatedUris[0] || null); // Reset main image if removed
    if (onImagesSelected) onImagesSelected(updatedUris);
  };

  const selectMainImage = (uri: string | null) => {
    setMainImageUri(uri);
    if (onMainImageSelected) onMainImageSelected(uri);
  };

  const renderImageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => selectMainImage(item)}
      style={styles.imageWrapper}
    >
      <Avatar source={{ uri: item }} size={100} />
      <TouchableOpacity
        onPress={() => removeImage(item)}
        style={styles.removeImageButton}
      >
        <Ionicons color={"red"} name="close" size={20} />
      </TouchableOpacity>

      {item === mainImageUri ? (
        <View style={styles.mainImageIndicator}>
          <Ionicons name="star" size={20} color={"gold"} />
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imageUris?.length > 0 ? imageUris : imagePlaceHolder}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imagePreviewContainer}
      />

      {imageUris.length < maxImages && (
        <Button
          title={`Add Photo (${maxImages - imageUris.length} left)`}
          style={styles.addButton}
          titleStyle={{ fontSize: 16, color: "black", fontWeight: "400" }}
          buttonStyle={styles.buttonStyle}
          onPress={showImagePickerOptions}
        />
      )}

      <Text style={styles.caption}>
        Selected {imageUris.length} / {maxImages} images
      </Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: "center",
  },
  imagePreviewContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
  },
  mainImageIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 4,
  },
  mainImageSelected: {
    backgroundColor: "gold",
  },
  addButton: {
    marginTop: 8,
    width: 150,
  },
  buttonStyle: {
    backgroundColor: "#d8d8d8",
    borderRadius: 16,
    paddingVertical: 4,
  },
  caption: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  mainImageCaption: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
    fontStyle: "italic",
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 8,
    color: "red",
  },
});
