import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import CategoryList from "@/components/ui/lists/CategoryList";
import { Button, Text } from "@rneui/themed";
import useCategoryStore from "@/hooks/store/useFetchCategories";
import SearchBar from "@/components/inputs/SearchBar";

interface CategorySelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: any) => void;
  parentId?: number;
}

const CategorySelectModal: React.FC<CategorySelectModalProps> = ({
  visible,
  onClose,
  onSelectCategory,
  parentId,
}) => {
  const {
    subCategoryIds,
    categoryIds,
    categories,
    fetchCategories,
    loading,
    error,
  } = useCategoryStore();

  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    fetchCategories({ parentId, perPage: 20 });
  }, [fetchCategories, parentId]);

  const categoryList = parentId
    ? subCategoryIds[parentId]?.map((id) => categories[id])
    : categoryIds?.map((id) => categories[id]);

  const pageTitle = parentId
    ? categories[parentId]?.name || "Category"
    : "All Categories";

  return (
    <Modal presentationStyle="formSheet" visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Button
                onPress={onClose}
                type="clear"
                titleStyle={{ fontWeight: "600" }}
                title={"Close"}
              />
              <View>
                <Text>{pageTitle}</Text>
              </View>
              <Button
                onPress={() => setSearchValue("")}
                type="clear"
                titleStyle={{ fontWeight: "600" }}
                title={"Clear"}
              />
            </View>
            <SearchBar
              placeholder="Search category?"
              search={searchValue}
              onChangeText={setSearchValue}
            />
            <CategoryList
              data={categoryList}
              loading={loading}
              error={error}
              retry={async () => {
                await fetchCategories({ parentId, perPage: 20 });
              }}
              onPress={(item) => {
                onSelectCategory(item); // Pass the selected category back
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CategorySelectModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});
