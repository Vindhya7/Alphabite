import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Dialog, Portal, Snackbar } from "react-native-paper";
import firebase from 'firebase';

const InventoryScanScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null)

  const [imageUri, setImageUri] = useState(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [snackBarVisible, setSnackBarVisible] = React.useState(false);

  const onDismissSnackBar = () => setSnackBarVisible(false);

  submitPicture = async () => {

    const response = await fetch(imageUri);
    const blob = await response.blob();
    var img = '';
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = async () => {
      var base64data = reader.result.split(',')[1];

      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'LOGO_DETECTION', maxResults: 5 },
              {type: 'OBJECT_LOCALIZATION', maxResults: 5},
            ],
            image: {
              content: base64data
            } 
          },

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

      var labels = [];
      var logos = [];
      var objs = []

      if(responseJson.responses[0].labelAnnotations){
        labels = responseJson.responses[0].labelAnnotations.map((item) => {
          return item.description;
        });
      }

      if(responseJson.responses[0].localizedObjectAnnotations){
        objs = responseJson.responses[0].localizedObjectAnnotations.map((item) => {
          return item.name;
        });
      }


      if(responseJson.responses[0].logoAnnotations){
        logos = responseJson.responses[0].logoAnnotations.map((item) => {
          return item.description;
        });
      }


      var allGoogleResponses = await (labels.concat(objs.concat(labels))).filter(food => food != 'Food' && food != 'Drink' && food != 'Fluid');

      var fin = allGoogleResponses.filter((v, i ,a) => a.indexOf(v) === i);


      // console.log(fin);
      var str = 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key='
      const apiKey = 'v2dhN94YJzPxxzm6UcUgNUYfyz9UgSikLFe4WeUE';

      

      const list = await Promise.all(fin.map( async (item) => {
        var finalStr = str + apiKey + '&query=' + encodeURIComponent(item);
        let foodResponse = await fetch(
            finalStr, {
              headers: {
                Accept: 'application/json',
              'Content-Type': 'application/json'
              },
              method: 'GET'
            }
          );
        let foodJson = await foodResponse.json();
        var foods = foodJson.foods;
        
        if(foods[0]){
          if(foods[0].score > 700) return item;
        }
      }))
      
      var result = list.filter(item => typeof(item) === 'string');
      // console.log(result);

      if(result.length == 0){
        setImageUri(null);
        setSnackBarVisible(true);
      }
      else{
        setImageUri(null);

        props.navigation.navigate('Confirm', { list: result, parentProp: props });
      }
      
      
      //result is the final array to be passed

    }

  };

  takePicture = async () => {
      try {
        if (cameraRef) {
          const options = {
            base64: true,
            quality: 0.5,
            forceUpOrientation: true,
            fixOrientation: true
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
                <Button onPress={submitPicture}>Confirm</Button>
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
            <Snackbar
              visible={snackBarVisible}
              onDismiss={onDismissSnackBar}
              style={{width:"80%",marginBottom:85,backgroundColor: 'white', alignSelf: 'center', opacity: 0.9}}
              duration={3000}
            >
              <Text style={{color: '#000a13', fontSize: 20}}>Could not find food - Retake</Text>
            </Snackbar>
      </View>
    );
  }
}

export default InventoryScanScreen;