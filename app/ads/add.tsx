// app/tabs/add.jsx
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { router, Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, lightColors, Switch, Text } from "@rneui/themed";

import ImagePickerInput from "@/components/inputs/ImagePickerInput";
import DescriptionInput from "@/components/inputs/DescriptionInput";
import PriceInput from "@/components/inputs/PriceInput";
import TextInput from "@/components/inputs/TextInput";
import TagInput from "@/components/inputs/TagInput";
import SelectDialog from "@/components/inputs/SelectDialog";
import { RichEditor } from "@/components/pell-rich-editor";
import { useFilterStore } from "@/hooks/store/filterStore";
import SelectInput from "@/components/inputs/SelectInput";
import LoadingBar from "@/components/ui/cards/LoadingBar";

export default function AddScreen() {
  const { width } = useWindowDimensions();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const richText = useRef<RichEditor>();
  useState<boolean>(false);

  const {
    dynamicFilters,
    isLoading,
    error,
    fetchFilters,
    defaultFilters,
    setDefaultFilters,
    setDynamicFilters,
    updateSelectedValue,
  } = useFilterStore();

  const category = defaultFilters.find(
    (filter) => filter.id === "c"
  )?.selectedValue;

  useEffect(() => {
    if (defaultFilters.length === 0) setDefaultFilters();
    fetchFilters(category?.id);
  }, [fetchFilters, defaultFilters]);

  useEffect(() => {
    setDefaultFilters();
    setDynamicFilters([]);
  }, [setDefaultFilters, setDynamicFilters]);

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    if (richText.current) richText.current.dismissKeyboard();
  };
  const openCategoryModal = () =>
    router.push({ pathname: "/search/categories_menu" });

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: "New Advert",
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
      <View style={{ padding: 10 }}>
        <SelectDialog
          label={"Category"}
          value={category?.name}
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
              />
              <DescriptionInput
                inputRef={richText}
                value={description}
                onChange={setDescription}
              />
              {dynamicFilters.map((filter) => {
                let options: any = [];
                if (filter.type === "select") {
                  options = filter.options.map((option) => ({
                    label: option.value,
                    value: option.id,
                  }));
                  options.unshift({ label: "All", value: 0 });
                }
                return (
                  <View key={filter.id} style={styles.filterContainer}>
                    <Text style={styles.label}>{filter.name}</Text>
                    {filter.type === "select" && (
                      <SelectInput
                        value={filter.selectedValue}
                        onChange={(value: string) =>
                          updateSelectedValue(filter.id, value.toString())
                        }
                        placeholder={`Select ${filter.name}`}
                        options={options}
                      />
                    )}
                    {filter.type === "text" && (
                      <TextInput
                        placeholder={filter.name}
                        value={filter.selectedValue as string}
                        onChangeText={(value: string) =>
                          updateSelectedValue(filter.id, value)
                        }
                        label={filter.name}
                        inputMode={"text"}
                      />
                    )}
                    {filter.type === "number" && (
                      <TextInput
                        placeholder={filter.name}
                        value={filter.selectedValue as string}
                        onChangeText={(value: string) =>
                          updateSelectedValue(filter.id, parseInt(value))
                        }
                        label={filter.name}
                        inputMode={"numeric"}
                      />
                    )}
                    {filter.type === "radio" &&
                      filter.options.map((option) => (
                        <View key={option.id} style={styles.radioContainer}>
                          <Text>{option.value}</Text>
                          <Switch
                            value={filter.selectedValue === option.id}
                            onValueChange={() =>
                              updateSelectedValue(filter.id, option.id)
                            }
                          />
                        </View>
                      ))}
                    {filter.type === "checkbox_multiple" &&
                      filter.options.map((option) => (
                        <View key={option.id} style={styles.checkboxContainer}>
                          <Text>{option.value}</Text>
                          <Switch
                            value={(filter.selectedValue as number[]).includes(
                              option.id
                            )}
                            onValueChange={(isSelected) => {
                              const updatedValue = isSelected
                                ? [
                                    ...(filter.selectedValue as number[]),
                                    option.id,
                                  ]
                                : (filter.selectedValue as number[]).filter(
                                    (v) => v !== option.id
                                  );
                              updateSelectedValue(filter.id, updatedValue);
                            }}
                          />
                        </View>
                      ))}
                  </View>
                );
              })}

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
        <LoadingBar loading={isLoading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  filterContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-around",
  },
});
