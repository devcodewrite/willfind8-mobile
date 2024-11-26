import React, { memo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import { Card, Icon, IconProps, Text } from "@rneui/themed";
import { Image } from "expo-image";

type CategoryCardProps = {
  picture_url?: string;
  icon?: IconProps;
  name?: string;
  size?: number;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
};

const CategoryCard = ({
  picture_url,
  icon,
  name = "Category",
  size = 40,
  onPress = () => {},
  style = {},
}: CategoryCardProps): React.JSX.Element => {
  const placeholder = require("@/assets/images/Loading_icon.gif");

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
      <Card containerStyle={[styles.card, { width: size, height: 100 }]}>
        {/* Category Image or Icon */}
        {icon ? (
          <View style={styles.iconContainer}>
            <Icon {...icon} />
          </View>
        ) : (
          <Image
            contentFit="contain"
            source={{ uri: picture_url }}
            placeholder={placeholder}
            placeholderContentFit="contain"
            cachePolicy="disk"
            style={styles.image}
          />
        )}

        {/* Category Name */}
        <View style={styles.infoContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {name}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const arePropsEqual = (
  prevProps: CategoryCardProps,
  nextProps: CategoryCardProps
) => {
  return (
    prevProps.picture_url === nextProps.picture_url &&
    prevProps.name === nextProps.name &&
    JSON.stringify(prevProps.icon) === JSON.stringify(nextProps.icon) &&
    prevProps.size === nextProps.size &&
    prevProps.style === nextProps.style
  );
};

export default memo(CategoryCard, arePropsEqual);

const styles = StyleSheet.create({
  card: {
    padding: 4,
    margin: 0,
    overflow: "hidden",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  infoContainer: {
    padding: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
