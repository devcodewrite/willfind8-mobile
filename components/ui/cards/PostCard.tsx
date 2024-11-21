import React, { memo } from "react";
import {
  View,
  StyleSheet,
  Alert,
  DimensionValue,
  GestureResponderEvent,
} from "react-native";
import { Card, Text, Icon } from "@rneui/themed";
import { Image } from "expo-image";
import { CountLabel } from "./CountLabel";
import SavedButton from "./SavedButton";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const PostCard = ({
  imageUrl,
  title,
  price,
  location,
  category,
  subCategory,
  images = [],
  size = "100%",
  showSubCategory = false,
  onPress,
}: {
  imageUrl: string;
  images: Array<{}>;
  title: string;
  category: string;
  subCategory: string;
  price: number;
  location: string;
  size: DimensionValue;
  showSubCategory: boolean;
  onPress: (event: GestureResponderEvent) => {};
}): React.JSX.Element => {
  const placeholder = require("@/assets/images/Loading_icon.gif");

  return (
    <TouchableOpacity onPress={onPress}>
      <Card containerStyle={[styles.card, { width: size }]}>
        {/* Post Image */}
        <Image
          style={styles.image}
          contentFit="cover"
          source={imageUrl}
          cachePolicy={"memory"}
          placeholder={placeholder}
          placeholderContentFit="contain"
        />
        {/* Count Label */}

        <CountLabel
          total={images.length}
          style={styles.countLabel}
          num={undefined}
          variant={"dark"}
        />

        {/* Post Details */}
        <View style={styles.infoContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>

          {showSubCategory ? (
            <View style={styles.breadcrumb}>
              <Text numberOfLines={2} style={styles.nav}>
                {category}{" "}
                <FontAwesome6
                  name="angles-right"
                  style={{ marginHorizontal: 2 }}
                  size={10}
                  color="black"
                />{" "}
                {subCategory}
              </Text>
            </View>
          ) : null}

          <View style={styles.priceSection}>
            <Text style={styles.price}>{price}</Text>
            <SavedButton onPress={() => Alert.alert("Added")} />
          </View>

          <View style={styles.locationContainer}>
            <Icon
              name="map-marker"
              type="font-awesome"
              color="#888"
              size={12}
            />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default memo(PostCard);

const styles = StyleSheet.create({
  card: {
    padding: 0,
    margin: 0,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  image: {
    flex: 1,
    height: 150,
  },
  infoContainer: {
    padding: 8,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },
  nav: {
    fontSize: 14,
    fontWeight: "400",
    color: "#4682b4",
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    color: "#4682b4",
    fontWeight: "600",
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: "#444",
    fontWeight: "400",
    marginLeft: 4,
  },
  verifiedIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  countLabel: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
