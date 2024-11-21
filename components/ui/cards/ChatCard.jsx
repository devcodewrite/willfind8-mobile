import { FontAwesome } from "@expo/vector-icons";
import { lightColors, Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import ReadMore from "@fawazahmed/react-native-read-more";
import CustomAvatar from "../CustomAvatar";

export default function ChatCard({ item }) {
  return (
    <View style={styles.messageContainer}>
      <View style={styles.messageRow}>
        <CustomAvatar
          source={{ uri: item.avatar }}
          rounded={true}
          size={30}
          placeholder={require("@/assets/images/Loading_icon.gif")} // Replace with a local default image if needed
        />

        <View style={styles.messageContent}>
          <Text style={styles.senderText}>{item.sender}</Text>

          {/* Message text with Read more */}
          <ReadMore
            seeMoreText={"Read more"}
            seeLessText={"Read less"}
            seeLessStyle={styles.viewAllText}
            seeMoreStyle={styles.viewAllText}
            style={styles.messageText}
            numberOfLines={2}
          >
            {item.text}
          </ReadMore>
          <Text style={styles.dateText}>{item.date}</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.likeButton}>
              <FontAwesome name="thumbs-o-up" size={16} color="#888" />
              <Text style={styles.actionText}> {item.likes} Like</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map((reply) => (
            <View key={reply.id} style={styles.replyRow}>
              <CustomAvatar
                size={30}
                rounded
                source={{ uri: reply.avatar }}
                placeholder={require("@/assets/images/Loading_icon.gif")}
              />
              <View style={styles.replyContent}>
                <Text style={styles.senderText}>{reply.sender}</Text>
                <Text style={styles.messageText}>{reply.text}</Text>
                <Text style={styles.dateText}>{reply.date}</Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.likeButton}>
                    <FontAwesome name="thumbs-o-up" size={16} color="#888" />
                    <Text style={styles.actionText}> {reply.likes} Like</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  messageContent: {
    flex: 1,
  },
  senderText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
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
  viewAllText: {
    fontSize: 13,
    color: lightColors.primary,
  },
});
