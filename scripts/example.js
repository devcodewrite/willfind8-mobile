 // Facebook login function using react-native-fbsdk-next
  /* const handleFacebookLogin = async (event: GestureResponderEvent) => {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        Alert.alert("Facebook Login Cancelled");
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        Alert.alert("Facebook Login Failed", "No access token received");
        return;
      }

      const profile = await Profile.getCurrentProfile();
      Alert.alert(
        "Facebook Login Success",
        `Token: ${data.accessToken}, Name: ${profile?.name}`
      );

      setIsModalVisible(false); // Close the modal after success
    } catch (error) {
      Alert.alert("Facebook Login Error", (error as Error).message);
    }
  }; */
