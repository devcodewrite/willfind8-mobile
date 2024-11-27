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
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { lightColors, LinearProgress, Switch, Text } from "@rneui/themed";

import ImagePickerInput from "@/components/inputs/ImagePickerInput";
import DescriptionInput from "@/components/inputs/DescriptionInput";
import PriceInput from "@/components/inputs/PriceInput";
import TextInput from "@/components/inputs/TextInput";
import TagInput from "@/components/inputs/TagInput";
import SelectDialog from "@/components/inputs/SelectDialog";
import { RichEditor } from "@/components/pell-rich-editor";
import CategorySelectModal from "@/components/inputs/CategorySelectModal";
import { useFilterStore } from "@/hooks/store/filterStore";
import SelectInput from "@/components/inputs/SelectInput";

// Define Category interface
interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string;
  hide_description: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  picture: string;
  icon_class: string;
  active: number;
  lft: number;
  rgt: number;
  depth: number;
  type: string;
  is_for_permanent: number;
  parent: Category | null;
  picture_url: string;
}

export default function AddScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const richText = useRef<RichEditor>();
  const [parentId, setParentId] = useState<number>();
  const [parentCategoryVisible, setParentCategoryVisible] =
    useState<boolean>(false);
  const [category, setCategory] = useState<Category>();
  const [categoryVisible, setCategoryVisible] = useState<boolean>(false);
  const {
    dynamicFilters,
    isLoading,
    error,
    fetchFilters,
    defaultFilters,
    setDefaultFilters,
    updateSelectedValue,
  } = useFilterStore();

  useEffect(() => {
    if (dynamicFilters.length === 0) fetchFilters(category?.id || 0);
  }, [category]);

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    if (richText.current) richText.current.dismissKeyboard();
  };
  const openCategoryModal = () => setParentCategoryVisible(true);

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                errorMessage={undefined}
                style={undefined}
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
                        errorMessage={undefined}
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
                        errorMessage={undefined}
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
        {isLoading && (
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              top: 0,
            }}
          >
            <LinearProgress
              variant="indeterminate"
              color="primary"
              trackColor={lightColors.grey5}
              style={{ width: width }}
            />
          </View>
        )}
      </View>
      <CategorySelectModal
        visible={parentCategoryVisible}
        onSelectCategory={(cat) => {
          setParentCategoryVisible(false);
          setParentId(cat.id);
          setCategoryVisible(true);
        }}
        onClose={() => setParentCategoryVisible(false)}
      />
      <CategorySelectModal
        visible={categoryVisible}
        parentId={parentId}
        onSelectCategory={(cat) => {
          setCategoryVisible(false);
          setCategory(cat);
        }}
        onClose={() => setCategoryVisible(false)}
      />
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
