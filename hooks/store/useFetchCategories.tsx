import { create } from "zustand";
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

// Define Pagination interface for each parentId
interface Pagination {
  currentPage: number;
  hasMore: boolean;
  total: number;
}

// Define CategoryStore interface
interface CategoryStore {
  categories: Record<number, Category>; // Centralized storage for categories
  categoryFields: Record<number, CategoryField>; // Centralized storage for category fields
  categoryIds: number[]; // IDs of root categories only
  subCategoryIds: Record<number, number[]>; // Map parentId to subcategory IDs
  pagination: Record<number, Pagination>; // Pagination state for each parentId
  loading: boolean;
  error: string | null;

  // Actions
  fetchCategories: (params?: { parentId?: number; perPage?: number }) => Promise<void>;
  fetchCategoryFields: (categoryId: number) => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  processFetchedCategories: (
    fetchedCategories: Category[],
    total: number,
    meta: PaginationMeta,
    parentId?: number
  ) => void;
}

// Define meta for pagination response
interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

// Define CategoryField interface
interface CategoryField {
  id: number;
  belongs_to: string;
  name: string;
  type: string;
  max: number | null;
  default_value: string;
  required: number;
  use_as_filter: number;
  help: string;
  active: number;
  options: {
    id: number;
    field_id: number;
    value: string;
    parent_id: number | null;
    lft: number | null;
    rgt: number | null;
    depth: number | null;
  }[];
}

// Store Implementation
const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: {},
  categoryFields: {},
  categoryIds: [], // Only store root categories here
  subCategoryIds: {},
  pagination: {}, // Pagination data for parentId
  loading: false,
  error: null,

  // Process fetched categories and update state
  processFetchedCategories: (fetchedCategories, total, meta, parentId = 0) => {
    set((state) => {
      const newCategories = fetchedCategories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<number, Category>);

      const newSubCategoryIds = { ...state.subCategoryIds };
      if (!newSubCategoryIds[parentId]) {
        newSubCategoryIds[parentId] = [];
      }

      newSubCategoryIds[parentId] = [
        ...new Set([
          ...(state.subCategoryIds[parentId] || []),
          ...fetchedCategories.map((category) => category.id),
        ]),
      ];

      const newPagination = {
        ...state.pagination,
        [parentId]: {
          currentPage: meta.current_page,
          hasMore: meta.current_page < meta.last_page,
          total,
        },
      };

      // Update categoryIds to include only root categories (parent_id === null)
      const rootCategories = fetchedCategories.filter(
        (category) => category.parent_id === null
      );
      const newCategoryIds = [
        ...new Set([
          ...state.categoryIds,
          ...rootCategories.map((category) => category.id),
        ]),
      ];

      return {
        categories: { ...state.categories, ...newCategories },
        categoryIds: newCategoryIds, // Only root categories' ids
        subCategoryIds: newSubCategoryIds,
        pagination: newPagination,
      };
    });
  },

  // Fetch categories (with pagination)
  fetchCategories: async (params = { parentId: 0, perPage: 10 }) => {
    const { pagination, loading } = get();
    const parentId = params.parentId || 0;

    const parentPagination = pagination[parentId] || {
      currentPage: 0,
      hasMore: true,
      total: 0,
    };

    if (loading || !parentPagination.hasMore) return;

    set({ loading: true, error: null });

    try {
      const response = await api.get("/api/categories", {
        params: {
          parentId,
          page: parentPagination.currentPage + 1,
          perPage: params.perPage,
        },
      });

      const { data: result } = response;
      const { success, message, result: fetchedData } = result;

      if (success) {
        const { data: fetchedCategories, meta } = fetchedData;
        get().processFetchedCategories(fetchedCategories, meta.total, meta, parentId);
      } else {
        set({ error: message || "Failed to fetch categories" });
      }
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch fields for a specific category
  fetchCategoryFields: async (categoryId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/categories/${categoryId}/fields`);
      const { data: result } = response;
      const { success, message } = result;

      if (success) {
        set((state) => ({
          categoryFields: {
            ...state.categoryFields,
            [categoryId]: result.result,
          },
        }));
      } else {
        set({ error: message || "Failed to fetch category fields" });
      }
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch a single category by ID
  fetchCategoryById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/categories/${id}`);
      const { data: result } = response;
      const { success, message } = result;

      if (success) {
        set((state) => ({
          categories: {
            ...state.categories,
            [id]: result.result,
          },
        }));
      } else {
        set({ error: message || "Failed to fetch category" });
      }
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCategoryStore;
