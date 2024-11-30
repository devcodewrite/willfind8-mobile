import React, { useEffect, useRef, useState } from "react";
import { Button, Header, Icon, lightColors, Text } from "@rneui/themed";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Animated, View } from "react-native";

import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DescriptionCard from "@/components/ui/cards/DescriptionCard";
import ChatWithSellerCard from "@/components/ui/cards/ChatWithSellerCard";
import SellerAdsList from "@/components/ui/lists/SellerAdsList";
import FeedbackChat from "@/components/ui/lists/FeedbackChat";
import { useRouteInfo } from "expo-router/build/hooks";
import PostSlider from "@/components/ui/cards/PostSlider";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import usePostStore from "@/hooks/store/useFetchPosts";
import PostSepecCard from "@/components/ui/cards/PostSepecCard";
import LoadingBar from "@/components/ui/cards/LoadingBar";

export default function DetailsLayout() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const route = useRouteInfo();
  const { id } = route.params;
  const postId = parseInt(id?.toString());
  const {
    items,
    relatedPostIds,
    loadingStates,
    error,
    fetchRelatedPosts,
    fetchPost,
    fetchSellerPosts,
    sellerPostIds,
  } = usePostStore();
  const post = items[postId];
  const userPosts = sellerPostIds.map((id) => items[id]);
  const sepecs = useRef<
    Array<{ id: number; name: string; value: string; type: string }>
  >([]);

  useEffect(() => {
    fetchRelatedPosts(postId, {
      sort: "created_at",
      op: "similar",
      perPage: 10,
    });
  }, [fetchRelatedPosts]);

  useEffect(() => {
    fetchPost(postId, { detailed: 1 });
  }, [fetchPost]);

  useEffect(() => {
    const sps = [];
    for (const id in post?.extra?.fieldsValues) {
      const field = post.extra.fieldsValues[id];
      sps.push(field);
    }
    sepecs.current = sps;
  }, [post]);

  useEffect(() => {
    if (post.user_id)
      fetchSellerPosts(post.user_id, {
        sort: "created_at",
        op: "latest",
        perPage: 5,
      });
  }, [fetchSellerPosts]);

  const loadMore = () => {
    fetchRelatedPosts(postId, {
      sort: "created_at",
      op: "search",
      perPage: 10,
    });
  };

  // Interpolating opacity of the header based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [insets.top, insets.top + 60], // Adjust based on when you want the header to disappear
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTopY = scrollY.interpolate({
    inputRange: [insets.top, insets.top + 60], // Adjust based on when you want the header to disappear
    outputRange: [insets.top + 60, 0],
    extrapolate: "clamp",
  });

  if (!post) return null;

  return (
    <View style={{ flex: 1 }}>
      {/* Sticky Header */}
      <Animated.View
        style={{
          height: headerTopY,
          opacity: headerOpacity,
          justifyContent: "flex-end",
        }}
      >
        <Header
          leftComponent={
            <TouchableOpacity
              activeOpacity={0.65}
              onPress={() => router.back()}
              style={{ margin: 0, paddingHorizontal: 0, padding: 0 }}
            >
              <Icon name="chevron-left" color="black" size={38} />
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {post?.title}
            </Text>
          }
          rightComponent={
            <TouchableOpacity
              activeOpacity={0.65}
              onPress={() => router.back()}
              style={{ margin: 0, paddingHorizontal: 0, padding: 0 }}
            >
              <Icon name="bookmark-outline" color="black" size={32} />
            </TouchableOpacity>
          }
          centerContainerStyle={{ alignSelf: "center" }}
          backgroundColor="white"
          containerStyle={{ borderBottomWidth: 0, justifyContent: "center" }}
        />
      </Animated.View>

      <FlatList
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 20,
        }} // Adds padding to account for sticky search bar and header
        style={styles.container}
        ListHeaderComponent={
          <View style={{ gap: 10 }}>
            <PostSlider
              onImagePress={(index) => {
                router.push({
                  pathname: "../ads/fullscreen",
                  params: { imageIndex: index, postId },
                });
              }}
              {...post}
            />
            <PostSepecCard list={sepecs.current} />
            <DescriptionCard htmlContent={post?.description.toString()} />
            <ChatWithSellerCard />
            <SellerAdsList post={post} userPosts={userPosts} />
            <FeedbackChat data={[]} />
            <LoadingBar loading={loadingStates.fetchPost} />
          </View>
        }
        ListEmptyComponent={
          loadingStates.fetchRelated ? null : EmptyListingCard
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => {
          return (
            <PostCardLandscape
              size={"100%"}
              showSubCategory={false}
              {...item}
              style={{ paddingHorizontal: 10 }}
              onPress={() =>
                router.push({
                  pathname: "../ads/details",
                  params: { id: item.id },
                })
              }
            />
          );
        }}
        keyExtractor={(item: any) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        data={relatedPostIds.map((id) => items[id])}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingStates.fetchRelated ? (
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
  stickySearchArea: {
    justifyContent: "center",
    backgroundColor: lightColors.primary,
    zIndex: 1, // Ensure the search bar stays visible after header fades out
  },
});
