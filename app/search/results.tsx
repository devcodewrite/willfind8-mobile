import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouteInfo } from "expo-router/build/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import { useWindowDimensions } from "react-native";
import PostCard from "@/components/ui/cards/PostCard";
import { Button, lightColors } from "@rneui/themed";
import usePostStore from "@/hooks/store/useFetchPosts";
import { router } from "expo-router";
import SearchBar from "@/components/inputs/SearchBar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFilterStore } from "@/hooks/store/filterStore";

interface FilterType {
  c?: number | string;
  sort?: string;
  l?: number | string;
  q?: string;
  op?: "search" | "preminum" | "latest" | "similar";
  minPrice?: number;
  maxPrice?: number;
  cf?: Map<number, number | string>;
}

interface FilterOption {
  id: number;
  field_id: number;
  value: string;
  parent_id: number | null;
}

interface DefaultFilter {
  id: string;
  name: string;
  type: "range" | "select";
  path?: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string | number }[];
  selectedValue: any; // Selected value for the filter
}

const SearchLayout = () => {
  const { width } = useWindowDimensions();
  const route = useRouteInfo();
  const insets = useSafeAreaInsets();

  const { query, category_id: c, city_id: l } = route.params;
  const initialFilterValues: FilterType = {
    c: c?.toString(),
    sort: "created_at",
    q: query?.toString(),
    op: "search",
  };
  const {
    searchResultIds,
    items,
    loading,
    error,
    fetchSearchResults,
    resetSearchResults,
  } = usePostStore();
  const { defaultFilters, dynamicFilters } = useFilterStore();

  const category: DefaultFilter = defaultFilters.find(
    (filter: DefaultFilter) => filter.id === "c"
  )?.selectedValue;
  const priceRange: DefaultFilter = defaultFilters.find(
    (filter: DefaultFilter) => filter.id === "priceRange"
  )?.selectedValue;
  const city: DefaultFilter = defaultFilters.find(
    (filter: DefaultFilter) => filter.id === "l"
  )?.selectedValue;

  const [filter, setFilter] = useState<FilterType>(initialFilterValues);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    resetSearchResults();
    fetchSearchResults({
      perPage: 10,
      distance: 50,
      ...filter,
    }).finally(() => setRefreshing(false));
  }, [filter, route]);

  useEffect(() => {
    const cf = dynamicFilters.reduce<Map<number, number | string>>(
      (map, filter) => {
        if (
          typeof filter.selectedValue === "number" ||
          typeof filter.selectedValue === "string"
        ) {
          map.set(filter.id, filter.selectedValue);
        } else if (filter.selectedValue) {
          map.set(filter.id, filter.selectedValue.join(","));
        }
        return map;
      },
      new Map()
    );
    setFilter({
      ...filter,
      cf,
      c: category?.id,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max,
      l: city?.id,
    });
  }, [category, priceRange, city, dynamicFilters]);

  const loadMore = () => {
    fetchSearchResults({
      perPage: 10,
      distance: 50,
      ...filter,
    }).finally(() => setRefreshing(false));
  };

  const handlePostClick = (item: any) =>
    router.push({ pathname: "../ads/details", params: item });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("../search/search");
          }}
          style={{ flex: 1 }}
        >
          <SearchBar
            onPress={() => {
              router.push({ pathname: "../search/search", params: { query } });
            }}
            placeholder="What are you looking for?"
            search={query}
            onChangeText={undefined}
            onFilterPress={undefined}
            inputStyle={undefined}
            style={undefined}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnFilter}
          onPress={() =>
            router.push({
              pathname: "../search/filters",
            })
          }
        >
          <Feather name="filter" size={24} color={lightColors.grey2} />
        </TouchableOpacity>
      </View>
      <FlatList
        ListHeaderComponent={
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              marginBottom: 5,
            }}
            contentContainerStyle={{
              gap: 8,
            }}
            horizontal
          >
            <Button
              icon={{
                name: "map-marker",
                type: "font-awesome",
                color: "white",
                size: 14,
              }}
              title={city ? city.name : "All of Ghana"}
              titleStyle={{ fontSize: 14 }}
              buttonStyle={{
                backgroundColor: "#0404cc6f",
                height: 30,
                padding: 0,
                borderRadius: 10,
                justifyContent: "space-between",
              }}
              onPress={() =>
                router.push({
                  pathname: "../search/cities_menu",
                })
              }
            />
            {category ? (
              <Button
                icon={{
                  name: "filter",
                  type: "font-awesome",
                  color: "white",
                  size: 14,
                }}
                title={category.name}
                titleStyle={{ fontSize: 14 }}
                buttonStyle={{
                  backgroundColor: "#f4040c6f",
                  height: 30,
                  padding: 0,
                  borderRadius: 10,
                  justifyContent: "space-between",
                }}
                onPress={() =>
                  router.push({
                    pathname: "../search/filters",
                  })
                }
              />
            ) : null}
            {priceRange ? (
              <Button
                icon={{
                  name: "filter",
                  type: "font-awesome",
                  color: "white",
                  size: 14,
                }}
                title={`price: ${priceRange.min} ~ ${priceRange.max}`}
                titleStyle={{ fontSize: 14 }}
                buttonStyle={{
                  backgroundColor: "#04ff048f",
                  height: 30,
                  padding: 0,
                  borderRadius: 10,
                  justifyContent: "space-between",
                }}
                onPress={() =>
                  router.push({
                    pathname: "../search/filters",
                  })
                }
              />
            ) : null}
          </ScrollView>
        }
        ListEmptyComponent={loading ? null : EmptyListingCard}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            size={width / 2}
            title={item.title}
            city={item.city}
            picture={item.picture}
            price_formatted={item.price_formatted}
            count_pictures={item.count_pictures}
            onPress={(e: any) => handlePostClick(item)}
          />
        )}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        data={searchResultIds.map((id) => items[id])}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          resetSearchResults();
          fetchSearchResults({
            perPage: 10,
            distance: 50,
            ...filter,
          }).finally(() => setRefreshing(false));
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
        columnWrapperStyle={{
          gap: 0.5,
        }}
        initialNumToRender={10}
        removeClippedSubviews
      />
    </View>
  );
};

export default SearchLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  list: {
    gap: 8,
    paddingBottom: 8,
    paddingTop: 60,
  },
  loader: {
    padding: 20,
    paddingVertical: 30,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 8,
    alignItems: "center",
  },
  btn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnFilter: {
    width: 38,
    height: 38,
    marginStart: 4,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: lightColors.grey5,
    borderRadius: 5,
  },
});
