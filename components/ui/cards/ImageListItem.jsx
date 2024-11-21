import { Ionicons } from "@expo/vector-icons";
import { Avatar, Icon, ListItem } from "@rneui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function ImageListItem({
  name,
  icon = null,
  size = 40,
  url,
  onPress,
  rounded = false,
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <ListItem bottomDivider>
        {icon ? (
          <Icon size={size} {...icon} />
        ) : (
          <Avatar size={size} rounded={rounded} source={{ uri: url }} />
        )}
        <ListItem.Content>
          <ListItem.Title>{name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
