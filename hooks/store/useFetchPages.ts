import { create } from "zustand";
import api from "@/lib/apis/api";

type Slug = "terms" | "privacy" | "faq" | "anti-scam";
// Define the Page interface
interface Page {
  id: number;
  name: string;
  slug: string;
  title: string;
  content: string;
}
// Define the PageStore interface
interface PageStore {
  pages: Map<string, Page>; // Ordered list of page IDs for pagination
  loading: boolean; // Loading state
  error: string | null; // Error state
  // Actions
  fetchPageBySlug: (slug: Slug) => Promise<void>; // Fetch a single page by ID
}

// Create the Zustand store
const usePageStore = create<PageStore>((set, get) => ({
  pages: new Map(),
  total: 0,
  loading: false,
  error: null,

  // Fetch cities with pagination
  fetchPageBySlug: async (slug: Slug) => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true, error: null });

    try {
      const response = await api.get(`/api/pages/${slug}`);
      const { data: result } = response;
      const { success, message, result: page } = result;

      if (success) {
       
        set((state) => {
          state.pages.set(slug, page);
          return { loading: false, error: null, pages: state.pages };
        });
      } else {
        set({ error: message || "Failed to fetch cities" });
      }
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default usePageStore;
