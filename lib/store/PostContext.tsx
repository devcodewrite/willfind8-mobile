import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import api from "@/lib/apis/api";

// Define post interface
interface Post {
  id: number;
  title: string;
  description: string;
  price: string;
  contact_name: string;
  phone: string;
  count_pictures: number;
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
    c?: number | string;
    cf?: Map<number, number>;
    q?: string;
    l?: number | string;
  }) => Promise<void>;
  resetState: () => void;
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
  lastFetchFailed: false,
};

// Action types
type Action =
  | { type: "FETCH_POSTS_START" }
  | {
      type: "FETCH_POSTS_SUCCESS";
      payload: { posts: Post[]; hasMore: boolean };
    }
  | { type: "FETCH_POSTS_ERROR"; payload: string }
  | { type: "RESET_FETCH_FAILURE" }
  | { type: "RESET_STATE" }; // New action for resetting state

// Reducer function
const postReducer = (state: PostState, action: Action): PostState => {
  switch (action.type) {
    case "FETCH_POSTS_START":
      return { ...state, loading: true, error: null, lastFetchFailed: false };
    case "FETCH_POSTS_SUCCESS": {
      const newPosts = action.payload.posts;

      // Filter out duplicates by checking existing IDs
      const updatedPosts = [
        ...state.posts,
        ...newPosts.filter(
          (newPost) =>
            !state.posts.some((existingPost) => existingPost.id === newPost.id)
        ),
      ];

      return {
        ...state,
        loading: false,
        posts: updatedPosts,
        page: state.page + 1,
        hasMore: action.payload.hasMore,
        lastFetchFailed: false,
      };
    }

    case "FETCH_POSTS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        lastFetchFailed: true,
      };
    case "RESET_FETCH_FAILURE":
      return { ...state, lastFetchFailed: false };
    case "RESET_STATE": // Handle state reset
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const PostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [postState, dispatch] = useReducer(postReducer, initialState);

  const fetchPosts = async (params?: { [key: string]: any }) => {
    const { page, loading, hasMore } = postState;

    if (loading || !hasMore) return;

    try {
      dispatch({ type: "FETCH_POSTS_START" });

      const response = await api.get("/api/posts", {
        params: { ...params, page },
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
        dispatch({ type: "FETCH_POSTS_ERROR", payload: message });
      }
    } catch (error: any) {
      dispatch({
        type: "FETCH_POSTS_ERROR",
        payload: error.message || "Something went wrong",
      });
    }
  };

  const retryFetch = async () => {
    dispatch({ type: "RESET_FETCH_FAILURE" });
    await fetchPosts();
  };

  const getPostById = async (id?: number, params?: { [key: string]: any }) => {
    try {
      console.log("getPostById: ", id);
      const response = await api.get(`/api/posts/${id}`, {
        params: { detailed: 1, ...params },
      });
      const { data: result } = response;
      const { success } = result;

      if (!success) return null;
      return result.result as Post;
    } catch (error: any) {
      console.error("Error fetching post:", error);
      return null;
    }
  };

  // New function to reset state
  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  };

  return (
    <PostContext.Provider
      value={{ postState, fetchPosts, retryFetch, getPostById, resetState }}
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
