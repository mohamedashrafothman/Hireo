import passport from "passport";
import LocalStrategy from "passport-local";
import FacebookStrategy from "passport-facebook";
import GoogleStrategy from "passport-google-oauth20";

import User from "../models/User.model";
import UserService from "../services/User";
import UserController from "../controllers/User.controller";

const userService = new UserService(User);

//
// ─── SERIALIZE AND DESERLIALZE ──────────────────────────────────────────────────
//
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
	const userDeserializeResponse = await userService.deserialize(id);
	done(userDeserializeResponse.errors, userDeserializeResponse.data);
});

//
// ─── SIGN IN USING EMAIL AND PASSWORD ───────────────────────────────────────────
//
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, UserController.passportLocalStrategy));

//
// ─── SIGN IN USING FACEBOOK ─────────────────────────────────────────────────────
//
passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_CLIENT_ID,
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL,
	profileFields: ["name", "email", "link", "locale", "timezone", "gender"],
	passReqToCallback: true
}, UserController.passportFacebookStrategy));

//
// ─── SIGN IN USING GOOGLE ───────────────────────────────────────────────────────
//
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL,
	scope: ["r_basicprofile", "r_emailaddress"],
	passReqToCallback: true
}, UserController.passportGoogleStrategy));
