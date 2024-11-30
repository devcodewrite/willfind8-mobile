import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, Stack } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import CategoryList from "@/components/ui/lists/CategoryList";
import { Button } from "@rneui/themed";
import useCategoryStore from "@/hooks/store/useFetchCategories";
import SearchBar from "@/components/inputs/SearchBar";
import { useFilterStore } from "@/hooks/store/filterStore";

const SearchLayout = () => {
  const route = useRouteInfo();
  const { parentId: pId } = route.params;
  const parentId = parseInt(pId?.toString(), 10);
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
  const initialList = parentId
    ? subCategoryIds[parentId]?.map((id) => categories[id])
    : categoryIds?.map((id) => categories[id]);

  const [subCategoryList, setSubCategoryList] = useState(initialList);
  const pageTitle = parentId ? categories[parentId].name : "All Categories";
  const { defaultFilters, updateSelectedValue, setDefaultFilters } =
    useFilterStore();
  const selectCategory = defaultFilters.find(
    (filter) => filter.id === "c"
  )?.selectedValue;

  useEffect(() => {
    if (defaultFilters.length === 0) setDefaultFilters();
  }, [setDefaultFilters]);

  useEffect(() => {
    if (initialList)
      setSubCategoryList(
        initialList.filter((category) =>
          category.name
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())
        )
      );
  }, [searchValue, subCategoryIds, parentId]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: pageTitle,
          headerLeft: () => (
            <Button
              onPress={() => router.back()}
              type="clear"
              titleStyle={{ fontWeight: "600" }}
              title={"Close"}
            />
          ),
        }}
      />
      <SearchBar
        placeholder="Search category ?"
        search={searchValue}
        onChangeText={setSearchValue}
      />
      {/* Display Search Results */}
      <CategoryList
        selected={selectCategory}
        data={loading ? [] : subCategoryList}
        loading={loading}
        error={error}
        retry={async () => {
          await fetchCategories({ parentId, perPage: 20 });
        }}
        onPress={(item) => {
          if (parentId) {
            updateSelectedValue("c", item);
            router.back();
          } else {
            router.dismissTo({
              pathname: "../search/categories_menu",
              params: { parentId: item.id },
            });
          }
        }}
      />
    </View>
  );
};

export default SearchLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
  },
});
