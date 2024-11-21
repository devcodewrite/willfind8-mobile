import SearchBar from "@/components/inputs/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { Button, lightColors, Text } from "@rneui/themed";
import { ListItem, Icon } from "@rneui/themed";
import { router, Tabs } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";

export default function SavedScreen() {
  const [searchResults, setSearchResults] = useState(null);
  const [search, setSearch] = useState("");
  // Function to handle search
  const handleSearch = (query: string) => {
    if (query) {
    }
  };

  // Handler for clicking on a search item
  const handleItemPress = async (item: string) => {};

  return (
    <View style={styles.container}>
      <Tabs.Screen
        options={{
          headerTitle: "Saved Ads",
          headerRight: ({ tintColor, pressColor, pressOpacity }) => (
            <TouchableOpacity
              style={{ padding: 8 }}
              activeOpacity={pressOpacity}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={28}
                color={tintColor}
              />
            </TouchableOpacity>
          ),

          headerSearchBarOptions: {
            placeholder: "Search message",
          },
        }}
      />

      {/* Display Search Results */}
      <FlatList
        data={searchResults}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={styles.resultText}>
                  {item.title}
                </ListItem.Title>
              </ListItem.Content>
              {/* Right-side Icon */}
              <Icon name="chevron-right" size={24} color="#000" />
            </ListItem>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>No results found</Text>
        }
        ListFooterComponent={() => <View style={styles.footerSpace} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0
  },
  list: {
    margin: 12,
  },
  footerSpace: {
    padding: 20,
  },
  resultItem: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  resultText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
