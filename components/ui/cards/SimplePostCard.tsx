import React from "react";
import {
  StyleSheet,
  GestureResponderEvent,
  DimensionValue,
  ViewStyle,
} from "react-native";
import { Card, Text } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { CountLabel } from "./CountLabel";

export default function SimplePostCard({
  count_pictures,
  price_formatted,
  picture,
  onPress,
  style,
}: {
  picture: {
    filename: string;
    url: {
      full: string;
      small: string;
      medium: string;
      big: string;
    };
  };
  count_pictures?: number;
  title: string;
  price_formatted: string;
  city: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
  };
  size?: DimensionValue;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
}): React.JSX.Element {
  const placeholder = require("@/assets/images/Loading_icon.gif");

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <Card containerStyle={styles.adItem}>
        <ExpoImage
          source={{ uri: picture.url.medium }}
          style={styles.adImage}
          cachePolicy="memory" // Cache in memory for faster temporary access
          placeholder={placeholder} // Optional placeholder image for ad image
          contentFit="cover"
        />
        <Text style={styles.price}>{price_formatted}</Text>
        {/* Count Label */}
        <CountLabel
          total={count_pictures}
          style={styles.countLabel}
          variant={"dark"}
        />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  adItem: {
    width: 170,
    margin: 0,
    overflow: "hidden",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  adImage: {
    height: 80,
    width: "100%",
  },
  price: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  countLabel: {
    position: "absolute",
    top: 8,
    left: 8,
  },
});
