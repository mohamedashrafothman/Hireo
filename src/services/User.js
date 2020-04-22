import { isEmpty } from "lodash";
import to from "await-to-js";
import crypto from "crypto";
import Service from "../utilities/Service";

export default class UserService extends Service {
	constructor(model) {
		super(model);
		this.register = this.register.bind(this);
		this.verify = this.verify.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
		this.resetPassword = this.resetPassword.bind(this);
		this.logout = this.logout.bind(this);
		this.getSettingsUserData = this.getSettingsUserData.bind(this);
	}

	async register(body) {
		const existedUser = await this.readOne({ email: body.email });
		if (existedUser.error) return existedUser;
		if (!isEmpty(existedUser.data)) return { error: true, statusCode: 202, errors: ["Account with that email address already exists."] };

		const createdUser = await this.create(body);
		return createdUser;
	}

	async deserialize(_id) {
		const [userError, user] = await to(this.model
			.findOne({ _id })
			.populate("account.picture account.picture_sm account.picture_md account.picture_lg")
			.populate("profile.bookmarked.freelancer profile.bookmarked.employer")
			.populate({
				path: "profile.nationality"
			})
			.populate({
				path: "profile.skills"
			})
			.populate({
				path: "profile.attachments"
			}));
		if (userError) return { error: true, statusCode: 500, errors: userError };
		return { error: false, statusCode: 200, data: user };
	}

	async verify(params) {
		const existedUser = await this.readOne({ email: params.email, hash: params.hash, is_verified: { $lt: 1 } });
		if (existedUser.error) return existedUser;
		if (isEmpty(existedUser.data)) return { error: true, statusCode: 404, errors: ["Invalid approach, please use the link that has been send to your email."] };

		const updatedUser = await this.updateOne({ _id: existedUser.data._id }, { $set: { is_verified: 1, hash: null } });
		return updatedUser;
	}

	async forgotPassword(body) {
		const existedUser = await this.readOne({ email: body.email });
		if (existedUser.error) return existedUser;
		if (isEmpty(existedUser.data)) return { error: true, statusCode: 404, errors: ["No account found with this email."] };

		const updatedUser = await this.updateOne({ email: body.email }, {
			$set: {
				resetPasswordToken: crypto.randomBytes(16).toString("hex"),
				resetPasswordExpires: Date.now() + 1000 * 60 * 60 * process.env.PASSWORD_RESET_TIME_LIMIT_IN_HOURS
			}
		});
		return updatedUser;
	}

	async resetPassword(body, params) {
		const existedUser = await this.readOne({
			resetPasswordToken: params.token,
			resetPasswordExpires: { $gt: Date.now() }
		});
		if (existedUser.error) return existedUser;
		if (isEmpty(existedUser.data)) return { error: true, statusCode: 404, errors: ["Password reset token is invalid or has expired."] };

		existedUser.data.password = body.password;
		existedUser.data.resetPasswordToken = undefined;
		existedUser.data.resetPasswordExpires = undefined;

		const [savedUserError, savedUser] = await to(existedUser.data.save());
		if (savedUserError) return { error: true, statusCode: 500, errors: savedUserError };
		return { error: false, statusCode: 200, data: savedUser };
	}

	async logout(user) {
		const logedOutUser = await this.updateOne({ email: user.email, is_active: 1 }, { $set: { is_active: 0 } });
		return logedOutUser;
	}

	async getSettingsUserData(_id) {
		const [userError, user] = await to(this.model
			.findOne({ _id })
			.populate("account.picture account.picture_sm account.picture_md account.picture_lg")
			.populate({
				path: "profile.nationality"
			})
			.populate({
				path: "profile.skills"
			})
			.populate({
				path: "profile.attachments"
			})
			.select("account location email slug role profile"));
		if (userError) return { error: true, statusCode: 500, errors: userError };
		return { error: false, statusCode: 200, data: user };
	}

	async updatePassword(_id, body) {
		const user = await this.readOne({ _id });
		if (user.error) return user;
		if (isEmpty(user.data)) return { error: true, statusCode: 404, errors: ["No User Found!"] };

		user.data.password = body.password;

		const [savedUserError, savedUser] = await to(user.data.save());
		if (savedUserError) return { error: true, statusCode: 500, errors: savedUserError };
		return { error: false, statusCode: 200, data: savedUser };
	}

	async getUserBySlug(slug) {
		const [userErrors, user] = await to(
			this.model
				.findOne({ slug, role: { $ne: "admin" } })
				.populate({ path: "profile.skills" })
				.populate({ path: " profile.nationality" })
				.populate({ path: "profile.attachments" })
				.populate({
					path: "jobs",
					match: { status: { $nin: [2, 4] } },
					populate: { path: "type", select: "name" }
				})
		);
		if (userErrors) return { error: true, statusCode: 500, errors: userErrors };
		if (isEmpty(user)) return { error: true, statusCode: 404, errors: ["Not Found!"] };

		return { error: false, statusCode: 200, data: user };
	}

	async getBookmarked(_id) {
		const [userError, user] = await to(
			this.model
				.findOne({ _id })
				.select("_id bookmarked")
				.populate({
					path: "bookmarked.job",
					model: "Job",
					select: "slug title location.address created_at",
					populate: [
						{ path: "created_by", model: "User", select: "slug rating email account.name account.picture account.picture_sm account.picture_md account.picture_lg" },
						{ path: "type", model: "job_type", select: "name -_id" }
					]
				})
				.populate({
					path: "bookmarked.freelancer",
					model: "User",
					select: "is_verified rating slug email account.picture account.picture_sm account.picture_md account.picture_lg account.name profile.tagline",
					populate: { path: "profile.nationality", model: "Nationality", select: "-_id code name" }
				})
				.populate({
					path: "bookmarked.employer",
					model: "User",
					select: "is_verified rating slug email account.picture account.picture_sm account.picture_md account.picture_lg account.name profile.tagline",
					populate: { path: "profile.nationality", model: "Nationality", select: "-_id code name" }
				})
		);

		if (userError) return { error: true, statusCode: 500, errors: userError };
		return { error: false, statusCode: 200, data: user };
	}
}
