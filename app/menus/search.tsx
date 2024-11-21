import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";

import SearchBar from "@/components/inputs/SearchBar";
import CustomFlatList from "@/components/ui/lists/CustomFlatList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import ImageListItem from "@/components/ui/cards/ImageListItem";

const categoryData = [
  {
    name: "Automobiles",
    icon: { name: "car", type: "ionicon", color: "gray" },
  },
  {
    name: "Phones & Tablets",
    icon: { name: "phone-portrait", type: "ionicon", color: "gray" },
  },
  {
    name: "Electronics",
    icon: { name: "laptop", type: "font-awesome", color: "gray" },
  },
  {
    name: "Furniture & Appliances",
    icon: { name: "couch", type: "font-awesome-5", color: "gray" },
  },
  {
    name: "Real estate",
    icon: { name: "home", type: "ionicon", color: "gray" },
  },
  {
    name: "Animals & Pets",
    icon: { name: "paw", type: "font-awesome-5", color: "gray" },
  },
  { name: "Fashion", icon: { name: "shirt", type: "ionicon", color: "gray" } },
  {
    name: "Beauty & Well being",
    icon: { name: "laptop", type: "ionicon", color: "gray" },
  },
  { name: "Jobs", icon: { name: "briefcase", type: "ionicon", color: "gray" } },
  { name: "Services", icon: { name: "clipboard-list", type: "font-awesome-5", color: "gray" } },
  {
    name: "Learning",
    icon: { name: "school", type: "ionicon", color: "gray" },
  },
  {
    name: "Announcements",
    icon: { name: "calendar", type: "ionicon", color: "gray" },
  },
];

const MenuLayout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("screen");
  const [searchValue, setSearchValue] = useState([]);
  const [searchResults, setSearchResults] = useState(categoryData);
  const [loading, setLoading] = useState(false);

  const handleSelectItem = (selected: any) => {};

  // Function to handle search
  const handleSearch = async () => {
    //TODO: API request to server
  };

  const renderItem = ({ item }: any) => {
    return (
      <ImageListItem
        icon={item.icon}
        size={28}
        name={item.name}
        url={undefined}
        onPress={undefined}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: "minimal",
          header: () => (
            <View
              style={[
                styles.header,
                {
                  paddingTop: insets.top,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ padding: 10, width: 40 }}
              >
                <MaterialIcons
                  name={
                    Platform.OS === "ios" ? "arrow-back-ios-new" : "arrow-back"
                  }
                  color={"black"}
                  allowFontScaling
                  size={24}
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
              <SearchBar
                style={{ width: width - 40 }}
                placeholder="What are you looking for?"
                autoFocus
                search={searchValue}
                onChangeText={setSearchValue}
                onFilterPress={undefined}
                onPress={undefined}
                inputStyle={undefined}
              />
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Display Search Results */}
        <CustomFlatList
          data={searchResults}
          refreshing={loading}
          renderItem={renderItem}
          extraData={undefined}
          keyExtractor={undefined}
          onRefresh={undefined}
          listStyle={undefined}
        />
      </View>
    </View>
  );
};

export default MenuLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
});
