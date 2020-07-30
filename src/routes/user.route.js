import app from "express";
import permission from "permission";
import passport from "passport";
import UserController from "../controllers/User.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router.route("/").get(UserController.redirectToLogin);
router
	.route("/login")
	.get(UserController.isLoggedIn, UserController.getLogin)
	.post(UserController.validator("login"), UserController.loginUser);
router
	.route("/register")
	.get(UserController.isLoggedIn, UserController.getRegistration)
	.post(UserController.validator("register"), UserController.registerUser);
router
	.route("/forgot")
	.get(UserController.isLoggedIn, UserController.getForgotPassword)
	.post(
		UserController.isLoggedIn,
		UserController.validator("forgot password"),
		UserController.forgotPassword
	);
router
	.route("/reset/:token")
	.get(UserController.isLoggedIn, UserController.getResetPassword)
	.post(
		UserController.isLoggedIn,
		UserController.validator("reset password"),
		UserController.resetPassword
	);
router.route("/verify/:email/:hash").get(UserController.verifyUser);
router
	.route("/logout")
	.get(UserController.isAuthenticated, UserController.logoutUser);
router
	.route("/delete/:id")
	.get(
		UserController.isAuthenticated,
		permission(["freelancer", "employer"]),
		UserController.deleteUser
	);
router
	.route("/status")
	.put(
		UserController.isAuthenticated,
		UserController.changeAvailabilityStatus
	);
router
	.route("/verification/:id")
	.get(
		UserController.isAuthenticated,
		permission(["admin"]),
		UserController.changeVerificationStatus
	);

//
// ─── OAUTH BREAKPOINTS ─────────────────────────────────────────────────────────────
//
// 1- Google
router
	.route("/google")
	.get(passport.authenticate("google", { scope: "profile email" }));
router
	.route("/google/redirect")
	.get(
		passport.authenticate("google", { failureRedirect: "/auth/login" }),
		UserController.oauthRedirect
	);
// 2- FaceBook
router
	.route("/facebook")
	.get(
		passport.authenticate("facebook", {
			scope: ["email", "public_profile"],
		})
	);
router
	.route("/facebook/redirect")
	.get(
		passport.authenticate("facebook", { failureRedirect: "/auth/login" }),
		UserController.oauthRedirect
	);
// 3- Unlink OAuth providers
router
	.route("/unlink/:provider")
	.get(UserController.isAuthenticated, UserController.getOauthUnlink);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
