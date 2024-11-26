import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import SelectInput from "@/components/inputs/SelectInput"; // Import your custom SelectInput
import { useFilterStore } from "@/hooks/store/filterStore";
import TextInput from "@/components/inputs/TextInput";
import { Button, lightColors, LinearProgress, Switch } from "@rneui/themed";
import { router, Stack } from "expo-router";
import SelectDialog from "@/components/inputs/SelectDialog";

interface DefaultFilter {
  id: string;
  name: string;
  type: "range" | "select";
  path?: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string | number }[];
  selectedValue: any; // Selected value for the filter
}

const SearchLayout = () => {
  const { width } = useWindowDimensions();
  const {
    dynamicFilters,
    isLoading,
    error,
    fetchFilters,
    defaultFilters,
    setDefaultFilters,
    updateSelectedValue,
  } = useFilterStore();

  const category = defaultFilters.find((f) => f.id === "c");
  const price: DefaultFilter = defaultFilters.find(
    (filter: DefaultFilter) => filter.id === "priceRange"
  )?.selectedValue;

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1000000,
  });

  useEffect(() => {
    if (defaultFilters.length === 0) setDefaultFilters(); // Initialize default filter
  }, []);

  useEffect(() => {
    setPriceRange({ min: price?.min || 0, max: price?.max || 1000000 });
  }, [price]);

  useEffect(() => {
    if (dynamicFilters.length === 0)
      fetchFilters(category?.selectedValue?.id || 0);
  }, [category]);

  const handleShow = () => {
    updateSelectedValue("priceRange", priceRange);
    router.back();
  };

  if (error) return <Text>Error: {error}</Text>;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Button
              onPress={() => router.dismiss()}
              type="clear"
              titleStyle={{ fontWeight: "600" }}
              icon={{ name: "close" }}
            />
          ),
          headerRight: () => (
            <Button
              onPress={handleShow}
              type="clear"
              titleStyle={{ fontWeight: "600" }}
              icon={{
                name: "filter",
                type: "font-awesome",
                color: lightColors.grey3,
              }}
              title={"Show"}
              iconRight
            />
          ),
        }}
      />
      <View style={styles.container}>
        {defaultFilters.map((filter) => (
          <View key={filter.name} style={styles.filterContainer}>
            <Text style={styles.label}>{filter.name}</Text>

            {filter.type === "select" && (
              <SelectDialog
                value={filter.selectedValue?.name}
                placeholder={"Select " + filter.name}
                label={undefined}
                onPress={() =>
                  router.push({
                    pathname: filter.path,
                    params: { parentId: category?.selectedValue?.id },
                  })
                }
              />
            )}
            {filter.type === "range" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <TextInput
                  placeholder={"Min. price"}
                  style={{ flex: 1 }}
                  value={priceRange.min}
                  onChangeText={(text) =>
                    setPriceRange({ ...priceRange, min: parseFloat(text) || 0 })
                  }
                  inputMode={"numeric"}
                />
                <TextInput
                  placeholder={"Max. price"}
                  style={{ flex: 1 }}
                  value={priceRange.max}
                  onChangeText={(text) =>
                    setPriceRange({ ...priceRange, max: parseFloat(text) || 0 })
                  }
                  inputMode={"numeric"}
                />
              </View>
            )}
          </View>
        ))}

        {dynamicFilters.map((filter) => {
          let options: any = [];
          if (filter.type === "select") {
            options = filter.options.map((option) => ({
              label: option.value,
              value: option.id,
            }));
            options.unshift({ label: "All", value: 0 });
          }
          return (
            <View key={filter.id} style={styles.filterContainer}>
              <Text style={styles.label}>{filter.name}</Text>
              {filter.type === "select" && (
                <SelectInput
                  value={filter.selectedValue}
                  onChange={(value: string) =>
                    updateSelectedValue(filter.id, value.toString())
                  }
                  placeholder={`Select ${filter.name}`}
                  options={options}
                />
              )}
              {filter.type === "text" && (
                <TextInput
                  placeholder={filter.name}
                  value={filter.selectedValue as string}
                  onChangeText={(value: string) =>
                    updateSelectedValue(filter.id, value)
                  }
                  label={filter.name}
                  inputMode={"text"}
                  errorMessage={undefined}
                />
              )}
              {filter.type === "number" && (
                <TextInput
                  placeholder={filter.name}
                  value={filter.selectedValue as string}
                  onChangeText={(value: string) =>
                    updateSelectedValue(filter.id, parseInt(value))
                  }
                  label={filter.name}
                  inputMode={"numeric"}
                  errorMessage={undefined}
                />
              )}
              {filter.type === "radio" &&
                filter.options.map((option) => (
                  <View key={option.id} style={styles.radioContainer}>
                    <Text>{option.value}</Text>
                    <Switch
                      value={filter.selectedValue === option.id}
                      onValueChange={() =>
                        updateSelectedValue(filter.id, option.id)
                      }
                    />
                  </View>
                ))}
              {filter.type === "checkbox_multiple" &&
                filter.options.map((option) => (
                  <View key={option.id} style={styles.checkboxContainer}>
                    <Text>{option.value}</Text>
                    <Switch
                      value={(filter.selectedValue as number[]).includes(
                        option.id
                      )}
                      onValueChange={(isSelected) => {
                        const updatedValue = isSelected
                          ? [...(filter.selectedValue as number[]), option.id]
                          : (filter.selectedValue as number[]).filter(
                              (v) => v !== option.id
                            );
                        updateSelectedValue(filter.id, updatedValue);
                      }}
                    />
                  </View>
                ))}
            </View>
          );
        })}

        <View style={styles.actions}>
          <Button
            radius={10}
            size="md"
            title="Reset"
            buttonStyle={{ width: 150 }}
            onPress={() => {
              setDefaultFilters();
              fetchFilters(0);
            }}
          />
          <Button
            radius={10}
            size="md"
            title={"Show"}
            type="outline"
            buttonStyle={{ width: 150 }}
            onPress={handleShow}
          />
        </View>
        {isLoading && (
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              top: 0,
            }}
          >
            <LinearProgress
              variant="indeterminate"
              color="primary"
              trackColor={lightColors.grey5}
              style={{ width: width }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f5f5", paddingBottom: 50 },
  filterContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-around",
  },
});

export default SearchLayout;
