import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  View,
  Modal,
  StyleSheet,
  Alert,
  GestureResponderEvent,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

import { Button, lightColors, Text } from "@rneui/themed";
import { router } from "expo-router";
//import { LoginManager, AccessToken, Profile } from "react-native-fbsdk-next";

// Define the context's type
interface AuthModalContextType {
  showLoginModal: () => void;
  showSignupModal: () => void;
  closeModal: () => void;
}

// Initialize the context
const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

// Provider props type
interface AuthModalProviderProps {
  children: ReactNode;
}

// AuthModalProvider component
export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({
  children,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"login" | "signup">("login"); // 'login' or 'signup'

  // Google login configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
        : process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: "willfind8.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      Alert.alert("Google Login Success", JSON.stringify(authentication));
      setIsModalVisible(false); // Close the modal after success
    }
  }, [response]);

  return (
    <AuthModalContext.Provider
      value={{
        showLoginModal: () => {
          setModalType("login");
          setIsModalVisible(true);
        },
        showSignupModal: () => {
          setModalType("signup");
          setIsModalVisible(true);
        },
        closeModal: () => setIsModalVisible(false),
      }}
    >
      {children}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
        onTouchCancel={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Button
                  onPress={() => setIsModalVisible(false)}
                  icon={{ name: "close", color: lightColors.grey2 }}
                  radius={34}
                  containerStyle={{
                    position: "absolute",
                    left: 10,
                    top: 10,
                  }}
                  buttonStyle={{
                    width: 34,
                    height: 34,
                    padding: 0,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    backgroundColor: lightColors.grey5,
                  }}
                />
                <Text style={styles.title}>
                  {modalType === "login" ? "Sign In" : "Sign Up"}
                </Text>
                {false && (
                  <Button
                    onPress={() => promptAsync()}
                    disabled={!request}
                    size="lg"
                    type="outline"
                    title={
                      modalType === "login"
                        ? "Sign in with Google"
                        : "Sign up with Google"
                    }
                    icon={{
                      name: "logo-google",
                      type: "ionicon",
                      color: lightColors.primary,
                    }}
                    radius={10}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                  />
                )}
                {false && (
                  <Button
                    size="lg"
                    title={
                      modalType === "login"
                        ? "Sign in with Facebook"
                        : "Sign up with Facebook"
                    }
                    radius={10}
                    icon={{
                      name: "logo-facebook",
                      type: "ionicon",
                      color: "white",
                    }}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                  />
                )}
                <Button
                  size="lg"
                  onPress={() => {
                    setIsModalVisible(false);
                    if (modalType === "login") router.push("../(auth)/login");
                    else router.push("../(auth)/signup");
                  }}
                  icon={{ name: "email", color: "white" }}
                  title={
                    modalType === "login"
                      ? "Sign in with Email or Phone"
                      : "Sign up with Email or Phone"
                  }
                  buttonStyle={{
                    width: "100%",
                    backgroundColor: lightColors.warning,
                    marginBottom: 30,
                  }}
                  containerStyle={{ width: "100%" }}
                  titleStyle={styles.buttonText}
                  radius={10}
                />

                {modalType === "login" ? (
                  <View style={{ paddingVertical: 10 }}>
                    <Text>
                      Don't have an account?{" "}
                      <Text
                        style={{ color: lightColors.warning }}
                        onPress={() => {
                          setModalType("signup");
                          setIsModalVisible(true);
                        }}
                      >
                        Sign up
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <View style={{ paddingVertical: 10 }}>
                    <Text>
                      Already have an account?{" "}
                      <Text
                        style={{ color: lightColors.warning }}
                        onPress={() => {
                          setModalType("login");
                          setIsModalVisible(true);
                        }}
                      >
                        Login
                      </Text>
                    </Text>
                  </View>
                )}
                <View style={{ paddingVertical: 10 }}>
                  <Text>
                    By continuing you agree to the{" "}
                    <Text
                      style={{ color: lightColors.primary }}
                      onPress={() => {
                        setIsModalVisible(false);
                        router.push("../pages/terms");
                      }}
                    >
                      Policy and Rules
                    </Text>
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AuthModalContext.Provider>
  );
};

// Custom hook for accessing the context
export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};

// Styles
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  buttonText: { textAlign: "center", flex: 1 },
});
