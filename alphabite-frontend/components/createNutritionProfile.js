const createNutritionProfile = (height, weight, age, gender) => {
  var nutritionProfile = [];

  nutritionProfile.push(createProteinObj(weight));

  nutritionProfile.push(createCarbObj());

  nutritionProfile.push(createFatObj());

  nutritionProfile.push(createCholObj());

  nutritionProfile.push(createFiberObj());

  nutritionProfile.push(createSodiumObj());

  nutritionProfile.push(createPotassiumObj());

  nutritionProfile.push(createMagnesiumObj(gender));

  nutritionProfile.push(createCalciumObj(age, gender));

  nutritionProfile.push(createCopperObj());

  nutritionProfile.push(createZincObj(gender));

  nutritionProfile.push(createPhosphorusObj(age));

  nutritionProfile.push(createIronObj(gender));

  nutritionProfile.push(createVitAObj(gender));

  nutritionProfile.push(createVitB1Obj(gender));

  nutritionProfile.push(createVitB2Obj(gender));

  nutritionProfile.push(createVitB3Obj(gender));

  nutritionProfile.push(createVitB5Obj());

  nutritionProfile.push(createVitB6Obj());

  nutritionProfile.push(createVitB12Obj());

  nutritionProfile.push(createVitCObj());

  nutritionProfile.push(createVitDObj());

  nutritionProfile.push(createVitEObj());

  nutritionProfile.push(createVitKObj(weight));

  nutritionProfile.push(createIodineObj());

  nutritionProfile.push(createSeleniumObj());

  return nutritionProfile;
};

createProteinObj = (weight) => {
  val = (0.36 * weight).toFixed(2) + "g";
  return { nutrient: "Protein", vals: ["0", val] };
};

createCarbObj = () => {
  return { nutrient: "Carbohydrates", vals: ["0", "225g"] };
};

createFatObj = () => {
  return { nutrient: "Fat", vals: ["0", "50g"] };
};

createCholObj = () => {
  return { nutrient: "Cholestrol", vals: ["0", "300mg"] };
};

createFiberObj = () => {
  return { nutrient: "Fiber", vals: ["0", "30g"] };
};

createSodiumObj = () => {
  return { nutrient: "Sodium", vals: ["0", "2300mg"] };
};

createPotassiumObj = () => {
  return { nutrient: "Potassium", vals: ["0", "4500mg"] };
};

createMagnesiumObj = (gender) => {
  let val = gender === "Male" ? "420mg" : "320mg";
  return { nutrient: "Magnesium", vals: ["0", val] };
};

createCalciumObj = (age, gender) => {
  let val = 0;
  if (gender === "Male") val = "1000mg";
  else {
    val = Number(age) > 50 ? "1200mg" : "1000mg";
  }

  return { nutrient: "Calcium", vals: ["0", val] };
};

createCopperObj = () => {
  return { nutrient: "Copper", vals: ["0", "900mcg"] };
};

createZincObj = (gender) => {
  let val = gender === "Male" ? "11mg" : "8mg";
  return { nutrient: "Zinc", vals: ["0", val] };
};

createPhosphorusObj = (age) => {
  let val = Number(age) > 18 ? "700mg" : "1250mg";
  return { nutrient: "Phosphorus", vals: ["0", val] };
};

createIronObj = (gender) => {
  let val = gender === "Male" ? "8.7mg" : "14.8mg";
  return { nutrient: "Iron", vals: ["0", val] };
};

createVitAObj = (gender) => {
  let val = gender === "Male" ? "900mcg" : "700mcg";
  return { nutrient: "Vitamin A", vals: ["0", val] };
};

createVitB1Obj = (gender) => {
  let val = gender === "Male" ? "1.2mg" : "1.1mg";
  return { nutrient: "Vitamin B1", vals: ["0", val] };
};

createVitB2Obj = (gender) => {
  let val = gender === "Male" ? "1.3mg" : "1.1mg";
  return { nutrient: "Vitamin B2", vals: ["0", val] };
};

createVitB3Obj = (gender) => {
  let val = gender === "Male" ? "16mg" : "14mg";
  return { nutrient: "Vitamin B3", vals: ["0", val] };
};

createVitB5Obj = () => {
  return { nutrient: "Vitamin B5", vals: ["0", "5mg"] };
};

createVitB6Obj = () => {
  return { nutrient: "Vitamin B6", vals: ["0", "1.5mg"] };
};

createVitB12Obj = () => {
  return { nutrient: "Vitamin B12", vals: ["0", "2.4mcg"] };
};

createVitCObj = () => {
  return { nutrient: "Vitamin C", vals: ["0", "100mg"] };
};

createVitDObj = () => {
  return { nutrient: "Vitamin D", vals: ["0", "20mcg"] };
};

createVitEObj = () => {
  return { nutrient: "Vitamin E", vals: ["0", "15mg"] };
};

createVitKObj = (weight) => {
  val = weight + "mg";
  return { nutrient: "Vitamin K", vals: ["0", val] };
};

createIodineObj = () => {
  return { nutrient: "Iodine", vals: ["0", "150mcg"] };
};

createSeleniumObj = () => {
  return { nutrient: "Selenium", vals: ["0", "55mcg"] };
};

export default createNutritionProfile;
