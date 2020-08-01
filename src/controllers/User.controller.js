import { body, validationResult } from "express-validator";
import { assignIn, isEmpty } from "lodash";
import qs from "qs";
import to from "await-to-js";
import path from "path";
import multer from "multer";
import passport from "passport";

import Controller from "../utilities/Controller";

import User from "../models/User.model";
import Email from "../models/Email.model";
import Skill from "../models/Skill.model";
import Session from "../models/Session.model";
import Nationality from "../models/Nationality.model";
import Attachment from "../models/Attachment.model";
import Conversation from "../models/Conversation.model";

import UserService from "../services/User";
import EmailService from "../services/Email";
import SkillService from "../services/Skill";
import SessionService from "../services/Session";
import NationalityService from "../services/Nationality";
import AttachmentService from "../services/Attachment";
import ConversationService from "../services/Conversation";

const userService = new UserService(User);
const emailService = new EmailService(Email);
const skillService = new SkillService(Skill);
const sessionService = new SessionService(Session);
const nationalityService = new NationalityService(Nationality);
const conversationService = new ConversationService(Conversation);
const avatarAttachmentService = new AttachmentService(Attachment);
const profileInfoAttachmentService = new AttachmentService(Attachment);

class UserController extends Controller {
	constructor(service) {
		super(service);
		this.getOauthUnlink = this.getOauthUnlink.bind(this);
		this.getUserProfilePage = this.getUserProfilePage.bind(this);
		this.registerUser = this.registerUser.bind(this);
		this.verifyUser = this.verifyUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
		this.resetPassword = this.resetPassword.bind(this);
		this.logoutUser = this.logoutUser.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
		this.changeAvailabilityStatus = this.changeAvailabilityStatus.bind(this);
		this.passportLocalStrategy = this.passportLocalStrategy.bind(this);
		this.passportGoogleStrategy = this.passportGoogleStrategy.bind(this);
		this.passportFacebookStrategy = this.passportFacebookStrategy.bind(this);
		this.getSettings = this.getSettings.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updateAccountInfo = this.updateAccountInfo.bind(this);
		this.updateProfileInfo = this.updateProfileInfo.bind(this);
		this.removeProfileAttachment = this.removeProfileAttachment.bind(this);
		this.bookmarkUser = this.bookmarkUser.bind(this);
		this.getBookmarkList = this.getBookmarkList.bind(this);
		this.usersList = this.usersList.bind(this);
		this.changeVerificationStatus = this.changeVerificationStatus.bind(this);
		this.getCompaniesByFirstLetter = this.getCompaniesByFirstLetter.bind(this);
		this.getFreelancers = this.getFreelancers.bind(this);
	}

	validator(method) {
		switch (method) {
		case "register":
			return [
				body("email")
					.notEmpty().withMessage("Email must supply an E-mail.")
					.isEmail()
					.withMessage("Email must be in an E-mail format.")
					.trim()
					.normalizeEmail(),
				body("role")
					.notEmpty().withMessage("You must choose an account type!"),
				body("account.name")
					.notEmpty().withMessage("You must supply a name!")
					.trim()
					.escape(),
				body("account.username")
					.notEmpty().withMessage("You must supply a username!")
					.trim()
					.escape(),
				body("password")
					.notEmpty().withMessage("Password can't be blank!")
					.isLength({ min: Number(process.env.MINIMUM_PASSWORD_LENGTH) })
					.withMessage(`Password must be at least ${Number(process.env.MINIMUM_PASSWORD_LENGTH)} chars long`)
					.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
					.withMessage("Password must include one lowercase character, one uppercase character, a number, and a special character."),
				body("confirmPassword")
					.notEmpty().withMessage("Confirm password cannot be blank!")
					.custom((value, { req }) => (value === req.body.password))
					.withMessage("Your passwords don't match!")
			];
		case "login":
			return [
				body("email")
					.notEmpty().withMessage("You must be supply an Email!")
					.isEmail()
					.withMessage("Email must be in an E-mail format.")
					.trim()
					.normalizeEmail(),
				body("password").notEmpty().withMessage("Password cannot be Blank!"),
				body("remember").optional().toBoolean()
			];
		case "forgot password":
			return [
				body("email")
					.notEmpty().withMessage("You must be supply an Email!")
					.isEmail()
					.withMessage("Email must be in an E-mail format.")
					.trim()
					.normalizeEmail()
			];
		case "reset password":
			return [
				body("password")
					.notEmpty().withMessage("Password can't be blank!")
					.isLength({ min: Number(process.env.MINIMUM_PASSWORD_LENGTH) })
					.withMessage(`Password must be at least ${Number(process.env.MINIMUM_PASSWORD_LENGTH)} chars long`)
					.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
					.withMessage("Password must include one lowercase character, one uppercase character, a number, and a special character."),
				body("confirmPassword")
					.notEmpty().withMessage("Confirm password cannot be blank!")
					.custom((value, { req }) => (value === req.body.password))
					.withMessage("Your passwords don't match!")
			];
		case "account info":
			return [
				body("account.name")
					.notEmpty().withMessage("Name field can't be blank.")
					.trim()
					.escape(),
				body("account.username")
					.notEmpty().withMessage("Username field can't be blank.")
					.trim()
					.escape(),
			];
		case "profile info":
			return [
				body("profile.description")
					.notEmpty().withMessage("Description field can't be blank!")
					.isLength({ max: 500 })
					.withMessage("Description can't be more that 500 letter.")
					.trim()
					.escape(),
				body("profile.tagline")
					.notEmpty().withMessage("Tagline field can't be blank!")
					.trim()
					.escape(),
				body("profile.nationality")
					.notEmpty().withMessage("Nationality field can't be blank!"),
				body("profile.hourly_rate")
					.if((value, { req }) => (req.user.role !== "admin" || req.user.role !== "employer"))
					.notEmpty().withMessage("Hourly Rate field can't be blank!")
					.isInt({ min: 5, max: 300 })
					.withMessage("Hourly Rate shall be between 5$ and 200$"),
				body("profile.skills")
					.if((value, { req }) => (req.user.role !== "admin" || req.user.role !== "employer"))
					.notEmpty().withMessage("Skills field can't be blank!")
					.isArray({ min: 1, max: 10 })
					.withMessage("Skills count shall be between 1 and 10")
			];
		default:
			return [];
		}
	}

