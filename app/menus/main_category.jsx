import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Text } from "@rneui/themed";
import { useRouteInfo } from "expo-router/build/hooks";

import SearchBar from "@/components/inputs/SearchBar";
import HeaderButton from "@/components/ui/HeaderButton";
import SelectableFlatList from "@/components/inputs/SelectableFlatList";

const MenuLayout = () => {
  const navigation = useNavigation();
  const router = useRouter(); 
  const route = useRouteInfo();
  const { data } = route.params ?? {};
  const { multiSelect, selected } = data ? JSON.parse(data) : {};

  const [selectedItems, setSelectedItems] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const syncManager = useRef(null);

  const handleSelectItem = (selected) => {
    setSelectedItems(selected);
  };

  const handleNext = () => {
    router.back();
  };
  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: "",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Done"}
          disabled={!selectedItems}
          onPress={handleNext}
        />
      ),
    });
  }, [navigation, selectedItems]);

  // Function to handle search
  const handleSearch = async () => {};

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search for records..."
        onSearch={handleSearch}
        style={styles.searchBar}
      />
      {/* Display Search Results */}
      <SelectableFlatList
        multiSelect={multiSelect}
        data={searchResults}
        selectedItems={selected}
        onSelectItem={handleSelectItem}
        refreshing={loading}
        renderText={(item) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default MenuLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
    marginTop: 10,
  },
});
