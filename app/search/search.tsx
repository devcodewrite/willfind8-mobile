import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchList from "@/components/ui/SearchList";
import { useRouteInfo } from "expo-router/build/hooks";

const SearchLayout = () => {
  const router = useRouter();
  const route = useRouteInfo();
  const { query } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchList
        initialValue={query?.toString()}
        style={styles.search}
        onPress={(query, suggestion) =>
          router.push({
            pathname: "../search/results",
            params: {
              query,
              title: suggestion?.title,
              category_id: suggestion?.category_id,
              city_id: suggestion?.city_id,
              post_id: suggestion?.id,
            },
          })
        }
        showPlaceholder
        onFilter={() =>
          router.push({
            pathname: "../search/filters",
          })
        }
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
  },
});
