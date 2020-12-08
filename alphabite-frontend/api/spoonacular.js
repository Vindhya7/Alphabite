const getRecipes = async (keyWords) => {
  const apiStrQuery = keyWords.join(",+");

  let response = await fetch(
    "https://api.spoonacular.com/recipes/findByIngredients?apiKey=def1b530f59448c5a045123c20f9ca3a&ingredients=" + apiStrQuery + "&number=20&ignorePantry=true",
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
}

export default getRecipes;