import { create } from "zustand";
import api from "@/lib/apis/api";

interface Params {
  page?: number;
  op?: "search" | "preminum" | "latest" | "similar";
  postId?: number;
  distance?: number;
  belongLoggedUser?: boolean;
  pendingApproval?: boolean;
  archived?: boolean;
  embed?: string;
  sort?: string | "created_at" | "-created_at";
  perPage?: number;
  c?: number | string;
  cf?: Map<number, number | string>;
  q?: string;
  l?: number | string;
}

interface Picture {
  id: number;
  post_id: number;
  filename: string;
  url: {
    full: string;
    small: string;
    medium: string;
    big: string;
  };
}
// Define post interface
interface Post {
  id: number;
  title: string;
  description: string;
  price: string;
  contact_name: string;
  phone: string;
  pictures?: Array<Picture>;
  count_pictures?: number;
  user_photo_url: string;
  negotiable: number | null;
  category: {
    id: number;
    name: string;
    slug: string;
    parent: {
      id: number;
      name: string;
      picture_url: string;
    };
  };
  city: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
  };
  price_formatted: string;
  created_at_formatted: string;
  picture: Picture;
  ads_count?: number;
}

// Define the Zustand store state and actions
interface PostStore {
  items: Record<number, Post>; // Centralized storage of posts
  latestPostIds: number[];
  searchSuggestionIds: number[];
  searchResultIds: number[];
  relatedPostIds: number[];
  sellerPostIds: number[];

  pagination: {
    latest: { page: number; hasMore: boolean };
    search: { page: number; hasMore: boolean };
    related: { page: number; hasMore: boolean };
    seller: { page: number; hasMore: boolean };
  };

  loading: boolean;
  error: string | null;

  // Actions
  fetchLatestPosts: (params?: Params) => Promise<void>;
  fetchSearchSuggestions: (params?: Params) => Promise<void>;
  fetchSearchResults: (params?: Params) => Promise<void>;
  resetSearchResults: () => void;
  fetchRelatedPosts: (postId: number, params?: Params) => Promise<void>;
  fetchSellerPosts: (sellerId: number, params?: Params) => Promise<void>;
}

// Create Zustand store
const usePostStore = create<
  PostStore & {
    abortController: AbortController | null;
    abortRequests: () => void;
  }
