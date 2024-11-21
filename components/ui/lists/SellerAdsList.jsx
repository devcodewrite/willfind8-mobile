import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Badge } from "@rneui/themed";
import SimplePostCard from "../cards/SimplePostCard";
import { Image } from "expo-image";

export default function SellerAdsList({ seller, ads }) {
  const placeholder = require("@/assets/images/Loading_icon.gif");
  return (
    <View style={styles.container}>
      {/* Seller Info Section */}
      <View style={styles.sellerInfoContainer}>
        <Image
          source={{ uri: "" }}
          style={styles.avatar}
          cachePolicy="disk" // Cache on disk for persistent storage
          placeholder={placeholder} // Optional placeholder image while loading
          contentFit="cover" // Ensures image fits properly in the avatar
        />
        <View style={styles.sellerDetails}>
          <Text style={styles.sellerName}>{seller.name}</Text>
          <View style={styles.sellerStats}>
            <Badge
              value={`${seller.activeAdsCount} active ads`}
              badgeStyle={styles.badge}
              textStyle={styles.badgeText}
            />
          </View>
        </View>
      </View>

      {/* Ads List Section */}
      <FlatList
        data={ads}
        horizontal
        contentContainerStyle={{ gap: 8 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SimplePostCard {...item} />}
        showsHorizontalScrollIndicator={false}
        style={styles.adsList}
        ListFooterComponent={
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>
              See all seller's ads ({seller.activeAdsCount}) ➔
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  sellerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding:10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth:3,
    borderColor:'white',
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sellerStats: {
    flexDirection: "row",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#e0e0e0",
    height: 24,
    padding:4,
    marginRight: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: "#606060",
    fontSize: 12,
  },
  adsList: {
    marginVertical: 8,
  },
  seeAllButton: {
    marginTop: 12,
    padding: 10,
    alignItems: "center",
    maxWidth: 120,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
  seeAllText: {
    color: "#1b5e20",
    fontSize: 16,
  },
});
