// app/tabs/add.jsx
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { lightColors, Text } from "@rneui/themed";

import ImagePickerInput from "@/components/inputs/ImagePickerInput";
import DescriptionInput from "@/components/inputs/DescriptionInput";
import PriceInput from "@/components/inputs/PriceInput";
import TextInput from "@/components/inputs/TextInput";
import TagInput from "@/components/inputs/TagInput";
import SelectDialog from "@/components/inputs/SelectDialog";
import {
  RichEditor,
} from "@/components/react-native-pell-rich-editor";

export default function AddScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const richText = useRef<RichEditor>();

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    if (richText.current) richText.current.dismissKeyboard();
  };

  const openCategoryModal = () => {};

  return (
    <ScrollView
      style={{ flex: 1, padding: 10, gap: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: "New Advert",
          headerTitle: ({ children, tintColor }) => (
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {children}
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.65}
              onPress={() => router.back()}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: lightColors.primary,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.65} onPress={() => {}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: lightColors.primary,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          ),
          headerTitleStyle: { fontSize: 16 },
        }}
      />

      <SelectDialog
        label={"Category"}
        value={category}
        onPress={openCategoryModal}
        placeholder={"Select a category"}
      />
      <ImagePickerInput
        onImagesSelected={(imgs: any) => setImages(imgs)}
        onMainImageSelected={(img: any) => setMainImage(img)}
      />

      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.container}>
            <TextInput
              label={"Title"}
              placeholder={"Enter the listing title"}
              value={title}
              onChangeText={setTitle}
              inputMode={"text"}
              errorMessage={undefined}
              style={undefined}
            />
            <DescriptionInput
              inputRef={richText}
              value={description}
              onChange={setDescription}
            />
            <PriceInput
              negotiable={negotiable}
              value={price}
              onChangePrice={setPrice}
              onToggleNegotiable={() => setNegotiable(!negotiable)}
              errorMessage={undefined}
            />
            <TagInput onTagUpdate={(tags) => console.log(tags)} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
