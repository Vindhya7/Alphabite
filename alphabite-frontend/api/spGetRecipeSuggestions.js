const getRecipeSuggestions = async (keyWord) => {
  let response = await fetch(
    "https://api.spoonacular.com/food/products/suggest?apiKey=def1b530f59448c5a045123c20f9ca3a&query=" +
      keyWord +
      "&number=5",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );

  var res = await response.json();
  return res;
};

export default getRecipeSuggestions;
