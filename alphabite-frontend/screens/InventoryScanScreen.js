import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Dialog, Portal } from "react-native-paper";


const InventoryScanScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null)

  const [imageUri, setImageUri] = useState(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
  const [type, setType] = useState(Camera.Constants.Type.back);


  submitPicture = async () => {

    try {
          console.log(typeof(imageUri));
          let body = JSON.stringify({
            requests: [
              {
                "image":{
                  "content" : imageUri
                },
                features: [
                  { type: 'LABEL_DETECTION', maxResults: 10 },
                  { type: 'LANDMARK_DETECTION', maxResults: 5 },
                  { type: 'FACE_DETECTION', maxResults: 5 },
                  { type: 'LOGO_DETECTION', maxResults: 5 },
                  { type: 'TEXT_DETECTION', maxResults: 5 },
                  { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
                  { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
                  { type: 'IMAGE_PROPERTIES', maxResults: 5 },
                  { type: 'CROP_HINTS', maxResults: 5 },
                  { type: 'WEB_DETECTION', maxResults: 5 }
                ],
                
              }
            ]
          });
          let response = await fetch(
            'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAdyf12BgxkfGjJz_tbeYQhQwLv4wiZ2qI',
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              method: 'POST',
              body: body
            }
          );
          let responseJson = await response.json();
          console.log(responseJson);
          
        } catch (error) {
          console.log(error);
        }
      };

  takePicture = async () => {
      try {
        if (cameraRef) {
          const options = {
            quality: 0.4,
            base64: true,
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
        setHasPermission(status === 'granted');
      })();

      return () => {
        props.navigation.state.params.refresh();
      }

    }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if(imageUri){
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ width: "100%", height: "100%" }}
          source={{ uri: imageUri }}>

          <Portal>
            <Dialog visible = "true">
              <Dialog.Title>Confirm</Dialog.Title>
              <Dialog.Actions>
                <Button onPress={() => setImageUri(null)}>Retake</Button>
                <Button onPress={() => submitPicture()}>Confirm</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ImageBackground>
      </View>
    );
  }
  else{
    return (
      <View style={{ flex: 1}}>
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
                 <TouchableOpacity
                    onPress={takePicture}
                  >
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
      </View>
    );
  }
}

export default InventoryScanScreen;