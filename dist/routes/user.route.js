"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _permission = _interopRequireDefault(require("permission"));

var _passport = _interopRequireDefault(require("passport"));

var _User = _interopRequireDefault(require("../controllers/User.controller"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route("/").get(_User["default"].redirectToLogin);
router.route("/login").get(_User["default"].isLoggedIn, _User["default"].getLogin).post(_User["default"].validator("login"), _User["default"].loginUser);
router.route("/register").get(_User["default"].isLoggedIn, _User["default"].getRegistration).post(_User["default"].validator("register"), _User["default"].registerUser);
router.route("/forgot").get(_User["default"].isLoggedIn, _User["default"].getForgotPassword).post(_User["default"].isLoggedIn, _User["default"].validator("forgot password"), _User["default"].forgotPassword);
router.route("/reset/:token").get(_User["default"].isLoggedIn, _User["default"].getResetPassword).post(_User["default"].isLoggedIn, _User["default"].validator("reset password"), _User["default"].resetPassword);
router.route("/verify/:email/:hash").get(_User["default"].verifyUser);
router.route("/logout").get(_User["default"].isAuthenticated, _User["default"].logoutUser);
router.route("/delete/:id").get(_User["default"].isAuthenticated, _User["default"].deleteUser);
router.route("/status").put(_User["default"].isAuthenticated, _User["default"].changeAvailabilityStatus);
router.route("/verification/:id").get(_User["default"].isAuthenticated, (0, _permission["default"])(["admin"]), _User["default"].changeVerificationStatus); //
// ─── OAUTH BREAKPOINTS ─────────────────────────────────────────────────────────────
//
// 1- Google

router.route("/google").get(_passport["default"].authenticate("google", {
  scope: "profile email"
}));
router.route("/google/redirect").get(_passport["default"].authenticate("google", {
  failureRedirect: "/auth/login"
}), _User["default"].oauthRedirect); // 2- FaceBook

router.route("/facebook").get(_passport["default"].authenticate("facebook", {
  scope: ["email", "public_profile"]
}));
router.route("/facebook/redirect").get(_passport["default"].authenticate("facebook", {
  failureRedirect: "/auth/login"
}), _User["default"].oauthRedirect); // 3- Unlink OAuth providers

router.route("/unlink/:provider").get(_User["default"].isAuthenticated, _User["default"].getOauthUnlink); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;