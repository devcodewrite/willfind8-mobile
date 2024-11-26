import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  ViewStyle,
} from "react-native";
import CategoryCardLandscape from "@/components/ui/cards/CategoryCardLandscape";
import { EmptyListingCard } from "../cards/EmptyListingCard";
import { Button, Chip } from "@rneui/themed";
import { View } from "react-native";

interface Category {
  id: number;
  picture_url?: string;
  name?: string;
}

export default function CategoryList({
  style,
  data,
  error,
  loading,
  retry,
  onPress,
  selected,
}: {
  style?: ViewStyle;
  data: Array<Category>;
  error?: any;
  loading?: boolean;
  retry?: () => Promise<void>;
  onPress: (item: Category) => void;
  selected?: Category;
}) {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading) setRefreshing(false);
  }, [loading]);

  const handleRenderItem = ({ item }: { item: Category }) => (
    <CategoryCardLandscape
      onPress={() => onPress && onPress(item)}
      category={item}
    />
  );

  return (
    <FlatList<Category>
      style={[styles.list, style]}
      data={data}
      renderItem={handleRenderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={{ flex: 1 }}>
          {selected ? (
            <Chip
              containerStyle={{ marginBottom: 8, width: 150 }}
              type="outline"
              title={selected?.name}
            />
          ) : null}
        </View>
      }
      ListEmptyComponent={EmptyListingCard}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator size="small" />
        ) : error ? (
          <View style={{ paddingVertical: 50 }}>
            <Button
              onPress={retry}
              type="clear"
              title={"Try again"}
              icon={{ name: "replay" }}
            />
          </View>
        ) : (
          <View style={{ height: 50 }} />
        )
      }
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        if (retry) retry().finally(() => setRefreshing(false));
      }}
      onEndReached={retry}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
