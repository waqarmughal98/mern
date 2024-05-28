const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type : String,
        required : [true , "Name is required"],
        maxlength: [60, "Name must be less than or equal to 60 characters"]
    },
    price: {
        type : Number,
        required : [true , "Price is required"],
        validate: {
            validator: function(v) {
                return v.toString().length <= 15;
            },
            message: props => `${props.value} is not a valid price. Price must be at most 15 digits long.`
        }
    },
    rating: {
        type : Number,
        default : 3.8,
        max: [5, "Rating must not exceed 5"]
    },
    company: {
        type : String,
        enum : {
            values : ["apple" , "samsung", "dell", "mi"],
            message: props => `${props.value} is not supported`
        },
        required : [true , "company name is required"],
        maxlength: [60, "Company name must be less than or equal to 60 characters"]
    },
    Created_At : {
        type : Date,
        default : Date.now
    },
    userId:{
        type : String,
    },
    userName:{
        type : String,
    },
    userEmail:{
        type : String,
    },
    comments : {
        type: Array
    }
});

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
