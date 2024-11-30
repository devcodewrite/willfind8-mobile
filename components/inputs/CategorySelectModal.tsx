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

  const pageTitle = parentId
    ? categories[parentId]?.name || "Category"
    : "All Categories";

  const [searchValue, setSearchValue] = useState<string>("");
  const initialList = parentId
    ? subCategoryIds[parentId]?.map((id) => categories[id])
    : categoryIds?.map((id) => categories[id]);
  const [categoryList, setCategoryList] = useState(initialList);

  useEffect(() => {
    fetchCategories({ parentId, perPage: 20 });
  }, [fetchCategories, parentId]);

  useEffect(() => {
    setCategoryList(
      initialList.filter((c) =>
        c.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
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
                <Text style={{ fontSize: 16 }}>{pageTitle}</Text>
              </View>
              <Button
                onPress={() => setSearchValue("")}
                type="clear"
                titleStyle={{ fontWeight: "600" }}
                title={""}
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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "80%",
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
