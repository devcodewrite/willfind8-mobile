import { create } from "zustand";
import api from "@/lib/apis/api";
import { User } from "./useFetchUsers";

export interface Advert {
  title: string;
  city_id: number;
  category_id: number;
  description: string;
  price: string;
  email: string;
  phone: string;
  contact_name: string;
  phone_country: string | "GH";
  auth_field: "email" | "phone";
  pictures: Array<string>;
  country_code: string | null;
  negotiable: boolean;
  permanent: boolean;
  accept_terms: boolean;
  tags: string[];
  cf: { [key: string]: [value: string] };
}

export interface Params {
  page?: number;
  op?: "search" | "preminum" | "latest" | "similar";
  postId?: number;
  distance?: number;
  belongLoggedUser?: 1 | 0 | number;
  pendingApproval?: number | 1 | 0;
  archived?: 1 | 0 | number;
  detailed?: 1 | 0 | number;
  embed?: string;
  sort?: string | "created_at" | "-created_at";
  perPage?: number;
  c?: number | string;
  cf?: Map<number, number | string>;
  q?: string;
  l?: number | string;
}

export interface Picture {
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

export interface Extra {
  fieldsValues: {
    [id: string]: { id: number; name: string; type: string; value: string };
  };
  count: number[];
}

export interface SavedUser {
  id: number;
  post_id: number;
  user_id: number;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  price: string;
  contact_name: string;
  phone: string;
  pictures?: Array<Picture>;
  count_pictures: number;
  user_photo_url: string;
  user: User | null;
  user_id: number | null;
  negotiable: number | null;
  savedByLoggedUser?: Array<SavedUser>;
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

export interface SavedPost {
  id: number;
  user_id: number;
  post_id: number;
  post: Post;
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
  savedPostIds: number[];
  userPostIds: number[];
  userPendingPostIds: number[];
  userArchivedPostIds: number[];
  searchSuggestionIds: number[];
  searchResultIds: number[];
  relatedPostIds: number[];
  sellerPostIds: number[];
  postDetailsId: number | null;
  pagination: {
    latest: { page: number; hasMore: boolean };
    saved: { page: number; hasMore: boolean };
    userPost: { page: number; hasMore: boolean };
    userPendingPost: { page: number; hasMore: boolean };
    userArchivedPost: { page: number; hasMore: boolean };
    search: { page: number; hasMore: boolean };
    related: { page: number; hasMore: boolean };
    seller: { page: number; hasMore: boolean };
  };
  extras: {
    latest: Extra | null;
    saved: Extra | null;
    userPost: Extra | null;
    userPendingPost: Extra | null;
    userArchivedPost: Extra | null;
    search: Extra | null;
    related: Extra | null;
    seller: Extra | null;
    suggestions: Extra | null;
  };

  loadingStates: {
    fetchLatest: boolean;
    fetchSaved: boolean;
    fetchUserPost: boolean;
    fetchUserPendingPost: boolean;
    fetchUserArchivedPost: boolean;
    fetchSuggestions: boolean;
    fetchResults: boolean;
    fetchRelated: boolean;
    fetchSeller: boolean;
    fetchPost: boolean;
    addPost: boolean;
    postAdded: boolean;
    updatePost: boolean;
    postUpdated: boolean;
    archivePost: boolean;
    savePost: boolean;
  };

  error: string | null;

