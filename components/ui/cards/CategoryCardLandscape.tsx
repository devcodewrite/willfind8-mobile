import React, { memo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar, Icon, IconProps, lightColors, ListItem } from "@rneui/themed";
import { GestureResponderEvent, StyleSheet, TouchableOpacity } from "react-native";

interface Category {
  id: number;
  picture_url?: string;
  name?: string;
}

interface CategoryCardLandscapeProps {
  category: Category;
  icon?: IconProps;
  rounded?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

const CategoryCardLandscape = ({
  category,
  icon,
  rounded = false,
  onPress = () => {},
}: CategoryCardLandscapeProps): React.JSX.Element => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <ListItem containerStyle={styles.item} bottomDivider>
        {/* Avatar or Icon */}
        {icon ? (
          <Icon {...icon} />
        ) : (
          <Avatar
            size={40}
            rounded={rounded}
            source={{ uri: category.picture_url }}
            containerStyle={styles.avatar}
          />
        )}

        {/* Category Details */}
        <ListItem.Content>
          <ListItem.Title numberOfLines={1} style={styles.title}>
            {category.name || "Unknown Category"}
          </ListItem.Title>
        </ListItem.Content>

        {/* Chevron Icon */}
        <MaterialIcons
          name="chevron-right"
          size={28}
          color={lightColors.grey3}
        />
      </ListItem>
    </TouchableOpacity>
  );
};

const arePropsEqual = (
  prevProps: CategoryCardLandscapeProps,
  nextProps: CategoryCardLandscapeProps
) => {
  return (
    prevProps.category.id === nextProps.category.id &&
    prevProps.category.name === nextProps.category.name &&
    prevProps.category.picture_url === nextProps.category.picture_url &&
    JSON.stringify(prevProps.icon) === JSON.stringify(nextProps.icon) &&
    prevProps.rounded === nextProps.rounded
  );
};

export default memo(CategoryCardLandscape, arePropsEqual);

const styles = StyleSheet.create({
  item: {
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: lightColors.background,
  },
  avatar: {
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: lightColors.black,
  },
});