	async redirectToLogin(req, res) {
		res.redirect("/auth/login");
	}

	async isLoggedIn(req, res, next) {
		// checking fo user if logged in, if so return to home page
		if (req.user) return res.redirect("/");
		next();
	}

	async getRegistration(req, res) {
		res.render("auth/register", { page_title: "register" });
	}

	async getLogin(req, res) {
		res.render("auth/login", { page_title: "login" });
	}

	async getForgotPassword(req, res) {
		res.render("auth/forgot", { page_title: "Forgot Password" });
	}

	async getResetPassword(req, res) {
		res.render("auth/reset-password", { title: "Reset Password" });
	}

	async getOauthUnlink(req, res, next) {
		const { provider } = req.params;
		const userUnlinkResponse = await this.service.updateOne(
			{ _id: "5e60390a9557170448f39503" },
			{
				$set: {
					[provider]: undefined
				},
				$pull: {
					tokens: {
						kind: provider
					}
				}
			}
		);
		if (userUnlinkResponse.error) return next(userUnlinkResponse.errors);

		req.flash("success", `${provider} account has been unlinked.`);
		res.status(userUnlinkResponse.statusCode).redirect(`/auth/profile/${userUnlinkResponse.data.slug}`);
	}

	async getUserProfilePage(req, res, next) {
		const old = (req.session.data && req.session.data.old) ? req.session.data.old : null;
		req.session.data = null;

		const userBySlugResponse = await this.service.getUserBySlug(req.params.slug);
		if (userBySlugResponse.error) {
			if (userBySlugResponse.statusCode === 404) return next();
			return next(userBySlugResponse.errors);
		}

		res.render("profile", {
			page_title: `${userBySlugResponse.data.account.name} Profile`,
			data: {
				user: userBySlugResponse.data,
				old
			}
		});
	}

	async oauthRedirect(req, res) {
		req.flash("success", "Successfully login process.");
		res.redirect("/");
	}

	async registerUser(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.render("auth/register", {
				page_title: "Register",
				data: {
					old: req.body,
				},
				flashes: req.flash(),
			});
		}

		const userRegisterResponse = await this.service.register(req.body);
		if (userRegisterResponse.error) {
			if (userRegisterResponse.statusCode === 202) {
				req.flash("error", userRegisterResponse.errors);
				return res.status(userRegisterResponse.statusCode).redirect("/auth/register");
			}
			return next(userRegisterResponse.errors);
		}

		const userValidateEmailResponse = await emailService.send({
			subject: `[${process.env.SITE_NAME}] Verify User Account`,
			validateURL: `http://${req.headers.host}/auth/verify/${userRegisterResponse.data.email}/${userRegisterResponse.data.hash}`,
			to: userRegisterResponse.data,
			filename: "verify-user",
			from: String(process.env.MAIL_SENDER)
		});
		if (userValidateEmailResponse.error) return next(userValidateEmailResponse.errors);

