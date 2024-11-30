import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Icons for like button
import { lightColors } from "@rneui/base";
import { Text } from "@rneui/themed";
import ChatCard from "@/components/ui/cards/ChatCard";

const FeedbackChat = ({
  data,
  onViewAll,
}: {
  onViewAll?: (e?: any) => void;
  data: Array<any>;
}) => {
  const renderMessage = ({ item }: { item: any }) => <ChatCard item={item} />;
  return (
    data.length > 0 && (
      <FlatList
        style={{ backgroundColor: lightColors.white, paddingVertical: 10 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>{data.length} Feedbacks</Text>
            <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all</Text>
              <FontAwesome
                name="chevron-right"
                size={14}
                color={lightColors.primary}
              />
            </TouchableOpacity>
          </View>
        }
        data={data}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    )
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
