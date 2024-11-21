import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Card, Icon, Text } from "@rneui/themed";
import { Image } from "expo-image";

export default function CategoryCard({
  picture_url,
  name,
  icon,
  size = 40,
  onPress,
}: {
  picture_url?: string;
  icon?: object | null;
  name?: string;
  size: number;
  onPress?: (event: GestureResponderEvent) => void;
}): React.JSX.Element {
  const placeholder = require("@/assets/images/Loading_icon.gif");
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card containerStyle={[styles.card, { width: size, height: 100 }]}>
        {/* Category Image */}
        {icon ? (
          <View style={{ padding: 5 }}>
            <Icon name={""} size={40} {...icon} />
          </View>
        ) : (
          <Image
            contentFit="contain"
            source={{ uri: picture_url }}
            placeholder={placeholder}
            placeholderContentFit="contain"
            cachePolicy={"disk"}
            style={[styles.image, { width: "100%", height: 50 }]}
          />
        )}

        {/* Category Details */}
        <View style={styles.infoContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {name}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

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
  },
  image: {
    alignSelf: "center",
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
