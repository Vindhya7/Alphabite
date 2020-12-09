import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Camera } from "expo-camera";
import {
  Button,
  Dialog,
  Portal,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";
import getGoogleImageTags from "../api/googlevision";
import filterFoodItems from "../api/foodcentral";

const InventoryScanScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  const [imageUri, setImageUri] = useState(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [snackBarVisible, setSnackBarVisible] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const onDismissSnackBar = () => setSnackBarVisible(false);

  submitPicture = async () => {
    setIsLoading(true);

    var prom1 = Promise.resolve(getGoogleImageTags(imageUri));

    prom1.then((googleImageTags) => {
      console.log(googleImageTags);

      var prom2 = Promise.resolve(filterFoodItems(googleImageTags));

      prom2.then((foods) => {
        setIsLoading(false);
        if (foods.length == 0) {
          setImageUri(null);
          setSnackBarVisible(true);
        } else {
          setImageUri(null);

          props.navigation.navigate("Confirm", {
            list: foods,
            parentProp: props,
          });
        }
      });
    });
  };

  takePicture = async () => {
    try {
      if (cameraRef) {
        const options = {
          base64: true,
          quality: 0.5,
          forceUpOrientation: true,
          fixOrientation: true,
        };

        const { uri } = await cameraRef.takePictureAsync(options);
        setImageUri(uri);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //TODO Flash on/off symbol
  if (imageUri) {
    if (isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={{ uri: imageUri }}
          >
            <Portal>
              <Dialog visible="true">
                <Dialog.Title>Loading</Dialog.Title>
                <ActivityIndicator animating={true} />
              </Dialog>
            </Portal>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={{ uri: imageUri }}
          >
            <Portal>
              <Dialog visible="true">
                <Dialog.Title>Confirm</Dialog.Title>
                <Dialog.Actions>
                  <Button onPress={() => setImageUri(null)}>Retake</Button>
                  <Button onPress={submitPicture}>Confirm</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ImageBackground>
        </View>
      );
    }
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          ratio="16:9"
          flashMode={flashMode}
          type={type}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                icon="close"
                style={{ marginLeft: 12 }}
                mode="outlined"
                color="white"
                onPress={() => {
                  setFlashMode(
                    flashMode === Camera.Constants.FlashMode.on
                      ? Camera.Constants.FlashMode.off
                      : Camera.Constants.FlashMode.on
                  );
                }}
              >
                Flash
              </Button>
              <TouchableOpacity onPress={takePicture}>
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 50,
                    borderColor: "white",
                    height: 50,
                    width: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 16,
                    marginTop: 16,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderRadius: 50,
                      borderColor: "white",
                      height: 40,
                      width: 40,
                      backgroundColor: "white",
                    }}
                  ></View>
                </View>
              </TouchableOpacity>
              <Button
                icon="axis-z-rotate-clockwise"
                style={{ marginRight: 12 }}
                mode="outlined"
                color="white"
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                {type === Camera.Constants.Type.back ? "Front" : "Back "}
              </Button>
            </View>
          </View>
        </Camera>
        <Snackbar
          visible={snackBarVisible}
          onDismiss={onDismissSnackBar}
          style={{
            width: "80%",
            marginBottom: 85,
            backgroundColor: "white",
            alignSelf: "center",
            opacity: 0.9,
          }}
          duration={3000}
        >
          <Text style={{ color: "#000a13", fontSize: 20 }}>
            Could not find food - Retake
          </Text>
        </Snackbar>
      </View>
    );
  }
};

export default InventoryScanScreen;
