import { lightColors, Tab, TabView, Text } from "@rneui/themed";
import { Stack, Tabs } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ProfileListItem from "@/components/ui/cards/ProfileListItem";

export default function MessagesScreen() {
  const [index, setIndex] = useState(0);

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
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search message",
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
  }
});
