import { Avatar, Icon, lightColors, ListItem, Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomAvatar from "../CustomAvatar";
import moment from "moment";

export default function ProfileListItem({
  name,
  title,
  message,
  imageUrl,
  date,
  onPress,
}: {
  name: string;
  title: string;
  message?: string;
  imageUrl?: string | null;
  date?: string;
  onPress?: (e: any) => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <ListItem bottomDivider>
        <CustomAvatar rounded source={{ uri: imageUrl }} size={40} />
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 14, fontWeight: "600" }}>
            {name}
          </ListItem.Title>
          {date && <Text style={styles.date}>{moment(date).fromNow()}</Text>}
          <ListItem.Title style={{ color: lightColors.primary }}>
            {title}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{ color: lightColors.grey2, fontSize: 14 }}
            numberOfLines={1}
          >
            {message}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  date: {
    position: "absolute",
    end: 0,
    top: 0,
    fontSize: 12,
  },
  icon: {
    position: "absolute",
    end: 16,
    top: 16,
  },
});
