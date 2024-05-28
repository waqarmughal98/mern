const express = require("express")
const { signup , login , logout , ChangePassword , deleteUser , sendOTP , verifyOTP , resetPassword } = require("../Controllers/UserController")
const AuthRouter = express.Router();
const Protect = require("../Middleware/AuthMiddleware")

AuthRouter.route("/signup").post(signup)
AuthRouter.route("/login").post(login)
AuthRouter.route("/logout").post(Protect,logout)
AuthRouter.route("/change-password").post(Protect,ChangePassword)
AuthRouter.route("/delete-user").delete(Protect,deleteUser)
AuthRouter.route("/send-otp").post(sendOTP)
AuthRouter.route("/verify-otp").post(verifyOTP)
AuthRouter.route("/reset-password").post(resetPassword)

module.exports = AuthRouter