import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Icon } from "@rneui/themed";
import TextInput from "./TextInput";

export default function TagInput({ onTagUpdate = (tags) => {} }) {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (onTagUpdate) onTagUpdate(tags);
  }, [tags]);
  const handleAddTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    // Split input by commas and remove any whitespace around each tag
    const newTags = trimmedInput.split(",").map((tag) => tag.trim());

    let updatedTags = [...tags];

    newTags.forEach((tag) => {
      if (
        tag.length >= 2 &&
        tag.length <= 30 &&
        !updatedTags.includes(tag) &&
        updatedTags.length < 15
      ) {
        updatedTags.push(tag);
      } else if (tag.length < 2 || tag.length > 30) {
        Alert.alert(
          "Invalid Tag",
          "Each tag must be between 2 and 30 characters."
        );
      } else if (updatedTags.includes(tag)) {
        Alert.alert(
          "Duplicate Tag",
          `The tag "${tag}" has already been added.`
        );
      } else if (updatedTags.length >= 15) {
        Alert.alert("Tag Limit Reached", "You cannot add more than 15 tags.");
      }
    });

    setTags(updatedTags);
    setInput("");
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((item) => item !== tag));
  };

  const handleInputChange = (text) => {
    if (text.endsWith(",") || text.endsWith("\n")) {
      handleAddTag();
    } else {
      setInput(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Enter the tags separated by commas or press the Enter (↵) button on your
        keyboard after each tag.
      </Text>
      <TextInput
        placeholder="Add a tag..."
        value={input}
        onChangeText={handleInputChange}
        onSubmitEditing={handleAddTag}
        submitBehavior={"newline"}
        returnKeyType="done"
      />
      <View style={styles.tagContainer}>
        <FlatList
          data={tags}
          keyExtractor={(item) => item}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(item)}>
                <Icon name="close" type="material" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <Text style={styles.tagCount}>Tags: {tags.length} / 15</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  instructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 4,
  },
  tagCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 8,
  },
});
