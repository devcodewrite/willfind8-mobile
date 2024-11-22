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
          style={[styles.image, { width: size }]}
          contentFit="cover"
          source={picture.url.medium}
          cachePolicy={"memory"}
          placeholder={placeholder}
          placeholderContentFit="contain"
        />
        {/* Count Label */}

        <CountLabel
          total={count_pictures}
          style={styles.countLabel}
          num={undefined}
          variant={"dark"}
        />

        <View style={{ flex: 1 }}>
          {/* Post Details */}
          <View style={styles.infoContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <View style={styles.priceSection}>
              <Text style={styles.price_formatted}>{price_formatted}</Text>
              <SavedButton onPress={() => Alert.alert("Added")} />
            </View>

            <View style={styles.locationContainer}>
              <Icon
                name="map-marker"
                type="font-awesome"
                color="#888"
                size={12}
              />
              <Text style={styles.location}>{city?.name}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default memo(PostCard);

const styles = StyleSheet.create({
  card: {
    flex:1,
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
  },
  infoContainer: {
    padding: 8,
    flex: 1,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
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
  price_formatted: {
    fontSize: 16,
    color: "#4682b4",
    fontWeight: "600",
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    left: 8,
  },
});
