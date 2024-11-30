import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button, Text } from "@rneui/themed";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";

import CategoryGrid from "@/components/ui/lists/CategoryGrid";
import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import SearchBar from "@/components/inputs/SearchBar";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import usePostStore from "@/hooks/store/useFetchPosts";
import useCategoryStore from "@/hooks/store/useFetchCategories";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -150],
    extrapolate: "clamp",
  });

  const {
    fetchCategories,
    loading: catLoading,
    categories,
    error: catError,
    categoryIds,
  } = useCategoryStore((state) => state);
  const [refreshing, setRefreshing] = useState(false);
  const {
    loadingStates,
    error: postError,
    items: PostsMap,
    latestPostIds,
    fetchLatestPosts,
  } = usePostStore((state) => state);

  const loadMorePost = async () => {
    await fetchLatestPosts({ sort: "created_at", op: "latest", perPage: 10 });
  };

  const handlePostClick = (item) =>
    router.push({ pathname: "/ads/details", params: { id: item.id } });

  return (
    <>
      <Animated.View
        style={[styles.stickySearchArea, { transform: [{ translateY }] }]}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/search/search");
          }}
          style={{ width: "100%" }}
        >
          <SearchBar
            onPress={() => {
              router.push("/search/search");
            }}
            placeholder="What are you looking for?"
            disabled
          />
        </TouchableOpacity>
      </Animated.View>
      <AnimatedFlatList
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 8,
          paddingTop: 60,
        }}
        style={styles.container}
        ListHeaderComponent={
          <>
            <CategoryGrid
              size={width / 3}
              error={catError}
              loading={catLoading}
              retry={() => fetchCategories({ perPage: 20 })}
              categories={categoryIds.map((id) => categories[id])}
            />
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
              <Text style={{ fontWeight: "600" }}>Latest</Text>
            </View>
          </>
        }
        ListEmptyComponent={loadingStates.fetchLatest || postError ? null : EmptyListingCard}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item }) => (
          <PostCardLandscape
            onPress={() => handlePostClick(item)}
            size={width - 8}
            {...item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        data={latestPostIds.map((id) => PostsMap[id])}
        onEndReached={loadMorePost}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchCategories({ perPage: 20 });
          fetchLatestPosts({ page: 1, op: "latest", perPage: 10 }).finally(() =>
            setRefreshing(false)
          );
        }}
        ListFooterComponent={
          loadingStates.fetchLatest ? (
            <ActivityIndicator size="small" />
          ) : postError ? (
            <View style={{ paddingVertical: 50 }}>
              <Button
                onPress={() => {
                  loadMorePost();
                  fetchCategories({ perPage: 20 });
                }}
                type="clear"
                title={"Try again"}
                icon={{ name: "replay" }}
              />
            </View>
          ) : null
        }
        initialNumToRender={10}
        removeClippedSubviews
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickySearchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
