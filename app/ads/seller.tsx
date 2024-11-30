import { lightColors, Tab, TabView, Text } from "@rneui/themed";
import { Tabs } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ProfileListItem from "@/components/ui/cards/ProfileListItem";

const postData = [
  {
    id: "1",
    imageUrl: "https://example.com/car.jpg",
    images: [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/44.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
    ],
    title: "Toyota Camry 2015 4L Engine",
    price: "GH₵35,000",
    category: "AutoMobiles",
    subCategory: "Cars",
    location: "Accra",
    isVerified: true,
  },
  {
    id: "2",
    imageUrl: "https://example.com/phone.jpg",
    images: [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/44.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
    ],
    title: "iPhone 12 Pro Max",
    price: "GH₵7,500",
    category: "Electronics",
    subCategory: "Mobile Phone & Accessories",
    location: "Kumasi",
    isVerified: false,
  },
  {
    id: "3",
    imageUrl: "https://example.com/phone.jpg",
    images: [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/44.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
    ],
    title: "iPhone 12 Pro Max",
    price: "GH₵7,500",
    category: "Electronics",
    subCategory: "Mobile Phone & Accessories",
    location: "Kumasi",
    isVerified: false,
  },
  {
    id: "4",
    imageUrl: "https://example.com/car.jpg",
    images: [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/44.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
    ],
    title: "Toyota Camry 2015",
    price: "GH₵35,000",
    category: "AutoMobiles",
    subCategory: "Cars",
    location: "Accra",
    isVerified: true,
  },
  {
    id: "5",
    imageUrl: "https://example.com/car.jpg",
    images: [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/44.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
    ],
    title: "Toyota Camry 2017",
    price: "GH₵36,000",
    category: "AutoMobiles",
    subCategory: "Cars",
    location: "Accra",
    isVerified: true,
  },
  // Add more posts as needed
];

export default function SellerScreen() {
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
      <Tabs.Screen
        options={{
          headerTitle: "Messages",
          headerSearchBarOptions: {
            placeholder: "Search message",
          },
        }}
      />

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
          title="All Inbox"
          titleStyle={{ fontSize: 12, color: "black" }}
          icon={{
            name: "mail-open",
            type: "ionicon",
            color: lightColors.primary,
          }}
        />
        <Tab.Item
          title="Unread"
          titleStyle={{ fontSize: 12, color: "black" }}
          icon={{ name: "mail", type: "ionicon", color: lightColors.primary }}
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