  fetchLatestPosts: (params?: Params) => Promise<void>;
  fetchSavedPosts: (params?: Params) => Promise<void>;
  fetchLoggedInUserPosts: (params?: Params) => Promise<void>;
  fetchLoggedInUserPendingPosts: (params?: Params) => Promise<void>;
  fetchLoggedInUserArchivedPosts: (params?: Params) => Promise<void>;
  fetchSearchSuggestions: (params?: Params) => Promise<void>;
  fetchSearchResults: (params: Params) => Promise<void>;
  resetSearchResults: () => void;
  resetSellerPosts: () => void;
  resetLatestPosts: () => void;
  resetSavedPosts: () => void;
  fetchRelatedPosts: (postId: number, params?: Params) => Promise<void>;
  fetchSellerPosts: (sellerId: number, params?: Params) => Promise<void>;
  fetchPost: (postId: number, params?: Params) => Promise<void>;
  addToSavedPost: (postId: number, user: User) => Promise<void>;
  addPost: (advert: Advert) => Promise<void>;
  updatePost: (advert: Advert) => Promise<void>;
  archivePost: (postId: number) => Promise<void>;
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
  savedPostIds: [],
  userPostIds: [],
  userPendingPostIds: [],
  userArchivedPostIds: [],
  searchSuggestionIds: [],
  searchResultIds: [],
  relatedPostIds: [],
  sellerPostIds: [],
  postDetailsId: null,
  pagination: {
    latest: { page: 1, hasMore: true },
    saved: { page: 1, hasMore: true },
    userPost: { page: 1, hasMore: true },
    userPendingPost: { page: 1, hasMore: true },
    userArchivedPost: { page: 1, hasMore: true },
    search: { page: 1, hasMore: true },
    related: { page: 1, hasMore: true },
    seller: { page: 1, hasMore: true },
  },
  extras: {
    latest: { count: [], fieldsValues: {} },
    saved: { count: [], fieldsValues: {} },
    userPost: { count: [], fieldsValues: {} },
    userPendingPost: { count: [], fieldsValues: {} },
    userArchivedPost: { count: [], fieldsValues: {} },
    search: { count: [], fieldsValues: {} },
    related: { count: [], fieldsValues: {} },
    seller: { count: [], fieldsValues: {} },
    suggestions: { count: [], fieldsValues: {} },
  },
  loadingStates: {
    fetchLatest: false,
    fetchSaved: false,
    fetchUserPost: false,
    fetchUserPendingPost: false,
    fetchUserArchivedPost: false,
    fetchSuggestions: false,
    fetchResults: false,
    fetchRelated: false,
    fetchSeller: false,
    fetchPost: false,
    addPost: false,
    postAdded: false,
    updatePost: false,
    postUpdated: false,
    archivePost: false,
    savePost: false,
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
      updatedItems[post.id] = post;
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
        params: {
          op: "latest",
          embed: "user,category,city,savedByLoggedUser,pictures",
          page,
          ...params,
        },
        signal: abortController.signal,
      });

      const { success, message, extra, result } = response.data;

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
          extras: { ...state.extras, latest: extra },
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

  // Fetch user posts
  fetchLoggedInUserPosts: async (params?: Params) => {
    const abortController = new AbortController();
    set({
      abortController,
      loadingStates: { ...get().loadingStates, fetchUserPost: true },
      error: null,
    });

    try {
      const { pagination } = get();
      const { page, hasMore } = pagination.userPost;

      if (!hasMore) return;

      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: {
          embed: "user,category,city,savedByLoggedUser,pictures",
          belongLoggedUser: 1,
          detailed: 1,
          perPage: 10,
          page,
          ...params,
        },
        signal: abortController.signal,
      });

      const { success, message, extra, result } = response.data;
      if (success) {
        const { data: newPosts, meta } = result;

        get().processFetchedPosts(newPosts);
        set((state) => ({
          userPostIds: Array.from(
            new Set([...state.userPostIds, ...newPosts.map((post) => post.id)])
          ),
          pagination: meta && {
            ...state.pagination,
            userPost: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          extras: { ...state.extras, userPost: extra },
          loadingStates: { ...state.loadingStates, fetchUserPost: false },
        }));
      } else {
        set({
          error: message || "Failed to fetch load user posts",
          loadingStates: { ...get().loadingStates, fetchUserPost: false },
        });
      }
    } catch (error: any) {
      console.log("error", error);
      if (error.name !== "AbortError") {
        set({
          error: error.message || "Something went wrong",
          loadingStates: { ...get().loadingStates, fetchUserPost: false },
        });
      }
    } finally {
      set({ abortController: null });
    }
  },

