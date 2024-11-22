import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
  Platform,
  GestureResponderEvent,
} from "react-native";
import { lightColors, SearchBar } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/lib/apis/api";
import { TextInputFocusEventData } from "react-native";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { EmptyListingCard } from "./cards/EmptyListingCard";

// Define the types for the server response
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

const CACHE_KEY = "SearchSuggestionsCache";

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
    op?: "search" | "premium" | "latest" | "similar";
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  // Cache stored in memory and AsyncStorage
  const cacheRef = useRef<Record<string, Suggestion[]>>({});

  useEffect(() => {
    // Load cache from AsyncStorage on component mount
    const loadCache = async () => {
      try {
        const storedCache = await AsyncStorage.getItem(CACHE_KEY);
        if (storedCache) {
          cacheRef.current = JSON.parse(storedCache);
        }
      } catch (error) {
        console.error("Failed to load cache from AsyncStorage:", error);
      }
    };

    loadCache();
  }, []);

  const saveCacheToStorage = async () => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheRef.current));
    } catch (error) {
      console.error("Failed to save cache to AsyncStorage:", error);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (cacheRef.current[query]) {
      // If query is cached, use it
      setSuggestions(cacheRef.current[query]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/api/posts?q=${query}`, {
        params: {
          perPage: 5,
          op: "search",
          sort: "created_at",
          parentId: 0,
          ...params,
        },
      });
      const { data: result } = response;
      const { data } = result.result;

      // Store in cache and persist to AsyncStorage
      cacheRef.current[query] = data || [];
      saveCacheToStorage();
      setSuggestions(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
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
        onPress={() => onPress && onPress(item.title, item)}
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

      {suggestions.length > 0 ? (
        <FlatList
          style={styles.list}
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSuggestion}
          showsVerticalScrollIndicator={false}
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
