import React, { createContext, useReducer, useContext, ReactNode } from "react";
import api from "@/lib/apis/api";

// Define post interface
interface Post {
  id: number;
  title: string;
  description: string;
  price: string;
  contact_name: string;
  phone: string;
  pictures: Array<{
    id: number;
    post_id: number;
    filename: string;
    url: {
      full: string;
      small: string;
      medium: string;
      big: string;
    };
  }>;
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
  picture: {
    filename: string;
    url: {
      full: string;
      small: string;
      medium: string;
      big: string;
    };
  };
}

// Define post state
interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  lastFetchFailed: boolean; // Track if the last fetch failed
}

// Define context type
interface PostContextType {
  postState: PostState;
  fetchPosts: (params?: {
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
    c?: number;
    cf?: Map<number, number>;
  }) => Promise<void>;
  retryFetch: () => Promise<void>; // Expose a retry function
  getPostById: (
    id?: number,
    params?: {
      belongLoggedUser?: boolean;
      pendingApproval?: boolean;
      archived?: boolean;
      detailed?: boolean;
      embed?: string;
      unactivatedIncluded?: boolean;
    }
  ) => Promise<Post | null>; // Selector function
}

// Initial state
const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  lastFetchFailed: false, // Initialize as false
};

// Action types
type Action =
  | { type: "FETCH_POSTS_START" }
  | {
      type: "FETCH_POSTS_SUCCESS";
      payload: { posts: Post[]; hasMore: boolean };
    }
  | { type: "FETCH_POSTS_ERROR"; payload: string }
  | { type: "RESET_FETCH_FAILURE" };

// Reducer function
const postReducer = (state: PostState, action: Action): PostState => {
  console.log("Dispatching action:", { type: action.type });

  switch (action.type) {
    case "FETCH_POSTS_START":
      return { ...state, loading: true, error: null, lastFetchFailed: false };
    case "FETCH_POSTS_SUCCESS":
      console.log("state page", state.page);
      return {
        ...state,
        loading: false,
        posts: [...state.posts, ...action.payload.posts],
        page: state.page + 1, // Ensure page is incremented after successful fetch
        hasMore: action.payload.hasMore,
        lastFetchFailed: false,
      };
    case "FETCH_POSTS_ERROR":
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

// Provider component
export const PostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [postState, dispatch] = useReducer(postReducer, initialState);

  // Fetch posts function
  const fetchPosts = async (params?: {
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
    c?: number;
    cf?: Map<number, number>;
  }) => {
    const { page, loading, hasMore } = postState;

    if (loading || !hasMore) {
      console.log("Skipping fetch due to ongoing request or list ended.");
      return;
    }

    try {
      console.log("Fetching posts with params:", { ...params, page });
      dispatch({ type: "FETCH_POSTS_START" });

      const response = await api.get("/api/posts", {
        params: {
          ...params,
          page,
        },
      });

      const { data: result } = response;
      const { success, message } = result;
      const { data, meta } = result.result;

      if (success) {
        const posts: Post[] = data;
        const hasMore = meta.current_page < meta.last_page;
        dispatch({
          type: "FETCH_POSTS_SUCCESS",
          payload: { posts, hasMore },
        });
      } else {
        console.error("Error from server fetching posts:", message);
        dispatch({
          type: "FETCH_POSTS_ERROR",
          payload: message,
        });
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      dispatch({
        type: "FETCH_POSTS_ERROR",
        payload: error.message || "Something went wrong",
      });
    }
  };

  // Retry fetch function
  const retryFetch = async () => {
    dispatch({ type: "RESET_FETCH_FAILURE" }); // Reset the failure flag
    await fetchPosts(); // Retry fetching the posts
  };

  // Selector function to retrieve a post by ID
  const getPostById = async (
    id?: number,
    params?: {
      belongLoggedUser?: boolean;
      pendingApproval?: boolean;
      archived?: boolean;
      detailed?: boolean;
      embed?: string;
      unactivatedIncluded?: boolean;
    }
  ) => {
    try {
      const response = await api.get(`/api/posts/${id}`, {
        params: { detailed: 1, ...params },
      });
      const { data: result } = response;
      const { success, message } = result;

      if (!success) {
        console.log("Server error fetching post:", message);
        return null;
      }
      const post: Post = result.result;
      return post;
    } catch (error: any) {
      console.error("Error fetching post:", error);
    }
    return null;
  };

  return (
    <PostContext.Provider
      value={{ postState, fetchPosts, retryFetch, getPostById }}
    >
      {children}
    </PostContext.Provider>
  );
};

// Create context
const PostContext = createContext<PostContextType | undefined>(undefined);

// Hook to use context
export const usePosts = (): PostContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
