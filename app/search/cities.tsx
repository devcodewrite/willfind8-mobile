import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import SelectableFlatList from "@/components/inputs/SelectableFlatList";
import { useRouteInfo } from "expo-router/build/hooks";
import SearchBar from "@/components/inputs/SearchBar";
import { Button, Chip } from "@rneui/themed";
import { router } from "expo-router";
import useCityStore from "@/hooks/store/useFetchCities";

// Define the City interface
interface City {
  id: number;
  country_code: string;
  name: string;
  latitude: string;
  longitude: string;
  subadmin1_code: string;
  subadmin2_code: string;
  population: number;
  time_zone: string;
  active: number;
  posts_count: number;
}

const SearchLayout = () => {
  const route = useRouteInfo();
  const [searchValue, setSearchValue] = useState<string>("");
  const { loading, error, cities, cityIds, fetchCities } = useCityStore();
  const [selectedCity, setSelectedCity] = useState<City>();

  useEffect(() => {
    fetchCities({ perPage: 270 });
  }, []);

  useEffect(() => {}, [searchValue]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              onPress={() => router.back()}
              type="clear"
              titleStyle={{ fontWeight: "600" }}
              title={"Filter"}
            />
          ),
        }}
      />
      <SearchBar
        placeholder="Which city ?"
        search={searchValue}
        onChangeText={setSearchValue}
        onFilterPress={undefined}
        onPress={undefined}
        inputStyle={undefined}
        style={undefined}
      />
      <SelectableFlatList
        ListHeaderComponent={
          <View style={{ flex: 1 }}>
            {selectedCity ? (
              <Chip
                containerStyle={{ marginBottom: 8, width: 150 }}
                type="outline"
                title={selectedCity?.name}
              />
            ) : null}
          </View>
        }
        placeholder={"City list here"}
        data={cityIds.map((id) => cities[id])}
        selectedItems={selectedCity ? [selectedCity.id] : []}
        onSelectItem={async (item: number[]) => {
          if (item.length > 0) setSelectedCity(cities[item[0]]);
          else setSelectedCity(undefined);
        }}
        renderText={undefined}
        onRefresh={undefined}
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
  loader: {
    padding: 20,
    paddingVertical: 30,
  },
});