  // Fetch pending posts
  fetchLoggedInUserPendingPosts: async (params?: Params) => {
    const abortController = new AbortController();
    set({
      abortController,
      loadingStates: { ...get().loadingStates, fetchUserPendingPost: true },
      error: null,
    });

    try {
      const { pagination } = get();
      const { page, hasMore } = pagination.userPendingPost;

      if (!hasMore) return;

      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: {
          embed: "user,category,city,savedByLoggedUser,pictures",
          belongLoggedUser: 1,
          pendingApproval: 1,
          detailed: 1,
          perPage: 10,
          page,
          ...params,
        },
        signal: abortController.signal,
      });

      const { success, message, extra, result } = response.data;
      if (success) {
        const { data: newPosts, meta } = result;

        get().processFetchedPosts(newPosts);
        set((state) => ({
          userPendingPostIds: Array.from(
            new Set([
              ...state.userPendingPostIds,
              ...newPosts.map((post) => post.id),
            ])
          ),
          pagination: meta && {
            ...state.pagination,
            userPendingPost: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          extras: { ...state.extras, userPendingPost: extra },
          loadingStates: {
            ...state.loadingStates,
            fetchUserPendingPost: false,
          },
        }));
      } else {
        set({
          error: message || "Failed to fetch load user posts",
          loadingStates: {
            ...get().loadingStates,
            fetchUserPendingPost: false,
          },
        });
      }
    } catch (error: any) {
      console.log("error", error);
      if (error.name !== "AbortError") {
        set({
          error: error.message || "Something went wrong",
          loadingStates: {
            ...get().loadingStates,
            fetchUserPendingPost: false,
          },
        });
      }
    } finally {
      set({ abortController: null });
    }
  },
  // Fetch archived posts
  fetchLoggedInUserArchivedPosts: async (params?: Params) => {
    const abortController = new AbortController();
    set({
      abortController,
      loadingStates: { ...get().loadingStates, fetchUserPendingPost: true },
      error: null,
    });

    try {
      const { pagination } = get();
      const { page, hasMore } = pagination.userPendingPost;

      if (!hasMore) return;

      const response = await api.get<ApiResponse<Post[]>>("/api/posts", {
        params: {
          embed: "user,category,city,savedByLoggedUser,pictures",
          belongLoggedUser: 1,
          detailed: 1,
          perPage: 10,
          page,
          archived: 1,
          ...params,
        },
        signal: abortController.signal,
      });

      const { success, message, extra, result } = response.data;
      if (success) {
        const { data: newPosts, meta } = result;

        get().processFetchedPosts(newPosts);
        set((state) => ({
          userArchivedPostIds: Array.from(
            new Set([
              ...state.userArchivedPostIds,
              ...newPosts.map((post) => post.id),
            ])
          ),
          pagination: meta && {
            ...state.pagination,
            userArchivedPost: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          extras: { ...state.extras, userArchivedPost: extra },
          loadingStates: {
            ...state.loadingStates,
            fetchUserArchivedPost: false,
          },
        }));
      } else {
        set({
          error: message || "Failed to fetch load user posts",
          loadingStates: {
            ...get().loadingStates,
            fetchUserArchivedPost: false,
          },
        });
      }
    } catch (error: any) {
      console.log("error", error);
      if (error.name !== "AbortError") {
        set({
          error: error.message || "Something went wrong",
          loadingStates: {
            ...get().loadingStates,
            fetchUserArchivedPost: false,
          },
        });
      }
    } finally {
      set({ abortController: null });
    }
  },
  // Fetch saved posts
  fetchSavedPosts: async (params?: Params) => {
    // Create a new AbortController
    const abortController = new AbortController();
    set({
      abortController,
      loadingStates: { ...get().loadingStates, fetchSaved: true },
      error: null,
    });

    try {
      const { pagination } = get();
      const { page, hasMore } = pagination.saved;

      // Make the API call
      const response = await api.get<ApiResponse<SavedPost[]>>(
        "/api/savedPosts",
        {
          params: {
            page,
            embed: "post,user,category,city,savedByLoggedUser,pictures",
            detailed: 1,
            ...params,
          },
          signal: abortController.signal,
        }
      );

      const { success, message, extra, result } = response.data;
      if (success) {
        const { data: newPosts, meta } = result;
        // Process fetched posts and update the store
        get().processFetchedPosts(
          newPosts.map((saved) => ({
            ...saved.post,
            savedByLoggedUser: [
              { post_id: saved.post.id, user_id: saved.user_id },
            ],
          }))
        );

        // Update pagination and savedPostIds
        set((state) => ({
          savedPostIds: Array.from(
            new Set([
              ...state.savedPostIds,
              ...newPosts.map((post) => post.post_id),
            ])
          ),
          pagination: meta && {
            ...state.pagination,
            saved: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          extras: { ...state.extras, saved: extra },
          loadingStates: { ...state.loadingStates, fetchSaved: false },
        }));
      } else {
        // Handle API error
        set({
          error: message || "Failed to fetch saved posts",
          loadingStates: { ...get().loadingStates, fetchSaved: false },
        });
      }
    } catch (error: any) {
      console.log(error);
      // Handle network or other errors
      if (error.name !== "AbortError") {
        set({
          error: error.message || "Something went wrong",
          loadingStates: { ...get().loadingStates, fetchSaved: false },
        });
      } else {
      }
    } finally {
      // Cleanup
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

      const { success, message, extra, result } = response.data;

      if (success) {
        const { data: newPosts } = result;
        get().processFetchedPosts(newPosts);

        set((state) => ({
          searchSuggestionIds: Array.from(
            new Set(newPosts.map((post) => post.id))
          ),
          extras: { ...state.extras, suggestions: extra },
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
        params: {
          op: "search",
          embed: "user,category,city,savedByLoggedUser,pictures",
          ...params,
        },
      });

      const { success, extra, message, result } = response.data;

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
          extras: { ...state.extras, search: extra },
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
        params: {
          op: "similar",
          embed: "user,category,city,savedByLoggedUser,pictures",
          postId,
          ...params,
        },
      });

      const { success, extra, message, result } = response.data;

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
          extras: { ...state.extras, search: extra },
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
        params: {
          op: "search",
          embed: "user,category,city,savedByLoggedUser,pictures",
          userId: sellerId,
          ...params,
        },
      });

      const { success, extra, message, result } = response.data;

      if (success) {
        const { data: newPosts, meta } = result;
        get().processFetchedPosts(newPosts);

        set((state) => ({
          sellerPostIds: Array.from(
            new Set([
              ...state.sellerPostIds,
              ...newPosts.map((post) => post.id),
            ])
          ),
          pagination: meta && {
            ...state.pagination,
            saved: {
              page: meta.current_page + 1,
              hasMore: meta.current_page < meta.last_page,
            },
          },
          extras: { ...state.extras, seller: extra },
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

  // Post add
  addPost: async (advert: Advert) => {
    const pics = advert.pictures.map((uri: string) => {
      const fileName = uri.split("/").pop();
      const fileType = `image/${fileName?.split(".").pop()}`;
      return {
        uri,
        name: fileName,
        type: fileType,
      };
    });

    set({
      loadingStates: { ...get().loadingStates, addPost: true },
      error: null,
    });

    try {
      const response = await api.postForm(`/api/posts`, {
        ...advert,
        pictures: undefined,
        "pictures[]": pics,
      });

      const { success, extra, message, result } = response.data;

      if (success) {
        const post: Post = { ...result, pictures: extra.pictures };

        set((state) => ({
          items: {
            ...state.items,
            [post.id]: post,
          },
          userPostIds: [...state.userPostIds, post.id],
          loadingStates: {
            ...state.loadingStates,
            addPost: false,
            postAdded: true,
          },
        }));
      } else {
        set({
          error: message || "Failed to fetch post",
          loadingStates: {
            ...get().loadingStates,
            addPost: false,
            postAdded: true,
          },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: {
          ...get().loadingStates,
          addPost: false,
          postAdded: true,
        },
      });
    }
  },

  updatePost: async (advert: Advert) => {
    const pics = advert.pictures.map((uri: string) => {
      const fileName = uri.split("/").pop();
      const fileType = `image/${fileName?.split(".").pop()}`;
      return {
        uri,
        name: fileName,
        type: fileType,
      };
    });

    set({
      loadingStates: { ...get().loadingStates, updatePost: true },
      error: null,
    });

    try {
      const response = await api.putForm(`/api/posts`, {
        ...advert,
        pictures: undefined,
        "pictures[]": pics,
      });

      const { success, extra, message, result } = response.data;

      if (success) {
        const post: Post = { ...result, pictures: extra.pictures };

        set((state) => ({
          items: {
            ...state.items,
            [post.id]: post,
          },
          loadingStates: {
            ...state.loadingStates,
            updatePost: false,
            postUpdated: true,
          },
        }));
      } else {
        set({
          error: message || "Failed to fetch post",
          loadingStates: {
            ...get().loadingStates,
            updatePost: false,
            postUpdated: true,
          },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: {
          ...get().loadingStates,
          updatePost: false,
          postUpdated: true,
        },
      });
    }
  },

  archivePost: async (postId: number) => {
    set({
      loadingStates: { ...get().loadingStates, archivePost: true },
      error: null,
    });

    try {
      const response = await api.put(`/api/posts/${postId}/offline`);

      const { success, message } = response.data;

      if (success) {
        set((state) => ({
          savedPostIds: state.savedPostIds.filter((id) => id !== postId),
          latestPostIds: state.latestPostIds.filter((id) => id !== postId),
          searchResultIds: state.searchResultIds.filter((id) => id !== postId),
          relatedPostIds: state.relatedPostIds.filter((id) => id !== postId),
          userArchivedPostIds: [...state.savedPostIds, postId],
          loadingStates: {
            ...state.loadingStates,
            archivePost: false,
          },
        }));
      } else {
        set({
          error: message || "Failed to fetch post",
          loadingStates: {
            ...get().loadingStates,
            archivePost: false,
          },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: {
          ...get().loadingStates,
          archivePost: false,
        },
      });
    }
  },

  addToSavedPost: async (postId: number, user: User) => {
    set((state) => {
      const newPost = state.items[postId];
      const savedByLoggedUser = newPost.savedByLoggedUser?.find(
        (save) => save.user_id === user.id
      )
        ? []
        : [].concat(
            { post_id: postId, user_id: user.id },
            newPost?.savedByLoggedUser
          );

      return {
        loadingStates: { ...get().loadingStates, savePost: true },
        items: {
          ...state.items,
          [postId]: {
            ...newPost,
            savedByLoggedUser,
          },
        },
        error: null,
      };
    });

    try {
      const response = await api.post(`/api/savedPosts`, { post_id: postId });
      const { success, message, result } = response.data;

      if (success) {
        set((state: PostStore) => {
          const newPost = state.items[postId];
          const savePostIds = !result
            ? state.savedPostIds.filter((id: any) => id !== postId)
            : state.savedPostIds.includes(result?.post_id)
            ? state.savedPostIds
            : [...state.savedPostIds, result?.post_id];

          const savedByLoggedUser = result
            ? [result]
            : newPost.savedByLoggedUser?.filter(
                (save: SavedUser) => save.user_id !== user.id
              );

          return {
            loadingStates: { ...get().loadingStates, savePost: false },
            items: {
              ...state.items,
              [postId]: {
                ...newPost,
                savedByLoggedUser,
              },
            },
            savedPostIds: savePostIds,
            error: null,
          };
        });
      } else {
        set({
          error: message || "Failed to fetch post",
          loadingStates: {
            ...get().loadingStates,
            savePost: false,
          },
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loadingStates: {
          ...get().loadingStates,
          savePost: false,
        },
      });
    }
  },

  // Reset search results
  resetSearchResults: () => {
    set({ searchResultIds: [] });
  },
  // Rest seller posts
  resetSellerPosts: () => {
    set({ sellerPostIds: [] });
  },
  resetLatestPosts: () => {
    set((state) => ({
      relatedPostIds: [],
      pagination: {
        ...state.pagination,
        latest: {
          ...state.pagination.latest,
          hasMore: true,
        },
      },
    }));
  },
  resetSavedPosts: () => {
    set({ savedPostIds: [] });
  },
}));

export default usePostStore;
