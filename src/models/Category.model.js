import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const CategorySchema = new mongoose.Schema({
	name: {
		ar: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true
		},
		en: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true
		}
	},
	description: {
		ar: { type: String, required: true, index: true },
		en: { type: String, required: true, index: true }
	},
	picture: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
	parent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
	children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
	icon: { type: mongoose.Schema.Types.ObjectId, ref: "Icon" },
	slug: {
		type: String,
		slug: "name.en",
		uniqueSlug: true,
		index: true,
		slugPaddingSize: 6
	},
	jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
CategorySchema.plugin(mongoosePagination);
CategorySchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Category = mongoose.model("Category", CategorySchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Category;
