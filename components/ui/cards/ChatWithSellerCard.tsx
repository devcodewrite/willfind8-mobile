import TextInput from "@/components/inputs/TextInput";
import { Button } from "@rneui/themed";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ChatWithSeller() {
  const [message, setMessage] = useState("");

  const handleQuickMessage = (quickMessage: string) => {
    setMessage(quickMessage);
  };
  const handleSendChat = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start chat with seller</Text>

      {/* Quick Message Buttons */}
      <View style={styles.quickMessagesContainer}>
        <TouchableOpacity
          style={styles.quickMessageButton}
          onPress={() => handleQuickMessage("Please call me")}
        >
          <Text style={styles.quickMessageText}>Please call me</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickMessageButton}
          onPress={() => handleQuickMessage("Is this available")}
        >
          <Text style={styles.quickMessageText}>Is this available</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickMessageButton}
          onPress={() => handleQuickMessage("Last price")}
        >
          <Text style={styles.quickMessageText}>Last price</Text>
        </TouchableOpacity>
      </View>

      {/* Message Input */}
      <TextInput
        placeholder="Write your message here"
        value={message}
        onChangeText={setMessage}
        inputMode={undefined}
        errorMessage={undefined}
        style={{ height: 50 }}
        label={undefined}
      />

      {/* Start Chat Button */}
      <Button
        title={"Start chat"}
        onPress={handleSendChat}
        buttonStyle={styles.chatButton}
        disabled={message.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quickMessagesContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  quickMessageButton: {
    borderWidth: 1,
    borderColor: "#32CD32",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  quickMessageText: {
    color: "#32CD32",
    fontSize: 14,
  },
  chatButton: {
    marginTop:10,
    backgroundColor: "#FF8C00",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
