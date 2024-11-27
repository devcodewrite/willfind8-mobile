import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { useEffect, useState } from "react";
import usePostStore from "@/hooks/store/useFetchPosts";
import useCategoryStore from "@/hooks/store/useFetchCategories";
import { AuthModalProvider } from "@/lib/auth/AuthModelProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { fetchCategories } = useCategoryStore();
  const { fetchLatestPosts } = usePostStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories({ perPage: 20 });
      await fetchLatestPosts({ sort: "created_at", op: "latest", perPage: 10 });
      setLoading(false);
    };

    loadData();
  }, [fetchCategories, fetchLatestPosts]);

  // Display loading screen while fonts or data are loading
  if (loading || !loaded) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthModalProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ title: "", headerShown: false }}
            />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="ads/add"
              options={{ presentation: "containedModal" }}
            />
            <Stack.Screen
              name="ads/details"
              getId={({ params }) => params?.id}
              options={{ headerShown: false, headerTitle: "" }}
            />
            <Stack.Screen
              name="ads/fullscreen"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="search/search"
              options={{ headerShown: false, title: "Search" }}
            />
            <Stack.Screen
              name="search/categories"
              options={{ headerTitle: "Categories", presentation: "modal" }}
              getId={({ params }) => params?.parentId}
            />
            <Stack.Screen
              name="search/categories_menu"
              options={{
                headerTitle: "All Categories",
                presentation: "modal",
              }}
              getId={({ params }) => params?.parentId}
            />
            <Stack.Screen
              name="search/results"
              options={{ headerShown: false }}
              getId={({ params }) => params?.category_id}
            />
            <Stack.Screen
              name="search/cities"
              options={{ presentation: "modal", headerTitle: "Location" }}
            />
            <Stack.Screen
              name="search/cities_menu"
              options={{ presentation: "modal", headerTitle: "Location" }}
            />
            <Stack.Screen
              name="search/filters"
              options={{
                presentation: "fullScreenModal",
                headerTitle: "Filter",
              }}
            />
            <Stack.Screen name="pages/terms" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthModalProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
