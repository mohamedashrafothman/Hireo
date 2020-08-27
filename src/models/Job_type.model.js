import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const JobTypeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			index: true,
			required: "Job Type name is required",
		},
		slug: {
			type: String,
			slug: "name",
			uniqueSlug: true,
			index: true,
			slugPaddingSize: 6,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
JobTypeSchema.plugin(mongoosePagination);
JobTypeSchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const job_type = mongoose.model("job_type", JobTypeSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default job_type;
