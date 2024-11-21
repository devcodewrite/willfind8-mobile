import React from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import PostCard from "../cards/PostCard";
import { View } from "react-native";
import { Text } from "@rneui/themed";

export default function PostList({
  style = {},
  heading = "",
  data,
  numColumns = 2,
}) {
  const { width } = useWindowDimensions();

  const handleRenderItem = ({ item }) => (
    <PostCard size={"50%"} {...item} />
  );

  return (
    <FlatList
      ListHeaderComponent={
        heading ? (
          <View style={{ padding: 10 }}>
            <Text>{heading}</Text>
          </View>
        ) : null
      }
      style={style}
      data={data}
      numColumns={numColumns}
      renderItem={handleRenderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    gap: 4,
    marginHorizontal: 10,
  },
});
