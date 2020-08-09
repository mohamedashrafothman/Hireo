import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

import User from "./User.model";

import SkillService from "../services/Skill";
import UserService from "../services/User";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const SkillSchema = new mongoose.Schema(
	{
		name: {
			ar: {
				type: String,
				required: true,
				unique: true,
				index: true,
				trim: true,
			},
			en: {
				type: String,
				required: true,
				unique: true,
				index: true,
				trim: true,
			},
		},
		description: {
			ar: { type: String, required: true, index: true },
			en: { type: String, required: true, index: true },
		},
		slug: {
			type: String,
			slug: "name.en",
			uniqueSlug: true,
			index: true,
			slugPaddingSize: 6,
		},
		users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

//
// ─── SCHEMA PLUGIN AND HOOKS ────────────────────────────────────────────────────
//
async function preDeleteOneMethod(next) {
	const skillService = new SkillService(this.model);
	const userService = new UserService(User);

	const skillReadResponse = await skillService.readOne(this.getQuery());
	if (skillReadResponse.error) return next(skillReadResponse.errors);

	if (skillReadResponse?.data?.users?.length) {
		const updateUserResponse = await userService.updateMany(
			{ "profile.skills": skillReadResponse.data._id },
			{ $pull: { "profile.skills": skillReadResponse.data._id } }
		);
		if (updateUserResponse.error) return next(updateUserResponse.errors);
	}

	next();
}

SkillSchema.plugin(mongoosePagination);
SkillSchema.plugin(slug);
SkillSchema.pre("deleteOne", preDeleteOneMethod);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Skill = mongoose.model("Skill", SkillSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Skill;
