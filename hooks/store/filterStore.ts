import { create } from "zustand";
import api from "@/lib/apis/api";
import useCategoryStore from "./useFetchCategories";
import useCityStore from "./useFetchCities";

interface FilterOption {
  id: number | string;
  field_id: number;
  value: string;
  parent_id: number | null;
}

interface DynamicFilter {
  id: number;
  name: string;
  type: string;
  options: FilterOption[];
  selectedValue: string | number[] | number | null; // Value selected by the user
}

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

interface FilterState {
  dynamicFilters: DynamicFilter[];
  defaultFilters: DefaultFilter[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setDynamicFilters: (filters: DynamicFilter[]) => void;
  setDefaultFilters: () => void;
  updateSelectedValue: (
    fieldId: number | string,
    value: string | string[] | number | any | null
  ) => void;
  fetchFilters: (categoryId: number) => Promise<void>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  dynamicFilters: [],
  defaultFilters: [],
  isLoading: false,
  error: null,

  // Set the dynamic filters state
  setDynamicFilters: (filters) => set({ dynamicFilters: filters }),

  // Set default filters (Price Range, Categories, Cities)
  setDefaultFilters: () => {
    const { categories: catResults, categoryIds } = useCategoryStore.getState();
    const categories = categoryIds.map((id) => catResults[id]);
    const { cities: cityResults, cityIds } = useCityStore.getState();
    const cities = cityIds.map((id) => cityResults[id]);

    const defaultFilters: DefaultFilter[] = [
      {
        id: "c",
        name: "Categories",
        type: "select",
        path: "../search/categories_menu",
        options: categories.map((cat: any) => ({
          label: cat.name,
          value: cat.id,
        })),
        selectedValue: 0, // Default selected categories
      },
      {
        id: "l",
        name: "Cities",
        type: "select",
        path: "../search/cities_menu",
        options: cities.map((city: any) => ({
          label: city.name,
          value: city.id,
        })),
        selectedValue: null, // Default selected cities
      },
      {
        id: "priceRange",
        name: "Price Range",
        type: "range",
        min: 0,
        max: 1000000,
        selectedValue: { min: 0, max: 1000000 }, // Default range
      },
    ];

    set({ defaultFilters });
  },

  // Update a specific filter's selected value
  updateSelectedValue: (fieldId, value) => {
    set((state) => {
      const isDynamic = typeof fieldId === "number";
      return isDynamic
        ? {
            dynamicFilters: state.dynamicFilters.map((filter: DynamicFilter) =>
              filter.id === fieldId
                ? { ...filter, selectedValue: value }
                : filter
            ),
          }
        : {
            defaultFilters: state.defaultFilters.map((filter) =>
              filter.id === fieldId
                ? { ...filter, selectedValue: value }
                : filter
            ),
          };
    });
  },

  // Fetch filters from the server
  fetchFilters: async (id?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/categories/${id}/fields`); // Replace with your API endpoint
      const usables = response.data.result.filter(
        (filter: any) => filter.use_as_filter
      );

      const filters = usables.map((filter: any) => ({
        id: filter.id,
        name: filter.name,
        type: filter.type,
        options: filter.options || [],
        selectedValue: filter.type === "checkbox_multiple" ? [] : null, // Default values
      }));
      set({ dynamicFilters: filters, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch filters",
        isLoading: false,
      });
    }
  },
}));
