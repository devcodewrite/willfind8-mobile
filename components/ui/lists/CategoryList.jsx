import React from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import CategoryCard from "@/components/ui/cards/CategoryCard";
import EmptyListingCard from "@/components/ui/cards/EmptyListingCard";

export default function CategoryList({ style = {}, data }) {
  const { width } = useWindowDimensions();

  const handleRenderItem = ({ item }) => (
    <CategoryCard size={width} {...item} />
  );

  return (
    <FlatList
      style={style}
      data={data}
      renderItem={handleRenderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      columnWrapperStyle={{gap:4}}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={EmptyListingCard}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    gap:4,
  },
});
