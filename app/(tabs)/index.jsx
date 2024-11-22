import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text } from "@rneui/themed";
import { useCallback, useEffect, useRef } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import CategoryGrid from "@/components/ui/lists/CategoryGrid";
import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import SearchBar from "@/components/inputs/SearchBar";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import { usePosts } from "@/lib/store/PostContext";
import { useCategories } from "@/lib/store/CategoryContext";

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

  const { postState, fetchPosts, resetState } = usePosts();
  const { posts, loading, hasMore } = postState;
  const { categoryState, fetchCategories } = useCategories();
  const { categories } = categoryState;

  useFocusEffect(
    useCallback(() => {
      resetState();
      fetchPosts({ sort: "created_at", op: "latest", perPage: 10 });
    }, [])
  );
  useEffect(() => {
    fetchCategories({ parentId: 0, perPage: 20 });
  }, []);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchPosts({ sort: "created_at", op: "latest", perPage: 10 });
    }
  };

  const handlePostClick = (item) =>
    router.push({ pathname: "/ads/details", params: item });

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
            <CategoryGrid size={width / 3} categories={categories} />
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
              <Text style={{ fontWeight: "600" }}>Latest</Text>
            </View>
          </>
        }
        ListEmptyComponent={loading ? null : EmptyListingCard}
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
        data={posts}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" /> : null
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
