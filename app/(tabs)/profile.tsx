// app/tabs/profile.js
import SettingOption from "@/components/ui/SettingOption";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";

export default function ProfileScreen() {

  const router = useRouter();

  // Handler functions for each option
  const handlePersonalInfoPress = () =>
    Alert.alert("Personal Info", "Navigate to Personal Info screen");
  const handleSignInSecurityPress = () =>
    Alert.alert("Sign In & Security", "Navigate to Sign In & Security screen");

  const handleDeleteAccountPress = () =>
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?"
    );
  const handleTermsOfUsePress = () =>
    Alert.alert("Terms of Use", "Open Terms of Use");

  const handlePrivacyPolicyPress = () =>
    Alert.alert("Privacy Policy", "Open Privacy Policy");

  const handleLogoutPress = () =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Yes,Logout", style: "destructive" },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}

      {/* Settings Options */}
      <SettingOption
        title="My Listings"
        icon="post-add"
        onPress={handlePersonalInfoPress}
      />
      <SettingOption
        title="Notifications"
        icon="notifications"
        onPress={handlePersonalInfoPress}
      />
      {/* Divider for separating account management */}
      <View style={styles.divider} />

      <SettingOption
        title="Personal Info"
        icon="person"
        onPress={handlePersonalInfoPress}
      />
       <SettingOption
        title="Business Info"
        icon="business"
        onPress={handlePersonalInfoPress}
      />
      <SettingOption
        title="Sign In & Security"
        icon="lock"
        onPress={handleSignInSecurityPress}
      />

      {/* Divider for separating account management */}
      <View style={styles.divider} />

      <SettingOption
        title="Close Account"
        icon="delete"
        onPress={handleDeleteAccountPress}
      />
      <SettingOption
        title="Terms of Use"
        icon="description"
        onPress={handleTermsOfUsePress}
      />
      <SettingOption
        title="Privacy Policy"
        icon="policy"
        onPress={handlePrivacyPolicyPress}
      />
      <SettingOption title="Logout" icon="logout" onPress={handleLogoutPress} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  divider: {
    marginVertical: 16,
  },
});
