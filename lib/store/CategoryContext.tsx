import React, { createContext, useReducer, useContext, ReactNode } from "react";
import api from "@/lib/apis/api";

// Define Category interface
interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string;
  hide_description: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  picture: string;
  icon_class: string;
  active: number;
  lft: number;
  rgt: number;
  depth: number;
  type: string;
  is_for_permanent: number;
  parent: Category | null;
  picture_url: string;
}

// Define Category State
interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  lastFetchFailed: boolean; // Track if the last fetch failed
}

// Define context type
interface CategoryContextType {
  categoryState: CategoryState;
  fetchCategories: (params?: {
    sort?: string;
    perPage?: number;
    parentId?: number;
    nestedIncluded?: 0 | 1;
    embed?: string;
    page?: number;
  }) => Promise<void>;
  getCategoryById: (id: number) => Category | undefined; // Selector function
  retryFetch: () => Promise<void>; // Expose a retry function
}

// Initial state
const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  lastFetchFailed: false, // Initialize as false
};

// Action types
type Action =
  | { type: "FETCH_CATEGORIES_START" }
  | {
      type: "FETCH_CATEGORIES_SUCCESS";
      payload: { categories: Category[]; hasMore: boolean };
    }
  | { type: "FETCH_CATEGORIES_ERROR"; payload: string }
  | { type: "RESET_FETCH_FAILURE" };

// Reducer function
const categoryReducer = (
  state: CategoryState,
  action: Action
): CategoryState => {
  console.log("Dispatching action:", { type: action.type });

  switch (action.type) {
    case "FETCH_CATEGORIES_START":
      return { ...state, loading: true, error: null, lastFetchFailed: false };
    case "FETCH_CATEGORIES_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: [...state.categories, ...action.payload.categories],
        page: state.page + 1, // Increment page on success
        hasMore: action.payload.hasMore,
        lastFetchFailed: false,
      };
    case "FETCH_CATEGORIES_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        lastFetchFailed: true,
      };
    case "RESET_FETCH_FAILURE":
      return { ...state, lastFetchFailed: false };
    default:
      return state;
  }
};

// Create context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// Provider component
export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categoryState, dispatch] = useReducer(
    categoryReducer,
    initialCategoryState
  );

  // Fetch categories function
  const fetchCategories = async (params?: {
    sort?: string;
    perPage?: number;
    parentId?: number;
    nestedIncluded?: 0 | 1;
    embed?: string;
    page?: number;
  }) => {
    const { page, loading, hasMore } = categoryState;

    if (loading || !hasMore) {
      console.log("Skipping fetch due to ongoing request or list ended.");
      return;
    }

    try {
      console.log("Fetching categories with params:", { ...params, page });
      dispatch({ type: "FETCH_CATEGORIES_START" });

      const response = await api.get("/api/categories", {
        params: {
          ...params,
          page,
        },
      });

      const { data: result } = response;
      const { success, message } = result;
      const { data, meta } = result.result;

      if (success) {
        const categories: Category[] = data;
        const hasMore = meta.current_page < meta.last_page;
        dispatch({
          type: "FETCH_CATEGORIES_SUCCESS",
          payload: { categories, hasMore },
        });
      } else {
        console.error("Error from server fetching categories:", message);
        dispatch({
          type: "FETCH_CATEGORIES_ERROR",
          payload: message,
        });
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      dispatch({
        type: "FETCH_CATEGORIES_ERROR",
        payload: error.message || "Something went wrong",
      });
    }
  };

  // Retry fetch function
  const retryFetch = async () => {
    dispatch({ type: "RESET_FETCH_FAILURE" }); // Reset the failure flag
    await fetchCategories(); // Retry fetching the categories
  };

  // Selector function to retrieve a category by ID
  const getCategoryById = (id: number): Category | undefined => {
    return categoryState.categories.find((category) => category.id === id);
  };

  return (
    <CategoryContext.Provider
      value={{ categoryState, fetchCategories, retryFetch, getCategoryById }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Hook to use context
export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
