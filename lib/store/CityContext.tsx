import React, { createContext, useReducer, useContext, ReactNode } from "react";
import api from "../apis/api";

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

// Define the City state
interface CityState {
  cities: City[];
  loading: boolean;
  error: string | null;
  selectedCity: City | null;
}

// Define context type
interface CityContextType {
  cityState: CityState;
  fetchCities: (params?: { page?: number; perPage?: number }) => Promise<void>;
  getCityById: (id: number) => Promise<City | null>;
  setSelectedCity: (city: City | null) => void;
}

// Initial state
const initialState: CityState = {
  cities: [],
  loading: false,
  error: null,
  selectedCity: null,
};

// Action types
type Action =
  | { type: "FETCH_CITIES_START" }
  | { type: "FETCH_CITIES_SUCCESS"; payload: City[] }
  | { type: "SELECT_CITY_SUCCESS"; payload: City | null }
  | { type: "FETCH_CITIES_ERROR"; payload: string }
  | { type: "ADD_CITY"; payload: City };

// Reducer function
const cityReducer = (state: CityState, action: Action): CityState => {
  switch (action.type) {
    case "FETCH_CITIES_START":
      return { ...state, loading: true, error: null };
    case "FETCH_CITIES_SUCCESS":
      return {
        ...state,
        loading: false,
        cities: mergeUniqueItems(state.cities, action.payload), // Avoid duplicates
      };
    case "FETCH_CITIES_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_CITY":
      return {
        ...state,
        cities: mergeUniqueItems(state.cities, [action.payload]), // Add a single city
      };
    case "SELECT_CITY_SUCCESS":
      return {
        ...state,
        selectedCity: action.payload, // update selected city
      };
    default:
      return state;
  }
};

// Helper function to merge unique cities
const mergeUniqueItems = <T extends { id: number }>(
  existingItems: T[],
  newItems: T[]
): T[] => {
  return [
    ...existingItems,
    ...newItems.filter(
      (newItem) =>
        !existingItems.some((existingItem) => existingItem.id === newItem.id)
    ),
  ];
};

// Create context
const CityContext = createContext<CityContextType | undefined>(undefined);

// Provider component
export const CityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cityState, dispatch] = useReducer(cityReducer, initialState);

  // Fetch cities function
  const fetchCities = async (params?: { page?: number; perPage?: number }) => {
    try {
      dispatch({ type: "FETCH_CITIES_START" });

      const response = await api.get(`/api/countries/GH/cities`, {
        params: { perPage: 270, ...params },
      });
      const { data: result } = response;
      const { success, message } = result;
      const { data, meta } = result.result;

      if (success) {
        const cities: City[] = data;
        dispatch({
          type: "FETCH_CITIES_SUCCESS",
          payload: cities,
        });
      } else {
        dispatch({ type: "FETCH_CITIES_ERROR", payload: message });
      }
    } catch (error: any) {
      console.log("FETCH_CITIES_ERROR", error);
      dispatch({
        type: "FETCH_CITIES_ERROR",
        payload: error.message || "Something went wrong while fetching cities",
      });
    }
  };

  // Get city by ID function
  const getCityById = async (id: number): Promise<City | null> => {
    const existingCity = cityState.cities.find((city) => city.id === id);
    if (existingCity) {
      return existingCity; // Return the city if it already exists in the state
    }

    try {
      // Fetch city from the API if not found in the state
      const response = await api.get(`/api/cities/${id}`);
      const { data: result } = response;
      const city: City = result.result;

      // Add the fetched city to the state
      dispatch({ type: "ADD_CITY", payload: city });
      return city;
    } catch (error: any) {
      console.error("Error fetching city by ID:", error);
      return null; // Return null if the fetch fails
    }
  };

  // Update selected city
  const setSelectedCity = (city: City | null) => {
    dispatch({ type: "SELECT_CITY_SUCCESS", payload: city });
  };

  return (
    <CityContext.Provider
      value={{ cityState, fetchCities, getCityById, setSelectedCity }}
    >
      {children}
    </CityContext.Provider>
  );
};

// Hook to use CityContext
export const useCities = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCities must be used within a CityProvider");
  }
  return context;
};