		req.flash("success", "You are registration process, Check your E-mail address to verify your account before you login.");
		res.status(userValidateEmailResponse.statusCode).redirect("/");
	}

	async verifyUser(req, res, next) {
		const userVerifyResponse = await this.service.verify(req.params);
		if (userVerifyResponse.error) {
			if (userVerifyResponse.statusCode === 404) {
				req.flash("error", userVerifyResponse.errors);
				return res.status(userVerifyResponse.statusCode).redirect("/auth/register");
			}
			return next(userVerifyResponse.errors);
		}

		req.flash("success", "Your account has been Verified");
		res.status(userVerifyResponse.statusCode).redirect("/auth/login");
	}

	async loginUser(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.render("auth/login", {
				page_title: "login",
				data: {
					old: req.body,
				},
				flashes: req.flash(),
			});
		}

		passport.authenticate("local", async (err, user, info) => {
			if (err) next(err);
			if (!user) {
				req.flash("error", info);
				return res.render("auth/login", {
					page_title: "login",
					data: {
						old: req.body,
					},
					flashes: req.flash(),
				});
			}

			req.login(user, async (loginError) => {
				if (loginError) return next();

				if (req.body.remember) {
					const expire = 1000 * 60 * 60 * process.env.COOKIES_MAX_AGE_IN_HOURS;
					req.session.cookie.expires = new Date(Date.now() + expire);
					req.session.cookie.maxAge = expire;
				} else {
					req.session.cookie.expires = false;
				}

				// updated logged in user.
				const userUpdateResponse = await this.service.updateOne({ email: user.email, is_active: 0 }, { $set: { is_active: 1 } });
				if (userUpdateResponse.error) return next(userUpdateResponse.errors);

				// Get logged in user data.
				const userUpdatedResponse = await this.service.readOne({ _id: user._id });
				if (userUpdatedResponse.error) return next(userUpdatedResponse.errors);

				// Get all conversations belongs to user.
				const conversationsReadResponse = await conversationService.readMany({ users: userUpdatedResponse.data._id }, { pagination: false, select: "_id" });
				if (conversationsReadResponse.error) return next(conversationsReadResponse.errors);

				// Emit to user conversations channels, to notify other users.
				if (!isEmpty(conversationsReadResponse.data)) {
					const { io } = req.app.get("io");
					conversationsReadResponse.data.forEach((conversation) => {
						io.sockets.in(conversation._id).emit("user/change_online_status", {
							id: userUpdatedResponse.data._id,
							is_active: userUpdatedResponse.data.is_active,
							name: userUpdatedResponse.data.account.name
						});
					});
				}

				const returnTo = req.session.returnTo || "/";

				req.flash("success", "Successfully login process.");
				res.status(userUpdateResponse.statusCode).redirect(returnTo);
			});
		})(req, res, next);
	}

	async forgotPassword(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.render("auth/forgot", {
				page_title: "Forgot Password",
				data: {
					old: req.body,
				},
				flashes: req.flash(),
			});
		}

		const userForgotPasswordResponse = await this.service.forgotPassword(req.body);
		if (userForgotPasswordResponse.error) {
			if (userForgotPasswordResponse.statusCode === 404) {
				req.flash("error", userForgotPasswordResponse.errors);
				res.status(userForgotPasswordResponse.statusCode).redirect("/auth/forgot");
			}
			return next(userForgotPasswordResponse.errors);
		}

		const userUpdatePasswordEmailResponse = await emailService.send({
			subject: `[${process.env.SITE_NAME}] Resetting Password.`,
			resetURL: `http://${req.headers.host}/auth/reset/${userForgotPasswordResponse.data.resetPasswordToken}`,
			to: userForgotPasswordResponse.data,
			filename: "password-reset",
			from: String(process.env.MAIL_SENDER)
		});
		if (userUpdatePasswordEmailResponse.error) {
			return next(userUpdatePasswordEmailResponse.errors);
		}

		req.flash("success", "You have been emailed a password link.");
		res.status(userUpdatePasswordEmailResponse.statusCode).redirect("/auth/login");
	}

	async resetPassword(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.render("auth/reset-password", {
				page_title: "reset password",
				data: {
					old: req.body,
				},
				flashes: req.flash(),
			});
		}

		const userResetPasswordResponse = await this.service.resetPassword(req.body, req.params);
		if (userResetPasswordResponse.error) {
			if (userResetPasswordResponse.statusCode === 404) {
				req.flash("error", userResetPasswordResponse.errors);
				return res.status(userResetPasswordResponse.statusCode).redirect("/auth/login");
			}
			return next(userResetPasswordResponse.errors);
		}

		const userResetPasswordEmailResponse = await emailService.send({
			filename: "password-updated",
			subject: `[${process.env.SITE_NAME}] Resetting Password Confirmation.`,
			to: userResetPasswordResponse.data,
			from: String(process.env.MAIL_SENDER),
			email: userResetPasswordResponse.data.email,
			siteName: process.env.SITE_NAME,
		});
		if (userResetPasswordEmailResponse.error) {
			return next(userResetPasswordEmailResponse.errors);
		}

		req.flash("success", "successfully updated password");
		res.status(userResetPasswordEmailResponse.statusCode).redirect("/auth/login");
	}

	async logoutUser(req, res, next) {
		const { _id } = req.user;
		const userUpdateResponse = await this.service.updateOne({ _id }, { $set: { is_active: 0 } });
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		req.logout();
		req.user = null;

		// Get all conversations belongs to user.
		const conversationsReadResponse = await conversationService.readMany({ users: userUpdateResponse.data._id }, { pagination: false, select: "_id" });
		if (conversationsReadResponse.error) return next(conversationsReadResponse.errors);

		// Emit to user conversations channels, to notify other users.
		if (!isEmpty(conversationsReadResponse.data)) {
			const { io } = req.app.get("io");
			conversationsReadResponse.data.forEach((conversation) => {
				io.sockets.in(conversation._id).emit("user/change_online_status", {
					id: userUpdateResponse.data._id,
					is_active: userUpdateResponse.data.is_active,
					name: userUpdateResponse.data.account.name
				});
			});
		}

		req.flash("success", "Successfully logout process.");
		res.redirect("/");
	}

	async deleteUser(req, res, next) {
		// Delete user record from user collection.
		const id = req.params.id || req.user._id;
		const userDeleteResponse = await this.service.deleteOne({ _id: id });
		if (userDeleteResponse.error) return next(userDeleteResponse.errors);

		// Remove user from other users bookmark lists.
		const searchInBookmarksResponse = await this.service.updateMany(
			{ _id: { $ne: id }, [`bookmarked.${userDeleteResponse.data.role}`]: userDeleteResponse.data._id },
			{ $pull: { [`bookmarked.${userDeleteResponse.data.role}`]: userDeleteResponse.data._id } }
		);
		if (searchInBookmarksResponse.error) return next(searchInBookmarksResponse.errors);

		// Remove any attachments belongs to user from attachment collection.
		const attachmentService = new AttachmentService(Attachment);
		const userAttachmentDeleteResponse = await attachmentService.deleteMany(
			{ _id: { $in: [...userDeleteResponse.data.profile.attachments, userDeleteResponse.data.account.picture, userDeleteResponse.data.account.picture_sm, userDeleteResponse.data.account.picture_md, userDeleteResponse.data.account.picture_lg].filter(Boolean) } },
			{ pagination: false }
		);
		if (userAttachmentDeleteResponse.error) return next(userAttachmentDeleteResponse.errors);

		// Remove any attachments belongs to user from project folder directory.
		const userAttachmentDeleteFilesResponse = await attachmentService.handelFilesForDirDeletion(userAttachmentDeleteResponse.data.map((attachment) => attachment.path));
		if (userAttachmentDeleteFilesResponse.error) return next(userAttachmentDeleteFilesResponse.errors);

		// Remove user from all skills that he was belongs to it from skills collection.
		const userDeleteSkillsResponse = await skillService.updateMany(
			{ _id: { $in: userDeleteResponse.data.profile.skills } },
			{ $pull: { users: userDeleteResponse.data._id } }
		);
		if (userDeleteSkillsResponse.error) return next(userDeleteSkillsResponse.errors);

		// TODO: Delete all job created by deleted user.
		// TODO: Delete all Applications belongs to deleted job and deleted user.

		req.flash("success", `${userDeleteResponse.data.account.name}'s Account deleted.`);
		res.status(userDeleteResponse.statusCode).redirect("/");
	}

	async changeAvailabilityStatus(req, res, next) {
		const userChangeAvailabilityResponse = await this.service.updateOne(
			{ _id: req.user._id },
			{ $set: { is_active: !req.user.is_active } }
		);
		if (userChangeAvailabilityResponse.error) return next(userChangeAvailabilityResponse.errors);

		// Get all conversations belongs to user.
		const conversationsReadResponse = await conversationService.readMany({ users: userChangeAvailabilityResponse.data._id }, { pagination: false, select: "_id" });
		if (conversationsReadResponse.error) return next(conversationsReadResponse.errors);

		// Emit to user conversations channels, to notify other users.
		if (!isEmpty(conversationsReadResponse.data)) {
			const { io } = req.app.get("io");
			conversationsReadResponse.data.forEach((conversation) => {
				io.sockets.in(conversation._id).emit(userChangeAvailabilityResponse.data.is_active ? "user/change_online_status" : "user/change_online_status", {
					id: userChangeAvailabilityResponse.data._id,
					is_active: userChangeAvailabilityResponse.data.is_active,
					name: userChangeAvailabilityResponse.data.account.name
				});
			});
		}

		res.json(userChangeAvailabilityResponse.data.is_active);
	}

	async isAuthenticated(req, res, next) {
		if (req.isAuthenticated()) return next();
		req.flash("error", "make sure you are logged in first!");
		res.redirect("/auth/login");
	}

	async isAuthorized(req, res, next) {
		const provider = req.path.split("/").slice(-1)[0];
		const token = req.user.tokens.find((userToken) => userToken.kind === provider);
		if (token) {
			next();
		} else {
			res.redirect(`/auth/${provider}`);
		}
	}

	async passportLocalStrategy(email, password, done) {
		const { data: user, errors: err } = await this.service.readOne({ email: email.toLowerCase() });
		if (err) done(err);
		if (!user) return done(null, false, { msg: `Email ${email} not found.` });

		user.comparePassword(password, (comparePasswordError, isMatch) => {
			if (comparePasswordError) return done(comparePasswordError);

			if (isMatch) return done(null, user);

			return done(null, false, {
				msg: "Invalid email or password."
			});
		});
	}

	async passportGoogleStrategy(req, accessToken, refreshToken, profile, done) {
		if (req.user) {
			const { data: existsUser, errors: existsErr } = await this.service.readOne({ google: profile.id });
			if (existsErr) return done(existsErr);
			if (existsUser) {
				req.flash("error", "There is already a Google account that belongs to you");
				req.flash("info", `Redirect to <strong><a href="http://${req.headers.host}/auth/forgot">Forgot Password?</a></strong> to reset your password.`);
				done(existsErr);
			} else {
				const { data: user, errors: err } = await this.service.readOne({ _id: req.user.id });
				if (err) return done(err);

				user.tokens.push({ kind: "google", accessToken });
				user.google = profile.id;
				user.account.username = user.account.username || `${profile.name.givenName} ${profile.name.familyName}` || `${profile._json.name.givenName} ${profile._json.name.familyName}`;
				user.account.name = user.account.name || profile.displayName;
				user.account.picture = user.account.picture || profile._json.image.url;
				user.account.gender = user.account.gender || profile._json.gender;
				user.is_verified = 1;
				user.is_active = 1;
				const [saveError] = await to(user.save());
				if (saveError) return done(saveError);
				req.flash("success", "Google account has been linked.");
				done(saveError, user);
			}
		} else {
			const { data: existsUser, errors: existsErr } = await this.service.readOne({ google: profile.id });
			if (existsErr) return done(existsErr);
			if (existsUser) {
				const { data: updatedUser, errors: updatedErr } = await this.service.updateOne(
					{ _id: existsUser._id },
					{ $set: { is_active: 1, is_verified: 1 } }
				);
				if (updatedErr) return done(updatedErr);
				return done(updatedErr, updatedUser);
			}

			const { data: existsEmail, errors: existsEmailErr } = await this.service.readOne({ email: profile._json.email });
			if (existsEmailErr) return done(existsEmailErr);
			if (existsEmail) {
				req.flash("error", "There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.");
				req.flash("info", `Redirect to <a href="http://${req.headers.host}/auth/forgot">Forgot Password?</a> page to reset your password.`);
				done(existsEmailErr);
			} else {
				const user = {
					tokens: [{ kind: "google", accessToken }],
					email: profile.emails[0].value,
					google: profile.id,
					account: {
						username: `${profile.name.givenName} ${profile.name.familyName}` || `${profile._json.name.givenName} ${profile._json.name.familyName}`,
						name: profile.displayName,
						picture: profile._json.image ? profile._json.image.url : profile._json.picture,
						gender: profile._json.gender || profile.gender
					},
					is_active: 1,
					is_verififed: 1
				};

				const { data: newUser, errors: newUserErr } = await this.service.create(user);
				done(newUserErr, newUser);
			}
		}
	}

	async passportFacebookStrategy(req, accessToken, refreshToken, profile, done) {
		if (req.user) {
			const { data: existsUser, errors: existsErr } = await this.service.readOne({ facebook: profile.id });
			if (existsErr) return done(existsErr);
			if (existsUser) {
				req.flash("error", "There is already a Facebook account that belongs to you. Sign in with that account then link it with your current account.");
				req.flash("info", `Redirect to <strong><a href="http://${req.headers.host}/auth/forgot">Forgot Password?</a></strong> page to reset your password.`);
				done(existsErr);
			} else {
				const { data: user, erorrs: err } = await this.service.readOne({ _id: req.user.id });
				if (err) return done(err);

				user.tokens.push({ kind: "facebook", accessToken });
				user.facebook = profile.id;
				user.account.gender = user.account.gender || profile._json.gender;
				user.account.name = user.account.name || `${profile.name.givenName} ${profile.name.familyName}`;
				user.account.picture = user.account.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
				user.is_verified = 1;
				user.is_active = 1;

				const [saveError] = await to(user.save());
				if (saveError) return done(saveError);
				req.flash("success", "Facebook account has been linked.");
				done(null, user);
			}
		} else {
			const { data: existsUser, errors: existsErr } = await this.service.readOne({ facebook: profile.id });
			if (existsErr) return done(existsErr);
			if (existsUser) {
				const { data: updatedUser, errors: updatedErr } = await this.service.updateOne(
					{ _id: existsUser._id },
					{ $set: { is_active: 1, is_verified: 1 } }
				);
				if (updatedErr) return done(updatedErr);
				return done(updatedErr, updatedUser);
			}

			const { data: existsEmail, errors: existsEmailErr } = await this.service.readOne({ email: profile._json.email });
			if (existsEmailErr) return done(existsEmailErr);
			if (existsEmail) {
				req.flash("error", "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.");
				req.flash("info", `Redirect to <strong><a href="http://${req.headers.host}/auth/forgot">Forgot Password?</a></strong> to reset your password.`);
				done(null);
			} else {
				const user = {
					tokens: [{ kind: "facebook", accessToken }],
					email: profile._json.email,
					facebook: profile.id,
					gender: profile.gender || profile._json.gender,
					account: {
						username: profile.username || `${profile.name.givenName} ${profile.name.middleName} ${profile.name.familyName}` || `${profile._json.first_name} ${profile._json.middle_name} ${profile._json.last_name}`,
						name: `${profile.name.givenName} ${profile.name.familyName}`,
						picture: `https://graph.facebook.com/${profile.id}/picture?type=large`
					},
					is_active: 1,
					is_verified: 1
				};
				const { data: newUser, errors: newUserErr } = await this.service.create(user);
				done(newUserErr, newUser);
			}
		}
	}

	async getSettings(req, res, next) {
		const { data: skills, error: skillsError, errors: skillsErrors } = await skillService.readMany({}, { pagination: false, select: "_id name" });
		if (skillsError) return next(skillsErrors);

		const { data: nations, error: nationsError, errors: nationsErrors } = await nationalityService.readMany({}, { pagination: false, select: "_id name" });
		if (nationsError) return next(nationsErrors);


		const { data: user, error: userError, errors: userErrors } = await this.service.getSettingsUserData(req.user._id);
		if (userError) return next(userErrors);

		res.render("dashboard/settings", {
			page_title: "Settings",
			data: { user, skills, nations }
		});
	}

	async updatePassword(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.redirect("back");
		}

		const { id } = req.params;
		const { io } = req.app.get("io");

		const userUpdatePasswordResponse = await this.service.updatePassword(id, req.body);
		if (userUpdatePasswordResponse.error) {
			if (userUpdatePasswordResponse.statusCode === 404) {
				req.flash("error", userUpdatePasswordResponse.errors);
				res.status(userUpdatePasswordResponse.statusCode).redirect("/");
			}
			return next(userUpdatePasswordResponse.errors);
		}

		const userUpdatePasswordEmailResponse = await emailService.send({
			filename: "password-updated",
			subject: `[${process.env.SITE_NAME}] Updating Password Confirmation.`,
			to: userUpdatePasswordResponse.data,
			from: String(process.env.MAIL_SENDER),
			email: userUpdatePasswordResponse.data.email,
			siteName: process.env.SITE_NAME,
		});
		if (userUpdatePasswordEmailResponse.error) return next(userUpdatePasswordEmailResponse.errors);

		if (req.body.loggingOutFromOtherDevices) {
			const sessionsReadResponse = await sessionService.deleteMany({ "session.passport.user": String(id) }, { pagination: false });
			if (sessionsReadResponse.error) return next(sessionsReadResponse.errors);
			sessionsReadResponse.data = sessionsReadResponse.data.map((data) => JSON.parse(JSON.stringify(data)));

			// reload all other devices, using socket id.
			const otherDevicesSockets = sessionsReadResponse.data
				.map((current) => current.session.socketio)
				.filter((current) => current !== req.session.socketio);
			otherDevicesSockets.forEach((socket) => {
				io.sockets.to(socket).emit("user/logout_from_devices");
			});
		}

		req.flash("success", "successfully updated password");
		res.status(userUpdatePasswordEmailResponse.statusCode).redirect("back");
	}

	async uploadAvatar(req, res, next) {
		const storageEngine = avatarAttachmentService.initStorageEngine({
			responsive: true,
			accept: ["image"],
			fileHashName: true,
			quality: 2,
			upload_path: `${process.env.UPLOAD_STORAGE}/avatars/${req.user._id}`,
			upload_base_path: `/${req.user._id}`
		});

		const avatarUpload = multer({
			storage: storageEngine,
			limits: {
				files: 1, // allow only 1 file per request
				fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB), // 5 MB (max file size)
			},
			fileFilter: (request, file, cb) => {
				// supported image file mimetypes
				const isFileTypeValid = storageEngine.options.accept.includes(file.mimetype.split("/")[0]);
				if (isFileTypeValid) {
					// allow supported image files
					cb(null, true);
				} else {
					// throw error for invalid files
					cb(new Error("That fileType isn't allowed! "));
				}
			}
		});

		avatarUpload.array("avatar")(req, res, async (err) => {
			if (err) {
				req.flash("error", err.message);
				return res.redirect("back");
			}
			req.body.files = req.files;
			next();
		});
	}

	async updateAccountInfo(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.redirect("back");
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = avatarAttachmentService.handelFilesForDBCreation(req.body.files, base)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await avatarAttachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data);
			}

			req.body = {
				...req.body,
				"account.picture_lg": avatarAttachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id : null,
				"account.picture_md": avatarAttachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_md\.(.+)$/i))[0]._id : null,
				"account.picture_sm": avatarAttachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_sm\.(.+)$/i))[0]._id : null,
				"account.picture": avatarAttachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id : savedAttachments[0]._id
			};
		}


		const userUpdateAccountInfoResponse = await this.service.updateOne({ _id: req.params.id }, { $set: req.body });
		if (userUpdateAccountInfoResponse.error) return next(userUpdateAccountInfoResponse.errors);

		req.flash("success", "successfully updated your account data.");
		res.status(userUpdateAccountInfoResponse.statusCode).redirect("/dashboard/settings");
	}

	async uploadAttachments(req, res, next) {
		const storageEngine = profileInfoAttachmentService.initStorageEngine({
			accept: ["application", "image"],
			square: false,
			fileHashName: false,
			upload_path: `${process.env.UPLOAD_STORAGE}/freelancers-attachments/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${req.user._id}`,
			upload_base_path: `/${req.user._id}`
		});

		const attachmentUpload = multer({
			storage: storageEngine,
			limits: {
				files: 2, // allow only 2 files per request
				fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB), // 5 MB (max file size)
			},
			fileFilter: (request, file, cb) => {
				// supported image file mimetypes
				const isFileTypeValid = storageEngine.options.accept.includes(file.mimetype.split("/")[0]);
				if (isFileTypeValid) {
					// allow supported image files
					cb(null, true);
				} else {
					// throw error for invalid files
					cb(new Error("That fileType isn't allowed! "));
				}
			}
		});

		attachmentUpload.array("attachments")(req, res, async (err) => {
			if (err) {
				req.flash("error", err.message);
				return res.redirect("back");
			}
			req.body.files = req.files;
			next();
		});
	}

	async updateProfileInfo(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.redirect("back");
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = profileInfoAttachmentService.handelFilesForDBCreation(req.body.files, base);

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await profileInfoAttachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data[0]);
			}
			req.body = {
				...req.body,
				"profile.attachments": [...req.user.profile.attachments, ...savedAttachments.map((attach) => attach._id)]
			};
		}


		const userUpdateProfileInfoResponse = await this.service.updateOne({ _id: req.params.id }, { $set: req.body });
		if (userUpdateProfileInfoResponse.error) return next(userUpdateProfileInfoResponse.errors);

		const skillsRemoveUserResponse = await skillService.updateMany({ users: req.params.id }, { $pull: { users: req.params.id } });
		if (skillsRemoveUserResponse.error) return next(skillsRemoveUserResponse.errors);

		const skillsAddUserResponse = await skillService.updateMany(
			{ _id: { $in: userUpdateProfileInfoResponse.data.profile.skills } },
			{ $addToSet: { users: userUpdateProfileInfoResponse.data._id } }
		);
		if (skillsAddUserResponse.error) return next(skillsAddUserResponse.errors);

		req.flash("success", "successfully updated your account data.");
		res.status(userUpdateProfileInfoResponse.statusCode).redirect("/dashboard/settings");
	}

	async removeProfileAttachment(req, res, next) {
		const attachmentService = new AttachmentService(Attachment);
		const attachmentDeleteRespose = await attachmentService.deleteOne(
			{ _id: req.params.attachment }
		);
		if (attachmentDeleteRespose.error) return next(attachmentDeleteRespose.errors);

		const attachmentDeleteFilesResponse = await attachmentService.handelFilesForDirDeletion([attachmentDeleteRespose.data.path]);
		if (attachmentDeleteFilesResponse.error) return next(attachmentDeleteFilesResponse.errors);

		const userUpdateProfileAttachment = await this.service.updateOne(
			{ _id: req.params.id, "profile.attachment": attachmentDeleteRespose.data._id },
			{ $pull: { "profile.attachment": attachmentDeleteRespose.data._id } }
		);
		if (userUpdateProfileAttachment.error) return next(userUpdateProfileAttachment.errors);

		req.flash("success", "Attachment removed successfully.");
		res.status(userUpdateProfileAttachment.statusCode).redirect("back");
	}

	async downloadProfileAttachment(req, res, next) {
		const { attachment } = req.params;
		const attachmentDownloadResponse = await profileInfoAttachmentService.readOne({ _id: attachment });
		if (attachmentDownloadResponse.error) return next(attachmentDownloadResponse.errors);

		const storage_path_array = process.env.UPLOAD_STORAGE.split("");
		const storage_path = storage_path_array.slice(0, storage_path_array.length - 1).join("/");
		res.download(path.resolve(__dirname, `../../${storage_path}`, attachmentDownloadResponse.data.path), attachmentDownloadResponse.data.name);
	}

	async bookmarkUser(req, res, next) {
		const { type, id } = req.params;
		const bookmarked = req.user.bookmarked[type].map((obj) => obj.toString());
		const operator = bookmarked.includes(id) ? "$pull" : "$addToSet";

		const userBookmarkResponse = await this.service.updateOne(
			{ _id: req.user._id },
			{ [operator]: { [`bookmarked.${type}`]: id } }
		);
		if (userBookmarkResponse.error) return next(userBookmarkResponse.errors);

		res.status(userBookmarkResponse.statusCode).json(userBookmarkResponse.data.bookmarked[type]);
	}

	async getBookmarkList(req, res, next) {
		const userBookmarkedList = await this.service.getBookmarked(req.user._id);
		if (userBookmarkedList.error) return next(userBookmarkedList.errors);

		// return res.json(userBookmarkedList.data);
		res.render("dashboard/bookmarks", {
			page_title: "My Bookmarks",
			data: userBookmarkedList.data
		});
	}

	async usersList(req, res, next) {
		const { page = 1 } = req.query;
		const query = {
			...(req.query?.q && {
				$or: [
					{ email: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ role: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "account.name": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "account.username": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "account.gender": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "account.website": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "profile.tagline": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "profile.description": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
				]
			}),
			role: { $nin: ["admin"] }
		};

		const options = {
			populate: [
				{ path: "profile.nationality" },
				{ path: "profile.skills" },
				{ path: "account.picture account.picture_sm account.picture_md account.picture_lg" }
			],
			...req.query,
			page
		};
		const userListResponse = await this.service.readMany(query, options);
		if (userListResponse.error) return next(userListResponse.errors);

		if (!userListResponse.data.length && userListResponse.offset === undefined && userListResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${page}. But that dosen't exist. So i put you on page ${userListResponse.pages}.`);
			return res.status(userListResponse.statusCode).redirect(`/dashboard/users/list?page=${userListResponse.pages}`);
		}

		res.render("dashboard/users/list", {
			page_title: "Manage All Users",
			...userListResponse,
			data: { users: userListResponse.data },
			query: req.query
		});
	}

	async changeVerificationStatus(req, res, next) {
		const { id } = req.params;
		const userReadResponse = await this.service.readOne({ _id: id });
		if (userReadResponse.error) return next(userReadResponse.errors);

		const userChangeVerificationResponse = await this.service.updateOne(
			{ _id: id },
			{ $set: { is_verified: !userReadResponse.data.is_verified } }
		);
		if (userChangeVerificationResponse.error) return next(userChangeVerificationResponse.errors);

		req.flash("success", `${userChangeVerificationResponse.data.account.name}'s verification status has been changed!`);
		res.redirect("back");
	}

	async getCompaniesByFirstLetter(req, res, next) {
		const { letter = "a", page = 1 } = req.query;
		const query = { role: "employer", "account.name": { $regex: letter, $options: "i" } };
		const options = {
			select: "email account.name account.picture account.picture_sm account.picture_md account.picture_lg slug",
			populate: [
				{ path: "account.picture account.picture_sm account.picture_md account.picture_lg" }
			],
			...req.query,
			page
		};
		const companiesByFirstLetterResponse = await this.service.readMany(query, options);
		if (companiesByFirstLetterResponse.error) return next(companiesByFirstLetterResponse.errors);


		if (!companiesByFirstLetterResponse.data.length && companiesByFirstLetterResponse.offset === undefined && companiesByFirstLetterResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${page}. But that dosen't exist. So i put you on page ${companiesByFirstLetterResponse.pages}.`);
			return res.status(companiesByFirstLetterResponse.statusCode).redirect(`/browse/companies?${qs.stringify(assignIn(req.query, qs.parse({ letter, page: companiesByFirstLetterResponse.pages })))}`);
		}

		res.render("companies-list", {
			page_title: "Browse Companies",
			...companiesByFirstLetterResponse,
			data: { companies: companiesByFirstLetterResponse.data },
			query: {
				...req.query,
				letter,
				page
			}
		});
	}

	async getFreelancers(req, res, next) {
		// TODO: adding functionality for sorting by stars rate.

		const {
			page = 1, hourly_rate, keywords, skills
		} = req.query;

		const query = {
			role: "freelancer",
			...(hourly_rate && { "profile.hourly_rate": { $gte: Number(hourly_rate.split(",")[0]), $lte: Number(hourly_rate.split(",")[1]) } }),
			...(keywords
				&& keywords.filter(Boolean).length
				&& {
					$or: [
						{ "account.name": { $regex: keywords.filter(Boolean).join("|") || "", $options: "i" } },
						{ "profile.description": { $regex: keywords.filter(Boolean).join("|") || "", $options: "i" } },
						{ "profile.tagline": { $regex: keywords.filter(Boolean).join("|") || "", $options: "i" } }
					]
				}),
			...(skills && skills.filter(Boolean).length && { "profile.skills": { $in: skills.filter(Boolean) } })
		};

		const options = {
			populate: [
				{ path: "profile.skills" },
				{ path: "profile.nationalities" }
			],
			limit: 6,
			...req.query,
			page
		};

		const freelancersResponse = await this.service.readMany(query, options);
		if (freelancersResponse.error) return next(freelancersResponse.errors);

		if (!freelancersResponse.data.length && freelancersResponse.offset === undefined && freelancersResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${page}. But that dosen't exist. So i put you on page ${freelancersResponse.pages}.`);
			return res.status(freelancersResponse.statusCode).redirect(`/browse/freelancers?${qs.stringify(assignIn(req.query, qs.parse({ page: freelancersResponse.pages })))}`);
		}

		const skillsResponse = await skillService.readMany({}, { sort: { users: -1 } });
		if (skillsResponse.error) return next(skillsResponse.errors);

		res.render("freelancers-list", {
			page_title: "Find A Freelancer",
			...freelancersResponse,
			data: {
				freelancers: freelancersResponse.data,
				skills: skillsResponse.data
			},
			query: {
				...req.query,
				page
			}
		});
	}
}

export default new UserController(userService);
