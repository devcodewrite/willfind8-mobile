// components/VerticalAlert.jsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

export default function VerticalAlert({ isVisible, onClose, title, message }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      style={{ padding: 0, margin: 0 }}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.message}>
            You haven't finished posting your advert. Would you like to save
            your progress to finish it later?
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              /* Save Action */
            }}
            style={styles.button}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              /* Discard Action */
            }}
            style={[styles.button, styles.discardBtn]}
          >
            <Text style={styles.discardText}>Discard</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cancelBox}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  openButton: {
    padding: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 5,
  },
  openButtonText: {
    color: "white",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    paddingBottom: 30,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  alertBox: {
    borderRadius: 15,
    width: "100%",
    opacity: 0.85,
    alignItems: "center",
  },
  cancelBox: {
    opacity: 0.85,
    borderRadius: 15,
    width: "100%",
    marginTop: 10,
  },
  message: {
    padding: 20,
    fontSize: 16,
    width: "100%",
    color: "dark",
    textAlign: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    backgroundColor: "white",
    borderStartEndRadius: 15,
    borderTopStartRadius: 15,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  saveText: {
    color: "blue",
    fontSize: 18,
  },
  discardText: {
    color: "red",
    fontSize: 18,
  },
  discardBtn: {
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
  },
  cancelButton: {
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor:"white"
  },
  cancelText: {
    color: "blue",
    fontSize: 18,
  },
});
