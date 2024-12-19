import { useEffect } from "react";
import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import ProfileHeader from "@/components/ui/ProfileHeader";
import usePostStore from "@/hooks/store/useFetchPosts";
import { router, Stack } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Button, lightColors } from "@rneui/themed";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";

export default function SellerScreen() {
  const route = useRouteInfo();
  const { user, isAuthenticated } = useAuth();
  const { showLoginModal } = useAuthModal();
  const postId = parseInt(route.params?.id?.toString());
  const {
    items,
    error,
    sellerPostIds,
    loadingStates,
    fetchSellerPosts,
    resetSellerPosts,
    addToSavedPost,
  } = usePostStore();

  const posts = sellerPostIds.map((id) => items[id]);
  const post = items[postId];

  const handleToggleSaved = (postId: number) => {
    if (isAuthenticated) addToSavedPost(postId, user);
    else showLoginModal();
  };

  useEffect(() => {
    resetSellerPosts();
  }, [route, resetSellerPosts]);

  const loadMore = () => {
    fetchSellerPosts(post.user_id || 0, {
      sort: "created_at",
      op: "latest",
      perPage: 10,
    });
  };

  if (!post.user)
    return (
      <View style={{ flex: 1 }}>
        <LoadingBar />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerTitle: post.user.name, headerShown: true }}
      />
      <FlatList
        ListHeaderComponent={
          <ProfileHeader
            style={{ backgroundColor: lightColors.white, marginBottom: 10 }}
            name={post.user.name}
            email={post.user.email || ""}
            avatarUrl={post.user.photo_url}
            joined={post.user.created_at_formatted}
            location={post.city.name}
            phone={post.phone}
          />
        }
        renderItem={({ item }) => (
          <PostCardLandscape
            size={"100%"}
            style={{ paddingHorizontal: 10 }}
            onPress={() =>
              router.push({
                pathname: "../ads/details",
                params: { id: item.id },
              })
            }
            post={item}
            toggleSaved={handleToggleSaved}
          />
        )}
        data={posts}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingStates.fetchSeller ? (
            <View style={{ paddingVertical: 30 }}>
              <ActivityIndicator size="small" />
            </View>
          ) : error ? (
            <View style={{ paddingVertical: 50 }}>
              <Button
                onPress={() => {
                  loadMore();
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
