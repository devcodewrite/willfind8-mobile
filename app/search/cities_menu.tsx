import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import SelectableFlatList from "@/components/inputs/SelectableFlatList";
import { useRouteInfo } from "expo-router/build/hooks";
import SearchBar from "@/components/inputs/SearchBar";
import { Button, Chip, lightColors } from "@rneui/themed";
import { router } from "expo-router";
import useCityStore from "@/hooks/store/useFetchCities";
import { useFilterStore } from "@/hooks/store/filterStore";

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
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, cities, cityIds, fetchCities } = useCityStore();
  const { defaultFilters, updateSelectedValue } = useFilterStore();
  const initialValues = cityIds.map((id) => cities[id]);
  const [cityResults, setCityResults] = useState(initialValues);
  const selectedCity = defaultFilters.find(
    (filter) => filter.id === "l"
  )?.selectedValue;

  useEffect(() => {
    fetchCities({ perPage: 270 }).finally(() => setRefreshing(false));
  }, [fetchCities]);

  useEffect(() => {
    setCityResults(
      initialValues.filter((city) =>
        city.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
      )
    );
  }, [searchValue, cities]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              onPress={() => router.back()}
              type="clear"
              titleStyle={{ fontWeight: "600" }}
              title={"Done"}
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
                icon={{
                  name: "close",
                  color: lightColors.secondary,
                  onPress: () => updateSelectedValue("l", null),
                }}
                iconRight
              />
            ) : null}
          </View>
        }
        placeholder={"City list here"}
        data={cityResults}
        selectedItems={selectedCity ? [selectedCity.id] : []}
        onSelectItem={async (item: number[]) => {
          if (item.length > 0) updateSelectedValue("l", cities[item[0]]);
          else updateSelectedValue("l", null);
        }}
        renderText={undefined}
        onRefresh={() => {
          setRefreshing(true);
          fetchCities({ perPage: 270 });
        }}
        refreshing={refreshing}
        loading={loading}
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
