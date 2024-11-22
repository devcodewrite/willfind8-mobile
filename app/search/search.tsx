import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchList from "@/components/ui/SearchList";

const SearchLayout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchList
        style={styles.search}
        onPress={(query, suggestion) =>
          router.push({
            pathname: "/search/results",
            params: {
              query,
              title: suggestion?.title,
              category_id: suggestion?.category_id,
              city_id: suggestion?.city_id,
              post_id:suggestion?.id
            },
          })
        }
        showPlaceholder
      />

   
    </View>
  );
};

export default SearchLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    flex: 1,
  }
});
