const getRecipeByID = async (id) => {
  console.log(id);

  let response = await fetch(
    "https://api.spoonacular.com/recipes/" +
      id +
      "/information?apiKey=def1b530f59448c5a045123c20f9ca3a&includeNutrition=true",
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

export default getRecipeByID;
