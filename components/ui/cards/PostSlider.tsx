import { Linking, StyleSheet, View } from "react-native";
import ImageSlider from "../ImageSlider";
import { Button, Icon, lightColors, Text } from "@rneui/themed";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";

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

// Define post interface
// Define post interface
interface Post {
  id: number;
  title: string;
  description: string;
  price: string;
  contact_name: string;
  phone: string;
  pictures?: Array<Picture>;
  count_pictures?: number;
  user_photo_url: string;
  negotiable: number | null;
  category: {
    id: number;
    name: string;
    slug: string;
    parent: {
      id: number;
      name: string;
      picture_url: string;
    };
  };
  city: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
  };
  price_formatted: string;
  created_at_formatted: string;
  picture: Picture;
  ads_count?: number;
}

export default function PostSlider({
  id,
  title,
  price_formatted,
  created_at_formatted,
  city,
  phone,
  pictures,
  picture,
  count_pictures,
  onImagePress,
}: Post & { onImagePress: (index: number) => void }) {
  const [viewPhone, setViewPhone] = useState(false);
  const { user } = useAuth();
  const { showLoginModal } = useAuthModal();

  const handleCall = async () => {
    if (!user) return showLoginModal();

    await Linking.openURL(`tel:${phone}`);
  };
  const handleChat = () => {
    if (!user) return showLoginModal();
    router.push({ pathname: "/ads/chat", params: { postId: id } });
  };

  return (
    <View style={styles.container}>
      <ImageSlider
        count_pictures={count_pictures}
        onPress={(index) => onImagePress(index)}
        pictures={pictures ? pictures : picture ? [picture] : []}
      />
      <View style={styles.locationContainer}>
        <Text style={styles.location}>
          <Icon name="map-marker" type="font-awesome" color="#888" size={12} />{" "}
          {city?.name}
        </Text>
        <Text style={styles.date}>{created_at_formatted}</Text>
      </View>

      {/* Post Details */}
      <View style={styles.infoContainer}>
        <Text numberOfLines={3} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.price}>{price_formatted}</Text>

        <View style={styles.actions}>
          <Button
            type="outline"
            icon={{ name: "chat-bubble-outline", color: lightColors.primary }}
            radius={15}
            size="sm"
            title={"Make an Offer"}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "50%" }}
            onPress={handleChat}
          />
          <Button
            onPress={viewPhone ? () => handleCall() : () => setViewPhone(true)}
            color={lightColors.primary}
            icon={{ name: viewPhone ? "wifi-calling" : "call", color: "white" }}
            title={viewPhone ? phone : "Call"}
            radius={15}
            size="sm"
            containerStyle={{ width: "50%" }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#4682b4",
    fontWeight: "600",
    marginVertical: 10,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  location: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
});
