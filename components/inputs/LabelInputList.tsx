import { IconProps, lightColors } from "@rneui/base";
import { Icon, Input, ListItem, Switch, Text } from "@rneui/themed";
import { PropsWithChildren } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import SelectInput from "./SelectInput";

export function LabelInputList({
  data,
  heading,
  leftTitle,
  onLeftPress,
  containerStyle,
  onPress,
  itemContainerStyle,
}: PropsWithChildren & {
  data: Array<{
    onPress?: (e: any) => void;
    onChange?: (value?: any | string) => void;
    title: string;
    value?: string | any;
    placeholder?: string;
    icon?: IconProps;
    type: "text" | "select" | "radio" | "checkbox_multiple" | "number" | string;
    options?: Array<{
      id: number;
      label?: string;
      name?: string;
      value: string;
    }>;
    rightIcon?: IconProps;
    numberOfLines?: number;
    errorMessage?: string;
  }>;
  title?: string;
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
          {data.map(
            (
              {
                onPress,
                onChange,
                title,
                icon,
                placeholder,
                value,
                options,
                type,
                rightIcon,
                numberOfLines,
                errorMessage,
              },
              i
            ) => (
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

                <ListItem.Content style={styles.content}>
                  <ListItem.Title style={styles.title}>{title}</ListItem.Title>
                  {type === "select" && (
                    <SelectInput
                      value={value}
                      onChange={onChange}
                      placeholder={
                        placeholder ? placeholder : `Select ${title}`
                      }
                      options={options || []}
                    />
                  )}
                  {type === "text" && (
                    <Input
                      placeholder={placeholder}
                      value={value}
                      onChangeText={onChange}
                      inputMode={"text"}
                      inputContainerStyle={{
                        borderBottomWidth: 0,
                      }}
                      numberOfLines={numberOfLines}
                      containerStyle={[
                        styles.inputContainer,
                        errorMessage && styles.inputError,
                      ]}
                      errorMessage={errorMessage}
                    />
                  )}
                  {type === "number" && (
                    <Input
                      placeholder={placeholder}
                      value={value}
                      onChangeText={onChange}
                      inputMode={"numeric"}
                      inputContainerStyle={{
                        borderBottomWidth: 0,
                      }}
                      containerStyle={[
                        styles.inputContainer,
                        errorMessage && styles.inputError,
                      ]}
                      errorMessage={errorMessage}
                    />
                  )}
                  {type === "radio" &&
                    options?.map((option) => (
                      <View key={option.id} style={styles.radioContainer}>
                        <Text>{option.value}</Text>
                        <Switch
                          value={value === option.id}
                          onValueChange={onChange}
                        />
                      </View>
                    ))}
                  {type === "checkbox_multiple" &&
                    options?.map((option) => (
                      <View key={option.id} style={styles.checkboxContainer}>
                        <Text>{option.value}</Text>
                        <Switch
                          value={(value as number[]).includes(option.id)}
                          onValueChange={(isSelected) => {
                            const updatedValue = isSelected
                              ? [...(value as number[]), option.id]
                              : (value as number[]).filter(
                                  (v) => v !== option.id
                                );
                            onChange && onChange(updatedValue);
                          }}
                        />
                      </View>
                    ))}
                </ListItem.Content>
                {rightIcon && (
                  <View style={{ marginEnd: 5 }}>
                    <Icon {...rightIcon} />
                  </View>
                )}
              </ListItem>
            )
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
    paddingVertical: 0,
  },
  content: {
    paddingVertical: 0,
    marginVertical: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginStart: 10,
  },
  inputContainer: {
    marginVertical: 0,
    paddingVertical: 0,
    height: 40,
  },
  inputError: {
    height:'auto'
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
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
