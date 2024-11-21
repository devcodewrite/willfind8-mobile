import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Icons for like button
import { lightColors } from "@rneui/base";
import { Text } from "@rneui/themed";
import ChatCard from "@/components/ui/cards/ChatCard";

const feedbackData = [
  {
    id: "1",
    sender: "Humphrey Abaifaa",
    text: "Got my LG 506l double door refrigerator from him. Within an hour of the deal being made, the delivery was done! Highly recommended!",
    date: "Jul 11",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg", // Replace with a real image URL
    likes: 3,
    replies: [
      {
        id: "1-1",
        sender: "Emkos Ventures",
        text: "Thank you, Humphrey! We’re glad you liked our quick delivery service.",
        date: "Jul 11",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg", // Replace with a real image URL
        likes: 1,
      },
    ],
  },
  {
    id: "2",
    sender: "LOCUSTSAHA",
    text: "Got my Midea AC a bit cheaper from him and it works great. Keep up the good job.",
    date: "Apr 16",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg", // Replace with a real image URL
    likes: 5,
    replies: [
      {
        id: "2-1",
        sender: "Emkos Ventures",
        text: "Thanks for the feedback! We strive to offer the best prices.",
        date: "Apr 17",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg", // Replace with a real image URL
        likes: 0,
      },
    ],
  },
];

const FeedbackChat = () => {
  const renderMessage = ({ item }) => <ChatCard item={item} />;
  return (
    <FlatList
      style={{ backgroundColor: lightColors.white, paddingVertical: 10 }}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerText}>{feedbackData.length} Feedbacks</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View all</Text>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={lightColors.primary}
            />
          </TouchableOpacity>
        </View>
      }
      data={feedbackData}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {},
  messageContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E0F7FA",
    borderRadius: 15,
    padding: 10,
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  senderText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    backgroundColor: "#B3E5FC",
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  messageText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    fontSize: 13,
    color: "#888",
  },
  readMoreText: {
    color: "#0288D1",
    fontSize: 13,
    marginTop: 2,
  },
  repliesContainer: {
    paddingLeft: 50,
    marginTop: 10,
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  replyContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  headerText: {
    color: lightColors.primary,
    padding: 4,
  },
  viewAllButton: {
    flexDirection: "row",
    gap: 4,
    alignItems: "baseline",
    padding: 4,
  },
  viewAllText: {
    fontSize: 16,
    color: lightColors.primary,
  },
});

export default FeedbackChat;
