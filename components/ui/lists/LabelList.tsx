import { IconProps, lightColors } from "@rneui/base";
import { Icon, ListItem, Text, useTheme } from "@rneui/themed";
import { PropsWithChildren, ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

export function LabelList({
  data,
  icon,
  title,
  value,
  heading,
  leftTitle,
  onLeftPress,
  containerStyle,
  rightIcon,
  onPress,
  itemContainerStyle,
}: PropsWithChildren & {
  data?: Array<{
    onPress?: (e: any) => void;
    title: string;
    value?: string | ReactNode;
    subtitle?: string | ReactNode;
    icon?: IconProps;
    rightIcon?: IconProps;
  }>;
  icon?: IconProps;
  rightIcon?: IconProps;
  title?: string;
  value?: string | ReactNode;
  heading?: string;
  leftTitle?: string;
  onLeftPress?: (e: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  onPress?: (e: any) => void;
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={containerStyle}>
        <View style={styles.headContainer}>
          {heading ? (
            <Text style={styles.heading} disabled>
              {heading}
            </Text>
          ) : (
            <View />
          )}
          {leftTitle && (
            <Text onPress={onLeftPress} style={styles.leftTitle}>
              {leftTitle}
            </Text>
          )}
        </View>
        <View style={styles.container}>
          {data ? (
            data.map(
              ({ onPress, title, icon, value, subtitle, rightIcon }, i) => (
                <ListItem
                  onPress={onPress}
                  key={i.toString()}
                  containerStyle={[styles.item, itemContainerStyle]}
                  bottomDivider={i < data.length - 1}
                >
                  {icon ? (
                    <View style={{ width: 25 }}>
                      <Icon {...icon} />
                    </View>
                  ) : null}
                  {typeof value === "string" ||
                  typeof value === "number" ||
                  title ? (
                    <ListItem.Content style={styles.content}>
                      <ListItem.Title style={styles.title}>
                        {title}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={[styles.subtitle, { color: lightColors.grey2 }]}
                        selectable
                      >
                        {value}
                      </ListItem.Subtitle>
                      {subtitle && (
                        <ListItem.Subtitle
                          style={[
                            styles.subtitle,
                            { color: lightColors.grey3, fontSize: 12 },
                          ]}
                          selectable
                        >
                          {subtitle}
                        </ListItem.Subtitle>
                      )}
                    </ListItem.Content>
                  ) : (
                    value && (
                      <TouchableWithoutFeedback onPress={onPress}>
                        <View>{value}</View>
                      </TouchableWithoutFeedback>
                    )
                  )}
                  {rightIcon && (
                    <View style={{ marginEnd: 5 }}>
                      <Icon {...rightIcon} />
                    </View>
                  )}
                </ListItem>
              )
            )
          ) : (
            <ListItem containerStyle={styles.item}>
              {icon ? (
                <View style={{ width: 16 }}>
                  <Icon {...icon} />
                </View>
              ) : null}
              {typeof value === "string" ||
              typeof value === "number" ||
              title ? (
                <ListItem.Content style={styles.content}>
                  {title && (
                    <ListItem.Title style={styles.title}>
                      {title}
                    </ListItem.Title>
                  )}
                  <ListItem.Subtitle
                    style={[styles.subtitle, { color: lightColors.primary }]}
                  >
                    {value || " "}
                  </ListItem.Subtitle>
                </ListItem.Content>
              ) : (
                <TouchableWithoutFeedback onPress={onPress}>
                  <View>{value}</View>
                </TouchableWithoutFeedback>
              )}
              {rightIcon && (
                <View style={{ marginEnd: 5 }}>
                  <Icon {...rightIcon} />
                </View>
              )}
            </ListItem>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingStart: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    paddingHorizontal: 0,
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
  },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 14,
    color: lightColors.grey3,
    marginBottom: 4,
  },

  leftTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: lightColors.primary,
    marginBottom: 4,
  },
});
