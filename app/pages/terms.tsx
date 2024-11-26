import usePageStore from "@/hooks/store/useFetchPages";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

export default function PageLayout() {
  const { loading, error, pages, fetchPageBySlug } = usePageStore();
  const term = pages.get("terms");

  const page = `<!DOCTYPE html>
    <head>
    <meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0>
    <style>
    body{font-family:'Arial',sans-serif;color:#1f2937;line-height:1.625;padding:1.5rem;}h4{font-size:1.25rem;font-weight:bold;color:#111827;border-bottom:2px solid #3b82f6;padding-bottom:0.5rem;margin-top:1.5rem;margin-bottom:1rem;}p{margin-bottom:1rem;text-align:justify;}ol{list-style-type:decimal;padding-left:1rem;margin-top:1rem;margin-bottom:1rem;}ol li{margin-bottom:0.5rem;}a{color:#3b82f6;text-decoration:none;}a:hover{text-decoration:underline;}b{font-weight:bold;}blockquote{margin-top:1.5rem;margin-bottom:1.5rem;padding:1rem;background-color:#f9fafb;border-left:4px solid #3b82f6;font-style:italic;}
    </style>
    </head><body>${term?.content || ""}</body>`;

  useEffect(() => {
    fetchPageBySlug("terms");
  }, [fetchPageBySlug]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: term?.title || "Terms" }} />
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} animating />
        </View>
      ) : (
        <WebView source={{ html: page }} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
