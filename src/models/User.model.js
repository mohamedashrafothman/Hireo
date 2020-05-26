import slug from "mongoose-slug-updater";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import validator from "validator";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const UserSchema = new mongoose.Schema({
	password: { type: String },
	hash: { type: String },
	is_active: { type: Boolean, default: false },
	is_verified: { type: Boolean, default: false },
	slug: {
		type: String,
		slug: "account.name",
		uniqueSlug: true,
		index: true,
		slugPaddingSize: 6
	},
	email: {
		type: String,
		unique: true,
		index: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, "Invalid Email Address"]
	},
	account: {
		name: {
			type: String,
			trim: true,
			index: true
		},
		username: {
			type: String,
			trim: true,
			unique: true,
			index: true
		},
		gender: String,
		website: String,
		picture: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
		picture_sm: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
		picture_md: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
		picture_lg: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }
	},
	profile: {
		skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill", index: true }],
		nationality: { type: mongoose.Schema.Types.ObjectId, ref: "Nationality" },
		hourly_rate: {
			type: Number,
			default: 5,
			min: 5,
			max: 300,
			index: true
		},
		tagline: {
			type: String,
			validate: [(val) => val.length <= 100, "{PATH} exceeds the limit of 100 letter."],
			index: true
		},
		description: {
			type: String,
			validate: [(val) => val.length <= 500, "{PATH} exceeds the limit of 500 letter."]
		},
		social_accounts: {
			dribbble: { type: String, trim: true },
			twitter: { type: String, trim: true },
			behance: { type: String, trim: true },
			github: { type: String, trim: true }
		},
		attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }]
	},
	bookmarked: {
		freelancer: [{ type: mongoose.Schema.Types.ObjectId, ref: this }],
		employer: [{ type: mongoose.Schema.Types.ObjectId, ref: this }],
		job: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
	},
	jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
	applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
	google: String,
	facebook: String,
	tokens: Array,
	resetPasswordToken: { type: String, default: undefined },
	resetPasswordExpires: { type: Date, default: undefined },
	role: { type: String, default: "freelancer" }
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA HOOKS ───────────────────────────────────────────────────────────────
//
UserSchema.pre("save", function (next) {
	const user = this;
	// skip it stop this function from running
	if (!user.isModified("password")) return next();
	bcrypt.genSalt(Number(process.env.PASSWORD_HASH_ROUNDS), (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, async (err2, hash) => {
			if (err2) return next(err2);
			const RandomBytes = await crypto.randomBytes(16).toString("hex");
			user.password = hash;
			user.hash = RandomBytes;
			next();
		});
	});
});

//
// ─── SCHEMA METHODS ─────────────────────────────────────────────────────────────
//
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.methods.gravatar = function (size, user) {
	if (!size) size = 200; // default size.
	if (!user) user = this.email; // default email is this schema email.
	const md5 = crypto
		.createHash("md5")
		.update(user)
		.digest("hex");
	return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

//
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//
UserSchema.plugin(mongoosePagination);
UserSchema.plugin(slug);

//
// ─── SCHEMA model ───────────────────────────────────────────────────────────────
//
const User = mongoose.model("User", UserSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default User;
