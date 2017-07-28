"use strict";

const mongoose = require("mongoose");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

const string = {type: String, required: true};
const number = {type: Number, required: false, min : 0};
const positive = {type: Number, required: true, min : 0};
const category = {
    type: String, required: true,
    enum: [
        "Breakfast", "Beef & Pork", "Chicken & Fish", "Salads",
        "Snacks & Sides", "Desserts", "Beverages", "Coffee & Tea",
        "Smoothies & Shakes"
    ]
};

const jsons = {
    McDonalds : {
        "Category" : category,
        "Item" : string,
        "Serving Size" : string,
        "Calories" : positive,
        "Calories from Fat" : positive,
        "Total Fat" : positive,
        "Total Fat (% Daily Value)" : positive,
        "Saturated Fat" : positive,
        "Saturated Fat (% Daily Value)" : positive,
        "Trans Fat" : positive,
        "Cholesterol" : positive,
        "Cholesterol (% Daily Value)" : positive,
        "Sodium" : positive,
        "Sodium (% Daily Value)" : positive,
        "Carbohydrates" : positive,
        "Carbohydrates (% Daily Value)" : positive,
        "Dietary Fiber" : positive,
        "Dietary Fiber (% Daily Value)" : positive,
        "Sugars" : positive,
        "Protein" : positive,
        "Vitamin A (% Daily Value)" : number,
        "Vitamin B (% Daily Value)" : number,
        "Vitamin C (% Daily Value)" : number,
        "Vitamin D (% Daily Value)" : number,
        "Vitamin E (% Daily Value)" : number,
        "Calcium (% Daily Value)" : number,
        "Iron (% Daily Value)" : number,
        "Potassium (% Daily Value)" : number
    }
};

const schemas = {
    McDonalds : new mongoose.Schema(jsons.McDonalds)
};

(function customize(schema) {

})(schemas.McDonalds);

const models = {
    McDonalds : mongoose.model("McDonalds", schemas.McDonalds)
};

module.exports = {
    models, schemas, jsons
};
