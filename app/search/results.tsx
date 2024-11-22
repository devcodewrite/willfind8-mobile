import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchList from "@/components/ui/SearchList";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import { usePosts } from "@/lib/store/PostContext";
import { useWindowDimensions } from "react-native";
import PostCard from "@/components/ui/cards/PostCard";
import { Button } from "@rneui/themed";
import { useCities } from "@/lib/store/CityContext";

interface FilterType {
  c?: number | string;
  sort?: string;
  l?: number | string;
  q?: string;
  op?: "search" | "preminum" | "latest" | "similar";
}

// Define the City interface
interface City {
  id: number;
  country_code: string;
  name: string;
  latitude: string;
  longitude: string;
  subadmin1_code: string;
  subadmin2_code: string;
  population: number;
  time_zone: string;
  active: number;
  posts_count: number;
}

const SearchLayout = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const route = useRouteInfo();
  const insets = useSafeAreaInsets();

  const { query, category_id: c, city_id: l } = route.params;
  const [searchValue, setSearchValue] = useState<string>(query?.toString());
  const [filter, setFilter] = useState<FilterType>({
    c: c?.toString(),
    sort: "created_at",
    q: query?.toString(),
    op: "search",
  });

  const { postState, fetchPosts, resetState } = usePosts();
  const { posts, loading, hasMore } = postState;
  const { cityState, getCityById } = useCities();
  const { selectedCity } = cityState;

  useEffect(() => {
    resetState();
    fetchPosts({
      perPage: 10,
      distance: 50,
      l: selectedCity?.id,
      ...filter,
    });

  }, [filter, selectedCity]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchPosts({
        perPage: 10,
        distance: 50,
        l: selectedCity?.id,
        ...filter,
      });
    }
  };

  const handlePostClick = (item: any) =>
    router.push({ pathname: "/ads/details", params: item });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 60,
        },
      ]}
    >
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              marginBottom: 5,
            }}
          >
            <Button
              icon={{
                name: "map-marker",
                type: "font-awesome",
                color: "white",
                size: 14,
              }}
              title={selectedCity ? selectedCity.name : "All of Ghana"}
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
                  pathname: "/search/cities",
                })
              }
            />
          </View>
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
        data={posts}
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
      <SearchList
        style={{
          position: "absolute",
          top: insets.top,
          zIndex: 100,
          maxHeight: "60%",
        }}
        initialValue={searchValue}
        onPress={(query, suggestion) => {
          setFilter({ ...filter, ...{ q: query, c: suggestion?.category_id } });
        }}
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
});
