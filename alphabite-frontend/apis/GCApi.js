import firebase from 'firebase';

export const processGoogleResponse = async (imageUri, uid) => {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      var img = '';
      var reader = new FileReader();
      reader.readAsDataURL(blob); 
      return reader.onloadend = async () => {
          var base64data = reader.result.split(',')[1];

          // console.log(base64data);
          let body = JSON.stringify({
            requests: [
              {
                features: [
                  { type: 'LABEL_DETECTION', maxResults: 10 },
                  { type: 'LOGO_DETECTION', maxResults: 5 },
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

          var jsonse = JSON.stringify(responseJson, null, 2);
          var blob = new Blob([jsonse], {type: "application/json"});

          var storageRef = firebase.storage().ref().child('googleResponses/' + uid);
          storageRef.put(blob);

          var labels = responseJson.responses[0].labelAnnotations.map((item) => {
            return item.description;
          });

          var logos = responseJson.responses[0].logoAnnotations.map((item) => {
            return item.description;
          });
          var fin = await labels.concat(logos);
          return fin;
      }
}

