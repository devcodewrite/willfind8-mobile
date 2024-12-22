// components/ImageSlider.jsx
import React, { useRef } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Carousel } from "react-native-snap-carousel";
import { CountLabel } from "@/components/ui/cards/CountLabel";

const { width: screenWidth } = Dimensions.get("window");
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

export default function ImageSlider({
  index = 0,
  count_pictures,
  pictures,
  height = 320,
  fullscreen = false,
  onPress,
}: {
  index?: number;
  count_pictures?: number;
  pictures: Array<Picture>;
  height?: number;
  fullscreen?: boolean;
  onPress?: (index: number) => void;
}) {
  const carouselRef = useRef(null);
  const blurhash = require("@/assets/images/Loading_icon.gif");

  const renderItem = ({ index, item }: { item: Picture; index: number }) => (
    <TouchableOpacity
      onPress={() => {
        if (onPress) onPress(index);
      }}
      activeOpacity={0.9}
      style={styles.slide}
    >
      <Image
        source={{ uri: item?.url?.full }}
        placeholder={blurhash}
        style={styles.image}
        cachePolicy={"memory"}
        contentFit={fullscreen ? "contain" : "cover"}
        placeholderContentFit="contain"
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {pictures.length > 0 ? (
        <Carousel<Picture>
          ref={carouselRef}
          data={pictures ?? []}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          firstItem={index}
          vertical={false}
        />
      ) : (
        <Image
          source={{ uri: null }}
          placeholder={blurhash}
          style={styles.image}
          cachePolicy={"memory"}
          contentFit="contain"
          placeholderContentFit="contain"
        />
      )}
      <View style={[styles.counter, fullscreen && { start: 20, bottom: 50 }]}>
        <CountLabel variant="dark" total={count_pictures} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1 },
  image: {
    flex: 1,
    width: "100%",
    height: 320,
  },
  counter: {
    position: "absolute",
    bottom: 10,
    start: 10,
  },
});
