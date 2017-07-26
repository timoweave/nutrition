"use strict";

const mongoose = require("mongoose");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

const string = {type: String, required: true};
const number = {type: Number, required: true};
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
        "Calories" : number,
        "Calories from Fat" : number,
        "Total Fat" : number,
        "Total Fat (% Daily Value)" : number,
        "Saturated Fat" : number,
        "Saturated Fat (% Daily Value)" : number,
        "Trans Fat" : number,
        "Cholesterol" : number,
        "Cholesterol (% Daily Value)" : number,
        "Sodium" : number,
        "Sodium (% Daily Value)" : number,
        "Carbohydrates" : number,
        "Carbohydrates (% Daily Value)" : number,
        "Dietary Fiber" : number,
        "Dietary Fiber (% Daily Value)" : number,
        "Sugars" : number,
        "Protein" : number,
        "Vitamin A (% Daily Value)" : number,
        "Vitamin C (% Daily Value)" : number,
        "Calcium (% Daily Value)" : number,
        "Iron (% Daily Value)" : number
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
