const express = require("express") ;
const {createProduct , getAllProduct , UpdateProductById , DeleteProductById , getProductById , getProductByPrice , CommentOnPost , DeleteComment , getOtherUserProducts} = require("../Controllers/ProductController");
const ProductRouter = express.Router();
const Protect = require("../Middleware/AuthMiddleware")

ProductRouter.route("/create-product").post(Protect,createProduct);
ProductRouter.route("/get-all-product").get(Protect,getAllProduct);
ProductRouter.route("/update-product/:id").put(Protect,UpdateProductById);
ProductRouter.route("/delete-product/:id").delete(Protect,DeleteProductById);
ProductRouter.route("/get-product-by-id/:id").get(Protect,getProductById);
ProductRouter.route("/filter-product-by-price").get(Protect,getProductByPrice);
ProductRouter.route("/comment-on-product").post(Protect,CommentOnPost);
ProductRouter.route("/delete-comment").post(Protect,DeleteComment);
ProductRouter.route("/get-all-user-products").get(Protect,getOtherUserProducts);

module.exports =  ProductRouter;