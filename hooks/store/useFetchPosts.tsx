import { create } from "zustand";
import api from "@/lib/apis/api";
import { User } from "./useFetchUsers";

interface Params {
  page?: number;
  op?: "search" | "preminum" | "latest" | "similar";
  postId?: number;
  distance?: number;
  belongLoggedUser?: boolean;
  pendingApproval?: boolean;
  archived?: boolean;
  detailed?: number;
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

interface Extra {
  fieldsValues: {
    [id: string]: { id: number; name: string; type: string; value: string };
  };
}

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
  user: User | null;
  user_id: number | null;
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
  extra: Extra | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  extra: any;
  result: {
    data: T;
    meta?: {
      current_page: number;
      last_page: number;
    };
  };
}

interface PostStore {
  items: Record<number, Post>;
  latestPostIds: number[];
  searchSuggestionIds: number[];
  searchResultIds: number[];
  relatedPostIds: number[];
  sellerPostIds: number[];
  postDetailsId: number | null;
  pagination: {
    latest: { page: number; hasMore: boolean };
    search: { page: number; hasMore: boolean };
    related: { page: number; hasMore: boolean };
    seller: { page: number; hasMore: boolean };
  };

  loadingStates: {
    fetchLatest: boolean;
    fetchSuggestions: boolean;
    fetchResults: boolean;
    fetchRelated: boolean;
    fetchSeller: boolean;
    fetchPost: boolean;
  };

  error: string | null;

  fetchLatestPosts: (params?: Params) => Promise<void>;
  fetchSearchSuggestions: (params?: Params) => Promise<void>;
  fetchSearchResults: (params: Params) => Promise<void>;
  resetSearchResults: () => void;
  fetchRelatedPosts: (postId: number, params?: Params) => Promise<void>;
  fetchSellerPosts: (sellerId: number, params?: Params) => Promise<void>;
  fetchPost: (postId: number, params?: Params) => Promise<void>;
}
const usePostStore = create<
  PostStore & {
    abortController: AbortController | null;
    abortRequests: () => void;
  }
