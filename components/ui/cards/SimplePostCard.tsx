import React from "react";
import { StyleSheet, GestureResponderEvent } from "react-native";
import { Card, Text } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { Image as ExpoImage } from "expo-image";

export default function SimplePostCard({
  imageUrl,
  title,
  price,
  onPress,
}: {
  imageUrl: string;
  price: number;
  title: string;
  onPress: (event: GestureResponderEvent) => {};
}): React.JSX.Element {
  const placeholder = require("@/assets/images/Loading_icon.gif");

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <Card containerStyle={styles.adItem}>
        <ExpoImage
          source={{ uri: imageUrl }}
          style={styles.adImage}
          cachePolicy="memory" // Cache in memory for faster temporary access
          placeholder={placeholder} // Optional placeholder image for ad image
          contentFit="cover"
        />
        <Text style={styles.price}>{`GH₵ ${price}`}</Text>
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
  },
  price: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});