>((set, get) => ({
  items: {},
  latestPostIds: [],
  searchSuggestionIds: [],
  searchResultIds: [],
  relatedPostIds: [],
  sellerPostIds: [],

  pagination: {
    latest: { page: 1, hasMore: true },
    search: { page: 1, hasMore: true },
    related: { page: 1, hasMore: true },
    seller: { page: 1, hasMore: true },
  },

  loading: false,
  error: null,
  abortController: null, // State to manage AbortController

  // Abort any ongoing requests
  abortRequests: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ abortController: null, loading: false }); // Clear the controller after aborting
    }
  },

  // Helper function to process fetched posts
  processFetchedPosts: (newPosts: Post[]) => {
    const { items } = get();
    const updatedItems = { ...items };

    newPosts.forEach((post) => {
      updatedItems[post.id] = post;
    });

    set({ items: updatedItems });
  },

  // Fetch latest posts
  fetchLatestPosts: async (params?: Params) => {
    const abortController = new AbortController();
    set({ abortController, loading: true, error: null });

    try {
      const { pagination } = get();
      const { page, hasMore } = pagination.latest;

      if (!hasMore) return;

      const response = await api.get("/api/posts", {
        params: { op: "latest", page, ...params },
        signal: abortController.signal, // Pass the AbortController signal
      });
      const { data: result } = response;
      const { success, message, result: data } = result;

      if (success) {
        const { data: newPosts, meta } = data;

        get().processFetchedPosts(newPosts);

        set((state) => ({
          latestPostIds: Array.from(
            new Set([
              ...state.latestPostIds,
              ...newPosts.map((post: any) => post.id),
            ])
          ),
          pagination: {
            ...state.pagination,
            latest: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          loading: false,
        }));
      } else {
        set({
          error: message || "Failed to fetch latest posts",
          loading: false,
        });
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        set({ error: error.message || "Something went wrong", loading: false });
      }
    } finally {
      set({ abortController: null }); // Clear the AbortController after the request
    }
  },

  // Fetch search suggestions
  fetchSearchSuggestions: async (params?: Params) => {
    const abortController = new AbortController();
    set({ abortController, loading: true, error: null });

    try {
      const response = await api.get("/api/posts", {
        params: { op: "search", ...params },
        signal: abortController.signal, // Pass the AbortController signal
      });
      const { data: result } = response;
      const { success, message, result: data } = result;

      if (success) {
        const { data: newPosts } = data;

        get().processFetchedPosts(newPosts);

        set((state) => ({
          searchSuggestionIds: Array.from(
            new Set(newPosts.map((post: any) => post.id))
          ),
          loading: false,
        }));
      } else {
        set({
          error: message || "Failed to fetch search suggestions",
          loading: false,
        });
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        set({ error: error.message || "Something went wrong", loading: false });
      }
    } finally {
      set({ abortController: null });
    }
  },

  // Fetch search results
  fetchSearchResults: async (params: any) => {
    const { pagination } = get();
    const { page, hasMore } = pagination.search;

    if (!hasMore) return;

    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/posts", {
        params: { page, ...params },
      });
      const { data: result } = response;
      const { success, message, result: data } = result;

      if (success) {
        const { data: newPosts, meta } = data;

        // Process and store posts in `items`
        get().processFetchedPosts(newPosts);

        // Update searchResultIds and pagination
        set((state) => ({
          searchResultIds: Array.from(
            new Set([
              ...state.searchResultIds,
              ...newPosts.map((post: any) => post.id),
            ])
          ),
          pagination: {
            ...state.pagination,
            search: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          loading: false,
        }));
      } else {
        set({
          error: message || "Failed to fetch search results",
          loading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },
  resetSearchResults: () => {
    set({ searchResultIds: [] }); // Reset searchResultIds to an empty array
  },
  // Fetch related posts
  fetchRelatedPosts: async (postId: number, params: any) => {
    const { pagination } = get();
    const { page, hasMore } = pagination.latest;

    if (!hasMore) return; // Stop if no more pages

    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/posts", {
        params: { postId, op: "similar", page, ...params },
      });
      const { data: result } = response;
      const { success, message, result: data } = result;

      if (success) {
        const { data: newPosts, meta } = data;

        // Process and store posts in `items`
        get().processFetchedPosts(newPosts);

        // Update relatedPostIds and pagination
        set((state) => ({
          relatedPostIds: Array.from(
            new Set([
              ...state.relatedPostIds,
              ...newPosts.map((post: any) => post.id),
            ])
          ),
          pagination: {
            ...state.pagination,
            latest: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          loading: false,
        }));
      } else {
        set({
          error: message || "Failed to fetch latest posts",
          loading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },

  // Fetch seller posts
  fetchSellerPosts: async (sellerId: number, params: any) => {
    const { pagination } = get();
    const { page, hasMore } = pagination.latest;

    if (!hasMore) return; // Stop if no more pages

    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/posts", {
        params: { op: "search", page, ...params },
      });
      const { data: result } = response;
      const { success, message, result: data } = result;

      if (success) {
        const { data: newPosts, meta } = data;

        // Process and store posts in `items`
        get().processFetchedPosts(newPosts);

        // Update latestPostIds and pagination
        set((state) => ({
          sellerPostIds: Array.from(
            new Set([
              ...state.latestPostIds,
              ...newPosts.map((post: any) => post.id),
            ])
          ),
          pagination: {
            ...state.pagination,
            latest: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          loading: false,
        }));
      } else {
        set({
          error: message || "Failed to fetch latest posts",
          loading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },
}));

export default usePostStore;
