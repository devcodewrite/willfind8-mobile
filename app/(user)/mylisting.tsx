import { lightColors, Tab, TabView, Text } from "@rneui/themed";
import { Stack } from "expo-router";
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
          title="All Listing"
          titleStyle={{ fontSize: 12, color: "black" }}
        />
        <Tab.Item
          title="Pending Listing"
          titleStyle={{ fontSize: 12, color: "black" }}
        />
         <Tab.Item
          title="Active Listing"
          titleStyle={{ fontSize: 12, color: "black" }}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ width: "100%" }}>
          <FlatList
            data={searchResults}
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ProfileListItem {...item} />}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No results found</Text>
            }
            ListFooterComponent={() => <View style={styles.footerSpace} />}
          />
        </TabView.Item>

        <TabView.Item style={{ width: "100%" }}>
          <FlatList
            data={searchResults}
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ProfileListItem {...item} />}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No results found</Text>
            }
            ListFooterComponent={() => <View style={styles.footerSpace} />}
          />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <FlatList
            data={searchResults}
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ProfileListItem {...item} />}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No results found</Text>
            }
            ListFooterComponent={() => <View style={styles.footerSpace} />}
          />
        </TabView.Item>
      </TabView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
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
