import { lightColors, Tab, TabView, Text } from "@rneui/themed";
import { router, Tabs } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  TextInputChangeEventData,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import usePostStore, { Post } from "@/hooks/store/useFetchPosts";
import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import LoadingBar from "@/components/ui/cards/LoadingBar";

interface Refreshing {
  all: boolean;
  pending: boolean;
  archived: boolean;
}

export default function MessagesScreen() {
  const { width, height } = useWindowDimensions();
  const { showLoginModal } = useAuthModal();
  const { user } = useAuth();

  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState<Refreshing>({
    all: true,
    pending: true,
    archived: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const {
    items,
    userPostIds,
    userPendingPostIds,
    userArchivedPostIds,
    fetchLoggedInUserPosts,
    fetchLoggedInUserPendingPosts,
    fetchLoggedInUserArchivedPosts,
    deletePosts,
    loadingStates,
    addToSavedPost,
    pagination,
  } = usePostStore();

  const pendingPosts = userPendingPostIds.map((id) => items[id]);
  const archivedPosts = userArchivedPostIds.map((id) => items[id]);

  const handleToggleSaved = (postId: number) => {
    if (user) addToSavedPost(postId, user);
    else showLoginModal();
  };

  const handleDeletePost = (postId: number) => {
    if (!loadingStates.deletePost) deletePosts([postId]);
  };

  const renderItem = ({ item }: { item: Post }) => {
    return (
      <PostCardLandscape
        post={item}
        onPress={() => handlePostClick(item)}
        size={width - 8}
        showMenu
        toggleSaved={handleToggleSaved}
        deletePost={handleDeletePost}
      />
    );
  };

  const renderFooter = () => {
    if (loadingStates.fetchUserPost) {
      return (
        <View style={{ paddingVertical: 50, justifyContent: "center" }}>
          <ActivityIndicator animating />
        </View>
      );
    }

    return null;
  };

  const renderFooter2 = () => {
    if (loadingStates.fetchUserPendingPost) {
      return (
        <View style={{ paddingVertical: 50, justifyContent: "center" }}>
          <ActivityIndicator animating />
        </View>
      );
    }

    return null;
  };

  const renderFooter3 = () => {
    if (loadingStates.fetchUserArchivedPost) {
      return (
        <View style={{ paddingVertical: 50, justifyContent: "center" }}>
          <ActivityIndicator animating />
        </View>
      );
    }

    return null;
  };

  const loadMore = () => {
    if (!loadingStates.fetchUserPost && pagination.userPost.hasMore) {
      fetchLoggedInUserPosts();
    }
  };

  const loadPendigMore = () =>
    !loadingStates.fetchUserPendingPost &&
    pagination.userPendingPost.hasMore &&
    fetchLoggedInUserPendingPosts();

  const loadArchivedMore = () =>
    !loadingStates.fetchUserArchivedPost &&
    pagination.userArchivedPost.hasMore &&
    fetchLoggedInUserArchivedPosts();

  const refresh = (refresh: "all" | "pending" | "archived") => {
    switch (refresh) {
      case "archived":
        if (!loadingStates.fetchUserArchivedPost) {
          setRefreshing({ ...refreshing, archived: true });
          fetchLoggedInUserArchivedPosts({ page: 1 }).finally(() =>
            setRefreshing({ ...refreshing, archived: true })
          );
        }
      case "pending":
        if (!loadingStates.fetchUserPendingPost) {
          setRefreshing({ ...refreshing, pending: true });
          fetchLoggedInUserPendingPosts({ page: 1 }).finally(() =>
            setRefreshing({ ...refreshing, pending: true })
          );
        }
      default:
        if (!loadingStates.fetchUserPost) {
          setRefreshing({ ...refreshing, all: true });
          fetchLoggedInUserPosts({ page: 1 }).finally(() =>
            setRefreshing({ ...refreshing, all: true })
          );
        }
        break;
    }
  };

  const filterPosts = () => {
    let filteredPosts = userPostIds.map((id) => items[id]);

    // Filter by search query if there's one
    if (searchQuery) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredPosts;
  };

  const handleSearchChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setSearchQuery(e.nativeEvent.text);
  };

  const handlePostClick = (item: any) =>
    router.push({ pathname: "../ads/details", params: { id: item.id } });

  const isSearching = searchQuery.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          headerTitle: "My Listing",
          headerSearchBarOptions: {
            placeholder: "Search a post...",
            onChangeText: handleSearchChange,
          },
        }}
      />

      {/* If searching, hide the tabs and display the list of items */}
      {isSearching ? (
        <FlatList
          data={filterPosts()}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={refreshing.all}
          onRefresh={() => refresh("all")}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              height: 3,
              backgroundColor: lightColors.primary,
            }}
            variant="default"
            containerStyle={{ backgroundColor: lightColors.background }}
          >
            <Tab.Item
              title="Approved"
              titleStyle={{ fontSize: 12, color: "black" }}
            />
            <Tab.Item
              title="Pending"
              titleStyle={{ fontSize: 12, color: "black" }}
            />
            <Tab.Item
              title="Archived"
              titleStyle={{ fontSize: 12, color: "black" }}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ width: "100%", height: height }}>
              <FlatList
                data={filterPosts()}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No active items</Text>
                }
                ListFooterComponent={renderFooter}
                refreshing={refreshing.all}
                onRefresh={() => refresh("all")}
              />
            </TabView.Item>

            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={pendingPosts}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No pending items</Text>
                }
                ListFooterComponent={renderFooter2}
                onEndReached={loadPendigMore}
                onEndReachedThreshold={0.5}
                refreshing={refreshing.pending}
                onRefresh={() => refresh("pending")}
              />
            </TabView.Item>

            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={archivedPosts}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No archived items</Text>
                }
                ListFooterComponent={renderFooter3}
                onEndReached={loadArchivedMore}
                onEndReachedThreshold={0.5}
                refreshing={refreshing.archived}
                onRefresh={() => refresh("archived")}
              />
            </TabView.Item>
          </TabView>
          <LoadingBar
            style={{ position: "absolute", top: 0, zIndex: 100 }}
            loading={loadingStates.deletePost}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
  },
  list: {
    flex: 1,
  },
  resultText: {
    fontSize: 16,
  },
  noResultsText: {
    flex: 1,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
