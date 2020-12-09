const filterFoodItems = async (imageTags) => {
  var str = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=";
  const apiKey = "v2dhN94YJzPxxzm6UcUgNUYfyz9UgSikLFe4WeUE";

  const list = await Promise.all(
    imageTags.map(async (item) => {
      var finalStr = str + apiKey + "&query=" + encodeURIComponent(item);
      let foodResponse = await fetch(finalStr, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      let foodJson = await foodResponse.json();
      var foods = foodJson.foods;

      if (foods[0]) {
        if (foods[0].score > 700) return item;
      }
    })
  );

  var result = list.filter((item) => typeof item === "string");

  return result;
};

export default filterFoodItems;
