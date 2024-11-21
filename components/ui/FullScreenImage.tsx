import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Icon } from "@rneui/themed";
import ImageSlider from "./ImageSlider";

interface Picture {
  id: number;
  post_id: number;
  filename: string;
  url: {
    full: string;
    small: string;
    medium: string;
    big: string;
  };
}

export default function FullScreenImage({
  index = 0,
  count_pictures,
  pictures,
  onClose,
}: {
  index: number;
  count_pictures: number;
  pictures: Array<Picture>;
  onClose: (event: GestureResponderEvent) => void;
}) {
  return (
    <View style={styles.container}>
      <ImageSlider
        index={index}
        count_pictures={count_pictures}
        pictures={pictures}
        fullscreen
      />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" type="material" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
});
