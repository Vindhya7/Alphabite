const calculateRecs = (userInventory, userNutrients) => {
    const foodItems = userInventory.map((foodObj) => {
        return foodObj.key;
    });

    return foodItems;
}

export default calculateRecs;