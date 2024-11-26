import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import CategoryCard from "../cards/CategoryCard";
import { router } from "expo-router";
import { Button } from "@rneui/themed";

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

export default function CategoryGrid({
  style,
  categories,
  size,
  numColumns = 3,
  error,
  loading,
  retry,
}: {
  style?: StyleProp<ViewStyle>;
  categories: Array<Category>;
  size: number;
  numColumns?: number;
  error?: any;
  loading?: boolean;
  retry?: () => void;
}) {
  const handleCategoryClick = (item: Category) =>
    router.push({
      pathname: "../search/categories",
      params: { parentId: item.id },
    });

  const handleRenderItem = ({ item }: { item: Category }) => (
    <CategoryCard
      onPress={() => handleCategoryClick(item)}
      size={size}
      {...item}
    />
  );

  return (
    <FlatList
      style={style}
      data={categories}
      numColumns={numColumns}
      renderItem={handleRenderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={{ gap: 1 }}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator size="small" />
        ) : error ? (
          <View style={{ paddingVertical: 50 }}>
            <Button
              onPress={() => {
                if (retry) retry();
              }}
              type="clear"
              title={"Try again"}
              icon={{ name: "replay" }}
            />
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={{ height: 1, flex: 1 }} />}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
  },
});
