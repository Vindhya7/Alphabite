const getGoogleImageTags = async (imageUri) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = async () => {
      var base64data = reader.result.split(",")[1];

      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "LOGO_DETECTION", maxResults: 5 },
              { type: "OBJECT_LOCALIZATION", maxResults: 5 },
            ],
            image: {
              content: base64data,
            },
          },
        ],
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAdyf12BgxkfGjJz_tbeYQhQwLv4wiZ2qI",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body,
        }
      );
      let responseJson = await response.json();

      var labels = [];
      var logos = [];
      var objs = [];

      if (responseJson.responses[0].labelAnnotations) {
        labels = responseJson.responses[0].labelAnnotations.map((item) => {
          return item.description;
        });
      }

      if (responseJson.responses[0].localizedObjectAnnotations) {
        objs = responseJson.responses[0].localizedObjectAnnotations.map(
          (item) => {
            return item.name;
          }
        );
      }

      if (responseJson.responses[0].logoAnnotations) {
        logos = responseJson.responses[0].logoAnnotations.map((item) => {
          return item.description;
        });
      }

      var allTags = labels
        .concat(objs.concat(labels))
        .filter((food) => food != "Food" && food != "Drink" && food != "Fluid");

      const googleImageTags = allTags.filter((v, i, a) => a.indexOf(v) === i);

      resolve(googleImageTags);
    };
  });
};

export default getGoogleImageTags;
