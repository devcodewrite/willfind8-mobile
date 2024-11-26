import { create } from "zustand";
import api from "@/lib/apis/api";

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

// Define the CityStore interface
interface CityStore {
  cities: Record<number, City>; // Centralized object for cities
  cityIds: number[]; // Ordered list of city IDs for pagination
  currentPage: number; // Current page for pagination
  total: number; // Total cities fetched
  hasMore: boolean; // Whether there are more cities to fetch
  loading: boolean; // Loading state
  error: string | null; // Error state

  // Actions
  fetchCities: (params?: { perPage?: number }) => Promise<void>; // Fetch cities with pagination
  fetchCityById: (id: number) => Promise<void>; // Fetch a single city by ID
  processFetchedCities: (fetchedCities: City[], total: number, meta: any) => void; // Process fetched cities
}

// Create the Zustand store
const useCityStore = create<CityStore>((set, get) => ({
  cities: {},
  cityIds: [],
  currentPage: 1,
  total: 0,
  hasMore: true,
  loading: false,
  error: null,

  // Fetch cities with pagination
  fetchCities: async (params = { perPage: 50 }) => {
    const { loading, hasMore, currentPage } = get();
    if (loading || !hasMore) return;

    set({ loading: true, error: null });

    try {
      const response = await api.get("/api/countries/GH/cities", {
        params: { page: currentPage, perPage: params.perPage },
      });

      const { data: result } = response;
      const { success, message, result: fetchedData } = result;

      if (success) {
        const { data: fetchedCities, meta } = fetchedData;

        // Process fetched cities into store
        get().processFetchedCities(fetchedCities, meta.total, meta);
      } else {
        set({ error: message || "Failed to fetch cities" });
      }
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch a single city by ID
  fetchCityById: async (id: number) => {
    const { cities } = get();

    // Return from cache if already present
    if (cities[id]) return;

    set({ loading: true, error: null });

    try {
      const response = await api.get(`/api/cities/${id}`);
      const { data: result } = response;
      const { success, message, result: fetchedCity } = result;

      if (success) {
        // Add fetched city to store
        set((state) => ({
          cities: { ...state.cities, [fetchedCity.id]: fetchedCity },
        }));
      } else {
        set({ error: message || "Failed to fetch city" });
      }
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  // Process fetched cities and update the store
  processFetchedCities: (fetchedCities, total, meta) => {
    set((state) => {
      const newCities = fetchedCities.reduce((acc, city) => {
        acc[city.id] = city;
        return acc;
      }, {} as Record<number, City>);

      return {
        cities: { ...state.cities, ...newCities },
        cityIds: [
          ...state.cityIds,
          ...fetchedCities
            .map((city) => city.id)
            .filter((id) => !state.cityIds.includes(id)), // Deduplicate city IDs
        ],
        currentPage: meta.current_page + 1,
        total,
        hasMore: meta.current_page < meta.last_page,
      };
    });
  },
}));

export default useCityStore;
