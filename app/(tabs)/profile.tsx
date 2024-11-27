// app/tabs/profile.js
import ProfileHeader from "@/components/ui/ProfileHeader";
import SettingOption from "@/components/ui/SettingOption";
import { useAuth } from "@/lib/auth/AuthProvider";
import { router } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  useEffect(() => {
    if (!user) router.push("/(tabs)");
  }, [user, router]);

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
  const handleTermsOfUsePress = () => router.push("/pages/terms");
  const handlePrivacyPolicyPress = () => router.push("/pages/privacy");
  const handleFAQPress = () => router.push("/pages/faq");

  const handleLogoutPress = () =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Yes,Logout", style: "destructive", onPress: logout },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <ProfileHeader
          name={user?.name}
          email={user?.email}
          avatarUrl={user?.photo_url}
        />
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
        <SettingOption title="FAQ" icon="info" onPress={handleFAQPress} />

        <SettingOption
          title="Logout"
          icon="logout"
          onPress={handleLogoutPress}
        />
      </SafeAreaView>
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
