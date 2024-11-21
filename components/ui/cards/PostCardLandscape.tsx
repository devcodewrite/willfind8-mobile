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
import { Card, Text, Icon, ButtonGroup, lightColors } from "@rneui/themed";
import { Image } from "expo-image";
import { CountLabel } from "./CountLabel";
import SavedButton from "./SavedButton";

const PostCardLandscape = ({
  title,
  price_formatted,
  city,
  pictures = [],
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
  title: string;
  category: string;
  subCategory: string;
  price_formatted: number;
  city: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
  };
  size: DimensionValue;
  onPress: (event: GestureResponderEvent) => {};
  style: ViewStyle;
}): React.JSX.Element => {
  const placeholder = require("@/assets/images/Loading_icon.gif");

  const handleButtons = (index: number) => {
    switch (index) {
      case 0:
        Alert.alert("Pressed 0");
        break;

      default:
        break;
    }
  };
  return (
    <TouchableOpacity activeOpacity={0.75} style={style} onPress={onPress}>
      <Card
        wrapperStyle={{ flexDirection: "row" }}
        containerStyle={[styles.card, { width: size }]}
      >
        {/* Post Image */}
        <Image
          style={[styles.image, { width: "40%" }]}
          contentFit="cover"
          source={picture.url.medium}
          cachePolicy={"memory"}
          placeholder={placeholder}
          placeholderContentFit="contain"
        />
        {/* Count Label */}

        {pictures.length > 0 ? (
          <CountLabel
            total={pictures.length}
            style={styles.countLabel}
            num={undefined}
            variant={"dark"}
          />
        ) : null}

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
          <ButtonGroup
            containerStyle={{ borderColor: lightColors.warning }}
            buttonStyle={{
              borderColor: lightColors.warning,
              borderWidth: 0,
            }}
            innerBorderStyle={{ width: 0 }}
            selectedButtonStyle={{
              backgroundColor: lightColors.warning,
              borderWidth: 0,
            }}
            selectedIndex={0}
            buttons={[
              <Icon name="call" color={lightColors.white} />,
              <Icon name="chat" color={lightColors.warning} />,
            ]}
            onPress={handleButtons}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default memo(PostCardLandscape);

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
  price_formatted: {
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
    left: 8,
  },
});