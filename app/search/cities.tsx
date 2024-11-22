import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCities } from "@/lib/store/CityContext";
import SelectableFlatList from "@/components/inputs/SelectableFlatList";
import { useRouteInfo, useSearchParams } from "expo-router/build/hooks";
import SearchBar from "@/components/inputs/SearchBar";
import { Button, Chip } from "@rneui/themed";
import { router } from "expo-router";

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
  const insets = useSafeAreaInsets();
  const { cityState, fetchCities, getCityById, setSelectedCity } = useCities();
  const { loading, cities, selectedCity, error } = cityState;
  const [filteredCities, setFilteredCities] = useState<Array<City>>(cities);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    setFilteredCities(
      cities.filter((city) =>
        city.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
      )
    );
  }, [searchValue]);

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
        data={filteredCities}
        selectedItems={[selectedCity?.id]}
        onSelectItem={async (item: any) => {
          if (item.length > 0) setSelectedCity(await getCityById(item[0]));
          else setSelectedCity(null);
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
