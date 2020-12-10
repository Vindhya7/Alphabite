const getIngredientInfo = async (keyWord) => {
  let response1 = await fetch(
    "https://api.spoonacular.com/food/ingredients/search?apiKey=def1b530f59448c5a045123c20f9ca3a&query=" +
      keyWord +
      "&number=5&sortDirection=desc",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );

  var res = await response1.json();

  var id = res.results[0].id;

  let response2 = await fetch(
    "https://api.spoonacular.com/food/ingredients/" +
      id +
      "/information?apiKey=def1b530f59448c5a045123c20f9ca3a&amount=1",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );

  var final = await response2.json();

  var ret = final.nutrition.nutrients;

  return ret;
};

export default getIngredientInfo;
