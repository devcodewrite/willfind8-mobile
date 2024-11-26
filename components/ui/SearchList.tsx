import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import { lightColors, SearchBar } from "@rneui/themed";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { EmptyListingCard } from "./cards/EmptyListingCard";
import usePostStore from "@/hooks/store/useFetchPosts"; // Zustand store import
import { StyleProp } from "react-native";

interface Category {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface Suggestion {
  id: number;
  title: string;
  category_id: number;
  city_id: number;
  category: Category;
  city: City;
}

const SearchList = ({
  ref,
  style,
  params,
  autoFocus,
  onPress,
  onFilter,
  initialValue,
  showPlaceholder,
}: {
  ref?: any;
  style?: StyleProp<ViewStyle>;
  params?: {
    page?: number;
    op?: "search" | "preminum" | "latest" | "similar";
    postId?: number;
    distance?: number;
    belongLoggedUser?: boolean;
    pendingApproval?: boolean;
    archived?: boolean;
    embed?: string;
    sort?: string | "created_at" | "-created_at";
    perPage?: number;
    c?: number;
    cf?: Map<number, number>;
  };
  autoFocus?: boolean;
  onPress?: (query: string, suggestion?: Suggestion) => void;
  onFilter?: (e: GestureResponderEvent) => void;
  initialValue?: string;
  showPlaceholder?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialValue || "");
  const [focused, setFocused] = useState<boolean>(false);
  const [hideResults, setHideResults] = useState(true);
  // Zustand store usage
  const {
    loading,
    error,
    items,
    searchSuggestionIds,
    abortRequests,
    fetchSearchSuggestions,
  } = usePostStore();
  const initialResults = searchSuggestionIds.map((id) => items[id]);
  const results = useRef(initialResults);

  useEffect(() => {
    if (searchQuery.length > 1) {
      fetchSearchSuggestions({
        ...params,
        q: searchQuery,
        perPage: 10,
        op: "search",
      });
    } else {
      // Optionally handle case when query is empty or too short
      abortRequests();
    }
  }, [searchQuery, initialValue, params]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      results.current = initialResults.filter((post) =>
        post.title.toLowerCase().search(searchQuery.toLowerCase())
      );
    } else {
      // Optionally handle case when query is empty or too short
      results.current = [];
    }
  }, [searchQuery, params, initialValue, initialResults]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const highlightText = (text: string, query: string): JSX.Element[] => {
    if (!query) return [<Text key="no-highlight">{text}</Text>];
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={`highlight-${index}`} style={styles.highlight}>
          {part}
        </Text>
      ) : (
        <Text key={`normal-${index}`}>{part}</Text>
      )
    );
  };

  const renderSuggestion = ({ item }: { item: Suggestion }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          abortRequests();
          setSearchQuery(item.title);
          if (onPress) onPress(item.title, item);
        }}
        style={styles.suggestion}
      >
        <Text>
          {highlightText(item.title, searchQuery)}{" "}
          <Text style={styles.bold}>in </Text>
          <Text style={styles.bold}>{item.category.name}</Text>
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.navContainer}>
        {focused ? null : (
          <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} />
          </TouchableOpacity>
        )}
        <SearchBar
          ref={ref}
          placeholder="Search here..."
          value={searchQuery}
          onChangeText={handleSearch}
          platform={Platform.OS === "ios" ? "ios" : "android"}
          showLoading={loading}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.inputContainer}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          showCancel
          searchIcon={{ name: "search" }}
          clearIcon={{ name: "close" }}
          returnKeyType="search"
          onSubmitEditing={() => onPress && onPress(searchQuery)}
        />
        {focused ? null : (
          <TouchableOpacity style={styles.btnFilter} onPress={onFilter}>
            <Feather name="filter" size={24} color={lightColors.grey2} />
          </TouchableOpacity>
        )}
      </View>

      {results.current.length > 0 ? (
        <FlatList<any>
          style={styles.list}
          data={results.current}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSuggestion}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyListingCard placeholder="No result found" />
          }
        />
      ) : showPlaceholder ? (
        <EmptyListingCard placeholder="Search result here" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  list: {
    zIndex: 100,
    backgroundColor: "white",
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    height: 55,
    justifyContent: "center",
  },
  highlight: {
    color: lightColors.primary,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: lightColors.grey5,
    borderRadius: 10,
    height: 40,
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
  btnCancel: {
    padding: 4,
    marginEnd: 8,
    height: 60,
    width: 60,
    justifyContent: "center",
    position: "absolute",
    end: 0,
  },
  textCancel: {
    color: lightColors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default SearchList;