>((set, get: any) => ({
  // Initial state
  items: {},
  latestPostIds: [],
  searchSuggestionIds: [],
  searchResultIds: [],
  relatedPostIds: [],
  sellerPostIds: [],
  postDetailsId: null,
  pagination: {
    latest: { page: 1, hasMore: true },
    search: { page: 1, hasMore: true },
    related: { page: 1, hasMore: true },
    seller: { page: 1, hasMore: true },
  },

  loadingStates: {
    fetchLatest: false,
    fetchSuggestions: false,
    fetchResults: false,
    fetchRelated: false,
    fetchSeller: false,
    fetchPost: false,
  },

  error: null,
  abortController: null,

  abortRequests: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ abortController: null });
    }
  },

  processFetchedPosts: (newPosts: Post[]) => {
    const { items } = get();
    const updatedItems = { ...items };

    newPosts.forEach((post) => {
      // Ensure the post structure includes extra as an empty array if not already present
      if (!updatedItems[post.id]) {
        updatedItems[post.id] = { ...post, extra: [] };
      }
    });

    set({ items: updatedItems });
  },

  // Fetch latest posts
  fetchLatestPosts: async (params?: Params) => {
    const abortController = new AbortController();
    set({
      abortController,
      loadingStates: { ...get().loadingStates, fetchLatest: true },
      error: null,
    });

    try {
      const { pagination } = get();
      const { page, hasMore } = pagination.latest;

      if (!hasMore) return;

      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: { op: "latest", page, ...params },
        signal: abortController.signal,
      });

      const { success, message, result } = response.data;

      if (success) {
        const { data: newPosts, meta } = result;
        get().processFetchedPosts(newPosts);

        set((state) => ({
          latestPostIds: Array.from(
            new Set([
              ...state.latestPostIds,
              ...newPosts.map((post) => post.id),
            ])
          ),
          pagination: meta && {
            ...state.pagination,
            latest: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          loadingStates: { ...state.loadingStates, fetchLatest: false },
        }));
      } else {
        set({
          error: message || "Failed to fetch latest posts",
          loadingStates: { ...get().loadingStates, fetchLatest: false },
        });
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        set({
          error: error.message || "Something went wrong",
          loadingStates: { ...get().loadingStates, fetchLatest: false },
        });
      }
    } finally {
      set({ abortController: null });
    }
  },

  // Fetch search suggestions
  fetchSearchSuggestions: async (params?: Params) => {
    set({
      loadingStates: { ...get().loadingStates, fetchSuggestions: true },
      error: null,
    });

    try {
      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: { op: "search", ...params },
      });

      const { success, message, result } = response.data;

      if (success) {
        const { data: newPosts } = result;
        get().processFetchedPosts(newPosts);

        set((state) => ({
          searchSuggestionIds: Array.from(
            new Set(newPosts.map((post) => post.id))
          ),
          loadingStates: { ...state.loadingStates, fetchSuggestions: false },
        }));
      } else {
        set({
          error: message || "Failed to fetch search suggestions",
          loadingStates: { ...get().loadingStates, fetchSuggestions: false },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: { ...get().loadingStates, fetchSuggestions: false },
      });
    }
  },

  // Fetch search results
  fetchSearchResults: async (params: Params) => {
    set({
      loadingStates: { ...get().loadingStates, fetchResults: true },
      error: null,
    });

    try {
      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: { op: "search", ...params },
      });

      const { success, message, result } = response.data;

      if (success) {
        const { data: newPosts } = result;
        get().processFetchedPosts(newPosts);

        set((state) => ({
          searchResultIds: Array.from(
            new Set([
              ...state.searchResultIds,
              ...newPosts.map((post) => post.id),
            ])
          ),
          loadingStates: { ...state.loadingStates, fetchResults: false },
        }));
      } else {
        set({
          error: message || "Failed to fetch search results",
          loadingStates: { ...get().loadingStates, fetchResults: false },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: { ...get().loadingStates, fetchResults: false },
      });
    }
  },

  // Fetch related posts
  fetchRelatedPosts: async (postId: number, params?: Params) => {
    set({
      loadingStates: { ...get().loadingStates, fetchRelated: true },
      error: null,
    });

    try {
      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: { op: "similar", postId, ...params },
      });

      const { success, message, result } = response.data;

      if (success) {
        const { data: newPosts } = result;
        get().processFetchedPosts(newPosts);

        set((state) => ({
          relatedPostIds: Array.from(
            new Set([
              ...state.relatedPostIds,
              ...newPosts.map((post) => post.id),
            ])
          ),
          loadingStates: { ...state.loadingStates, fetchRelated: false },
        }));
      } else {
        set({
          error: message || "Failed to fetch related posts",
          loadingStates: { ...get().loadingStates, fetchRelated: false },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: { ...get().loadingStates, fetchRelated: false },
      });
    }
  },

  // Fetch seller posts
  fetchSellerPosts: async (sellerId: number, params?: Params) => {
    set({
      loadingStates: { ...get().loadingStates, fetchSeller: true },
      error: null,
    });

    try {
      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: { op: "seller", sellerId, ...params },
      });

      const { success, message, result } = response.data;

      if (success) {
        const { data: newPosts } = result;
        get().processFetchedPosts(newPosts);

        set((state) => ({
          sellerPostIds: Array.from(
            new Set([
              ...state.sellerPostIds,
              ...newPosts.map((post) => post.id),
            ])
          ),
          loadingStates: { ...state.loadingStates, fetchSeller: false },
        }));
      } else {
        set({
          error: message || "Failed to fetch seller posts",
          loadingStates: { ...get().loadingStates, fetchSeller: false },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: { ...get().loadingStates, fetchSeller: false },
      });
    }
  },

  // Fetch post details
  // Fetch post details with `extra` responses
  fetchPost: async (postId: number, params?: Params) => {
    set({
      loadingStates: { ...get().loadingStates, fetchPost: true },
      error: null,
    });

    try {
      const response = await api.get(`/api/posts/${postId}`, { params });

      const { success, message, result, extra } = response.data;

      if (success) {
        const post: Post = result;

        set((state) => ({
          items: {
            ...state.items,
            [post.id]: {
              ...post,
              extra, // Store the extra data for the specific post ID
            },
          },
          postDetailsId: post.id,
          loadingStates: { ...state.loadingStates, fetchPost: false },
        }));
      } else {
        set({
          error: message || "Failed to fetch post",
          loadingStates: { ...get().loadingStates, fetchPost: false },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: { ...get().loadingStates, fetchPost: false },
      });
    }
  },

  // Reset search results
  resetSearchResults: () => {
    set({ searchResultIds: [] });
  },
}));

export { Params, Post, Picture };

export default usePostStore;
