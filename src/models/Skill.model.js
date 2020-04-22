import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const SkillSchema = new mongoose.Schema({
	name: {
		ar: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true
		},
		en: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true
		}
	},
	description: {
		ar: { type: String, required: true, index: true },
		en: { type: String, required: true, index: true }
	},
	slug: {
		type: String,
		slug: "name.en",
		uniqueSlug: true,
		index: true,
		slugPaddingSize: 6
	},
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});


//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
SkillSchema.plugin(mongoosePagination);
SkillSchema.plugin(slug);


//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Skill = mongoose.model("Skill", SkillSchema);


//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Skill;
