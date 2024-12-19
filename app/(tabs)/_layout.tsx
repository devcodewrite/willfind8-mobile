// app/_layout.js
import { TabBarIcon } from "@/components/ui/TabBarIcon";
import CustomAvatar from "@/components/ui/CustomAvatar";
import { lightColors } from "@rneui/base";
import Logo from "@/components/ui/Logo";
import { Tabs, useRouter } from "expo-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";

export default function Layout() {
  const router = useRouter();
  const { user } = useAuth();
  const { showLoginModal } = useAuthModal();
  const placeholder = require("@/assets/images/icons8-test-account-96.png");

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerTitle: "",
      }}
      screenListeners={{
        tabPress: (e) => {
          if (e.target?.split("-")[0] !== "index") {
            if (!user) {
              e.preventDefault();
              return showLoginModal();
            }
  
            if (e.target?.split("-")[0] === "add") {
              e.preventDefault();
              router.push("../ads/add");
            }
          }
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerLeft: ({ tintColor }) => <Logo size={50} />,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarLabel: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} name="bookmark" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              size={34}
              focused={true}
              name="add-circle"
              color={lightColors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} name="chatbox" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <CustomAvatar
              size={28}
              rounded
              focused={focused}
              color={color}
              source={{
                uri: user?.photo_url,
              }}
              placeholder={placeholder}
            />
          ),
        }}
      />
    </Tabs>
  );
}
