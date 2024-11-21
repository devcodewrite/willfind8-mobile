import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PostProvider } from "@/lib/store/PostContext";
import { CategoryProvider } from "@/lib/store/CategoryContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CategoryProvider>
        <PostProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ title: "", headerShown: false }}
            />
            <Stack.Screen
              name="ads/add"
              options={{ presentation: "containedModal" }}
            />
            <Stack.Screen
              name="ads/details"
              getId={({ params }) => params?.id}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ads/fullscreen"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen name="menus/regions" />
            <Stack.Screen name="menus/districts" />
            <Stack.Screen
              name="menus/search"
              options={{
                headerTitle: "",
              }}
            />
            <Stack.Screen name="menus/main_category" />
            <Stack.Screen name="menus/sub_category" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PostProvider>
      </CategoryProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
