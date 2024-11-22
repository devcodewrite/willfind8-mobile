import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import CategoryList from "@/components/ui/lists/CategoryList";

const SearchLayout = () => {
  const router = useRouter();
  const route = useRouteInfo();
  const { parentId } = route.params;
  const { categoryState, fetchCategories } = useCategories();
  const { categories } = categoryState;

  useEffect(() => {
    fetchCategories({ parentId: 0, perPage: 20 });
  }, []);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchPosts({ sort: "created_at", op: "latest", perPage: 10 });
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Display Search Results */}
      <CategoryList />
    </View>
  );
};

export default SearchLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
    marginTop: 10,
  },
});
