import React, { memo } from "react";
import {
  View,
  StyleSheet,
  Alert,
  DimensionValue,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import { Card, Text, Icon } from "@rneui/themed";
import { Image } from "expo-image";
import { CountLabel } from "./CountLabel";
import SavedButton from "./SavedButton";

const PostCard = ({
  title,
  count_pictures,
  price_formatted,
  city,
  picture,
  size = "100%",
  onPress = () => {},
  style = {},
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
  count_pictures: number;
  title: string;
  price_formatted: string;
  city?: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
  };
  size?: DimensionValue;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
}): React.JSX.Element => {
  const placeholder = require("@/assets/images/Loading_icon.gif");

  return (
    <TouchableOpacity activeOpacity={0.75} style={style} onPress={onPress}>
      <Card containerStyle={[styles.card, { width: size }]}>
        {/* Post Image */}
        <Image
          style={[styles.image]}
          contentFit="cover"
          source={picture.url.medium}
          cachePolicy="memory"
          placeholder={placeholder}
          placeholderContentFit="contain"
        />

        {/* Count Label */}
        <CountLabel
          total={count_pictures}
          style={styles.countLabel}
          variant="dark"
        />

        <View style={styles.infoContainer}>
          {/* Post Details */}
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>

          <View style={styles.priceSection}>
            <Text style={styles.price_formatted}>{price_formatted}</Text>
            <SavedButton onPress={() => Alert.alert("Added")} />
          </View>

          {city && (
            <View style={styles.locationContainer}>
              <Icon
                name="map-marker"
                type="font-awesome"
                color="#888"
                size={12}
              />
              <Text style={styles.location}>{city.name}</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const arePropsEqual = (prevProps: any, nextProps: any) => {
  // Perform shallow comparison for memoization
  return (
    prevProps.title === nextProps.title &&
    prevProps.count_pictures === nextProps.count_pictures &&
    prevProps.price_formatted === nextProps.price_formatted &&
    prevProps.city?.id === nextProps.city?.id &&
    prevProps.picture.url.medium === nextProps.picture.url.medium &&
    prevProps.size === nextProps.size &&
    prevProps.style === nextProps.style
  );
};

export default memo(PostCard, arePropsEqual);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 4,
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
    height: 150,
    width: "100%",
  },
  infoContainer: {
    padding: 8,
    flex: 1,
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
    marginTop: 8,
  },
  price_formatted: {
    fontSize: 16,
    color: "#4682b4",
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  location: {
    fontSize: 12,
    color: "#444",
    fontWeight: "400",
    marginLeft: 4,
  },
  countLabel: {
    position: "absolute",
    top: 8,
    left: 8,
  },
});
